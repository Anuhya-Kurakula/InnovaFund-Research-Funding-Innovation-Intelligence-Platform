import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

/* =========================================================
   ICON COMPONENT
========================================================= */

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

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
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),

    profile: (
      <>
        <circle cx="12" cy="8" r="3.3" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),

    publication: (
      <>
        <path d="M5 4h13a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z" />
        <path d="M5 4v14a2 2 0 0 0 2 2" />
        <path d="M9 8h7" />
        <path d="M9 12h7" />
        <path d="M9 16h5" />
      </>
    ),

    patent: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M9 9h4a2 2 0 0 1 0 4H9z" />
        <path d="M12 13l3 3" />
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

    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),

    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),

    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M13 4h7v16h-7" />
      </>
    ),

    logo: (
      <>
        <path d="M5 4h13a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z" />
        <path d="M5 4v14a2 2 0 0 0 2 2" />
        <path d="M9 8h7" />
        <path d="M9 12h7" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

/* =========================================================
   NAVIGATION
========================================================= */

const navigation = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "dashboard",
  },
  {
    path: "/publications",
    label: "Publications",
    icon: "publication",
  },
  {
    path: "/patents",
    label: "Patents",
    icon: "patent",
  },
  {
    path: "/funding",
    label: "Funding Opportunities",
    icon: "dollar",
  },
  {
    path: "/trends",
    label: "Research Intelligence",
    icon: "trend",
  },
];

/* =========================================================
   HELPER - GET USER NAME
========================================================= */

function getUserName(user) {
  if (!user) {
    return "Researcher";
  }

  return (
    user.full_name ||
    user.name ||
    user.username ||
    user.email?.split("@")[0] ||
    "Researcher"
  );
}

/* =========================================================
   HELPER - INITIALS
========================================================= */

function getInitials(name) {
  if (!name) {
    return "R";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

/* =========================================================
   LAYOUT
========================================================= */

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  /* =======================================================
     AUTH PAGES
     
     IMPORTANT:
     Login and Register must NEVER be displayed inside
     the authenticated sidebar/header layout.
  ======================================================= */

  const isLoginPage =
    location.pathname === "/login";

  const isRegisterPage =
    location.pathname === "/register";

  const isAuthPage =
    isLoginPage || isRegisterPage;

  /*
   * Always render authentication pages separately.
   *
   * This prevents the problem where:
   *
   * Sidebar
   * Header
   * "Anuhya Kurakula"
   * Login form
   *
   * were all appearing together.
   */

  if (isAuthPage) {
    return (
      <div className="auth-shell">
        <Outlet />
      </div>
    );
  }

  /* =======================================================
     NOT LOGGED IN
  ======================================================= */

  if (!user) {
    return <Outlet />;
  }

  /* =======================================================
     CURRENT USER
  ======================================================= */

  const userName = getUserName(user);
  const initials = getInitials(userName);

  /* =======================================================
     AUTHENTICATED APPLICATION
  ======================================================= */

  return (
    <div className="research-app">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="research-sidebar">

        {/* BRAND */}

        <Link
          to="/dashboard"
          className="research-logo"
        >
          <span className="research-logo-icon">
            <Icon
              name="logo"
              size={21}
            />
          </span>

          <span>
            <strong>
              Research
            </strong>

            <small>
              Intelligence
            </small>
          </span>
        </Link>

        {/* WORKSPACE */}

        <div className="sidebar-section">

          <div className="sidebar-title">
            WORKSPACE
          </div>

          {navigation.map(
            ({
              path,
              label,
              icon,
            }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `research-nav ${
                    isActive
                      ? "active"
                      : ""
                  }`
                }
              >
                <Icon
                  name={icon}
                  size={18}
                />

                <span>
                  {label}
                </span>
              </NavLink>
            )
          )}

        </div>

        {/* ACCOUNT */}

        <div className="sidebar-section secondary-navigation">

          <div className="sidebar-title">
            ACCOUNT
          </div>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `research-nav ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >
            <Icon
              name="profile"
              size={18}
            />

            <span>
              Profile
            </span>
          </NavLink>

          <button
            type="button"
            className="research-nav logout-button"
            onClick={logout}
          >
            <Icon
              name="logout"
              size={18}
            />

            <span>
              Logout
            </span>
          </button>

        </div>

        {/* CURRENT USER */}

        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="sidebar-avatar">
              {initials}
            </div>

            <div>
              <strong>
                {userName}
              </strong>

              <small>
                Researcher
              </small>
            </div>

          </div>

        </div>

      </aside>

      {/* =================================================
          MAIN APPLICATION
      ================================================= */}

      <div className="research-main">

        {/* HEADER */}

        <header className="research-header">

          <div>
            <span className="header-label">
              RESEARCH INTELLIGENCE
            </span>
          </div>

          <div className="header-right">

            {/* SEARCH */}

            <button
              type="button"
              className="header-icon"
              aria-label="Search"
            >
              <Icon
                name="search"
                size={18}
              />
            </button>

            {/* NOTIFICATIONS */}

            <button
              type="button"
              className="header-icon"
              aria-label="Notifications"
            >
              <Icon
                name="bell"
                size={18}
              />
            </button>

            {/* THEME TOGGLE */}

            <button
              type="button"
              className="header-icon theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
              aria-label="Toggle Theme"
            >
              <Icon
                name={theme === "light" ? "moon" : "sun"}
                size={18}
              />
            </button>

            {/* USER */}

            <div className="header-user">

              <div className="header-avatar">
                {initials}
              </div>

              <div>
                <strong>
                  {userName}
                </strong>

                <small>
                  Researcher
                </small>
              </div>

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}

        <main className="research-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}