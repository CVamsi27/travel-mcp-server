import dotenv from "dotenv";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import all tools from flights module
import {
  searchFlights,
  getCheapestFlightDate,
  getFlightInspiration,
  getFlightOffersPrice,
  searchFlightAvailabilities,
  getFlightBusiestPeriod,
  getFlightMostBookedDestinations,
  getFlightMostTraveledDestinations,
  getFlightPriceAnalysis,
  getFlightChoicePrediction,
  getFlightDelayPrediction,
  getFlightStatus,
  getFlightCheckinLinks,
  getSeatMap,
  createFlightOrder,
  getFlightOrder,
  deleteFlightOrder,
  getBrandedFares
} from "./tools/flights.js";

// Import all tools from hotels module
import {
  searchHotelsByCity,
  getHotelDetails,
  searchHotelsByLocation,
  searchHotels,
  getHotelList,
  getHotelNameAutocomplete,
  getHotelRatings,
  bookHotel
} from "./tools/hotels.js";

// Import all tools from airports module
import {
  searchAirportsAndCities,
  getNearestRelevantAirports,
  getAirportOnTimePerformance,
  getAirportRoutes,
  lookupAirlineCode,
  getAirlineRoutes,
  searchCities
} from "./tools/airports.js";

// Import all tools from travel module
import {
  searchTransfers,
  bookTransfer,
  cancelTransfer,
  searchToursAndActivities,
  getActivityDetails,
  getPointsOfInterest,
  getPointOfInterestDetails,
  getLocationScore,
  getTravelRecommendations,
  getTravelRestrictions,
  parseTripData,
  predictTripPurpose
} from "./tools/travel.js";

dotenv.config();

const server = new McpServer({ name: "travel-mcp-server", version: "1.0.0" });

const tools = [
  // Flight Tools
  {
    name: "searchFlights",
    title: "Search Flights",
    description: "Get flight offers between two locations",
    inputSchema: {
      type: "object",
      properties: {
        origin: { type: "string", description: "Origin airport IATA code" },
        destination: { type: "string", description: "Destination airport IATA code" },
        departureDate: { type: "string", description: "Departure date (YYYY-MM-DD)" },
        returnDate: { type: "string", description: "Return date for round trip (YYYY-MM-DD)" },
        adults: { type: "number", description: "Number of adult passengers", default: 1 }
      },
      required: ["origin", "destination", "departureDate"]
    },
    handler: searchFlights,
  },
  {
    name: "getCheapestFlightDate",
    title: "Get Cheapest Flight Date",
    description: "Find the cheapest dates to fly between two locations",
    inputSchema: {
      type: "object",
      properties: {
        origin: { type: "string", description: "Origin airport IATA code" },
        destination: { type: "string", description: "Destination airport IATA code" }
      },
      required: ["origin", "destination"]
    },
    handler: getCheapestFlightDate,
  },
  {
    name: "getFlightInspiration",
    title: "Get Flight Inspiration",
    description: "Get destination inspiration from an origin",
    inputSchema: {
      type: "object",
      properties: {
        origin: { type: "string", description: "Origin airport IATA code" }
      },
      required: ["origin"]
    },
    handler: getFlightInspiration,
  },
  {
    name: "getFlightOffersPrice",
    title: "Price Flight Offers",
    description: "Get detailed pricing for flight offers",
    inputSchema: {
      type: "object",
      properties: {
        flightOffers: { type: "array", description: "Array of flight offers to price" }
      },
      required: ["flightOffers"]
    },
    handler: getFlightOffersPrice,
  },
  {
    name: "searchFlightAvailabilities",
    title: "Search Flight Availabilities",
    description: "Search for flight availabilities",
    inputSchema: {
      type: "object",
      properties: {
        originDestinations: { type: "array", description: "Origin-destination pairs" },
        travelers: { type: "array", description: "Traveler information" },
        sources: { type: "array", description: "Search sources" }
      },
      required: ["originDestinations", "travelers", "sources"]
    },
    handler: searchFlightAvailabilities,
  },
  {
    name: "getFlightBusiestPeriod",
    title: "Get Flight Busiest Period",
    description: "Get the busiest travel period for a city",
    inputSchema: {
      type: "object",
      properties: {
        cityCode: { type: "string", description: "City IATA code" },
        period: { type: "string", description: "Period (YYYY-MM)" }
      },
      required: ["cityCode", "period"]
    },
    handler: getFlightBusiestPeriod,
  },
  {
    name: "getFlightMostBookedDestinations",
    title: "Get Most Booked Destinations",
    description: "Get most booked destinations from origin",
    inputSchema: {
      type: "object",
      properties: {
        originCityCode: { type: "string", description: "Origin city IATA code" },
        period: { type: "string", description: "Period (YYYY-MM)" }
      },
      required: ["originCityCode", "period"]
    },
    handler: getFlightMostBookedDestinations,
  },
  {
    name: "getFlightMostTraveledDestinations",
    title: "Get Most Traveled Destinations",
    description: "Get most traveled destinations from origin",
    inputSchema: {
      type: "object",
      properties: {
        originCityCode: { type: "string", description: "Origin city IATA code" },
        period: { type: "string", description: "Period (YYYY-MM)" }
      },
      required: ["originCityCode", "period"]
    },
    handler: getFlightMostTraveledDestinations,
  },
  {
    name: "getFlightPriceAnalysis",
    title: "Get Flight Price Analysis",
    description: "Get price analysis for a route",
    inputSchema: {
      type: "object",
      properties: {
        originIataCode: { type: "string", description: "Origin IATA code" },
        destinationIataCode: { type: "string", description: "Destination IATA code" },
        departureDate: { type: "string", description: "Departure date (YYYY-MM-DD)" }
      },
      required: ["originIataCode", "destinationIataCode", "departureDate"]
    },
    handler: getFlightPriceAnalysis,
  },
  {
    name: "getFlightChoicePrediction",
    title: "Get Flight Choice Prediction",
    description: "Predict which flight offer will be chosen",
    inputSchema: {
      type: "object",
      properties: {
        flightOffers: { type: "array", description: "Array of flight offers" }
      },
      required: ["flightOffers"]
    },
    handler: getFlightChoicePrediction,
  },
  {
    name: "getFlightDelayPrediction",
    title: "Get Flight Delay Prediction",
    description: "Predict flight delay probability",
    inputSchema: {
      type: "object",
      properties: {
        originLocationCode: { type: "string", description: "Origin airport code" },
        destinationLocationCode: { type: "string", description: "Destination airport code" },
        departureDate: { type: "string", description: "Departure date" },
        departureTime: { type: "string", description: "Departure time" },
        arrivalDate: { type: "string", description: "Arrival date" },
        arrivalTime: { type: "string", description: "Arrival time" },
        aircraftCode: { type: "string", description: "Aircraft code" },
        carrierCode: { type: "string", description: "Carrier code" },
        flightNumber: { type: "string", description: "Flight number" },
        duration: { type: "string", description: "Flight duration" }
      },
      required: ["originLocationCode", "destinationLocationCode", "departureDate", "departureTime", "arrivalDate", "arrivalTime", "aircraftCode", "carrierCode", "flightNumber", "duration"]
    },
    handler: getFlightDelayPrediction,
  },
  {
    name: "getFlightStatus",
    title: "Get Flight Status",
    description: "Get real-time flight status",
    inputSchema: {
      type: "object",
      properties: {
        carrierCode: { type: "string", description: "Airline carrier code" },
        flightNumber: { type: "string", description: "Flight number" },
        scheduledDepartureDate: { type: "string", description: "Scheduled departure date" }
      },
      required: ["carrierCode", "flightNumber", "scheduledDepartureDate"]
    },
    handler: getFlightStatus,
  },
  {
    name: "getFlightCheckinLinks",
    title: "Get Flight Check-in Links",
    description: "Get airline check-in URLs",
    inputSchema: {
      type: "object",
      properties: {
        airlineCode: { type: "string", description: "Airline IATA code" }
      },
      required: ["airlineCode"]
    },
    handler: getFlightCheckinLinks,
  },
  {
    name: "getSeatMap",
    title: "Get Seat Map",
    description: "Get aircraft seat map",
    inputSchema: {
      type: "object",
      properties: {
        flightOrderId: { type: "string", description: "Flight order ID" }
      },
      required: ["flightOrderId"]
    },
    handler: getSeatMap,
  },
  {
    name: "getBrandedFares",
    title: "Get Branded Fares",
    description: "Get branded fare options",
    inputSchema: {
      type: "object",
      properties: {
        flightOffers: { type: "array", description: "Flight offers to get branded fares for" }
      },
      required: ["flightOffers"]
    },
    handler: getBrandedFares,
  },

  // Hotel Tools
  {
    name: "searchHotelsByCity",
    title: "Search Hotels by City",
    description: "Search for hotels in a specific city",
    inputSchema: {
      type: "object",
      properties: {
        cityCode: { type: "string", description: "City IATA code" },
        checkInDate: { type: "string", description: "Check-in date (YYYY-MM-DD)" },
        checkOutDate: { type: "string", description: "Check-out date (YYYY-MM-DD)" },
        adults: { type: "number", description: "Number of adult guests", default: 1 }
      },
      required: ["cityCode", "checkInDate", "checkOutDate"]
    },
    handler: searchHotelsByCity,
  },
  {
    name: "getHotelDetails",
    title: "Get Hotel Details",
    description: "Get detailed information about a specific hotel",
    inputSchema: {
      type: "object",
      properties: {
        hotelId: { type: "string", description: "Hotel ID" },
        checkInDate: { type: "string", description: "Check-in date (YYYY-MM-DD)" },
        checkOutDate: { type: "string", description: "Check-out date (YYYY-MM-DD)" },
        adults: { type: "number", description: "Number of adult guests", default: 1 }
      },
      required: ["hotelId", "checkInDate", "checkOutDate"]
    },
    handler: getHotelDetails,
  },
  {
    name: "searchHotelsByLocation",
    title: "Search Hotels by Location",
    description: "Search for hotels near a specific location",
    inputSchema: {
      type: "object",
      properties: {
        latitude: { type: "number", description: "Latitude coordinate" },
        longitude: { type: "number", description: "Longitude coordinate" },
        radius: { type: "number", description: "Search radius in km", default: 5 }
      },
      required: ["latitude", "longitude"]
    },
    handler: searchHotelsByLocation,
  },
  {
    name: "searchHotels",
    title: "Search Hotels",
    description: "General hotel search with various filters",
    inputSchema: {
      type: "object",
      properties: {
        keyword: { type: "string", description: "Hotel name or keyword" },
        subType: { type: "string", description: "Location subtype" },
        countryCode: { type: "string", description: "Country code" },
        stateCode: { type: "string", description: "State code" },
        cityCode: { type: "string", description: "City code" },
        hotelSource: { type: "string", description: "Hotel data source" }
      },
      required: ["keyword"]
    },
    handler: searchHotels,
  },
  {
    name: "getHotelList",
    title: "Get Hotel List",
    description: "Get list of hotels with filtering options",
    inputSchema: {
      type: "object",
      properties: {
        chainCodes: { type: "string", description: "Hotel chain codes" },
        amenities: { type: "string", description: "Required amenities" },
        ratings: { type: "string", description: "Hotel ratings" },
        hotelSource: { type: "string", description: "Hotel data source" }
      }
    },
    handler: getHotelList,
  },
  {
    name: "getHotelNameAutocomplete",
    title: "Get Hotel Name Autocomplete",
    description: "Get hotel name suggestions for autocomplete",
    inputSchema: {
      type: "object",
      properties: {
        keyword: { type: "string", description: "Hotel name keyword" },
        subType: { type: "string", description: "Location subtype" },
        countryCode: { type: "string", description: "Country code" },
        lang: { type: "string", description: "Language code" }
      },
      required: ["keyword"]
    },
    handler: getHotelNameAutocomplete,
  },
  {
    name: "getHotelRatings",
    title: "Get Hotel Ratings",
    description: "Get hotel ratings and sentiment analysis",
    inputSchema: {
      type: "object",
      properties: {
        hotelIds: { type: "string", description: "Comma-separated hotel IDs" }
      },
      required: ["hotelIds"]
    },
    handler: getHotelRatings,
  },

  // Airport & Airline Tools
  {
    name: "searchAirportsAndCities",
    title: "Search Airports and Cities",
    description: "Search for airports and cities",
    inputSchema: {
      type: "object",
      properties: {
        keyword: { type: "string", description: "Search keyword" },
        subType: { type: "string", description: "Location subtype (AIRPORT,CITY)" },
        countryCode: { type: "string", description: "Country code" },
        pageLimit: { type: "number", description: "Page limit" },
        pageOffset: { type: "number", description: "Page offset" },
        sort: { type: "string", description: "Sort order" },
        view: { type: "string", description: "View type" }
      },
      required: ["keyword"]
    },
    handler: searchAirportsAndCities,
  },
  {
    name: "getNearestRelevantAirports",
    title: "Get Nearest Relevant Airports",
    description: "Find nearest airports to a location",
    inputSchema: {
      type: "object",
      properties: {
        latitude: { type: "number", description: "Latitude coordinate" },
        longitude: { type: "number", description: "Longitude coordinate" },
        radius: { type: "number", description: "Search radius in km" },
        pageLimit: { type: "number", description: "Page limit" },
        pageOffset: { type: "number", description: "Page offset" },
        sort: { type: "string", description: "Sort order" },
        view: { type: "string", description: "View type" }
      },
      required: ["latitude", "longitude"]
    },
    handler: getNearestRelevantAirports,
  },
  {
    name: "getAirportOnTimePerformance",
    title: "Get Airport On-Time Performance",
    description: "Get airport on-time performance metrics",
    inputSchema: {
      type: "object",
      properties: {
        airportCode: { type: "string", description: "Airport IATA code" }
      },
      required: ["airportCode"]
    },
    handler: getAirportOnTimePerformance,
  },
  {
    name: "getAirportRoutes",
    title: "Get Airport Routes",
    description: "Get routes served by an airport",
    inputSchema: {
      type: "object",
      properties: {
        airportCode: { type: "string", description: "Airport IATA code" },
        maxDailyFlights: { type: "number", description: "Maximum daily flights" },
        minServiceLevel: { type: "number", description: "Minimum service level" },
        pageLimit: { type: "number", description: "Page limit" },
        pageOffset: { type: "number", description: "Page offset" }
      },
      required: ["airportCode"]
    },
    handler: getAirportRoutes,
  },
  {
    name: "lookupAirlineCode",
    title: "Lookup Airline Code",
    description: "Get airline information by code",
    inputSchema: {
      type: "object",
      properties: {
        airlineCodes: { type: "string", description: "Comma-separated airline codes" }
      },
      required: ["airlineCodes"]
    },
    handler: lookupAirlineCode,
  },
  {
    name: "getAirlineRoutes",
    title: "Get Airline Routes",
    description: "Get routes served by an airline",
    inputSchema: {
      type: "object",
      properties: {
        airlineCode: { type: "string", description: "Airline IATA code" },
        maxDailyFlights: { type: "number", description: "Maximum daily flights" },
        minServiceLevel: { type: "number", description: "Minimum service level" },
        pageLimit: { type: "number", description: "Page limit" },
        pageOffset: { type: "number", description: "Page offset" }
      },
      required: ["airlineCode"]
    },
    handler: getAirlineRoutes,
  },
  {
    name: "searchCities",
    title: "Search Cities",
    description: "Search for cities",
    inputSchema: {
      type: "object",
      properties: {
        keyword: { type: "string", description: "City name keyword" },
        countryCode: { type: "string", description: "Country code" },
        maxNumberOfItems: { type: "number", description: "Maximum number of items" },
        include: { type: "string", description: "Additional data to include" }
      },
      required: ["keyword"]
    },
    handler: searchCities,
  },

  // Travel Services Tools
  {
    name: "searchTransfers",
    title: "Search Transfers",
    description: "Search for ground transfer options",
    inputSchema: {
      type: "object",
      properties: {
        startLocationCode: { type: "string", description: "Start location code" },
        endLocationCode: { type: "string", description: "End location code" },
        transferType: { type: "string", description: "Transfer type (PRIVATE, TAXI, etc.)" },
        startDateTime: { type: "string", description: "Start date and time" },
        startAddressLine: { type: "string", description: "Start address" },
        startCountryCode: { type: "string", description: "Start country code" },
        endAddressLine: { type: "string", description: "End address" },
        endCountryCode: { type: "string", description: "End country code" },
        transferDuration: { type: "string", description: "Transfer duration" },
        passengers: { type: "number", description: "Number of passengers" }
      },
      required: ["startLocationCode", "endLocationCode", "transferType", "startDateTime"]
    },
    handler: searchTransfers,
  },
  {
    name: "searchToursAndActivities",
    title: "Search Tours and Activities",
    description: "Search for local tours and activities",
    inputSchema: {
      type: "object",
      properties: {
        latitude: { type: "number", description: "Latitude coordinate" },
        longitude: { type: "number", description: "Longitude coordinate" },
        radius: { type: "number", description: "Search radius in km", default: 1 }
      },
      required: ["latitude", "longitude"]
    },
    handler: searchToursAndActivities,
  },
  {
    name: "getActivityDetails",
    title: "Get Activity Details",
    description: "Get detailed information about a specific activity",
    inputSchema: {
      type: "object",
      properties: {
        activityId: { type: "string", description: "Activity ID" }
      },
      required: ["activityId"]
    },
    handler: getActivityDetails,
  },
  {
    name: "getPointsOfInterest",
    title: "Get Points of Interest",
    description: "Get points of interest near a location",
    inputSchema: {
      type: "object",
      properties: {
        latitude: { type: "number", description: "Latitude coordinate" },
        longitude: { type: "number", description: "Longitude coordinate" },
        radius: { type: "number", description: "Search radius in km", default: 1 },
        categories: { type: "string", description: "POI categories (SIGHTS,RESTAURANT,etc.)" }
      },
      required: ["latitude", "longitude"]
    },
    handler: getPointsOfInterest,
  },
  {
    name: "getPointOfInterestDetails",
    title: "Get Point of Interest Details",
    description: "Get detailed information about a specific POI",
    inputSchema: {
      type: "object",
      properties: {
        poiId: { type: "string", description: "Point of Interest ID" }
      },
      required: ["poiId"]
    },
    handler: getPointOfInterestDetails,
  },
  {
    name: "getLocationScore",
    title: "Get Location Score",
    description: "Get location scoring and analytics",
    inputSchema: {
      type: "object",
      properties: {
        latitude: { type: "number", description: "Latitude coordinate" },
        longitude: { type: "number", description: "Longitude coordinate" }
      },
      required: ["latitude", "longitude"]
    },
    handler: getLocationScore,
  },
  {
    name: "getTravelRecommendations",
    title: "Get Travel Recommendations",
    description: "Get destination recommendations",
    inputSchema: {
      type: "object",
      properties: {
        cityCodes: { type: "string", description: "Comma-separated city codes" },
        travelerCountryCode: { type: "string", description: "Traveler country code" },
        destinationCountryCode: { type: "string", description: "Destination country code" }
      },
      required: ["cityCodes"]
    },
    handler: getTravelRecommendations,
  },
  {
    name: "getTravelRestrictions",
    title: "Get Travel Restrictions",
    description: "Get travel restrictions and requirements",
    inputSchema: {
      type: "object",
      properties: {
        originIataCode: { type: "string", description: "Origin country code" },
        destinationIataCode: { type: "string", description: "Destination country code" }
      },
      required: ["originIataCode", "destinationIataCode"]
    },
    handler: getTravelRestrictions,
  },
  {
    name: "parseTripData",
    title: "Parse Trip Data",
    description: "Parse travel documents and extract trip information",
    inputSchema: {
      type: "object",
      properties: {
        payload: { type: "object", description: "Document payload to parse" }
      },
      required: ["payload"]
    },
    handler: parseTripData,
  },
  {
    name: "predictTripPurpose",
    title: "Predict Trip Purpose",
    description: "Predict the purpose of a trip",
    inputSchema: {
      type: "object",
      properties: {
        searchMetaData: { type: "object", description: "Search metadata including origin, destination, dates" },
        flightOffers: { type: "array", description: "Flight offers data" }
      },
      required: ["searchMetaData"]
    },
    handler: predictTripPurpose,
  }
];

// Register all tools with the MCP server
for (const tool of tools) {
  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
    },
    async (input) => {
      try {
        console.log(`Executing ${tool.name} with params:`, JSON.stringify(input, null, 2));
        const result = await tool.handler(input);
        return { content: [{ type: "json", text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        console.error(`Error in ${tool.name}:`, err);
        const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
        return { content: [{ type: "text", text: `Error: ${errorMessage}` }] };
      }
    }
  );
}

const transport = new StdioServerTransport();
await server.connect(transport);

// CLI interface that preserves /mcp commands
process.stdin.on("data", async (data) => {
  const input = data.toString().trim();
  console.log("Received input:", input);

  // Check if input starts with /mcp
  if (!input.startsWith("/mcp ")) {
    console.error("Commands must start with '/mcp'. Example: /mcp searchFlights origin=NYC destination=LAX departureDate=2024-12-15");
    return;
  }

  const command = input.slice(5); // Remove '/mcp ' prefix
  const matchJson = command.match(/^(\w+)\s+(\{.*\})$/);
  const matchKV = command.match(/^(\w+)\s+(.+)$/);
  const matchNoParams = command.match(/^(\w+)$/);

  let toolName, params;

  if (matchJson) {
    // JSON format: /mcp toolName {"key": "value"}
    toolName = matchJson[1];
    try {
      params = JSON.parse(matchJson[2]);
    } catch {
      console.error("Invalid JSON input");
      return;
    }
  } else if (matchKV) {
    // Key-value format: /mcp toolName key1=value1 key2=value2
    toolName = matchKV[1];
    params = {};
    matchKV[2].split(/\s+/).forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key && value) {
        // Try to parse numbers
        if (!isNaN(value) && !isNaN(parseFloat(value))) {
          params[key] = parseFloat(value);
        } else {
          params[key] = value;
        }
      }
    });
  } else if (matchNoParams) {
    // No parameters: /mcp toolName
    toolName = matchNoParams[1];
    params = {};
  } else {
    console.error("Unrecognized command format. Use: /mcp toolName key=value or /mcp toolName {\"key\": \"value\"}");
    return;
  }

  const tool = tools.find((t) => t.name === toolName);
  if (!tool) {
    console.error(`Tool '${toolName}' not found. Available tools:`);
    tools.forEach(t => console.log(`  - ${t.name}: ${t.description}`));
    return;
  }

  try {
    console.log(`Executing ${toolName} with params:`, JSON.stringify(params, null, 2));
    const result = await tool.handler(params);
    console.log(`Success! Result for ${toolName}:`);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(`Error executing ${toolName}:`, err);
    const errorMessage = err instanceof Error ? err.message : `Non-standard error: ${JSON.stringify(err)}`;
    console.error(`Error details: ${errorMessage}`);
  }
});

console.log("Travel MCP Server started. Use /mcp commands to interact.");
console.log("Examples:");
console.log("  /mcp searchFlights origin=NYC destination=LAX departureDate=2024-12-15");
console.log("  /mcp searchHotelsByCity cityCode=PAR checkInDate=2024-12-15 checkOutDate=2024-12-18");
console.log("  /mcp getNearestRelevantAirports latitude=40.7589 longitude=-73.9851");
console.log("  /mcp getPointsOfInterest latitude=48.8566 longitude=2.3522 radius=2");