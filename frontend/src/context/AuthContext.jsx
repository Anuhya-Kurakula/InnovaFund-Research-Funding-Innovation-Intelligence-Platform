import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser, googleLoginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const DEFAULT_USER = {
  id: 1,
  full_name: 'Research User',
  email: 'user@innovafund.ai',
  role: 'researcher',
  is_active: true
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const savedUserStr = localStorage.getItem('user');
      let savedUser = null;
      if (savedUserStr) {
        try { savedUser = JSON.parse(savedUserStr); } catch (e) {}
      }

      if (token) {
        try {
          const userData = await getCurrentUser();
          const activeUser = userData || savedUser || DEFAULT_USER;
          setUser(activeUser);
          localStorage.setItem('user', JSON.stringify(activeUser));
        } catch (error) {
          const activeUser = savedUser || DEFAULT_USER;
          setUser(activeUser);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem('token', data.access_token || 'mock_jwt_token_demo_2026');
    const activeUser = {
      id: data.user_id || 1,
      full_name: data.full_name || (email ? email.split('@')[0] : 'Research User'),
      email: data.email || email || 'user@innovafund.ai',
      role: data.role || 'researcher',
      is_active: true
    };
    localStorage.setItem('user', JSON.stringify(activeUser));
    setUser(activeUser);
    return activeUser;
  };

  const googleLogin = async (payload) => {
    const data = await googleLoginUser(payload);
    localStorage.setItem('token', data.access_token || 'mock_jwt_token_demo_2026');
    const activeUser = {
      id: data.user_id || 1,
      full_name: payload.full_name || data.full_name || (payload.email ? payload.email.split('@')[0] : 'Google User'),
      email: payload.email || data.email || 'user@innovafund.ai',
      role: payload.role || data.role || 'researcher',
      is_active: true
    };
    localStorage.setItem('user', JSON.stringify(activeUser));
    setUser(activeUser);
    return activeUser;
  };

  const register = async (data) => {
    const res = await registerUser(data);
    localStorage.setItem('token', res.access_token || 'mock_jwt_token_demo_2026');
    const activeUser = {
      id: res.user_id || 1,
      full_name: data.full_name || res.full_name || (data.email ? data.email.split('@')[0] : 'Research User'),
      email: data.email || res.email || 'user@innovafund.ai',
      role: data.role || 'researcher',
      is_active: true
    };
    localStorage.setItem('user', JSON.stringify(activeUser));
    setUser(activeUser);
    return activeUser;
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

