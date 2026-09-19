import React from 'react';

export default function StatsCard({ icon, label, value, trend, trendUp }) {
  return (
    <div className="stat-card glass-panel">
      <div className="stat-header">
        <span>{label}</span>
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      {trend && (
        <div className={`stat-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      )}
    </div>
  );
}
