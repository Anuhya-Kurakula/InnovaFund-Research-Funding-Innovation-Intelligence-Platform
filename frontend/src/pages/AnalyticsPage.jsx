import React, { useState } from 'react';
import { 
  HiChartBar, 
  HiTrendingUp, 
  HiCurrencyDollar, 
  HiLightBulb, 
  HiBookOpen, 
  HiDownload, 
  HiBadgeCheck, 
  HiOfficeBuilding,
  HiSparkles
} from 'react-icons/hi';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('YTD');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const domainBreakdown = [
    { name: 'Artificial Intelligence & ML', val: '42%', color: '#38bdf8', count: '1,420 Grants', amount: '$6.4B' },
    { name: 'Quantum & Deep Tech', val: '24%', color: '#c084fc', count: '810 Grants', amount: '$3.6B' },
    { name: 'Clean Energy & Sustainability', val: '18%', color: '#34d399', count: '605 Grants', amount: '$2.8B' },
    { name: 'Biomedical & GenAI Health', val: '16%', color: '#fb7185', count: '540 Grants', amount: '$2.4B' },
  ];

  const topInstitutions = [
    { name: 'Stanford Innovation Lab', grants: 48, funding: '$142M', winRate: '78.5%' },
    { name: 'MIT Computer Science & AI Lab', grants: 54, funding: '$186M', winRate: '82.1%' },
    { name: 'ETH Zürich Quantum Institute', grants: 39, funding: '$115M', winRate: '74.0%' },
    { name: 'Oxford Biomedical AI Consortium', grants: 42, funding: '$128M', winRate: '76.4%' },
  ];

  const patentWhiteSpaces = [
    { sector: 'Neuromorphic Chip Architectures', patentsCount: 1240, whitespaceScore: '94/100', status: 'High Opportunity' },
    { sector: 'Post-Quantum Encryption Protocols', patentsCount: 890, whitespaceScore: '91/100', status: 'High Opportunity' },
    { sector: 'Solid-State Battery Electrolytes', patentsCount: 1560, whitespaceScore: '86/100', status: 'Moderate Competition' },
    { sector: 'Autonomous Surgical Robotics', patentsCount: 2100, whitespaceScore: '82/100', status: 'Moderate Competition' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }} className="animate-fade-in">
      
      {/* Executive Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.35rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              Executive Suite
            </span>
            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>• Live Intelligence Telemetry</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: 0, color: '#f8fafc', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HiChartBar style={{ color: '#38bdf8' }} /> Executive Analytics & Intelligence Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0.4rem 0 0 0' }}>
            Real-time insights across $15.2B in global grant allocations, commercialization velocity, and patent whitespace mapping.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem', padding: '0.25rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {['Q3', 'YTD', '1Y', 'ALL'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  background: timeRange === range ? '#0284c7' : 'transparent',
                  color: timeRange === range ? '#ffffff' : '#94a3b8',
                  transition: 'all 0.2s ease'
                }}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            className="btn-gradient"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.15rem', fontSize: '0.875rem' }}
          >
            <HiDownload /> {downloadSuccess ? 'Report Downloaded!' : 'Export Executive Summary'}
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>Global Indexed Capital</span>
            <div style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.5rem', borderRadius: '0.65rem', fontSize: '1.2rem' }}><HiCurrencyDollar /></div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>$15.2 Billion</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#34d399', fontWeight: '600' }}>
            <HiTrendingUp /> +14.8% vs last fiscal quarter
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>AI Commercialization Rate</span>
            <div style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', padding: '0.5rem', borderRadius: '0.65rem', fontSize: '1.2rem' }}><HiTrendingUp /></div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>84.6%</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#34d399', fontWeight: '600' }}>
            <HiBadgeCheck /> High commercial viability threshold
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>Global Patents Mapped</span>
            <div style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '0.5rem', borderRadius: '0.65rem', fontSize: '1.2rem' }}><HiLightBulb /></div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>142 Million+</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#38bdf8', fontWeight: '600' }}>
            USPTO, WIPO & Google Patents
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>Indexed Research Papers</span>
            <div style={{ background: 'rgba(251, 113, 133, 0.15)', color: '#fb7185', padding: '0.5rem', borderRadius: '0.65rem', fontSize: '1.2rem' }}><HiBookOpen /></div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>250 Million+</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>
            OpenAlex, CrossRef & Semantic Scholar
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Funding Allocation by Sector Panel */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>Funding Allocation by Research Sector</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Distribution of live capital across priority innovation domains</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: '600' }}>
              <HiSparkles /> AI-Analyzed
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {domainBreakdown.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: '600', color: '#f8fafc' }}>{item.name}</span>
                  <span style={{ fontWeight: '700', color: item.color }}>{item.amount} ({item.val})</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: item.val, height: '100%', background: item.color, borderRadius: '5px', transition: 'width 0.8s ease' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.3rem' }}>
                  <span>{item.count}</span>
                  <span>Active Win Rate ~76%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Research & Commercial Leaders */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>Top Performing Institutions</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Ranked by grant acquisition & technology transfer</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {topInstitutions.map((inst, idx) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '0.75rem', padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HiOfficeBuilding style={{ color: '#38bdf8' }} /> {inst.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    {inst.grants} Active Grants • Win Rate: <span style={{ color: '#34d399', fontWeight: '600' }}>{inst.winRate}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontWeight: '800', color: '#38bdf8', fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>
                  {inst.funding}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patent White-Space Opportunity Matrix */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>Patent White-Space & Commercial Potential Matrix</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>High-value research areas with low patent density and high commercial grant support</p>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            Updated Hourly
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#64748b' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: '700' }}>Technology Sector</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: '700' }}>Indexed Patents</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: '700' }}>White-Space Opportunity Score</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: '700' }}>Market Status</th>
              </tr>
            </thead>
            <tbody>
              {patentWhiteSpaces.map((space, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#f8fafc' }}>{space.sector}</td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>{space.patentsCount.toLocaleString()}</td>
                  <td style={{ padding: '1rem', fontWeight: '700', color: '#38bdf8' }}>{space.whitespaceScore}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      background: space.status === 'High Opportunity' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 146, 60, 0.15)',
                      color: space.status === 'High Opportunity' ? '#34d399' : '#fb923c',
                      border: space.status === 'High Opportunity' ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(251, 146, 60, 0.3)'
                    }}>
                      {space.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
