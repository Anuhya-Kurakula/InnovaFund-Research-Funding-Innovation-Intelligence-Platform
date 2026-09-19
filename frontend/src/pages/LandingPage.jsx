import React from 'react';
import { Link } from 'react-router-dom';
import { HiSparkles, HiAcademicCap, HiLightBulb, HiChartBar, HiShieldCheck, HiArrowRight, HiDatabase } from 'react-icons/hi';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: '#f8fafc', paddingBottom: '5rem' }}>
      {/* Top Header */}
      <header style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 4rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(6, 9, 19, 0.85)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            fontWeight: '900',
            fontSize: '1.15rem',
            color: '#fff',
            boxShadow: '0 0 20px rgba(99,102,241,0.5)'
          }}>
            IF
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            InnovaFund <span style={{ color: '#6366f1' }}>AI</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/login" className="btn-outline" style={{ textDecoration: 'none', padding: '0.6rem 1.25rem' }}>Sign In</Link>
          <Link to="/register" className="btn-gradient" style={{ textDecoration: 'none', padding: '0.6rem 1.25rem' }}>Get Started</Link>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section style={{ textAlign: 'center', padding: '6rem 2rem 4rem 2rem', maxWidth: '1100px', margin: '0 auto' }} className="animate-fade-in">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '0.4rem 1.25rem', borderRadius: '2rem', fontSize: '0.875rem', color: '#a5b4fc', marginBottom: '2rem', fontWeight: '600' }}>
          <HiSparkles /> Enterprise AI Innovation Intelligence & Funding Platform
        </div>

        <h1 style={{ fontSize: '3.75rem', fontWeight: '900', lineHeight: 1.15, marginBottom: '1.75rem', background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 40%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-heading)' }}>
          Accelerate Technology Commercialization & Strategic Research Funding
        </h1>

        <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '3rem', lineHeight: 1.6, maxWidth: '880px', margin: '0 auto 3rem auto' }}>
          Connect academic research publications (OpenAlex, CrossRef, Semantic Scholar), global patent records (USPTO, Google Patents, The Lens), and grant opportunity matches into a single intelligence hub.
        </p>

        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
          <Link to="/register" className="btn-gradient" style={{ textDecoration: 'none', padding: '0.95rem 2.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Get Started Free <HiArrowRight />
          </Link>
          <Link to="/login" className="btn-outline" style={{ textDecoration: 'none', padding: '0.95rem 2.25rem', fontSize: '1.1rem' }}>
            Explore Datasets
          </Link>
        </div>
      </section>

      {/* Live Metric Counters */}
      <section style={{ maxWidth: '1200px', margin: '1rem auto 4rem auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.75rem', padding: '0 2rem' }}>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#6366f1', margin: 0, fontFamily: 'var(--font-heading)' }}>250M+</h3>
          <p style={{ color: '#cbd5e1', margin: '0.5rem 0 0 0', fontWeight: '600' }}>Research Publications</p>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>OpenAlex & CrossRef</span>
        </div>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#8b5cf6', margin: 0, fontFamily: 'var(--font-heading)' }}>140M+</h3>
          <p style={{ color: '#cbd5e1', margin: '0.5rem 0 0 0', fontWeight: '600' }}>Global Patents Cataloged</p>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>USPTO & Google Patents</span>
        </div>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#06b6d4', margin: 0, fontFamily: 'var(--font-heading)' }}>$15B+</h3>
          <p style={{ color: '#cbd5e1', margin: '0.5rem 0 0 0', fontWeight: '600' }}>Grant Funding Pool</p>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>National & EIC Grants</span>
        </div>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#10b981', margin: 0, fontFamily: 'var(--font-heading)' }}>99.9%</h3>
          <p style={{ color: '#cbd5e1', margin: '0.5rem 0 0 0', fontWeight: '600' }}>API Health Uptime</p>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>PostgreSQL & MongoDB</span>
        </div>
      </section>

      {/* Core Innovation Pillars */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0 0 0.75rem 0' }}>Platform Innovation Pillars</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', margin: 0 }}>Built for Researchers, DeepTech Founders, Innovation Managers, and Admins</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2.25rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '1rem', background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1.25rem' }}>
              <HiAcademicCap />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 0.75rem 0' }}>Research Profile Hub</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Automated sync of researcher domain interests, publications, patents, citations, and technology tags across institutions.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2.25rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '1rem', background: 'rgba(139,92,246,0.2)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1.25rem' }}>
              <HiLightBulb />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 0.75rem 0' }}>Patent Landscape IP</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Deep search across USPTO Public Data, Google Patents, and The Lens for patent white-space trends and assignee analysis.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2.25rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '1rem', background: 'rgba(6,182,212,0.2)', color: '#67e8f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1.25rem' }}>
              <HiDatabase />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 0.75rem 0' }}>Multi-Dataset API Service</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Unified query engine connecting OpenAlex, CrossRef, Semantic Scholar, and USPTO with MongoDB document payload caching.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2.25rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '1rem', background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1.25rem' }}>
              <HiShieldCheck />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 0.75rem 0' }}>Enterprise Security & RBAC</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Role-Based Access Control for Researchers, Founders, Managers, and Admins with dual-database PostgreSQL & MongoDB audit logs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
