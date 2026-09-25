'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProductForm } from '@/components/products/ProductForm';
import { useProducts } from '@/context/ProductContext';
import { ROUTES } from '@/utils/constants';

export default function EditProductPage({ params }) {
  // In Next.js 15, params can be a Promise
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { getProduct, updateProduct } = useProducts();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProduct = async () => {
      setIsLoading(true);
      const res = await getProduct(id);
      if (isMounted) {
        if (res.success && res.data) {
          setProduct(res.data);
        } else {
          setError(res.error || 'Failed to load product');
        }
        setIsLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
    return () => {
      isMounted = false;
    };
  }, [id, getProduct]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    const result = await updateProduct(id, formData);
    setIsSubmitting(false);

    if (result.success) {
      router.push(ROUTES.DASHBOARD);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {isLoading ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '3px solid rgba(99, 102, 241, 0.2)',
                borderTopColor: 'var(--accent-primary)',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem auto',
              }}
            />
            <p style={{ color: 'var(--text-secondary)' }}>Loading product details...</p>
          </div>
        ) : error ? (
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              textAlign: 'center',
              borderColor: 'var(--danger-border)',
              background: 'var(--danger-bg)',
              color: '#fca5a5',
            }}
          >
            <h3>Error Loading Product</h3>
            <p>{error}</p>
          </div>
        ) : (
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            mode="edit"
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
