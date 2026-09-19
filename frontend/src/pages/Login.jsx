import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
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

      <h1>Welcome back</h1>
      <p className="subtitle">Sign in to continue to your research workspace.</p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          try {
            await login(email, password);
            nav("/dashboard");
          } catch (err) {
            setError(err.message);
          }
        }}
      >
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="button">Sign in</button>
      </form>

      <p className="muted" style={{ textAlign: "center", marginBottom: 0, marginTop: 16 }}>
        New here?{" "}
        <Link to="/register" style={{ color: "var(--blue)", fontWeight: 700 }}>
          Create an account
        </Link>
      </p>
    </div>
  );
}
