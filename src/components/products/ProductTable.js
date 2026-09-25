'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';
import { Eye, Edit, Trash2, Star } from 'lucide-react';

export const ProductTable = ({ products, isLoading, onDeleteClick }) => {
  if (isLoading) {
    return (
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Stock</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, idx) => (
              <tr key={idx}>
                <td><div className="skeleton" style={{ width: '28px', height: '16px' }} /></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '8px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div className="skeleton" style={{ width: '160px', height: '16px' }} />
                      <div className="skeleton" style={{ width: '80px', height: '12px' }} />
                    </div>
                  </div>
                </td>
                <td><div className="skeleton" style={{ width: '70px', height: '22px', borderRadius: '999px' }} /></td>
                <td><div className="skeleton" style={{ width: '55px', height: '16px' }} /></td>
                <td><div className="skeleton" style={{ width: '45px', height: '16px' }} /></td>
                <td><div className="skeleton" style={{ width: '65px', height: '22px', borderRadius: '999px' }} /></td>
                <td style={{ textAlign: 'right' }}>
                  <div className="skeleton" style={{ width: '80px', height: '30px', marginLeft: 'auto', borderRadius: '6px' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    <div className="table-container">
      <table className="product-table" id="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Stock</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockNum = Number(product.stock) || 0;
            let stockBadge = (
              <span className="badge badge-stock-in">{stockNum} In Stock</span>
            );
            if (stockNum === 0) {
              stockBadge = <span className="badge badge-stock-out">Out of Stock</span>;
            } else if (stockNum < 10) {
              stockBadge = <span className="badge badge-stock-low">{stockNum} Low Stock</span>;
            }

            const thumbnail =
              product.thumbnail ||
              (Array.isArray(product.images) && product.images[0]) ||
              '/placeholder.png';

            return (
              <tr key={product.id} id={`product-row-${product.id}`}>
                <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 600 }}>
                  #{product.id}
                </td>
                <td>
                  <div className="table-title-cell">
                    <img
                      src={thumbnail}
                      alt={product.title}
                      className="product-thumb-sm"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://via.placeholder.com/44x44/1a2135/94a3b8?text=IMG';
                      }}
                    />
                    <div>
                      <div className="table-product-title" title={product.title}>
                        <Link
                          href={ROUTES.PRODUCT_DETAIL(product.id)}
                          style={{ color: 'inherit' }}
                          className="hover-underline"
                        >
                          {product.title}
                        </Link>
                      </div>
                      <div className="table-product-brand">
                        {product.brand || product.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-category">{product.category}</span>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  ${Number(product.price).toFixed(2)}
                </td>
                <td>
                  <div className="rating-pill">
                    <Star size={14} fill="#fbbf24" stroke="none" />
                    <span>{Number(product.rating || 0).toFixed(1)}</span>
                  </div>
                </td>
                <td>{stockBadge}</td>
                <td>
                  <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                    <Link
                      href={ROUTES.PRODUCT_DETAIL(product.id)}
                      className="btn btn-secondary btn-icon btn-sm"
                      title="View Details"
                      id={`view-btn-${product.id}`}
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      href={ROUTES.EDIT_PRODUCT(product.id)}
                      className="btn btn-secondary btn-icon btn-sm"
                      title="Edit Product"
                      id={`edit-btn-${product.id}`}
                    >
                      <Edit size={15} />
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger btn-icon btn-sm"
                      title="Delete Product"
                      id={`delete-btn-${product.id}`}
                      onClick={() => onDeleteClick(product)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
