import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  Printer,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function TicketPass({ registration, onOpenScanDemo }) {
  const [copied, setCopied] = useState(false);

  if (!registration) return null;

  const { ticketId, verificationHash, event, user, team, status, checkedInAt, registrationType } =
    registration;

  const isCheckedIn = status === 'Checked-In';

  // QR Payload encodes the verified cryptographic token
  const qrPayload = JSON.stringify({
    t: ticketId,
    v: verificationHash?.slice(0, 16),
    u: user?.usn || user?.name,
    e: event?.code,
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ticket-wrapper">
      <div className="ticket-card glow-card">
        {/* Ticket Header */}
        <div className="ticket-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'var(--accent-cyan)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                <span>MOSAIC 2026</span>
                <span>&bull;</span>
                <span>OFFICIAL ENTRY PASS</span>
              </div>
              <h2
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  marginTop: '0.35rem',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                {event?.title || 'Mosaic Tech Event'}
              </h2>
            </div>

            {/* Status Pill */}
            <span
              className={`badge ${isCheckedIn ? 'badge-green' : 'badge-cyan'}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
            >
              {isCheckedIn ? (
                <>
                  <CheckCircle2 size={13} />
                  ACCREDITED
                </>
              ) : (
                <>
                  <ShieldCheck size={13} />
                  CONFIRMED
                </>
              )}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              marginTop: '0.85rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} color="var(--accent-blue)" />
              {event?.date || 'March 28, 2026'}
            </span>
            <span>&bull;</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} color="var(--accent-blue)" />
              {event?.time || '09:30 AM'}
            </span>
          </div>
        </div>

        {/* Ticket Details Body */}
        <div className="ticket-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.25rem',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                Delegate Name
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.2rem', color: '#fff' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {user?.usn || 'DELEGATE'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                Registration Type
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {registrationType === 'Team' ? (
                  <>
                    <Users size={15} color="var(--accent-purple)" />
                    {team?.name || 'Team Entry'}
                  </>
                ) : (
                  'Individual Entry'
                )}
              </div>
              {team?.teamCode && (
                <div style={{ fontSize: '0.75rem', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                  Code: {team.teamCode}
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}
          >
            <MapPin size={17} color="var(--accent-cyan)" />
            <div>
              <span style={{ fontWeight: 600, color: '#fff' }}>Venue: </span>
              {event?.venue || 'Main Quadrangle'}
            </div>
          </div>
        </div>

        {/* Perforated Stub Divider */}
        <div className="ticket-divider">
          <div className="ticket-dashed-line"></div>
        </div>

        {/* QR Code Stub Section */}
        <div className="ticket-qr-section">
          <div className="qr-box">
            <QRCodeSVG
              value={qrPayload}
              size={160}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#090d16"
            />
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <span>{ticketId}</span>
            <button
              onClick={handleCopyCode}
              title="Copy Ticket ID"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: copied ? 'var(--accent-green)' : 'var(--text-muted)',
                padding: '0.35rem',
                borderRadius: '6px',
                display: 'inline-flex',
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.4rem', maxWidth: '320px' }}>
            Present this dynamic QR pass at Gate Desk A for biometric check-in and attendee badge printing.
          </p>

          {isCheckedIn && (
            <div
              style={{
                marginTop: '0.85rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#34d399',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={16} />
              Gate Check-In Confirmed at{' '}
              {new Date(checkedInAt).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              onClick={handlePrint}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
            >
              <Printer size={15} />
              Print / Save PDF
            </button>

            {onOpenScanDemo && (
              <button
                onClick={() => onOpenScanDemo(ticketId)}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
              >
                Test In Scanner Desk &rarr;
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
