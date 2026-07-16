const Farm = require("../models/Farm");
const { getWeather } = require("../Service/weatherService");

const getRecommendation = async (req, res) => {
  try {
    const { id } = req.params;

    const farm = await Farm.findById(id);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    const weather = await getWeather(farm.location);

    const temperature = weather.main.temp;
    const humidity = weather.main.humidity;

    let recommendation = "";
    let waterRequired = "";

    if (temperature > 30 && humidity < 50) {
      recommendation = "Irrigate today";
      waterRequired = "450 Litres";
    } else if (temperature > 25) {
      recommendation = "Light irrigation recommended";
      waterRequired = "250 Litres";
    } else {
      recommendation = "No irrigation required today";
      waterRequired = "0 Litres";
    }

    res.status(200).json({
      success: true,
      farm: farm.farmName,
      crop: farm.cropType,
      location: farm.location,
      weather: {
        temperature,
        humidity,
      },
      recommendation,
      waterRequired,
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
  getRecommendation,
};