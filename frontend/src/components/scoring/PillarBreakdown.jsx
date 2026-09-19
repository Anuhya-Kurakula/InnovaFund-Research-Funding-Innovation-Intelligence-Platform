import React, { useEffect, useState } from 'react';
import { Layers, Info, ShieldAlert, Cpu } from 'lucide-react';
import { getScoringWeights } from '../../api/scoring';

const PILLAR_LABELS = {
  research_novelty: 'Research Novelty',
  patent_strength: 'Patent Strength',
  technology_maturity: 'Technology Maturity',
  market_potential: 'Market Potential',
  funding_relevance: 'Funding Relevance'
};

const PILLAR_COLORS = {
  research_novelty: '#0ea5e9',      // Sky
  patent_strength: '#8b5cf6',       // Violet
  technology_maturity: '#10b981',   // Emerald
  market_potential: '#f59e0b',      // Amber
  funding_relevance: '#ec4899'      // Pink
};

export default function PillarBreakdown({ pillars, customWeights }) {
  const [weights, setWeights] = useState(customWeights || null);

  useEffect(() => {
    if (!weights) {
      getScoringWeights()
        .then((res) => {
          if (res?.primary_weights) {
            setWeights(res.primary_weights);
          }
        })
        .catch((err) => {
          console.warn('Could not fetch dynamic scoring weights:', err);
        });
    }
  }, [weights]);

  if (!pillars) return null;

  return (
    <div style={{
      background: 'var(--bg-card, rgba(15, 23, 42, 0.75))',
      border: '1px solid var(--border-card, rgba(255, 255, 255, 0.1))',
      borderRadius: '16px',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="#0ea5e9" />
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-main, #f8fafc)' }}>
            5-Pillar Breakdown & Weight Contributions
          </h4>
        </div>
        <span style={{ fontSize: '11px', color: '#64748b' }}>
          Weights dynamic from engine
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Object.entries(pillars).map(([key, pillar]) => {
          const label = PILLAR_LABELS[key] || key.replace('_', ' ');
          const color = PILLAR_COLORS[key] || '#0ea5e9';
          const weightPct = ((weights?.[key] ?? pillar.weight) * 100).toFixed(0);

          return (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-sub, #cbd5e1)' }}>
                    {label}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#94a3b8'
                  }}>
                    {weightPct}% Weight
                  </span>
                  {pillar.is_fallback && (
                    <span
                      title="This signal is resolved via deterministic seed data / fallback provider"
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        color: '#fbbf24',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <ShieldAlert size={10} /> Seed Fallback
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main, #f8fafc)' }}>
                    {pillar.value.toFixed(1)}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    (+{pillar.contribution.toFixed(2)} pts)
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div style={{
                height: '8px',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, Math.max(0, pillar.value))}%`,
                  background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                  borderRadius: '4px',
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
