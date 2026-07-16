import axios from "axios";

const API = "http://localhost:5001/api/dashboard";

const getToken = () => localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
};

// ==========================
// Get Dashboard Statistics
// ==========================

export const getDashboardStats = async () => {
  const response = await axios.get(API, config);

  return response.data;
};