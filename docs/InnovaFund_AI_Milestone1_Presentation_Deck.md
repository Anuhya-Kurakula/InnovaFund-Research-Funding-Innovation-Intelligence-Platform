# 📊 InnovaFund AI — Milestone 1 Presentation Deck Guide

> **Project Name**: InnovaFund AI — Enterprise AI-Powered Research Funding & Innovation Intelligence Platform  
> **Repository**: [github.com/Nithya21shree/InnovaFund-AI/tree/mayank-dev](https://github.com/Nithya21shree/InnovaFund-AI/tree/mayank-dev)  
> **Presenter**: Mayank Upadhyay (Platform Administrator)  

---

## 🎯 SLIDE 1: Title & Platform Overview
* **Headline**: InnovaFund AI — Enterprise Innovation Intelligence Platform
* **Tagline**: Connecting Academic Research, Global Patent White-Spaces, and Strategic Grant Funding with AI.
* **Core Value Proposition**:
  - Unifies **250M+ Academic Papers** (OpenAlex), **140M+ Global Patents** (USPTO), and **$15B+ Grant Pools**.
  - Powered by a **4-Tier Architecture** with **FastAPI**, **React Vite**, **PostgreSQL 16**, **MongoDB 7**, and **Firebase Auth**.

---

## 💡 SLIDE 2: Problem Statement & Solution
* **The Problem**:
  1. Research literature is isolated from patent commercialization data.
  2. Researchers and startup founders miss out on millions in government grants due to manual matching.
  3. API rate limits and slow queries delay enterprise technology transfer.
* **Our Solution**:
  - A single-screen intelligence hub featuring **Live API Ingestion**, **Sub-5ms MongoDB Caching**, and **AI Grant Matching**.

---

## 🏗️ SLIDE 3: System Architecture & Tech Stack
* **Frontend Tier**: React 18 + Vite, Custom HSL Obsidian Theme, Google Fonts (`Outfit` & `Inter`), Glassmorphic UI.
* **Backend Tier**: FastAPI (Python 3.11), RESTful Routers, Pydantic Data Validation, CORS Middleware.
* **Security & Auth Tier**: Firebase Auth SDK (Google & GitHub OAuth 2.0) + PyJWT Signed Session Tokens (24h expiry).
* **Database Tier**:
  - **PostgreSQL 16**: Primary relational storage hosting 11 SQL schemas.
  - **MongoDB 7**: Document cache storing raw JSON API payloads from OpenAlex & USPTO.
  - **SQLite Fallback**: Automated fallback engine guaranteeing 100% uptime.

---

## 🚪 SLIDE 4: Module 1 — Authentication & Persona Onboarding (`/login` & `/register`)
* **What It Does**: Widescreen landscape authentication portal.
* **Key Features**:
  - **Single-Click Social SSO**: Google & GitHub OAuth via Firebase Auth (`innovafundai`).
  - **4-Persona RBAC**: Researcher, Startup Founder, Innovation Manager, Administrator.
  - **Live Metric Badges**: Highlights 250M+ Papers, 140M+ Patents, $15B+ Grants.

---

## 📊 SLIDE 5: Module 2 — Enterprise Intelligence Dashboard (`/dashboard`)
* **What It Does**: Central command center providing 360-degree innovation analytics.
* **Key Features**:
  - **Role-Specific Stat Cards**: Dynamic stats adapted to user role.
  - **Citation Velocity SVG Chart**: Tracks academic publication citations over time.
  - **Patent Landscape Breakdown**: Stacked metrics showing Granted vs. Pending IP.
  - **Matching Grant Opportunities**: Live cards displaying agency, amount, deadline, and domain tags.
  - **CSV Export Tool**: Downloads portfolio analytics in 1 click.

---

## 👤 SLIDE 6: Module 3 — Research Profile Manager (`/profile`)
* **What It Does**: Academic researcher portfolio and identity manager.
* **Key Features**:
  - Academic ORCID iD link (`0000-0002-1825-0097`).
  - Bio, institution badges, h-index, and editable research interest tags.
  - Publication record indexer.

---

## 📚 SLIDE 7: Module 4 — Academic Publications Explorer (`/publications`)
* **What It Does**: Live research paper search engine powered by OpenAlex API.
* **Key Features**:
  - Real-time OpenAlex REST API search engine.
  - Citation counts, publication year, journal name, and Open-Access badges.
  - Direct links to paper DOIs.

---

## 💡 SLIDE 8: Module 5 — Global Patent White-Space Explorer (`/patents`)
* **What It Does**: Patent search engine and white-space analysis tool.
* **Key Features**:
  - Real-time USPTO and Google Patents search.
  - **Status Filter Buttons**: Filter by **All**, **Granted**, **Pending**, or **Expired**.
  - Patent number, filing date, assignee, and claim count details.
  - **CSV Patent Data Export** button.

---

## 🏛️ SLIDE 9: Module 6 — Interactive System Architecture Explorer (`/architecture`)
* **What It Does**: Interactive architectural design documentation page.
* **Key Features**:
  - **4-Tier Visual Architecture Diagram**.
  - **4-Step Workflow Breakdown** (Auth, Ingestion, Caching, Analytics).
  - **11-Table ER Schema Viewer** mapping all SQL entities.

---

## ⚙️ SLIDE 10: Module 7 — System Settings & API Health Command Center (`/settings`)
* **What It Does**: Real-time database latency and service diagnostics panel.
* **Key Features**:
  - **Test All Services Button**: Runs live database latency pings (**`~2ms` PostgreSQL ping**, **`~4ms` MongoDB ping**).
  - API credential manager for OpenAlex, The Lens, and SerpAPI.

---

## 🛡️ SLIDE 11: Module 8 — Admin Control Console (`/admin`)
* **What It Does**: Governance, user management, and security audit log monitor.
* **Key Features**:
  - **User Management Table**: Manages platform users, roles, and active status.
  - **Pre-Seed Platform Datasets Button**: Populates sample test data with 1 click.
  - **Live Audit Log Stream**: Displays system audit records (`USER_LOGIN`, `DATASET_QUERY`, `OAUTH_LOGIN`).

---

## 🤖 SLIDE 12: Module 9 — InnovaAI Co-Pilot Assistant (`AIAssistantDrawer`)
* **What It Does**: Floating AI assistant drawer accessible from the top navbar.
* **Key Features**:
  - Instant answers to grant eligibility queries, paper summaries, and patent searches.

---

## 🔑 SLIDE 13: Access Credentials & Demo Guide
* **Pre-Seeded Administrator Account**:
  - **Email**: `admin@researchsphere.ai`
  - **Password**: `Admin@123456`
* **Social SSO**: Click **"Sign in with Google"** or **"Sign in with GitHub"**.
* **Frontend Web URL**: `http://localhost:5173`
* **Backend Swagger API Docs**: `http://localhost:8000/docs`
* **GitHub Repository**: [github.com/Nithya21shree/InnovaFund-AI/tree/mayank-dev](https://github.com/Nithya21shree/InnovaFund-AI/tree/mayank-dev)
