const axios = require("axios");

const getWeather = async (city) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;

    console.log("API Key:", apiKey);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.log("========== WEATHER ERROR ==========");

    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    throw new Error("Unable to fetch weather data");
  }
};

module.exports = {
  getWeather,
};