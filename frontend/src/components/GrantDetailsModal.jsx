import React from 'react';
import { HiX, HiCurrencyDollar, HiCalendar, HiSparkles, HiExternalLink } from 'react-icons/hi';

export default function GrantDetailsModal({ grant, onClose }) {
  if (!grant) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }} className="animate-fade-in">
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '650px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(14, 165, 233, 0.2)',
        border: '1px solid rgba(56, 189, 248, 0.3)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#94a3b8',
            borderRadius: '0.5rem',
            padding: '0.4rem',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <HiX />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              color: grant.eligible ? '#10b981' : '#f87171',
              background: grant.eligible ? 'rgba(16,185,129,0.12)' : 'rgba(248,113,113,0.12)',
              border: `1px solid ${grant.eligible ? 'rgba(16,185,129,0.3)' : 'rgba(248,113,113,0.3)'}`,
              padding: '0.25rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: '700'
            }}>
              {grant.eligible ? 'ELIGIBLE GRANT' : 'NOT ELIGIBLE'}
            </span>
            <span style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: '700', background: 'rgba(2,132,199,0.15)', padding: '0.25rem 0.75rem', borderRadius: '0.5rem' }}>
              Match Score: {grant.score?.toFixed(1) || 85} / 100
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: '#f8fafc', lineHeight: 1.3 }}>
            {grant.title}
          </h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
            Funding Agency: <strong style={{ color: '#cbd5e1' }}>{grant.agency || 'Global Research Council'}</strong>
          </p>
        </div>

        {/* Key Attributes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Grant Amount</div>
            <div style={{ color: '#10b981', fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <HiCurrencyDollar /> {grant.amount ? `$${grant.amount.toLocaleString()}` : 'Funding Available'}
            </div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Submission Deadline</div>
            <div style={{ color: '#cbd5e1', fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <HiCalendar /> {grant.deadline ? grant.deadline.split('T')[0] : 'Open Call'}
            </div>
          </div>
        </div>

        {/* Match Breakdown Reasoning */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#38bdf8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <HiSparkles /> AI Match Analysis & Eligibility Reasoning
          </h4>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {grant.reasoning || 'Strong research domain alignment, eligible career stage, and compatible geographical scope.'}
          </p>
        </div>

        {/* Modal Action Footer */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button className="btn-outline" onClick={onClose}>
            Close
          </button>
          {grant.url && (
            <a href={grant.url} target="_blank" rel="noopener noreferrer" className="btn-gradient" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Apply on Agency Portal <HiExternalLink />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
