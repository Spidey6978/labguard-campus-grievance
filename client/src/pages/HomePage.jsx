import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Search,
  Cpu,
} from 'lucide-react';
import { apiRequest } from '../utils/api.js';

export default function HomePage({ assets, setTab, onSelectAsset }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roomFilter, setRoomFilter] = useState('All');
  const [activeView, setActiveView] = useState('assets');
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await apiRequest('/tickets');
        if (res.success) setTickets(res.data);
      } catch (err) {
        console.warn('Could not load tickets:', err);
      }
    }
    fetchTickets();
  }, []);

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

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => setTab('report')}
            className="btn-primary"
          >
            <AlertCircle size={14} />
            <span>Report Issue</span>
          </button>

          <button
            onClick={() => setTab('assets')}
            className="btn-secondary"
          >
            <Cpu size={14} />
            <span>Registry</span>
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
                          <span className="badge badge-green">
                            <span>●</span> Operational
                          </span>
                        ) : asset.status === 'Degraded' ? (
                          <span className="badge badge-amber">
                            <span>▲</span> Degraded ({asset.activeTickets})
                          </span>
                        ) : (
                          <span className="badge badge-red">
                            <span>■</span> Maintenance ({asset.activeTickets})
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
