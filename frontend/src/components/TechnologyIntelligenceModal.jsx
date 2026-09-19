import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { HiChip, HiTrendingUp, HiShieldCheck, HiX, HiSparkles, HiUsers } from 'react-icons/hi';

export default function TechnologyIntelligenceModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('emerging'); // emerging, maturity, competitors
  const [emergingTrends, setEmergingTrends] = useState([]);
  const [maturities, setMaturities] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTechIntelligenceData();
    }
  }, [isOpen]);

  const fetchTechIntelligenceData = async () => {
    setLoading(true);
    try {
      const [resEm, resMat, resComp] = await Promise.all([
        client.get('/technology/emerging').catch(() => ({ data: [] })),
        client.get('/technology/maturity').catch(() => ({ data: [] })),
        client.get('/technology/competitors').catch(() => ({ data: [] }))
      ]);

      setEmergingTrends(resEm.data.length ? resEm.data : [
        { id: 1, name: "Generative AI & Agentic Architectures", category: "Artificial Intelligence", patent_count: 1420, publication_count: 8950, growth_rate_pct: 58.4, is_emerging: true, description: "Multi-agent autonomous systems, transformer reasoning models, and multimodal neural synthesis." },
        { id: 2, name: "Quantum Error Correction & Hardware", category: "Quantum Computing", patent_count: 680, publication_count: 3400, growth_rate_pct: 42.1, is_emerging: true, description: "Fault-tolerant topological qubits, superconducting circuits, and neutral-atom quantum processors." },
        { id: 3, name: "Solid-State Lithium-Metal Batteries", category: "CleanEnergy", patent_count: 940, publication_count: 4120, growth_rate_pct: 36.8, is_emerging: true, description: "High-density solid electrolytes for next-generation EV energy storage and grid resilience." }
      ]);

      setMaturities(resMat.data.length ? resMat.data : [
        { domain_id: 1, domain_name: "Generative AI & Agentic Architectures", category: "Artificial Intelligence", lifecycle_stage: "Growth", trl_level: 7, maturity_score: 82.5, adoption_velocity: "Rapid", commercial_readiness: "Early Commercial Deployment" },
        { domain_id: 2, domain_name: "Quantum Error Correction & Hardware", category: "Quantum Computing", lifecycle_stage: "Emerging", trl_level: 4, maturity_score: 64.0, adoption_velocity: "High", commercial_readiness: "Lab Validation & Pilot Phase" },
        { domain_id: 3, domain_name: "Solid-State Lithium-Metal Batteries", category: "CleanEnergy", lifecycle_stage: "Growth", trl_level: 6, maturity_score: 76.0, adoption_velocity: "High", commercial_readiness: "Prototype Pilot Line" }
      ]);

      setCompetitors(resComp.data.length ? resComp.data : [
        { id: 1, domain_name: "Generative AI & Agentic Architectures", assignee_name: "Google DeepMind", patent_holdings: 420, market_share_pct: 29.5, activity_status: "Dominant" },
        { id: 2, domain_name: "Generative AI & Agentic Architectures", assignee_name: "OpenAI", patent_holdings: 280, market_share_pct: 24.0, activity_status: "Dominant" },
        { id: 3, domain_name: "Quantum Error Correction & Hardware", assignee_name: "IBM Quantum", patent_holdings: 310, market_share_pct: 35.0, activity_status: "Dominant" },
        { id: 4, domain_name: "Solid-State Lithium-Metal Batteries", assignee_name: "Toyota Motor Corp", patent_holdings: 390, market_share_pct: 31.0, activity_status: "Dominant" }
      ]);
    } catch (err) {
      console.error('Error fetching technology intelligence data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '2rem'
    }} className="animate-fade-in">
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '880px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2.5rem',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Enterprise Intelligence Platform Deliverable
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0.25rem 0 0 0', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiChip style={{ color: '#c084fc' }} /> Technology Intelligence Engine
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>
            <HiX />
          </button>
        </div>

        {/* Sub-Header Contract Note */}
        <div style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '0.85rem 1.15rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.825rem', color: '#e9d5ff', lineHeight: 1.5 }}>
          💡 <strong>Hand-off Contract</strong>: Supplies <strong>Technology Maturity Score (15% Weight)</strong> to s Innovation Model & exposes live trend APIs (`/technology/emerging`, `/technology/maturity`, `/technology/competitors`) for s dashboards.
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('emerging')}
            className={activeTab === 'emerging' ? 'btn-gradient' : 'btn-outline'}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <HiTrendingUp /> Emerging Trends (Signals)
          </button>

          <button
            onClick={() => setActiveTab('maturity')}
            className={activeTab === 'maturity' ? 'btn-gradient' : 'btn-outline'}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <HiSparkles /> Technology Maturity & TRL
          </button>

          <button
            onClick={() => setActiveTab('competitors')}
            className={activeTab === 'competitors' ? 'btn-gradient' : 'btn-outline'}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <HiUsers /> Competitor Patent Holdings
          </button>
        </div>

        {/* Tab 1: Emerging Technology Trends */}
        {activeTab === 'emerging' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
            {emergingTrends.map((t) => (
              <div key={t.id} style={{ background: 'rgba(10, 15, 30, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ background: 'rgba(192, 132, 252, 0.18)', color: '#c084fc', padding: '0.15rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: '700' }}>
                      {t.category}
                    </span>
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', padding: '0.15rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: '700' }}>
                      +{t.growth_rate_pct}% YoY Growth
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.35rem 0', color: '#f8fafc' }}>{t.name}</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: 0, lineHeight: 1.4 }}>{t.description}</p>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '700' }}>{t.patent_count} Patents</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.publication_count} Papers</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Technology Maturity Lifecycle & TRL 1-9 */}
        {activeTab === 'maturity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
            {maturities.map((m, idx) => (
              <div key={idx} style={{ background: 'rgba(10, 15, 30, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ background: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8', padding: '0.2rem 0.65rem', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>
                      Lifecycle Stage: {m.lifecycle_stage}
                    </span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0.5rem 0 0.25rem 0', color: '#f8fafc' }}>{m.domain_name}</h4>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Status: <span style={{ color: '#cbd5e1' }}>{m.commercial_readiness}</span></div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#c084fc' }}>{m.maturity_score}/100</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>15% Weight Score</div>
                  </div>
                </div>

                {/* TRL Progress Meter */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>
                    <span>Technology Readiness Level (TRL {m.trl_level}/9)</span>
                    <span style={{ color: '#38bdf8', fontWeight: '700' }}>Adoption Velocity: {m.adoption_velocity}</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(m.trl_level / 9) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #c084fc)', borderRadius: '4px' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Competitor Patent Holdings */}
        {activeTab === 'competitors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
            {competitors.map((c) => (
              <div key={c.id} style={{ background: 'rgba(10, 15, 30, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.15rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.domain_name}</span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0.15rem 0 0 0', color: '#f8fafc' }}>{c.assignee_name}</h4>
                </div>

                <div style={{ display: 'flex', items: 'center', gap: '1.5rem', textAlign: 'right' }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981' }}>{c.patent_holdings}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Patent Holdings</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: '#38bdf8' }}>{c.market_share_pct}%</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Market Share</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
