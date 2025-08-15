import dotenv from "dotenv";
import Amadeus from "amadeus";

dotenv.config();

console.log("=== Amadeus API Diagnostic ===");
console.log("Environment variables:");
console.log("AMADEUS_API_KEY:", process.env.AMADEUS_API_KEY ? "✓ Set" : "✗ Missing");
console.log("AMADEUS_API_SECRET:", process.env.AMADEUS_API_SECRET ? "✓ Set" : "✗ Missing");
console.log("AMADEUS_HOSTNAME:", process.env.AMADEUS_HOSTNAME || "test (default)");

if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
  console.error("\n Missing API credentials!");
  console.log("Please create a .env file with:");
  console.log("AMADEUS_API_KEY=your_api_key_here");
  console.log("AMADEUS_API_SECRET=your_api_secret_here");
  process.exit(1);
}

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
  hostname: process.env.AMADEUS_HOSTNAME || 'test'
});

console.log("\n=== Testing API Connection ===");

async function testConnection() {
  try {
    console.log("Testing with airline lookup (simple API call)...");
    const response = await amadeus.referenceData.airlines.get({
      airlineCodes: 'AA'
    });
    
    console.log("✓ Connection successful!");
    console.log("Sample response:", JSON.stringify(response.data[0], null, 2));
    
    console.log("\n=== Testing Flight Search ===");
    console.log("Testing flight search JFK -> LAX...");
    
    // Use a future date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7); // 7 days from now
    const futureDate = tomorrow.toISOString().split('T')[0];
    
    console.log(`Using date: ${futureDate}`);
    
    const flightResponse = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: 'JFK',
      destinationLocationCode: 'LAX',
      departureDate: futureDate,
      adults: 1
    });
    
    console.log("✓ Flight search successful!");
    console.log(`Found ${flightResponse.data.length} flight offers`);
    if (flightResponse.data.length > 0) {
      console.log("First offer summary:", {
        price: flightResponse.data[0].price,
        segments: flightResponse.data[0].itineraries[0].segments.length
      });
    }
    
  } catch (error) {
    console.error("API Error:");
    
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Status Text:", error.response.statusText);
      console.error("Headers:", JSON.stringify(error.response.headers, null, 2));
      
      if (error.response.body) {
        console.error("Response Body:", JSON.stringify(error.response.body, null, 2));
      }
    } else if (error.request) {
      console.error("Network Error - No response received");
      console.error("Request details:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    
    console.log("\n=== Troubleshooting ===");
    console.log("1. Check if your API credentials are valid");
    console.log("2. Ensure you're using test environment credentials for 'test' hostname");
    console.log("3. Verify your Amadeus account has the required APIs enabled");
    console.log("4. Check if you've exceeded rate limits");
  }
}

testConnection();