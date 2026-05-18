import axios from 'axios';

const tokenKey = 'token';
const userKey = 'authUser';

function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '=',
    );

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return localStorage.getItem(tokenKey);
}

export function getAuthUser() {
  try {
    const user = localStorage.getItem(userKey);
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem(userKey);
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
}

export function hasAuthToken() {
  const token = getAuthToken();

  if (!token) {
    return false;
  }

  const payload = decodeJwtPayload(token);

  if (payload?.exp && payload.exp * 1000 <= Date.now()) {
    clearAuthSession();
    return false;
  }

  return true;
}

export function saveAuthSession({ token, user }) {
  if (token) {
    localStorage.setItem(tokenKey, token);
  }

  if (user) {
    localStorage.setItem(userKey, JSON.stringify(user));
  }
}

const defaultApiBaseUrl = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : 'https://ai-job-prep-platform.onrender.com/api';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
