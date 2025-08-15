import { amadeus, fetchWithCache } from "../utils/amadeusClient.js";

// Flight Search & Offers
async function searchFlights({ origin, destination, departureDate, returnDate, adults = 1 }) {
  // Validate required parameters
  if (!origin || !destination || !departureDate) {
    throw new Error("Missing required parameters: origin, destination, and departureDate are required");
  }
  
  // Validate IATA codes (should be 3 characters)
  if (origin.length !== 3 || destination.length !== 3) {
    throw new Error(`Invalid IATA codes. Use 3-letter airport codes like JFK, LAX, LHR. Received: ${origin}, ${destination}`);
  }
  
  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(departureDate)) {
    throw new Error(`Invalid date format. Use YYYY-MM-DD. Received: ${departureDate}`);
  }
  
  if (returnDate && !dateRegex.test(returnDate)) {
    throw new Error(`Invalid return date format. Use YYYY-MM-DD. Received: ${returnDate}`);
  }
  
  const key = `flights-${origin}-${destination}-${departureDate}-${returnDate || "oneway"}-${adults}`;
  
  return fetchWithCache(key, async () => {
    console.log(`Searching flights: ${origin} -> ${destination} on ${departureDate} for ${adults} adult(s)`);
    
    const params = {
      originLocationCode: origin.toUpperCase(),
      destinationLocationCode: destination.toUpperCase(),
      departureDate,
      adults: parseInt(adults)
    };
    
    if (returnDate) {
      params.returnDate = returnDate;
    }
    
    const res = await amadeus.shopping.flightOffersSearch.get(params);
    
    if (!res.data || res.data.length === 0) {
      console.warn("No flights found for the given criteria");
      return { message: "No flights found", data: [] };
    }
    
    console.log(`Found ${res.data.length} flight offers`);
    return res.data;
  });
}

async function getCheapestFlightDate({ origin, destination }) {
  const key = `cheapest-flight-date-${origin}-${destination}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.shopping.flightDates.get({
      origin,
      destination
    });
    return res.data;
  });
}

async function getFlightInspiration({ origin }) {
  const key = `flight-inspiration-${origin}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.shopping.flightDestinations.get({ origin });
    return res.data;
  });
}

async function getFlightOffersPrice({ flightOffers }) {
  const key = `flight-offers-price-${JSON.stringify(flightOffers).slice(0, 50)}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({ data: { type: "flight-offers-pricing", flightOffers } })
    );
    return res.data;
  });
}

async function searchFlightAvailabilities({ originDestinations, travelers, sources }) {
  const key = `flight-availabilities-${JSON.stringify(originDestinations).slice(0, 50)}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.shopping.availability.flightAvailabilities.post(
      JSON.stringify({ originDestinations, travelers, sources })
    );
    return res.data;
  });
}

// Flight Analytics & Intelligence
async function getFlightBusiestPeriod({ cityCode, period }) {
  const key = `flight-busiest-period-${cityCode}-${period}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.travel.analytics.airTraffic.busiestPeriod.get({
      cityCode,
      period
    });
    return res.data;
  });
}

async function getFlightMostBookedDestinations({ originCityCode, period }) {
  const key = `flight-most-booked-${originCityCode}-${period}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.travel.analytics.airTraffic.booked.get({
      originCityCode,
      period
    });
    return res.data;
  });
}

async function getFlightMostTraveledDestinations({ originCityCode, period }) {
  const key = `flight-most-traveled-${originCityCode}-${period}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.travel.analytics.airTraffic.traveled.get({
      originCityCode,
      period
    });
    return res.data;
  });
}

async function getFlightPriceAnalysis({ originIataCode, destinationIataCode, departureDate }) {
  const key = `flight-price-analysis-${originIataCode}-${destinationIataCode}-${departureDate}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.analytics.itineraryPriceMetrics.get({
      originIataCode,
      destinationIataCode,
      departureDate
    });
    return res.data;
  });
}

async function getFlightChoicePrediction({ flightOffers }) {
  const key = `flight-choice-prediction-${JSON.stringify(flightOffers).slice(0, 50)}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.shopping.flightOffers.prediction.post(
      JSON.stringify(flightOffers)
    );
    return res.data;
  });
}

async function getFlightDelayPrediction({ originLocationCode, destinationLocationCode, departureDate, departureTime, arrivalDate, arrivalTime, aircraftCode, carrierCode, flightNumber, duration }) {
  const key = `flight-delay-prediction-${originLocationCode}-${destinationLocationCode}-${departureDate}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.travel.predictions.flightDelay.get({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      aircraftCode,
      carrierCode,
      flightNumber,
      duration
    });
    return res.data;
  });
}

// Flight Status & Operations
async function getFlightStatus({ carrierCode, flightNumber, scheduledDepartureDate }) {
  const key = `flight-status-${carrierCode}-${flightNumber}-${scheduledDepartureDate}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.schedule.flights.get({
      carrierCode,
      flightNumber,
      scheduledDepartureDate
    });
    return res.data;
  });
}

async function getFlightCheckinLinks({ airlineCode }) {
  const key = `flight-checkin-links-${airlineCode}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.referenceData.urls.checkinLinks.get({
      airlineCode
    });
    return res.data;
  });
}

async function getSeatMap({ flightOrderId }) {
  const key = `seatmap-${flightOrderId}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.shopping.seatmaps.get({
      'flight-orderId': flightOrderId
    });
    return res.data;
  });
}

// Flight Booking & Order Management
async function createFlightOrder({ flightOffers, travelers }) {
  // Note: This doesn't use cache as it's a booking operation
  const res = await amadeus.booking.flightOrders.post(
    JSON.stringify({
      data: {
        type: "flight-order",
        flightOffers,
        travelers
      }
    })
  );
  return res.data;
}

async function getFlightOrder({ id }) {
  const key = `flight-order-${id}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.booking.flightOrder(id).get();
    return res.data;
  });
}

async function deleteFlightOrder({ id }) {
  // Note: This doesn't use cache as it's a deletion operation
  const res = await amadeus.booking.flightOrder(id).delete();
  return res.data;
}

// Branded Fares
async function getBrandedFares({ flightOffers }) {
  const key = `branded-fares-${JSON.stringify(flightOffers).slice(0, 50)}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.shopping.flightOffers.upselling.post(
      JSON.stringify({
        data: {
          type: "flight-offers-upselling",
          flightOffers
        }
      })
    );
    return res.data;
  });
}

export {
  // Flight Search & Offers
  searchFlights,
  getCheapestFlightDate,
  getFlightInspiration,
  getFlightOffersPrice,
  searchFlightAvailabilities,
  
  // Flight Analytics & Intelligence
  getFlightBusiestPeriod,
  getFlightMostBookedDestinations,
  getFlightMostTraveledDestinations,
  getFlightPriceAnalysis,
  getFlightChoicePrediction,
  getFlightDelayPrediction,
  
  // Flight Status & Operations
  getFlightStatus,
  getFlightCheckinLinks,
  getSeatMap,
  
  // Flight Booking & Order Management
  createFlightOrder,
  getFlightOrder,
  deleteFlightOrder,
  
  // Branded Fares
  getBrandedFares
};