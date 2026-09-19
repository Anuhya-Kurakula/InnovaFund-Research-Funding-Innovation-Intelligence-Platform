import React from 'react';
import { Lightbulb, ArrowUpRight, ArrowDownRight, FileText } from 'lucide-react';

const formatPillarName = (name) => {
  if (!name) return '';
  return name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function ScoreExplanation({ explanation }) {
  if (!explanation) return null;

  return (
    <div style={{
      background: 'var(--bg-card, rgba(15, 23, 42, 0.75))',
      border: '1px solid var(--border-card, rgba(255, 255, 255, 0.1))',
      borderRadius: '16px',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Lightbulb size={18} color="#f59e0b" />
        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-main, #f8fafc)' }}>
          Scoring Synthesis & Explanation
        </h4>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {/* Top Drivers */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '12px',
          padding: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <ArrowUpRight size={16} color="#10b981" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
              Top Driving Factors
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {explanation.top_drivers?.map((driver) => (
              <span
                key={driver}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}
              >
                {formatPillarName(driver)}
              </span>
            ))}
          </div>
        </div>

        {/* Weakest Pillars */}
        <div style={{
          background: 'rgba(249, 115, 22, 0.08)',
          border: '1px solid rgba(249, 115, 22, 0.2)',
          borderRadius: '12px',
          padding: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <ArrowDownRight size={16} color="#f97316" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f97316', textTransform: 'uppercase' }}>
              Primary Bottlenecks
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {explanation.weakest_pillars?.map((weak) => (
              <span
                key={weak}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  background: 'rgba(249, 115, 22, 0.15)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  color: '#fb923c',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}
              >
                {formatPillarName(weak)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Narrative Card */}
      {explanation.narrative && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          padding: '14px',
          display: 'flex',
          gap: '10px'
        }}>
          <FileText size={16} color="#94a3b8" style={{ marginTop: '2px', flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'var(--text-sub, #cbd5e1)' }}>
            {explanation.narrative}
          </p>
        </div>
      )}
    </div>
  );
}
