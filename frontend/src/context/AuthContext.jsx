import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('staynest_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('staynest_access_token');
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          localStorage.setItem('staynest_user', JSON.stringify(profile));
        } catch (err) {
          console.error('Failed to restore session profile', err);
          // If token failed, clean up
          if (err.response && err.response.status === 401) {
            localStorage.removeItem('staynest_access_token');
            localStorage.removeItem('staynest_refresh_token');
            localStorage.removeItem('staynest_user');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('staynest_access_token', data.access);
      localStorage.setItem('staynest_refresh_token', data.refresh);
      localStorage.setItem('staynest_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Invalid email or password.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const data = await authService.register(userData);
      localStorage.setItem('staynest_access_token', data.access);
      localStorage.setItem('staynest_refresh_token', data.refresh);
      localStorage.setItem('staynest_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      let msg = 'Registration failed.';
      if (err.response?.data) {
        const firstKey = Object.keys(err.response.data)[0];
        const val = err.response.data[firstKey];
        msg = Array.isArray(val) ? `${firstKey}: ${val[0]}` : `${firstKey}: ${val}`;
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('staynest_access_token');
    localStorage.removeItem('staynest_refresh_token');
    localStorage.removeItem('staynest_user');
    setUser(null);
  };

  const updateProfile = async (formData) => {
    try {
      const updated = await authService.updateProfile(formData);
      setUser(updated);
      localStorage.setItem('staynest_user', JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error('Profile update failed', err);
      throw err;
    }
  };

  const isAuthenticated = Boolean(user && localStorage.getItem('staynest_access_token'));
  const isHost = user?.role === 'host' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated,
        isHost,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
