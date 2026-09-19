import React, { useState } from 'react';
import { HiSparkles, HiX, HiPaperAirplane, HiLightningBolt, HiBookOpen, HiLightBulb, HiCurrencyDollar } from 'react-icons/hi';

export default function AIAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am InnovaAI Co-Pilot. How can I assist with your research publications, patent searches, or grant funding opportunities today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const quickPrompts = [
    'Find grants for Artificial Intelligence',
    'Summarize top patent assignees in Quantum',
    'How do I export my publication references?'
  ];

  const handleSend = (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setThinking(true);

    setTimeout(() => {
      let reply = "I analyzed your query across our OpenAlex, CrossRef, and USPTO datasets.";
      const lower = textToSend.toLowerCase();

      if (lower.includes('grant') || lower.includes('fund') || lower.includes('ai')) {
        reply = "🎯 Top Matched Grants Found:\n• National DeepTech Innovation Grant 2026 ($500,000) — Deadline Aug 30, 2026\n• EIC Horizon AI Accelerator (€1,200,000) — Deadline Sep 15, 2026\nWould you like me to pre-fill your proposal profile?";
      } else if (lower.includes('patent') || lower.includes('quantum')) {
        reply = "💡 Patent Landscape Insight:\nFound 140M+ cataloged patents. Quantum computing hardware patents are up +34% YoY with top assignees: IBM, Google IP, and MIT Tech Transfer.";
      } else if (lower.includes('export') || lower.includes('publication')) {
        reply = "📄 Export Guidance:\nYou can use the CSV / JSON export controls on the Publications Page (/publications) to download all citation records.";
      } else {
        reply = `✨ Intelligence Insights for "${textToSend}":\nCross-referenced 6 connected dataset APIs (OpenAlex, CrossRef, Semantic Scholar, USPTO, Google Patents, The Lens). High commercial readiness detected!`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setThinking(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 1000,
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
          border: '1px solid rgba(56, 189, 248, 0.5)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          fontSize: '1.6rem',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(2, 132, 199, 0.6)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className="pulse-glow"
        title="InnovaAI Co-Pilot"
      >
        <HiSparkles />
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div
          className="glass-card animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '5.5rem',
            right: '2rem',
            zIndex: 1001,
            width: '380px',
            maxHeight: '520px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(14, 165, 233, 0.4)',
            background: 'rgba(10, 15, 30, 0.95)',
            borderRadius: '1.25rem',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25), rgba(99, 102, 241, 0.25))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                <HiSparkles />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#f8fafc' }}>InnovaAI Co-Pilot</div>
                <div style={{ fontSize: '0.7rem', color: '#38bdf8' }}>AI Innovation Assistant</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              <HiX />
            </button>
          </div>

          {/* Message History */}
          <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                  background: m.sender === 'user' ? 'linear-gradient(135deg, #0284c7, #6366f1)' : 'rgba(255, 255, 255, 0.05)',
                  border: m.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: m.sender === 'user' ? '#ffffff' : '#e2e8f0'
                }}
              >
                {m.text}
              </div>
            ))}
            {thinking && (
              <div style={{ alignSelf: 'flex-start', color: '#38bdf8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="shimmer-loading" style={{ padding: '0.3rem 0.75rem', borderRadius: '0.5rem' }}>Analyzing Datasets...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                style={{
                  background: 'rgba(14, 165, 233, 0.12)',
                  border: '1px solid rgba(14, 165, 233, 0.25)',
                  color: '#7dd3fc',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ padding: '0.85rem 1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '0.5rem' }}
          >
            <input
              type="text"
              className="glass-input"
              style={{ flex: 1, padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Assistant..."
            />
            <button
              type="submit"
              className="btn-gradient"
              style={{ padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <HiPaperAirplane style={{ transform: 'rotate(90deg)' }} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
