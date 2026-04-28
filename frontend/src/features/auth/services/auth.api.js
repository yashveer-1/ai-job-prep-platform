import { api } from '../../../services/api.js';

const API_URL = '/auth';

// API functions
export async function registerUser({ name, email, password }) {
  try {
    const response = await api.post(`${API_URL}/register`, { name, email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
}

export async function loginUser({ email, password }) {
  try {
    const response = await api.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
}

export async function logoutUser() {
  try {
    const response = await api.post(`${API_URL}/logout`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Logout failed' };
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get(`${API_URL}/get-me`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Unable to fetch current user' };
  }
}
