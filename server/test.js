require("dotenv").config();

const { searchImage } = require("./Service/pixabayService");

(async () => {
  const image = await searchImage("Tomato Seeds");
  console.log(image);
})();