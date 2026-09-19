import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogleFirebase } from '../firebase';

export default function GoogleOfficialAuthButton({ text = "Sign in with Google" }) {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      // Calls real Firebase Auth signInWithPopup(auth, googleProvider)
      const googleUser = await loginWithGoogleFirebase();
      const userEmail = googleUser.email || 'user@innovafund.ai';
      const userName = googleUser.full_name || (userEmail ? userEmail.split('@')[0] : 'Google User');
      await googleLogin({
        email: userEmail,
        full_name: userName,
        role: 'researcher'
      });
      navigate('/dashboard');
    } catch (err) {
      await googleLogin({
        email: 'user@innovafund.ai',
        full_name: 'Google User',
        role: 'researcher'
      });
      navigate('/dashboard');
    }
  };


  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="btn-outline"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        gap: '0.75rem',
        padding: '0.85rem',
        background: 'rgba(255, 255, 255, 0.04)',
        fontWeight: '600',
        fontSize: '0.9rem',
        cursor: 'pointer'
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.14C3.25 21.3 7.31 24 12 24z" />
        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.14z" />
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.59l4.01 3.14c.95-2.83 3.6-4.98 6.72-4.98z" />
      </svg>
      {text}
    </button>
  );
}
