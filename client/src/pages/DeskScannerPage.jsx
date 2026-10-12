import React, { useState, useEffect, useRef } from 'react';
import { apiRequest, playSound } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera,
  CameraOff,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Scan,
  User,
  MapPin,
  Calendar,
  Clock,
  ShieldAlert,
  ShieldCheck,
  History,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DeskScannerPage({ prefilledTicketId, onClearPrefill }) {
  const { user, isOrganizer, quickLogin } = useAuth();
  const [cameraActive, setCameraActive] = useState(false);
  const [manualCode, setManualCode] = useState(prefilledTicketId || '');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([
    {
      id: 1,
      ticketId: 'MSK26-CODE42',
      name: 'Rahul Sharma',
      event: 'CodeRush: Speed Jam',
      status: 'Checked-In',
      time: 'Just now',
    },
  ]);

  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // If a prefilled ticket code was passed from MyPassesPage, load it
  useEffect(() => {
    if (prefilledTicketId) {
      setManualCode(prefilledTicketId);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefilledTicketId]);

  // Webcam Scanner Start/Stop
  useEffect(() => {
    if (cameraActive) {
      const qrCodeId = 'reader';
      html5QrCodeRef.current = new Html5Qrcode(qrCodeId);

      html5QrCodeRef.current
        .start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            handleVerifyPass(decodedText);
            // Temporarily pause to prevent spamming
            stopCamera();
          },
          (errorMessage) => {
            // ignore scan loop frame errors
          }
        )
        .catch((err) => {
          console.warn('Camera failed to start:', err);
          setCameraActive(false);
        });
    }

    return () => {
      stopCamera();
    };
  }, [cameraActive]);

  const stopCamera = () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          html5QrCodeRef.current.clear();
        })
        .catch((err) => console.error('Failed to stop camera', err));
    }
    setCameraActive(false);
  };

  const handleVerifyPass = async (codeToVerify) => {
    const targetCode = (codeToVerify || manualCode).trim();
    if (!targetCode) return;

    setLoading(true);
    setScanResult(null);

    // If logged in as student, auto switch to organizer desk for full scan rights
    if (!isOrganizer) {
      await quickLogin('organizer');
    }

    try {
      const res = await apiRequest('/verify/scan', {
        method: 'POST',
        body: JSON.stringify({ ticketId: targetCode }),
      });

      // VALID PASS
      playSound('success');
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      } catch (e) {}

      setScanResult({
        type: 'VALID',
        data: res.data,
        message: res.message,
      });

      // Append to live history
      setScanHistory((prev) => [
        {
          id: Date.now(),
          ticketId: res.data.ticketId,
          name: res.data.user?.name,
          event: res.data.event?.title,
          status: 'VALID',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev.slice(0, 9),
      ]);
    } catch (err) {
      const isAlready =
        err.message?.includes('DUPLICATE') ||
        err.message?.includes('already verified') ||
        err.message?.includes('409');

      if (isAlready) {
        playSound('duplicate');
        setScanResult({
          type: 'DUPLICATE',
          message: err.message,
          ticketId: targetCode,
        });

        setScanHistory((prev) => [
          {
            id: Date.now(),
            ticketId: targetCode,
            name: 'Duplicate Rejection',
            event: 'Blocked at Gate',
            status: 'DUPLICATE_ALERT',
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev.slice(0, 9),
        ]);
      } else {
        playSound('invalid');
        setScanResult({
          type: 'INVALID',
          message: err.message || 'Counterfeit or unregistered pass token.',
          ticketId: targetCode,
        });

        setScanHistory((prev) => [
          {
            id: Date.now(),
            ticketId: targetCode,
            name: 'Unauthorized Pass',
            event: 'Denied',
            status: 'INVALID',
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev.slice(0, 9),
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            background: 'rgba(0, 242, 254, 0.1)',
            color: 'var(--accent-cyan)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          <ShieldCheck size={14} />
          Gate Accreditation Console
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
          Live Gate Pass Verification Desk
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.35rem' }}>
          Scan attendee QR passes via webcam or manual ticket token. Equipped with real-time anti-fraud duplicate detection.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Left Column: Live Scanner & Manual Input */}
        <div>
          <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scan size={20} color="var(--accent-cyan)" />
              Optical QR Reader
            </h3>

            {/* Webcam Scanner Viewport */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '280px',
                backgroundColor: '#05070c',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              {cameraActive ? (
                <>
                  <div id="reader" style={{ width: '100%', height: '100%' }}></div>
                  <div className="scan-laser"></div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <Camera size={44} color="var(--text-subtle)" style={{ marginBottom: '0.75rem' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Camera is currently off. Click below to start optical scan.
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
              {cameraActive ? (
                <button
                  onClick={stopCamera}
                  className="btn-danger"
                  style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <CameraOff size={18} />
                  Stop Webcam
                </button>
              ) : (
                <button
                  onClick={() => setCameraActive(true)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.75rem' }}
                >
                  <Camera size={18} />
                  Activate Gate Webcam Scanner
                </button>
              )}
            </div>

            {/* Manual Ticket Fallback Input */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Manual Ticket Code / QR Payload</span>
                <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>Keyboard Entry</span>
              </label>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', marginBottom: '1.25rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. MSK26-HACK89"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  style={{ flex: 1, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                />
                <button
                  onClick={() => handleVerifyPass()}
                  disabled={loading || !manualCode}
                  className="btn-primary"
                  style={{ padding: '0 1.5rem' }}
                >
                  {loading ? 'Verifying...' : 'Verify Pass'}
                </button>
              </div>

              {/* 1-Click Test Scenarios for Faculty Viva */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  ⚡ One-Click Demo Test Scenarios:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      setManualCode('MSK26-HACK89');
                      handleVerifyPass('MSK26-HACK89');
                    }}
                    style={{
                      background: 'rgba(0, 242, 254, 0.1)',
                      border: '1px solid rgba(0, 242, 254, 0.3)',
                      color: 'var(--accent-cyan)',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    1. Test Valid Pass (MSK26-HACK89)
                  </button>

                  <button
                    onClick={() => {
                      setManualCode('MSK26-CODE42');
                      handleVerifyPass('MSK26-CODE42');
                    }}
                    style={{
                      background: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#fbbf24',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    2. Test Duplicate Scan (MSK26-CODE42)
                  </button>

                  <button
                    onClick={() => {
                      setManualCode('FAKE-PASS-99');
                      handleVerifyPass('FAKE-PASS-99');
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    3. Test Counterfeit (FAKE-99)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Instant Live Verification Result Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Result Banner Box */}
          {scanResult ? (
            <div
              className="glass-panel"
              style={{
                padding: '2rem',
                border:
                  scanResult.type === 'VALID'
                    ? '2px solid rgba(16, 185, 129, 0.6)'
                    : scanResult.type === 'DUPLICATE'
                    ? '2px solid rgba(245, 158, 11, 0.6)'
                    : '2px solid rgba(239, 68, 68, 0.6)',
                backgroundColor:
                  scanResult.type === 'VALID'
                    ? 'rgba(6, 40, 28, 0.7)'
                    : scanResult.type === 'DUPLICATE'
                    ? 'rgba(45, 30, 5, 0.7)'
                    : 'rgba(45, 10, 15, 0.7)',
                position: 'relative',
                animation: 'modalEnter 0.25s ease',
              }}
            >
              {/* Status Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {scanResult.type === 'VALID' && <CheckCircle2 size={36} color="var(--accent-green)" />}
                {scanResult.type === 'DUPLICATE' && <ShieldAlert size={36} color="var(--accent-amber)" />}
                {scanResult.type === 'INVALID' && <XCircle size={36} color="var(--accent-red)" />}

                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color:
                        scanResult.type === 'VALID'
                          ? 'var(--accent-green)'
                          : scanResult.type === 'DUPLICATE'
                          ? 'var(--accent-amber)'
                          : 'var(--accent-red)',
                    }}
                  >
                    {scanResult.type === 'VALID'
                      ? 'GATE ENTRY APPROVED'
                      : scanResult.type === 'DUPLICATE'
                      ? 'SECURITY WARNING &bull; DUPLICATE'
                      : 'ACCREDITATION REJECTED'}
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                    {scanResult.type === 'VALID'
                      ? 'Valid Delegate Pass'
                      : scanResult.type === 'DUPLICATE'
                      ? 'Pass Already Used!'
                      : 'Counterfeit / Unregistered'}
                  </h2>
                </div>
              </div>

              <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {scanResult.message}
              </p>

              {/* Attendee Profile Info (if valid pass) */}
              {scanResult.data && (
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                        Student Name
                      </div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem', marginTop: '0.15rem' }}>
                        {scanResult.data.user?.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                        {scanResult.data.user?.usn}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                        Department / College
                      </div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem', marginTop: '0.15rem' }}>
                        {scanResult.data.user?.department}
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem', fontSize: '0.85rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: '#fff', fontWeight: 600 }}>Event: </span>
                      {scanResult.data.event?.title}
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      <span style={{ color: '#fff', fontWeight: 600 }}>Venue: </span>
                      {scanResult.data.event?.venue}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className="glass-panel"
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                border: '1px dashed var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '260px',
              }}
            >
              <ShieldCheck size={48} color="var(--border-glow)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                Gate Desk Standby
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '340px' }}>
                Scan a barcode or dynamic QR pass above. Verification results and delegate identity will render here in real time.
              </p>
            </div>
          )}

          {/* Live Recent Gate Activity Log */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={16} color="var(--accent-blue)" />
              Recent Gate Activity Stream
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {scanHistory.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor:
                          item.status === 'VALID' || item.status === 'Checked-In'
                            ? 'var(--accent-green)'
                            : item.status === 'DUPLICATE_ALERT'
                            ? 'var(--accent-amber)'
                            : 'var(--accent-red)',
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{item.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{item.event}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.ticketId}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
