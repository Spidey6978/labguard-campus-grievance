import React, { useState, useEffect } from 'react';
import { apiRequest, playSound } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Wrench,
  AlertCircle,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  Cpu,
  User,
  X,
  Send,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TriageDeskPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTriageTicket, setActiveTriageTicket] = useState(null);

  // Form State in Modal
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
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
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
          Hardware Maintenance Triage Queue
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Active incident queue. Update repair states, record replaced components, and certify bench restoration.
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          >
            <option value="All">All Ticket States</option>
            <option value="Reported">Reported / Open</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            className="form-select"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical (24h)</option>
            <option value="High">High (48h)</option>
            <option value="Medium">Medium (72h)</option>
            <option value="Low">Low (120h)</option>
          </select>
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search
            size={16}
            color="var(--text-subtle)"
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search Ticket, Asset, Reporter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '100%', borderRadius: '6px' }}
          />
        </div>
      </div>

      {/* Ticket List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredTickets.map((t) => (
          <div key={t._id} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem',
                marginBottom: '0.85rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {t.ticketNumber}
                  </span>
                  <span className={`badge ${t.priority === 'Critical' ? 'badge-red' : t.priority === 'High' ? 'badge-amber' : 'badge-cyan'}`}>
                    {t.priority} SLA
                  </span>
                  <span className={`badge ${t.status === 'Resolved' ? 'badge-green' : t.status === 'In-Progress' ? 'badge-amber' : 'badge-cyan'}`}>
                    {t.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  {t.title}
                </h3>
              </div>

              <button
                onClick={() => handleOpenTriage(t)}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
              >
                <Wrench size={14} />
                Update Triage &rarr;
              </button>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {t.description}
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-subtle)',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span>Workstation: <strong style={{ color: '#fff' }}>{t.asset?.assetTag}</strong> ({t.asset?.labRoom})</span>
              <span>Reporter: <strong style={{ color: '#fff' }}>{t.reportedBy?.name}</strong> ({t.reportedBy?.usn || 'Staff'})</span>
              <span>Assigned Tech: <strong style={{ color: '#fbbf24' }}>{t.assignedTo?.name || 'Unassigned'}</strong></span>
              <span>Target: <strong>{new Date(t.slaDeadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Triage Update Modal */}
      {activeTriageTicket && (
        <div className="modal-overlay" onClick={() => setActiveTriageTicket(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                padding: '1.5rem 1.75rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>
                  {activeTriageTicket.ticketNumber}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
                  Technician Action Desk
                </h3>
              </div>
              <button
                onClick={() => setActiveTriageTicket(null)}
                style={{ background: 'transparent', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTriage} style={{ padding: '1.75rem' }}>
              <div className="form-group">
                <label className="form-label">Workflow Status</label>
                <select
                  className="form-select"
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                >
                  <option value="In-Progress">In-Progress (Investigating / Requisitioning Spares)</option>
                  <option value="Resolved">Resolved (Repaired &amp; Stress Tested Operational)</option>
                  <option value="Closed">Closed (Bench Handover Complete)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Technician Diagnostic Action Log</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. Inspected RAM sticks; ran MemTest86; re-flashed BIOS firmware..."
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Parts Replaced / Hardware Consumables</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 1x 8GB DDR5 5600MHz RAM module, 1x Cat6 Patch Lead"
                  value={updateParts}
                  onChange={(e) => setUpdateParts(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
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
                  {submitting ? 'Saving...' : 'Commit Maintenance Log &rarr;'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
