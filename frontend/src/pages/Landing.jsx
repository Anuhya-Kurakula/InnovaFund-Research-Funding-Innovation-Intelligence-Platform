import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Icon({ name, size = 18 }) {
  const icons = {
    sun: (
      <>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </>
    ),
    moon: (
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--text)" }}>
      {/* PUBLIC NAVBAR */}
      <header
        style={{
          height: 72,
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
          background: "var(--header-bg)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "var(--blue-light)",
              color: "var(--blue)",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
            }}
          >
            RI
          </div>
          <div>
            <strong style={{ fontSize: 16, display: "block" }}>Research Intelligence</strong>
            <small style={{ color: "var(--muted)", fontSize: 11 }}>Funding & Innovation Platform</small>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* THEME TOGGLE */}
          <button
            type="button"
            className="button secondary"
            onClick={toggleTheme}
            style={{ padding: "8px 14px", borderRadius: 20, gap: 6, fontSize: 12 }}
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            <Icon name={theme === "light" ? "moon" : "sun"} size={16} />
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </button>

          <Link className="button secondary" to="/login">
            Sign In
          </Link>
          <Link className="button" to="/register">
            Get Started →
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="research-content" style={{ textAlign: "center", paddingTop: 70, paddingBottom: 90 }}>
        <span className="eyebrow" style={{ display: "inline-block", marginBottom: 12 }}>
          INTELLIGENCE & CAPITAL PLATFORM
        </span>
        <h1 style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 18px", lineHeight: 1.15 }}>
          Accelerate Scientific Research <br /> & Innovation Commercialization
        </h1>
        <p style={{ maxWidth: 680, margin: "0 auto 32px", color: "var(--muted)", fontSize: 16, lineHeight: 1.6 }}>
          Discover personalized research grants, track emerging technology hotspots, query live global publications, and streamline your innovation workflow in one powerful platform.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 60 }}>
          <Link className="button" to="/register" style={{ padding: "14px 28px", fontSize: 14 }}>
            Create Researcher Account
          </Link>
          <Link className="button secondary" to="/login" style={{ padding: "14px 28px", fontSize: 14 }}>
            Sign In to Dashboard
          </Link>
        </div>

        {/* FEATURE CARDS GRID */}
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", textAlign: "left" }}>
          <div className="card feature-card">
            <h3>💡 Funding Opportunity Discovery</h3>
            <p>Personalized grant recommendations with eligibility match scoring across 6 source types.</p>
          </div>
          <div className="card feature-card">
            <h3>📈 Research Trend Intelligence</h3>
            <p>Computed topic velocity, citation-weighted hotspot rankings, and domain analytics.</p>
          </div>
          <div className="card feature-card">
            <h3>📚 Global Works & Patents</h3>
            <p>Live OpenAlex literature querying, patent status tracking, and profile asset bookmarking.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
