import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://ai-job-prep-platform.onrender.com/api',
  withCredentials: true,
});