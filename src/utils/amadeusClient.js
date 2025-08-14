import Amadeus from "amadeus";
import dotenv from "dotenv";
import NodeCache from "node-cache";
import pLimit from "p-limit";
import pRetry from "p-retry";

dotenv.config();

const cacheTTL = Number(process.env.CACHE_TTL_MINUTES || 5) * 60;
const cache = new NodeCache({ stdTTL: cacheTTL });

const limit = pLimit(Number(process.env.RATE_LIMIT_REQUESTS || 5));

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET
});

async function fetchWithCache(key, fetchFn) {
  const cached = cache.get(key);
  if (cached) {
    console.log(`Cache hit for ${key}`);
    return cached;
  }
  console.log(`Cache miss for ${key}`);

  const result = await pRetry(() => limit(() => fetchFn()), {
    retries: Number(process.env.MAX_RETRIES || 3),
    onFailedAttempt: (err) => {
      console.warn(`Retrying ${key} due to: ${err.message}`);
    }
  });

  cache.set(key, result);
  return result;
}

export { amadeus, fetchWithCache };
