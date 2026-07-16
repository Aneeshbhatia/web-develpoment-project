import axios from "axios";

const API = "http://localhost:5001/api/cart";

// ==============================
// Get JWT Token
// ==============================
const getToken = () => {
  return localStorage.getItem("token");
};

// ==============================
// Get Auth Headers
// ==============================
const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ==============================
// Add Product To Cart
// ==============================
export const addToCart = async (data) => {
  const response = await axios.post(
    `${API}/add`,
    data,
    getHeaders()
  );

  return response.data;
};

// ==============================
// Get Cart
// ==============================
export const getCart = async () => {
  const response = await axios.get(
    API,
    getHeaders()
  );

  return response.data;
};

// ==============================
// Update Cart Quantity
// ==============================
export const updateCart = async (id, quantity) => {
  const response = await axios.put(
    `${API}/update/${id}`,
    { quantity },
    getHeaders()
  );

  return response.data;
};

// ==============================
// Remove Cart Item
// ==============================
export const removeCartItem = async (id) => {
  const response = await axios.delete(
    `${API}/remove/${id}`,
    getHeaders()
  );

  return response.data;
};

// ==============================
// Clear Cart
// ==============================
export const clearCart = async () => {
  const response = await axios.delete(
    `${API}/clear`,
    getHeaders()
  );

  return response.data;
};

// ==============================
// Get Cart Total
// ==============================
export const getCartTotal = async () => {
  const response = await axios.get(
    `${API}/total`,
    getHeaders()
  );

  return response.data;
};