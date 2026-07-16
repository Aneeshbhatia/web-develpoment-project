import axios from "axios";

const API = "http://localhost:5001/api/equipment";

const getToken = () => {
  return localStorage.getItem("token");
};

// Get All Equipment
export const getEquipment = async () => {
  const response = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

// Add Equipment
export const addEquipment = async (equipment) => {
  const response = await axios.post(API, equipment, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

// Update Equipment
export const updateEquipment = async (id, equipment) => {
  const response = await axios.put(
    `${API}/${id}`,
    equipment,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Delete Equipment
export const deleteEquipment = async (id) => {
  const response = await axios.delete(
    `${API}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Change Status
export const changeEquipmentStatus = async (
  id,
  status
) => {
  const response = await axios.patch(
    `${API}/status/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};