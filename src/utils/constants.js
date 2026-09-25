// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://dummyjson.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50],
  MAX_PRODUCTS: 194, // From assignment
};

// API Endpoints
export const ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  PRODUCTS_LIST: '/products',
  PRODUCTS_SEARCH: '/products/search',
  PRODUCTS_CATEGORIES: '/products/categories',
  PRODUCT_DETAILS: (id) => `/products/${id}`,
};

// Sort Options
export const SORT_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating: High to Low', value: 'rating_desc' },
  { label: 'Title: A to Z', value: 'title_asc' },
];

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  RECENT_FILTERS: 'recent_filters',
};

// API Response Delays (for testing)
export const API_DELAY = {
  ENABLED: process.env.NEXT_PUBLIC_API_DELAY === 'true',
  MS: 2000,
};

// Table/Card Display
export const PRODUCT_COLUMNS = [
  { key: 'id', label: 'ID', visible: true },
  { key: 'title', label: 'Title', visible: true },
  { key: 'category', label: 'Category', visible: true },
  { key: 'price', label: 'Price', visible: true },
  { key: 'rating', label: 'Rating', visible: true },
  { key: 'stock', label: 'Stock', visible: true },
  { key: 'image', label: 'Image', visible: true },
  { key: 'actions', label: 'Actions', visible: true },
];

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_LOGIN: 'Invalid username or password',
  NETWORK_ERROR: 'Network error. Please try again.',
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  PRODUCT_NOT_FOUND: 'Product not found',
  INVALID_PAGE: 'Invalid page number',
  UNAUTHORIZED: 'You are not authorized to perform this action',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PRODUCT_ADDED: 'Product added successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
};

// Validation Rules
export const VALIDATION_RULES = {
  PRODUCT_TITLE_MIN: 3,
  PRODUCT_TITLE_MAX: 100,
  PRODUCT_DESCRIPTION_MIN: 10,
  PRODUCT_DESCRIPTION_MAX: 1000,
  PRICE_MIN: 0,
  PRICE_MAX: 100000,
  RATING_MIN: 0,
  RATING_MAX: 5,
  STOCK_MIN: 0,
  STOCK_MAX: 10000,
};

// Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/dashboard',
  PRODUCT_DETAIL: (id) => `/dashboard/${id}`,
  ADD_PRODUCT: '/dashboard/products/add',
  EDIT_PRODUCT: (id) => `/dashboard/products/edit/${id}`,
};

// UI Configuration
export const UI_CONFIG = {
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 500,
  ANIMATION_DURATION: 300,
  IMAGE_SIZE: {
    THUMBNAIL: 100,
    CARD: 200,
    DETAIL: 400,
  },
};
