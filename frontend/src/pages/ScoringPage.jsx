import React, { useState, useEffect } from 'react';
import {
  HiSparkles,
  HiRefresh,
  HiAdjustments,
  HiDocumentReport,
  HiLightningBolt,
  HiScale,
  HiAcademicCap,
  HiBriefcase,
  HiCash,
  HiCheckCircle,
  HiExclamation
} from 'react-icons/hi';
import { calculateScore, getScore, getScoringWeights, getScoreHistory, batchScore } from '../api/scoring';
import InnovationScoreCard from '../components/scoring/InnovationScoreCard';
import PillarBreakdown from '../components/scoring/PillarBreakdown';
import DerivedScoresPanel from '../components/scoring/DerivedScoresPanel';
import ScoreExplanation from '../components/scoring/ScoreExplanation';

const PRESET_PROJECTS = [
  { id: 'PRJ-001', label: 'PRJ-001 — Lattice Cryptography (AI/ML)', domain: 'AI/ML' },
  { id: 'PRJ-002', label: 'PRJ-002 — CRISPR Drought Resistance (Agritech)', domain: 'Agritech' },
  { id: 'PRJ-003', label: 'PRJ-003 — Solid-State Sodium Battery (Clean Energy)', domain: 'Clean Energy' },
  { id: 'PRJ-004', label: 'PRJ-004 — 2nm GaN GAA Transistor (Semiconductors)', domain: 'Semiconductors' },
  { id: 'PRJ-005', label: 'PRJ-005 — Targeted mRNA Nanoparticles (Biotech)', domain: 'Biotech' },
  { id: 'PRJ-006', label: 'PRJ-006 — Neuromorphic Vision Sensor (AI/ML)', domain: 'AI/ML' },
  { id: 'PRJ-007', label: 'PRJ-007 — Soil Microbiome Biochar (Agritech)', domain: 'Agritech' },
  { id: 'PRJ-008', label: 'PRJ-008 — Perovskite-Silicon Tandem Solar (Clean Energy)', domain: 'Clean Energy' },
  { id: 'PRJ-009', label: 'PRJ-009 — Photonic Interconnect Fabric (Semiconductors)', domain: 'Semiconductors' },
  { id: 'PRJ-010', label: 'PRJ-010 — Allogeneic CAR-NK Cell Platform (Biotech)', domain: 'Biotech' },
  { id: 'PRJ-014', label: 'PRJ-014 — Superconducting Qubit QPU (Semiconductors)', domain: 'Semiconductors' },
  { id: 'PRJ-021', label: 'PRJ-021 — Multimodal Scientific LLM (AI/ML)', domain: 'AI/ML' },
  { id: 'PRJ-025', label: 'PRJ-025 — Bacteriophage Cocktails (Biotech)', domain: 'Biotech' }
];

export default function ScoringPage() {
  const [selectedProjectId, setSelectedProjectId] = useState('PRJ-007');
  const [scoreData, setScoreData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Custom Slider / Manual Override Mode
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customPillars, setCustomPillars] = useState({
    research_novelty: 81.0,
    patent_strength: 66.5,
    technology_maturity: 58.0,
    market_potential: 74.0,
    funding_relevance: 75.0,
  });

  const loadProjectScore = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await calculateScore({ project_id: projectId });
      setScoreData(data);
      
      // Update custom pillars state with the loaded data so sliders reflect it
      if (data.pillars) {
        setCustomPillars({
          research_novelty: data.pillars.research_novelty?.value ?? 80,
          patent_strength: data.pillars.patent_strength?.value ?? 70,
          technology_maturity: data.pillars.technology_maturity?.value ?? 60,
          market_potential: data.pillars.market_potential?.value ?? 75,
          funding_relevance: data.pillars.funding_relevance?.value ?? 70,
        });
      }

      // Load history
      try {
        const hist = await getScoreHistory(projectId);
        setHistoryData(hist);
      } catch (hErr) {
        console.debug('History note:', hErr);
      }
    } catch (err) {
      console.error('Error fetching score:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to evaluate innovation score');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomEvaluate = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        project_id: selectedProjectId || 'CUSTOM-PROJECT',
        research_novelty: parseFloat(customPillars.research_novelty),
        patent_strength: parseFloat(customPillars.patent_strength),
        technology_maturity: parseFloat(customPillars.technology_maturity),
        market_potential: parseFloat(customPillars.market_potential),
        funding_relevance: parseFloat(customPillars.funding_relevance),
      };
      const data = await calculateScore(payload);
      setScoreData(data);
      const hist = await getScoreHistory(selectedProjectId);
      setHistoryData(hist);
    } catch (err) {
      console.error('Error calculating score:', err);
      setError(err.response?.data?.detail || err.message || 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isCustomMode) {
      loadProjectScore(selectedProjectId);
    }
  }, [selectedProjectId, isCustomMode]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box', width: '100%' }} className="animate-fade-in">
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '2rem 2.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            <HiSparkles /> Milestone 3 — Member 4 Standardized Intelligence
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Innovation Scoring Engine
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem', maxWidth: '750px' }}>
            Evaluate deep-tech proposals with our 5-pillar composite scoring model, NASA Technology Readiness Levels (TRL 1–9), defensibility breakdown, and deterministic explanation intelligence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className={isCustomMode ? 'btn-gradient' : 'btn-outline'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <HiAdjustments /> {isCustomMode ? 'Custom Mode Active' : 'Tune Pillars Mode'}
          </button>
          <button
            onClick={() => isCustomMode ? handleCustomEvaluate() : loadProjectScore(selectedProjectId)}
            disabled={loading}
            className="btn-gradient"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)' }}
          >
            <HiRefresh className={loading ? 'animate-spin' : ''} /> {loading ? 'Computing...' : 'Recalculate Score'}
          </button>
        </div>
      </div>

      {/* Control Selector Bar */}
      <div className="glass-card" style={{ padding: '1.25rem 1.75rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '300px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#cbd5e1', whiteSpace: 'nowrap' }}>
            Select Synthetic Project:
          </span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={loading}
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              padding: '0.65rem 1rem',
              fontSize: '0.9rem',
              flex: 1,
              fontFamily: 'var(--font-heading)'
            }}
          >
            {PRESET_PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.domain}] {p.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Active Signal Mode:</span>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.6rem', borderRadius: '0.4rem', background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', color: '#38bdf8' }}>
            Local Deterministic Provider
          </span>
        </div>
      </div>

      {/* Interactive Custom Sliders Panel (When Tune Mode is Active) */}
      {isCustomMode && (
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid rgba(14, 165, 233, 0.45)', background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiAdjustments style={{ color: '#38bdf8', fontSize: '1.25rem' }} />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc' }}>
                Interactive Pillar Adjuster (What-If Simulation)
              </h3>
            </div>
            <button
              onClick={handleCustomEvaluate}
              className="btn-gradient"
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            >
              Apply Values & Re-evaluate
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { key: 'research_novelty', name: 'Research Novelty (30%)', icon: <HiAcademicCap />, color: '#0ea5e9' },
              { key: 'patent_strength', name: 'Patent Strength (20%)', icon: <HiLightningBolt />, color: '#8b5cf6' },
              { key: 'technology_maturity', name: 'Technology Maturity (15%)', icon: <HiScale />, color: '#10b981' },
              { key: 'market_potential', name: 'Market Potential (20%)', icon: <HiBriefcase />, color: '#f59e0b' },
              { key: 'funding_relevance', name: 'Funding Relevance (15%)', icon: <HiCash />, color: '#ec4899' },
            ].map(({ key, name, icon, color }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#cbd5e1' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color }}>
                    {icon} {name}
                  </span>
                  <span style={{ fontWeight: '800', color: '#f8fafc', fontSize: '0.95rem' }}>
                    {customPillars[key]}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={customPillars[key]}
                  onChange={(e) => setCustomPillars({ ...customPillars, [key]: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: color }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Scoring Dashboard Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Row 1: Primary Composite Score Card */}
        <InnovationScoreCard scoreData={scoreData} loading={loading} error={error} />

        {/* Row 2: 5-Pillar Breakdown & Derived Scores */}
        {scoreData && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.75rem' }}>
              <PillarBreakdown pillars={scoreData.pillars} />
              <DerivedScoresPanel derivedScores={scoreData.derived_scores} />
            </div>

            {/* Row 3: Narrative Explanation Synthesis */}
            <ScoreExplanation explanation={scoreData.explanation} />
          </>
        )}
      </div>
    </div>
  );
}
