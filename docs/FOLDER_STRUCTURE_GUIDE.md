# ResearchSphere AI - Folder Structure & File Guide

Below is the complete directory breakdown explaining every file and folder in the project.

```
InnovaFund-AI/
├── README.md                          # Main project overview & Quick Start
├── docker-compose.yml                 # Multi-container orchestration (PostgreSQL, MongoDB, Backend, Frontend)
├── database/
│   └── schema.sql                     # Raw PostgreSQL DDL initialization script
├── docs/                              # Technical Documentation Suite
│   ├── PROJECT_PLANNING.md            # Purpose, Objectives, User Roles, Requirements, Workflows
│   ├── SYSTEM_ARCHITECTURE.md         # High-level architecture, Mermaid diagrams, component breakdown
│   ├── DATABASE_DESIGN.md             # Production ER Diagram and 11-table schema specs
│   ├── UI_UX_WIREFRAMES.md            # Page layout wireframes and visual design system specs
│   ├── INSTALLATION_GUIDE.md          # Local & Docker installation instructions
│   ├── ARCHITECTURE_GUIDE.md          # Technical sequence diagrams & data flows
│   ├── DATABASE_GUIDE.md              # Detailed column specifications & MongoDB document collections
│   ├── API_GUIDE.md                   # OpenAPI REST endpoint reference
│   └── FOLDER_STRUCTURE_GUIDE.md      # Folder structure breakdown (This file)
├── backend/                           # FastAPI Python Backend Service
│   ├── Dockerfile                     # Optimized Python Dockerfile
│   ├── requirements.txt               # Backend dependencies (FastAPI, SQLAlchemy, PyMongo, Pydantic, HTTPX)
│   ├── config.py                      # Pydantic BaseSettings for environment variables & API keys
│   ├── database.py                    # PostgreSQL engine & PyMongo client initializers
│   ├── models.py                      # SQLAlchemy ORM models (User, Role, Profile, Pub, Patent, Audit, etc.)
│   ├── schemas.py                     # Pydantic v2 schemas for request/response validation
│   ├── auth.py                        # Password hashing (bcrypt) and JWT signing/decoding
│   ├── dependencies.py                # Security dependencies (get_current_user, require_role)
│   ├── main.py                        # FastAPI entry point, CORS middleware, router registration, health checks
│   ├── alembic.ini                    # Database migration configuration
│   ├── repositories/                  # Data Access Layer
│   │   ├── user_repository.py         # User & Organization DB operations
│   │   ├── profile_repository.py      # Profile, Research Interest, and Keyword DB operations
│   │   ├── publication_repository.py  # Publication DB operations
│   │   ├── patent_repository.py       # Patent DB operations
│   │   └── audit_repository.py        # Dual-database Audit Log operations
│   ├── services/                      # Business Logic Layer
│   │   ├── auth_service.py            # User registration & login business logic
│   │   ├── profile_service.py         # Profile management & aggregation logic
│   │   └── dataset_service.py         # OpenAlex, CrossRef, Semantic Scholar, USPTO, Google Patents, Lens API connectors
│   └── routers/                       # Controller Router Layer
│       ├── auth_routes.py             # Auth REST endpoints (/api/auth/*)
│       ├── profile_routes.py          # Profile REST endpoints (/api/profiles/*)
│       ├── dataset_routes.py          # Dataset REST endpoints (/api/datasets/*)
│       └── admin_routes.py            # Admin REST endpoints (/api/admin/*)
└── frontend/                          # React + Vite Frontend Application
    ├── Dockerfile                     # Node.js alpine Dockerfile for frontend
    ├── package.json                   # Frontend npm package manifest
    ├── vite.config.js                 # Vite bundler configuration
    ├── index.html                     # HTML root template
    └── src/                           # Application source code
        ├── index.css                  # Global glassmorphism styles, CSS tokens, dark theme
        ├── App.jsx                    # Root App component with React Router setup
        ├── main.jsx                   # Entry point rendering App inside AuthProvider
        ├── api/                       # Axios API client modules
        │   ├── client.js              # Axios instance with JWT bearer interceptors
        │   ├── auth.js                # Auth API methods
        │   ├── profile.js             # Profile API methods
        │   ├── research.js            # Dataset search API methods
        │   └── admin.js              # Admin API methods
        ├── context/                   # React State Contexts
        │   └── AuthContext.jsx        # JWT Auth state manager
        ├── components/                # Reusable UI Components
        │   ├── Navbar.jsx             # Top navbar with user profile dropdown
        │   ├── Sidebar.jsx            # Dynamic role-based navigation sidebar
        │   ├── ProtectedRoute.jsx     # Auth guard route wrapper
        │   ├── LoadingSpinner.jsx     # Loading UI spinner
        │   └── StatsCard.jsx          # Dashboard metric card component
        └── pages/                     # Application Page Screens
            ├── LandingPage.jsx        # Platform Landing & Features page
            ├── LoginPage.jsx          # Login screen
            ├── RegisterPage.jsx       # User registration screen
            ├── DashboardPage.jsx      # Role-based dashboard
            ├── ProfilePage.jsx        # Research profile management screen
            ├── PublicationsPage.jsx   # Publication dataset search screen
            ├── PatentsPage.jsx        # Patent IP search screen
            ├── AdminPage.jsx          # Admin console & audit log screen
            └── SettingsPage.jsx       # User account & API settings screen
```

---

## Educational Breakdown

### 1. What was created
- Comprehensive directory tree and breakdown explaining every file, directory, model, service, router, page, and component in the codebase.

### 2. Why it is needed
- Keeps the project maintainable, allowing new team members to quickly locate business logic, API routes, or React components.

### 3. How it works
- Maps backend code to a 3-tier architecture (Routers -> Services -> Repositories -> Models) and frontend code to standard React directory conventions (Pages -> Components -> Context -> API).

### 4. Which files were added
- [`docs/FOLDER_STRUCTURE_GUIDE.md`](file:///c:/Users/mayan/OneDrive/Documents/GitHub/InnovaFund-AI/docs/FOLDER_STRUCTURE_GUIDE.md)

### 5. How to run it
- Inspect directly in markdown viewer.

### 6. Industry best practices
- Maintain strict folder organization; isolate presentation logic (pages/components) from HTTP access (api/client.js) and state management (context).

### 7. Common mistakes to avoid
- Mixing route handling logic directly into database models or placing raw API call logic inside React UI components.
