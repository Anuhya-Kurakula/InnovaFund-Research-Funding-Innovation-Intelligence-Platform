# Database Setup - InnovaFund Backend

This project uses PostgreSQL (via SQLAlchemy) and MongoDB, both run locally through Docker Compose. Non-standard ports are used to avoid clashing with any Postgres/Mongo you may already have installed.

## 1. Start the databases

From the project root (where docker-compose.yml lives):

    docker-compose up -d

This starts two containers:
- innovafund-postgres - Postgres 16, exposed on host port 5433 (maps to container's 5432)
- innovafund-mongo - MongoDB 7, exposed on host port 27018 (maps to container's 27017)

Check both are running:

    docker ps

## 2. Configure environment variables

Copy the example env file and fill it in:

    cd backend
    copy .env.example .env

The default values in .env.example already match the Docker Compose credentials above, so for local dev you usually don't need to change DATABASE_URL or MONGO_URL - only replace SECRET_KEY with your own random string.

IMPORTANT - variable naming varies by branch: the canonical shared config below uses DATABASE_URL. Some branches (e.g. Mayank's, Kesiya's) read a differently-named variable (POSTGRES_URL) in their own config.py/database.py instead. If your branch's app silently falls back to SQLite or fails to connect, check what variable name your own config file actually reads before assuming the connection string is wrong.

## 3. Verify the connection

Start the backend:

    uvicorn main:app --reload

Then check:

    GET http://localhost:8000/health

A response of {"status": "ok", "database": "connected"} confirms Postgres is reachable. MongoDB isn't checked by /health in every branch - it's implicitly verified when you hit a profile-related endpoint.

## Notes
- .env is gitignored - never commit real secrets.
- If you already run Postgres/Mongo locally on the default ports, the custom ports here (5433, 27018) avoid conflicts - no need to stop your existing services.
- Container data persists in named Docker volumes (postgres_data, mongo_data), so restarting containers won't wipe data - use docker-compose down -v only if you intentionally want a clean slate.

## Milestone 3 additions

### patent_records table (PostgreSQL)

Added by Member 1 (Kesiya) for Patent Landscape Analysis. Uses the same shared innovafund_db database - no separate database needed.

| Column | Type | Notes |
|---|---|---|
| id | Integer | primary key |
| title | String | |
| assignee | String | nullable |
| filing_date | Date | nullable |
| classification | String | nullable |
| technology_domain | String | nullable |
| citation_count | Integer | default 0 |
| abstract | String | nullable - used for clustering text |

Table is created automatically via SQLAlchemy's Base.metadata.create_all() on app startup, same as existing tables - no manual migration needed as long as the model is imported before startup.

Seeded from a 10,000-row Lens.org patent CSV via a local seed script (Member 1).

### Technology Intelligence tables (PostgreSQL)

Added by Member 2 (Mayank) for the Technology Intelligence Engine, on the origin/mayank branch. Also uses shared innovafund_db - no separate database needed. This branch is currently the most stable working backend for Milestone 3 - see QA_FINDINGS.md.

**technology_domains**

| Column | Type | Notes |
|---|---|---|
| id | Integer | primary key |
| name | String(150) | unique, e.g. "Generative AI", "Quantum Computing" |
| category | String(100) | default "DeepTech" |
| patent_count | Integer | default 0 |
| publication_count | Integer | default 0 |
| growth_rate_pct | Float | e.g. +42.5% YoY |
| is_emerging | Boolean | default true |
| description | Text | nullable |
| created_at | Timestamp | |

**technology_maturities** (1:1 with technology_domains)

| Column | Type | Notes |
|---|---|---|
| id | Integer | primary key |
| domain_id | Integer | FK to technology_domains.id, unique |
| lifecycle_stage | String(50) | Emerging / Growth / Mature / Declining |
| trl_level | Integer | Technology Readiness Level, 1-9 |
| maturity_score | Float | 0.0-100.0 - supplies the 15% "Technology Maturity" weight to Member 4's Innovation Scoring model |
| adoption_velocity | String(50) | Low / Moderate / High / Rapid |
| commercial_readiness | String(100) | e.g. "R&D Phase" |
| updated_at | Timestamp | |

**competitor_activities** (many:1 with technology_domains)

| Column | Type | Notes |
|---|---|---|
| id | Integer | primary key |
| domain_id | Integer | FK to technology_domains.id |
| assignee_name | String(200) | e.g. company/org name |
| patent_holdings | Integer | default 1 |
| market_share_pct | Float | default 0.0 |
| activity_status | String(50) | Active / Dominant / Emerging / Inactive |
| created_at | Timestamp | |

### Innovation Scoring & Commercialization tables

Confirmed on Anuhya-Kurakula's branch (backend/schemas.py): both are currently stateless calculators, not database-backed. POST /scoring/calculate takes a ScoringRequest (project_id, project_title, and the 5 weighted component scores) directly in the request body and returns a computed ScoringResponse - nothing is persisted to Postgres. Same for GET /commercialization/recommendations/{project_id} - computed on the fly, no table. If the team wants scoring/commercialization history to persist (e.g. for a GET /scoring/{project_id} lookup, per the Milestone 3 spec), tables will need to be added - not yet done as of 2026-09-02.

### Cross-branch schema conflict - RESOLVED

The original Milestone 1 users table predates the newer branch lineage (Mayank -> kanishka -> Kesiya-Sunny), which added several columns to the User model: password_hash (renamed from hashed_password), organization_id (FK to a new organizations table), is_active, and updated_at.

**Fully fixed on 2026-09-02.** Three migration scripts were run against the shared innovafund_db, in order:

    cd backend
    python migrate_password_column.py
    python migrate_add_organization_id.py
    python migrate_add_is_active_updated_at.py

All three are safe, idempotent scripts - each checks current state first and does nothing if already applied. They have already been run against the live shared innovafund_db, so this only needs to be re-run if the database is ever rebuilt from scratch (e.g. after docker-compose down -v) - in that case, run all three in the order above.

Verified: an app built on the newer lineage (tested against Kesiya-Sunny) now starts against the shared DB with zero schema warnings. The users table now has all 9 expected columns: id, full_name, email, password_hash, role, created_at, organization_id, is_active, updated_at.

### Known remaining issue: duplicate patent tables

Two separate patent tables now coexist on the shared DB: `patents` (from Milestone 1/2) and `patent_records` (Kesiya's Milestone 3 Patent Landscape work). These were not designed together and likely need to be reconciled - flagged to the team, not yet resolved as of 2026-09-02.