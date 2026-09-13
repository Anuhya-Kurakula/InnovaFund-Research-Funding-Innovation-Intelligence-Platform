import React from 'react';

const STAGE_META = {
  ideation: {
    label: 'Ideation',
    color: '#94a3b8',
  },
  evaluation: {
    label: 'Evaluation',
    color: '#0ea5e9',
  },
  productization: {
    label: 'Productization',
    color: '#8b5cf6',
  },
  licensing: {
    label: 'Licensing',
    color: '#06b6d4',
  },
  startup: {
    label: 'Startup',
    color: '#10b981',
  },
};

function scoreColor(score) {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#f87171';
}

export default function PipelineTracker({
  stages = [],
  grouped = {},
  onSelectProject,
  selectedProjectId,
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.max(
          stages.length,
          1
        )}, minmax(0, 1fr))`,
        gap: '0.75rem',
        width: '100%',
      }}
    >
      {stages.map((stage) => {
        const meta =
          STAGE_META[stage] || {
            label: stage,
            color: '#94a3b8',
          };

        const items = grouped[stage] || [];

        return (
          <div
            key={stage}
            style={{
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            {/* Stage header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.4rem',
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: meta.color,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${meta.color}55`,
                  }}
                />

                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    color: meta.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.045em',
                  }}
                >
                  {meta.label}
                </span>
              </div>

              <span
                style={{
                  flexShrink: 0,
                  minWidth: '22px',
                  textAlign: 'center',
                  fontSize: '0.62rem',
                  color: '#94a3b8',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '999px',
                  padding: '0.15rem 0.35rem',
                }}
              >
                {items.length}
              </span>
            </div>

            {/* Stage cards */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
                minHeight: '110px',
              }}
            >
              {items.length === 0 && (
                <div
                  style={{
                    minHeight: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    padding: '0.8rem',

                    color: '#475569',
                    border:
                      '1px dashed rgba(255,255,255,0.08)',
                    borderRadius: '0.75rem',

                    fontSize: '0.65rem',
                    textAlign: 'center',
                  }}
                >
                  No projects
                </div>
              )}

              {items.map((project) => {
                const isSelected =
                  project.project_id === selectedProjectId;

                return (
                  <button
                    key={project.project_id}
                    type="button"
                    onClick={() =>
                      onSelectProject &&
                      onSelectProject(project.project_id)
                    }
                    style={{
                      width: '100%',
                      minWidth: 0,

                      textAlign: 'left',

                      cursor: onSelectProject
                        ? 'pointer'
                        : 'default',

                      background: isSelected
                        ? 'rgba(14,165,233,0.12)'
                        : 'rgba(2,6,23,0.38)',

                      border: isSelected
                        ? `1px solid ${meta.color}66`
                        : '1px solid rgba(255,255,255,0.065)',

                      borderRadius: '0.8rem',

                      padding: '0.7rem',

                      boxShadow: isSelected
                        ? `0 0 20px ${meta.color}10`
                        : 'none',

                      transition:
                        'all 0.18s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '0.45rem',
                      }}
                    >
                      <div
                        style={{
                          minWidth: 0,
                          color: '#f1f5f9',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          lineHeight: 1.35,
                        }}
                      >
                        {project.title}
                      </div>

                      <span
                        style={{
                          flexShrink: 0,
                          color: scoreColor(
                            project.overall_score
                          ),
                          fontSize: '0.72rem',
                          fontWeight: 900,
                        }}
                      >
                        {project.overall_score}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: '0.4rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: '#64748b',
                        fontSize: '0.61rem',
                      }}
                    >
                      {project.domain}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}