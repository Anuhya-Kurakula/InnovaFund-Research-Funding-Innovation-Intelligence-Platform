import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import InnovaLogo from '../components/InnovaLogo';
import GoogleOfficialAuthButton from '../components/GoogleOfficialAuthButton';
import GithubOfficialAuthButton from '../components/GithubOfficialAuthButton';
import { HiSparkles, HiShieldCheck, HiLightningBolt, HiCheckCircle } from 'react-icons/hi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email address and password to sign in.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Invalid email credentials or password.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      background: 'var(--bg-dark)',
      padding: '3rem 2rem',
      boxSizing: 'border-box'
    }} className="animate-fade-in">
      
      {/* Expanded Widescreen Landscape Split Container */}
      <div style={{
        width: '92%',
        maxWidth: '1380px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.15fr 1fr',
        gap: '2.5rem',
        alignItems: 'stretch'
      }}>
        {/* Left Side: Landscape Showcase Panel */}
        <div className="glass-card pulse-glow" style={{ padding: '3.5rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(2, 132, 199, 0.18) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2.25rem' }}>
              <InnovaLogo size={52} className="logo-animated" />
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc' }}>
                  InnovaFund <span style={{ color: '#0ea5e9' }}>AI</span>
                </span>
                <span style={{ display: 'block', fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Funding & Innovation Intelligence Portal
                </span>
              </div>
            </div>

            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2, margin: '0 0 1.25rem 0', color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
              Accelerate Technology Commercialization & Grants
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.25rem', maxWidth: '580px' }}>
              Connect academic research publications (OpenAlex, CrossRef, Semantic Scholar), global patent white-space records (USPTO, Google Patents, The Lens), and live funding opportunity matches into a single intelligence hub.
            </p>

            {/* Metric Highlights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2.25rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.15rem', borderRadius: '0.85rem' }}>
                <div style={{ color: '#38bdf8', fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>250M+</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.825rem', fontWeight: '600' }}>Research Papers</div>
                <div style={{ color: '#64748b', fontSize: '0.725rem' }}>OpenAlex & CrossRef</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.15rem', borderRadius: '0.85rem' }}>
                <div style={{ color: '#c084fc', fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>140M+</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.825rem', fontWeight: '600' }}>Global Patents</div>
                <div style={{ color: '#64748b', fontSize: '0.725rem' }}>USPTO & Google Patents</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.15rem', borderRadius: '0.85rem' }}>
                <div style={{ color: '#6ee7b7', fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>$15B+</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.825rem', fontWeight: '600' }}>Grant Pool</div>
                <div style={{ color: '#64748b', fontSize: '0.725rem' }}>Live Program Matches</div>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HiCheckCircle style={{ color: '#10b981', fontSize: '1.1rem' }} /> Multi-Source APIs
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HiCheckCircle style={{ color: '#10b981', fontSize: '1.1rem' }} /> Enterprise Security RBAC
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HiCheckCircle style={{ color: '#10b981', fontSize: '1.1rem' }} /> Live AI Grant Matching Engine
            </div>
          </div>
        </div>

        {/* Right Side: Sign-In Form Panel */}
        <div className="glass-card" style={{ padding: '3.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.4rem 0', color: '#f8fafc' }}>
              Welcome Back
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
              Sign in to access your InnovaFund AI dashboard
            </p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.85rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {/* Social OAuth Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <GoogleOfficialAuthButton text="Sign in with Google" />
            <GithubOfficialAuthButton text="Sign in with GitHub" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', margin: '1.5rem 0', color: '#64748b', fontSize: '0.75rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
            <span>OR EMAIL SIGN IN</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.4rem' }}>Email Address</label>
              <input
                type="email"
                className="glass-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@researchsphere.ai"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.4rem' }}>Password</label>
              <input
                type="password"
                className="glass-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-gradient" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              {loading ? (
                <span className="shimmer-loading" style={{ padding: '0.2rem 1rem', borderRadius: '0.5rem', width: '100%', display: 'inline-block' }}>Authenticating...</span>
              ) : (
                <>
                  <HiLightningBolt /> Sign In to Portal
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#94a3b8' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '700' }}>
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
