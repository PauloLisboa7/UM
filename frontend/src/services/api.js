import axios from "axios";
const api = axios.create({
  baseURL: "/api",
});

// Add Authorization header from localStorage for every request (if present)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore when localStorage not available
  }
  return config;
}, (error) => Promise.reject(error));
export default api;
