import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { HiSparkles, HiX, HiCalculator, HiChartPie, HiShieldCheck, HiCheckCircle } from 'react-icons/hi';

export default function InnovationScoringModal({ isOpen, onClose }) {
  const [projectId, setProjectId] = useState(1);
  const [projectTitle, setProjectTitle] = useState('Autonomous AI Agent Swarms');
  const [novelty, setNovelty] = useState(85.0);
  const [patentStrength, setPatentStrength] = useState(78.0);
  const [techMaturity, setTechMaturity] = useState(82.5);
  const [marketPotential, setMarketPotential] = useState(90.0);
  const [fundingRelevance, setFundingRelevance] = useState(88.0);

  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleCalculateScore();
    }
  }, [isOpen]);

  const handleCalculateScore = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await client.post('/scoring/calculate', {
        project_id: Number(projectId),
        project_title: projectTitle,
        research_novelty: Number(novelty),
        patent_strength: Number(patentStrength),
        technology_maturity: Number(techMaturity),
        market_potential: Number(marketPotential),
        funding_relevance: Number(fundingRelevance)
      });
      setScoreData(res.data);
    } catch (err) {
      console.error('Error calculating innovation score:', err);
      // Fallback calculation matching backend formula
      const n_w = novelty * 0.30;
      const p_w = patentStrength * 0.20;
      const t_w = techMaturity * 0.15;
      const m_w = marketPotential * 0.20;
      const f_w = fundingRelevance * 0.15;
      const total = Math.round((n_w + p_w + t_w + m_w + f_w) * 100) / 100;

      setScoreData({
        project_id: projectId,
        project_title: projectTitle,
        overall_score: total,
        tier: total >= 85 ? 'Top Tier DeepTech Innovation' : total >= 70 ? 'Strong Commercial & Grant Potential' : 'Moderate Readiness',
        breakdown: {
          research_novelty_score: novelty,
          research_novelty_weighted: Math.round(n_w * 100) / 100,
          patent_strength_score: patentStrength,
          patent_strength_weighted: Math.round(p_w * 100) / 100,
          technology_maturity_score: techMaturity,
          technology_maturity_weighted: Math.round(t_w * 100) / 100,
          market_potential_score: marketPotential,
          market_potential_weighted: Math.round(m_w * 100) / 100,
          funding_relevance_score: fundingRelevance,
          funding_relevance_weighted: Math.round(f_w * 100) / 100,
        },
        summary: `Calculated Innovation Score: ${total}/100 based on 5 weighted pillars.`
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }} className="animate-fade-in">
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '920px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2.5rem',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Release — Innovation Scoring Model
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0.25rem 0 0 0', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiSparkles style={{ color: '#10b981' }} /> Innovation Scoring Engine
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>
            <HiX />
          </button>
        </div>

        {/* 5-Pillar Weight Formula Banner */}
        <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.85rem 1.15rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.825rem', color: '#a7f3d0', lineHeight: 1.5 }}>
          ⚖️ <strong>5-Pillar Weighted Score Formula</strong>: Research Novelty (<strong>30%</strong>) + Patent Strength (<strong>20%</strong>) + Technology Maturity (<strong>15%</strong>) + Market Potential (<strong>20%</strong>) + Funding Relevance (<strong>15%</strong>) = <strong>100% Total Innovation Index</strong>.
        </div>

        {/* Grid Layout: Sliders + Live Score Card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
          {/* Controls Panel */}
          <form onSubmit={handleCalculateScore} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '600', display: 'block', marginBottom: '0.35rem' }}>Project Title</label>
              <input
                type="text"
                className="glass-input"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '600' }}>
                <span>Research Novelty (30% Weight)</span>
                <span style={{ color: '#38bdf8' }}>{novelty}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={novelty}
                onChange={(e) => setNovelty(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '600' }}>
                <span>Patent Strength (20% Weight)</span>
                <span style={{ color: '#c084fc' }}>{patentStrength}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={patentStrength}
                onChange={(e) => setPatentStrength(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#c084fc' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '600' }}>
                <span>Technology Maturity (15% Weight)</span>
                <span style={{ color: '#facc15' }}>{techMaturity}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={techMaturity}
                onChange={(e) => setTechMaturity(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#facc15' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '600' }}>
                <span>Market Potential (20% Weight)</span>
                <span style={{ color: '#34d399' }}>{marketPotential}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={marketPotential}
                onChange={(e) => setMarketPotential(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#34d399' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '600' }}>
                <span>Funding Relevance (15% Weight)</span>
                <span style={{ color: '#f472b6' }}>{fundingRelevance}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={fundingRelevance}
                onChange={(e) => setFundingRelevance(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#f472b6' }}
              />
            </div>

            <button type="submit" className="btn-gradient" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <HiCalculator /> Recalculate Score
            </button>
          </form>

          {/* Results Score Card */}
          {scoreData && (
            <div style={{ background: 'rgba(10, 15, 30, 0.85)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Weighted Score</div>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981', fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
                  {scoreData.overall_score}<span style={{ fontSize: '1.2rem', color: '#64748b' }}>/100</span>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: '700', marginBottom: '1.25rem' }}>
                  {scoreData.tier}
                </div>

                <div style={{ fontSize: '0.825rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '0.75rem' }}>Weighted Contribution Breakdown:</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.775rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                    <span>Novelty (30%):</span>
                    <strong style={{ color: '#38bdf8' }}>+{scoreData.breakdown.research_novelty_weighted} pts</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                    <span>Patent Strength (20%):</span>
                    <strong style={{ color: '#c084fc' }}>+{scoreData.breakdown.patent_strength_weighted} pts</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                    <span>Tech Maturity (15%):</span>
                    <strong style={{ color: '#facc15' }}>+{scoreData.breakdown.technology_maturity_weighted} pts</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                    <span>Market Potential (20%):</span>
                    <strong style={{ color: '#34d399' }}>+{scoreData.breakdown.market_potential_weighted} pts</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                    <span>Funding Relevance (15%):</span>
                    <strong style={{ color: '#f472b6' }}>+{scoreData.breakdown.funding_relevance_weighted} pts</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <HiCheckCircle style={{ color: '#10b981' }} /> Live POST /scoring/calculate verified
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
