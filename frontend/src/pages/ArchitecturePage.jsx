import React, { useState } from 'react';
import { HiChip, HiDatabase, HiShieldCheck, HiSparkles, HiLightningBolt, HiCode, HiCube, HiChartBar } from 'react-icons/hi';

export default function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState('architecture');

  const architectureLayers = [
    { title: '1. React + Vite Glassmorphic Frontend', tech: 'React 18, Tailwind CSS, Outfit/Inter Typography', desc: 'Enterprise UI portal with role-based routing, real-time dataset filtering, and micro-interactions.', icon: <HiCube style={{ color: '#0ea5e9' }} /> },
    { title: '2. FastAPI Clean Architecture Backend', tech: 'Python 3.11, FastAPI, Pydantic v2, Uvicorn', desc: '4-tier clean architecture (Routers, Services, Repositories, Models) with JWT OAuth2 Guards.', icon: <HiLightningBolt style={{ color: '#8b5cf6' }} /> },
    { title: '3. Hybrid Dual-Database Data Layer', tech: 'PostgreSQL 16 (Relational) + MongoDB 7 (Document Cache)', desc: '11 SQL tables for ACID compliance + Mongo payload caching + Zero-dependency SQLite fallback.', icon: <HiDatabase style={{ color: '#06b6d4' }} /> },
    { title: '4. Multi-Source API Dataset Services', tech: 'OpenAlex, CrossRef, Semantic Scholar, USPTO, Lens', desc: 'Live connectors fetching academic papers, citation metrics, patent white-space, and grant pools.', icon: <HiChip style={{ color: '#10b981' }} /> },
  ];

  const workflowSteps = [
    { step: '01', title: 'Identity & RBAC Setup', desc: 'Researchers, Founders, Managers & Admins authenticate via JWT. User profiles store research domains, keywords, and institutional affiliations.' },
    { step: '02', title: 'Publication Aggregation', desc: 'Multi-threaded dataset service queries OpenAlex, CrossRef, and Semantic Scholar. Results are stored in SQL & cached in Mongo.' },
    { step: '03', title: 'Patent Landscape Analysis', desc: 'USPTO Public Data and Google Patents are queried for patent assignees, technology claims, and granted/pending status.' },
    { step: '04', title: 'Funding & Grant Matching', desc: 'Innovation intelligence engine cross-references profile keywords against national & international grant funding pools.' },
  ];

  const dbSchemaTables = [
    { name: 'users', type: 'Relational (SQL)', fields: 'id, full_name, email, password_hash, role_id, organization, is_active, created_at' },
    { name: 'roles', type: 'Relational (SQL)', fields: 'id, name (researcher, startup_founder, innovation_manager, administrator), description' },
    { name: 'research_profiles', type: 'Relational (SQL)', fields: 'id, user_id, title, bio, technology_areas, citations_count, h_index, updated_at' },
    { name: 'research_interests', type: 'Relational (SQL)', fields: 'id, profile_id, domain_name, category' },
    { name: 'publications', type: 'Relational (SQL)', fields: 'id, profile_id, title, doi, venue, year, citation_count, external_source' },
    { name: 'patents', type: 'Relational (SQL)', fields: 'id, profile_id, patent_number, title, status, assignee, external_source' },
    { name: 'audit_logs', type: 'Relational (SQL)', fields: 'id, user_id, action, target_resource, ip_address, timestamp' },
    { name: 'api_payload_cache', type: 'Document (Mongo)', fields: '_id, cache_key, query, source, raw_json_payload, expires_at' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }} className="animate-fade-in">
      {/* Header Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#0ea5e9', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
          <HiSparkles /> System Engineering & Workflows
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          System Architecture & Innovation Workflows
        </h1>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
          Interactive visualization of the 4-tier system architecture, dual-database ER schema, and intelligence workflows.
        </p>
      </div>

      {/* Tab Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('architecture')}
          className={activeTab === 'architecture' ? 'btn-gradient' : 'btn-outline'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.35rem' }}
        >
          <HiChip /> 4-Tier Architecture
        </button>
        <button
          onClick={() => setActiveTab('workflows')}
          className={activeTab === 'workflows' ? 'btn-gradient' : 'btn-outline'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.35rem' }}
        >
          <HiLightningBolt /> Intelligence Workflows
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={activeTab === 'schema' ? 'btn-gradient' : 'btn-outline'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.35rem' }}
        >
          <HiDatabase /> Database Schema (11 Tables)
        </button>
      </div>

      {/* Tab 1: Architecture Layers */}
      {activeTab === 'architecture' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
          {architectureLayers.map((layer, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                {layer.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#f8fafc' }}>
                {layer.title}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '600', marginBottom: '0.85rem', background: 'rgba(2, 132, 199, 0.15)', padding: '0.25rem 0.65rem', borderRadius: '0.5rem', display: 'inline-block' }}>
                {layer.tech}
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                {layer.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Workflow Steps */}
      {activeTab === 'workflows' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
          {workflowSteps.map((wf, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '2rem', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0ea5e9', opacity: 0.3, fontFamily: 'var(--font-heading)', position: 'absolute', top: '1rem', right: '1.5rem' }}>
                {wf.step}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 0.75rem 0', color: '#f8fafc' }}>
                {wf.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                {wf.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Database Schema */}
      {activeTab === 'schema' && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: 0, color: '#f8fafc' }}>
              Hybrid Relational & Document Data Schema
            </h3>
            <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#6ee7b7', padding: '0.3rem 0.85rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: '700' }}>
              PostgreSQL 16 + MongoDB 7 Active
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f8fafc', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', background: 'rgba(255,255,255,0.03)' }}>
                  <th style={{ padding: '0.85rem 1rem', color: '#38bdf8' }}>Table / Collection</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#38bdf8' }}>Engine Type</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#38bdf8' }}>Fields & Key Constraints</th>
                </tr>
              </thead>
              <tbody>
                {dbSchemaTables.map((t, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#f8fafc', fontFamily: 'monospace' }}>{t.name}</td>
                    <td style={{ padding: '0.85rem 1rem', color: t.type.includes('SQL') ? '#a5b4fc' : '#6ee7b7', fontWeight: '600' }}>{t.type}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>{t.fields}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
