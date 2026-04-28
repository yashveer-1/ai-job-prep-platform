import axios from 'axios';

const backendHost = window.location.hostname || 'localhost';
const fallbackBaseUrl = `http://${backendHost}:5000/api`;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || fallbackBaseUrl,
  withCredentials: true,
});
