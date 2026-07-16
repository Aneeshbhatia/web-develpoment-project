import axios from "axios";

const API = "http://localhost:5001/api/profile";

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ===============================
// Get Profile
// ===============================
export const getProfile = async () => {
  const response = await axios.get(
    API,
    getHeaders()
  );

  return response.data;
};

// ===============================
// Update Profile
// ===============================
export const updateProfile = async (data) => {
  const response = await axios.put(
    `${API}/update`,
    data,
    getHeaders()
  );

  return response.data;
};

// ===============================
// Change Password
// ===============================
export const changePassword = async (data) => {
  const response = await axios.put(
    `${API}/password`,
    data,
    getHeaders()
  );

  return response.data;
};