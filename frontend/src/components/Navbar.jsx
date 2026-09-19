import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiLogout, HiShieldCheck, HiLightBulb, HiAcademicCap, HiBriefcase, HiSparkles } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import InnovaLogo from './InnovaLogo';
import AITourGuideModal from './AITourGuideModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isTourOpen, setIsTourOpen] = useState(false);
  
  const getRoleIcon = (role) => {
    switch (role) {
      case 'administrator':
        return <HiShieldCheck style={{ fontSize: '1.3rem', color: '#fda4af' }} />;
      case 'startup_founder':
        return <HiLightBulb style={{ fontSize: '1.3rem', color: '#fcd34d' }} />;
      case 'innovation_manager':
        return <HiBriefcase style={{ fontSize: '1.3rem', color: '#6ee7b7' }} />;
      default:
        return <HiAcademicCap style={{ fontSize: '1.3rem', color: '#7dd3fc' }} />;
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'administrator':
        return { bg: 'rgba(244, 63, 94, 0.2)', border: 'rgba(244, 63, 94, 0.45)', text: '#fda4af' };
      case 'startup_founder':
        return { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.45)', text: '#fcd34d' };
      case 'innovation_manager':
        return { bg: 'rgba(16, 185, 129, 0.2)', border: 'rgba(16, 185, 129, 0.45)', text: '#6ee7b7' };
      default:
        return { bg: 'rgba(14, 165, 233, 0.2)', border: 'rgba(14, 165, 233, 0.45)', text: '#7dd3fc' };
    }
  };

  return (
    <>
      <header style={{
        width: '100%',
        boxSizing: 'border-box',
        height: '68px',
        background: 'rgba(10, 15, 30, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexShrink: 0
      }}>
        {/* Left Brand Logo */}
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <InnovaLogo size={42} className="logo-animated" />
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.5px' }}>
              InnovaFund <span style={{ color: '#0ea5e9' }}>AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '-2px' }}>
              Funding & Intelligence
            </span>
          </div>
        </Link>

        {/* Right User Bar & AI Tour Launcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: 'auto' }}>
          {/* AI Tour Button */}
          <button
            onClick={() => setIsTourOpen(true)}
            className="btn-outline"
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(14, 165, 233, 0.35)', color: '#38bdf8' }}
          >
            <HiSparkles /> AI Platform Tour
          </button>

          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.3), rgba(99, 102, 241, 0.3))',
                  border: '1px solid rgba(14, 165, 233, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  boxShadow: '0 2px 10px rgba(2, 132, 199, 0.3)'
                }}>
                  {getRoleIcon(user.role)}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f8fafc', lineHeight: 1.2 }}>
                    {user.full_name}
                  </div>
                </div>
                {(() => {
                  const badge = getRoleBadgeStyle(user.role);
                  return (
                    <span style={{
                      padding: '0.2rem 0.65rem',
                      borderRadius: '1rem',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      background: badge.bg,
                      border: `1px solid ${badge.border}`,
                      color: badge.text
                    }}>
                      {user.role.replace('_', ' ')}
                    </span>
                  );
                })()}
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  width: '38px',
                  height: '38px',
                  borderRadius: '0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'}
              >
                <HiLogout style={{ fontSize: '1.1rem' }} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn-outline" style={{ textDecoration: 'none', padding: '0.5rem 1.1rem', fontSize: '0.875rem' }}>Sign In</Link>
              <Link to="/register" className="btn-gradient" style={{ textDecoration: 'none', padding: '0.5rem 1.1rem', fontSize: '0.875rem' }}>Register</Link>
            </div>
          )}
        </div>
      </header>

      {/* AI Platform Onboarding Guide Modal */}
      <AITourGuideModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
    </>
  );
}
