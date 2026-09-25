'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProductForm } from '@/components/products/ProductForm';
import { useProducts } from '@/context/ProductContext';
import { ROUTES } from '@/utils/constants';

export default function AddProductPage() {
  const { addProduct } = useProducts();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    const result = await addProduct(formData);
    setIsSubmitting(false);

    if (result.success) {
      router.push(ROUTES.DASHBOARD);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} mode="add" />
      </div>
    </ProtectedRoute>
  );
}
