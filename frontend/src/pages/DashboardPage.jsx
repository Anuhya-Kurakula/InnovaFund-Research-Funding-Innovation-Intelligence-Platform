import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiBookOpen, HiLightBulb, HiCurrencyDollar, HiChartBar, HiUsers, HiUserCircle, HiSparkles, HiArrowRight, HiShieldCheck, HiTrendingUp, HiChip } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import GrantMatchingModal from '../components/GrantMatchingModal';
import TechnologyIntelligenceModal from '../components/TechnologyIntelligenceModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);


  
  const currentUser = user || (() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return {
      full_name: 'Platform Innovator',
      role: 'researcher',
      email: 'user@innovafund.ai'
    };
  })();


  const getRoleStats = () => {
    switch (currentUser.role) {
      case 'researcher':
        return [
          { label: 'Publications Indexed', value: '42', color: '#0ea5e9', icon: <HiBookOpen />, sub: '+5 this month' },
          { label: 'Citations Tracked', value: '1,204', color: '#8b5cf6', icon: <HiChartBar />, sub: 'Top 5% in field' },
          { label: 'Patents Cataloged', value: '3', color: '#06b6d4', icon: <HiLightBulb />, sub: '2 Granted' },
          { label: 'Innovation Impact', value: '88/100', color: '#10b981', icon: <HiSparkles />, sub: 'High commercial readiness' },
        ];
      case 'startup_founder':
        return [
          { label: 'Funding Opportunity Matches', value: '14', color: '#0ea5e9', icon: <HiCurrencyDollar />, sub: '$4.2M total pool' },
          { label: 'Technology IP Matches', value: '8', color: '#8b5cf6', icon: <HiLightBulb />, sub: 'Licensing ready' },
          { label: 'Patents Monitored', value: '12', color: '#06b6d4', icon: <HiBookOpen />, sub: '3 Assignees' },
          { label: 'Market Potential', value: '92/100', color: '#10b981', icon: <HiChartBar />, sub: 'DeepTech Sector' },
        ];
      case 'administrator':
        return [
          { label: 'Platform Registered Users', value: '1,248', color: '#0ea5e9', icon: <HiUsers />, sub: '840 Researchers' },
          { label: 'Datasets Connected', value: '6 APIs', color: '#8b5cf6', icon: <HiBookOpen />, sub: 'OpenAlex, USPTO, Lens' },
          { label: 'System Health Uptime', value: '99.9%', color: '#10b981', icon: <HiShieldCheck />, sub: 'PostgreSQL + MongoDB' },
          { label: 'Audit Events Logged', value: '4,892', color: '#06b6d4', icon: <HiChartBar />, sub: 'Dual DB Stream' },
        ];
      default:
        return [
          { label: 'R&D Projects', value: '24', color: '#0ea5e9', icon: <HiBookOpen />, sub: 'Active' },
          { label: 'Institutional Researchers', value: '142', color: '#8b5cf6', icon: <HiUsers />, sub: '12 Departments' },
          { label: 'Patents Cataloged', value: '89', color: '#06b6d4', icon: <HiLightBulb />, sub: 'USPTO + Google' },
          { label: 'Innovation Index', value: '9.4/10', color: '#10b981', icon: <HiSparkles />, sub: 'Top Tier' },
        ];
    }
  };

  const fundingGrants = [
    { title: 'National DeepTech Innovation Grant 2026', agency: 'National Research Foundation', amount: '$500,000', deadline: 'Aug 30, 2026', tags: ['AI', 'Robotics'] },
    { title: 'Horizon Quantum Computing & IP Accelerator', agency: 'European Innovation Council', amount: '€1,200,000', deadline: 'Sep 15, 2026', tags: ['Quantum', 'Hardware'] },
    { title: 'BioTech Commercialization Seed Fund', agency: 'Global Health Institute', amount: '$250,000', deadline: 'Oct 01, 2026', tags: ['BioTech', 'Pharma'] },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box', width: '100%' }} className="animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '2rem 2.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            <HiSparkles /> Enterprise Innovation Intelligence Dashboard
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome back, {currentUser.full_name}
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
            Here is your innovation portfolio overview, active dataset updates, and matching funding opportunities.
          </p>
        </div>

        <button onClick={() => navigate('/profile')} className="btn-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          Manage Profile <HiArrowRight />
        </button>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {getRoleStats().map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500' }}>{stat.label}</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: `${stat.color}20`, border: `1px solid ${stat.color}45`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#f8fafc', marginBottom: '0.2rem' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.775rem', color: stat.color, fontWeight: '600' }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Visual Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* SVG Analytics Chart 1: Citation Growth Trend */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: '#f8fafc' }}>
                Citation Growth Velocity (YoY)
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>OpenAlex & CrossRef Aggregated Citations</p>
            </div>
            <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <HiTrendingUp /> +38.4% YoY
            </span>
          </div>

          <div style={{ height: '140px', width: '100%', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0 100 Q 80 80, 160 50 T 320 20 L 400 10 L 400 120 L 0 120 Z" fill="url(#chartGrad)" />
              <path d="M 0 100 Q 80 80, 160 50 T 320 20 L 400 10" stroke="#0ea5e9" strokeWidth="3.5" fill="none" />
              <circle cx="160" cy="50" r="4" fill="#38bdf8" />
              <circle cx="320" cy="20" r="4" fill="#38bdf8" />
              <circle cx="400" cy="10" r="5" fill="#10b981" />
            </svg>
          </div>
        </div>

        {/* SVG Analytics Chart 2: Patent Landscape Distribution */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: '#f8fafc' }}>
                Patent Landscape Distribution
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>USPTO, Google Patents & The Lens IP Coverage</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button onClick={() => setIsTechModalOpen(true)} className="btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', border: '1px solid rgba(192, 132, 252, 0.4)', color: '#c084fc' }}>
                <HiChip /> Tech Intelligence Engine
              </button>
              <span style={{ color: '#a5b4fc', fontWeight: '700', fontSize: '0.85rem' }}>140M Records</span>
            </div>
          </div>


          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>
                <span>Artificial Intelligence & ML</span>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>42%</span>
              </div>
              <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', background: 'linear-gradient(90deg, #0284c7, #38bdf8)', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>
                <span>Quantum Computing & IP</span>
                <span style={{ color: '#c084fc', fontWeight: '700' }}>31%</span>
              </div>
              <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '31%', height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #c084fc)', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>
                <span>BioTech & Drug Discovery</span>
                <span style={{ color: '#6ee7b7', fontWeight: '700' }}>27%</span>
              </div>
              <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '27%', height: '100%', background: 'linear-gradient(90deg, #059669, #6ee7b7)', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Funding Opportunity Discovery + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.75rem' }}>
        {/* Funding Grants Preview Widget */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: '#f8fafc' }}>
                Matching Funding & Grant Opportunities
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                Discovered programs matching your research domains and keywords
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button onClick={() => setIsMatchModalOpen(true)} className="btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(14, 165, 233, 0.4)', color: '#38bdf8' }}>
                <HiSparkles /> Test Rules Engine
              </button>
              <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#6ee7b7', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '700', flexShrink: 0 }}>
                3 Live Matches
              </span>
            </div>
          </div>


          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {fundingGrants.map((grant, idx) => (
              <div key={idx} style={{ background: 'rgba(10, 15, 30, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s ease' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    {grant.tags.map((t, ti) => (
                      <span key={ti} style={{ background: 'rgba(14,165,233,0.15)', color: '#7dd3fc', padding: '0.15rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: '600' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: '#f8fafc' }}>
                    {grant.title}
                  </h4>
                  <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                    Sponsor: <span style={{ color: '#cbd5e1' }}>{grant.agency}</span> • Deadline: <span style={{ color: '#fca5a5' }}>{grant.deadline}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981', fontFamily: 'var(--font-heading)' }}>
                    {grant.amount}
                  </div>
                  <button className="btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Apply Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/publications')}>
            <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(14,165,233,0.2)', color: '#7dd3fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '0.85rem' }}>
              <HiBookOpen />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.35rem 0' }}>Publication Search</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: 0, lineHeight: 1.5 }}>
              Query OpenAlex, CrossRef, and Semantic Scholar academic repositories.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/patents')}>
            <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(139,92,246,0.2)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '0.85rem' }}>
              <HiLightBulb />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.35rem 0' }}>Patent Intelligence</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: 0, lineHeight: 1.5 }}>
              Search USPTO, Google Patents, and The Lens IP landscape records.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
            <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(6,182,212,0.2)', color: '#67e8f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '0.85rem' }}>
              <HiUserCircle />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.35rem 0' }}>Update Profile</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: 0, lineHeight: 1.5 }}>
              Manage research domains, technology keywords, and publication links.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Grant Matching Engine Modal */}
      <GrantMatchingModal isOpen={isMatchModalOpen} onClose={() => setIsMatchModalOpen(false)} />

      {/* Interactive Release Technology Intelligence Engine Modal */}
      <TechnologyIntelligenceModal isOpen={isTechModalOpen} onClose={() => setIsTechModalOpen(false)} />
    </div>
  );
}


