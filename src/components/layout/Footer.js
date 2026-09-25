import React from 'react';

export const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--bg-card-border)',
        padding: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>NexusStore Management Suite &copy; {new Date().getFullYear()}</div>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <span>API: DummyJSON (194 items)</span>
          <span>Status: <strong style={{ color: '#10b981' }}>Operational</strong></span>
        </div>
      </div>
    </footer>
  );
};
