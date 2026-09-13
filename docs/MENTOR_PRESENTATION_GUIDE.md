# Mentor Presentation Guide — Research Funding & Innovation Intelligence Platform

Use this structured guide to present your project to your mentor. It covers the elevator pitch, technical architecture, live demo walkthrough, and key achievements.

---

## 🎯 1. Executive Summary & Elevator Pitch

> *"Good morning/afternoon! Today I am presenting the **Research Funding & Innovation Intelligence Platform**, a full-stack platform designed to bridge the gap between academic research, patent commercialization, grant funding, and technological trend forecasting.*
>
> *Our platform enables researchers, startup founders, innovation managers, and administrators to discover tailored funding grants, track emerging technology hotspots, query live global publications, and manage research assets in one centralized intelligence portal."*

---

## 🏗️ 2. Tech Stack & Architecture Highlights

| Layer | Technology Used | Rationale / Key Highlights |
| :--- | :--- | :--- |
| **Backend API** | **FastAPI (Python 3.11+)** | High performance, auto-generated Swagger OpenAPI docs, async request handling. |
| **Frontend UI** | **React (Vite) + Vanilla CSS** | Lightning-fast HMR, component modularity, curated HSL color system, persistent Light & Dark mode engine. |
| **Databases** | **PostgreSQL + MongoDB** | Relational SQL schema for structured profiles & funding models; NoSQL Mongo integration. |
| **Authentication** | **JWT + OAuth2 + Argon2** | Secure password hashing (`Argon2id`), token-based auth, Role-Based Access Control (RBAC). |
| **Integrations** | **OpenAlex API + Public Datasets** | Live REST querying for millions of global academic works; local JSON snapshot fallbacks for patents & funding. |
| **Testing** | **Pytest Automated Test Suite** | 100% passing backend unit test coverage for auth, profiles, asset saving, funding, and trends. |

---

## 🔑 3. Core Modules & Key Features

### 🔐 Auth & Role-Based Access Control (RBAC)
- **4 Distinct User Roles**: `Researcher`, `Startup Founder`, `Innovation Manager`, `Administrator`.
- Conditional UI rendering (e.g., Admin tab & opportunity creation modal visible strictly to `Administrator`).

### 👤 Research Profile Management
- Comprehensive profile storage: Academic credentials, organization details, research history.
- Tag-based profile preferences: Research Domains, Research Interests, Keywords, Technology Areas.

### 📚 Publication & Patent Discovery
- **OpenAlex Live Integration**: Search global literature by topic/keyword with author details, open access badges, and DOI links.
- **Patent Intelligence**: Search patent records with legal status filters, classification codes, and assignee details.
- **Asset Bookmarking**: Save publications, patents, and grants directly to research profile.

### 💡 Funding Opportunity Discovery (Milestone 2)
- **6 Source Types**: Government Grants, Research Councils, Innovation Funds, Startup Accelerators, Venture Programs, International Agencies.
- **Personalized Profile Match Scoring**: Algorithm calculating tag overlap % between profile interests and funding criteria.
- **Interactive Application Portal**: In-app modal for proposal submission with direct agency portal links.

### 📈 Research Trend Intelligence (Milestone 2)
- **Real Calculated Analytics** (Not mocked): Computed live from stored research data.
- **Topic Velocity Bar Charts**: Visualizing publication growth trends across years.
- **Emerging Hotspot Identification**: Growth-rate & citation-weighted paper clusters.
- **Citation Analytics**: Top cited papers, citation growth by domain, and impact metrics.

---

## 🎬 4. Step-by-Step Live Demo Script for Mentor

Follow these exact steps during your live demo:

### Step 1: Landing Page & Authentication (1 min)
1. Open `http://localhost:5173`. Point out the hero section and value proposition.
2. Click **Theme Toggle** (Moon/Sun icon) in the header to demonstrate smooth Light/Dark mode switching.
3. Click **Sign In** and log in with user credentials (or click **Create Account** to demonstrate role selection).

### Step 2: Executive Dashboard & Profile Setup (1.5 mins)
1. Show the **Dashboard**: Highlight profile completion metric, quick navigation tiles, and greeting.
2. Navigate to **Profile**: Show the academic info form, interactive tag editor (Domains, Keywords), and research history log.

### Step 3: Publications & Patent Discovery (2 mins)
1. Navigate to **Publications**: Enter `"Artificial Intelligence"` or `"Biotechnology"` in the search bar. Click **Search**. Show live OpenAlex results, Open Access badges, and click **Save** to bookmark.
2. Navigate to **Patents**: Search patent records, filter by Legal Status (`Granted`, `Pending`), and save a patent to your profile.

### Step 4: Funding Discovery & Grant Application (2 mins)
1. Navigate to **Funding**: Show the 3 tabs (`All Opportunities`, `Recommendations`, `Funding Alerts`).
2. Point out the **Profile Match % badge** (e.g., `80% Profile Match`) calculated dynamically.
3. Filter by **Source Type** (e.g., `Government Grants` or `Startup Accelerators`).
4. Click **Apply Now** on a funding opportunity: Show the interactive **Grant Application Modal**, fill out Proposal Title & Abstract, and click **Submit Application** to demonstrate success toast feedback!

### Step 5: Trend Intelligence & Admin Controls (1.5 mins)
1. Navigate to **Trends**: Show topic velocity bar charts, citation impact metrics, and ranked **Emerging Research Hotspots**.
2. Log in as Administrator to demonstrate the **Admin Management** page (user role modification table and system statistics).

---

## ❓ 5. Expected Mentor Questions & Answers

**Q1: How is the Funding Recommendation Match Score calculated?**
> *"We compute Jaccard and keyword overlap metrics comparing the user's profile domain tags, keywords, and technology areas against the funding opportunity's eligibility tags, producing a normalized 0–100% match score."*

**Q2: Is the publication search using real live data or mocked data?**
> *"Publications search queries the live OpenAlex REST API in real time. Patents and funding data use structured local JSON snapshots that seed automatically into PostgreSQL on startup, with full provider abstractions ready for live external API credentials."*

**Q3: How are the Trend Intelligence metrics generated?**
> *"Trend metrics are computed directly from stored publications and patents using SQLAlchemy database aggregations. We compute topic velocity over time, citation-weighted cluster scores for hotspots, and domain citation distributions."*

**Q4: How is security handled?**
> *"Passwords are hashed with Argon2id. Endpoints are protected with OAuth2 Bearer JWT tokens. Role-based dependencies enforce strict access controls on sensitive endpoints like Admin user management and grant creation."*
