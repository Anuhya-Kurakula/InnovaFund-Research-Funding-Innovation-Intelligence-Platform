const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const authToken = () => localStorage.getItem('token') || localStorage.getItem('access_token') || '';

export const setAuthToken = (t) => {
  if (t) {
    localStorage.setItem('token', t);
    localStorage.setItem('access_token', t);
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
  }
};

export async function api(path, options = {}) {
  const currentToken = authToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (currentToken) {
    headers.Authorization = `Bearer ${currentToken}`;
  }
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (res.status === 401 && currentToken) {
    // Only dispatch expired if we had a token that was rejected
    window.dispatchEvent(new Event('auth-expired'));
  }
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: text };
  }
  if (!res.ok) throw new Error(data.detail || `Request failed (${res.status})`);
  return data;
}

export const login = async (email, password) => {
  const body = new URLSearchParams({ username: email, password });
  const r = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.detail || 'Login failed');
  setAuthToken(d.access_token);
  return d;
};

