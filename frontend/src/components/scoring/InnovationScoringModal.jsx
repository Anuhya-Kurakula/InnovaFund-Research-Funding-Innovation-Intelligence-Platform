import React, { useState, useEffect } from 'react';
import { X, Sparkles, RefreshCw, Sliders, CheckCircle2, AlertTriangle } from 'lucide-react';
import { calculateScore, getScore } from '../../api/scoring';
import InnovationScoreCard from './InnovationScoreCard';
import PillarBreakdown from './PillarBreakdown';
import DerivedScoresPanel from './DerivedScoresPanel';
import ScoreExplanation from './ScoreExplanation';

const PRESET_PROJECTS = [
  { id: 'PRJ-001', label: 'PRJ-001 — Lattice Cryptography (AI/ML)' },
  { id: 'PRJ-002', label: 'PRJ-002 — CRISPR Drought Resistance (Agritech)' },
  { id: 'PRJ-003', label: 'PRJ-003 — Solid-State Sodium Battery (Clean Energy)' },
  { id: 'PRJ-004', label: 'PRJ-004 — 2nm GaN GAA Transistor (Semiconductors)' },
  { id: 'PRJ-005', label: 'PRJ-005 — Targeted mRNA Nanoparticles (Biotech)' },
  { id: 'PRJ-007', label: 'PRJ-007 — Soil Microbiome Biochar (Agritech)' },
  { id: 'PRJ-010', label: 'PRJ-010 — Allogeneic CAR-NK Cell Platform (Biotech)' },
  { id: 'PRJ-014', label: 'PRJ-014 — Superconducting Qubit QPU (Semiconductors)' },
];

export default function InnovationScoringModal({ isOpen, onClose, initialProjectId = 'PRJ-007' }) {
  const [selectedProject, setSelectedProject] = useState(initialProjectId);
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Custom inline sliders mode
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customPillars, setCustomPillars] = useState({
    research_novelty: 81.0,
    patent_strength: 66.5,
    technology_maturity: 58.0,
    market_potential: 74.0,
    funding_relevance: 75.0,
  });

  const fetchScore = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await calculateScore({ project_id: projectId });
      setScoreData(data);
    } catch (err) {
      console.error('Error fetching score:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to calculate innovation score');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        project_id: `CUSTOM-${Date.now().toString().slice(-4)}`,
        research_novelty: parseFloat(customPillars.research_novelty),
        patent_strength: parseFloat(customPillars.patent_strength),
        technology_maturity: parseFloat(customPillars.technology_maturity),
        market_potential: parseFloat(customPillars.market_potential),
        funding_relevance: parseFloat(customPillars.funding_relevance),
      };
      const data = await calculateScore(payload);
      setScoreData(data);
    } catch (err) {
      console.error('Error calculating custom score:', err);
      setError(err.response?.data?.detail || err.message || 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (!isCustomMode) {
        fetchScore(selectedProject);
      }
    }
  }, [isOpen, selectedProject, isCustomMode]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-dark, #030712)',
        border: '1px solid var(--border-card, rgba(255, 255, 255, 0.15))',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        color: 'var(--text-main, #f8fafc)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: 'rgba(3, 7, 18, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
              padding: '8px',
              borderRadius: '10px'
            }}>
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                Innovation Scoring Engine
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Milestone 3 — Member 4 Standardized Evaluation Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Controls Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>Preset Project:</span>
              <select
                disabled={isCustomMode || loading}
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  padding: '8px 12px',
                  fontSize: '13px',
                  flex: 1
                }}
              >
                {PRESET_PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsCustomMode(!isCustomMode)}
                style={{
                  background: isCustomMode ? '#0284c7' : 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sliders size={14} />
                {isCustomMode ? 'Using Custom Sliders' : 'Custom Input Mode'}
              </button>

              <button
                onClick={() => isCustomMode ? handleCustomCalculate() : fetchScore(selectedProject)}
                disabled={loading}
                style={{
                  background: '#0ea5e9',
                  border: 'none',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                {loading ? 'Evaluating...' : 'Recalculate'}
              </button>
            </div>
          </div>

          {/* Custom Sliders Drawer */}
          {isCustomMode && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px'
            }}>
              {Object.keys(customPillars).map((k) => (
                <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                    <span>{k.replace('_', ' ')}</span>
                    <span style={{ fontWeight: 700 }}>{customPillars[k]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={customPillars[k]}
                    onChange={(e) => setCustomPillars({ ...customPillars, [k]: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: '#0ea5e9' }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Visual Components */}
          <InnovationScoreCard scoreData={scoreData} loading={loading} error={error} />
          
          {scoreData && (
            <>
              <PillarBreakdown pillars={scoreData.pillars} />
              <DerivedScoresPanel derivedScores={scoreData.derived_scores} />
              <ScoreExplanation explanation={scoreData.explanation} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
