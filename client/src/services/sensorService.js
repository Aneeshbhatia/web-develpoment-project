import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =========================
// Get All Sensors
// =========================
export const getSensors = async () => {
  const res = await API.get("/sensors");
  return res.data;
};

// =========================
// Get Single Sensor
// =========================
export const getSensor = async (id) => {
  const res = await API.get(`/sensors/${id}`);
  return res.data;
};

// =========================
// Install Sensor
// =========================
export const addSensor = async (sensorData) => {
  const res = await API.post("/sensors", sensorData);
  return res.data;
};

// =========================
// Update Sensor
// =========================
export const updateSensor = async (id, sensorData) => {
  const res = await API.put(`/sensors/${id}`, sensorData);
  return res.data;
};

// =========================
// Delete Sensor
// =========================
export const deleteSensor = async (id) => {
  const res = await API.delete(`/sensors/${id}`);
  return res.data;
};

// =========================
// Change Status
// =========================
export const changeSensorStatus = async (id, status) => {
  const res = await API.patch(`/sensors/${id}/status`, {
    status,
  });

  return res.data;
};