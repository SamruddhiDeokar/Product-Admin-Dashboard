'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { SORT_OPTIONS, PAGINATION, ROUTES, UI_CONFIG } from '@/utils/constants';
import { Search, X, LayoutGrid, LayoutList, Plus, RotateCcw } from 'lucide-react';

export const ProductFilters = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSort,
    setSelectedSort,
    pageSize,
    setPageSize,
    viewMode,
    setViewMode,
    categories,
    resetFilters,
    setCurrentPage,
  } = useProducts();

  // Local state for debounced search input
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync when reset occurs externally
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce search update
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch);
        setCurrentPage(1); // Reset to page 1 on new search
      }
    }, UI_CONFIG.DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [localSearch, searchQuery, setSearchQuery, setCurrentPage]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(searchQuery.trim() || selectedCategory || selectedSort !== 'none');

  return (
    <div className="glass-panel filter-bar">
      <div className="filter-top-row">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            id="product-search-input"
            className="search-input"
            placeholder="Search products by title, brand, or SKU..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <button
              className="search-clear"
              id="clear-search-btn"
              onClick={() => {
                setLocalSearch('');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="filter-controls-group">
          {/* Category Dropdown */}
          <select
            id="category-filter-select"
            className="select-control"
            value={selectedCategory}
            onChange={handleCategoryChange}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            id="sort-filter-select"
            className="select-control"
            value={selectedSort}
            onChange={handleSortChange}
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Page Size Selector */}
          <select
            id="page-size-select"
            className="select-control"
            value={pageSize}
            onChange={handlePageSizeChange}
            aria-label="Items per page"
          >
            {PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="view-toggle-group" role="group" aria-label="View toggle">
            <button
              id="view-table-btn"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <LayoutList size={18} />
            </button>
            <button
              id="view-grid-btn"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          {/* Add Product Button */}
          <Link href={ROUTES.ADD_PRODUCT} className="btn btn-primary" id="btn-add-product">
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span>Active filters:</span>
          {searchQuery && (
            <span className="badge badge-category">
              Query: &quot;{searchQuery}&quot;
            </span>
          )}
          {selectedCategory && (
            <span className="badge badge-category">
              Category: {selectedCategory}
            </span>
          )}
          {selectedSort !== 'none' && (
            <span className="badge badge-category">
              Sort: {SORT_OPTIONS.find((s) => s.value === selectedSort)?.label}
            </span>
          )}
          <button
            onClick={resetFilters}
            id="btn-reset-filters"
            className="btn btn-secondary btn-sm"
            style={{ padding: '2px 8px', fontSize: '0.75rem', gap: '4px' }}
          >
            <RotateCcw size={12} />
            Reset all
          </button>
        </div>
      )}
    </div>
  );
};
