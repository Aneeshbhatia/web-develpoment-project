const { getWeather } = require("../Service/weatherService");

const getWeatherByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const weather = await getWeather(city);

    res.status(200).json({
      success: true,
      data: {
        city: weather.name,
        country: weather.sys.country,
        temperature: weather.main.temp,
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        windSpeed: weather.wind.speed,
        weather: weather.weather[0].main,
        description: weather.weather[0].description,
        icon: weather.weather[0].icon,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getWeatherByCity,
};