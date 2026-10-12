import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api.js';
import {
  BarChart3,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [overviewRes, ticketsRes] = await Promise.all([
          apiRequest('/analytics/overview'),
          apiRequest('/tickets'),
        ]);

        if (overviewRes.success) setData(overviewRes.data);
        if (ticketsRes.success) setTickets(ticketsRes.data);
      } catch (err) {
        console.warn('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleExportCSV = () => {
    if (tickets.length === 0) return;

    const headers = [
      'Ticket Number',
      'Asset Tag',
      'Workstation Name',
      'Lab Room',
      'Category',
      'Priority',
      'Status',
      'Reported By',
      'Assigned Tech',
      'Parts Replaced',
      'Filed Timestamp',
      'Resolved Timestamp',
    ];

    const rows = tickets.map((t) => [
      `"${t.ticketNumber}"`,
      `"${t.asset?.assetTag || ''}"`,
      `"${t.asset?.name || ''}"`,
      `"${t.asset?.labRoom || ''}"`,
      `"${t.issueCategory}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.reportedBy?.name || ''} (${t.reportedBy?.usn || ''})"`,
      `"${t.assignedTo?.name || 'Unassigned'}"`,
      `"${t.partsReplaced || 'None'}"`,
      `"${new Date(t.createdAt).toLocaleString('en-IN')}"`,
      `"${t.resolvedAt ? new Date(t.resolvedAt).toLocaleString('en-IN') : 'Open'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `labguard_nba_maintenance_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !data) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Aggregating campus hardware metrics...
      </div>
    );
  }

  const { fleet, tickets: tStats, labBreakdown, chronicAssets, categoryBreakdown } = data;

  return (
    <div>
      {/* Header */}
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
              background: 'rgba(139, 92, 246, 0.1)',
              color: '#c084fc',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            <ShieldCheck size={14} />
            NBA Criterion 4 &bull; Technical Support &amp; Maintenance Audit
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
            Department Hardware Health &amp; SLA Compliance
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.35rem' }}>
            Auditable MTTR SLA tracking, equipment availability metrics, and chronic failure analysis.
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn-primary" style={{ fontSize: '0.88rem' }}>
          <FileSpreadsheet size={16} />
          Export NBA Audit CSV Log
        </button>
      </div>

      {/* KPI Cards */}
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
            Fleet Hardware Availability
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--accent-green)', marginTop: '0.3rem' }}>
            {fleet.uptimePercentage}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {fleet.operational} of {fleet.total} assets operational
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Mean Time To Resolution (MTTR)
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--accent-cyan)', marginTop: '0.3rem' }}>
            {tStats.avgResolutionHours}h
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Average turnaround SLA
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Active / Open Grievances
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: tStats.open > 0 ? '#f59e0b' : '#fff', marginTop: '0.3rem' }}>
            {tStats.open}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {tStats.criticalOpen} critical lab blockers
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Resolved Lifetime Incidents
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#c084fc', marginTop: '0.3rem' }}>
            {tStats.resolved}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Restored by technicians
          </div>
        </div>
      </div>

      {/* Two Column Section: Lab Outages vs Chronic Failure Assets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Lab Breakdown */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
            Outage Frequency by Campus Lab
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {labBreakdown.map((lab, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{lab._id}</span>
                  <span style={{ color: lab.faulty > 0 ? '#f87171' : 'var(--accent-green)', fontWeight: 700 }}>
                    {lab.faulty > 0 ? `${lab.faulty} Degraded` : '100% Operational'}
                  </span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, (lab.incidents / 4) * 100)}%`,
                      background: lab.faulty > 0 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #10b981, #00f2fe)',
                      borderRadius: '999px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chronic Failure Hardware (Lemon Detection) */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <AlertTriangle size={18} color="#f59e0b" />
            Chronic Breakdown Assets (Lemon Analysis)
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
            Hardware assets exhibiting &ge;2 recurring failures. Highlighted for replacement during annual budget audits.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {chronicAssets.map((asset) => (
              <div
                key={asset._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '0.88rem' }}>
                    {asset.assetTag}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#fff' }}>{asset.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{asset.labRoom}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-red" style={{ fontSize: '0.72rem' }}>
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
