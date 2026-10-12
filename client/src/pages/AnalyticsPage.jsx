import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api.js';
import {
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await apiRequest('/analytics/summary');
      if (res.success) setData(res.data);
    } catch (err) {
      console.warn('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExportCSV = async () => {
    try {
      const res = await apiRequest('/tickets');
      if (!res.success) throw new Error('Could not fetch tickets');

      const tickets = res.data;
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

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `SFIT_INFT_Lab_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(`Export error: ${err.message}`);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.85rem' }}>Loading logs...</div>;
  }

  if (!data) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.85rem' }}>No telemetry data.</div>;
  }

  const { fleet, tickets: tStats, labBreakdown, chronicAssets } = data;

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
            SLA &amp; Maintenance Logs
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
            SFIT INFT
          </span>
        </div>

        <button onClick={handleExportCSV} className="btn-primary" style={{ fontSize: '0.8rem' }}>
          <FileSpreadsheet size={14} />
          <span>Export CSV Log</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <div className="tool-panel" style={{ padding: '1rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>
            Fleet Uptime
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#15803d', marginTop: '0.15rem' }}>
            {fleet.uptimePercentage}%
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
            {fleet.operational} of {fleet.total} systems online
          </div>
        </div>

        <div className="tool-panel" style={{ padding: '1rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>
            Average MTTR
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0369a1', marginTop: '0.15rem' }}>
            {tStats.avgResolutionHours}h
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Mean resolution turnaround
          </div>
        </div>

        <div className="tool-panel" style={{ padding: '1rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>
            Active Tickets
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: tStats.open > 0 ? '#b45309' : '#0f172a', marginTop: '0.15rem' }}>
            {tStats.open}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
            {tStats.criticalOpen} critical
          </div>
        </div>

        <div className="tool-panel" style={{ padding: '1rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>
            Resolved Lifetime
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#7e22ce', marginTop: '0.15rem' }}>
            {tStats.resolved}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Bench certified restorations
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {/* Lab Breakdown */}
        <div className="tool-panel" style={{ padding: '1.1rem' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.85rem' }}>
            Outage Frequency by Lab
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {labBreakdown.map((lab, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#0f172a', fontWeight: 500 }}>{lab._id}</span>
                  <span style={{ color: lab.faulty > 0 ? '#b91c1c' : '#15803d', fontWeight: 600 }}>
                    {lab.faulty > 0 ? `${lab.faulty} Degraded` : '100% OK'}
                  </span>
                </div>
                <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, (lab.incidents / 4) * 100)}%`,
                      background: lab.faulty > 0 ? '#dc2626' : '#16a34a',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chronic Breakdown Assets */}
        <div className="tool-panel" style={{ padding: '1.1rem' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertTriangle size={15} color="#d97706" />
            <span>Recurring Breakdown Assets (&ge;2 Incidents)</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {chronicAssets.map((asset) => (
              <div
                key={asset._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '4px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0369a1', fontSize: '0.8rem' }}>
                    {asset.assetTag}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 500 }}>{asset.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{asset.labRoom}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-red" style={{ fontSize: '0.68rem' }}>
                    {asset.totalIncidents} Breakdowns
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
