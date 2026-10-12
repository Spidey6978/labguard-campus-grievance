import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('labguard_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiRequest('/auth/me');
        if (res.success) {
          setUser(res.user);
        }
      } catch (err) {
        console.warn('Session expired:', err.message);
        localStorage.removeItem('labguard_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success) {
      localStorage.setItem('labguard_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
  };

  const register = async (userData) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (res.success) {
      localStorage.setItem('labguard_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('labguard_token');
    setToken(null);
    setUser(null);
  };

  // Instant 1-Click Role Switcher for Viva Evaluation
  const quickLogin = async (role = 'student') => {
    if (role === 'admin') {
      return await login('hod.inft@sfit.ac.in', 'admin123');
    } else if (role === 'technician') {
      return await login('ramesh.tech@sfit.ac.in', 'tech123');
    } else {
      return await login('veer@sfit.ac.in', 'student123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickLogin,
        isStudent: user?.role === 'student',
        isTechnician: user?.role === 'technician' || user?.role === 'admin',
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
