import axios from 'axios';
axios.create({
  withCredentials: true,
});

const API_URL = 'http://localhost:5000/api/auth';

// API functions
export async function registerUser({name, email, password}) {
  try {
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export async function loginUser({email, password}) {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export async function logoutUser() {
  try {
    const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true }    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export async function getCurrentUser() {
  try {
    const response = await axios.get(`${API_URL}/get-me`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}   