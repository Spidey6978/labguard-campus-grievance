import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Lock, Mail, User, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage({ setTab }) {
  const { login, register, quickLogin } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [department, setDepartment] = useState('Computer Engineering (CMPN)');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        await register({
          name,
          email,
          password,
          usn: usn.toUpperCase(),
          department,
          college: 'St. Francis Institute of Technology (SFIT), Mumbai',
          role: 'student',
        });
      } else {
        await login(email, password);
      }
      setTab('home');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (role) => {
    setLoading(true);
    setError('');
    try {
      await quickLogin(role);
      if (role === 'admin') setTab('analytics');
      else if (role === 'technician') setTab('triage');
      else setTab('report');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto 4rem' }}>
      <div className="glass-panel glow-card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 0 25px rgba(0, 242, 254, 0.35)',
            }}
          >
            <ShieldAlert size={26} color="#080c14" />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            {isRegistering ? 'Student Registration' : 'LabGuard Staff & Student Portal'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
            {isRegistering
              ? 'Register with college PID / Roll No to file equipment grievances'
              : 'Sign in to access fault reporting, triage workbench & SLA analytics'}
          </p>
        </div>

        {/* 1-Click Quick Demo Shortcuts for Faculty */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            padding: '1.1rem',
            border: '1px solid var(--border-glow)',
            marginBottom: '1.75rem',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--accent-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Sparkles size={14} />
            1-Click Faculty Evaluation Shortcuts:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuick('student')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', padding: '0.55rem 0.85rem', fontSize: '0.8rem' }}
            >
              <span>🎓 Student (Rahul &bull; PID-221089)</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>1-Click Login &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuick('technician')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', padding: '0.55rem 0.85rem', fontSize: '0.8rem', borderColor: 'rgba(245, 158, 11, 0.3)' }}
            >
              <span>🔧 Lab Technician (Ramesh Kumar)</span>
              <span style={{ color: '#fbbf24', fontWeight: 700 }}>1-Click Login &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuick('admin')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', padding: '0.55rem 0.85rem', fontSize: '0.8rem', borderColor: 'rgba(168, 85, 247, 0.3)' }}
            >
              <span>👔 HOD Admin (Dr. S. N. Sharma)</span>
              <span style={{ color: '#c084fc', fontWeight: 700 }}>1-Click Login &rarr;</span>
            </button>
          </div>
        </div>

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
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: '2.5rem', width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">PID / Roll Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 221089 (PID)"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value.toUpperCase())}
                  style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="Computer Engineering (CMPN)">Computer Engineering (CMPN)</option>
                  <option value="Information Technology (INFT)">Information Technology (INFT)</option>
                  <option value="Artificial Intelligence & Data Science (AI&DS)">AI & Data Science (AI&DS)</option>
                  <option value="Electronics & Telecommunication (EXTC)">Electronics & Telecommunication (EXTC)</option>
                  <option value="Mechanical Engineering (MECH)">Mechanical Engineering (MECH)</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-input"
                placeholder="name@sfit.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.75rem' }}
          >
            {loading ? 'Authenticating...' : isRegistering ? 'Create Student Account &rarr;' : 'Sign In &rarr;'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isRegistering ? (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                style={{ background: 'transparent', color: 'var(--accent-cyan)', fontWeight: 700 }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need a student account?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                style={{ background: 'transparent', color: 'var(--accent-cyan)', fontWeight: 700 }}
              >
                Register Here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
