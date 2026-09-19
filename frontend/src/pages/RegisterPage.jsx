import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import InnovaLogo from '../components/InnovaLogo';
import GoogleOfficialAuthButton from '../components/GoogleOfficialAuthButton';
import GithubOfficialAuthButton from '../components/GithubOfficialAuthButton';
import { HiAcademicCap, HiLightBulb, HiBriefcase, HiShieldCheck, HiSparkles, HiArrowRight, HiCheckCircle } from 'react-icons/hi';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('researcher');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        full_name: fullName || 'Dr. Alex Rivera',
        email: email || 'alex.rivera@university.edu',
        password: password || 'Password@123',
        role,
        organization: organization.trim() || undefined
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { id: 'researcher', label: 'Researcher', desc: 'Scientists & Authors', icon: <HiAcademicCap /> },
    { id: 'startup_founder', label: 'Startup Founder', desc: 'Tech Entrepreneurs', icon: <HiLightBulb /> },
    { id: 'innovation_manager', label: 'Innovation Manager', desc: 'R&D Tech Transfer', icon: <HiBriefcase /> },
    { id: 'administrator', label: 'Administrator', desc: 'Platform Admin', icon: <HiShieldCheck /> },
  ];

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
        <div className="glass-card pulse-glow" style={{ padding: '3.5rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(99, 102, 241, 0.18) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
              Join the Enterprise AI Innovation Network
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.25rem', maxWidth: '580px' }}>
              Create an account to manage your research domains, query academic paper & patent databases, and secure strategic grant funding.
            </p>

            {/* Metric Highlights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2.25rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.15rem', borderRadius: '0.85rem' }}>
                <div style={{ color: '#6ee7b7', fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>$15B+</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.825rem', fontWeight: '600' }}>Grant Pool</div>
                <div style={{ color: '#64748b', fontSize: '0.725rem' }}>Live Match Engine</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.15rem', borderRadius: '0.85rem' }}>
                <div style={{ color: '#38bdf8', fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>6 APIs</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.825rem', fontWeight: '600' }}>Connected Datasets</div>
                <div style={{ color: '#64748b', fontSize: '0.725rem' }}>OpenAlex, USPTO, Lens</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.15rem', borderRadius: '0.85rem' }}>
                <div style={{ color: '#c084fc', fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>99.9%</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.825rem', fontWeight: '600' }}>Uptime Health</div>
                <div style={{ color: '#64748b', fontSize: '0.725rem' }}>PostgreSQL & Mongo</div>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HiCheckCircle style={{ color: '#10b981', fontSize: '1.1rem' }} /> Google & GitHub SSO
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HiCheckCircle style={{ color: '#10b981', fontSize: '1.1rem' }} /> Personas & RBAC Guards
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HiCheckCircle style={{ color: '#10b981', fontSize: '1.1rem' }} /> CSV Data Export Tools
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form Panel */}
        <div className="glass-card" style={{ padding: '3.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.4rem 0', color: '#f8fafc' }}>
              Create Account
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
              Select your platform persona and register your profile
            </p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.85rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {/* Social OAuth Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <GoogleOfficialAuthButton text="Google Sign Up" />
            <GithubOfficialAuthButton text="GitHub Sign Up" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', margin: '1.25rem 0', color: '#64748b', fontSize: '0.75rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
            <span>OR REGISTER WITH EMAIL</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.35rem' }}>Full Name</label>
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Dr. Alex Rivera"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.35rem' }}>Organization</label>
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="MIT / TechCorp"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.35rem' }}>Email Address</label>
                <input
                  type="email"
                  className="glass-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="alex@university.edu"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.35rem' }}>Password</label>
                <input
                  type="password"
                  className="glass-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.55rem' }}>Select Platform Persona (RBAC)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                {roleOptions.map((r) => {
                  const isSelected = role === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '0.85rem',
                        cursor: 'pointer',
                        border: isSelected ? '1px solid #0284c7' : '1px solid rgba(255,255,255,0.08)',
                        background: isSelected ? 'rgba(2, 132, 199, 0.2)' : 'rgba(10, 15, 30, 0.4)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}
                    >
                      <div style={{ fontSize: '1.2rem', color: isSelected ? '#38bdf8' : '#64748b' }}>
                        {r.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: '700', color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                          {r.label}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                          {r.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn-gradient" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              {loading ? (
                <span className="shimmer-loading" style={{ padding: '0.2rem 1rem', borderRadius: '0.5rem', width: '100%', display: 'inline-block' }}>Creating Account...</span>
              ) : (
                <>
                  Register Account <HiArrowRight />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
            Already have an account?{' '}
            <Link to="/register" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '700' }}>
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
