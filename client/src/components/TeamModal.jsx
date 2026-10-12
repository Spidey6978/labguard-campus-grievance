import React, { useState } from 'react';
import { apiRequest } from '../utils/api.js';
import { X, Users, UserPlus, Shield, Copy, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TeamModal({ event, onClose, onSuccess }) {
  const [tab, setTab] = useState('create'); // 'create' or 'join'
  const [teamName, setTeamName] = useState('');
  const [teamCodeInput, setTeamCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!event) return null;

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setError('Please provide a team name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create Team
      const teamRes = await apiRequest('/teams/create', {
        method: 'POST',
        body: JSON.stringify({ name: teamName.trim(), eventId: event._id }),
      });

      // 2. Register for Event with this Team
      const regRes = await apiRequest('/registrations/register', {
        method: 'POST',
        body: JSON.stringify({ eventId: event._id, teamId: teamRes.data._id }),
      });

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

      onSuccess(regRes.data);
    } catch (err) {
      setError(err.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!teamCodeInput.trim()) {
      setError('Please provide team invite code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Join Team
      const joinRes = await apiRequest('/teams/join', {
        method: 'POST',
        body: JSON.stringify({ teamCode: teamCodeInput.trim().toUpperCase() }),
      });

      // 2. Register for Event with joined team
      const regRes = await apiRequest('/registrations/register', {
        method: 'POST',
        body: JSON.stringify({ eventId: event._id, teamId: joinRes.data._id }),
      });

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

      onSuccess(regRes.data);
    } catch (err) {
      setError(err.message || 'Failed to join team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={22} color="var(--accent-purple)" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                Team Registration Desk
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {event.title} &bull; Team Size: {event.teamSize?.min || 2}-{event.teamSize?.max || 4}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: 'var(--text-muted)',
              padding: '0.4rem',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switchers */}
        <div
          style={{
            display: 'flex',
            padding: '1rem 1.75rem 0',
            gap: '0.5rem',
          }}
        >
          <button
            onClick={() => {
              setTab('create');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem',
              background: tab === 'create' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: tab === 'create' ? '#c084fc' : 'var(--text-muted)',
              border: tab === 'create' ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <Sparkles size={16} />
            Create New Team
          </button>

          <button
            onClick={() => {
              setTab('join');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem',
              background: tab === 'join' ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              color: tab === 'join' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              border: tab === 'join' ? '1px solid rgba(0, 242, 254, 0.3)' : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <UserPlus size={16} />
            Join with Team Code
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '1.5rem 1.75rem 2rem' }}>
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              {error}
            </div>
          )}

          {tab === 'create' ? (
            <form onSubmit={handleCreateTeam}>
              <div className="form-group">
                <label className="form-label">Team / Squad Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ByteBusters, KernelPanics, NeuralHack"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                💡 As the Team Leader, you will receive a unique 6-character Team Invite Code immediately upon registration to share with teammates.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-purple"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {loading ? 'Creating Team & Issuing Pass...' : 'Create Team & Generate Pass &rarr;'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoinTeam}>
              <div className="form-group">
                <label className="form-label">Team Invite Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. HACK-9A4B"
                  value={teamCodeInput}
                  onChange={(e) => setTeamCodeInput(e.target.value.toUpperCase())}
                  style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}
                  required
                />
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                💡 Obtain the invite code from your team leader. Joining will automatically link your entry pass to their roster.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {loading ? 'Verifying Code...' : 'Join Team & Confirm Pass &rarr;'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
