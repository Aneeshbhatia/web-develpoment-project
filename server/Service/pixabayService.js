const axios = require("axios");

const searchImage = async (query) => {
  try {
    const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(
      query
    )}&image_type=photo&per_page=3`;

    const { data } = await axios.get(url);

    if (data.hits.length === 0) {
      return null;
    }

    return data.hits[0].webformatURL;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

module.exports = { searchImage };