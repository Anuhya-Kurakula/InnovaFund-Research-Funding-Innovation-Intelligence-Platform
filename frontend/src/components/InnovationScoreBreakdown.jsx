import React from 'react';

const FACTOR_META = {
  research_novelty: { label: 'Research Novelty', color: '#0ea5e9', weightLabel: '30%' },
  patent_strength: { label: 'Patent Strength', color: '#8b5cf6', weightLabel: '20%' },
  technology_maturity: { label: 'Technology Maturity', color: '#06b6d4', weightLabel: '15%' },
  market_potential: { label: 'Market Potential', color: '#10b981', weightLabel: '20%' },
  funding_relevance: { label: 'Funding Relevance', color: '#f59e0b', weightLabel: '15%' },
};

function scoreColor(score) {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#f87171';
}

export default function InnovationScoreBreakdown({ project, weights, compact = false }) {
  if (!project) return null;
  const overall = project.overall_score ?? project.computed_overall ?? 0;
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (overall / 100) * circumference;

  return (
    <div className="glass-card" style={{ padding: compact ? '1.25rem' : '1.75rem' }}>
      <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Overall score ring */}
        <div style={{ position: 'relative', width: '128px', height: '128px', flexShrink: 0 }}>
          <svg width="128" height="128" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
            <circle
              cx="64" cy="64" r="52" fill="none"
              stroke={scoreColor(overall)}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 64 64)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>{overall}</div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em' }}>INNOVATION SCORE</div>
          </div>
        </div>

        {/* Weighted factor bars */}
        <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {Object.entries(project.components || {}).map(([key, value]) => {
            const meta = FACTOR_META[key] || { label: key, color: '#94a3b8', weightLabel: '' };
            return (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.2rem' }}>
                  <span>{meta.label} <span style={{ color: '#64748b' }}>({meta.weightLabel})</span></span>
                  <span style={{ color: meta.color, fontWeight: 700 }}>{value}</span>
                </div>
                <div style={{ height: '7px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${value}%`, height: '100%', background: meta.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
