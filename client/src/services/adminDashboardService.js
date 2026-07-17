import axios from "axios";

const API = "http://localhost:5001/api/admin/dashboard";

export const getAdminDashboard = async () => {
  const token = localStorage.getItem("token");

  const { data } = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};