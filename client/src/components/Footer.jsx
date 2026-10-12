import React from 'react';
import { ShieldCheck, Cpu, Heart, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(7, 9, 14, 0.95)',
        padding: '3rem 1.5rem 2rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Cpu size={20} color="var(--accent-cyan)" />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
              LABGUARD &bull; DSCE
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            Automated Institutional Campus Resource &amp; Laboratory Equipment Fault-Resolution Desk with
            Dynamic QR Bench Auditing and Real-Time SLA Triage.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
              MERN Stack
            </span>
            <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
              NBA / NAAC Compliance
            </span>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Accreditation &amp; SLA Specs
          </h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--accent-green)" />
              Tiered Resolution SLAs (Critical: 24h, High: 48h)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--accent-green)" />
              Dynamic Workstation QR Bench Tagging
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--accent-green)" />
              Audit-Ready CSV/PDF Maintenance Log Export
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Campus Division
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            Department of Computer Science &amp; Engineering
            <br />
            Central Hardware Maintenance &amp; Systems Lab
            <br />
            Dayananda Sagar College of Engineering, Bangalore
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-subtle)',
        }}
      >
        <div>&copy; 2026 LabGuard Systems. Department of Computer Science &amp; Engineering.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          Crafted with <Heart size={14} color="#ff3366" fill="#ff3366" /> for Web Technology Mini-Project
        </div>
      </div>
    </footer>
  );
}
