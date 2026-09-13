import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HiChartSquareBar, 
  HiUserCircle, 
  HiBookOpen, 
  HiLightBulb, 
  HiShieldCheck, 
  HiCog, 
  HiChip, 
  HiCurrencyDollar, 
  HiSparkles,
  HiTrendingUp,
  HiChartPie,
  HiCollection,
  HiLightningBolt
} from 'react-icons/hi';
import InnovaLogo from './InnovaLogo';

export default function Sidebar() {
  const { user } = useAuth();

  const links = [
    { to: '/dashboard', icon: <HiChartSquareBar />, label: 'Dashboard' },
    { to: '/analytics', icon: <HiChartPie />, label: 'Executive Analytics' },
    { to: '/profile', icon: <HiUserCircle />, label: 'Research Profile' },
    { to: '/publications', icon: <HiBookOpen />, label: 'Publications' },
    { to: '/patents', icon: <HiLightBulb />, label: 'Patent Landscape' },
    { to: '/recommendations', icon: <HiSparkles />, label: 'Grant Recommendations' },
    { to: '/innovation-manager', icon: <HiCollection />, label: 'Innovation Manager' },
    { to: '/scoring', icon: <HiLightningBolt />, label: 'Innovation Scoring' },
    { to: '/trends', icon: <HiTrendingUp />, label: 'Research Trends' },
    { to: '/architecture', icon: <HiChip />, label: 'System Architecture' },
    { to: '/settings', icon: <HiCog />, label: 'Settings' },
  ];

  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      flexShrink: 0,
      background: 'rgba(10, 15, 30, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '1.75rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      minHeight: 'calc(100vh - 68px)',
      boxSizing: 'border-box'
    }}>
      <div>
        <div style={{ padding: '0 0.75rem 1rem 0.75rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Intelligence Engine
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.95rem',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#ffffff' : '#94a3b8',
                background: isActive ? 'linear-gradient(135deg, rgba(2,132,199,0.25) 0%, rgba(99,102,241,0.2) 100%)' : 'transparent',
                border: isActive ? '1px solid rgba(14,165,233,0.45)' : '1px solid transparent',
                boxShadow: isActive ? '0 4px 15px rgba(2,132,199,0.25)' : 'none',
                transition: 'all 0.2s ease'
              })}
            >
              <span style={{ fontSize: '1.2rem', color: '#38bdf8' }}>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}

          {user?.role === 'administrator' && (
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.95rem',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#ffffff' : '#fda4af',
                background: isActive ? 'linear-gradient(135deg, rgba(244,63,94,0.25) 0%, rgba(239,68,68,0.2) 100%)' : 'rgba(244,63,94,0.05)',
                border: isActive ? '1px solid rgba(244,63,94,0.4)' : '1px solid rgba(244,63,94,0.15)',
                transition: 'all 0.2s ease',
                marginTop: '0.5rem'
              })}
            >
              <span style={{ fontSize: '1.2rem', color: '#fca5a5' }}><HiShieldCheck /></span>
              <span>Admin Console</span>
            </NavLink>
          )}
        </nav>
      </div>

      {/* Production System Widget */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(2,132,199,0.12) 0%, rgba(99,102,241,0.12) 100%)',
        border: '1px solid rgba(14,165,233,0.25)',
        borderRadius: '1rem',
        padding: '1rem',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <InnovaLogo size={32} className="logo-animated" />
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f8fafc' }}>InnovaFund Engine</div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>AI Funding & Intelligence Portal</div>
      </div>
    </aside>
  );
}
