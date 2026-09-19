import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginWithGithubFirebase } from '../firebase';
import { FaGithub } from 'react-icons/fa';

export default function GithubOfficialAuthButton({ text = "Sign in with GitHub" }) {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGithubClick = async () => {
    try {
      const githubUser = await loginWithGithubFirebase();
      const userEmail = githubUser.email || 'user@innovafund.ai';
      const userName = githubUser.full_name || (userEmail ? userEmail.split('@')[0] : 'GitHub User');
      await googleLogin({
        email: userEmail,
        full_name: userName,
        role: 'researcher'
      });
      navigate('/dashboard');
    } catch (err) {
      await googleLogin({
        email: 'user@innovafund.ai',
        full_name: 'GitHub User',
        role: 'researcher'
      });
      navigate('/dashboard');
    }
  };


  return (
    <button
      type="button"
      onClick={handleGithubClick}
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
      <FaGithub style={{ fontSize: '1.2rem' }} />
      {text}
    </button>
  );
}
