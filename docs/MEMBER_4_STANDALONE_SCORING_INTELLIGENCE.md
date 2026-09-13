# Member 4: Standalone Innovation Scoring Intelligence Engine
**Milestone 3 — Research Funding & Innovation Intelligence Platform**

---

## 🎯 1. Executive Summary & Microservice Boundary

Member 4 is an **autonomous intelligence engine** designed to evaluate deep-tech research proposals across scientific, patent, readiness, market, and funding dimensions.

### Isolated Microservice Architecture Diagram

```mermaid
flowchart TB
    subgraph Client_Boundary["Client / Integration Consumers"]
        CLI["Command Line Interface / Scripts"]
        CURL["cURL / Automated CI Test Runners"]
        FRONTEND["React Web Cockpit (/scoring)"]
        TEAMMATES["Teammate Microservices (HTTP REST)"]
    end

    subgraph Service_Boundary["Member 4 Microservice (Port 8004)"]
        subgraph FastAPI_Server["FastAPI REST Application (app/main.py)"]
            R1["POST /scoring/calculate"]
            R2["POST /scoring/batch"]
            R3["GET /scoring/{id}"]
            R4["GET /scoring/{id}/history"]
            R5["GET /scoring/model/weights"]
            R6["GET /health"]
        end

        subgraph Providers["Signal Provider Layer (app/providers)"]
            SP_LOCAL["LocalSignalProvider (Offline JSON Seeds)"]
            SP_HEURISTIC["HeuristicSignalProvider (Bibliometric Math)"]
            SP_HTTP["HttpSignalProvider (Teammate API Client + 3s Fallback)"]
        end

        subgraph Math_Engine["Pure Mathematical Scoring Engine (app/core)"]
            CORE_NORM["Normalizer (Min-Max & Log Normalization)"]
            CORE_WEIGHTS["Weight Registry (Sum-to-1.0 Enforcer)"]
            CORE_COMPOSITE["Composite Scoring (0-100 Math)"]
            CORE_DERIVED["Derived Indices Calculator"]
            CORE_TRL["NASA TRL (1-9) Classifier"]
            CORE_BAND["Qualitative Banding Classifier"]
            CORE_EXPLAIN["Deterministic Narrative Synthesizer"]
        end

        subgraph Storage["Persistence Layer (app/db)"]
            DB_SESSION["SQLAlchemy 2.x Session Engine"]
            DB_MODELS["InnovationScoreHistory & InnovationScoreInput"]
            SQLITE_DB[("SQLite Database: innovation_scoring.db")]
        end
    end

    Client_Boundary -->|HTTP Requests| FastAPI_Server
    FastAPI_Server --> Providers
    Providers --> Math_Engine
    Math_Engine --> Storage
    Storage --> SQLITE_DB
```

---

## 🧠 2. End-to-End Scoring Intelligence Lifecycle

```mermaid
flowchart TD
    subgraph Stage1["1. INGESTION"]
        A["Research Proposal ID or Inline Metrics"] --> B["Pydantic v2 Strict Schema Validation (0-100 Bounds)"]
    end

    subgraph Stage2["2. SIGNAL RESOLUTION"]
        B --> C{"Signal Provider Selector"}
        C -->|Local Seed| D1["Read data/seed_signals.json"]
        C -->|Heuristic| D2["Calculate Logarithmic Citations & Patent Count"]
        C -->|HTTP Remote| D3["Call Remote Teammate API"]
        D3 -.->|Timeout / Error| D1
        D1 & D2 & D3 --> E["Resolved 5 Primary Pillars in [0, 100]"]
    end

    subgraph Stage3["3. MATHEMATICAL COMPUTATION"]
        E --> F1["Apply Primary Weights: 0.30 RN + 0.20 PS + 0.15 TM + 0.20 MP + 0.15 FR"]
        E --> F2["Calculate 5 Strategic Derived Dimensions"]
        F1 --> G1["Composite Innovation Score (e.g., 72.35)"]
        F2 --> G2["Technology Readiness Score (e.g., 62.53) -> NASA TRL 6"]
        G1 --> G3["Qualitative Band Classification -> High Band"]
    end

    subgraph Stage4["4. EXPLANATION SYNTHESIS"]
        G1 & G2 & G3 --> H1["Find Top 2 Drivers (Max Positive Contributions)"]
        G1 & G2 & G3 --> H2["Find Development Bottlenecks (Lowest Performing Pillars)"]
        H1 & H2 --> H3["Generate Natural Language Audit Narrative"]
    end

    subgraph Stage5["5. PERSISTENCE & RESPONSE"]
        H3 --> I1["Save Immutable Score Record to Database"]
        H3 --> I2["Return JSON Response Envelope with Full Breakdown"]
    end
```

---

## 📐 3. Mathematical Formula & Step-by-Step Numerical Walkthrough

### Mathematical Equations

$$\text{Innovation Score} = \sum_{i=1}^{5} \left( w_i \times P_i \right) = (0.30 \cdot \text{RN}) + (0.20 \cdot \text{PS}) + (0.15 \cdot \text{TM}) + (0.20 \cdot \text{MP}) + (0.15 \cdot \text{FR})$$

$$\text{Innovation Potential} = 0.45 \cdot \text{RN} + 0.30 \cdot \text{PS} + 0.25 \cdot \text{MP}$$

$$\text{Research Impact} = 0.55 \cdot \text{RN} + 0.25 \cdot \text{PS} + 0.20 \cdot \text{FR}$$

$$\text{Technology Readiness Score} = 0.60 \cdot \text{TM} + 0.25 \cdot \text{PS} + 0.15 \cdot \text{MP}$$

$$\text{Commercial Viability} = 0.45 \cdot \text{MP} + 0.30 \cdot \text{TM} + 0.25 \cdot \text{PS}$$

$$\text{Funding Attractiveness} = 0.40 \cdot \text{FR} + 0.30 \cdot \text{RN} + 0.30 \cdot \text{MP}$$

---

### Step-by-Step Numerical Verification on `PRJ-007` (Soil Microbiome Regeneration)

```mermaid
flowchart LR
    subgraph Inputs["1. Normalized Pillars (0-100)"]
        RN["Research Novelty: 81.0"]
        PS["Patent Strength: 66.5"]
        TM["Tech Maturity: 58.0"]
        MP["Market Potential: 74.0"]
        FR["Funding Relevance: 75.0"]
    end

    subgraph Calculations["2. Weight Multiplications"]
        C_RN["81.0 x 0.30 = 24.30"]
        C_PS["66.5 x 0.20 = 13.30"]
        C_TM["58.0 x 0.15 = 8.70"]
        C_MP["74.0 x 0.20 = 14.80"]
        C_FR["75.0 x 0.15 = 11.25"]
    end

    subgraph Results["3. Composite & Derived Outputs"]
        TOTAL["Innovation Score: 72.35"]
        BAND["Band: HIGH (65.0 - 79.99)"]
        TRL["NASA Level: TRL 6"]
        IP["Innovation Potential: 74.90"]
        RI["Research Impact: 76.18"]
        CV["Commercial Viability: 67.33"]
        FA["Funding Attractiveness: 76.50"]
    end

    RN --> C_RN --> TOTAL
    PS --> C_PS --> TOTAL
    TM --> C_TM --> TOTAL
    MP --> C_MP --> TOTAL
    FR --> C_FR --> TOTAL
    TOTAL --> BAND
    C_TM & C_PS & C_MP --> TRL
    C_RN & C_PS & C_MP --> IP
    C_RN & C_PS & C_FR --> RI
    C_MP & C_TM & C_PS --> CV
    C_FR & C_RN & C_MP --> FA
```

---

## 🔬 4. Signal Provider Strategy & Fallback Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Consumer as User / Client App
    participant Route as routes_scoring.py
    participant Factory as factory.py
    participant Provider as SignalProvider
    participant Math as scoring.py
    participant DB as SQLite DB

    Consumer->>Route: POST /scoring/calculate {"project_id": "PRJ-007"}
    Route->>Factory: get_signal_provider(SIGNAL_SOURCE)
    Factory-->>Route: Provider Instance

    alt SIGNAL_SOURCE == "http"
        Route->>Provider: Request Remote Teammate Microservice
        alt Responded < 3.0s
            Provider-->>Route: SignalResult(patent, maturity, is_fallback=False)
        else Connection Timeout / Refused
            Provider->>Provider: Fallback to local deterministic seed JSON
            Provider-->>Route: SignalResult(patent, maturity, is_fallback=True)
        end
    else SIGNAL_SOURCE == "heuristic"
        Route->>Provider: Compute Heuristic from raw metrics
        Provider-->>Route: SignalResult(patent, maturity, is_fallback=False)
    else SIGNAL_SOURCE == "local" (Default Standalone Mode)
        Route->>Provider: Read data/seed_signals.json
        Provider-->>Route: SignalResult(patent, maturity, is_fallback=True)
    end

    Route->>Math: calculate_innovation_score(5 Pillars)
    Math-->>Route: Score=72.35, Band="High", TRL=6, Breakdown, Explanations
    Route->>DB: INSERT INTO innovation_score_history
    DB-->>Route: Persisted Record ID & Timestamp
    Route-->>Consumer: 200 OK Response Envelope
```

---

## 📊 5. Qualitative Bands & NASA TRL Scale Decision Tree

```mermaid
flowchart TD
    subgraph Score_Bands["Composite Score Qualitative Bands"]
        SCORE["Innovation Score (0 - 100)"]
        SCORE -->|>= 80.0| B_VH["VERY HIGH (80.0 - 100.0) | Color: #10b981 | Frontier Innovation"]
        SCORE -->|>= 65.0| B_H["HIGH (65.0 - 79.99) | Color: #0ea5e9 | Strong Commercial Potential"]
        SCORE -->|>= 50.0| B_M["MODERATE (50.0 - 64.99) | Color: #f59e0b | Viable with Technical Hurdles"]
        SCORE -->|>= 35.0| B_L["LOW (35.0 - 49.99) | Color: #f97316 | Early Exploratory Research"]
        SCORE -->|< 35.0| B_VL["VERY LOW (0.0 - 34.99) | Color: #ef4444 | High Risk / Unproven Baseline"]
    end

    subgraph TRL_Decision_Tree["NASA Technology Readiness Level (TRL 1 - 9)"]
        TR_SCORE["Technology Readiness Score (0.60 TM + 0.25 PS + 0.15 MP)"]
        TR_SCORE -->|>= 90| T9["TRL 9: System Proven in Operational Mission"]
        TR_SCORE -->|>= 80| T8["TRL 8: System Qualified via Test & Demo"]
        TR_SCORE -->|>= 70| T7["TRL 7: System Prototype Demo in Operational Environment"]
        TR_SCORE -->|>= 60| T6["TRL 6: Prototype Demo in Relevant Environment"]
        TR_SCORE -->|>= 50| T5["TRL 5: Component Validation in Relevant Environment"]
        TR_SCORE -->|>= 40| T4["TRL 4: Component Validation in Laboratory"]
        TR_SCORE -->|>= 30| T3["TRL 3: Analytical & Experimental Proof of Concept"]
        TR_SCORE -->|>= 20| T2["TRL 2: Technology Concept & Application Formulated"]
        TR_SCORE -->|< 20| T1["TRL 1: Basic Principles Observed & Reported"]
    end
```

---

## 🗄️ 6. Database Entity Relationship (ER) Model

```mermaid
erDiagram
    INNOVATION_SCORE_HISTORY {
        int id PK "Primary Key (Auto-Increment)"
        string project_id "Project Identifier (Indexed)"
        string model_version "Scoring Model Version (1.0.0)"
        float innovation_score "Composite Innovation Score (0.00 - 100.00)"
        string band "Qualitative Band (Very High to Very Low)"
        json pillars "JSON with Pillar Values, Weights & Contributions"
        json derived_scores "JSON with 5 Derived Metrics & TRL"
        json explanation "JSON with Top Drivers, Bottlenecks & Narrative"
        datetime computed_at "Audit Timestamp (Indexed)"
    }

    INNOVATION_SCORE_INPUTS {
        int id PK "Primary Key (Auto-Increment)"
        string project_id UK "Unique Project Identifier (Indexed)"
        string title "Project Title"
        string domain "Technology Domain (AI/ML, Agritech, Biotech, etc.)"
        json raw_metrics "Raw Bibliometric Metrics"
        datetime created_at "Record Creation Timestamp"
    }

    INNOVATION_SCORE_INPUTS ||--o{ INNOVATION_SCORE_HISTORY : "evaluated_into"
```

---

## 🚀 7. Step-by-Step Standalone Execution Guide

### 1. Run All PyTest Cases with Coverage (27/27 Passing)
```bash
cd innovation-scoring-service
pytest tests/ -v --cov=app/core
```

### 2. Seed SQLite Database with 25 Benchmark Projects
```bash
python scripts/seed_db.py
```

### 3. Launch Standalone Microservice on Port 8004
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8004 --reload
```

### 4. Interactive Live Endpoints
- **Interactive Swagger UI**: [http://localhost:8004/docs](http://localhost:8004/docs)
- **Health Check**: [http://localhost:8004/health](http://localhost:8004/health)
- **Calculate Score via cURL**:
```bash
curl -X POST "http://localhost:8004/scoring/calculate" \
     -H "Content-Type: application/json" \
     -d '{"project_id": "PRJ-007"}'
```
