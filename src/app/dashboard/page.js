'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { StatsOverview } from '@/components/products/StatsOverview';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/products/Pagination';
import { DeleteConfirmModal } from '@/components/products/DeleteConfirmModal';
import { useProducts } from '@/context/ProductContext';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const {
    products,
    isLoading,
    error,
    viewMode,
    deleteProduct,
    fetchProducts,
  } = useProducts();

  // Delete modal state
  const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (product) => {
    setSelectedProductToDelete(product);
  };

  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    await deleteProduct(id);
    setIsDeleting(false);
    setSelectedProductToDelete(null);
  };

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Page Title & Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
              Product Inventory
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Manage, monitor, and synchronize your product catalog across all sales channels.
            </p>
          </div>
          <button
            onClick={() => fetchProducts()}
            className="btn btn-secondary btn-sm"
            id="refresh-catalog-btn"
            title="Refresh product list"
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Analytics & Stats Overview */}
        <StatsOverview />

        {/* Filters & Actions Bar */}
        <ProductFilters />

        {/* Error Notification */}
        {error && (
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              borderColor: 'var(--danger-border)',
              background: 'var(--danger-bg)',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchProducts()}
              className="btn btn-danger btn-sm"
              id="retry-fetch-btn"
            >
              Retry
            </button>
          </div>
        )}

        {/* Product List Content (Table or Grid View) */}
        <section aria-label="Products Catalog Display">
          {viewMode === 'table' ? (
            <ProductTable
              products={products}
              isLoading={isLoading}
              onDeleteClick={handleDeleteClick}
            />
          ) : (
            <ProductGrid
              products={products}
              isLoading={isLoading}
              onDeleteClick={handleDeleteClick}
            />
          )}
        </section>

        {/* Pagination */}
        <Pagination />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={Boolean(selectedProductToDelete)}
          product={selectedProductToDelete}
          onClose={() => setSelectedProductToDelete(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </div>
    </ProtectedRoute>
  );
}
