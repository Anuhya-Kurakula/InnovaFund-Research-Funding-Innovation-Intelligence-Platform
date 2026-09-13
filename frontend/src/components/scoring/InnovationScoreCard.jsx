import React from 'react';
import { Sparkles, Award, TrendingUp, AlertCircle } from 'lucide-react';

const getBandColor = (band) => {
  switch (band?.toLowerCase()) {
    case 'very high':
      return { text: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' };
    case 'high':
      return { text: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.15)', border: 'rgba(14, 165, 233, 0.4)' };
    case 'moderate':
      return { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)' };
    case 'low':
      return { text: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.4)' };
    case 'very low':
    default:
      return { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)' };
  }
};

export default function InnovationScoreCard({ scoreData, loading, error }) {
  if (loading) {
    return (
      <div style={{
        background: 'var(--bg-card, rgba(15, 23, 42, 0.75))',
        border: '1px solid var(--border-card, rgba(255, 255, 255, 0.1))',
        borderRadius: '16px',
        padding: '24px',
        minHeight: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted, #94a3b8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid #0ea5e9', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
          <span>Computing Innovation Score...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        color: '#fca5a5',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <AlertCircle size={24} color="#ef4444" />
        <div>
          <h4 style={{ margin: 0, fontWeight: 600 }}>Scoring Service Unavailable</h4>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!scoreData) {
    return null;
  }

  const bandStyle = getBandColor(scoreData.band);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.7) 100%)',
      border: `1px solid ${bandStyle.border}`,
      boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 20px ${bandStyle.bg}`,
      borderRadius: '16px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Sparkles size={18} color="#0ea5e9" />
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', color: '#94a3b8', textTransform: 'uppercase' }}>
              Project Innovation Score
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-main, #f8fafc)' }}>
            {scoreData.project_id}
          </h3>
        </div>

        <div style={{
          background: bandStyle.bg,
          border: `1px solid ${bandStyle.border}`,
          borderRadius: '20px',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Award size={14} color={bandStyle.text} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: bandStyle.text }}>
            {scoreData.band} Band
          </span>
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <span style={{
          fontSize: '48px',
          fontWeight: 800,
          fontFamily: 'var(--font-heading, Outfit)',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1
        }}>
          {scoreData.innovation_score.toFixed(2)}
        </span>
        <span style={{ fontSize: '18px', color: '#94a3b8', fontWeight: 500 }}>/ 100</span>

        <div style={{ marginLeft: 'auto', textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
          <div>Model v{scoreData.model_version || '1.0.0'}</div>
          <div>5-Pillar Weighted Composite</div>
        </div>
      </div>
    </div>
  );
}
