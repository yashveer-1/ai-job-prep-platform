import {
  api,
  clearAuthSession,
  getAuthToken,
  getAuthUser,
  hasAuthToken,
  saveAuthSession,
} from '../../../services/api.js';

const API_URL = '/auth';

// API functions
export async function registerUser({ name, email, password }) {
  clearAuthSession();

  try {
    const response = await api.post(`${API_URL}/register`, { name, email, password });
    saveAuthSession(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
}

export async function loginUser({ email, password }) {
  clearAuthSession();

  try {
    const response = await api.post(`${API_URL}/login`, { email, password });
    saveAuthSession(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
}

export async function logoutUser() {
  try {
    const response = await api.post(`${API_URL}/logout`);
    clearAuthSession();
    return response.data;
  } catch (error) {
    clearAuthSession();
    throw error.response?.data || { message: 'Logout failed' };
  }
}

export async function getCurrentUser() {
  if (!hasAuthToken()) {
    return { user: null };
  }

  try {
    const response = await api.get(`${API_URL}/get-me`);
    saveAuthSession({
      token: getAuthToken(),
      user: response.data.user,
    });
    return response.data;
  } catch (error) {
    const cachedUser = getAuthUser();

    if (cachedUser) {
      return { user: cachedUser };
    }

    throw error.response?.data || { message: 'Unable to fetch current user' };
  }
}
