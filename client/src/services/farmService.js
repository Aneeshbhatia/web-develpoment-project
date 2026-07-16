import API from "../api/axios";

// Add Farm
export const addFarm = async (farmData) => {
  const response = await API.post("/farms", farmData);
  return response.data;
};

// Get All Farms
export const getFarms = async () => {
  const response = await API.get("/farms");
  return response.data;
};

// Get Single Farm
export const getFarm = async (id) => {
  const response = await API.get(`/farms/${id}`);
  return response.data;
};

// Update Farm
export const updateFarm = async (id, farmData) => {
  const response = await API.put(`/farms/${id}`, farmData);
  return response.data;
};

// Delete Farm
export const deleteFarm = async (id) => {
  const response = await API.delete(`/farms/${id}`);
  return response.data;
};