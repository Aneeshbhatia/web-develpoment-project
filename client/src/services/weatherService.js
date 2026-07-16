import API from "../api/axios";

// Get Weather by City
export const getWeather = async (city) => {
  const response = await API.get(`/weather/${city}`);
  return response.data;
};