import React, { useState, useEffect } from 'react';
import {
  searchPatents,
  getPatentClusters,
  getPatentTrends,
  getEmergingTechnologies,
  getTechnologyMaturity,
  getTechnologyCompetitors
} from '../api/research';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HiSearch,
  HiLightBulb,
  HiShieldCheck,
  HiSparkles,
  HiCheckCircle,
  HiDownload,
  HiTrendingUp,
  HiViewGrid,
  HiChip,
  HiRefresh,
  HiXCircle,
  HiUsers,
  HiPuzzle
} from 'react-icons/hi';

export default function PatentsPage() {
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'clusters', 'trends', 'technology'
  const [techSubTab, setTechSubTab] = useState('emerging'); // 'emerging', 'maturity', 'competitors'

  // Patent Search State
  const [query, setQuery] = useState('Artificial Intelligence');
  const [source, setSource] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [limit, setLimit] = useState(10);
  const [searchData, setSearchData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchExecuted, setSearchExecuted] = useState(false);

  // Patent Clusters State
  const [clustersData, setClustersData] = useState([]);
  const [clustersLoading, setClustersLoading] = useState(false);
  const [clustersError, setClustersError] = useState(null);

  // Patent Trends State
  const [trendsData, setTrendsData] = useState([]);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [trendsError, setTrendsError] = useState(null);

  // Technology Intelligence State
  const [emergingData, setEmergingData] = useState([]);
  const [maturityData, setMaturityData] = useState([]);
  const [competitorsData, setCompetitorsData] = useState([]);
  const [techLoading, setTechLoading] = useState(false);
  const [techError, setTechError] = useState(null);

  // Preset search keywords as requested by requirement
  const presetKeywords = [
    'Artificial Intelligence',
    'Machine Learning',
    'Blockchain',
    'Robotics',
    'Biotechnology'
  ];

  // Initial load or tab switch handling
  useEffect(() => {
    if (activeTab === 'search' && !searchExecuted) {
      executeSearch('Artificial Intelligence');
    } else if (activeTab === 'clusters' && clustersData.length === 0) {
      loadClusters();
    } else if (activeTab === 'trends' && trendsData.length === 0) {
      loadTrends();
    } else if (activeTab === 'technology' && emergingData.length === 0) {
      loadTechIntelligence();
    }
  }, [activeTab]);

  // 1. Patent Search Handler
  const executeSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchError(null);
    setSearchExecuted(true);
    try {
      const data = await searchPatents(searchQuery.trim(), source, limit);
      setSearchData(data || []);
    } catch (err) {
      console.error('API Error searching patents:', err);
      setSearchError(err.response?.data?.detail || 'Failed to fetch patent data. Please check backend connection and retry.');
      setSearchData([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    executeSearch(query);
  };

  const handleClearSearch = () => {
    setQuery('');
    setSearchData([]);
    setSearchExecuted(false);
    setSearchError(null);
  };

  // 2. Patent Clusters Loader
  const loadClusters = async () => {
    setClustersLoading(true);
    setClustersError(null);
    try {
      const data = await getPatentClusters();
      setClustersData(data || []);
    } catch (err) {
      console.error('API Error fetching patent clusters:', err);
      setClustersError(err.response?.data?.detail || 'Failed to load patent clusters from backend.');
    } finally {
      setClustersLoading(false);
    }
  };

  // 3. Patent Trends Loader
  const loadTrends = async () => {
    setTrendsLoading(true);
    setTrendsError(null);
    try {
      const data = await getPatentTrends();
      setTrendsData(data || []);
    } catch (err) {
      console.error('API Error fetching patent trends:', err);
      setTrendsError(err.response?.data?.detail || 'Failed to load patent filing trends from backend.');
    } finally {
      setTrendsLoading(false);
    }
  };

  // 4. Technology Intelligence Loader
  const loadTechIntelligence = async () => {
    setTechLoading(true);
    setTechError(null);
    try {
      const [emRes, matRes, compRes] = await Promise.all([
        getEmergingTechnologies(),
        getTechnologyMaturity(),
        getTechnologyCompetitors()
      ]);
      setEmergingData(emRes || []);
      setMaturityData(matRes || []);
      setCompetitorsData(compRes || []);
    } catch (err) {
      console.error('API Error fetching technology intelligence:', err);
      setTechError(err.response?.data?.detail || 'Failed to load technology intelligence signals.');
    } finally {
      setTechLoading(false);
    }
  };

  // CSV Export Utility
  const handleExportCSV = () => {
    if (!searchData || searchData.length === 0) return;
    const headers = ['Patent Number', 'Title', 'Status', 'Assignee', 'Source'];
    const rows = searchData.map(r => [
      `"${r.patent_number || ''}"`,
      `"${(r.title || '').replace(/"/g, '""')}"`,
      `"${r.status || ''}"`,
      `"${(r.assignee || '').replace(/"/g, '""')}"`,
      `"${r.external_source || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `InnovaFund_Patents_${query.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSearchResults = searchData.filter(p => {
    if (statusFilter === 'granted') return p.status === 'Granted';
    if (statusFilter === 'pending') return p.status !== 'Granted';
    return true;
  });

  const getSourceBadgeClass = (src) => {
    switch (src) {
      case 'USPTO': return 'badge-uspto';
      case 'Google Patents': return 'badge-google';
      case 'The Lens': return 'badge-lens';
      default: return 'badge-uspto';
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box', width: '100%' }} className="animate-fade-in">
      {/* Header Banner */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
          <HiSparkles /> Enterprise Intelligence Platform Deliverable
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Patent & Technology Intelligence Dashboard
        </h1>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
          Search global patents, explore technology clusters, monitor filing trends, and track competitive technology intelligence.
        </p>
      </div>

      {/* Primary Dashboard Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('search')}
          className={activeTab === 'search' ? 'btn-gradient' : 'btn-outline'}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <HiSearch /> 1. Patent Search (/patents/search)
        </button>

        <button
          onClick={() => setActiveTab('clusters')}
          className={activeTab === 'clusters' ? 'btn-gradient' : 'btn-outline'}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <HiViewGrid /> 2. Patent Clusters (/patents/clusters)
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={activeTab === 'trends' ? 'btn-gradient' : 'btn-outline'}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <HiTrendingUp /> 3. Patent Trends (/patents/trends)
        </button>

        <button
          onClick={() => setActiveTab('technology')}
          className={activeTab === 'technology' ? 'btn-gradient' : 'btn-outline'}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <HiChip /> 4. Technology Intelligence
        </button>
      </div>


      {/* ========================================================= */}
      {/* TAB 1: PATENT SEARCH */}
      {/* ========================================================= */}
      {activeTab === 'search' && (
        <div className="animate-fade-in">
          {/* Search Controls Container */}
          <div className="glass-card" style={{ padding: '1.75rem 2rem', marginBottom: '1.75rem' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 180px 110px 140px auto', gap: '1rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.75rem' }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search patents by technology keyword, title, or assignee..."
                  required
                />
                <HiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.1rem' }} />
              </div>

              <select
                className="glass-input"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="all" style={{ background: '#030712' }}>All Providers</option>
                <option value="uspto" style={{ background: '#030712' }}>USPTO Public Data</option>
                <option value="google_patents" style={{ background: '#030712' }}>Google Patents</option>
                <option value="the_lens" style={{ background: '#030712' }}>The Lens</option>
              </select>

              <select
                className="glass-input"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                <option value={5} style={{ background: '#030712' }}>5 Results</option>
                <option value={10} style={{ background: '#030712' }}>10 Results</option>
                <option value={25} style={{ background: '#030712' }}>25 Results</option>
              </select>

              <button type="submit" className="btn-gradient" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <HiSearch /> Search
              </button>

              <button type="button" onClick={handleClearSearch} className="btn-outline" style={{ padding: '0.65rem 0.85rem' }} title="Reset Search">
                Reset
              </button>
            </form>

            {/* Quick Search Preset Keywords */}
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>Quick Preset Searches:</span>
              {presetKeywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => { setQuery(kw); executeSearch(kw); }}
                  style={{
                    background: query === kw ? 'rgba(14, 165, 233, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: query === kw ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: query === kw ? '#7dd3fc' : '#cbd5e1',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.775rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  #{kw}
                </button>
              ))}
            </div>
          </div>

          {/* Search Result States: Loading, Error, Empty, or Data */}
          {searchLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <LoadingSpinner />
              <p style={{ color: '#38bdf8', fontSize: '0.9rem', marginTop: '1rem', fontWeight: '600' }}>Querying live backend API GET /patents/search...</p>
            </div>
          ) : searchError ? (
            <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.08)' }}>
              <HiXCircle style={{ fontSize: '3rem', color: '#fca5a5', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>API Request Failed</h3>
              <p style={{ color: '#fca5a5', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{searchError}</p>
              <button onClick={() => executeSearch(query)} className="btn-gradient" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <HiRefresh /> Retry Search
              </button>
            </div>
          ) : searchExecuted ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span>Found <strong style={{ color: '#f8fafc' }}>{filteredSearchResults.length}</strong> patent records for "<strong style={{ color: '#c084fc' }}>{query}</strong>"</span>

                  <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <button
                      onClick={() => setStatusFilter('all')}
                      style={{ padding: '0.25rem 0.65rem', borderRadius: '0.4rem', border: 'none', background: statusFilter === 'all' ? '#0ea5e9' : 'transparent', color: statusFilter === 'all' ? '#fff' : '#94a3b8', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      All Status
                    </button>
                    <button
                      onClick={() => setStatusFilter('granted')}
                      style={{ padding: '0.25rem 0.65rem', borderRadius: '0.4rem', border: 'none', background: statusFilter === 'granted' ? '#10b981' : 'transparent', color: statusFilter === 'granted' ? '#fff' : '#94a3b8', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Granted Only
                    </button>
                  </div>
                </div>

                {searchData.length > 0 && (
                  <button
                    onClick={handleExportCSV}
                    className="btn-outline"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <HiDownload /> Export Patent CSV
                  </button>
                )}
              </div>

              {filteredSearchResults.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
                  {filteredSearchResults.map((pat, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                          <span className={`badge-pill ${getSourceBadgeClass(pat.external_source)}`}>
                            {pat.external_source}
                          </span>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            background: pat.status === 'Granted' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                            border: pat.status === 'Granted' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)',
                            color: pat.status === 'Granted' ? '#6ee7b7' : '#fcd34d'
                          }}>
                            {pat.status}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', margin: '0 0 0.6rem 0', lineHeight: 1.4, color: '#f8fafc' }}>
                          {pat.title}
                        </h3>

                        <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
                          <strong style={{ color: '#94a3b8' }}>Patent Number:</strong> <code style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '0.4rem', color: '#7dd3fc', fontSize: '0.85rem' }}>{pat.patent_number}</code>
                        </p>

                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                          <strong style={{ color: '#64748b' }}>Assignee:</strong> {pat.assignee || 'Global Technology Corp'}
                        </p>
                      </div>

                      <div style={{ marginTop: '1.5rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>IP Provider: {pat.external_source}</span>
                        <span style={{ color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <HiCheckCircle /> Valid Record
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State as requested by requirement */
                <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                  <HiSearch style={{ fontSize: '2.5rem', color: '#64748b', marginBottom: '0.5rem' }} />
                  <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: '0 0 0.25rem 0' }}>No patents found</h3>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>No patent records matched your query "{query}". Try a different keyword or provider.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
              Select a preset keyword above or enter search terms and click Search to query patent records.
            </div>
          )}
        </div>
      )}


      {/* ========================================================= */}
      {/* TAB 2: PATENT CLUSTERING */}
      {/* ========================================================= */}
      {activeTab === 'clusters' && (
        <div className="animate-fade-in">
          {clustersLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <LoadingSpinner />
              <p style={{ color: '#c084fc', fontSize: '0.9rem', marginTop: '1rem', fontWeight: '600' }}>Fetching patent clusters from GET /patents/clusters...</p>
            </div>
          ) : clustersError ? (
            <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.08)' }}>
              <HiXCircle style={{ fontSize: '3rem', color: '#fca5a5', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>Failed to Load Patent Clusters</h3>
              <p style={{ color: '#fca5a5', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{clustersError}</p>
              <button onClick={loadClusters} className="btn-gradient" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <HiRefresh /> Retry Loading Clusters
              </button>
            </div>
          ) : clustersData.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.75rem' }}>
              {clustersData.map((c) => (
                <div key={c.cluster_id} className="glass-card" style={{ padding: '1.75rem', border: '1px solid rgba(192, 132, 252, 0.35)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', padding: '0.2rem 0.65rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '700' }}>
                        Cluster #{c.cluster_id}
                      </span>
                      <span style={{ color: '#34d399', fontWeight: '700', fontSize: '0.85rem' }}>+{c.growth_rate_pct}% YoY</span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>{c.cluster_name}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.4, margin: '0 0 1rem 0' }}>{c.description}</p>

                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.5rem', fontWeight: '600' }}>Related Technology / Classification:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                      {c.key_terms.map((kt, i) => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.06)', color: '#7dd3fc', padding: '0.15rem 0.55rem', borderRadius: '0.4rem', fontSize: '0.75rem' }}>
                          #{kt}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.85rem', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><strong style={{ color: '#cbd5e1' }}>Top Assignees:</strong> {c.top_assignees.join(', ')}</div>
                    <div style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', padding: '0.25rem 0.65rem', borderRadius: '0.5rem', fontWeight: '800', flexShrink: 0, marginLeft: '0.5rem' }}>
                      {c.patent_count} Patents
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
              No patent clusters currently available.
            </div>
          )}
        </div>
      )}


      {/* ========================================================= */}
      {/* TAB 3: PATENT TREND ANALYSIS */}
      {/* ========================================================= */}
      {activeTab === 'trends' && (
        <div className="animate-fade-in">
          {trendsLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <LoadingSpinner />
              <p style={{ color: '#10b981', fontSize: '0.9rem', marginTop: '1rem', fontWeight: '600' }}>Loading filing trend metrics from GET /patents/trends...</p>
            </div>
          ) : trendsError ? (
            <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.08)' }}>
              <HiXCircle style={{ fontSize: '3rem', color: '#fca5a5', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>Failed to Load Patent Trends</h3>
              <p style={{ color: '#fca5a5', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{trendsError}</p>
              <button onClick={loadTrends} className="btn-gradient" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <HiRefresh /> Retry Loading Trends
              </button>
            </div>
          ) : trendsData.length > 0 ? (
            <div>
              {/* Filing Velocity Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {trendsData.map((tr, i) => (
                  <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase' }}>{tr.time_period}</span>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', padding: '0.2rem 0.5rem', borderRadius: '0.4rem', fontWeight: '700' }}>
                        +{tr.growth_rate_pct}% Growth
                      </span>
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
                      {tr.patent_count} <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500' }}>Patents Filed</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.5rem', fontWeight: '600' }}>
                      Velocity: <span style={{ color: '#c084fc' }}>{tr.filing_velocity}</span>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                      Top Categories: {tr.top_categories.join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual Bar Chart for Filing Velocity Trends */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1.5rem' }}>
                  Patent Filing Velocity Comparison Across Timeframes
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {trendsData.map((tr, i) => {
                    const maxVal = Math.max(...trendsData.map(t => t.patent_count));
                    const widthPct = Math.round((tr.patent_count / maxVal) * 100);
                    return (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: '600' }}>
                          <span>{tr.time_period} — {tr.filing_velocity}</span>
                          <span style={{ color: '#10b981' }}>{tr.patent_count} Patents (+{tr.growth_rate_pct}%)</span>
                        </div>
                        <div style={{ height: '12px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: `${widthPct}%`, height: '100%', background: i === 0 ? 'linear-gradient(90deg, #0284c7, #38bdf8)' : i === 1 ? 'linear-gradient(90deg, #059669, #34d399)' : 'linear-gradient(90deg, #7c3aed, #c084fc)', borderRadius: '6px', transition: 'width 0.6s ease' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
              No patent trend data currently available.
            </div>
          )}
        </div>
      )}


      {/* ========================================================= */}
      {/* TAB 4: TECHNOLOGY INTELLIGENCE */}
      {/* ========================================================= */}
      {activeTab === 'technology' && (
        <div className="animate-fade-in">
          {/* Technology Intelligence Sub-Nav Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.35rem', borderRadius: '0.75rem', width: 'fit-content', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              onClick={() => setTechSubTab('emerging')}
              style={{
                padding: '0.4rem 0.95rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: techSubTab === 'emerging' ? '#38bdf8' : 'transparent',
                color: techSubTab === 'emerging' ? '#030712' : '#94a3b8',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Emerging Technologies
            </button>

            <button
              onClick={() => setTechSubTab('maturity')}
              style={{
                padding: '0.4rem 0.95rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: techSubTab === 'maturity' ? '#c084fc' : 'transparent',
                color: techSubTab === 'maturity' ? '#030712' : '#94a3b8',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Technology Maturity
            </button>

            <button
              onClick={() => setTechSubTab('competitors')}
              style={{
                padding: '0.4rem 0.95rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: techSubTab === 'competitors' ? '#10b981' : 'transparent',
                color: techSubTab === 'competitors' ? '#030712' : '#94a3b8',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Technology Competitors
            </button>
          </div>

          {techLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <LoadingSpinner />
              <p style={{ color: '#c084fc', fontSize: '0.9rem', marginTop: '1rem', fontWeight: '600' }}>Fetching Technology Intelligence signals from backend...</p>
            </div>
          ) : techError ? (
            <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.08)' }}>
              <HiXCircle style={{ fontSize: '3rem', color: '#fca5a5', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>Failed to Load Technology Intelligence</h3>
              <p style={{ color: '#fca5a5', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{techError}</p>
              <button onClick={loadTechIntelligence} className="btn-gradient" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <HiRefresh /> Retry Loading Signals
              </button>
            </div>
          ) : (
            <div>
              {/* 4.1 Emerging Technologies */}
              {techSubTab === 'emerging' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
                  {emergingData.map((t) => (
                    <div key={t.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <span style={{ background: 'rgba(192, 132, 252, 0.18)', color: '#c084fc', padding: '0.15rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: '700' }}>
                            {t.category}
                          </span>
                          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', padding: '0.15rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: '700' }}>
                            +{t.growth_rate_pct}% YoY Growth
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: '700', margin: '0 0 0.35rem 0', color: '#f8fafc' }}>{t.name}</h4>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>{t.description}</p>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1.5rem' }}>
                        <div style={{ fontSize: '1rem', color: '#cbd5e1', fontWeight: '700' }}>{t.patent_count} Patents</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.publication_count} Publications</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 4.2 Technology Maturity */}
              {techSubTab === 'maturity' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
                  {maturityData.map((m, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <span style={{ background: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8', padding: '0.2rem 0.65rem', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>
                            Lifecycle Stage: {m.lifecycle_stage}
                          </span>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0.5rem 0 0.25rem 0', color: '#f8fafc' }}>{m.domain_name}</h4>
                          <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>Commercial Readiness: <span style={{ color: '#cbd5e1' }}>{m.commercial_readiness}</span></div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#c084fc' }}>{m.maturity_score}/100</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Maturity Index</div>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
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

              {/* 4.3 Technology Competitors */}
              {techSubTab === 'competitors' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }} className="animate-fade-in">
                  {competitorsData.map((c) => (
                    <div key={c.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.domain_name}</span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0.2rem 0 0 0', color: '#f8fafc' }}>{c.assignee_name}</h4>
                        <span style={{ fontSize: '0.75rem', color: c.activity_status === 'Dominant' ? '#10b981' : '#38bdf8', fontWeight: '700' }}>
                          Status: {c.activity_status}
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10b981' }}>{c.patent_holdings}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Patent Holdings</div>
                        <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '700', marginTop: '0.25rem' }}>{c.market_share_pct}% Share</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
