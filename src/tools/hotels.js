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

export { searchHotelsByCity, getHotelDetails, searchHotelsByLocation };
