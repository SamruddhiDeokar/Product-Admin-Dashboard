'use client';

import React from 'react';
import { useProducts } from '@/context/ProductContext';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const Pagination = () => {
  const { currentPage, setCurrentPage, pageSize, totalProducts } = useProducts();

  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));

  if (totalProducts <= 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalProducts);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // Number of pages before and after current

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination-bar" aria-label="Pagination Navigation">
      <div className="pagination-info" id="pagination-info">
        Showing <strong style={{ color: 'var(--text-primary)' }}>{startItem}</strong> to{' '}
        <strong style={{ color: 'var(--text-primary)' }}>{endItem}</strong> of{' '}
        <strong style={{ color: 'var(--text-primary)' }}>{totalProducts}</strong> products
      </div>

      <div className="pagination-pages">
        <button
          className="page-btn"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          title="First Page"
          id="pagination-first-btn"
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          className="page-btn"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          title="Previous Page"
          id="pagination-prev-btn"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                style={{ padding: '0 0.4rem', color: 'var(--text-muted)' }}
              >
                &hellip;
              </span>
            );
          }
          return (
            <button
              key={p}
              className={`page-btn ${currentPage === p ? 'active' : ''}`}
              onClick={() => setCurrentPage(p)}
              id={`pagination-page-${p}`}
            >
              {p}
            </button>
          );
        })}

        <button
          className="page-btn"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          title="Next Page"
          id="pagination-next-btn"
        >
          <ChevronRight size={16} />
        </button>

        <button
          className="page-btn"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          title="Last Page"
          id="pagination-last-btn"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};
