'use client';

import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, product, onClose, onConfirm, isDeleting }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 id="modal-title" className="modal-title" style={{ margin: 0 }}>
              Confirm Deletion
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ID #{product.id}
            </span>
          </div>
        </div>

        <p className="modal-body">
          Are you sure you want to delete{' '}
          <strong style={{ color: 'var(--text-primary)' }}>&quot;{product.title}&quot;</strong>? This action will remove the product from the current catalog.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
            id="cancel-delete-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(product.id)}
            disabled={isDeleting}
            id="confirm-delete-btn"
          >
            <Trash2 size={15} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Product'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
