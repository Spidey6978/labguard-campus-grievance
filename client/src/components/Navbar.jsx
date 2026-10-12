import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  ShieldAlert,
  Wrench,
  AlertCircle,
  Cpu,
  BarChart3,
  Inbox,
  LogOut,
  LogIn,
  QrCode,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function Navbar({ currentTab, setTab }) {
  const { user, logout, quickLogin, isTechnician, isAdmin } = useAuth();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(7, 9, 14, 0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => setTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.35)',
            }}
          >
            <ShieldAlert size={22} color="#07090e" strokeWidth={2.5} />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>LABGUARD</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '4px',
                  background: 'rgba(0, 242, 254, 0.15)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  fontWeight: 700,
                }}
              >
                SFIT
              </span>
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Institutional Lab Grievance Desk
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => setTab('home')}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              background: currentTab === 'home' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              color: currentTab === 'home' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
            }}
          >
            Overview
          </button>

          <button
            onClick={() => setTab('report')}
            style={{
              padding: '0.55rem 0.95rem',
              borderRadius: '8px',
              background:
                currentTab === 'report'
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(245, 158, 11, 0.25))'
                  : 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <AlertCircle size={15} />
            Report Fault
          </button>

          <button
            onClick={() => setTab('assets')}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              background: currentTab === 'assets' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              color: currentTab === 'assets' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Cpu size={15} />
            Asset Registry &amp; QR
          </button>

          {user && (
            <button
              onClick={() => setTab('my-tickets')}
              style={{
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                background: currentTab === 'my-tickets' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: currentTab === 'my-tickets' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Inbox size={15} />
              My Tickets
            </button>
          )}

          {isTechnician && (
            <button
              onClick={() => setTab('triage')}
              style={{
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                background: currentTab === 'triage' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: currentTab === 'triage' ? '#fbbf24' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Wrench size={15} />
              Triage Desk
            </button>
          )}

          {isTechnician && (
            <button
              onClick={() => setTab('analytics')}
              style={{
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                background: currentTab === 'analytics' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                color: currentTab === 'analytics' ? '#c084fc' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <BarChart3 size={15} />
              HOD Analytics
            </button>
          )}
        </div>

        {/* User Status & Instant Demo Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isAdmin
                      ? 'linear-gradient(135deg, #a855f7, #6366f1)'
                      : user.role === 'technician'
                      ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                      : 'linear-gradient(135deg, #00f2fe, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                >
                  {user.name.charAt(0)}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</div>
                  <div
                    style={{
                      fontSize: '0.65rem',
                      color: isAdmin ? '#c084fc' : user.role === 'technician' ? '#fbbf24' : 'var(--accent-cyan)',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}
                  >
                    {user.role}
                  </div>
                </div>
              </div>

              {/* Quick Switch Dropdown / Buttons */}
              <select
                value={user.role}
                onChange={(e) => quickLogin(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                title="Switch demo role for evaluation"
              >
                <option value="student">🎓 Student View</option>
                <option value="technician">🔧 Technician Desk</option>
                <option value="admin">👔 HOD Admin View</option>
              </select>

              <button
                onClick={logout}
                title="Logout"
                style={{ background: 'transparent', color: 'var(--text-subtle)', padding: '0.35rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => quickLogin('student')}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                Student
              </button>
              <button
                onClick={() => quickLogin('technician')}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderColor: 'rgba(245, 158, 11, 0.3)' }}
              >
                Technician
              </button>
              <button
                onClick={() => setTab('login')}
                className="btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
