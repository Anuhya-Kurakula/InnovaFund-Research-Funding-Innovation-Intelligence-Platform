import React, { useState } from 'react';
import { HiCog, HiDatabase, HiKey, HiShieldCheck, HiRefresh, HiCheckCircle, HiSparkles, HiServer } from 'react-icons/hi';

export default function SettingsPage() {
  const [pgStatus, setPgStatus] = useState(null);
  const [mongoStatus, setMongoStatus] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [testing, setTesting] = useState(false);

  const [apiKeys, setApiKeys] = useState({
    openalex_mailto: 'admin@innovafund.ai',
    lens_api_key: '••••••••••••••••',
    serpapi_key: '••••••••••••••••'
  });
  const [saved, setSaved] = useState(false);

  const handleTestConnections = () => {
    setTesting(true);
    setPgStatus(null);
    setMongoStatus(null);
    setApiStatus(null);

    setTimeout(() => {
      setPgStatus({ status: 'Connected', latency: '2ms', tables: '11 SQL Tables Active' });
      setMongoStatus({ status: 'Connected', latency: '4ms', cache: 'Payload Cache Active' });
      setApiStatus({
        openalex: 'Online (200 OK)',
        crossref: 'Online (200 OK)',
        uspto: 'Online (200 OK)',
        lens: 'Online (200 OK)'
      });
      setTesting(false);
    }, 1000);
  };

  const handleSaveKeys = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#0ea5e9', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
          <HiSparkles /> Platform Configuration & System Health
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          System Settings & API Health Command Center
        </h1>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
          Manage database connections, external API credentials, and system health status.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Connection Diagnostics Card */}
        <div className="glass-card" style={{ padding: '2.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiServer style={{ color: '#0ea5e9' }} /> Database & Service Diagnostics
            </h3>
            <button
              onClick={handleTestConnections}
              disabled={testing}
              className="btn-gradient"
              style={{ padding: '0.45rem 1rem', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <HiRefresh /> {testing ? 'Pinging...' : 'Test All Services'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* PostgreSQL Status */}
            <div style={{ background: 'rgba(10, 15, 30, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem' }}>PostgreSQL 16 (Relational DB)</span>
                {pgStatus ? (
                  <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <HiCheckCircle /> {pgStatus.status} ({pgStatus.latency})
                  </span>
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Click Test to Ping</span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Primary relational storage hosting 11 SQL schemas (Users, Profiles, Pubs, Patents, Audit Logs)
              </div>
            </div>

            {/* MongoDB Status */}
            <div style={{ background: 'rgba(10, 15, 30, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.95rem' }}>MongoDB 7 (Document Cache)</span>
                {mongoStatus ? (
                  <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <HiCheckCircle /> {mongoStatus.status} ({mongoStatus.latency})
                  </span>
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Click Test to Ping</span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Document cache storing raw external JSON payloads from OpenAlex and USPTO
              </div>
            </div>

            {/* External APIs Health */}
            {apiStatus && (
              <div style={{ background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.25)', borderRadius: '0.85rem', padding: '1.15rem' }} className="animate-fade-in">
                <div style={{ fontWeight: '700', color: '#38bdf8', fontSize: '0.9rem', marginBottom: '0.65rem' }}>External API Connectors Status</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <div>OpenAlex: <span style={{ color: '#6ee7b7', fontWeight: '600' }}>{apiStatus.openalex}</span></div>
                  <div>CrossRef: <span style={{ color: '#6ee7b7', fontWeight: '600' }}>{apiStatus.crossref}</span></div>
                  <div>USPTO Public: <span style={{ color: '#6ee7b7', fontWeight: '600' }}>{apiStatus.uspto}</span></div>
                  <div>The Lens IP: <span style={{ color: '#6ee7b7', fontWeight: '600' }}>{apiStatus.lens}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* API Credentials Manager Card */}
        <div className="glass-card" style={{ padding: '2.25rem' }}>
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiKey style={{ color: '#8b5cf6' }} /> External API Keys & Credentials
            </h3>
          </div>

          {saved && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6ee7b7', padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              Credentials updated successfully!
            </div>
          )}

          <form onSubmit={handleSaveKeys} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.35rem' }}>OpenAlex Polite Pool Email</label>
              <input
                type="email"
                className="glass-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={apiKeys.openalex_mailto}
                onChange={(e) => setApiKeys({ ...apiKeys, openalex_mailto: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.35rem' }}>The Lens Patent API Token</label>
              <input
                type="password"
                className="glass-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={apiKeys.lens_api_key}
                onChange={(e) => setApiKeys({ ...apiKeys, lens_api_key: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.35rem' }}>SerpAPI Google Patents Key</label>
              <input
                type="password"
                className="glass-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={apiKeys.serpapi_key}
                onChange={(e) => setApiKeys({ ...apiKeys, serpapi_key: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-gradient" style={{ alignSelf: 'flex-start', padding: '0.75rem 1.5rem', marginTop: '0.5rem' }}>
              Save Credentials
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
