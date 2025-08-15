# Travel MCP Server (Amadeus API)

An **MCP (Model Context Protocol)** server for **Amadeus travel APIs**, providing flight, hotel, airport, and tourism data directly to **Copilot Chat** or CLI.

## Features
- **Flight Services**: Search flights, get cheapest dates, flight inspiration, pricing, availability, analytics
- **Hotel Services**: Search hotels, get details, ratings, booking, autocomplete
- **Airport & Airline Data**: Airport search, airline lookup, routes, on-time performance
- **Travel Services**: Transfers, tours & activities, points of interest, travel recommendations
- **Advanced Analytics**: Flight delay prediction, price analysis, trip purpose prediction
- **Real-time Data**: Flight status, seat maps, travel restrictions
- And **40+ more Amadeus endpoints** with caching and rate limiting

## Installation

```bash
git clone https://github.com/CVamsi27/travel-mcp-server
cd travel-mcp-server
pnpm install
```

## Configuration

Create a `.env` file with your Amadeus API credentials:

```env
AMADEUS_API_KEY=your_api_key_here
AMADEUS_API_SECRET=your_api_secret_here
CACHE_TTL_MINUTES=5
RATE_LIMIT_REQUESTS=5
MAX_RETRIES=3
```

## Usage

```bash
pnpm dev
```

## Command Examples

### Flight Services

#### Basic Flight Search
```bash
/mcp searchFlights origin=JFK destination=LAX departureDate=2025-09-15
/mcp searchFlights origin=LHR destination=CDG departureDate=2025-09-20 returnDate=2025-09-27 adults=2
```

#### Flight Pricing & Analysis
```bash
/mcp getCheapestFlightDate origin=JFK destination=LAX
/mcp getFlightInspiration origin=JFK
/mcp getFlightPriceAnalysis originIataCode=JFK destinationIataCode=LAX departureDate=2025-09-15
```

#### Flight Analytics
```bash
/mcp getFlightBusiestPeriod cityCode=NYC period=2025-09
/mcp getFlightMostBookedDestinations originCityCode=NYC period=2025-08
/mcp getFlightMostTraveledDestinations originCityCode=LON period=2025-08
```

#### Flight Operations
```bash
/mcp getFlightStatus carrierCode=AA flightNumber=100 scheduledDepartureDate=2025-08-20
/mcp getFlightCheckinLinks airlineCode=AA
/mcp getFlightDelayPrediction originLocationCode=JFK destinationLocationCode=LAX departureDate=2025-09-15 departureTime=08:00:00 arrivalDate=2025-09-15 arrivalTime=11:30:00 aircraftCode=32A carrierCode=AA flightNumber=100 duration=PT5H30M
```

### Hotel Services

#### Hotel Search
```bash
/mcp searchHotelsByCity cityCode=PAR checkInDate=2025-09-15 checkOutDate=2025-09-18 adults=2
/mcp searchHotelsByLocation latitude=48.8566 longitude=2.3522 radius=10
/mcp searchHotels keyword="Hilton" cityCode=NYC
```

#### Hotel Details & Booking
```bash
/mcp getHotelDetails hotelId=HLPAR123 checkInDate=2025-09-15 checkOutDate=2025-09-18 adults=2
/mcp getHotelNameAutocomplete keyword="Marriott" countryCode=US
/mcp getHotelRatings hotelIds=HLPAR123,HLPAR456
```

### Airport & Airline Services

#### Airport Information
```bash
/mcp searchAirportsAndCities keyword="London" subType=AIRPORT,CITY
/mcp getNearestRelevantAirports latitude=51.4700 longitude=-0.4543 radius=100
/mcp getAirportOnTimePerformance airportCode=LHR
/mcp getAirportRoutes airportCode=JFK maxDailyFlights=50
```

#### Airline Information
```bash
/mcp lookupAirlineCode airlineCodes=AA,UA,BA
/mcp getAirlineRoutes airlineCode=AA maxDailyFlights=10
/mcp searchCities keyword="New York" countryCode=US maxNumberOfItems=5
```

### Travel Services

#### Ground Transfers
```bash
/mcp searchTransfers startLocationCode=CDG endLocationCode=PAR transferType=PRIVATE startDateTime=2025-09-15T10:00:00
/mcp searchTransfers startLocationCode=JFK endLocationCode=NYC transferType=TAXI startDateTime=2025-09-15T14:30:00 passengers=2
```

#### Tours & Activities
```bash
/mcp searchToursAndActivities latitude=48.8566 longitude=2.3522 radius=5
/mcp getActivityDetails activityId=ACT123456789
```

#### Points of Interest
```bash
/mcp getPointsOfInterest latitude=40.7589 longitude=-73.9851 radius=2 categories=SIGHTS,RESTAURANT
/mcp getPointOfInterestDetails poiId=POI123456789
```

#### Travel Intelligence
```bash
/mcp getLocationScore latitude=48.8566 longitude=2.3522
/mcp getTravelRecommendations cityCodes=PAR,LON,NYC travelerCountryCode=US
/mcp getTravelRestrictions originIataCode=US destinationIataCode=FR
```

#### Trip Analysis
```bash
/mcp predictTripPurpose originLocationCode=NYC destinationLocationCode=LAX departureDate=2024-12-15 returnDate=2024-12-18 searchDate=2024-11-15
```

## Command Format Options

### Key-Value Format
```bash
/mcp toolName key1=value1 key2=value2 key3=value3
```

### JSON Format
```bash
/mcp toolName {"key1": "value1", "key2": "value2"}
```

## Complete Tool List

### Flight Tools (25)
- `searchFlights` - Search flight offers
- `getCheapestFlightDate` - Find cheapest travel dates
- `getFlightInspiration` - Get destination inspiration
- `getFlightOffersPrice` - Price flight offers
- `searchFlightAvailabilities` - Check flight availability
- `getFlightBusiestPeriod` - Airport traffic analytics
- `getFlightMostBookedDestinations` - Popular destinations
- `getFlightMostTraveledDestinations` - Travel patterns
- `getFlightPriceAnalysis` - Price trend analysis
- `getFlightChoicePrediction` - ML-powered choice prediction
- `getFlightDelayPrediction` - Delay probability
- `getFlightStatus` - Real-time flight status
- `getFlightCheckinLinks` - Airline check-in URLs
- `getSeatMap` - Aircraft seat maps
- `createFlightOrder` - Book flights
- `getFlightOrder` - Retrieve booking
- `deleteFlightOrder` - Cancel booking
- `getBrandedFares` - Premium fare options

### Hotel Tools (8)
- `searchHotelsByCity` - Search hotels by city
- `getHotelDetails` - Hotel details and offers
- `searchHotelsByLocation` - Location-based search
- `searchHotels` - General hotel search
- `getHotelList` - Hotel listings with filters
- `getHotelNameAutocomplete` - Hotel name suggestions
- `getHotelRatings` - Hotel sentiment analysis
- `bookHotel` - Hotel booking

### Airport & Airline Tools (6)
- `searchAirportsAndCities` - Airport/city search
- `getNearestRelevantAirports` - Nearby airports
- `getAirportOnTimePerformance` - Performance metrics
- `getAirportRoutes` - Airport destinations
- `lookupAirlineCode` - Airline information
- `getAirlineRoutes` - Airline route network
- `searchCities` - City search

### Travel Services Tools (11)
- `searchTransfers` - Ground transfer search
- `bookTransfer` - Book transfers
- `cancelTransfer` - Cancel transfers
- `searchToursAndActivities` - Local activities
- `getActivityDetails` - Activity information
- `getPointsOfInterest` - POI discovery
- `getPointOfInterestDetails` - POI details
- `getLocationScore` - Location ratings
- `getTravelRecommendations` - Destination suggestions
- `getTravelRestrictions` - Travel advisories
- `parseTripData` - Parse travel documents
- `predictTripPurpose` - Trip purpose analysis

## Error Handling

The server includes comprehensive error handling:
- **Rate limiting** with configurable limits
- **Automatic retries** with exponential backoff
- **Caching** to reduce API calls
- **Input validation** for all parameters

## Common Use Cases

1. **Flight Booking Flow**: Search → Price → Predict Choice → Book
2. **Hotel Discovery**: Search → Details → Ratings → Book  
3. **Trip Planning**: Inspiration → Recommendations → Restrictions
4. **Travel Analytics**: Price Analysis → Delay Prediction → Performance Metrics
5. **Ground Services**: Transfers → Activities → Points of Interest

## API Rate Limits

Each tool respects Amadeus API rate limits:
- Test environment: Various limits per endpoint
- Production environment: Higher limits available
- Built-in caching reduces API calls significantly

## Support

For issues or questions:
- Check Amadeus API documentation
- Review error messages for specific guidance
- Ensure API credentials are valid
- Verify date formats (YYYY-MM-DD) and IATA codes