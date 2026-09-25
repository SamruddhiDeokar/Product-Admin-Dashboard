'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { productsAPI } from '@/api/productsAPI';
import { categoriesAPI } from '@/api/categoriesAPI';
import { PAGINATION, SORT_OPTIONS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/utils/constants';
import { useToast } from './ToastContext';

const ProductContext = createContext(null);

const STORAGE_KEY_CUSTOM_PRODUCTS = 'nexus_custom_products';
const STORAGE_KEY_EDITED_PRODUCTS = 'nexus_edited_products';
const STORAGE_KEY_DELETED_IDS = 'nexus_deleted_ids';
const STORAGE_KEY_VIEW_MODE = 'nexus_view_mode';

export const ProductProvider = ({ children }) => {
  const { showToast } = useToast();

  // Products and categories state
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Pagination state
  const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('none');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Local mutations storage (for DummyJSON mock simulation)
  const [customProducts, setCustomProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});
  const [deletedIds, setDeletedIds] = useState(new Set());

  // Initialize stored state
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedCustom = localStorage.getItem(STORAGE_KEY_CUSTOM_PRODUCTS);
        if (storedCustom) setCustomProducts(JSON.parse(storedCustom));

        const storedEdited = localStorage.getItem(STORAGE_KEY_EDITED_PRODUCTS);
        if (storedEdited) setEditedProducts(JSON.parse(storedEdited));

        const storedDeleted = localStorage.getItem(STORAGE_KEY_DELETED_IDS);
        if (storedDeleted) setDeletedIds(new Set(JSON.parse(storedDeleted)));

        const storedView = localStorage.getItem(STORAGE_KEY_VIEW_MODE);
        if (storedView) setViewMode(storedView);
      }
    } catch (e) {
      console.error('Failed to load local product cache:', e);
    }
  }, []);

  // Fetch categories once
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      setIsCategoriesLoading(true);
      const res = await categoriesAPI.getCategories();
      if (isMounted && res.success) {
        setCategories(res.data);
      }
      if (isMounted) setIsCategoriesLoading(false);
    };

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save view mode
  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_VIEW_MODE, mode);
    }
  };

  // Helper to parse sort parameters
  const parseSort = (sortVal) => {
    switch (sortVal) {
      case 'price_asc':
        return { sortBy: 'price', order: 'asc' };
      case 'price_desc':
        return { sortBy: 'price', order: 'desc' };
      case 'rating_desc':
        return { sortBy: 'rating', order: 'desc' };
      case 'title_asc':
        return { sortBy: 'title', order: 'asc' };
      default:
        return { sortBy: undefined, order: undefined };
    }
  };

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const skip = (currentPage - 1) * pageSize;
    const { sortBy, order } = parseSort(selectedSort);

    try {
      let res;
      if (searchQuery.trim()) {
        res = await productsAPI.searchProducts(searchQuery.trim(), {
          limit: pageSize,
          skip,
        });
      } else if (selectedCategory) {
        res = await productsAPI.getProductsByCategory(selectedCategory, {
          limit: pageSize,
          skip,
          sortBy,
          order,
        });
      } else {
        res = await productsAPI.getProducts({
          limit: pageSize,
          skip,
          sortBy,
          order,
        });
      }

      if (res.success && res.data) {
        let rawProducts = res.data.products || [];
        let total = res.data.total ?? rawProducts.length;

        // Overlay locally edited products
        rawProducts = rawProducts.map((p) => {
          if (editedProducts[p.id]) {
            return { ...p, ...editedProducts[p.id] };
          }
          return p;
        });

        // Filter out deleted products
        rawProducts = rawProducts.filter((p) => !deletedIds.has(p.id));

        // If on first page without search or category filter, include locally added products at top
        if (currentPage === 1 && !searchQuery.trim() && !selectedCategory) {
          const validCustom = customProducts.filter((p) => !deletedIds.has(p.id));
          rawProducts = [...validCustom, ...rawProducts].slice(0, pageSize);
          total += validCustom.length;
        }

        setProducts(rawProducts);
        setTotalProducts(total);
      } else {
        setError(res.error || ERROR_MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      setError(err.message || ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    searchQuery,
    selectedCategory,
    selectedSort,
    customProducts,
    editedProducts,
    deletedIds,
  ]);

  // Trigger fetch when dependency filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Add a new product
  const addProduct = async (productData) => {
    setIsLoading(true);
    try {
      const res = await productsAPI.addProduct(productData);
      const newProduct = {
        ...(res.success && res.data ? res.data : productData),
        id: res.data?.id || `local_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      const updatedCustom = [newProduct, ...customProducts];
      setCustomProducts(updatedCustom);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_CUSTOM_PRODUCTS, JSON.stringify(updatedCustom));
      }

      showToast(SUCCESS_MESSAGES.PRODUCT_ADDED, 'success');
      fetchProducts();
      return { success: true, data: newProduct };
    } catch (err) {
      showToast(err.message || 'Failed to add product', 'error');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing product
  const updateProduct = async (id, updatedFields) => {
    setIsLoading(true);
    try {
      await productsAPI.updateProduct(id, updatedFields);

      // Check if it was a local custom product
      const isCustom = customProducts.some((p) => String(p.id) === String(id));
      if (isCustom) {
        const updatedCustom = customProducts.map((p) =>
          String(p.id) === String(id) ? { ...p, ...updatedFields } : p
        );
        setCustomProducts(updatedCustom);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_CUSTOM_PRODUCTS, JSON.stringify(updatedCustom));
        }
      } else {
        const newEdited = { ...editedProducts, [id]: updatedFields };
        setEditedProducts(newEdited);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_EDITED_PRODUCTS, JSON.stringify(newEdited));
        }
      }

      showToast(SUCCESS_MESSAGES.PRODUCT_UPDATED, 'success');
      fetchProducts();
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Failed to update product', 'error');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await productsAPI.deleteProduct(id);

      // Update deleted IDs
      const updatedDeleted = new Set(deletedIds);
      updatedDeleted.add(id);
      updatedDeleted.add(Number(id));
      setDeletedIds(updatedDeleted);

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          STORAGE_KEY_DELETED_IDS,
          JSON.stringify(Array.from(updatedDeleted))
        );
      }

      // Optimistically remove from state
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      setTotalProducts((prev) => Math.max(0, prev - 1));

      showToast(SUCCESS_MESSAGES.PRODUCT_DELETED, 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
      return { success: false, error: err.message };
    }
  };

  // Get single product (including local overrides)
  const getProduct = async (id) => {
    // Check custom products
    const custom = customProducts.find((p) => String(p.id) === String(id));
    if (custom) return { success: true, data: custom };

    try {
      const res = await productsAPI.getProductById(id);
      if (res.success && res.data) {
        let product = res.data;
        if (editedProducts[id]) {
          product = { ...product, ...editedProducts[id] };
        }
        return { success: true, data: product };
      }
      return { success: false, error: res.error || ERROR_MESSAGES.PRODUCT_NOT_FOUND };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedSort('none');
    setCurrentPage(1);
  };

  const contextValue = useMemo(
    () => ({
      products,
      totalProducts,
      categories,
      isLoading,
      isCategoriesLoading,
      error,
      currentPage,
      pageSize,
      searchQuery,
      selectedCategory,
      selectedSort,
      viewMode,
      setCurrentPage,
      setPageSize,
      setSearchQuery,
      setSelectedCategory,
      setSelectedSort,
      setViewMode: handleSetViewMode,
      resetFilters,
      fetchProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
    }),
    [
      products,
      totalProducts,
      categories,
      isLoading,
      isCategoriesLoading,
      error,
      currentPage,
      pageSize,
      searchQuery,
      selectedCategory,
      selectedSort,
      viewMode,
      fetchProducts,
    ]
  );

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
