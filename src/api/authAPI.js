import axiosInstance from './axiosInstance';
import { ENDPOINTS, STORAGE_KEYS } from '@/utils/constants';

export const authAPI = {
  // Login with username and password
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH_LOGIN, {
        username,
        password,
        expiresInMins: 30,
      });

      // Save token and user info to localStorage (DummyJSON returns accessToken or token)
      const data = response.data;
      const token = data.token || data.accessToken;
      const { token: _t, accessToken: _at, ...userInfo } = data;

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
      }

      return {
        success: true,
        data: { token, ...userInfo },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Logout
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    }
    return { success: true };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    return false;
  },

  // Get current user info
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
      return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
  },

  // Get stored token
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    return null;
  },
};
