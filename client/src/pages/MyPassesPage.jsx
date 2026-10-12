import React from 'react';
import TicketPass from '../components/TicketPass.jsx';
import { Ticket, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

export default function MyPassesPage({ myPasses, setTab, onTestScanPass }) {
  return (
    <div>
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
          Digital Accreditation Vault
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
          My Mosaic 2026 Passes ({myPasses.length})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.35rem' }}>
          Your verified credentials. Show these dynamic QR badges at Gate Desks for instant venue entry.
        </p>
      </div>

      {myPasses.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <Ticket size={32} color="var(--text-subtle)" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            No Passes Issued Yet
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            You haven't registered for any competitions or workshops yet. Browse the Mosaic tracks to secure your digital pass.
          </p>
          <button
            onClick={() => setTab('events')}
            className="btn-primary"
            style={{ padding: '0.8rem 1.75rem' }}
          >
            Explore Competitions &rarr;
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '2.5rem',
            justifyContent: 'center',
          }}
        >
          {myPasses.map((pass) => (
            <TicketPass
              key={pass._id || pass.ticketId}
              registration={pass}
              onOpenScanDemo={(ticketCode) => {
                onTestScanPass(ticketCode);
                setTab('scanner');
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
