import { amadeus, fetchWithCache } from "../utils/amadeusClient.js";

async function searchTransfers({ startLocationCode, endLocationCode, transferType, startDateTime, startAddressLine, startCountryCode, endAddressLine, endCountryCode, transferDuration, passengers }) {
  const key = `transfer-search-${startLocationCode}-${endLocationCode}-${startDateTime}`;
  return fetchWithCache(key, async () => {
    const params = {
      startLocationCode,
      endLocationCode,
      transferType,
      startDateTime
    };
    if (startAddressLine) params.startAddressLine = startAddressLine;
    if (startCountryCode) params.startCountryCode = startCountryCode;
    if (endAddressLine) params.endAddressLine = endAddressLine;
    if (endCountryCode) params.endCountryCode = endCountryCode;
    if (transferDuration) params.transferDuration = transferDuration;
    if (passengers) params.passengers = passengers;
    
    const res = await amadeus.shopping.transferOffers.get(params);
    return res.data;
  });
}

async function bookTransfer({ offerId, passengerDetails, contactDetails }) {
  const res = await amadeus.ordering.transferOrders.post(
    JSON.stringify({
      data: {
        note: "Transfer booking",
        offerId,
        passengerDetails,
        contactDetails
      }
    })
  );
  return res.data;
}

async function cancelTransfer({ transferId, confirmNbr }) {
  const res = await amadeus.ordering.transferOrder(transferId).transfers.cancellation.post(
    JSON.stringify({
      confirmNbr
    })
  );
  return res.data;
}

async function searchToursAndActivities({ latitude, longitude, radius }) {
  const key = `tours-activities-${latitude}-${longitude}-${radius || 1}`;
  return fetchWithCache(key, async () => {
    const params = { latitude, longitude };
    if (radius) params.radius = radius;
    
    const res = await amadeus.shopping.activities.get(params);
    return res.data;
  });
}

async function getActivityDetails({ activityId }) {
  const key = `activity-details-${activityId}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.shopping.activity(activityId).get();
    return res.data;
  });
}

async function getPointsOfInterest({ latitude, longitude, radius, categories }) {
  const key = `poi-${latitude}-${longitude}-${radius || 1}`;
  return fetchWithCache(key, async () => {
    const params = { latitude, longitude };
    if (radius) params.radius = radius;
    if (categories) params.categories = categories;
    
    const res = await amadeus.referenceData.locations.pointsOfInterest.get(params);
    return res.data;
  });
}

async function getPointOfInterestDetails({ poiId }) {
  const key = `poi-details-${poiId}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.referenceData.locations.pointOfInterest(poiId).get();
    return res.data;
  });
}

async function getLocationScore({ latitude, longitude }) {
  const key = `location-score-${latitude}-${longitude}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.location.analytics.categoryRatedAreas.get({
      latitude,
      longitude
    });
    return res.data;
  });
}

async function getTravelRecommendations({ cityCodes, travelerCountryCode, destinationCountryCode }) {
  const key = `travel-recommendations-${cityCodes}-${travelerCountryCode}`;
  return fetchWithCache(key, async () => {
    const params = { cityCodes };
    if (travelerCountryCode) params.travelerCountryCode = travelerCountryCode;
    if (destinationCountryCode) params.destinationCountryCode = destinationCountryCode;
    
    const res = await amadeus.referenceData.recommendedLocations.get(params);
    return res.data;
  });
}

async function getTravelRestrictions({ originIataCode, destinationIataCode }) {
  const key = `travel-restrictions-${originIataCode}-${destinationIataCode}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.dutyOfCare.diseases.covid19AreaReport.get({
      countryCode: destinationIataCode
    });
    return res.data;
  });
}

async function parseTripData({ payload }) {
  const key = `trip-parser-${JSON.stringify(payload).slice(0, 50)}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.travel.tripParser.post(
      JSON.stringify(payload)
    );
    return res.data;
  });
}

async function predictTripPurpose({ searchMetaData, flightOffers }) {
  const key = `trip-purpose-${JSON.stringify(searchMetaData).slice(0, 50)}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.travel.predictions.tripPurpose.get({
      originLocationCode: searchMetaData.originLocationCode,
      destinationLocationCode: searchMetaData.destinationLocationCode,
      departureDate: searchMetaData.departureDate,
      returnDate: searchMetaData.returnDate,
      searchDate: searchMetaData.searchDate
    });
    return res.data;
  });
}

export {
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
};