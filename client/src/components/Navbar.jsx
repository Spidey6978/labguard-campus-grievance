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
        backgroundColor: '#0f172a',
        borderBottom: '1px solid #1e293b',
      }}
    >
      <div
        style={{
          maxWidth: '1140px',
          margin: '0 auto',
          padding: '0.55rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <div
          onClick={() => setTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              background: '#1e293b',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f8fafc',
            }}
          >
            <Terminal size={14} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#f8fafc',
              }}
            >
              sfit-labguard
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.05rem 0.35rem',
                borderRadius: '4px',
                background: '#1e293b',
                color: '#94a3b8',
                border: '1px solid #334155',
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
              padding: '0.3rem 0.65rem',
              borderRadius: '5px',
              background: currentTab === 'home' ? '#1e293b' : 'transparent',
              color: currentTab === 'home' ? '#f8fafc' : '#94a3b8',
              fontWeight: currentTab === 'home' ? 600 : 500,
              fontSize: '0.82rem',
              border: currentTab === 'home' ? '1px solid #334155' : '1px solid transparent',
            }}
          >
            Workbench
          </button>

          <button
            onClick={() => setTab('report')}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: '5px',
              background: currentTab === 'report' ? '#3f1515' : 'transparent',
              color: currentTab === 'report' ? '#fca5a5' : '#f87171',
              fontWeight: currentTab === 'report' ? 600 : 500,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              border: currentTab === 'report' ? '1px solid #7f1d1d' : '1px solid transparent',
            }}
          >
            <AlertCircle size={13} />
            Report Issue
          </button>

          <button
            onClick={() => setTab('assets')}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: '5px',
              background: currentTab === 'assets' ? '#1e293b' : 'transparent',
              color: currentTab === 'assets' ? '#f8fafc' : '#94a3b8',
              fontWeight: currentTab === 'assets' ? 600 : 500,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              border: currentTab === 'assets' ? '1px solid #334155' : '1px solid transparent',
            }}
          >
            <Cpu size={13} />
            Assets
          </button>

          {user && (
            <button
              onClick={() => setTab('my-tickets')}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: '5px',
                background: currentTab === 'my-tickets' ? '#1e293b' : 'transparent',
                color: currentTab === 'my-tickets' ? '#f8fafc' : '#94a3b8',
                fontWeight: currentTab === 'my-tickets' ? 600 : 500,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                border: currentTab === 'my-tickets' ? '1px solid #334155' : '1px solid transparent',
              }}
            >
              <Inbox size={13} />
              My Tickets
            </button>
          )}

          {(isTechnician || isAdmin) && (
            <button
              onClick={() => setTab('triage')}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: '5px',
                background: currentTab === 'triage' ? '#451a03' : 'transparent',
                color: currentTab === 'triage' ? '#fde68a' : '#fbbf24',
                fontWeight: currentTab === 'triage' ? 600 : 500,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                border: currentTab === 'triage' ? '1px solid #78350f' : '1px solid transparent',
              }}
            >
              <Wrench size={13} />
              Triage
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setTab('analytics')}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: '5px',
                background: currentTab === 'analytics' ? '#3b0764' : 'transparent',
                color: currentTab === 'analytics' ? '#e9d5ff' : '#c084fc',
                fontWeight: currentTab === 'analytics' ? 600 : 500,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                border: currentTab === 'analytics' ? '1px solid #581c87' : '1px solid transparent',
              }}
            >
              <BarChart3 size={13} />
              SLA Logs
            </button>
          )}
        </div>

        {/* User & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.78rem',
                  color: '#e2e8f0',
                  padding: '0.2rem 0.5rem',
                  background: '#1e293b',
                  borderRadius: '4px',
                  border: '1px solid #334155',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {user.usn || user.name.split(' ')[0]}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    color: isAdmin ? '#c084fc' : user.role === 'technician' ? '#fbbf24' : '#38bdf8',
                  }}
                >
                  [{user.role}]
                </span>
              </div>

              {/* Compact Role Switcher */}
              <select
                value={user.role}
                onChange={(e) => quickLogin(e.target.value)}
                style={{
                  background: '#1e293b',
                  border: '1px solid #475569',
                  color: '#f1f5f9',
                  fontSize: '0.74rem',
                  padding: '0.22rem 0.4rem',
                  borderRadius: '4px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                }}
                title="Switch demo role"
              >
                <option value="student">Veer (Student)</option>
                <option value="technician">Ramesh (Tech)</option>
                <option value="admin">Dr. Sharma (HOD)</option>
              </select>

              <button
                onClick={logout}
                title="Logout"
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button
                onClick={() => quickLogin('student')}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#e2e8f0',
                  fontSize: '0.76rem',
                  padding: '0.25rem 0.55rem',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Veer (Student)
              </button>
              <button
                onClick={() => quickLogin('technician')}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#e2e8f0',
                  fontSize: '0.76rem',
                  padding: '0.25rem 0.55rem',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Tech
              </button>
              <button
                onClick={() => setTab('login')}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #ffffff',
                  color: '#0f172a',
                  fontSize: '0.76rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
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
