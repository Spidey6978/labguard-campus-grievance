import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Search,
  Filter,
  Clock,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Wrench,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { apiRequest } from '../utils/api.js';

export default function HomePage({ assets, setTab, onSelectAsset }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roomFilter, setRoomFilter] = useState('All');
  const [activeView, setActiveView] = useState('assets'); // 'assets' | 'tickets'
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    async function fetchTickets() {
      setLoadingTickets(true);
      try {
        const res = await apiRequest('/tickets');
        if (res.success) {
          setTickets(res.data);
        }
      } catch (err) {
        console.warn('Could not load tickets:', err);
      } finally {
        setLoadingTickets(false);
      }
    }
    fetchTickets();
  }, []);

  // Filter Assets
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.assetTag?.toLowerCase().includes(search.toLowerCase()) ||
      asset.name?.toLowerCase().includes(search.toLowerCase()) ||
      asset.labRoom?.toLowerCase().includes(search.toLowerCase()) ||
      asset.specs?.toLowerCase().includes(search.toLowerCase()) ||
      asset.ipAddress?.includes(search);

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

  const formatSlaRemaining = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return { text: 'EXPIRED', urgent: true };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { text: `${hours}h ${mins}m left`, urgent: hours < 12 };
  };

  return (
    <div>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
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
          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#f0f6fc',
            }}
          >
            Lab Equipment SLA Desk
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time campus workstation monitoring, grievance triage queue, and SLA state machine.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setTab('report')}
            className="btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.95rem' }}
          >
            <AlertCircle size={15} />
            <span>Report Fault</span>
          </button>

          <button
            onClick={() => setTab('assets')}
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <Cpu size={15} />
            <span>Asset Registry</span>
          </button>
        </div>
      </div>

      {/* Control / Filter Bar (GitIngest Style) */}
      <div
        className="tool-panel"
        style={{
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {/* Search input + view toggles */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search
              size={15}
              color="var(--text-subtle)"
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Filter by tag (CC3-PC-14), room, spec, or IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.1rem', fontSize: '0.86rem', paddingBlock: '0.45rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <select
              className="form-select"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem', color: 'var(--text-main)' }}
            >
              {rooms.map((rm) => (
                <option key={rm} value={rm}>
                  {rm === 'All' ? 'All Labs' : rm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Pills & View Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            paddingTop: '0.25rem',
            borderTop: '1px solid #21262d',
          }}
        >
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setStatusFilter('All')}
              style={{
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
                background: statusFilter === 'All' ? '#21262d' : 'transparent',
                color: statusFilter === 'All' ? '#e6edf3' : '#8b949e',
                border: statusFilter === 'All' ? '1px solid #30363d' : '1px solid transparent',
              }}
            >
              All ({assets.length})
            </button>

            <button
              onClick={() => setStatusFilter('Issue')}
              style={{
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
                background: statusFilter === 'Issue' ? 'rgba(218, 54, 51, 0.15)' : 'transparent',
                color: statusFilter === 'Issue' ? '#f85149' : '#8b949e',
                border: statusFilter === 'Issue' ? '1px solid rgba(248, 81, 73, 0.4)' : '1px solid transparent',
              }}
            >
              Attention Required ({totalIssues})
            </button>

            <button
              onClick={() => setStatusFilter('Operational')}
              style={{
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
                background: statusFilter === 'Operational' ? 'rgba(35, 134, 54, 0.15)' : 'transparent',
                color: statusFilter === 'Operational' ? '#3fb950' : '#8b949e',
                border: statusFilter === 'Operational' ? '1px solid rgba(46, 160, 67, 0.4)' : '1px solid transparent',
              }}
            >
              Operational ({operationalCount})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={() => setActiveView('assets')}
              style={{
                fontSize: '0.78rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                background: activeView === 'assets' ? '#30363d' : 'transparent',
                color: activeView === 'assets' ? '#fff' : '#8b949e',
                border: '1px solid #30363d',
              }}
            >
              Systems Table
            </button>
            <button
              onClick={() => setActiveView('tickets')}
              style={{
                fontSize: '0.78rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                background: activeView === 'tickets' ? '#30363d' : 'transparent',
                color: activeView === 'tickets' ? '#fff' : '#8b949e',
                border: '1px solid #30363d',
              }}
            >
              Ticket Queue ({tickets.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Data Section */}
      {activeView === 'assets' ? (
        <div className="tool-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '130px' }}>Asset Tag</th>
                  <th>System Name &amp; Hardware Spec</th>
                  <th>Lab Location</th>
                  <th style={{ width: '110px' }}>IP Subnet</th>
                  <th style={{ width: '150px' }}>Status</th>
                  <th style={{ textAlign: 'right', width: '110px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No systems matched filter query.
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr key={asset._id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#58a6ff' }}>
                        {asset.assetTag}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#e6edf3' }}>{asset.name}</div>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-mono)',
                            marginTop: '0.15rem',
                          }}
                        >
                          {asset.specs}
                        </div>
                      </td>
                      <td style={{ color: '#c9d1d9', fontSize: '0.82rem' }}>{asset.labRoom}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                        {asset.ipAddress || 'DHCP'}
                      </td>
                      <td>
                        {asset.status === 'Operational' ? (
                          <span className="badge badge-green">
                            <span style={{ fontSize: '0.6rem' }}>●</span> Operational
                          </span>
                        ) : asset.status === 'Degraded' ? (
                          <span className="badge badge-amber">
                            <span style={{ fontSize: '0.6rem' }}>▲</span> Degraded ({asset.activeTickets})
                          </span>
                        ) : (
                          <span className="badge badge-red">
                            <span style={{ fontSize: '0.6rem' }}>■</span> Maintenance ({asset.activeTickets})
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            onSelectAsset(asset);
                            setTab('report');
                          }}
                          className="btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                          title="Report symptom on this workstation"
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
        /* Live Incident Ticket Queue */
        <div className="tool-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Ticket #</th>
                  <th style={{ width: '110px' }}>Asset</th>
                  <th>Reported Symptom &amp; Notes</th>
                  <th style={{ width: '100px' }}>Priority</th>
                  <th style={{ width: '130px' }}>Status</th>
                  <th style={{ width: '140px' }}>SLA Target</th>
                  <th style={{ textAlign: 'right', width: '90px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No pending tickets in queue.
                    </td>
                  </tr>
                ) : (
                  tickets.map((t) => {
                    const sla = formatSlaRemaining(t.slaDeadline);
                    return (
                      <tr key={t._id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#bc8cff' }}>
                          {t.ticketNumber}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: '#58a6ff' }}>
                          {t.asset?.assetTag || 'N/A'}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#e6edf3' }}>{t.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {t.description?.slice(0, 85)}...
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
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                          {t.status === 'Resolved' ? (
                            <span style={{ color: '#3fb950' }}>Resolved</span>
                          ) : sla ? (
                            <span style={{ color: sla.urgent ? '#f85149' : '#d29922' }}>{sla.text}</span>
                          ) : (
                            <span style={{ color: 'var(--text-subtle)' }}>N/A</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => setTab('triage')}
                            className="btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
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
