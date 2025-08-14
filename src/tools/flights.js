import { amadeus, fetchWithCache } from "../utils/amadeusClient.js";

async function searchFlights({ origin, destination, departureDate, returnDate, adults = 1 }) {
  const key = `flights-${origin}-${destination}-${departureDate}-${returnDate || "oneway"}-${adults}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      ...(returnDate && { returnDate }),
      adults
    });
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

export { searchFlights, getCheapestFlightDate, getFlightInspiration };
