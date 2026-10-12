import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        padding: '0.85rem 1rem',
        marginTop: 'auto',
        fontSize: '0.76rem',
        color: '#64748b',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        style={{
          maxWidth: '1140px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div>
          <span>SFIT &bull; Department of Information Technology</span>
          <span style={{ margin: '0 0.4rem', color: '#cbd5e1' }}>|</span>
          <span>Lab Equipment Desk</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
            <span>API Online</span>
          </span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span>SLA v2.0</span>
        </div>
      </div>
    </footer>
  );
}
