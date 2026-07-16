require("dotenv").config();

const connectDB = require("./config/db");
const Product = require("./models/Product");
const { searchImage } = require("./Service/pixabayService");

const updateImages = async () => {
  try {
    await connectDB();

    const products = await Product.find();

    for (const product of products) {
      console.log(`Searching image for: ${product.name}`);

      const image = await searchImage(product.name);

      if (image) {
        product.image = image;
        await product.save();

        console.log(`✅ Updated: ${product.name}`);
      } else {
        console.log(`❌ No image found for ${product.name}`);
      }

      // Delay to avoid sending too many requests too quickly
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("\n🎉 All product images updated!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateImages();