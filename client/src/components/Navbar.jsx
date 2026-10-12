import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Wrench,
  AlertCircle,
  Cpu,
  BarChart3,
  Inbox,
  LogOut,
  Terminal,
} from 'lucide-react';

export default function Navbar({ currentTab, setTab }) {
  const { user, logout, quickLogin, isTechnician, isAdmin } = useAuth();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#161b22',
        borderBottom: '1px solid #30363d',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.65rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand / Title */}
        <div
          onClick={() => setTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: '#21262d',
              border: '1px solid #30363d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#58a6ff',
            }}
          >
            <Terminal size={16} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#e6edf3',
                letterSpacing: '-0.01em',
              }}
            >
              sfit-labguard
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                background: '#21262d',
                color: '#8b949e',
                border: '1px solid #30363d',
              }}
            >
              INFT
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            onClick={() => setTab('home')}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              background: currentTab === 'home' ? '#21262d' : 'transparent',
              color: currentTab === 'home' ? '#f0f6fc' : '#8b949e',
              fontWeight: 500,
              fontSize: '0.84rem',
              border: currentTab === 'home' ? '1px solid #30363d' : '1px solid transparent',
            }}
          >
            Workbench
          </button>

          <button
            onClick={() => setTab('report')}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              background: currentTab === 'report' ? '#21262d' : 'transparent',
              color: currentTab === 'report' ? '#f85149' : '#8b949e',
              fontWeight: 500,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              border: currentTab === 'report' ? '1px solid #30363d' : '1px solid transparent',
            }}
          >
            <AlertCircle size={14} />
            Report Issue
          </button>

          <button
            onClick={() => setTab('assets')}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              background: currentTab === 'assets' ? '#21262d' : 'transparent',
              color: currentTab === 'assets' ? '#f0f6fc' : '#8b949e',
              fontWeight: 500,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              border: currentTab === 'assets' ? '1px solid #30363d' : '1px solid transparent',
            }}
          >
            <Cpu size={14} />
            Asset Registry
          </button>

          {user && (
            <button
              onClick={() => setTab('my-tickets')}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                background: currentTab === 'my-tickets' ? '#21262d' : 'transparent',
                color: currentTab === 'my-tickets' ? '#f0f6fc' : '#8b949e',
                fontWeight: 500,
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: currentTab === 'my-tickets' ? '1px solid #30363d' : '1px solid transparent',
              }}
            >
              <Inbox size={14} />
              My Tickets
            </button>
          )}

          {isTechnician && (
            <button
              onClick={() => setTab('triage')}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                background: currentTab === 'triage' ? '#21262d' : 'transparent',
                color: currentTab === 'triage' ? '#d29922' : '#8b949e',
                fontWeight: 600,
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: currentTab === 'triage' ? '1px solid #30363d' : '1px solid transparent',
              }}
            >
              <Wrench size={14} />
              Triage Desk
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setTab('analytics')}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                background: currentTab === 'analytics' ? '#21262d' : 'transparent',
                color: currentTab === 'analytics' ? '#bc8cff' : '#8b949e',
                fontWeight: 600,
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: currentTab === 'analytics' ? '1px solid #30363d' : '1px solid transparent',
              }}
            >
              <BarChart3 size={14} />
              SLA Logs
            </button>
          )}
        </div>

        {/* User & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  color: '#e6edf3',
                  padding: '0.25rem 0.6rem',
                  background: '#21262d',
                  borderRadius: '6px',
                  border: '1px solid #30363d',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', color: '#8b949e' }}>
                  {user.usn || user.name.split(' ')[0]}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    color: isAdmin ? '#bc8cff' : user.role === 'technician' ? '#d29922' : '#58a6ff',
                    textTransform: 'uppercase',
                  }}
                >
                  [{user.role}]
                </span>
              </div>

              {/* Minimal Role Switcher */}
              <select
                value={user.role}
                onChange={(e) => quickLogin(e.target.value)}
                style={{
                  background: '#21262d',
                  border: '1px solid #30363d',
                  color: '#8b949e',
                  fontSize: '0.75rem',
                  padding: '0.28rem 0.45rem',
                  borderRadius: '6px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                }}
                title="Switch role for evaluation"
              >
                <option value="student">student</option>
                <option value="technician">technician</option>
                <option value="admin">hod_admin</option>
              </select>

              <button
                onClick={logout}
                title="Logout"
                style={{
                  background: 'transparent',
                  color: '#6e7681',
                  padding: '0.3rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                onClick={() => quickLogin('student')}
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
              >
                Student
              </button>
              <button
                onClick={() => quickLogin('technician')}
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
              >
                Tech
              </button>
              <button
                onClick={() => setTab('login')}
                className="btn-primary"
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
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
