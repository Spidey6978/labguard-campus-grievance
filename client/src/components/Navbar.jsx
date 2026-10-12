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
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
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
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
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
                color: '#0f172a',
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
                background: '#f1f5f9',
                color: '#64748b',
                border: '1px solid #e2e8f0',
              }}
            >
              INFT
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <button
            onClick={() => setTab('home')}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: '5px',
              background: currentTab === 'home' ? '#f1f5f9' : 'transparent',
              color: currentTab === 'home' ? '#0f172a' : '#64748b',
              fontWeight: currentTab === 'home' ? 600 : 500,
              fontSize: '0.82rem',
              border: currentTab === 'home' ? '1px solid #e2e8f0' : '1px solid transparent',
            }}
          >
            Workbench
          </button>

          <button
            onClick={() => setTab('report')}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: '5px',
              background: currentTab === 'report' ? '#fee2e2' : 'transparent',
              color: currentTab === 'report' ? '#b91c1c' : '#64748b',
              fontWeight: currentTab === 'report' ? 600 : 500,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              border: currentTab === 'report' ? '1px solid #fecaca' : '1px solid transparent',
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
              background: currentTab === 'assets' ? '#f1f5f9' : 'transparent',
              color: currentTab === 'assets' ? '#0f172a' : '#64748b',
              fontWeight: currentTab === 'assets' ? 600 : 500,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              border: currentTab === 'assets' ? '1px solid #e2e8f0' : '1px solid transparent',
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
                background: currentTab === 'my-tickets' ? '#f1f5f9' : 'transparent',
                color: currentTab === 'my-tickets' ? '#0f172a' : '#64748b',
                fontWeight: currentTab === 'my-tickets' ? 600 : 500,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                border: currentTab === 'my-tickets' ? '1px solid #e2e8f0' : '1px solid transparent',
              }}
            >
              <Inbox size={13} />
              My Tickets
            </button>
          )}

          {isTechnician && (
            <button
              onClick={() => setTab('triage')}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: '5px',
                background: currentTab === 'triage' ? '#fef3c7' : 'transparent',
                color: currentTab === 'triage' ? '#b45309' : '#64748b',
                fontWeight: currentTab === 'triage' ? 600 : 500,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                border: currentTab === 'triage' ? '1px solid #fde68a' : '1px solid transparent',
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
                background: currentTab === 'analytics' ? '#f3e8ff' : 'transparent',
                color: currentTab === 'analytics' ? '#7e22ce' : '#64748b',
                fontWeight: currentTab === 'analytics' ? 600 : 500,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                border: currentTab === 'analytics' ? '1px solid #e9d5ff' : '1px solid transparent',
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
                  color: '#334155',
                  padding: '0.2rem 0.5rem',
                  background: '#f1f5f9',
                  borderRadius: '4px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {user.usn || user.name.split(' ')[0]}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    color: isAdmin ? '#7e22ce' : user.role === 'technician' ? '#b45309' : '#0369a1',
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
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  fontSize: '0.74rem',
                  padding: '0.22rem 0.4rem',
                  borderRadius: '4px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                }}
                title="Switch demo role"
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
                className="btn-secondary"
                style={{ fontSize: '0.76rem', padding: '0.25rem 0.55rem' }}
              >
                Student
              </button>
              <button
                onClick={() => quickLogin('technician')}
                className="btn-secondary"
                style={{ fontSize: '0.76rem', padding: '0.25rem 0.55rem' }}
              >
                Tech
              </button>
              <button
                onClick={() => setTab('login')}
                className="btn-primary"
                style={{ fontSize: '0.76rem', padding: '0.25rem 0.65rem' }}
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
