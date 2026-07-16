import axios from "axios";

const API = "http://localhost:5001/api/recommendation";

export const getRecommendation = async (farmId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API}/${farmId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};