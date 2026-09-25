import axiosInstance from './axiosInstance';
import { ENDPOINTS } from '@/utils/constants';

export const categoriesAPI = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.PRODUCTS_CATEGORIES);

      // Normalize categories: DummyJSON may return ['beauty', ...] or [{slug: 'beauty', name: 'Beauty'}, ...]
      const rawData = response.data;
      const normalizedData = Array.isArray(rawData)
        ? rawData.map((item) => {
            if (typeof item === 'string') {
              return {
                slug: item,
                name: item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, ' '),
              };
            }
            return {
              slug: item.slug || item.name,
              name: item.name || item.slug,
            };
          })
        : [];

      return {
        success: true,
        data: normalizedData,
        raw: rawData,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },
};
