import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Icon = ({ name, size = 20 }) => {
  const p = {
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
        <path d="M4 5.5v16" />
      </>
    ),
    patent: (
      <>
        <path d="M12 3l2.2 2.4 3.2-.1.9 3.1 2.7 1.8-1.3 2.9 1.3 2.9-2.7 1.8-.9 3.1-3.2-.1L12 21l-2.2-2.4-3.2.1-.9-3.1L3 13.8l1.3-2.9L3 8l2.7-1.8.9-3.1 3.2.1z" />
      </>
    ),
    trend: (
      <>
        <path d="M4 17l5-5 4 3 7-8" />
        <path d="M16 7h4v4" />
      </>
    ),
    dollar: (
      <>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
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
      {p[name]}
    </svg>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <section>
      <div className="dashboard-hero">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Welcome, {user?.full_name || "Researcher"}</h1>
          <p className="welcome-sub">
            Your workspace for discovering research funding, analyzing trends, and organizing intelligence.
          </p>
        </div>
        <Link to="/profile" className="button">
          Complete profile <Icon name="arrow" size={17} />
        </Link>
      </div>

      <div className="metric-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <div className="card metric">
          <span className="metric-icon" style={{ background: "#eaf2ff", color: "#1769e0" }}>
            <Icon name="book" />
          </span>
          <strong>Publications</strong>
          <small>Discover research papers</small>
        </div>
        <div className="card metric">
          <span className="metric-icon" style={{ background: "#eaf9f1", color: "#20a866" }}>
            <Icon name="patent" />
          </span>
          <strong>Patents</strong>
          <small>Explore innovation signals</small>
        </div>
        <div className="card metric">
          <span className="metric-icon" style={{ background: "#fff2e8", color: "#d97706" }}>
            <Icon name="dollar" />
          </span>
          <strong>Funding</strong>
          <small>Grant opportunities</small>
        </div>
        <div className="card metric">
          <span className="metric-icon" style={{ background: "#f1ecff", color: "#7356d8" }}>
            <Icon name="trend" />
          </span>
          <strong>Trends</strong>
          <small>Track emerging topics</small>
        </div>
        <div className="card metric">
          <span className="metric-icon" style={{ background: "#f3f4f6", color: "#374151" }}>
            <Icon name="user" />
          </span>
          <strong>Profile</strong>
          <small>Build your researcher profile</small>
        </div>
      </div>

      <div className="grid two">
        <Link to="/funding" className="card feature-card">
          <h3>Funding Opportunities</h3>
          <p>Discover personalized grant recommendations, research funds, and accelerators matched to your research interests.</p>
          <span className="feature-link">
            Explore funding <Icon name="arrow" size={16} />
          </span>
        </Link>

        <Link to="/publications" className="card feature-card">
          <h3>Discover publications</h3>
          <p>Search OpenAlex for papers, authors and research topics, then save useful results to your profile.</p>
          <span className="feature-link">
            Explore publications <Icon name="arrow" size={16} />
          </span>
        </Link>

        <Link to="/patents" className="card feature-card">
          <h3>Explore patents</h3>
          <p>Search technology and patent records to understand innovation activity around your research area.</p>
          <span className="feature-link">
            Explore patents <Icon name="arrow" size={16} />
          </span>
        </Link>

        <Link to="/trends" className="card feature-card">
          <h3>Research intelligence</h3>
          <p>Monitor domains, topic velocity, citation analytics, and fast-moving research hotspots in one place.</p>
          <span className="feature-link">
            View intelligence <Icon name="arrow" size={16} />
          </span>
        </Link>
      </div>
    </section>
  );
}
