import React, { useState } from 'react';
import { searchPublications } from '../api/research';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiSearch, HiExternalLink, HiBookOpen, HiSparkles, HiDownload, HiDocumentReport } from 'react-icons/hi';

export default function PublicationsPage() {
  const [query, setQuery] = useState('artificial intelligence');
  const [source, setSource] = useState('all');
  const [limit, setLimit] = useState(10);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const data = await searchPublications(query, source, limit);
      setResults(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleExportCSV = () => {
    if (!results || results.length === 0) return;
    const headers = ['Title', 'Authors', 'Venue', 'Year', 'Citations', 'Source', 'DOI'];
    const rows = results.map(r => [
      `"${(r.title || '').replace(/"/g, '""')}"`,
      `"${(r.authors || '').replace(/"/g, '""')}"`,
      `"${(r.journal_or_venue || '').replace(/"/g, '""')}"`,
      r.publication_year || '',
      r.citation_count || 0,
      r.external_source || '',
      r.doi || ''
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `InnovaFund_Publications_${query.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSourceBadgeClass = (src) => {
    switch (src) {
      case 'OpenAlex': return 'badge-openalex';
      case 'CrossRef': return 'badge-crossref';
      case 'Semantic Scholar': return 'badge-semantic';
      default: return 'badge-openalex';
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
          <HiSparkles /> Multi-Source Academic Data Engine
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Publication Dataset Explorer
        </h1>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
          Search millions of scientific papers across OpenAlex, CrossRef, and Semantic Scholar open repositories.
        </p>
      </div>

      {/* Search Header Bar */}
      <div className="glass-card" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '1fr 180px 110px 140px', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="glass-input"
              style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '2.75rem' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search publications by keywords, DOI, or authors..."
              required
            />
            <HiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.1rem' }} />
          </div>

          <select
            className="glass-input"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="all" style={{ background: '#030712' }}>All Repositories</option>
            <option value="openalex" style={{ background: '#030712' }}>OpenAlex</option>
            <option value="crossref" style={{ background: '#030712' }}>CrossRef</option>
            <option value="semantic_scholar" style={{ background: '#030712' }}>Semantic Scholar</option>
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
        </form>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : searched ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
            <span>Found <strong style={{ color: '#f8fafc' }}>{results.length}</strong> scientific paper records for query "<strong style={{ color: '#38bdf8' }}>{query}</strong>"</span>
            
            {results.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="btn-outline"
                style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <HiDownload /> Export Results CSV
              </button>
            )}
          </div>

          {results.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.75rem' }}>
              {results.map((pub, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                      <span className={`badge-pill ${getSourceBadgeClass(pub.external_source)}`}>
                        {pub.external_source}
                      </span>
                      {pub.publication_year && (
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '0.5rem' }}>
                          Year {pub.publication_year}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', margin: '0 0 0.6rem 0', lineHeight: 1.4, color: '#f8fafc' }}>
                      {pub.title}
                    </h3>
                    
                    <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: '0 0 0.6rem 0', lineHeight: 1.4 }}>
                      <strong style={{ color: '#94a3b8' }}>Authors:</strong> {pub.authors || 'Unknown'}
                    </p>
                    
                    <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: 0 }}>
                      <strong style={{ color: '#64748b' }}>Venue:</strong> {pub.journal_or_venue || 'N/A'}
                    </p>
                  </div>

                  <div style={{ marginTop: '1.5rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <HiBookOpen /> Citations: {pub.citation_count || 0}
                    </span>
                    
                    {pub.doi ? (
                      <a href={pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" style={{ color: '#7dd3fc', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(2,132,199,0.15)', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(14,165,233,0.3)' }}>
                        DOI Link <HiExternalLink />
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>No DOI</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
              No publication records matched your search parameters.
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
          Enter keywords above and click Search to query OpenAlex, CrossRef, and Semantic Scholar datasets.
        </div>
      )}
    </div>
  );
}
