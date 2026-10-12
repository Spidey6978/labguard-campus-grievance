import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function EventCard({ event, onSelect, onRegisterClick, isRegistered, registeredPass }) {
  if (!event) return null;

  const {
    _id,
    title,
    tagline,
    category,
    type,
    venue,
    date,
    time,
    capacity,
    registeredCount,
    prizePool,
    status,
  } = event;

  const percentFull = Math.min(100, Math.round((registeredCount / capacity) * 100));

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'Hackathon':
        return 'badge-purple';
      case 'Coding':
        return 'badge-cyan';
      case 'Robotics':
        return 'badge-amber';
      case 'Design':
        return 'badge-purple';
      case 'Flagship':
        return 'badge-green';
      default:
        return 'badge-cyan';
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div>
        {/* Top Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span className={`badge ${getCategoryBadgeClass(category)}`}>{category}</span>
            <span
              className="badge"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {type === 'Team' ? (
                <>
                  <Users size={12} /> Team (2-4)
                </>
              ) : (
                <>
                  <User size={12} /> Solo
                </>
              )}
            </span>
          </div>

          {status === 'Filling Fast' && (
            <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
              Filling Fast
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.02em',
            marginBottom: '0.4rem',
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
          }}
        >
          {tagline}
        </p>

        {/* Event Key Info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Calendar size={15} color="var(--accent-blue)" />
            <span>
              {date} &bull; {time}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <MapPin size={15} color="var(--accent-cyan)" />
            <span>{venue}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Trophy size={15} color="#fbbf24" />
            <span style={{ color: '#fbbf24', fontWeight: 600 }}>Prize Pool: {prizePool}</span>
          </div>
        </div>
      </div>

      {/* Capacity Bar & Action */}
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-subtle)',
              marginBottom: '0.35rem',
            }}
          >
            <span>Registrations</span>
            <span>
              {registeredCount} / {capacity} ({percentFull}%)
            </span>
          </div>
          <div
            style={{
              height: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${percentFull}%`,
                background:
                  percentFull > 85
                    ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                    : 'linear-gradient(90deg, #00f2fe, #38bdf8)',
                borderRadius: '999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isRegistered ? (
            <button
              onClick={() => onSelect(event)}
              className="btn-secondary"
              style={{
                width: '100%',
                borderColor: 'var(--accent-green)',
                color: 'var(--accent-green)',
              }}
            >
              Pass Confirmed &bull; View Ticket &rarr;
            </button>
          ) : (
            <>
              <button
                onClick={() => onSelect(event)}
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.88rem' }}
              >
                Brief & Rules
              </button>
              <button
                onClick={() => onRegisterClick(event)}
                className="btn-primary"
                style={{ flex: 1.2, fontSize: '0.88rem' }}
              >
                Register &rarr;
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
