import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  BarChart3,
  Users,
  CheckCircle2,
  Clock,
  Download,
  Plus,
  Search,
  Filter,
  Ticket,
  MapPin,
  Calendar,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export default function AdminDashboardPage({ events, onRefreshEvents }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [roster, setRoster] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(true);
  const [searchRoster, setSearchRoster] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    code: '',
    tagline: '',
    description: '',
    category: 'Coding',
    type: 'Individual',
    venue: '',
    date: 'March 29, 2026',
    time: '10:00 AM IST',
    capacity: 50,
    prizePool: '₹15,000',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Fetch stats and roster
  const fetchDashboardData = async () => {
    try {
      const statsRes = await apiRequest('/verify/stats');
      if (statsRes.success) setStats(statsRes.data);

      const rosterRes = await apiRequest('/registrations/roster');
      if (rosterRes.success) setRoster(rosterRes.data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setRosterLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter roster
  const filteredRoster = roster.filter((r) => {
    const matchesEvent =
      selectedEventFilter === 'All' || r.event?._id === selectedEventFilter || r.event?.code === selectedEventFilter;
    const matchesStatus = selectedStatusFilter === 'All' || r.status === selectedStatusFilter;
    const q = searchRoster.toLowerCase();
    const matchesSearch =
      !q ||
      r.ticketId?.toLowerCase().includes(q) ||
      r.user?.name?.toLowerCase().includes(q) ||
      r.user?.usn?.toLowerCase().includes(q) ||
      r.user?.department?.toLowerCase().includes(q);

    return matchesEvent && matchesStatus && matchesSearch;
  });

  // Export to CSV Functionality
  const handleExportCSV = () => {
    if (roster.length === 0) return;

    const headers = ['Ticket ID', 'Student Name', 'USN', 'Department', 'College', 'Event', 'Type', 'Status', 'Checked-In Time'];
    const rows = roster.map((r) => [
      `"${r.ticketId}"`,
      `"${r.user?.name || ''}"`,
      `"${r.user?.usn || ''}"`,
      `"${r.user?.department || ''}"`,
      `"${r.user?.college || ''}"`,
      `"${r.event?.title || ''}"`,
      `"${r.registrationType}"`,
      `"${r.status}"`,
      `"${r.checkedInAt ? new Date(r.checkedInAt).toLocaleString('en-IN') : 'N/A'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mosaic_2026_accreditation_roster_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create New Event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');

    try {
      await apiRequest('/events', {
        method: 'POST',
        body: JSON.stringify({
          ...newEvent,
          code: newEvent.code.toUpperCase(),
        }),
      });

      setShowAddEventModal(false);
      setNewEvent({
        title: '',
        code: '',
        tagline: '',
        description: '',
        category: 'Coding',
        type: 'Individual',
        venue: '',
        date: 'March 29, 2026',
        time: '10:00 AM IST',
        capacity: 50,
        prizePool: '₹15,000',
      });

      if (onRefreshEvents) onRefreshEvents();
      fetchDashboardData();
    } catch (err) {
      setAddError(err.message || 'Failed to create event');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div>
      {/* Page Title & Actions */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              background: 'rgba(168, 85, 247, 0.1)',
              color: '#c084fc',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            <BarChart3 size={14} />
            Command Center
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
            Organizer Analytics &amp; Accreditation Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.35rem' }}>
            Real-time turnout tracking, capacity monitoring, and certificate roster exports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleExportCSV} className="btn-secondary" style={{ fontSize: '0.88rem' }}>
            <FileSpreadsheet size={16} color="var(--accent-green)" />
            Export CSV Roster
          </button>
          <button
            onClick={() => setShowAddEventModal(true)}
            className="btn-purple"
            style={{ fontSize: '0.88rem' }}
          >
            <Plus size={16} />
            Add Track
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Registrations
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', marginTop: '0.3rem' }}>
            {stats?.totalRegistrations || roster.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
            Across {stats?.totalEvents || events.length} tracks
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Gate Accredited (Checked In)
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-green)', marginTop: '0.3rem' }}>
            {stats?.totalCheckedIn || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Verified with QR token
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Live Turnout Rate
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#a855f7', marginTop: '0.3rem' }}>
            {stats?.turnoutRate || 0}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Attendance conversion
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Awaiting Gate Entry
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fbbf24', marginTop: '0.3rem' }}>
            {stats?.pendingCheckIn || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Expected at doors
          </div>
        </div>
      </div>

      {/* Department Breakdown & Track Health */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}
      >
        {/* Department Distribution */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
            Department Turnout Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {(stats?.departmentBreakdown || [
              { department: 'Computer Science & Engineering', registrations: 12 },
              { department: 'Information Science & Engineering', registrations: 8 },
              { department: 'Artificial Intelligence & ML', registrations: 6 },
              { department: 'Electronics & Communication', registrations: 4 },
            ]).map((d, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{d.department}</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{d.registrations} delegates</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, d.registrations * 8)}%`,
                      background: 'linear-gradient(90deg, #8b5cf6, #00f2fe)',
                      borderRadius: '999px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track Capacity Utilization */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
            Track Capacity Utilization
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {events.slice(0, 5).map((ev) => {
              const p = Math.min(100, Math.round((ev.registeredCount / ev.capacity) * 100));
              return (
                <div key={ev._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{ev.title}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {ev.registeredCount} / {ev.capacity} ({p}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${p}%`,
                        background: p > 80 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #10b981, #00f2fe)',
                        borderRadius: '999px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Attendee Accreditation Roster Table */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              Accredited Delegate Master Roster
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Showing {filteredRoster.length} attendee records. Search or filter by gate status.
            </p>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search USN, Name, Ticket..."
                value={searchRoster}
                onChange={(e) => setSearchRoster(e.target.value)}
                style={{ paddingLeft: '2.2rem', fontSize: '0.82rem', padding: '0.45rem 0.75rem 0.45rem 2.2rem' }}
              />
            </div>

            <select
              className="form-select"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked-In">Checked-In</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-subtle)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Ticket ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Delegate</th>
                <th style={{ padding: '0.75rem 1rem' }}>USN</th>
                <th style={{ padding: '0.75rem 1rem' }}>Event</th>
                <th style={{ padding: '0.75rem 1rem' }}>Entry Type</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Verified At</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoster.map((r) => (
                <tr
                  key={r._id || r.ticketId}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.2s',
                  }}
                >
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {r.ticketId}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#fff' }}>
                    {r.user?.name}
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{r.user?.email}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {r.user?.usn || '-'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#fff' }}>
                    {r.event?.title}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                    {r.registrationType === 'Team' ? `Team (${r.team?.name || 'Squad'})` : 'Individual'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${r.status === 'Checked-In' ? 'badge-green' : 'badge-cyan'}`}>
                      {r.status === 'Checked-In' ? 'Checked-In' : 'Confirmed'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                    {r.checkedInAt ? new Date(r.checkedInAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Pending Door'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="modal-overlay" onClick={() => setShowAddEventModal(false)}>
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                Add New Mosaic Tech Track
              </h3>
              <button onClick={() => setShowAddEventModal(false)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ padding: '1.75rem' }}>
              {addError && (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  {addError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Track Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. AlgoSprint: Blind DSA Blitz"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Track Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="MOSAIC-ALGO"
                    value={newEvent.code}
                    onChange={(e) => setNewEvent({ ...newEvent, code: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  >
                    <option value="Coding">Coding</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Design">Design</option>
                    <option value="Flagship">Flagship</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Quick 1-sentence summary"
                  value={newEvent.tagline}
                  onChange={(e) => setNewEvent({ ...newEvent, tagline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Detailed competition description..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Venue</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Lab 304"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, capacity: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Prize Pool</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newEvent.prizePool}
                    onChange={(e) => setNewEvent({ ...newEvent, prizePool: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddEventModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={addLoading} className="btn-purple" style={{ flex: 1.5 }}>
                  {addLoading ? 'Publishing Track...' : 'Publish Track &rarr;'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
