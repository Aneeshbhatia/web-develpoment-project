import axios from "axios";

const API = "http://localhost:5001/api/products";

// Get All Products
export const getProducts = async () => {
  const response = await axios.get(API);
  return response.data;
};

// Add Product
export const addProduct = async (product) => {
  const response = await axios.post(API, product);
  return response.data;
};