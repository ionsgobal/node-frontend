import React, { createContext, useState, useEffect } from 'react';
import api from '../api/client';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      setLoading(false);
      return;
    }

    const checkUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem('jwt_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const loginUser = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('jwt_token', res.data.token);
    setUser(res.data.user);
  };

  const registerUser = async (username, email, password) => {
    await api.post('/auth/register', { username, email, password });
  };

  const logoutUser = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={ { user, loading, loginUser, registerUser, logoutUser } }>
      {children}
    </AuthContext.Provider>
  );
};