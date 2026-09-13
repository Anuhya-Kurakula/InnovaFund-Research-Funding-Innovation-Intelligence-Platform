# System Architecture & Technical Documentation
## Member 4: Standalone Innovation Scoring Engine & Platform Integration
**Milestone 3 — Research Funding & Innovation Intelligence Platform**

---

## 1. System Overview & Architecture

The Innovation Scoring Engine operates both as an **autonomous microservice** and as an **integrated subsystem** within the platform. The architecture separates the pure mathematical scoring domain from network I/O, persistence, and UI presentation.

### High-Level Multi-Tier Architecture Diagram

```mermaid
flowchart TB
    subgraph UI_Layer["Frontend Layer (React 19 + Vite)"]
        A1["Innovation Scoring Cockpit (/scoring)"]
        A2["Patent Landscape Link (/patents)"]
        A3["Dashboard Quick Modal (/dashboard)"]
        A4["Interactive Simulator (Sliders & Custom Mode)"]
    end

    subgraph API_Gateway["API Layer & Routers (FastAPI)"]
        B1["POST /scoring/calculate"]
        B2["POST /scoring/batch"]
        B3["GET /scoring/{project_id}"]
        B4["GET /scoring/{project_id}/history"]
        B5["GET /scoring/model/weights"]
        B6["GET /health"]
    end

    subgraph Core_Engine["Core Mathematical Engine (app/core)"]
        C1["Primary 5-Pillar Weighted Composite"]
        C2["Derived Scores Calculator"]
        C3["NASA TRL (1-9) Classifier"]
        C4["Qualitative Band Generator"]
        C5["Deterministic Explanation Engine"]
    end

    subgraph Provider_Layer["Signal Provider Strategy (app/providers)"]
        D1{"Provider Selector"}
        D2["LocalSignalProvider (Offline JSON Seed)"]
        D3["HeuristicSignalProvider (Bibliometric Math)"]
        D4["HttpSignalProvider (Teammate APIs + 3s Fallback)"]
    end

    subgraph Persistence_Layer["Storage & Audit Layer (SQLAlchemy 2.x)"]
        E1[("PostgreSQL / SQLite Database")]
        E2["innovation_score_history (Audit Log)"]
        E3["innovation_score_inputs (Project Benchmarks)"]
    end

    UI_Layer -->|Axios REST Calls| API_Gateway
    API_Gateway -->|Pydantic v2 Validation| Core_Engine
    API_Gateway -->|Fetch / Fallback Signals| Provider_Layer
    Provider_Layer -->|Resolve Signals| Core_Engine
    D1 --> D2
    D1 --> D3
    D1 --> D4
    D4 -.->|3s Timeout Fallback| D2
    API_Gateway -->|Commit Score Records| Persistence_Layer
```

---

## 2. Mathematical 5-Pillar Scoring Flow & Derived Dimensions

The core scoring engine takes 5 primary normalized pillars in the $[0, 100]$ range, computes the composite score using single-source-of-truth weights ($\sum = 1.0$), evaluates 5 derived strategic indices, and maps technology maturity to the NASA TRL (1–9) scale.

### Scoring Flowchart & Weight Distribution

```mermaid
flowchart LR
    subgraph Primary_Pillars["Primary 5 Pillars (0-100)"]
        P1["Research Novelty (RN)"]
        P2["Patent Strength (PS)"]
        P3["Technology Maturity (TM)"]
        P4["Market Potential (MP)"]
        P5["Funding Relevance (FR)"]
    end

    subgraph Weights["Pillar Weights (Sum = 1.0)"]
        W1["w1 = 0.30"]
        W2["w2 = 0.20"]
        W3["w3 = 0.15"]
        W4["w4 = 0.20"]
        W5["w5 = 0.15"]
    end

    subgraph Composite_Output["Composite Output"]
        CS["Composite Innovation Score (0-100)"]
        BAND["Qualitative Band (Very High / High / Moderate / Low / Very Low)"]
    end

    subgraph Derived_Indices["Strategic Derived Indices"]
        D_IP["Innovation Potential (0.45 RN + 0.30 PS + 0.25 MP)"]
        D_RI["Research Impact (0.55 RN + 0.25 PS + 0.20 FR)"]
        D_TR["Technology Readiness Score (0.60 TM + 0.25 PS + 0.15 MP)"]
        D_CV["Commercial Viability (0.45 MP + 0.30 TM + 0.25 PS)"]
        D_FA["Funding Attractiveness (0.40 FR + 0.30 RN + 0.30 MP)"]
        TRL["NASA TRL Level (TRL 1 to TRL 9)"]
    end

    P1 --- W1 --> CS
    P2 --- W2 --> CS
    P3 --- W3 --> CS
    P4 --- W4 --> CS
    P5 --- W5 --> CS
    CS --> BAND

    P1 & P2 & P4 --> D_IP
    P1 & P2 & P5 --> D_RI
    P3 & P2 & P4 --> D_TR --> TRL
    P4 & P3 & P2 --> D_CV
    P5 & P1 & P4 --> D_FA
```

---

## 3. Signal Provider Strategy & Resilience Hierarchy

To ensure **zero external dependency**, the scoring engine employs a Strategy Pattern. External signals (Patent Strength & Technology Maturity) are resolved through a resilient fallback hierarchy:

```mermaid
sequenceDiagram
    autonumber
    actor Client as User / Frontend
    participant API as FastAPI Router (/calculate)
    participant Factory as Provider Factory
    participant Provider as Signal Provider
    participant Math as Core Scoring Math
    participant DB as SQLite / PostgreSQL

    Client->>API: POST /scoring/calculate { project_id: "PRJ-007" }
    API->>Factory: get_signal_provider(SIGNAL_SOURCE)
    Factory-->>API: Active Provider Instance

    alt SIGNAL_SOURCE == "http"
        API->>Provider: Request Remote Teammate API (Patent & Maturity)
        alt Remote Responded within 3.0s
            Provider-->>API: SignalResult(patent, maturity, is_fallback=False)
        else Network Timeout / 500 Error
            Provider->>Provider: Fallback to local deterministic seed JSON
            Provider-->>API: SignalResult(patent, maturity, is_fallback=True)
        end
    else SIGNAL_SOURCE == "heuristic"
        API->>Provider: Compute Heuristic from raw metrics (citations, grant size)
        Provider-->>API: SignalResult(patent, maturity, is_fallback=False)
    else SIGNAL_SOURCE == "local" (Default Standalone)
        API->>Provider: Read data/seed_signals.json
        Provider-->>API: SignalResult(patent, maturity, is_fallback=True)
    end

    API->>Math: calculate_innovation_score(5 Pillars)
    Math-->>API: Score = 72.35, Band = "High", TRL = 6, Breakdown
    API->>DB: INSERT INTO innovation_score_history
    DB-->>API: Record ID & Timestamp
    API-->>Client: 200 OK Response Envelope (Full JSON payload)
```

---

## 4. NASA Technology Readiness Level (TRL) & Band Mapping

```mermaid
flowchart TD
    subgraph Band_Mapping["Qualitative Score Bands"]
        B1["80.0 - 100.0: VERY HIGH (Green #10b981)"]
        B2["65.0 - 79.99: HIGH (Blue #0ea5e9)"]
        B3["50.0 - 64.99: MODERATE (Amber #f59e0b)"]
        B4["35.0 - 49.99: LOW (Orange #f97316)"]
        B5["0.0 - 34.99: VERY LOW (Red #ef4444)"]
    end

    subgraph TRL_Scale["NASA TRL Scale (Based on Technology Readiness Score)"]
        T9["Score >= 90: TRL 9 - Actual System Proven in Mission Operations"]
        T8["Score >= 80: TRL 8 - System Qualified Through Test & Demo"]
        T7["Score >= 70: TRL 7 - System Prototype Demo in Operational Environment"]
        T6["Score >= 60: TRL 6 - Prototype Demo in Relevant Environment"]
        T5["Score >= 50: TRL 5 - Component Validation in Relevant Environment"]
        T4["Score >= 40: TRL 4 - Component Validation in Laboratory"]
        T3["Score >= 30: TRL 3 - Analytical & Experimental Critical Proof of Concept"]
        T2["Score >= 20: TRL 2 - Technology Concept & Application Formulated"]
        T1["Score < 20: TRL 1 - Basic Principles Observed & Reported"]
    end
```

---

## 5. Database Entity Relationship (ER) Model

```mermaid
erDiagram
    INNOVATION_SCORE_HISTORY {
        int id PK "Primary Key (Auto-Increment)"
        string project_id "Project Identifier (Indexed)"
        string model_version "Scoring Model Version (e.g., 1.0.0)"
        float innovation_score "Composite Score (0.00 to 100.00)"
        string band "Score Band (Very High to Very Low)"
        json pillars "JSON/JSONB with Pillar Values, Weights & Contributions"
        json derived_scores "JSON/JSONB with 5 Derived Metrics & TRL"
        json explanation "JSON/JSONB with Top Drivers, Bottlenecks & Narrative"
        datetime computed_at "Audit Timestamp (Indexed)"
    }

    INNOVATION_SCORE_INPUTS {
        int id PK "Primary Key (Auto-Increment)"
        string project_id UK "Unique Project Identifier (Indexed)"
        string title "Research Project Title"
        string domain "Technology Domain (AI/ML, Agritech, Biotech, etc.)"
        json raw_metrics "Raw Bibliometric Metrics (Citations, Patents, etc.)"
        datetime created_at "Record Creation Timestamp"
    }

    INNOVATION_SCORE_INPUTS ||--o{ INNOVATION_SCORE_HISTORY : "evaluated_as"
```

---

## 6. End-to-End Execution & Testing Matrix

| Component / Layer | Implementation File | Test File | Verification Result |
| :--- | :--- | :--- | :--- |
| **Mathematical Weights** | `app/core/weights.py` | `tests/test_weights.py` | ✅ $\sum = 1.0$ validated; exception raised on invalid sums |
| **Composite Scoring Math** | `app/core/scoring.py` | `tests/test_scoring_math.py` | ✅ Exact `72.35` fixture precision; min/max boundary checks pass |
| **Derived Scores & TRL** | `app/core/scoring.py` | `tests/test_derived_scores.py` | ✅ NASA TRL 1–9 mapping and qualitative bands pass 100% |
| **Signal Providers** | `app/providers/*` | `tests/test_providers.py` | ✅ Deterministic local, heuristic, and HTTP fallback pass |
| **Pydantic Validation** | `app/schemas/scoring.py` | `tests/test_validation.py` | ✅ $0 \le x \le 100$ boundary checks & batch limit $\le 50$ enforced |
| **FastAPI REST Endpoints** | `app/api/routes_scoring.py` | `tests/test_api.py` | ✅ All 6 endpoints pass with 200/404 handling |
| **Database Migrations** | `backend/alembic/` | `scripts/seed_db.py` | ✅ 25 projects seeded; additive tables auto-created |
| **Frontend Workspace** | `frontend/src/pages/ScoringPage.jsx` | `npm run build` | ✅ Zero errors in production bundling (3.63s) |
