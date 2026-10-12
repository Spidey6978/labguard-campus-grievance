import React, { useState, useEffect } from 'react';
import { apiRequest, playSound } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  AlertCircle,
  Wrench,
  Clock,
  CheckCircle2,
  Cpu,
  MapPin,
  Send,
  Ticket,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReportGrievancePage({ assets, preselectedAsset, setTab, onTicketCreated }) {
  const { user, quickLogin } = useAuth();

  const [selectedAssetId, setSelectedAssetId] = useState(preselectedAsset?._id || '');
  const [assetTagInput, setAssetTagInput] = useState(preselectedAsset?.assetTag || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [issueCategory, setIssueCategory] = useState('Hardware / Motherboard / RAM');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState(null);

  useEffect(() => {
    if (preselectedAsset) {
      setSelectedAssetId(preselectedAsset._id);
      setAssetTagInput(preselectedAsset.assetTag);
    } else if (assets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(assets[0]._id);
      setAssetTagInput(assets[0].assetTag);
    }
  }, [preselectedAsset, assets]);

  const handleAssetSelect = (e) => {
    const id = e.target.value;
    setSelectedAssetId(id);
    const found = assets.find((a) => a._id === id);
    if (found) setAssetTagInput(found.assetTag);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide issue title and symptom description');
      return;
    }

    setLoading(true);
    setError('');

    // If user is not logged in, auto quick-login as student for zero-friction demo
    if (!user) {
      await quickLogin('student');
    }

    try {
      const res = await apiRequest('/tickets', {
        method: 'POST',
        body: JSON.stringify({
          assetId: selectedAssetId,
          assetTag: assetTagInput,
          title: title.trim(),
          description: description.trim(),
          issueCategory,
          priority,
        }),
      });

      playSound('success');
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

      setSubmittedTicket(res.data);
      if (onTicketCreated) onTicketCreated(res.data);
    } catch (err) {
      setError(err.message || 'Failed to file grievance');
    } finally {
      setLoading(false);
    }
  };

  const getSlaHours = (pr) => {
    switch (pr) {
      case 'Critical':
        return 24;
      case 'High':
        return 48;
      case 'Medium':
        return 72;
      case 'Low':
      default:
        return 120;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#f87171',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          <AlertCircle size={14} />
          Central Fault Redressal Portal
        </div>
        <h1 style={{ fontSize: '2.3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
          File Equipment Grievance / Breakdown
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.35rem' }}>
          Log faulty hardware, network disruptions or OS failures directly to the central lab maintenance desk.
        </p>
      </div>

      {submittedTicket ? (
        /* Success Confirmation Card */
        <div className="glass-panel glow-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: 'var(--accent-green)',
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            Grievance Registered Successfully!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            Your breakdown report has been entered into the active triage queue. A hardware technician will be dispatched.
          </p>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              maxWidth: '480px',
              margin: '0 auto 2rem',
              textAlign: 'left',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Ticket Number</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {submittedTicket.ticketNumber}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Asset Workstation</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>
                {submittedTicket.asset?.assetTag} ({submittedTicket.asset?.name})
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>SLA Target Deadline</span>
              <span style={{ fontWeight: 700, color: '#fbbf24' }}>
                {new Date(submittedTicket.slaDeadline).toLocaleString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })} ({getSlaHours(submittedTicket.priority)}h SLA)
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Initial Status</span>
              <span className="badge badge-amber">{submittedTicket.status}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={() => {
                setSubmittedTicket(null);
                setTitle('');
                setDescription('');
              }}
              className="btn-secondary"
            >
              Report Another Issue
            </button>
            <button
              onClick={() => setTab('my-tickets')}
              className="btn-primary"
            >
              View in My Grievances &rarr;
            </button>
          </div>
        </div>
      ) : (
        /* Grievance Input Form */
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          {error && (
            <div
              style={{
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.88rem',
                marginBottom: '1.5rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Asset Selection */}
            <div className="form-group">
              <label className="form-label">Target Workstation / Hardware Asset</label>
              <select
                className="form-select"
                value={selectedAssetId}
                onChange={handleAssetSelect}
                required
              >
                {assets.map((a) => (
                  <option key={a._id} value={a._id}>
                    [{a.assetTag}] {a.name} &bull; {a.labRoom}
                  </option>
                ))}
              </select>
            </div>

            {/* Category & Priority Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Fault Category</label>
                <select
                  className="form-select"
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value)}
                >
                  <option value="Hardware / Motherboard / RAM">Hardware / Motherboard / RAM</option>
                  <option value="Software / OS / BlueScreen">Software / OS / BlueScreen</option>
                  <option value="Peripherals (Mouse / Keyboard / Monitor)">Peripherals (Mouse / Keyboard / Monitor)</option>
                  <option value="Network / LAN Cable Drop">Network / LAN Cable Drop</option>
                  <option value="AV / Projector / HDMI">AV / Projector / HDMI</option>
                  <option value="Electrical / UPS / Power Trip">Electrical / UPS / Power Trip</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Severity &amp; SLA Commitment ({getSlaHours(priority)}h Target)
                </label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Critical">🔴 Critical (Lab Batch Blocker &bull; 24h SLA)</option>
                  <option value="High">🟠 High Priority (48h SLA)</option>
                  <option value="Medium">🟡 Medium (Standard &bull; 72h SLA)</option>
                  <option value="Low">🔵 Low (Minor / Aesthetic &bull; 120h SLA)</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Incident Headline / Summary</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. BSOD loop on boot or Monitor HDMI display flickering"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Detailed Symptoms &amp; Error Messages</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Describe what occurred, any error codes displayed on screen, and steps to reproduce..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1rem',
                marginTop: '1rem',
                background: 'linear-gradient(135deg, #ef4444, #f59e0b)',
              }}
            >
              {loading ? 'Transmitting to Technician Desk...' : 'Dispatch Maintenance Ticket &rarr;'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
