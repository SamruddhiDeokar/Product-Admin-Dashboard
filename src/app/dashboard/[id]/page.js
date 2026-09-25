'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DeleteConfirmModal } from '@/components/products/DeleteConfirmModal';
import { useProducts } from '@/context/ProductContext';
import { ROUTES } from '@/utils/constants';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Package,
} from 'lucide-react';

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { getProduct, deleteProduct } = useProducts();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      setIsLoading(true);
      const res = await getProduct(id);
      if (isMounted) {
        if (res.success && res.data) {
          setProduct(res.data);
          const initialImg =
            res.data.thumbnail ||
            (Array.isArray(res.data.images) && res.data.images[0]) ||
            '';
          setSelectedImage(initialImg);
        } else {
          setError(res.error || 'Product not found');
        }
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
    return () => {
      isMounted = false;
    };
  }, [id, getProduct]);

  const handleDelete = async (productId) => {
    setIsDeleting(true);
    const res = await deleteProduct(productId);
    setIsDeleting(false);
    if (res.success) {
      router.push(ROUTES.DASHBOARD);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 0' }}>
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '3px solid rgba(99, 102, 241, 0.2)',
                borderTopColor: 'var(--accent-primary)',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1.25rem auto',
              }}
            />
            <p style={{ color: 'var(--text-secondary)' }}>Loading product specifications...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !product) {
    return (
      <ProtectedRoute>
        <div style={{ maxWidth: '700px', margin: '3rem auto', textAlign: 'center' }}>
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <AlertTriangle size={40} color="#f87171" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Product Not Found</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              The requested item (ID: {id}) could not be retrieved from the catalog.
            </p>
            <Link href={ROUTES.DASHBOARD} className="btn btn-primary">
              <ArrowLeft size={16} />
              <span>Return to Dashboard</span>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const stockNum = Number(product.stock) || 0;
  const priceNum = Number(product.price) || 0;
  const discount = product.discountPercentage ? Number(product.discountPercentage) : 0;
  const originalPrice = discount > 0 ? (priceNum / (1 - discount / 100)).toFixed(2) : null;
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.thumbnail
    ? [product.thumbnail]
    : [];

  return (
    <ProtectedRoute>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href={ROUTES.DASHBOARD} className="btn btn-secondary btn-sm" id="btn-back-to-products">
            <ArrowLeft size={15} />
            <span>Back to Inventory</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href={ROUTES.EDIT_PRODUCT(product.id)}
              className="btn btn-secondary btn-sm"
              id="btn-edit-detail-product"
            >
              <Edit size={15} />
              <span>Edit Details</span>
            </Link>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="btn btn-danger btn-sm"
              id="btn-delete-detail-product"
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Product Overview Section */}
        <div
          className="glass-panel"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 460px) 1fr',
            gap: '2.5rem',
            padding: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Gallery Column */}
          <div>
            <div
              style={{
                width: '100%',
                height: '380px',
                borderRadius: 'var(--radius-md)',
                background: '#0d111a',
                border: '1px solid var(--bg-card-border)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <img
                src={selectedImage || product.thumbnail}
                alt={product.title}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: '1.5rem' }}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://via.placeholder.com/400x380/161c2e/818cf8?text=Product+Image';
                }}
              />
              {discount > 0 && (
                <span className="card-discount-tag" style={{ top: '16px', left: '16px', fontSize: '0.8rem' }}>
                  SAVE {Math.round(discount)}%
                </span>
              )}
            </div>

            {/* Thumbnail carousel */}
            {images.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginTop: '1rem',
                  overflowX: 'auto',
                  paddingBottom: '0.5rem',
                }}
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      background: '#0d111a',
                      border:
                        selectedImage === img
                          ? '2px solid var(--accent-primary)'
                          : '1px solid var(--bg-card-border)',
                      padding: '4px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i}`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-category">{product.category}</span>
              {product.brand && (
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Brand: <strong style={{ color: 'var(--text-secondary)' }}>{product.brand}</strong>
                </span>
              )}
              {product.sku && (
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  SKU: {product.sku}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25 }}>
              {product.title}
            </h1>

            {/* Rating row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div className="rating-pill" style={{ fontSize: '1rem' }}>
                <Star size={18} fill="#fbbf24" stroke="none" />
                <span>{Number(product.rating || 0).toFixed(1)}</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                ({product.reviews?.length || 12} customer reviews)
              </span>
            </div>

            {/* Price Box */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--bg-card-border)',
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem',
              }}
            >
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
                ${priceNum.toFixed(2)}
              </span>
              {originalPrice && (
                <span style={{ fontSize: '1.15rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ${originalPrice}
                </span>
              )}
              <div style={{ marginLeft: 'auto' }}>
                {stockNum > 10 ? (
                  <span className="badge badge-stock-in" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                    <CheckCircle2 size={15} />
                    <span>In Stock ({stockNum} units)</span>
                  </span>
                ) : stockNum > 0 ? (
                  <span className="badge badge-stock-low" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                    <AlertTriangle size={15} />
                    <span>Low Stock ({stockNum} units left)</span>
                  </span>
                ) : (
                  <span className="badge badge-stock-out" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Description
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                {product.description || 'No detailed description available for this item.'}
              </p>
            </div>

            {/* Specifications Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '0.75rem',
                marginTop: '0.5rem',
              }}
            >
              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
                  <ShieldCheck size={14} />
                  <span>WARRANTY</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {product.warrantyInformation || '1-Year Standard'}
                </div>
              </div>

              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
                  <Truck size={14} />
                  <span>SHIPPING</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {product.shippingInformation || 'Ships in 3-5 days'}
                </div>
              </div>

              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fcd34d', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
                  <RotateCcw size={14} />
                  <span>RETURN POLICY</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {product.returnPolicy || '30-day money back'}
                </div>
              </div>

              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a78bfa', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
                  <Package size={14} />
                  <span>MIN ORDER</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {product.minimumOrderQuantity || 1} units
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Verified Customer Reviews ({product.reviews.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {product.reviews.map((rev, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--bg-card-border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{rev.reviewerName}</span>
                    <div className="rating-pill">
                      <Star size={13} fill="#fbbf24" stroke="none" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    &quot;{rev.comment}&quot;
                  </p>
                  <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {new Date(rev.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          product={product}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      </div>
    </ProtectedRoute>
  );
}
