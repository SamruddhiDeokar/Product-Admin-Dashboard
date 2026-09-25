'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { VALIDATION_RULES, ROUTES } from '@/utils/constants';
import { Save, ArrowLeft, Image as ImageIcon, AlertCircle } from 'lucide-react';

export const ProductForm = ({ initialData = null, onSubmit, isSubmitting, mode = 'add' }) => {
  const { categories } = useProducts();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    stock: '',
    brand: '',
    rating: '4.5',
    discountPercentage: '0',
    thumbnail: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || '',
        price: initialData.price !== undefined ? String(initialData.price) : '',
        stock: initialData.stock !== undefined ? String(initialData.stock) : '',
        brand: initialData.brand || '',
        rating: initialData.rating !== undefined ? String(initialData.rating) : '4.5',
        discountPercentage: initialData.discountPercentage !== undefined ? String(initialData.discountPercentage) : '0',
        thumbnail: initialData.thumbnail || (Array.isArray(initialData.images) ? initialData.images[0] : '') || '',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  // Validation function
  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.trim().length < VALIDATION_RULES.PRODUCT_TITLE_MIN) {
          return `Title must be at least ${VALIDATION_RULES.PRODUCT_TITLE_MIN} characters`;
        }
        if (value.trim().length > VALIDATION_RULES.PRODUCT_TITLE_MAX) {
          return `Title cannot exceed ${VALIDATION_RULES.PRODUCT_TITLE_MAX} characters`;
        }
        return '';

      case 'category':
        if (!value) return 'Please select a category';
        return '';

      case 'price':
        if (value === '' || value === null) return 'Price is required';
        const numPrice = Number(value);
        if (isNaN(numPrice) || numPrice < VALIDATION_RULES.PRICE_MIN) {
          return `Price must be at least $${VALIDATION_RULES.PRICE_MIN}`;
        }
        if (numPrice > VALIDATION_RULES.PRICE_MAX) {
          return `Price cannot exceed $${VALIDATION_RULES.PRICE_MAX}`;
        }
        return '';

      case 'stock':
        if (value === '' || value === null) return 'Stock quantity is required';
        const numStock = Number(value);
        if (isNaN(numStock) || numStock < VALIDATION_RULES.STOCK_MIN) {
          return `Stock must be at least ${VALIDATION_RULES.STOCK_MIN}`;
        }
        if (numStock > VALIDATION_RULES.STOCK_MAX) {
          return `Stock cannot exceed ${VALIDATION_RULES.STOCK_MAX}`;
        }
        return '';

      case 'rating':
        if (value !== '') {
          const numRating = Number(value);
          if (isNaN(numRating) || numRating < VALIDATION_RULES.RATING_MIN || numRating > VALIDATION_RULES.RATING_MAX) {
            return `Rating must be between ${VALIDATION_RULES.RATING_MIN} and ${VALIDATION_RULES.RATING_MAX}`;
          }
        }
        return '';

      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.trim().length < VALIDATION_RULES.PRODUCT_DESCRIPTION_MIN) {
          return `Description must be at least ${VALIDATION_RULES.PRODUCT_DESCRIPTION_MIN} characters`;
        }
        if (value.trim().length > VALIDATION_RULES.PRODUCT_DESCRIPTION_MAX) {
          return `Description cannot exceed ${VALIDATION_RULES.PRODUCT_DESCRIPTION_MAX} characters`;
        }
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    const fieldNames = ['title', 'category', 'price', 'stock', 'rating', 'description'];
    const newErrors = {};
    let hasError = false;

    fieldNames.forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) {
        newErrors[field] = err;
        hasError = true;
      }
    });

    setErrors(newErrors);
    setTouched({
      title: true,
      category: true,
      price: true,
      stock: true,
      rating: true,
      description: true,
    });

    if (hasError) return;

    // Prepare payload
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      rating: Number(formData.rating || 0),
      discountPercentage: Number(formData.discountPercentage || 0),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem' }} id="product-form">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {mode === 'add' ? 'Create New Product' : `Edit Product #${initialData?.id || ''}`}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Fill in the information below according to product catalog guidelines.
          </p>
        </div>
        <Link href={ROUTES.DASHBOARD} className="btn btn-secondary btn-sm" id="btn-back-dashboard">
          <ArrowLeft size={15} />
          <span>Back to Catalog</span>
        </Link>
      </div>

      <div className="form-grid">
        {/* Title */}
        <div className="form-group col-span-2">
          <label className="form-label" htmlFor="product-title-input">
            Product Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="product-title-input"
            name="title"
            className={`form-input ${touched.title && errors.title ? 'error' : ''}`}
            placeholder="e.g. Wireless Noise Cancelling Headphones"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.title && errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label" htmlFor="product-category-input">
            Category <span className="required">*</span>
          </label>
          <select
            id="product-category-input"
            name="category"
            className={`form-select ${touched.category && errors.category ? 'error' : ''}`}
            value={formData.category}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          {touched.category && errors.category && <span className="form-error">{errors.category}</span>}
        </div>

        {/* Brand */}
        <div className="form-group">
          <label className="form-label" htmlFor="product-brand-input">Brand</label>
          <input
            type="text"
            id="product-brand-input"
            name="brand"
            className="form-input"
            placeholder="e.g. Sony, Apple, Nike"
            value={formData.brand}
            onChange={handleChange}
          />
        </div>

        {/* Price */}
        <div className="form-group">
          <label className="form-label" htmlFor="product-price-input">
            Price ($ USD) <span className="required">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            id="product-price-input"
            name="price"
            className={`form-input ${touched.price && errors.price ? 'error' : ''}`}
            placeholder="99.99"
            value={formData.price}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.price && errors.price && <span className="form-error">{errors.price}</span>}
        </div>

        {/* Stock */}
        <div className="form-group">
          <label className="form-label" htmlFor="product-stock-input">
            Inventory Units in Stock <span className="required">*</span>
          </label>
          <input
            type="number"
            min="0"
            id="product-stock-input"
            name="stock"
            className={`form-input ${touched.stock && errors.stock ? 'error' : ''}`}
            placeholder="50"
            value={formData.stock}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.stock && errors.stock && <span className="form-error">{errors.stock}</span>}
        </div>

        {/* Rating */}
        <div className="form-group">
          <label className="form-label" htmlFor="product-rating-input">Rating (0 - 5.0)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            id="product-rating-input"
            name="rating"
            className={`form-input ${touched.rating && errors.rating ? 'error' : ''}`}
            placeholder="4.5"
            value={formData.rating}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.rating && errors.rating && <span className="form-error">{errors.rating}</span>}
        </div>

        {/* Discount */}
        <div className="form-group">
          <label className="form-label" htmlFor="product-discount-input">Discount (%)</label>
          <input
            type="number"
            step="1"
            min="0"
            max="99"
            id="product-discount-input"
            name="discountPercentage"
            className="form-input"
            placeholder="15"
            value={formData.discountPercentage}
            onChange={handleChange}
          />
        </div>

        {/* Thumbnail Image URL */}
        <div className="form-group col-span-2">
          <label className="form-label" htmlFor="product-thumbnail-input">Image URL</label>
          <input
            type="url"
            id="product-thumbnail-input"
            name="thumbnail"
            className="form-input"
            placeholder="https://images.unsplash.com/... or DummyJSON image URL"
            value={formData.thumbnail}
            onChange={handleChange}
          />
          {formData.thumbnail && (
            <div className="image-preview-box">
              <img
                src={formData.thumbnail}
                alt="Product preview"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="form-group col-span-2">
          <label className="form-label" htmlFor="product-description-input">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="product-description-input"
            name="description"
            rows={4}
            className={`form-textarea ${touched.description && errors.description ? 'error' : ''}`}
            placeholder="Provide a comprehensive product description (min 10 characters)..."
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            {touched.description && errors.description ? (
              <span className="form-error">{errors.description}</span>
            ) : <span />}
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              {formData.description.length} / {VALIDATION_RULES.PRODUCT_DESCRIPTION_MAX}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--bg-card-border)' }}>
        <Link href={ROUTES.DASHBOARD} className="btn btn-secondary" id="btn-cancel-form">
          Cancel
        </Link>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          id="btn-submit-form"
        >
          <Save size={16} />
          <span>{isSubmitting ? 'Saving...' : mode === 'add' ? 'Create Product' : 'Save Changes'}</span>
        </button>
      </div>
    </form>
  );
};
