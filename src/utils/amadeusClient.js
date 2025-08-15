import Amadeus from "amadeus";
import dotenv from "dotenv";
import NodeCache from "node-cache";
import pLimit from "p-limit";
import pRetry from "p-retry";

dotenv.config();

// Configuration from environment variables
const cacheTTL = Number(process.env.CACHE_TTL_MINUTES || 5) * 60;
const cache = new NodeCache({ stdTTL: cacheTTL });

// Rate limiting configuration
const limit = pLimit(Number(process.env.RATE_LIMIT_REQUESTS || 5));

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
  hostname: process.env.AMADEUS_HOSTNAME || 'test' // 'test' or 'production'
});

/**
 * Fetch data with caching and retry logic
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function to fetch data
 * @returns {Promise} - Cached or fresh data
 */
async function fetchWithCache(key, fetchFn) {
  // Check cache first
  const cached = cache.get(key);
  if (cached) {
    console.log(`Cache hit for ${key}`);
    return cached;
  }
  
  console.log(`Cache miss for ${key} - fetching from API`);

  try {
    // Fetch with rate limiting and retry logic
    const result = await pRetry(
      async () => {
        try {
          const response = await limit(() => fetchFn());
          
          // Check if response has error structure
          if (response && response.errors && Array.isArray(response.errors)) {
            const errorMsg = response.errors.map(err => 
              `${err.title || 'API Error'}: ${err.detail || err.code || 'Unknown error'}`
            ).join('; ');
            throw new Error(errorMsg);
          }
          
          // Check for other error patterns
          if (response && response.error) {
            throw new Error(response.error.message || response.error.description || 'API Error');
          }
          
          return response;
        } catch (error) {
          // Handle Amadeus SDK errors
          if (error.response) {
            const errorMsg = error.response.statusText || `HTTP ${error.response.status}`;
            const details = error.response.body ? JSON.stringify(error.response.body) : '';
            throw new Error(`${errorMsg}${details ? ': ' + details : ''}`);
          }
          
          // Handle network or other errors
          if (error.message) {
            throw new Error(error.message);
          }
          
          // Handle non-standard errors
          throw new Error(`Unexpected error: ${JSON.stringify(error)}`);
        }
      },
      {
        retries: Number(process.env.MAX_RETRIES || 3),
        factor: 2, // Exponential backoff
        minTimeout: 1000, // 1 second
        maxTimeout: 10000, // 10 seconds
        onFailedAttempt: (err) => {
          console.warn(`Retrying ${key} due to: ${err.message} (attempt ${err.attemptNumber})`);
        }
      }
    );

    // Cache the result only if successful
    cache.set(key, result);
    console.log(`Cached result for ${key}`);
    
    return result;
  } catch (error) {
    // Ensure we always throw a proper Error object
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`API call failed: ${JSON.stringify(error)}`);
    }
  }
}

/**
 * Get cache statistics
 * @returns {object} Cache stats
 */
function getCacheStats() {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
    vsize: cache.getStats().vsize
  };
}

/**
 * Clear cache (useful for testing or manual refresh)
 * @param {string} pattern - Optional pattern to match keys
 */
function clearCache(pattern = null) {
  if (pattern) {
    const keys = cache.keys().filter(key => key.includes(pattern));
    cache.del(keys);
    console.log(`Cleared ${keys.length} cache entries matching pattern: ${pattern}`);
  } else {
    cache.flushAll();
    console.log("Cleared all cache entries");
  }
}

/**
 * Set cache TTL dynamically
 * @param {number} minutes - TTL in minutes
 */
function setCacheTTL(minutes) {
  cache.options.stdTTL = minutes * 60;
  console.log(`Cache TTL set to ${minutes} minutes`);
}

export { 
  amadeus, 
  fetchWithCache, 
  getCacheStats, 
  clearCache, 
  setCacheTTL 
};