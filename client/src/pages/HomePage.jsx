import React from 'react';
import {
  ShieldAlert,
  Wrench,
  AlertCircle,
  Cpu,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  QrCode,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function HomePage({ assets, setTab, onSelectAsset }) {
  const degradedAssets = assets.filter((a) => a.status !== 'Operational');

  return (
    <div>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '2.5rem 1rem 3.5rem', position: 'relative' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(0, 242, 254, 0.08)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            marginBottom: '1.5rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--accent-cyan)',
          }}
        >
          <Sparkles size={14} />
          St. Francis Institute of Technology (SFIT) &bull; Department of Information Technology
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
          }}
        >
          Institutional Lab Equipment &amp; <br />
          <span className="gradient-text-cyan">Grievance SLA Maintenance Desk</span>
        </h1>

        <p
          style={{
            maxWidth: '720px',
            margin: '0 auto 2.25rem',
            fontSize: '1.08rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}
        >
          Replaces outdated manual lab registers with instant QR workstation auditing, SLA-backed
          technician dispatch, and automated departmental hardware uptime analytics for NBA/NAAC compliance.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={() => setTab('report')}
            className="btn-primary"
            style={{ padding: '0.9rem 2rem', fontSize: '1rem', background: 'linear-gradient(135deg, #ef4444, #f59e0b)' }}
          >
            <AlertCircle size={18} />
            Report Fault / Grievance &rarr;
          </button>

          <button
            onClick={() => setTab('assets')}
            className="btn-secondary"
            style={{ padding: '0.9rem 1.8rem', fontSize: '1rem', borderColor: 'var(--border-glow)' }}
          >
            <QrCode size={18} color="var(--accent-cyan)" />
            Scan Workstation QR Tag
          </button>
        </div>

        {/* Live Metrics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginTop: '3.5rem',
            maxWidth: '960px',
            marginRight: 'auto',
            marginLeft: 'auto',
          }}
        >
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-green)' }}>
              94.2%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Fleet Hardware Uptime
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b' }}>
              &lt; 24h
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Critical SLA Turnaround
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
              8 Assets
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Across 4 Campus Labs
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#c084fc' }}>
              NBA / NAAC
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Audit-Ready CSV Logs
            </div>
          </div>
        </div>
      </section>

      {/* Active Hardware Outages / Degraded Systems Ticker */}
      {degradedAssets.length > 0 && (
        <section style={{ marginTop: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Active Maintenance Alerts
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                Equipment Currently Under Triage ({degradedAssets.length})
              </h2>
            </div>

            <button
              onClick={() => setTab('assets')}
              style={{ background: 'transparent', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.88rem' }}
            >
              View All Assets &rarr;
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {degradedAssets.map((asset) => (
              <div
                key={asset._id}
                className="glass-panel glow-card"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                      {asset.assetTag}
                    </span>
                    <span className={`badge ${asset.status === 'Degraded' ? 'badge-amber' : 'badge-red'}`}>
                      {asset.status}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                    {asset.name}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                    📍 {asset.labRoom}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectAsset(asset);
                    setTab('report');
                  }}
                  className="btn-secondary"
                  style={{ width: '100%', fontSize: '0.82rem', justifyContent: 'space-between' }}
                >
                  <span>File Additional Symptom</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic Problem Statement Defense Callout (Viva Gold) */}
      <section
        className="glass-panel"
        style={{
          marginTop: '4rem',
          padding: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          borderColor: 'rgba(0, 242, 254, 0.25)',
        }}
      >
        <div style={{ maxWidth: '840px' }}>
          <div className="badge badge-cyan" style={{ marginBottom: '1rem' }}>
            Institutional Problem Statement &amp; Accreditation Utility
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
            Why LabGuard Replaces Antiquated Physical Lab Registers
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            In traditional university engineering departments, equipment breakdowns (BSOD crashes,
            damaged HDMI cables, dead LAN sockets, malfunctioning SMPS) are logged onto paper books that
            rarely get reviewed. This causes workstation downtime for weeks and disrupts practical exam
            batches. LabGuard enforces an SLA state machine, attaches dynamic QR codes to individual bench
            workstations, and exports cryptographically verifiable maintenance audit logs for NBA/NAAC Tier-1
            accreditation reviews.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
              <CheckCircle2 size={18} color="var(--accent-green)" />
              Workstation Dynamic QR Asset Tags
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
              <CheckCircle2 size={18} color="var(--accent-green)" />
              Enforced SLA Turnaround Counter
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
              <CheckCircle2 size={18} color="var(--accent-green)" />
              Audit-Ready CSV/PDF Maintenance Log
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
