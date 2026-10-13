import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Search,
  Cpu,
  Clock,
  Wrench,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  Layers,
  Trash2,
} from 'lucide-react';
import { apiRequest } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function HomePage({ assets, setTab, onSelectAsset, onTicketDeleted }) {
  const { user, quickLogin } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roomFilter, setRoomFilter] = useState('All');
  const [activeView, setActiveView] = useState('assets');
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await apiRequest('/tickets');
        if (res.success) setTickets(res.data);
      } catch (err) {
        console.warn('Could not load tickets:', err);
      } finally {
        setLoadingTickets(false);
      }
    }
    fetchTickets();
  }, []);

  const formatSlaRemaining = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return { text: 'EXPIRED', urgent: true };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { text: `${hours}h ${mins}m left`, urgent: hours < 12 };
  };

  const handleDeleteTicket = async (ticket) => {
    if (!ticket) return;
    const confirmed = window.confirm(
      `⚠️ PERMANENT FRAUDULENT TICKET DELETION\n\n` +
      `Are you sure you want to delete ticket ${ticket.ticketNumber}?\n` +
      `• Issue: "${ticket.title}"\n` +
      `• Workstation: ${ticket.asset?.assetTag || 'N/A'}\n\n` +
      `This will permanently purge this fraudulent report from the SLA queue and automatically restore the workstation status.`
    );
    if (!confirmed) return;

    setDeletingId(ticket._id);
    try {
      const res = await apiRequest(`/tickets/${ticket._id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        setTickets((prev) => prev.filter((t) => t._id !== ticket._id));
        if (onTicketDeleted) onTicketDeleted();
      }
    } catch (err) {
      alert(`Failed to delete ticket: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Student specific tickets (Veer • PID-241034)
  const myTickets = user?.role === 'student'
    ? tickets.filter(
        (t) =>
          t.reportedBy?._id === user?._id ||
          t.reportedBy?.usn === user?.usn ||
          t.reportedBy?.email === user?.email ||
          t.reportedBy?.name?.toLowerCase().includes('veer')
      )
    : [];

  // Urgent tickets for technician
  const urgentTickets = tickets.filter(
    (t) => t.status !== 'Resolved' && t.status !== 'Closed'
  );

  // Filtered Assets
  const filteredAssets = assets.filter((asset) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      asset.assetTag?.toLowerCase().includes(q) ||
      asset.name?.toLowerCase().includes(q) ||
      asset.labRoom?.toLowerCase().includes(q) ||
      asset.specs?.toLowerCase().includes(q) ||
      asset.ipAddress?.includes(q);

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Issue'
        ? asset.status !== 'Operational'
        : asset.status === statusFilter;

    const matchesRoom = roomFilter === 'All' ? true : asset.labRoom === roomFilter;

    return matchesSearch && matchesStatus && matchesRoom;
  });

  const rooms = ['All', ...new Set(assets.map((a) => a.labRoom))];
  const totalIssues = assets.filter((a) => a.status !== 'Operational').length;
  const operationalCount = assets.filter((a) => a.status === 'Operational').length;

  // Direct CSV Export for HOD Admin
  const handleExportCSV = () => {
    try {
      const headers = [
        'Ticket ID',
        'Asset Tag',
        'Asset Name',
        'Lab Room',
        'Category',
        'Priority',
        'Status',
        'Reported By',
        'Reported At',
        'Resolved At',
        'Parts Replaced',
      ];

      const rows = tickets.map((t) => [
        `"${t.ticketNumber || ''}"`,
        `"${t.asset?.assetTag || ''}"`,
        `"${t.asset?.name || ''}"`,
        `"${t.asset?.labRoom || ''}"`,
        `"${t.issueCategory || ''}"`,
        `"${t.priority || ''}"`,
        `"${t.status || ''}"`,
        `"${t.reportedBy?.name || ''} (${t.reportedBy?.usn || ''})"`,
        `"${t.createdAt ? new Date(t.createdAt).toLocaleString() : ''}"`,
        `"${t.resolvedAt ? new Date(t.resolvedAt).toLocaleString() : ''}"`,
        `"${t.partsReplaced || ''}"`,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `SFIT_INFT_Lab_Audit_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Failed to export CSV: ' + err.message);
    }
  };

  /* =====================================================================
   * 1. STUDENT LANDING VIEW (Veer • PID-241034)
   * ===================================================================== */
  if (user?.role === 'student') {
    return (
      <div>
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Student Workbench
              </h1>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '4px',
                  background: '#e0f2fe',
                  color: '#0369a1',
                  fontWeight: 600,
                }}
              >
                Veer &bull; PID-241034
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
              SFIT &bull; Department of Information Technology &bull; Practical Lab Portal
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button onClick={() => setTab('report')} className="btn-primary" style={{ fontSize: '0.8rem' }}>
              <AlertCircle size={14} />
              <span>Report Fault on Bench</span>
            </button>
            <button onClick={() => setTab('my-tickets')} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
              <span>My Tickets ({myTickets.length})</span>
            </button>
          </div>
        </div>

        {/* Section 1: My Active Grievances & Live Resolution Status */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.6rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={15} color="#0369a1" />
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                My Filed Grievances &amp; Real-Time Resolution Status
              </h2>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              {myTickets.length} active record{myTickets.length === 1 ? '' : 's'}
            </span>
          </div>

          {myTickets.length === 0 ? (
            <div
              className="tool-panel"
              style={{
                padding: '1.25rem',
                textAlign: 'center',
                background: '#ffffff',
                border: '1px dashed #cbd5e1',
              }}
            >
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.5rem' }}>
                No active faults logged under PID-241034. Everything on your workstation is running smoothly!
              </div>
              <button
                onClick={() => setTab('report')}
                className="btn-secondary"
                style={{ fontSize: '0.76rem', padding: '0.25rem 0.6rem' }}
              >
                + Log a Fault on a Bench
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myTickets.map((t) => {
                const sla = formatSlaRemaining(t.slaDeadline);
                const latestNote = t.timeline?.[t.timeline.length - 1];

                return (
                  <div
                    key={t._id}
                    className="tool-panel"
                    style={{
                      padding: '1rem 1.15rem',
                      background: '#ffffff',
                      borderLeft: t.status === 'Resolved' ? '4px solid #16a34a' : '4px solid #d97706',
                    }}
                  >
                    {/* Top ticket metadata row */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            color: '#7e22ce',
                            fontSize: '0.85rem',
                          }}
                        >
                          {t.ticketNumber}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.74rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: '#f1f5f9',
                            color: '#0369a1',
                            fontWeight: 600,
                          }}
                        >
                          {t.asset?.assetTag || 'Lab Equipment'}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          {t.asset?.labRoom || 'SFIT Lab'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span
                          className={`badge ${
                            t.status === 'Resolved'
                              ? 'badge-green'
                              : t.status === 'In-Progress'
                              ? 'badge-amber'
                              : 'badge-neutral'
                          }`}
                        >
                          {t.status}
                        </span>
                        {sla && t.status !== 'Resolved' && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontFamily: 'var(--font-mono)',
                              color: sla.urgent ? '#dc2626' : '#d97706',
                              fontWeight: 600,
                              background: sla.urgent ? '#fee2e2' : '#fef3c7',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                            }}
                          >
                            ⏱ SLA: {sla.text}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.65rem' }}>
                      {t.description}
                    </div>

                    {/* Live Technician Diagnostic & Parts Replaced Box */}
                    {(latestNote?.note || t.partsReplaced) && (
                      <div
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '0.6rem 0.75rem',
                          fontSize: '0.76rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.3rem',
                        }}
                      >
                        {latestNote?.note && (
                          <div style={{ display: 'flex', gap: '0.4rem', color: '#334155' }}>
                            <span style={{ fontWeight: 600, color: '#0369a1' }}>Technician Field Log:</span>
                            <span>{latestNote.note}</span>
                          </div>
                        )}
                        {t.partsReplaced && (
                          <div style={{ display: 'flex', gap: '0.4rem', color: '#334155' }}>
                            <span style={{ fontWeight: 600, color: '#b45309' }}>Components Replaced:</span>
                            <span style={{ fontFamily: 'var(--font-mono)' }}>{t.partsReplaced}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Lab PC Registry (Check PC Status Before Sitting Down) */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.6rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={15} color="#0f172a" />
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                Lab Systems Availability (Check PC Health)
              </h2>
            </div>

            {/* Quick Filters */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Find PC (e.g. CC3-PC-14)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ fontSize: '0.78rem', padding: '0.25rem 0.55rem', width: '190px' }}
              />
              <select
                className="form-select"
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                style={{ fontSize: '0.78rem', padding: '0.25rem 0.45rem' }}
              >
                {rooms.map((rm) => (
                  <option key={rm} value={rm}>
                    {rm === 'All' ? 'All Labs' : rm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="tool-panel" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Workstation</th>
                    <th>Specification</th>
                    <th>Lab Room</th>
                    <th style={{ width: '120px' }}>Current Status</th>
                    <th style={{ textAlign: 'right', width: '90px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '1.25rem', color: '#64748b' }}>
                        No workstations found.
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map((asset) => (
                      <tr key={asset._id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0369a1' }}>
                          {asset.assetTag}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{asset.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                            {asset.specs}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: '#334155' }}>{asset.labRoom}</td>
                        <td>
                          {asset.status === 'Operational' ? (
                            <span className="badge badge-green">Operational</span>
                          ) : asset.status === 'Degraded' ? (
                            <span className="badge badge-amber">Degraded</span>
                          ) : (
                            <span className="badge badge-red">Under Repair</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              onSelectAsset(asset);
                              setTab('report');
                            }}
                            className="btn-secondary"
                            style={{ fontSize: '0.72rem', padding: '0.2rem 0.45rem' }}
                          >
                            Report Fault &rarr;
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================================
   * 2. TECHNICIAN LANDING VIEW (Ramesh Kumar • Hardware Desk)
   * ===================================================================== */
  if (user?.role === 'technician') {
    return (
      <div>
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Hardware Triage &amp; SLA Priority Desk
              </h1>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '4px',
                  background: '#fef3c7',
                  color: '#b45309',
                  fontWeight: 600,
                }}
              >
                Ramesh Kumar &bull; SFIT-TECH-04
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
              SFIT INFT &bull; Active Workstation Repair &amp; Component Replacement Ledger
            </div>
          </div>

          <button onClick={() => setTab('triage')} className="btn-primary" style={{ fontSize: '0.8rem' }}>
            <Wrench size={14} />
            <span>Open Triage Workbench &rarr;</span>
          </button>
        </div>

        {/* SLA Telemetry Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}
        >
          <div className="tool-panel" style={{ padding: '0.85rem 1rem', background: '#fff' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Active Breaches / Critical</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#dc2626', marginTop: '0.2rem' }}>
              {urgentTickets.filter((t) => t.priority === 'Critical').length}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#dc2626', marginTop: '0.1rem' }}>
              &lt; 24h SLA response mandated
            </div>
          </div>

          <div className="tool-panel" style={{ padding: '0.85rem 1rem', background: '#fff' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Benches In-Progress</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#d97706', marginTop: '0.2rem' }}>
              {urgentTickets.filter((t) => t.status === 'In-Progress').length}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.1rem' }}>
              Diagnostics / Parts in testing
            </div>
          </div>

          <div className="tool-panel" style={{ padding: '0.85rem 1rem', background: '#fff' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Fleet Operational Health</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#16a34a', marginTop: '0.2rem' }}>
              {operationalCount} / {assets.length}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#16a34a', marginTop: '0.1rem' }}>
              {Math.round((operationalCount / (assets.length || 1)) * 100)}% lab uptime
            </div>
          </div>
        </div>

        {/* Section: SLA Urgent Attention Queue */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.6rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldAlert size={15} color="#dc2626" />
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                SLA Priority Attention Queue
              </h2>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              {urgentTickets.length} pending ticket{urgentTickets.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="tool-panel" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '110px' }}>Ticket #</th>
                    <th style={{ width: '120px' }}>Workstation</th>
                    <th>Reported Symptom</th>
                    <th style={{ width: '100px' }}>Priority</th>
                    <th style={{ width: '110px' }}>Status</th>
                    <th style={{ width: '125px' }}>SLA Window</th>
                    <th style={{ textAlign: 'right', width: '130px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {urgentTickets.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                        No pending equipment tickets! All lab hardware certified operational.
                      </td>
                    </tr>
                  ) : (
                    urgentTickets.map((t) => {
                      const sla = formatSlaRemaining(t.slaDeadline);
                      return (
                        <tr key={t._id}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#7e22ce' }}>
                            {t.ticketNumber}
                          </td>
                          <td>
                            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0369a1' }}>
                              {t.asset?.assetTag || '-'}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              {t.asset?.labRoom}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{t.title}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              {t.description?.slice(0, 65)}...
                            </div>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                t.priority === 'Critical'
                                  ? 'badge-red'
                                  : t.priority === 'High'
                                  ? 'badge-amber'
                                  : 'badge-neutral'
                              }`}
                            >
                              {t.priority}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                t.status === 'In-Progress' ? 'badge-amber' : 'badge-neutral'
                              }`}
                            >
                              {t.status}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
                            {sla ? (
                              <span style={{ color: sla.urgent ? '#dc2626' : '#d97706', fontWeight: 600 }}>
                                {sla.text}
                              </span>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>-</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.3rem', alignItems: 'center' }}>
                              <button
                                onClick={() => setTab('triage')}
                                className="btn-primary"
                                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                              >
                                Triage &rarr;
                              </button>
                              <button
                                onClick={() => handleDeleteTicket(t)}
                                disabled={deletingId === t._id}
                                title="Dismiss / Delete fraudulent ticket"
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '0.2rem 0.45rem',
                                  background: '#fff1f2',
                                  color: '#e11d48',
                                  border: '1px solid #fecdd3',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  fontWeight: 600,
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section: Equipment Fleet Breakdown */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.6rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={15} color="#0f172a" />
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                Department Workstations (Hardware Health)
              </h2>
            </div>
            <button
              onClick={() => setTab('assets')}
              className="btn-secondary"
              style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem' }}
            >
              Full Registry &rarr;
            </button>
          </div>

          <div className="tool-panel" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Tag</th>
                    <th>System</th>
                    <th>Room</th>
                    <th style={{ width: '120px' }}>Status</th>
                    <th style={{ textAlign: 'right', width: '90px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.slice(0, 5).map((asset) => (
                    <tr key={asset._id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0369a1' }}>
                        {asset.assetTag}
                      </td>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{asset.name}</td>
                      <td style={{ fontSize: '0.78rem', color: '#334155' }}>{asset.labRoom}</td>
                      <td>
                        {asset.status === 'Operational' ? (
                          <span className="badge badge-green">Operational</span>
                        ) : asset.status === 'Degraded' ? (
                          <span className="badge badge-amber">Degraded</span>
                        ) : (
                          <span className="badge badge-red">Under Repair</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            onSelectAsset(asset);
                            setTab('report');
                          }}
                          className="btn-secondary"
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.45rem' }}
                        >
                          Log Issue
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================================
   * 3. HOD / ADMIN LANDING VIEW (Dr. S. N. Sharma)
   * ===================================================================== */
  if (user?.role === 'admin') {
    return (
      <div>
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Department Telemetry &amp; Fleet Audit
              </h1>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '4px',
                  background: '#f3e8ff',
                  color: '#7e22ce',
                  fontWeight: 600,
                }}
              >
                Dr. S. N. Sharma &bull; HOD INFT
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
              SFIT &bull; NBA Criterion 4 &amp; NAAC Institutional Infrastructure Compliance Audit
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={handleExportCSV}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', background: '#f8fafc', borderColor: '#cbd5e1' }}
            >
              <FileSpreadsheet size={14} color="#15803d" />
              <span>Export CSV Audit Log</span>
            </button>
            <button onClick={() => setTab('analytics')} className="btn-primary" style={{ fontSize: '0.8rem' }}>
              <BarChart3 size={14} />
              <span>Full SLA Logs &rarr;</span>
            </button>
          </div>
        </div>

        {/* Telemetry KPI Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}
        >
          <div className="tool-panel" style={{ padding: '0.85rem 1rem', background: '#fff' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Fleet Uptime</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#16a34a', marginTop: '0.2rem' }}>
              94.2%
            </div>
            <div style={{ fontSize: '0.68rem', color: '#16a34a', marginTop: '0.1rem' }}>
              Exceeds NBA &ge; 90% target
            </div>
          </div>

          <div className="tool-panel" style={{ padding: '0.85rem 1rem', background: '#fff' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Average MTTR</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0369a1', marginTop: '0.2rem' }}>
              14.5 hrs
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.1rem' }}>
              Mean Time to Resolution
            </div>
          </div>

          <div className="tool-panel" style={{ padding: '0.85rem 1rem', background: '#fff' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Total Monitored Fleet</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
              {assets.length} Units
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.1rem' }}>
              4 Departmental Labs (INFT)
            </div>
          </div>

          <div className="tool-panel" style={{ padding: '0.85rem 1rem', background: '#fff' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Open Incidents</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#dc2626', marginTop: '0.2rem' }}>
              {urgentTickets.length}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#dc2626', marginTop: '0.1rem' }}>
              Under technician triage
            </div>
          </div>
        </div>

        {/* Chronic "Lemon" Asset Alert for Replacement Budgeting */}
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '6px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
          }}
        >
          <AlertTriangle size={18} color="#d97706" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400e' }}>
              Chronic Failure Flagged (Workstation CC3-PC-14 &bull; 2 Repeat Incidents)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '0.15rem' }}>
              Motherboard SATA controller and RAM channel failure detected twice within 30 days. Recommend budget allocation for motherboard replacement with the SFIT Purchase Committee.
            </div>
          </div>
        </div>

        {/* Active Grievances & Fraudulent Ticket Audit (HOD) */}
        {urgentTickets.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.6rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldAlert size={15} color="#dc2626" />
                <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  Active Grievances &amp; Fraudulent Ticket Audit
                </h2>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                {urgentTickets.length} pending incident{urgentTickets.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="tool-panel" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '110px' }}>Ticket #</th>
                      <th style={{ width: '120px' }}>Workstation</th>
                      <th>Grievance Symptom</th>
                      <th style={{ width: '140px' }}>Reporter</th>
                      <th style={{ width: '90px' }}>Priority</th>
                      <th style={{ width: '100px' }}>Status</th>
                      <th style={{ textAlign: 'right', width: '130px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urgentTickets.map((t) => (
                      <tr key={t._id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#7e22ce' }}>
                          {t.ticketNumber}
                        </td>
                        <td>
                          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0369a1' }}>
                            {t.asset?.assetTag || '-'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {t.asset?.labRoom}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{t.title}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {t.description?.slice(0, 48)}...
                          </div>
                        </td>
                        <td style={{ fontSize: '0.76rem' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{t.reportedBy?.name || '-'}</div>
                          <div style={{ color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                            {t.reportedBy?.usn || t.reportedBy?.email || ''}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              t.priority === 'Critical'
                                ? 'badge-red'
                                : t.priority === 'High'
                                ? 'badge-amber'
                                : 'badge-neutral'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${t.status === 'In-Progress' ? 'badge-amber' : 'badge-neutral'}`}>
                            {t.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.3rem', alignItems: 'center' }}>
                            <button
                              onClick={() => setTab('triage')}
                              className="btn-secondary"
                              style={{ fontSize: '0.72rem', padding: '0.2rem 0.45rem' }}
                            >
                              Triage
                            </button>
                            <button
                              onClick={() => handleDeleteTicket(t)}
                              disabled={deletingId === t._id}
                              title="Purge fraudulent ticket"
                              style={{
                                fontSize: '0.72rem',
                                padding: '0.2rem 0.45rem',
                                background: '#fff1f2',
                                color: '#e11d48',
                                border: '1px solid #fecdd3',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                fontWeight: 600,
                              }}
                            >
                              <Trash2 size={12} />
                              <span>Fraud</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Master Department Systems Audit Table */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.6rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={15} color="#0f172a" />
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                Department Infrastructure Fleet Ledger
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search tag or room..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ fontSize: '0.78rem', padding: '0.25rem 0.55rem', width: '180px' }}
              />
              <select
                className="form-select"
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                style={{ fontSize: '0.78rem', padding: '0.25rem 0.45rem' }}
              >
                {rooms.map((rm) => (
                  <option key={rm} value={rm}>
                    {rm === 'All' ? 'All Labs' : rm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="tool-panel" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Asset Tag</th>
                    <th>Equipment Description</th>
                    <th>Lab Room</th>
                    <th style={{ width: '110px' }}>Static IP</th>
                    <th style={{ width: '120px' }}>Health Status</th>
                    <th style={{ width: '100px' }}>Incidents</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr key={asset._id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0369a1' }}>
                        {asset.assetTag}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{asset.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                          {asset.specs}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: '#334155' }}>{asset.labRoom}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#64748b' }}>
                        {asset.ipAddress || 'DHCP'}
                      </td>
                      <td>
                        {asset.status === 'Operational' ? (
                          <span className="badge badge-green">Operational</span>
                        ) : asset.status === 'Degraded' ? (
                          <span className="badge badge-amber">Degraded</span>
                        ) : (
                          <span className="badge badge-red">Maintenance</span>
                        )}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: '#475569' }}>
                        {asset.totalIncidents || 0} logged
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================================
   * 4. PUBLIC / GUEST LANDING VIEW
   * ===================================================================== */
  return (
    <div>
      {/* Top Header & Actions */}
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
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              Lab Equipment Desk
            </h1>
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                background: '#e0f2fe',
                color: '#0369a1',
                fontWeight: 600,
              }}
            >
              SFIT &bull; INFT
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.15rem' }}>
            Sign in as Student, Technician, or Admin using the quick demo options below.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button onClick={() => quickLogin('student')} className="btn-secondary" style={{ fontSize: '0.76rem' }}>
            <span>Student (Veer)</span>
          </button>
          <button onClick={() => quickLogin('technician')} className="btn-secondary" style={{ fontSize: '0.76rem' }}>
            <span>Tech (Ramesh)</span>
          </button>
          <button onClick={() => setTab('login')} className="btn-primary" style={{ fontSize: '0.76rem' }}>
            <span>Sign In &rarr;</span>
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div
        className="tool-panel"
        style={{
          padding: '0.65rem 0.85rem',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}
      >
        {/* Search & Room Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search
              size={14}
              color="#94a3b8"
              style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Filter by tag (CC3-PC-14), room, spec, or IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '1.9rem', fontSize: '0.82rem', paddingBlock: '0.35rem' }}
            />
          </div>

          <select
            className="form-select"
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
          >
            {rooms.map((rm) => (
              <option key={rm} value={rm}>
                {rm === 'All' ? 'All Labs' : rm}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Tabs & View Toggle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.4rem',
            paddingTop: '0.4rem',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={() => setStatusFilter('All')}
              style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                background: statusFilter === 'All' ? '#0f172a' : '#f1f5f9',
                color: statusFilter === 'All' ? '#ffffff' : '#64748b',
                fontWeight: 600,
              }}
            >
              All ({assets.length})
            </button>

            <button
              onClick={() => setStatusFilter('Issue')}
              style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                background: statusFilter === 'Issue' ? '#b91c1c' : '#fee2e2',
                color: statusFilter === 'Issue' ? '#ffffff' : '#b91c1c',
                fontWeight: 600,
              }}
            >
              Issues ({totalIssues})
            </button>

            <button
              onClick={() => setStatusFilter('Operational')}
              style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                background: statusFilter === 'Operational' ? '#15803d' : '#dcfce7',
                color: statusFilter === 'Operational' ? '#ffffff' : '#15803d',
                fontWeight: 600,
              }}
            >
              Operational ({operationalCount})
            </button>
          </div>

          {/* View Toggle */}
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            <button
              onClick={() => setActiveView('assets')}
              style={{
                fontSize: '0.74rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                background: activeView === 'assets' ? '#e2e8f0' : 'transparent',
                color: '#0f172a',
                fontWeight: activeView === 'assets' ? 600 : 500,
              }}
            >
              Systems Table
            </button>
            <button
              onClick={() => setActiveView('tickets')}
              style={{
                fontSize: '0.74rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                background: activeView === 'tickets' ? '#e2e8f0' : 'transparent',
                color: '#0f172a',
                fontWeight: activeView === 'tickets' ? 600 : 500,
              }}
            >
              Ticket Queue ({tickets.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Table View */}
      {activeView === 'assets' ? (
        <div className="tool-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Tag</th>
                  <th>System &amp; Spec</th>
                  <th>Room</th>
                  <th style={{ width: '110px' }}>IP</th>
                  <th style={{ width: '130px' }}>Status</th>
                  <th style={{ textAlign: 'right', width: '90px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                      No matching systems.
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr key={asset._id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0369a1' }}>
                        {asset.assetTag}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{asset.name}</div>
                        <div
                          style={{
                            fontSize: '0.74rem',
                            color: '#64748b',
                            fontFamily: 'var(--font-mono)',
                            marginTop: '0.1rem',
                          }}
                        >
                          {asset.specs}
                        </div>
                      </td>
                      <td style={{ color: '#334155', fontSize: '0.78rem' }}>{asset.labRoom}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#64748b' }}>
                        {asset.ipAddress || 'DHCP'}
                      </td>
                      <td>
                        {asset.status === 'Operational' ? (
                          <span className="badge badge-green">Operational</span>
                        ) : asset.status === 'Degraded' ? (
                          <span className="badge badge-amber">Degraded</span>
                        ) : (
                          <span className="badge badge-red">Maintenance</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            onSelectAsset(asset);
                            setTab('report');
                          }}
                          className="btn-secondary"
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.45rem' }}
                        >
                          Report &rarr;
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Ticket Queue View */
        <div className="tool-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '110px' }}>Ticket #</th>
                  <th style={{ width: '100px' }}>Asset</th>
                  <th>Symptom</th>
                  <th style={{ width: '90px' }}>Priority</th>
                  <th style={{ width: '110px' }}>Status</th>
                  <th style={{ width: '120px' }}>SLA</th>
                  <th style={{ textAlign: 'right', width: '80px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                      No active tickets.
                    </td>
                  </tr>
                ) : (
                  tickets.map((t) => {
                    const sla = formatSlaRemaining(t.slaDeadline);
                    return (
                      <tr key={t._id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#7e22ce' }}>
                          {t.ticketNumber}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: '#0369a1' }}>
                          {t.asset?.assetTag || '-'}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{t.title}</div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            {t.description?.slice(0, 70)}...
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              t.priority === 'Critical'
                                ? 'badge-red'
                                : t.priority === 'High'
                                ? 'badge-amber'
                                : 'badge-neutral'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              t.status === 'Resolved'
                                ? 'badge-green'
                                : t.status === 'In-Progress'
                                ? 'badge-amber'
                                : 'badge-neutral'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
                          {t.status === 'Resolved' ? (
                            <span style={{ color: '#16a34a' }}>Resolved</span>
                          ) : sla ? (
                            <span style={{ color: sla.urgent ? '#dc2626' : '#d97706', fontWeight: 600 }}>
                              {sla.text}
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>-</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => setTab('triage')}
                            className="btn-secondary"
                            style={{ fontSize: '0.72rem', padding: '0.2rem 0.45rem' }}
                          >
                            Triage &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
