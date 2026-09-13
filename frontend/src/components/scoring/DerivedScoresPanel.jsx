import React from 'react';
import { Target, Zap, Activity, DollarSign, Rocket, Compass } from 'lucide-react';

const DERIVED_CONFIG = [
  { key: 'innovation_potential', name: 'Innovation Potential', icon: Zap, color: '#0ea5e9' },
  { key: 'research_impact', name: 'Research Impact', icon: Compass, color: '#8b5cf6' },
  { key: 'commercial_viability', name: 'Commercial Viability', icon: DollarSign, color: '#f59e0b' },
  { key: 'funding_attractiveness', name: 'Funding Attractiveness', icon: Rocket, color: '#ec4899' },
];

export default function DerivedScoresPanel({ derivedScores }) {
  if (!derivedScores) return null;

  const techReadiness = derivedScores.technology_readiness;

  return (
    <div style={{
      background: 'var(--bg-card, rgba(15, 23, 42, 0.75))',
      border: '1px solid var(--border-card, rgba(255, 255, 255, 0.1))',
      borderRadius: '16px',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
        <Activity size={18} color="#0ea5e9" />
        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-main, #f8fafc)' }}>
          Derived Strategic Dimensions & TRL Scale
        </h4>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        marginBottom: '16px'
      }}>
        {DERIVED_CONFIG.map(({ key, name, icon: Icon, color }) => {
          const val = derivedScores[key];
          if (val === undefined) return null;

          return (
            <div
              key={key}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Icon size={16} color={color} />
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main, #f8fafc)' }}>
                  {val.toFixed(1)}
                </span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-sub, #cbd5e1)' }}>
                {name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Technology Readiness Level (TRL) Card */}
      {techReadiness && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
          border: '1px solid rgba(14, 165, 233, 0.25)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#0284c7',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '15px'
            }}>
              TRL {techReadiness.trl}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main, #f8fafc)' }}>
                Technology Readiness Level (NASA 1–9)
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Engineering readiness score: {techReadiness.score.toFixed(1)} / 100
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '3px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
              const active = lvl <= techReadiness.trl;
              return (
                <div
                  key={lvl}
                  style={{
                    width: '18px',
                    height: '8px',
                    borderRadius: '2px',
                    background: active ? '#0ea5e9' : 'rgba(255, 255, 255, 0.1)',
                    transition: 'background 0.3s'
                  }}
                  title={`TRL Level ${lvl}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
