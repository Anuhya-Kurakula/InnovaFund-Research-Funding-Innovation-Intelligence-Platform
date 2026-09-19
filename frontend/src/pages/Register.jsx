import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Icon({ name, size = 16 }) {
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

export default function Register() {
  const [f, setF] = useState({ email: "", full_name: "", password: "", role: "Researcher" });
  const [error, setError] = useState("");
  const { theme, toggleTheme } = useTheme();
  const nav = useNavigate();

  return (
    <div className="auth-card" style={{ position: "relative" }}>
      <button
        type="button"
        className="button secondary"
        onClick={toggleTheme}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "6px 10px",
          borderRadius: 16,
          fontSize: 11,
          gap: 5,
        }}
        title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
      >
        <Icon name={theme === "light" ? "moon" : "sun"} />
        <span>{theme === "light" ? "Dark" : "Light"}</span>
      </button>

      <div className="auth-brand">
        <span className="brand-mark" style={{ background: "var(--blue-light)", color: "var(--blue)", borderRadius: 8, display: "grid", placeItems: "center" }}>
          ▣
        </span>
        <div>
          <strong style={{ color: "var(--text)" }}>Research Intelligence</strong>
          <small style={{ color: "var(--muted)" }}>Discover. Analyze. Innovate.</small>
        </div>
      </div>

      <h1>Create your account</h1>
      <p className="subtitle">Start building your personalized research intelligence workspace.</p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          try {
            await api("/auth/register", { method: "POST", body: JSON.stringify(f) });
            nav("/login");
          } catch (err) {
            setError(err.message);
          }
        }}
      >
        <label>
          Full name
          <input
            required
            value={f.full_name}
            onChange={(e) => setF({ ...f, full_name: e.target.value })}
            placeholder="Your full name"
          />
        </label>

        <label>
          Email
          <input
            type="email"
            required
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Role
          <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
            <option value="Researcher">Researcher</option>
            <option value="Startup Founder">Startup Founder</option>
            <option value="Innovation Manager">Innovation Manager</option>
            <option value="Administrator">Administrator</option>
          </select>
        </label>

        <label>
          Password
          <input
            type="password"
            minLength="8"
            required
            value={f.password}
            onChange={(e) => setF({ ...f, password: e.target.value })}
            placeholder="At least 8 characters"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="button">Create account</button>
      </form>

      <p className="muted" style={{ textAlign: "center", marginBottom: 0, marginTop: 16 }}>
        Already registered?{" "}
        <Link to="/login" style={{ color: "var(--blue)", fontWeight: 700 }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
