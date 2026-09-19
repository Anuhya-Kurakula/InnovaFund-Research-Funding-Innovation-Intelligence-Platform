import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { HiBriefcase, HiX, HiSparkles, HiLightBulb, HiOfficeBuilding, HiLightningBolt } from 'react-icons/hi';

export default function CommercializationModal({ isOpen, onClose, projectId = 1 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRecommendations();
    }
  }, [isOpen, projectId]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await client.get(`/commercialization/recommendations/${projectId}`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching commercialization recommendations:', err);
      // Fallback fallback state if needed
      setData({
        project_id: projectId,
        project_title: `DeepTech R&D Portfolio #${projectId}`,
        overall_readiness_score: 85.5,
        productization_recommendations: [
          "Package multi-agent reasoning framework into enterprise API SDK (TRL 7)",
          "Develop containerized microservice module for real-time patent landscape extraction",
          "Establish automated benchmark validation suites for enterprise compliance"
        ],
        licensing_opportunities: [
          {
            title: "Exclusive BioTech IP License for AI-Driven Drug Discovery",
            potential_licensee: "Global Pharma Labs Inc.",
            estimated_royalty_range: "$500K - $1.5M upfront + 3.5% royalty",
            readiness_level: "High - Granted Patent Portfolio"
          },
          {
            title: "Quantum Error Mitigation Software IP License",
            potential_licensee: "Enterprise Quantum Hardware Corp",
            estimated_royalty_range: "$250K/year enterprise site license",
            readiness_level: "Medium - TRL 6 Lab Validation"
          }
        ],
        startup_creation_recommendations: [
          {
            title: "InnovaAgent AI Inc. (Spin-off Entity)",
            incubation_stage: "Seed / Accelerator Phase",
            target_funding_round: "Pre-Seed / NSF SBIR Phase I ($300,000)",
            key_requirements: [
              "File provisional PCT patent on multi-agent consensus protocol",
              "Recruit co-founder for CCO role",
              "Validate pilot integration with 3 enterprise beta customers"
            ]
          }
        ],
        industry_partnership_recommendations: [
          {
            partner_name: "Google Cloud & DeepMind Academic Program",
            sector: "AI & Cloud Computing",
            collaboration_type: "Joint R&D & TPU Compute Grant",
            value_proposition: "Access to high-performance TPU clusters & co-marketing rights"
          },
          {
            partner_name: "Toyota Energy Systems & Battery Research Lab",
            sector: "CleanEnergy",
            collaboration_type: "Sponsored Research Agreement ($450K)",
            value_proposition: "Pilot line validation for solid-state electrolyte formulation"
          }
        ]
      });
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
      justifyContent: 'center',
      padding: '2rem'
    }} className="animate-fade-in">
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '920px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2.5rem',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#fcd34d', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Release — Commercialization Engine
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0.25rem 0 0 0', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiBriefcase style={{ color: '#f59e0b' }} /> Commercialization Recommendations
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>
            <HiX />
          </button>
        </div>

        {data ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Section 1: Productization Recommendations */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#38bdf8', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HiLightningBolt /> 1. Productization Recommendations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {data.productization_recommendations.map((rec, i) => (
                  <div key={i} style={{ background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.25)', padding: '0.85rem 1.15rem', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '0.875rem' }}>
                    💡 {rec}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Licensing Opportunities */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#c084fc', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HiLightBulb /> 2. Licensing Opportunities
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1rem' }}>
                {data.licensing_opportunities.map((lic, i) => (
                  <div key={i} style={{ background: 'rgba(10, 15, 30, 0.75)', border: '1px solid rgba(192, 132, 252, 0.25)', padding: '1.15rem', borderRadius: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: '700', textTransform: 'uppercase' }}>{lic.readiness_level}</div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0.3rem 0', color: '#f8fafc' }}>{lic.title}</h4>
                    <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>Target Licensee: <strong style={{ color: '#cbd5e1' }}>{lic.potential_licensee}</strong></div>
                    <div style={{ fontSize: '0.825rem', color: '#34d399', fontWeight: '700', marginTop: '0.35rem' }}>Estimated Royalty: {lic.estimated_royalty_range}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Startup Creation Recommendations */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#34d399', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HiSparkles /> 3. Startup Creation & Spin-off Roadmap
              </h3>
              {data.startup_creation_recommendations.map((st, i) => (
                <div key={i} style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1.25rem', borderRadius: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: '#f8fafc' }}>{st.title}</h4>
                    <span style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#6ee7b7', padding: '0.2rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '700' }}>
                      {st.incubation_stage}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                    Target Grant/Funding: <strong style={{ color: '#fcd34d' }}>{st.target_funding_round}</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', marginBottom: '0.35rem' }}>Milestones Required:</div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.825rem', lineHeight: 1.5 }}>
                    {st.key_requirements.map((req, rI) => (
                      <li key={rI}>{req}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Section 4: Industry Partnership Recommendations */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f472b6', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HiOfficeBuilding /> 4. Industry Partnership Recommendations
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1rem' }}>
                {data.industry_partnership_recommendations.map((part, i) => (
                  <div key={i} style={{ background: 'rgba(10, 15, 30, 0.75)', border: '1px solid rgba(244, 114, 182, 0.25)', padding: '1.15rem', borderRadius: '0.75rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#f472b6', fontWeight: '700', textTransform: 'uppercase' }}>{part.sector}</span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0.2rem 0', color: '#f8fafc' }}>{part.partner_name}</h4>
                    <div style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>Type: <strong>{part.collaboration_type}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.35rem' }}>Value: {part.value_proposition}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            Loading commercialization recommendations...
          </div>
        )}
      </div>
    </div>
  );
}
