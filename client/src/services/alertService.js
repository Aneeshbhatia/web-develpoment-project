import axios from "axios";

const API = "http://localhost:5001/api/alerts";

const getToken = () => localStorage.getItem("token");

// Get Alerts
export const getAlerts = async () => {
  const response = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

// Create Alert
export const createAlert = async (alertData) => {
  const response = await axios.post(API, alertData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};