import React from 'react';
import {
  HiCube,
  HiDocumentText,
  HiRocketLaunch,
  HiUserGroup,
  HiArrowTrendingUp,
} from 'react-icons/hi2';

const TYPE_META = {
  productization: {
    label: 'Productization',
    icon: HiCube,
    color: '#0ea5e9',
    action: 'Build Product',
  },

  licensing: {
    label: 'Licensing',
    icon: HiDocumentText,
    color: '#8b5cf6',
    action: 'Explore Licensing',
  },

  startup: {
    label: 'Startup Creation',
    icon: HiRocketLaunch,
    color: '#10b981',
    action: 'Evaluate Spin-out',
  },

  partnership: {
    label: 'Industry Partnership',
    icon: HiUserGroup,
    color: '#f59e0b',
    action: 'Find Partners',
  },
};

function getConfidenceLabel(confidence) {
  if (confidence >= 85) return 'Very High';
  if (confidence >= 70) return 'High';
  if (confidence >= 55) return 'Moderate';
  return 'Low';
}

export default function CommercializationCard({
  recommendation,
  projectTitle,
}) {
  const meta =
    TYPE_META[recommendation.type] ||
    TYPE_META.productization;

  const Icon = meta.icon;

  const confidence = Number(
    recommendation.confidence || 0
  );

  return (
    <div
      className="glass-card"
      style={{
        position: 'relative',
        overflow: 'hidden',

        padding: '1.25rem',

        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',

        border: `1px solid ${meta.color}20`,

        transition:
          'transform 0.18s ease, border-color 0.18s ease',
      }}
    >
      {/* Top accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: meta.color,
          opacity: 0.7,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              flexShrink: 0,

              borderRadius: '0.7rem',

              background: `${meta.color}14`,
              border: `1px solid ${meta.color}35`,

              color: meta.color,
              fontSize: '1.1rem',
            }}
          >
            <Icon />
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: meta.color,
                fontSize: '0.62rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {meta.label}
            </div>

            <div
              style={{
                marginTop: '0.15rem',

                overflow: 'hidden',
                textOverflow: 'ellipsis',

                color: '#f8fafc',
                fontSize: '0.9rem',
                fontWeight: 800,
              }}
            >
              {recommendation.title}
            </div>
          </div>
        </div>

        {/* Confidence */}
        <div
          style={{
            flexShrink: 0,
            textAlign: 'right',
          }}
        >
          <div
            style={{
              color: meta.color,
              fontSize: '1.25rem',
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {confidence}%
          </div>

          <div
            style={{
              marginTop: '0.2rem',
              color: '#64748b',
              fontSize: '0.58rem',
            }}
          >
            {getConfidenceLabel(confidence)}
          </div>
        </div>
      </div>

      {/* Project */}
      {projectTitle && (
        <div
          style={{
            color: '#64748b',
            fontSize: '0.63rem',
          }}
        >
          For{' '}
          <span
            style={{
              color: '#94a3b8',
            }}
          >
            {projectTitle}
          </span>
        </div>
      )}

      {/* Confidence progress */}
      <div>
        <div
          style={{
            height: '4px',
            overflow: 'hidden',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.05)',
          }}
        >
          <div
            style={{
              width: `${Math.min(
                Math.max(confidence, 0),
                100
              )}%`,
              height: '100%',
              borderRadius: 'inherit',
              background: meta.color,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Summary */}
      <p
        style={{
          margin: 0,

          color: '#cbd5e1',
          fontSize: '0.76rem',
          lineHeight: 1.6,
        }}
      >
        {recommendation.summary}
      </p>

      {/* Signals */}
      {recommendation.signals?.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
          }}
        >
          {recommendation.signals.map(
            (signal, index) => (
              <span
                key={index}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',

                  padding: '0.25rem 0.5rem',

                  color: '#94a3b8',
                  background:
                    'rgba(255,255,255,0.04)',

                  border:
                    '1px solid rgba(255,255,255,0.06)',

                  borderRadius: '999px',

                  fontSize: '0.59rem',
                  fontWeight: 600,
                }}
              >
                <HiArrowTrendingUp
                  style={{
                    color: meta.color,
                  }}
                />

                {signal}
              </span>
            )
          )}
        </div>
      )}

      {/* Action */}
      <button
        type="button"
        style={{
          marginTop: '0.1rem',

          width: '100%',
          padding: '0.55rem 0.7rem',

          borderRadius: '0.65rem',

          color: meta.color,
          background: `${meta.color}09`,
          border: `1px solid ${meta.color}25`,

          fontSize: '0.65rem',
          fontWeight: 700,

          cursor: 'pointer',
        }}
        onClick={() => {
          // Reserved for future commercialization workflow.
          // Member 5's live workflow can be connected here later.
        }}
      >
        {meta.action}
      </button>
    </div>
  );
}