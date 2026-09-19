import React, { useState } from 'react';
import { HiSparkles, HiX, HiArrowRight, HiArrowLeft, HiAcademicCap, HiLightBulb, HiBookOpen, HiCurrencyDollar, HiCheckCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

export default function AITourGuideModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Welcome to InnovaFund AI!',
      subtitle: 'Enterprise AI Innovation Intelligence & Grant Funding Platform',
      icon: <HiSparkles style={{ fontSize: '2.5rem', color: '#0ea5e9' }} />,
      desc: 'InnovaFund AI connects academic research publications, global patent white-space records, and funding opportunities into a unified intelligence hub.',
      actionLabel: 'Start Platform Tour',
      actionPath: null
    },
    {
      title: '1. Research Profile & Identity Hub',
      subtitle: 'Automated Synchronization of Research Expertise',
      icon: <HiAcademicCap style={{ fontSize: '2.5rem', color: '#38bdf8' }} />,
      desc: 'Manage your professional identity, institutional affiliations, research domains, and technology keywords to receive automated grant recommendations.',
      actionLabel: 'Go to Research Profile',
      actionPath: '/profile'
    },
    {
      title: '2. Multi-Source Academic Paper Explorer',
      subtitle: '250M+ Papers Across OpenAlex, CrossRef, & Semantic Scholar',
      icon: <HiBookOpen style={{ fontSize: '2.5rem', color: '#a5b4fc' }} />,
      desc: 'Query open scientific repositories in real-time, filter by citation metrics, explore DOI links, and export dataset records directly as CSV files.',
      actionLabel: 'Explore Publications',
      actionPath: '/publications'
    },
    {
      title: '3. Patent Landscape Analytics',
      subtitle: '140M+ Patents Across USPTO, Google Patents, & The Lens',
      icon: <HiLightBulb style={{ fontSize: '2.5rem', color: '#c084fc' }} />,
      desc: 'Perform deep intellectual property analysis, search patent assignees, monitor granted vs. pending status, and discover commercial white-spaces.',
      actionLabel: 'Explore Patent Landscape',
      actionPath: '/patents'
    },
    {
      title: '4. Live Grant & Funding Discovery',
      subtitle: '$15B+ Live Match Opportunities Engine',
      icon: <HiCurrencyDollar style={{ fontSize: '2.5rem', color: '#6ee7b7' }} />,
      desc: 'Our AI engine cross-references profile keywords against national research foundations and international innovation funds to deliver live funding matches.',
      actionLabel: 'View Dashboard & Grants',
      actionPath: '/dashboard'
    }
  ];

  const step = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleJump = (path) => {
    onClose();
    if (path) navigate(path);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '1.5rem'
    }} className="animate-fade-in">
      <div className="glass-card pulse-glow" style={{
        width: '100%',
        maxWidth: '560px',
        padding: '2.5rem',
        background: 'rgba(10, 15, 30, 0.95)',
        border: '1px solid rgba(14, 165, 233, 0.4)',
        position: 'relative'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.4rem' }}
        >
          <HiX />
        </button>

        {/* Step Indicator Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem', justifyContent: 'center' }}>
          {tourSteps.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentStep(i)}
              style={{
                height: '6px',
                width: i === currentStep ? '32px' : '10px',
                borderRadius: '3px',
                background: i === currentStep ? '#0ea5e9' : 'rgba(255, 255, 255, 0.15)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>

        {/* Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '1.25rem', background: 'rgba(14, 165, 233, 0.15)', border: '1px solid rgba(14, 165, 233, 0.35)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            {step.icon}
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.4rem 0', color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
            {step.title}
          </h2>
          <div style={{ color: '#38bdf8', fontSize: '0.9rem', fontWeight: '600' }}>
            {step.subtitle}
          </div>
        </div>

        {/* Body Description */}
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, textAlign: 'center', margin: '0 0 2rem 0' }}>
          {step.desc}
        </p>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          {currentStep > 0 ? (
            <button onClick={handlePrev} className="btn-outline" style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HiArrowLeft /> Previous
            </button>
          ) : <div />}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {step.actionPath && (
              <button onClick={() => handleJump(step.actionPath)} className="btn-outline" style={{ padding: '0.65rem 1.1rem', fontSize: '0.85rem' }}>
                Jump to Feature
              </button>
            )}
            <button onClick={handleNext} className="btn-gradient" style={{ padding: '0.65rem 1.35rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {currentStep === tourSteps.length - 1 ? (
                <>Finish Tour <HiCheckCircle /></>
              ) : (
                <>Next Step <HiArrowRight /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
