import React, { useState } from 'react';
import EventCard from '../components/EventCard.jsx';
import TeamModal from '../components/TeamModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../utils/api.js';
import { Search, Filter, Calendar, MapPin, Trophy, Users, Shield, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EventsPage({
  events,
  myPasses,
  onRegistrationSuccess,
  selectedEventForModal,
  setSelectedEventForModal,
}) {
  const { user, quickLogin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [teamModalEvent, setTeamModalEvent] = useState(null);
  const [detailsModalEvent, setDetailsModalEvent] = useState(selectedEventForModal || null);
  const [regLoading, setRegLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = ['All', 'Hackathon', 'Coding', 'Robotics', 'Design', 'Flagship'];

  // Filter events
  const filteredEvents = events.filter((ev) => {
    const matchesCat = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Check if current user is registered for an event
  const isUserRegistered = (eventId) => {
    return myPasses.some((p) => p.event?._id === eventId || p.event === eventId);
  };

  const getPassForEvent = (eventId) => {
    return myPasses.find((p) => p.event?._id === eventId || p.event === eventId);
  };

  const handleRegisterClick = async (event) => {
    if (!user) {
      // Auto quick-login as student for zero-friction evaluation
      await quickLogin('student');
    }

    if (event.type === 'Team') {
      setTeamModalEvent(event);
    } else {
      // Individual registration direct confirmation
      try {
        setRegLoading(true);
        const res = await apiRequest('/registrations/register', {
          method: 'POST',
          body: JSON.stringify({ eventId: event._id }),
        });

        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}

        setMessage(`🎉 Registration Confirmed! Your Pass ID: ${res.data.ticketId}`);
        onRegistrationSuccess(res.data);
      } catch (err) {
        setMessage(`⚠️ ${err.message}`);
      } finally {
        setRegLoading(false);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
          Mosaic 2026 Event Roster
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.35rem' }}>
          Explore tracks, form squads, and secure your cryptographic accreditation pass.
        </p>
      </div>

      {/* Notification Banner */}
      {message && (
        <div
          style={{
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            background: message.startsWith('🎉') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: message.startsWith('🎉') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            color: message.startsWith('🎉') ? '#34d399' : '#f87171',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          <span>{message}</span>
          <button
            onClick={() => setMessage('')}
            style={{ background: 'transparent', color: 'inherit', padding: '0.2rem' }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: selectedCategory === cat ? 'linear-gradient(135deg, #00f2fe, #38bdf8)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#080c14' : 'var(--text-muted)',
                border: selectedCategory === cat ? 'none' : '1px solid var(--border-subtle)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search
            size={16}
            color="var(--text-subtle)"
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search tracks, prizes, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '100%', borderRadius: '999px' }}
          />
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div
          className="glass-panel"
          style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}
        >
          No competitions matching your filter criteria. Try searching for a different keyword.
        </div>
      ) : (
        <div className="grid-cards">
          {filteredEvents.map((ev) => (
            <EventCard
              key={ev._id}
              event={ev}
              onSelect={(event) => setDetailsModalEvent(event)}
              onRegisterClick={handleRegisterClick}
              isRegistered={isUserRegistered(ev._id)}
              registeredPass={getPassForEvent(ev._id)}
            />
          ))}
        </div>
      )}

      {/* Team Registration Modal */}
      {teamModalEvent && (
        <TeamModal
          event={teamModalEvent}
          onClose={() => setTeamModalEvent(null)}
          onSuccess={(reg) => {
            setTeamModalEvent(null);
            setMessage(`🎉 Team Pass Generated! Ticket Code: ${reg.ticketId}`);
            onRegistrationSuccess(reg);
          }}
        />
      )}

      {/* Detailed Rules & Coordinator Modal */}
      {detailsModalEvent && (
        <div className="modal-overlay" onClick={() => setDetailsModalEvent(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                padding: '1.5rem 1.75rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span className="badge badge-cyan">{detailsModalEvent.category}</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '0.4rem' }}>
                  {detailsModalEvent.title}
                </h2>
              </div>
              <button
                onClick={() => setDetailsModalEvent(null)}
                style={{ background: 'transparent', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.75rem' }}>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {detailsModalEvent.description}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem',
                }}
              >
                <div className="glass-panel" style={{ padding: '0.85rem' }}>
                  <div style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Venue &amp; Time
                  </div>
                  <div style={{ fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
                    {detailsModalEvent.venue}
                  </div>
                  <div style={{ color: 'var(--accent-blue)', fontSize: '0.8rem' }}>
                    {detailsModalEvent.date} &bull; {detailsModalEvent.time}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '0.85rem' }}>
                  <div style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Prize Pool
                  </div>
                  <div style={{ fontWeight: 700, color: '#fbbf24', marginTop: '0.2rem', fontSize: '1.1rem' }}>
                    {detailsModalEvent.prizePool}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    + Certificates &amp; Tech Swag
                  </div>
                </div>
              </div>

              {/* Official Competition Rules */}
              {detailsModalEvent.rules?.length > 0 && (
                <div style={{ marginBottom: '1.75rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
                    Competition Guidelines &amp; Rules
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {detailsModalEvent.rules.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Registration Action */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setDetailsModalEvent(null)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const ev = detailsModalEvent;
                    setDetailsModalEvent(null);
                    handleRegisterClick(ev);
                  }}
                  className="btn-primary"
                  style={{ flex: 1.5 }}
                >
                  {isUserRegistered(detailsModalEvent._id)
                    ? 'Pass Already Issued &bull; View In My Passes'
                    : 'Register & Issue Pass &rarr;'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
