import axiosInstance from './axiosInstance';
import { ENDPOINTS } from '@/utils/constants';

export const productsAPI = {
  // Get products with pagination and sorting
  getProducts: async ({ limit = 10, skip = 0, sortBy, order } = {}) => {
    try {
      const params = { limit, skip };
      if (sortBy && sortBy !== 'none') {
        params.sortBy = sortBy;
        params.order = order || 'asc';
      }

      const response = await axiosInstance.get(ENDPOINTS.PRODUCTS_LIST, { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: { products: [], total: 0, skip: 0, limit: 10 },
      };
    }
  },

  // Search products
  searchProducts: async (query, { limit = 10, skip = 0 } = {}) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.PRODUCTS_SEARCH, {
        params: { q: query, limit, skip },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: { products: [], total: 0, skip: 0, limit: 10 },
      };
    }
  },

  // Filter products by category
  getProductsByCategory: async (category, { limit = 10, skip = 0, sortBy, order } = {}) => {
    try {
      const params = { limit, skip };
      if (sortBy && sortBy !== 'none') {
        params.sortBy = sortBy;
        params.order = order || 'asc';
      }

      const response = await axiosInstance.get(`/products/category/${category}`, { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: { products: [], total: 0, skip: 0, limit: 10 },
      };
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.PRODUCT_DETAILS(id));
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Add a new product
  addProduct: async (productData) => {
    try {
      const response = await axiosInstance.post('/products/add', productData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Update existing product
  updateProduct: async (id, productData) => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, productData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};
