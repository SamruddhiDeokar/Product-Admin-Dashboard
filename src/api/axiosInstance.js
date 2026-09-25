import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES, API_DELAY } from '@/utils/constants';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add delay for testing (optional)
    if (API_DELAY.ENABLED && !config.url?.includes('auth/login')) {
      config.params = config.params || {};
      config.params.delay = API_DELAY.MS;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors centrally
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear auth data
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);
        // Avoid reload loop if already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      return Promise.reject(new Error(ERROR_MESSAGES.UNAUTHORIZED));
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      return Promise.reject(new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND));
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
    }

    // Default error message
    const errorMessage = error.response?.data?.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG;
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
