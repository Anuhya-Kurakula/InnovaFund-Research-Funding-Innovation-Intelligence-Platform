import React from 'react';

export default function InnovaLogo({ size = 42, className = '' }) {
  return (
    <div 
      className={`innova-logo-wrapper ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justify: 'center',
        flexShrink: 0,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0px 0px 14px rgba(2, 132, 199, 0.65))',
          transition: 'all 0.3s ease'
        }}
      >
        <defs>
          {/* Main Corporate Cobalt Sky Gradient */}
          <linearGradient id="innovaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          {/* Accent Glow */}
          <linearGradient id="glowGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          {/* Ring Glow Filter */}
          <filter id="neonFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Glowing Rounded Shield Frame */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="26"
          fill="url(#innovaGrad)"
          fillOpacity="0.22"
          stroke="url(#innovaGrad)"
          strokeWidth="3"
          filter="url(#neonFilter)"
        />

        {/* Inner Geometric Shield Accent */}
        <rect
          x="12"
          y="12"
          width="76"
          height="76"
          rx="22"
          fill="#030712"
          fillOpacity="0.88"
          stroke="url(#glowGrad)"
          strokeWidth="1.5"
          strokeDasharray="180 30"
        />

        {/* Futuristic Spark / Node Network - High Tech IF Emblem */}
        {/* Pillar 1: 'I' Stem with glowing bulb */}
        <path
          d="M 32 30 L 32 70 M 24 30 L 40 30 M 24 70 L 40 70"
          stroke="url(#innovaGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pillar 2: Connected 'F' Wing */}
        <path
          d="M 48 30 L 74 30 M 48 48 L 68 48 M 48 30 L 48 70"
          stroke="url(#glowGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central AI Quantum Spark Node */}
        <circle cx="72" cy="70" r="5" fill="#38bdf8" filter="url(#neonFilter)" />
        <line x1="68" y1="48" x2="72" y2="70" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="3" fill="#c084fc" />
      </svg>
    </div>
  );
}
