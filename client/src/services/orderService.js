import axios from "axios";

const API = "http://localhost:5001/api/orders";

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// =====================================
// Place Order
// =====================================
export const placeOrder = async (data) => {
  const response = await axios.post(
    `${API}/place`,
    data,
    getHeaders()
  );

  return response.data;
};

// =====================================
// Get All Orders
// =====================================
export const getOrders = async () => {
  const response = await axios.get(
    API,
    getHeaders()
  );

  return response.data;
};

// =====================================
// Get Single Order
// =====================================
export const getOrder = async (id) => {
  const response = await axios.get(
    `${API}/${id}`,
    getHeaders()
  );

  return response.data;
};

// =====================================
// Cancel Order
// =====================================
export const cancelOrder = async (id) => {
  const response = await axios.put(
    `${API}/cancel/${id}`,
    {},
    getHeaders()
  );

  return response.data;
};

// =====================================
// Order Count
// =====================================
export const getOrderCount = async () => {
  const response = await axios.get(
    `${API}/count`,
    getHeaders()
  );

  return response.data;
};