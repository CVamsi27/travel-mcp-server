import { amadeus, fetchWithCache } from "../utils/amadeusClient.js";

async function searchAirportsAndCities({ keyword, subType, countryCode, pageLimit, pageOffset, sort, view }) {
  const key = `airport-city-search-${keyword}-${countryCode || ''}`;
  return fetchWithCache(key, async () => {
    const params = { keyword };
    if (subType) params.subType = subType;
    if (countryCode) params.countryCode = countryCode;
    if (pageLimit) params.pageLimit = pageLimit;
    if (pageOffset) params.pageOffset = pageOffset;
    if (sort) params.sort = sort;
    if (view) params.view = view;
    
    const res = await amadeus.referenceData.locations.get(params);
    return res.data;
  });
}

async function getNearestRelevantAirports({ latitude, longitude, radius, pageLimit, pageOffset, sort, view }) {
  const key = `nearest-airports-${latitude}-${longitude}-${radius || 500}`;
  return fetchWithCache(key, async () => {
    const params = { latitude, longitude };
    if (radius) params.radius = radius;
    if (pageLimit) params.pageLimit = pageLimit;
    if (pageOffset) params.pageOffset = pageOffset;
    if (sort) params.sort = sort;
    if (view) params.view = view;
    
    const res = await amadeus.referenceData.locations.airports.get(params);
    return res.data;
  });
}

async function getAirportOnTimePerformance({ airportCode }) {
  const key = `airport-ontime-${airportCode}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.airport.predictions.onTime.get({
      airportCode
    });
    return res.data;
  });
}

async function getAirportRoutes({ airportCode, maxDailyFlights, minServiceLevel, pageLimit, pageOffset }) {
  const key = `airport-routes-${airportCode}`;
  return fetchWithCache(key, async () => {
    const params = { airportCode };
    if (maxDailyFlights) params.maxDailyFlights = maxDailyFlights;
    if (minServiceLevel) params.minServiceLevel = minServiceLevel;
    if (pageLimit) params.pageLimit = pageLimit;
    if (pageOffset) params.pageOffset = pageOffset;
    
    const res = await amadeus.airport.directDestinations.get(params);
    return res.data;
  });
}

async function lookupAirlineCode({ airlineCodes }) {
  const key = `airline-codes-${airlineCodes}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.referenceData.airlines.get({
      airlineCodes
    });
    return res.data;
  });
}

async function getAirlineRoutes({ airlineCode, maxDailyFlights, minServiceLevel, pageLimit, pageOffset }) {
  const key = `airline-routes-${airlineCode}`;
  return fetchWithCache(key, async () => {
    const params = { airlineCode };
    if (maxDailyFlights) params.maxDailyFlights = maxDailyFlights;
    if (minServiceLevel) params.minServiceLevel = minServiceLevel;
    if (pageLimit) params.pageLimit = pageLimit;
    if (pageOffset) params.pageOffset = pageOffset;
    
    const res = await amadeus.airline.destinations.get(params);
    return res.data;
  });
}

async function searchCities({ keyword, countryCode, maxNumberOfItems, include }) {
  const key = `city-search-${keyword}-${countryCode || ''}`;
  return fetchWithCache(key, async () => {
    const params = { keyword };
    if (countryCode) params.countryCode = countryCode;
    if (maxNumberOfItems) params.maxNumberOfItems = maxNumberOfItems;
    if (include) params.include = include;
    
    const res = await amadeus.referenceData.locations.cities.get(params);
    return res.data;
  });
}

export {
  searchAirportsAndCities,
  getNearestRelevantAirports,
  getAirportOnTimePerformance,
  getAirportRoutes,
  
  lookupAirlineCode,
  getAirlineRoutes,
  
  searchCities
};