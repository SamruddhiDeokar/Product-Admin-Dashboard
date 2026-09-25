'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';
import { Eye, Edit, Trash2, Star } from 'lucide-react';

export const ProductGrid = ({ products, isLoading, onDeleteClick }) => {
  if (isLoading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="product-card" style={{ height: '380px' }}>
            <div className="skeleton" style={{ width: '100%', height: '200px' }} />
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              <div className="skeleton" style={{ width: '60px', height: '18px', borderRadius: '999px' }} />
              <div className="skeleton" style={{ width: '80%', height: '20px' }} />
              <div className="skeleton" style={{ width: '100%', height: '36px' }} />
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                <div className="skeleton" style={{ width: '70px', height: '24px' }} />
                <div className="skeleton" style={{ width: '50px', height: '24px' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          color: 'var(--text-secondary)',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📦</div>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          No Products Found
        </h3>
        <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '0.9rem' }}>
          Try adjusting your search criteria, clearing category filters, or add a new product to your inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid" id="products-grid">
      {products.map((product) => {
        const stockNum = Number(product.stock) || 0;
        let stockBadge = (
          <span className="badge badge-stock-in">{stockNum} In Stock</span>
        );
        if (stockNum === 0) {
          stockBadge = <span className="badge badge-stock-out">Out of Stock</span>;
        } else if (stockNum < 10) {
          stockBadge = <span className="badge badge-stock-low">{stockNum} Left</span>;
        }

        const thumbnail =
          product.thumbnail ||
          (Array.isArray(product.images) && product.images[0]) ||
          'https://via.placeholder.com/300x200/161c2e/818cf8?text=Product';

        const discount = product.discountPercentage
          ? Math.round(product.discountPercentage)
          : null;

        return (
          <div key={product.id} className="product-card" id={`card-product-${product.id}`}>
            <div className="product-card-media">
              <img
                src={thumbnail}
                alt={product.title}
                className="product-card-img"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://via.placeholder.com/300x200/161c2e/818cf8?text=Product';
                }}
              />
              {discount && discount > 0 && (
                <span className="card-discount-tag">-{discount}%</span>
              )}
            </div>

            <div className="product-card-body">
              <div className="card-meta-row">
                <span className="badge badge-category">{product.category}</span>
                <div className="rating-pill">
                  <Star size={13} fill="#fbbf24" stroke="none" />
                  <span>{Number(product.rating || 0).toFixed(1)}</span>
                </div>
              </div>

              <h4 className="card-title" title={product.title}>
                <Link href={ROUTES.PRODUCT_DETAIL(product.id)} style={{ color: 'inherit' }}>
                  {product.title}
                </Link>
              </h4>

              <p className="card-desc">{product.description || 'No description provided.'}</p>

              <div className="card-price-row">
                <div>
                  <span className="card-price">${Number(product.price).toFixed(2)}</span>
                  {product.brand && (
                    <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      by {product.brand}
                    </span>
                  )}
                </div>
                <div>{stockBadge}</div>
              </div>

              <div className="card-actions-row">
                <Link
                  href={ROUTES.PRODUCT_DETAIL(product.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                  id={`card-view-${product.id}`}
                >
                  <Eye size={14} />
                  <span>View</span>
                </Link>
                <Link
                  href={ROUTES.EDIT_PRODUCT(product.id)}
                  className="btn btn-secondary btn-icon btn-sm"
                  title="Edit Product"
                  id={`card-edit-${product.id}`}
                >
                  <Edit size={14} />
                </Link>
                <button
                  type="button"
                  className="btn btn-danger btn-icon btn-sm"
                  title="Delete Product"
                  onClick={() => onDeleteClick(product)}
                  id={`card-delete-${product.id}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
