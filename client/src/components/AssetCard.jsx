import React from 'react';
import { MapPin, QrCode } from 'lucide-react';

export default function AssetCard({ asset, onViewQR, onReportFault }) {
  if (!asset) return null;

  const { assetTag, name, labRoom, category, specs, status, activeTickets, totalIncidents } = asset;

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Operational':
        return <span className="badge badge-green">Operational</span>;
      case 'Degraded':
        return <span className="badge badge-amber">Degraded</span>;
      case 'Under Maintenance':
        return <span className="badge badge-red">Maintenance</span>;
      default:
        return <span className="badge badge-blue">{st}</span>;
    }
  };

  return (
    <div
      className="tool-panel"
      style={{
        padding: '1.1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#ffffff',
      }}
    >
      <div>
        {/* Header Tag & Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#0369a1',
                background: '#e0f2fe',
                border: '1px solid #bae6fd',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
              }}
            >
              {assetTag}
            </span>
            <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
              {category}
            </span>
          </div>

          {getStatusBadge(status)}
        </div>

        {/* Name & Specs */}
        <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem', lineHeight: 1.3 }}>
          {name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
          <MapPin size={13} color="#94a3b8" />
          <span>{labRoom}</span>
        </div>

        <p style={{ color: '#475569', fontSize: '0.78rem', lineHeight: 1.45, marginBottom: '0.85rem', fontFamily: 'var(--font-mono)' }}>
          {specs}
        </p>
      </div>

      {/* Counters & Actions */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: '#64748b',
            paddingTop: '0.5rem',
            borderTop: '1px solid #f1f5f9',
            marginBottom: '0.75rem',
          }}
        >
          <span>Active: <strong style={{ color: activeTickets > 0 ? '#dc2626' : '#0f172a' }}>{activeTickets}</strong></span>
          <span>Total: <strong>{totalIncidents}</strong></span>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            onClick={() => onViewQR(asset)}
            className="btn-secondary"
            style={{ flex: 1, fontSize: '0.76rem', padding: '0.35rem 0.55rem' }}
          >
            <QrCode size={13} />
            <span>QR Tag</span>
          </button>

          <button
            onClick={() => onReportFault(asset)}
            className="btn-primary"
            style={{ flex: 1, fontSize: '0.76rem', padding: '0.35rem 0.55rem' }}
          >
            <span>Report &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
