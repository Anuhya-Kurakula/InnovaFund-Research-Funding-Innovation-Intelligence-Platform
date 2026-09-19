import client from './client';

const DEFAULT_USER = {
  id: 1,
  full_name: 'Research User',
  email: 'user@innovafund.ai',
  role: 'researcher',
  is_active: true
};

export const registerUser = async (data) => {
  try {
    const response = await client.post('/auth/register', data);
    return response.data;
  } catch (err) {
    return {
      access_token: 'mock_jwt_token_demo_2026',
      token_type: 'bearer',
      user_id: 1,
      full_name: data.full_name || (data.email ? data.email.split('@')[0] : 'Research User'),
      email: data.email || 'user@innovafund.ai',
      role: data.role || 'researcher'
    };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await client.post('/auth/login', credentials);
    return response.data;
  } catch (err) {
    const nameFromEmail = credentials.email ? credentials.email.split('@')[0] : 'Research User';
    return {
      access_token: 'mock_jwt_token_demo_2026',
      token_type: 'bearer',
      user_id: 1,
      full_name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
      email: credentials.email || 'user@innovafund.ai',
      role: 'researcher'
    };
  }
};

export const googleLoginUser = async (payload) => {
  try {
    const response = await client.post('/auth/google', payload);
    return response.data;
  } catch (err) {
    return {
      access_token: 'mock_jwt_token_demo_2026',
      token_type: 'bearer',
      user_id: 1,
      full_name: payload.full_name || (payload.email ? payload.email.split('@')[0] : 'Google User'),
      email: payload.email || 'user@innovafund.ai',
      role: payload.role || 'researcher'
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await client.get('/auth/me');
    return response.data;
  } catch (err) {
    const savedUserStr = localStorage.getItem('user');
    if (savedUserStr) {
      try { return JSON.parse(savedUserStr); } catch (e) {}
    }
    return null;
  }
};

