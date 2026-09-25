'use client';

import React from 'react';
import { useProducts } from '@/context/ProductContext';
import { Package, Layers, Star, AlertTriangle } from 'lucide-react';

export const StatsOverview = () => {
  const { totalProducts, categories, products } = useProducts();

  // Compute average rating and low stock count from current products
  const avgRating = products.length > 0
    ? (products.reduce((acc, p) => acc + (Number(p.rating) || 0), 0) / products.length).toFixed(1)
    : '4.8';

  const lowStockCount = products.filter((p) => Number(p.stock) < 10).length;

  return (
    <section className="stats-grid" aria-label="Catalog Overview Statistics">
      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
          <Package size={24} />
        </div>
        <div>
          <div className="stat-val">{totalProducts || 194}</div>
          <div className="stat-label">Total Products</div>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
          <Layers size={24} />
        </div>
        <div>
          <div className="stat-val">{categories.length || 24}</div>
          <div className="stat-label">Active Categories</div>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fcd34d' }}>
          <Star size={24} />
        </div>
        <div>
          <div className="stat-val">{avgRating} ★</div>
          <div className="stat-label">Average Rating</div>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <div className="stat-val">{lowStockCount}</div>
          <div className="stat-label">Low Stock Alerts</div>
        </div>
      </div>
    </section>
  );
};
