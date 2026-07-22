import axios from "axios";

const API_URL = "http://localhost:5001/api/sensor-catalog";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Get all sensors
export const getSensors = async () => {
  const { data } = await api.get("/");
  return data;
};

// Get sensor by id
export const getSensor = async (id) => {
  const { data } = await api.get(`/${id}`);
  return data;
};

// Add sensor
export const addSensor = async (sensorData) => {
  const { data } = await api.post("/", sensorData);
  return data;
};

// Update sensor
export const updateSensor = async (id, sensorData) => {
  const { data } = await api.put(`/${id}`, sensorData);
  return data;
};

// Delete sensor
export const deleteSensor = async (id) => {
  const { data } = await api.delete(`/${id}`);
  return data;
};