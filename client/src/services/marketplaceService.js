import axios from "axios";

const API_URL = "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
});

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// =========================
// Product APIs
// =========================

export const getProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const getProduct = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const addProduct = async (product) => {
  const { data } = await api.post(
    "/products",
    product,
    getAuthConfig()
  );
  return data;
};

export const updateProduct = async (id, product) => {
  const { data } = await api.put(
    `/products/${id}`,
    product,
    getAuthConfig()
  );
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(
    `/products/${id}`,
    getAuthConfig()
  );
  return data;
};

// =========================
// Order APIs
// =========================

export const getOrders = async () => {
  const { data } = await api.get(
    "/orders",
    getAuthConfig()
  );
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(
    `/orders/${id}`,
    { status },
    getAuthConfig()
  );
  return data;
};

// =========================
// User APIs
// =========================

export const getUsers = async () => {
  const { data } = await api.get(
    "/users",
    getAuthConfig()
  );
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(
    `/users/${id}`,
    getAuthConfig()
  );
  return data;
};

export const updateUserRole = async (id, role) => {
  const { data } = await api.put(
    `/users/${id}/role`,
    { role },
    getAuthConfig()
  );
  return data;
};