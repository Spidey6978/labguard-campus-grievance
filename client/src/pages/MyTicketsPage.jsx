import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api.js';
import {
  Inbox,
  CheckCircle2,
  Cpu,
  Wrench,
} from 'lucide-react';

export default function MyTicketsPage({ setTab }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const res = await apiRequest('/tickets/my');
        if (res.success) setTickets(res.data);
      } catch (err) {
        console.warn('Could not load user tickets:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Resolved':
      case 'Closed':
        return <span className="badge badge-green">Resolved</span>;
      case 'In-Progress':
        return <span className="badge badge-amber">In-Progress</span>;
      case 'Reported':
      default:
        return <span className="badge badge-neutral">Reported</span>;
    }
  };

  const formatSlaRemaining = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return { text: '🚨 SLA BREACHED', urgent: true, breached: true };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { text: `⏱ ${hours}h ${mins}m left`, urgent: hours < 12, breached: false };
  };

  const getPriorityBadge = (pr) => {
    switch (pr) {
      case 'Critical':
        return <span className="badge badge-red">Critical (24h)</span>;
      case 'High':
        return <span className="badge badge-amber">High (48h)</span>;
      case 'Medium':
        return <span className="badge badge-neutral">Medium (72h)</span>;
      default:
        return <span className="badge badge-neutral">Low</span>;
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            My Filed Tickets
          </h1>
          <span
            style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              padding: '0.1rem 0.4rem',
              borderRadius: '4px',
              background: '#f1f5f9',
              color: '#64748b',
              fontWeight: 600,
            }}
          >
            {tickets.length} Total
          </span>
        </div>

        <button onClick={() => setTab('report')} className="btn-primary" style={{ fontSize: '0.8rem' }}>
          + Report Fault
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.85rem' }}>
          Loading tickets...
        </div>
      ) : tickets.length === 0 ? (
        <div className="tool-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center', maxWidth: '480px', margin: '2rem auto' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              color: '#64748b',
            }}
          >
            <CheckCircle2 size={24} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
            No tickets filed
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1rem' }}>
            You haven't logged any hardware incidents yet.
          </p>
          <button onClick={() => setTab('report')} className="btn-primary">
            Report an Issue &rarr;
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tickets.map((t) => (
            <div key={t._id} className="tool-panel" style={{ padding: '1.1rem', background: '#ffffff' }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  marginBottom: '0.5rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: '#7e22ce',
                        fontSize: '0.82rem',
                      }}
                    >
                      {t.ticketNumber}
                    </span>
                    {getPriorityBadge(t.priority)}
                    {getStatusBadge(t.status)}
                    {(() => {
                      const sla = formatSlaRemaining(t.slaDeadline);
                      if (!sla || t.status === 'Resolved' || t.status === 'Closed') return null;
                      return (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            color: sla.breached ? '#ffffff' : sla.urgent ? '#dc2626' : '#b45309',
                            background: sla.breached ? '#dc2626' : sla.urgent ? '#fee2e2' : '#fef3c7',
                            fontWeight: 700,
                            padding: '0.12rem 0.45rem',
                            borderRadius: '4px',
                          }}
                        >
                          {sla.text}
                        </span>
                      );
                    })()}
                  </div>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 600, color: '#0f172a' }}>
                    {t.title}
                  </h3>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.74rem', color: '#64748b' }}>
                  <div>Filed {new Date(t.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  <div style={{ color: '#b45309', fontWeight: 600, marginTop: '0.1rem' }}>
                    SLA: {new Date(t.slaDeadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Workstation & Description */}
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: '4px',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid #e2e8f0',
                  marginBottom: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0369a1', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                  <Cpu size={13} />
                  <span>{t.asset?.assetTag} &bull; {t.asset?.name} ({t.asset?.labRoom})</span>
                </div>
                <p style={{ color: '#475569', fontSize: '0.8rem', lineHeight: 1.45 }}>
                  {t.description}
                </p>
              </div>

              {/* Resolution / Parts Replaced note */}
              {t.partsReplaced && (
                <div style={{ fontSize: '0.76rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#dcfce7', padding: '0.4rem 0.65rem', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                  <Wrench size={13} />
                  <span><strong>Technician Note:</strong> {t.partsReplaced}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
