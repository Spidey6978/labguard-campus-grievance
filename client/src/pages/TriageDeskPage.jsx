import React, { useState, useEffect } from 'react';
import { apiRequest, playSound } from '../utils/api.js';
import {
  Wrench,
  Search,
  CheckCircle2,
  X,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TriageDeskPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Triage update modal state
  const [activeTriageTicket, setActiveTriageTicket] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('In-Progress');
  const [updateNote, setUpdateNote] = useState('');
  const [updateParts, setUpdateParts] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await apiRequest('/tickets');
      if (res.success) setTickets(res.data);
    } catch (err) {
      console.warn('Failed to fetch triage tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const formatSlaRemaining = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return { text: '🚨 SLA BREACHED', urgent: true, breached: true };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { text: `⏱ ${hours}h ${mins}m left`, urgent: hours < 12, breached: false };
  };

  const handleOpenTriage = (ticket) => {
    setActiveTriageTicket(ticket);
    setUpdateStatus(ticket.status === 'Reported' ? 'In-Progress' : ticket.status);
    setUpdateNote('');
    setUpdateParts(ticket.partsReplaced || '');
  };

  const handleSaveTriage = async (e) => {
    e.preventDefault();
    if (!activeTriageTicket) return;

    setSubmitting(true);
    try {
      await apiRequest(`/tickets/${activeTriageTicket._id}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status: updateStatus,
          note: updateNote,
          partsReplaced: updateParts,
        }),
      });

      playSound('success');
      if (updateStatus === 'Resolved') {
        try {
          confetti({ particleCount: 40, spread: 40, origin: { y: 0.6 } });
        } catch (e) {}
      }

      setActiveTriageTicket(null);
      fetchTickets();
    } catch (err) {
      alert(`Error updating ticket: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      t.ticketNumber?.toLowerCase().includes(q) ||
      t.title?.toLowerCase().includes(q) ||
      t.asset?.assetTag?.toLowerCase().includes(q) ||
      t.asset?.name?.toLowerCase().includes(q) ||
      t.reportedBy?.name?.toLowerCase().includes(q);

    return matchesStatus && matchesPriority && matchesSearch;
  });

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
            Triage Desk
          </h1>
          <span
            style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              padding: '0.1rem 0.4rem',
              borderRadius: '4px',
              background: '#fef3c7',
              color: '#b45309',
              fontWeight: 600,
            }}
          >
            {filteredTickets.length} in Queue
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        className="tool-panel"
        style={{
          padding: '0.65rem 0.85rem',
          marginBottom: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
          >
            <option value="All">All States</option>
            <option value="Reported">Reported</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            className="form-select"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical (24h)</option>
            <option value="High">High (48h)</option>
            <option value="Medium">Medium (72h)</option>
            <option value="Low">Low (120h)</option>
          </select>
        </div>

        <div style={{ position: 'relative', minWidth: '220px', flex: '1', maxWidth: '340px' }}>
          <Search
            size={14}
            color="#94a3b8"
            style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search Ticket, Asset, Reporter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '1.9rem', width: '100%', fontSize: '0.82rem', paddingBlock: '0.35rem' }}
          />
        </div>
      </div>

      {/* Ticket List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredTickets.map((t) => (
          <div key={t._id} className="tool-panel" style={{ padding: '1rem', background: '#ffffff' }}>
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
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#7e22ce', fontSize: '0.82rem' }}>
                    {t.ticketNumber}
                  </span>
                  <span className={`badge ${t.priority === 'Critical' ? 'badge-red' : t.priority === 'High' ? 'badge-amber' : 'badge-neutral'}`}>
                    {t.priority}
                  </span>
                  <span className={`badge ${t.status === 'Resolved' ? 'badge-green' : t.status === 'In-Progress' ? 'badge-amber' : 'badge-neutral'}`}>
                    {t.status}
                  </span>
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

              <button
                onClick={() => handleOpenTriage(t)}
                className="btn-primary"
                style={{ fontSize: '0.76rem', padding: '0.3rem 0.65rem' }}
              >
                <Wrench size={13} />
                <span>Update Triage</span>
              </button>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.65rem' }}>
              {t.description}
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                fontSize: '0.76rem',
                color: '#64748b',
                paddingTop: '0.5rem',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <span>Asset: <strong style={{ color: '#0f172a', fontFamily: 'var(--font-mono)' }}>{t.asset?.assetTag}</strong> ({t.asset?.labRoom})</span>
              <span>Reporter: <strong style={{ color: '#0f172a' }}>{t.reportedBy?.name}</strong></span>
              <span>Assigned: <strong style={{ color: '#b45309' }}>{t.assignedTo?.name || 'Unassigned'}</strong></span>
              <span>Target: <strong>{new Date(t.slaDeadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Triage Update Modal */}
      {activeTriageTicket && (
        <div className="modal-overlay" onClick={() => setActiveTriageTicket(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div
              style={{
                padding: '0.85rem 1.15rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#7e22ce', fontWeight: 700 }}>
                  {activeTriageTicket.ticketNumber}
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
                  Update Triage State
                </h3>
              </div>
              <button
                onClick={() => setActiveTriageTicket(null)}
                style={{ background: 'transparent', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTriage} style={{ padding: '1.15rem' }}>
              <div className="form-group">
                <label className="form-label">Workflow Status</label>
                <select
                  className="form-select"
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                >
                  <option value="Reported">Reported</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Resolved">Resolved / Bench Certified</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Replaced Parts (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Replaced 8GB DDR5 module, SATA lead"
                  value={updateParts}
                  onChange={(e) => setUpdateParts(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Technician Note</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Diagnostic note, MemTest86 results, etc."
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveTriageTicket(null)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ flex: 1.5 }}
                >
                  {submitting ? 'Saving...' : 'Commit Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
