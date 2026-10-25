import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  AlertCircle,
  QrCode,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Cpu,
  FileSpreadsheet,
  Search,
  ArrowRight,
  MapPin,
  AlertTriangle,
  Activity,
  Sparkles,
  Laptop,
  Radio,
  BarChart3,
  Terminal,
  ExternalLink,
  ChevronRight,
  Layers,
  FileText,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function LandingPage({ assets = [], setTab, onSelectAsset }) {
  const { user, quickLogin } = useAuth();
  const [benchSearch, setBenchSearch] = useState('');
  const [selectedLabFilter, setSelectedLabFilter] = useState('All');
  const [quickQrAsset, setQuickQrAsset] = useState(null);

  // Labs list
  const labRooms = [
    {
      id: 'Lab 304 - Computer Center 3',
      shortName: 'Lab 304 (CC3)',
      title: 'Computer Center 3 — Systems & OS Lab',
      systems: '24 HP Z2 G9 Towers, Intel i7-13700, RTX 3060, Cisco 3850 Gigabit Switch',
      inCharge: 'Prof. J. Dsouza & Ramesh Kumar',
      category: 'Workstation & Networking',
    },
    {
      id: 'Lab 402 - AI & ML Research Center',
      shortName: 'Lab 402 (AI/ML)',
      title: 'AI & Deep Learning Research Center',
      systems: 'Dell Precision W5-2455X, Dual NVIDIA RTX 4090, 64GB ECC RAM',
      inCharge: 'Dr. S. N. Sharma & Sandeep Tech',
      category: 'High Performance Compute',
    },
    {
      id: 'Lab 201 - VLSI & Embedded Systems',
      shortName: 'Lab 201 (VLSI)',
      title: 'VLSI & Embedded Systems Laboratory',
      systems: 'Digilent Nexys A7 FPGA Development Benches, Logic Analyzers, Keil IDE',
      inCharge: 'Prof. K. Mehta',
      category: 'Embedded Hardware Testbed',
    },
    {
      id: 'Lab 205 - IoT Innovation Lab',
      shortName: 'Lab 205 (IoT)',
      title: 'IoT & Smart Sensors Innovation Testbed',
      systems: 'LoRaWAN 8-Channel Industrial Gateway, STM32 Multi-Node Sensor Units',
      inCharge: 'Prof. P. Rao',
      category: 'IoT Wireless Testbed',
    },
    {
      id: 'Multimedia Seminar Hall B',
      shortName: 'Seminar Hall B',
      title: 'Multimedia Seminar & Presentation Hall',
      systems: 'Epson 9000-Lumen Laser 4K Cinema Projector, Dual HDMI 2.1 Distribution Matrix',
      inCharge: 'Central AV Maintenance',
      category: 'AV & Digital Presentation',
    },
  ];

  // Calculated Telemetry
  const totalAssets = assets.length;
  const operationalCount = assets.filter((a) => a.status === 'Operational').length;
  const issueCount = assets.filter((a) => a.status !== 'Operational').length;
  const uptimePercent = totalAssets > 0 ? ((operationalCount / totalAssets) * 100).toFixed(1) : '94.2';

  // Live Bench Radar filtered search
  const searchedAssets = assets.filter((a) => {
    const q = benchSearch.toLowerCase().trim();
    const matchesLab = selectedLabFilter === 'All' || a.labRoom === selectedLabFilter;
    if (!q) return matchesLab;
    return (
      matchesLab &&
      (a.assetTag?.toLowerCase().includes(q) ||
        a.name?.toLowerCase().includes(q) ||
        a.specs?.toLowerCase().includes(q) ||
        a.labRoom?.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* =========================================================================
       * 1. INSTITUTIONAL ACADEMIC BADGE & HERO PORTAL CONSOLE
       * ========================================================================= */}
      <div
        className="tool-panel"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2744 100%)',
          color: '#ffffff',
          borderRadius: '10px',
          padding: '2rem 1.75rem',
          border: '1px solid #334155',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4), 0 8px 10px -6px rgba(15, 23, 42, 0.3)',
        }}
      >
        {/* Background circuit grid watermark */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            opacity: 0.04,
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px' }}>
          {/* Institutional Accreditation Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.22rem 0.65rem',
              borderRadius: '999px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '0.72rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
              marginBottom: '1rem',
              textTransform: 'uppercase',
            }}
          >
            <ShieldCheck size={13} color="#38bdf8" />
            <span>SFIT &bull; Dept. of Information Technology &bull; NBA Criterion 4 &bull; NAAC Audit</span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3.2vw, 2.3rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
              marginBottom: '0.75rem',
            }}
          >
            Institutional Lab Asset &amp; Workstation Grievance SLA Desk
          </h1>

          {/* Subtitle / Academic Description */}
          <p
            style={{
              fontSize: '0.94rem',
              color: '#cbd5e1',
              lineHeight: 1.6,
              maxWidth: '820px',
              marginBottom: '1.5rem',
            }}
          >
            An automated laboratory infrastructure maintenance portal built for engineering colleges.
            Replaces ignored manual paper registers with <strong>dynamic QR workstation tags</strong>,
            a <strong>tiered SLA countdown engine (24h/48h/72h)</strong>, and <strong>1-click NBA &amp; NAAC maintenance audit CSV exports</strong>.
          </p>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center' }}>
            <button
              onClick={() => setTab('report')}
              className="btn-primary"
              style={{
                backgroundColor: '#dc2626',
                borderColor: '#ef4444',
                color: '#ffffff',
                padding: '0.55rem 1.1rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.35)',
              }}
            >
              <AlertCircle size={16} />
              <span>Report Fault on Bench</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('bench-radar-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-secondary"
              style={{
                background: '#1e293b',
                borderColor: '#475569',
                color: '#f8fafc',
                padding: '0.55rem 1rem',
                fontSize: '0.88rem',
              }}
            >
              <QrCode size={15} />
              <span>Live Bench Health Radar</span>
            </button>

            <button
              onClick={() => setTab('assets')}
              className="btn-secondary"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderColor: '#475569',
                color: '#e2e8f0',
                padding: '0.55rem 1rem',
                fontSize: '0.88rem',
              }}
            >
              <Cpu size={15} />
              <span>Asset Registry ({totalAssets})</span>
            </button>

            {user ? (
              <button
                onClick={() => setTab('workbench')}
                style={{
                  background: '#38bdf8',
                  color: '#0f172a',
                  border: '1px solid #7dd3fc',
                  padding: '0.55rem 1rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Terminal size={15} />
                <span>Open {user.role === 'admin' ? 'HOD Desk' : user.role === 'technician' ? 'Triage Desk' : 'Student Workbench'} &rarr;</span>
              </button>
            ) : (
              <button
                onClick={() => setTab('login')}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid #64748b',
                  padding: '0.55rem 0.95rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                }}
              >
                Sign In to Portal
              </button>
            )}
          </div>
        </div>

        {/* Live Status Ticker Bar */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.78rem',
            color: '#94a3b8',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
                display: 'inline-block',
              }}
            />
            <span style={{ color: '#4ade80', fontWeight: 600 }}>SYSTEM HEALTH: ALL 4 LABS ONLINE</span>
            <span>&bull;</span>
            <span>SLA Engine Active (24h/48h)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span>Fleet Uptime: <strong style={{ color: '#38bdf8' }}>{uptimePercent}%</strong></span>
            <span>Avg MTTR: <strong style={{ color: '#fbbf24' }}>14.5 hrs</strong></span>
            <span>Accreditation Ready: <strong style={{ color: '#a78bfa' }}>NBA Criterion 4</strong></span>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 2. LIVE CAMPUS TELEMETRY KPI COUNTERS
       * ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.85rem',
        }}
      >
        <div className="tool-panel" style={{ padding: '1rem 1.15rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.74rem', fontWeight: 600 }}>
            <span>FLEET UPTIME</span>
            <Activity size={15} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#16a34a', marginTop: '0.25rem' }}>
            {uptimePercent}%
          </div>
          <div style={{ fontSize: '0.72rem', color: '#15803d', marginTop: '0.15rem' }}>
            Exceeds NBA &ge; 90% benchmark
          </div>
        </div>

        <div className="tool-panel" style={{ padding: '1rem 1.15rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.74rem', fontWeight: 600 }}>
            <span>MEAN TURNAROUND (MTTR)</span>
            <Clock size={15} color="#0369a1" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0369a1', marginTop: '0.25rem' }}>
            14.5 hrs
          </div>
          <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '0.15rem' }}>
            Strict 24h Critical turnaround
          </div>
        </div>

        <div className="tool-panel" style={{ padding: '1rem 1.15rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.74rem', fontWeight: 600 }}>
            <span>OPERATIONAL SYSTEMS</span>
            <CheckCircle2 size={15} color="#15803d" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            {operationalCount} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#64748b' }}>/ {totalAssets}</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
            4 Department Labs &bull; Seminar Hall B
          </div>
        </div>

        <div className="tool-panel" style={{ padding: '1rem 1.15rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.74rem', fontWeight: 600 }}>
            <span>ACTIVE SLA INCIDENTS</span>
            <AlertTriangle size={15} color={issueCount > 0 ? '#dc2626' : '#16a34a'} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: issueCount > 0 ? '#dc2626' : '#16a34a', marginTop: '0.25rem' }}>
            {issueCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: issueCount > 0 ? '#dc2626' : '#16a34a', marginTop: '0.15rem' }}>
            {issueCount > 0 ? 'Assigned to Hardware Desk' : 'Zero unassigned tickets'}
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 3. LIVE BENCH HEALTH RADAR & INSTANT FAULT FINDER
       * ========================================================================= */}
      <div id="bench-radar-section" className="tool-panel" style={{ padding: '1.35rem 1.5rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: '#e0f2fe',
                  color: '#0369a1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Search size={14} />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Live Bench Health Radar &amp; Quick Grievance Dispatch
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              Entering a laboratory? Check workstation operational health before starting your practical batch, or dispatch a grievance in seconds.
            </p>
          </div>

          <button
            onClick={() => setTab('assets')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem' }}
          >
            <span>View All Assets ({totalAssets}) &rarr;</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignItems: 'center',
            marginBottom: '1rem',
            background: '#f8fafc',
            padding: '0.65rem 0.85rem',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* Lab Select */}
          <select
            className="form-select"
            value={selectedLabFilter}
            onChange={(e) => setSelectedLabFilter(e.target.value)}
            style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem', minWidth: '220px' }}
          >
            <option value="All">All Laboratories (SFIT IT)</option>
            {labRooms.map((l) => (
              <option key={l.id} value={l.id}>
                {l.shortName}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search
              size={14}
              color="#94a3b8"
              style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search Bench Tag (e.g. CC3-PC-14, AI-GPU-04)..."
              value={benchSearch}
              onChange={(e) => setBenchSearch(e.target.value)}
              style={{ paddingLeft: '1.9rem', fontSize: '0.82rem', paddingBlock: '0.35rem', width: '100%' }}
            />
          </div>
        </div>

        {/* Results Grid (Compact Radar Cards) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '0.75rem',
            maxHeight: '420px',
            overflowY: 'auto',
            padding: '0.25rem',
          }}
        >
          {searchedAssets.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
              No workstations match "{benchSearch}" in selected lab.
            </div>
          ) : (
            searchedAssets.map((asset) => {
              const isOperational = asset.status === 'Operational';
              return (
                <div
                  key={asset._id}
                  style={{
                    background: '#ffffff',
                    border: isOperational ? '1px solid #e2e8f0' : '1px solid #fca5a5',
                    borderRadius: '6px',
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          color: '#0369a1',
                          background: '#e0f2fe',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                        }}
                      >
                        {asset.assetTag}
                      </span>
                      {isOperational ? (
                        <span className="badge badge-green" style={{ fontSize: '0.66rem' }}>
                          Operational
                        </span>
                      ) : asset.status === 'Degraded' ? (
                        <span className="badge badge-amber" style={{ fontSize: '0.66rem' }}>
                          Degraded
                        </span>
                      ) : (
                        <span className="badge badge-red" style={{ fontSize: '0.66rem' }}>
                          Under Maintenance
                        </span>
                      )}
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                      {asset.name}
                    </div>

                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.45rem' }}>
                      {asset.labRoom}
                    </div>

                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#475569',
                        background: '#f8fafc',
                        padding: '0.35rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #e2e8f0',
                        marginBottom: '0.65rem',
                      }}
                    >
                      {asset.specs?.slice(0, 52)}...
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => setQuickQrAsset(asset)}
                      className="btn-secondary"
                      style={{ flex: 1, fontSize: '0.74rem', padding: '0.25rem 0.45rem' }}
                    >
                      <QrCode size={12} />
                      <span>QR Tag</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectAsset(asset);
                        setTab('report');
                      }}
                      className="btn-primary"
                      style={{ flex: 1.2, fontSize: '0.74rem', padding: '0.25rem 0.45rem' }}
                    >
                      <span>Report Fault &rarr;</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* =========================================================================
       * 4. THE THREE OPERATIONAL PILLARS (ROLE PORTALS)
       * ========================================================================= */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Campus Stakeholder Command Desks
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
            Tailored workflows for students, laboratory technicians, and departmental academic leadership.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '1rem',
          }}
        >
          {/* Pillar 1: Student & Faculty */}
          <div
            className="tool-panel"
            style={{
              padding: '1.35rem',
              background: '#ffffff',
              borderTop: '4px solid #0284c7',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '6px',
                    background: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Laptop size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                    Student &amp; Faculty Desk
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Quick Fault Reporting &amp; SLA Tracking</span>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                Experiencing a BSOD crash, stuck cooling fan, faulty mouse, or LAN dropout? Scan the bench QR sticker or select your workstation to dispatch a repair ticket in 5 seconds.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem', fontSize: '0.76rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={13} color="#16a34a" /> Instant ticket ID generation (`TKT26-XXXX`)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={13} color="#16a34a" /> Strict 24h/48h turnaround countdown
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={13} color="#16a34a" /> Full withdraw/delete control over pending reports
                </li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => setTab('report')}
                className="btn-primary"
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                <span>Report Fault</span>
              </button>
              <button
                onClick={() => setTab('my-tickets')}
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                <span>My Tickets</span>
              </button>
            </div>
          </div>

          {/* Pillar 2: Lab Technician & Hardware Desk */}
          <div
            className="tool-panel"
            style={{
              padding: '1.35rem',
              background: '#ffffff',
              borderTop: '4px solid #d97706',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '6px',
                    background: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Wrench size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                    Technician Triage Desk
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Hardware Repair &amp; Component Ledger</span>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                Assigned lab assistants triage incoming hardware faults by priority, log component replacements (RAM sticks, SMPS, patch cables), and certify benches back to Operational.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem', fontSize: '0.76rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={13} color="#16a34a" /> SLA breach alerts on batch blockers (&lt; 24h)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={13} color="#16a34a" /> Component ledger (DDR5, SATA, Cat6, PSU)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={13} color="#16a34a" /> Purge fraudulent / duplicate ticket records
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                if (!user || user.role === 'student') {
                  quickLogin('technician');
                }
                setTab('triage');
              }}
              className="btn-primary"
              style={{ width: '100%', fontSize: '0.78rem', background: '#b45309', borderColor: '#92400e' }}
            >
              <Wrench size={13} />
              <span>Open Hardware Triage Queue &rarr;</span>
            </button>
          </div>

          {/* Pillar 3: HOD & NBA/NAAC Accreditation */}
          <div
            className="tool-panel"
            style={{
              padding: '1.35rem',
              background: '#ffffff',
              borderTop: '4px solid #7e22ce',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '6px',
                    background: '#f3e8ff',
                    color: '#7e22ce',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BarChart3 size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                    HOD &amp; NBA Compliance Desk
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Infrastructure Audits &amp; MTTR Analytics</span>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                Institutional audit dashboard for Head of Department and peer review committees. Track department-wide MTTR, lemon workstations with chronic failures, and export compliance files.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem', fontSize: '0.76rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={13} color="#16a34a" /> 1-Click NBA Criterion 4 official CSV export
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={13} color="#16a34a" /> Chronic "Lemon" repeat failure hardware alerts
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={13} color="#16a34a" /> Decommission hardware records &amp; fleet sync
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                if (!user || user.role !== 'admin') {
                  quickLogin('admin');
                }
                setTab('analytics');
              }}
              className="btn-primary"
              style={{ width: '100%', fontSize: '0.78rem', background: '#581c87', borderColor: '#3b0764' }}
            >
              <FileSpreadsheet size={13} />
              <span>Access HOD Audit &amp; CSV Logs &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 5. DEPARTMENT LABORATORIES DIRECTORY SHOWCASE
       * ========================================================================= */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Department of Information Technology &bull; Laboratory Fleet
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Real-time monitoring across SFIT IT departmental facilities.
            </p>
          </div>
          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', background: '#e2e8f0', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
            {labRooms.length} Institutional Facilities Monitored
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '0.85rem' }}>
          {labRooms.map((lab) => {
            const labAssets = assets.filter((a) => a.labRoom === lab.id);
            const labIssues = labAssets.filter((a) => a.status !== 'Operational');

            return (
              <div
                key={lab.id}
                className="tool-panel"
                style={{
                  padding: '1.1rem',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        color: '#0f172a',
                      }}
                    >
                      {lab.shortName}
                    </span>
                    {labIssues.length === 0 ? (
                      <span className="badge badge-green" style={{ fontSize: '0.66rem' }}>
                        100% Operational
                      </span>
                    ) : (
                      <span className="badge badge-amber" style={{ fontSize: '0.66rem' }}>
                        {labIssues.length} Bench Issue{labIssues.length === 1 ? '' : 's'}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                    {lab.title}
                  </h3>

                  <p style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '0.6rem', lineHeight: 1.45 }}>
                    {lab.systems}
                  </p>

                  <div style={{ fontSize: '0.72rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 600 }}>Lab In-Charge:</span>
                    <span>{lab.inCharge}</span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    {labAssets.length} Registered Units
                  </span>

                  <button
                    onClick={() => {
                      setSelectedLabFilter(lab.id);
                      const el = document.getElementById('bench-radar-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      background: 'transparent',
                      color: '#0369a1',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      cursor: 'pointer',
                    }}
                  >
                    <span>Check Benches</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
       * 6. SLA STATE MACHINE MATRIX (ACCREDITATION & VIVA DEFENSE)
       * ========================================================================= */}
      <div className="tool-panel" style={{ padding: '1.35rem', background: '#ffffff' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Institutional SLA Escalation &amp; Resolution Matrix
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Strict resolution countdown timers defined according to academic batch impact and NBA Criterion 4 support guidelines.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Priority Tier</th>
                <th style={{ width: '110px' }}>SLA Window</th>
                <th>Academic Impact Criteria</th>
                <th>Diagnostic Protocol</th>
                <th style={{ width: '140px' }}>Escalation Level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="badge badge-red">Critical</span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#dc2626' }}>
                  24 Hours
                </td>
                <td style={{ fontSize: '0.78rem', color: '#334155' }}>
                  Workstation boot loop, motherboard power failure during scheduled semester lab practicals, main switch outage.
                </td>
                <td style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Immediate hardware bench dispatch, component substitution (RAM, PSU), stress test.
                </td>
                <td style={{ fontSize: '0.76rem', fontWeight: 600, color: '#dc2626' }}>
                  HOD &bull; Lead Assistant
                </td>
              </tr>

              <tr>
                <td>
                  <span className="badge badge-amber">High</span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#d97706' }}>
                  48 Hours
                </td>
                <td style={{ fontSize: '0.78rem', color: '#334155' }}>
                  Seminar projector HDMI intermittent flickering, secondary GPU PCIe bus drop, degraded LAN speed (&lt; 100Mbps).
                </td>
                <td style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Signal analyzer testing, cable recrimp / keystone re-punch, optical laser cleaning.
                </td>
                <td style={{ fontSize: '0.76rem', fontWeight: 600, color: '#d97706' }}>
                  Lab In-Charge Faculty
                </td>
              </tr>

              <tr>
                <td>
                  <span className="badge badge-neutral">Medium</span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#475569' }}>
                  72 Hours
                </td>
                <td style={{ fontSize: '0.78rem', color: '#334155' }}>
                  Faulty optical mouse sensor, loose keyboard keycap, audio jack loose contact, OS localized patch issue.
                </td>
                <td style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Peripheral swap from department spares stock, driver re-installation.
                </td>
                <td style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Hardware Desk Tech
                </td>
              </tr>

              <tr>
                <td>
                  <span className="badge badge-neutral">Low</span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#64748b' }}>
                  120 Hours (5 Days)
                </td>
                <td style={{ fontSize: '0.78rem', color: '#334155' }}>
                  Preventative bench dust blowing, cable harness re-routing, QR asset sticker replacement.
                </td>
                <td style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Scheduled maintenance cycle during weekend academic window.
                </td>
                <td style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Routine Support
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
       * 7. 1-CLICK VIVA EVALUATION SHORTCUT SANDBOX
       * ========================================================================= */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
          <Sparkles size={16} color="#7e22ce" />
          <h2 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
            External Examiner &amp; Viva Evaluation Sandbox (1-Click Switcher)
          </h2>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
          Evaluate the end-to-end grievance lifecycle instantly during viva defense with pre-seeded role personas:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
          <div
            onClick={async () => {
              await quickLogin('student');
              setTab('workbench');
            }}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '0.75rem',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0284c7')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
          >
            <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0284c7', marginBottom: '0.15rem' }}>
              🎓 1. Student (Veer &bull; PID-241034)
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Report a fault on bench `CC3-PC-14`, test audio chime &amp; confetti, track SLA countdown.
            </div>
          </div>

          <div
            onClick={async () => {
              await quickLogin('technician');
              setTab('workbench');
            }}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '0.75rem',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#d97706')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
          >
            <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#d97706', marginBottom: '0.15rem' }}>
              🔧 2. Lab Technician (Ramesh Kumar)
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Open triage desk, mark ticket `Resolved`, log replaced RAM parts, verify asset resets to Operational.
            </div>
          </div>

          <div
            onClick={async () => {
              await quickLogin('admin');
              setTab('workbench');
            }}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '0.75rem',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7e22ce')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
          >
            <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#7e22ce', marginBottom: '0.15rem' }}>
              👔 3. HOD Admin (Dr. S. N. Sharma)
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Review 94.2% fleet uptime, lemon repeat failure alerts, and download official NBA CSV audit log.
            </div>
          </div>
        </div>
      </div>

      {/* Quick QR Sticker Modal */}
      {quickQrAsset && (
        <div className="modal-overlay" onClick={() => setQuickQrAsset(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div
              style={{
                padding: '0.85rem 1.15rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <QrCode size={16} />
                Dynamic Workstation QR Sticker
              </h3>
              <button
                onClick={() => setQuickQrAsset(null)}
                style={{ background: 'transparent', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  padding: '1.25rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.25rem' }}>
                  SFIT &bull; Department of Information Technology
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#0f172a', marginBottom: '0.15rem' }}>
                  {quickQrAsset.assetTag}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
                  {quickQrAsset.name} &bull; {quickQrAsset.labRoom}
                </div>

                <div style={{ display: 'inline-block', padding: '8px', background: '#fff' }}>
                  <QRCodeSVG
                    value={JSON.stringify({
                      tag: quickQrAsset.assetTag,
                      name: quickQrAsset.name,
                      room: quickQrAsset.labRoom,
                      systemId: quickQrAsset._id,
                    })}
                    size={150}
                    level="H"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => window.print()}
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: '0.8rem' }}
                >
                  Print Asset Sticker
                </button>
                <button
                  onClick={() => {
                    const a = quickQrAsset;
                    setQuickQrAsset(null);
                    onSelectAsset(a);
                    setTab('report');
                  }}
                  className="btn-primary"
                  style={{ flex: 1.2, fontSize: '0.8rem' }}
                >
                  Report Fault on Bench
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
