import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  CheckCircle2,
  Send,
} from 'lucide-react';

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

    if (!user) {
      await quickLogin('student');
    }

    try {
      const res = await apiRequest('/tickets', {
        method: 'POST',
        body: JSON.stringify({
          assetId: selectedAssetId,
          assetTag: assetTagInput,
          title,
          description,
          issueCategory,
          priority,
        }),
      });

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
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Report Fault
        </h1>
      </div>

      {submittedTicket ? (
        /* Confirmation Card */
        <div className="tool-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              color: '#15803d',
            }}
          >
            <CheckCircle2 size={24} />
          </div>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
            Ticket Logged
          </h2>

          <div
            style={{
              background: '#f8fafc',
              borderRadius: '6px',
              padding: '1rem',
              maxWidth: '420px',
              margin: '1rem auto 1.25rem',
              textAlign: 'left',
              border: '1px solid #e2e8f0',
              fontSize: '0.84rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Ticket #</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#7e22ce' }}>
                {submittedTicket.ticketNumber}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Asset</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>
                {submittedTicket.asset?.assetTag}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>SLA Target</span>
              <span style={{ fontWeight: 600, color: '#b45309' }}>
                {getSlaHours(submittedTicket.priority)}h SLA
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Status</span>
              <span className="badge badge-amber">{submittedTicket.status}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => {
                setSubmittedTicket(null);
                setTitle('');
                setDescription('');
              }}
              className="btn-secondary"
            >
              Report Another
            </button>
            <button
              onClick={() => setTab('my-tickets')}
              className="btn-primary"
            >
              View My Tickets &rarr;
            </button>
          </div>
        </div>
      ) : (
        /* Grievance Input Form */
        <div className="tool-panel" style={{ padding: '1.25rem' }}>
          {error && (
            <div
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '4px',
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                fontSize: '0.82rem',
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Asset Selection */}
            <div className="form-group">
              <label className="form-label">Target Equipment / Bench</label>
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

            {/* Category & Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value)}
                >
                  <option value="Hardware / Motherboard / RAM">Hardware / RAM / Motherboard</option>
                  <option value="Peripheral / Mouse / Keyboard">Mouse / Keyboard / Monitor</option>
                  <option value="Network / LAN Cable Drop">Network / LAN / Switch</option>
                  <option value="AV / Projector / HDMI">AV / Projector / Audio</option>
                  <option value="Electrical / UPS / Socket">Electrical / UPS / Power</option>
                  <option value="Software / OS / BlueScreen">Software / OS Crash / BSOD</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Critical">Critical (24h SLA)</option>
                  <option value="High">High (48h SLA)</option>
                  <option value="Medium">Medium (72h SLA)</option>
                  <option value="Low">Low (120h SLA)</option>
                </select>
              </div>
            </div>

            {/* Issue Title */}
            <div className="form-group">
              <label className="form-label">Symptom Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. System BSOD loop on boot or loose HDMI port"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Detailed Description */}
            <div className="form-group">
              <label className="form-label">Description / Batch Observed</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Provide steps or error code observed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '0.55rem', marginTop: '0.4rem' }}
            >
              <Send size={14} />
              <span>{loading ? 'Dispatching...' : 'Dispatch Ticket'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
