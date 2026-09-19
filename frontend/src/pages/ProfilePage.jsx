import React, { useState, useEffect } from 'react';
import { getMyProfile, updateMyProfile } from '../api/profile';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiUserCircle, HiTag, HiSparkles, HiCheckCircle, HiBookOpen, HiLightBulb } from 'react-icons/hi';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    bio: '',
    technology_areas: '',
    research_domains: '',
    keywords: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
        if (data) {
          setFormData({
            title: data.title || '',
            bio: data.bio || '',
            technology_areas: data.technology_areas || '',
            research_domains: (data.research_domains || []).join(', '),
            keywords: (data.keywords || []).join(', ')
          });
        }
      } catch (err) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const payload = {
        title: formData.title,
        bio: formData.bio,
        technology_areas: formData.technology_areas,
        research_domains: formData.research_domains.split(',').map(s => s.trim()).filter(Boolean),
        keywords: formData.keywords.split(',').map(s => s.trim()).filter(Boolean)
      };
      const updated = await updateMyProfile(payload);
      setProfile(updated);
      setMessage('Research profile updated successfully!');
      setTimeout(() => setMessage(''), 3500);
    } catch (err) {
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
          <HiSparkles /> Identity & Expertise Engine
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Research & Innovation Profile
        </h1>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
          Manage your professional identity, research domains, technology keywords, and publication links.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '2rem' }}>
        {/* Left Overview Card */}
        <div className="glass-card" style={{ padding: '2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '1rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
              <HiUserCircle />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: '#f8fafc' }}>
                {profile?.title || 'Researcher / Specialist'}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <HiCheckCircle /> Active Institutional Profile
              </span>
            </div>
          </div>

          {profile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>Biography & Background</label>
                <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, background: 'rgba(10,15,30,0.4)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {profile.bio || 'No biography provided yet.'}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', display: 'block', marginBottom: '0.6rem' }}>Research Domains</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {profile.research_domains && profile.research_domains.length > 0 ? (
                    profile.research_domains.map((dom, i) => (
                      <span key={i} style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc', padding: '0.35rem 0.85rem', borderRadius: '1.5rem', fontSize: '0.85rem', fontWeight: '600' }}>
                        {dom}
                      </span>
                    ))
                  ) : <span style={{ color: '#64748b' }}>No domains registered</span>}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', display: 'block', marginBottom: '0.6rem' }}>Technology Keywords</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {profile.keywords && profile.keywords.length > 0 ? (
                    profile.keywords.map((kw, i) => (
                      <span key={i} style={{ background: 'rgba(139,92,246,0.18)', border: '1px solid rgba(139,92,246,0.4)', color: '#c084fc', padding: '0.35rem 0.85rem', borderRadius: '1.5rem', fontSize: '0.85rem', fontWeight: '600' }}>
                        #{kw}
                      </span>
                    ))
                  ) : <span style={{ color: '#64748b' }}>No keywords registered</span>}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>Technology Sector</label>
                <div style={{ color: '#67e8f9', fontSize: '0.95rem', fontWeight: '600' }}>
                  {profile.technology_areas || 'DeepTech / Artificial Intelligence'}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: '#94a3b8' }}>Loading profile information...</p>
          )}
        </div>

        {/* Right Editor Form */}
        <div className="glass-card" style={{ padding: '2.25rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '1.5rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HiTag style={{ color: '#6366f1' }} /> Edit Profile Parameters
          </h3>

          {message && (
            <div style={{ padding: '0.85rem 1rem', background: message.includes('success') ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)', border: message.includes('success') ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(239,68,68,0.4)', color: message.includes('success') ? '#6ee7b7' : '#fca5a5', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.4rem' }}>Professional Title / Position</label>
              <input
                type="text"
                name="title"
                className="glass-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={formData.title}
                onChange={handleChange}
                placeholder="Senior Research Fellow / Associate Professor"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.4rem' }}>Biography & Research Overview</label>
              <textarea
                name="bio"
                className="glass-input"
                style={{ width: '100%', boxSizing: 'border-box', minHeight: '90px' }}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Brief summary of research focus, commercialization goals, and lab affiliation..."
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.4rem' }}>Research Domains (comma-separated)</label>
              <input
                type="text"
                name="research_domains"
                className="glass-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={formData.research_domains}
                onChange={handleChange}
                placeholder="Artificial Intelligence, Quantum Computing, Bioinformatics"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.4rem' }}>Technology Keywords (comma-separated)</label>
              <input
                type="text"
                name="keywords"
                className="glass-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={formData.keywords}
                onChange={handleChange}
                placeholder="deep learning, drug discovery, transformers, precision medicine"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.4rem' }}>Technology Sector / Classification</label>
              <input
                type="text"
                name="technology_areas"
                className="glass-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={formData.technology_areas}
                onChange={handleChange}
                placeholder="DeepTech, HealthTech, Clean Energy"
              />
            </div>

            <button type="submit" className="btn-gradient" disabled={saving} style={{ alignSelf: 'flex-start', padding: '0.85rem 1.75rem', marginTop: '0.5rem' }}>
              {saving ? 'Updating Profile...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
