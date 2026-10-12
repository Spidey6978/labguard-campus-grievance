import React from 'react';
import { Cpu, MapPin, AlertCircle, QrCode, ArrowRight, ShieldCheck, Wrench } from 'lucide-react';

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
        return <span className="badge badge-red">Under Maintenance</span>;
      default:
        return <span className="badge badge-cyan">{st}</span>;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div>
        {/* Header Tag & Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#58a6ff',
                background: '#21262d',
                border: '1px solid #30363d',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
                letterSpacing: '0.04em',
              }}
            >
              {assetTag}
            </span>
            <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
              {category}
            </span>
          </div>

          {getStatusBadge(status)}
        </div>

        {/* Name & Specs */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem', lineHeight: 1.3 }}>
          {name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
          <MapPin size={14} color="var(--accent-blue)" />
          <span>{labRoom}</span>
        </div>

        <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
          {specs}
        </p>
      </div>

      {/* Incident Counters & Actions */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            paddingTop: '0.85rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: '1.15rem',
          }}
        >
          <span>Active Tickets: <strong style={{ color: activeTickets > 0 ? '#f87171' : '#fff' }}>{activeTickets}</strong></span>
          <span>Lifetime Incidents: <strong>{totalIncidents}</strong></span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onViewQR(asset)}
            className="btn-secondary"
            style={{ flex: 1, fontSize: '0.82rem', padding: '0.6rem 0.75rem' }}
          >
            <QrCode size={15} color="var(--accent-cyan)" />
            Bench QR
          </button>

          <button
            onClick={() => onReportFault(asset)}
            className="btn-primary"
            style={{
              flex: 1.4,
              fontSize: '0.82rem',
              padding: '0.6rem 0.85rem',
              background: status === 'Operational' ? undefined : 'linear-gradient(135deg, #f59e0b, #ef4444)',
            }}
          >
            <AlertCircle size={15} />
            Report Fault
          </button>
        </div>
      </div>
    </div>
  );
}
