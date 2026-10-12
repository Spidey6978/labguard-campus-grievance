import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api.js';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  MapPin,
  Cpu,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function MyTicketsPage({ setTab, onReportClick }) {
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
        return <span className="badge badge-cyan">Reported / In Queue</span>;
    }
  };

  const getPriorityBadge = (pr) => {
    switch (pr) {
      case 'Critical':
        return <span className="badge badge-red">Critical (24h)</span>;
      case 'High':
        return <span className="badge badge-amber">High (48h)</span>;
      case 'Medium':
        return <span className="badge badge-purple">Medium (72h)</span>;
      default:
        return <span className="badge badge-cyan">Low (120h)</span>;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-subtle)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '0.2rem',
          }}
        >
          SFIT &bull; Department of Information Technology
        </div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#f0f6fc', letterSpacing: '-0.02em' }}>
          My Filed Grievances ({tickets.length})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Status timeline, diagnostic notes, and SLA resolution tracking for your reported incidents.
        </p>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading your ticket history...
        </div>
      ) : tickets.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--text-subtle)',
            }}
          >
            <CheckCircle2 size={32} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            No Active Grievances Filed
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            All systems reported by you are operational or you haven't logged any hardware breakdowns yet.
          </p>
          <button onClick={() => setTab('report')} className="btn-primary">
            Report a Broken Workstation &rarr;
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {tickets.map((t) => (
            <div key={t._id} className="glass-panel glow-card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        color: 'var(--accent-cyan)',
                        fontSize: '0.95rem',
                      }}
                    >
                      {t.ticketNumber}
                    </span>
                    {getPriorityBadge(t.priority)}
                    {getStatusBadge(t.status)}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                    {t.title}
                  </h3>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                  <div>Filed {new Date(t.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  <div style={{ color: '#fbbf24', fontWeight: 600, marginTop: '0.2rem' }}>
                    SLA Target: {new Date(t.slaDeadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Workstation & Description */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem 1.25rem',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  <Cpu size={15} />
                  <span>Workstation: {t.asset?.assetTag} &bull; {t.asset?.name} ({t.asset?.labRoom})</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {t.description}
                </p>
              </div>

              {/* Technician Diagnostic Note (if in progress or resolved) */}
              {t.partsReplaced && (
                <div
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    background: t.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    border: t.status === 'Resolved' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
                    fontSize: '0.85rem',
                    color: t.status === 'Resolved' ? '#34d399' : '#fbbf24',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                  }}
                >
                  <Wrench size={16} />
                  <div>
                    <strong>Technician Action: </strong>
                    {t.partsReplaced}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
