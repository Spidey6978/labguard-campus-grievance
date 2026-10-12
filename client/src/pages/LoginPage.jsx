import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Lock, Mail, User, AlertCircle } from 'lucide-react';

export default function LoginPage({ setTab }) {
  const { login, register, quickLogin } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [department, setDepartment] = useState('Information Technology (INFT)');

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
      else setTab('home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto 3rem' }}>
      <div className="tool-panel" style={{ padding: '1.5rem', background: '#ffffff' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {isRegistering ? 'Student Registration' : 'Sign In'}
          </h2>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.15rem' }}>
            SFIT &bull; Department of Information Technology
          </div>
        </div>

        {/* Demo Account Buttons */}
        <div
          style={{
            background: '#f8fafc',
            borderRadius: '6px',
            padding: '0.65rem',
            border: '1px solid #e2e8f0',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: '#64748b',
              marginBottom: '0.35rem',
            }}
          >
            Instant Demo Logins:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => handleQuick('student')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', padding: '0.35rem 0.6rem', fontSize: '0.76rem' }}
            >
              <span>Student (Veer &bull; PID-241034)</span>
              <span style={{ color: '#0369a1', fontWeight: 600 }}>Login &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuick('technician')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', padding: '0.35rem 0.6rem', fontSize: '0.76rem' }}
            >
              <span>Technician (Ramesh Kumar)</span>
              <span style={{ color: '#b45309', fontWeight: 600 }}>Login &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuick('admin')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', padding: '0.35rem 0.6rem', fontSize: '0.76rem' }}
            >
              <span>HOD Admin (Dr. S. N. Sharma)</span>
              <span style={{ color: '#7e22ce', fontWeight: 600 }}>Login &rarr;</span>
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '4px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: '0.78rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Veer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">PID / Roll Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 241034 (PID)"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value.toUpperCase())}
                  style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="Information Technology (INFT)">Information Technology (INFT)</option>
                  <option value="Computer Engineering (CMPN)">Computer Engineering (CMPN)</option>
                  <option value="Artificial Intelligence & Data Science (AI&DS)">AI & Data Science (AI&DS)</option>
                  <option value="Electronics & Telecommunication (EXTC)">Electronics & Telecommunication (EXTC)</option>
                  <option value="Mechanical Engineering (MECH)">Mechanical Engineering (MECH)</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@sfit.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.4rem' }}
          >
            {loading ? 'Authenticating...' : isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.78rem', color: '#64748b' }}>
          {isRegistering ? (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                style={{ background: 'transparent', color: '#0369a1', fontWeight: 600 }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                style={{ background: 'transparent', color: '#0369a1', fontWeight: 600 }}
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
