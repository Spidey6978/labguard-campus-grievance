import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #30363d',
        backgroundColor: '#161b22',
        padding: '1rem 1.25rem',
        marginTop: 'auto',
        fontSize: '0.78rem',
        color: '#8b949e',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <span>SFIT &bull; Department of Information Technology</span>
          <span style={{ margin: '0 0.5rem', color: '#484f58' }}>|</span>
          <span>Campus Lab Equipment Maintenance Desk</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3fb950' }}></span>
            <span>API Online</span>
          </span>
          <span style={{ color: '#484f58' }}>|</span>
          <span>SLA State Machine v2.0</span>
        </div>
      </div>
    </footer>
  );
}
