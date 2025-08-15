import { amadeus, fetchWithCache } from "../utils/amadeusClient.js";

async function searchHotelsByCity({ cityCode, checkInDate, checkOutDate, adults = 1 }) {
  const key = `hotels-${cityCode}-${checkInDate}-${checkOutDate}-${adults}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.shopping.hotelOffers.get({
      cityCode,
      checkInDate,
      checkOutDate,
      adults
    });
    return res.data;
  });
}

async function getHotelDetails({ hotelId, checkInDate, checkOutDate, adults = 1 }) {
  const key = `hotel-details-${hotelId}-${checkInDate}-${checkOutDate}-${adults}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.shopping.hotelOffersByHotel.get({
      hotelId,
      checkInDate,
      checkOutDate,
      adults
    });
    return res.data;
  });
}

async function searchHotelsByLocation({ latitude, longitude, radius = 5 }) {
  const key = `hotels-location-${latitude}-${longitude}-${radius}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.referenceData.locations.hotels.byGeocode.get({
      latitude,
      longitude,
      radius
    });
    return res.data;
  });
}

async function searchHotels({ keyword, subType, countryCode, stateCode, cityCode, hotelSource }) {
  const key = `hotel-search-${keyword || ''}-${cityCode || ''}`;
  return fetchWithCache(key, async () => {
    const params = {};
    if (keyword) params.keyword = keyword;
    if (subType) params.subType = subType;
    if (countryCode) params.countryCode = countryCode;
    if (stateCode) params.stateCode = stateCode;
    if (cityCode) params.cityCode = cityCode;
    if (hotelSource) params.hotelSource = hotelSource;
    
    const res = await amadeus.referenceData.locations.hotels.byKeyword.get(params);
    return res.data;
  });
}

async function getHotelList({ chainCodes, amenities, ratings, hotelSource }) {
  const key = `hotel-list-${chainCodes || ''}-${amenities || ''}-${ratings || ''}`;
  return fetchWithCache(key, async () => {
    const params = {};
    if (chainCodes) params.chainCodes = chainCodes;
    if (amenities) params.amenities = amenities;
    if (ratings) params.ratings = ratings;
    if (hotelSource) params.hotelSource = hotelSource;
    
    const res = await amadeus.referenceData.locations.hotels.byHotels.get(params);
    return res.data;
  });
}

// Hotel Name Autocomplete
async function getHotelNameAutocomplete({ keyword, subType, countryCode, lang }) {
  const key = `hotel-autocomplete-${keyword}-${countryCode || ''}`;
  return fetchWithCache(key, async () => {
    const params = { keyword };
    if (subType) params.subType = subType;
    if (countryCode) params.countryCode = countryCode;
    if (lang) params.lang = lang;
    
    const res = await amadeus.referenceData.locations.hotel.get(params);
    return res.data;
  });
}

// Hotel Ratings
async function getHotelRatings({ hotelIds }) {
  const key = `hotel-ratings-${hotelIds}`;
  return fetchWithCache(key, async () => {
    const res = await amadeus.ereputation.hotelSentiments.get({
      hotelIds
    });
    return res.data;
  });
}

// Hotel Booking
async function bookHotel({ offerId, guests, payments, rooms }) {
  // Note: This doesn't use cache as it's a booking operation
  const res = await amadeus.booking.hotelBookings.post(
    JSON.stringify({
      data: {
        offerId,
        guests,
        payments,
        rooms
      }
    })
  );
  return res.data;
}

export {
  searchHotelsByCity,
  getHotelDetails,
  searchHotelsByLocation,
  searchHotels,
  getHotelList,
  
  getHotelNameAutocomplete,
  getHotelRatings,
  
  bookHotel
};