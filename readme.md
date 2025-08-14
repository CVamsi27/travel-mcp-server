# Travel MCP Server (Amadeus API)

An **MCP (Model Context Protocol)** server for **Amadeus travel APIs**, providing flight, hotel, airport, and tourism data directly to **Copilot Chat** or CLI.

## Features
- Flight offers search
- Hotel offers & booking
- Airline, airport, city lookup
- Flight delay prediction
- Tours & activities
- And 30+ more Amadeus endpoints

## Installation

```bash
git clone https://github.com/yourusername/travel-mcp-server.git
cd travel-mcp-server
pnpm install
pnpm dev
```

## Example 

Run the application and use the below sample code command line to get relevent response

/mcp searchFlights origin=<IATA> destination=<IATA> departureDate=<YYYY-MM-DD>
/mcp searchHotels cityCode=<IATA> checkInDate=<YYYY-MM-DD> checkOutDate=<YYYY-MM-DD>
/mcp getLocationInfo keyword=<string>
/mcp getHotelOffers hotelId=<string>
/mcp getCheapestFlights origin=<IATA> destination=<IATA>