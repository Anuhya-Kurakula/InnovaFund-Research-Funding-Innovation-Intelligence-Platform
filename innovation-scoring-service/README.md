# 🚀 Innovation Scoring Engine (Milestone 3 — Member 4)

A standalone, zero-dependency **Innovation Scoring microservice** for the Research Funding & Innovation Intelligence Platform.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![Tests](https://img.shields.io/badge/PyTest-27%2F27%20Passing-success.svg)](https://docs.pytest.org/)
[![Coverage](https://img.shields.io/badge/Coverage-93%25-brightgreen.svg)](https://pytest-cov.readthedocs.io/)
[![Zero-Dependency](https://img.shields.io/badge/Architecture-Zero--Dependency-blue.svg)]()

---

## 📌 Executive Overview

The **Innovation Scoring Engine** evaluates deep-tech research and grant proposals by computing:
1. **5-Pillar Weighted Composite Innovation Score (0–100)**
2. **5 Specialized Derived Indices** (Innovation Potential, Research Impact, Technology Readiness, Commercial Viability, Funding Attractiveness)
3. **NASA Standard Technology Readiness Level (TRL 1–9)**
4. **Qualitative Score Bands** (`Very High`, `High`, `Moderate`, `Low`, `Very Low`)
5. **Deterministic Explanation Generator** (identifies top drivers, weakest bottlenecks, and actionable narratives)

---

## 🛠️ Architecture: Zero Dependency & Standalone First

```
innovation-scoring-service/
├── app/
│   ├── main.py                  # Standalone FastAPI runner & CORS config
│   ├── config.py                # Pydantic-settings with tunable parameters
│   ├── api/
│   │   ├── routes_scoring.py    # Core scoring API endpoints
│   │   └── routes_health.py     # Liveness & provider inspection
│   ├── core/
│   │   ├── weights.py           # Single source of truth for weights (sum=1.0)
│   │   ├── scoring.py           # Pure mathematical functions (0 I/O)
│   │   ├── normalize.py         # Logarithmic & Min-Max scalers
│   │   └── bands.py             # Score band boundary classification
│   ├── providers/
│   │   ├── base.py              # SignalProvider ABC & SignalResult
│   │   ├── local.py             # Local deterministic provider (DEFAULT)
│   │   ├── heuristic.py         # Bibliometric raw metrics calculator
│   │   ├── http.py              # HTTP client with 3s timeout & local fallback
│   │   └── factory.py           # Provider selection factory
│   ├── db/
│   │   ├── session.py           # SQLite/Postgres dialect engine
│   │   ├── models.py            # InnovationScoreHistory & Input models
│   │   └── crud.py              # Database persistence operations
│   └── schemas/
│       └── scoring.py           # Pydantic v2 validation contracts
├── data/
│   ├── seed_projects.json       # 25 synthetic projects across 5 tech domains
│   └── seed_signals.json        # Deterministic patent & maturity signals
├── scripts/
│   └── seed_db.py               # Pre-computes scores for seed dataset
├── tests/                       # 27 comprehensive offline test cases (93% coverage)
├── docs/
│   ├── SCORING_METHODOLOGY.md   # Mathematical equations and weight proofs
│   └── API_CONTRACT.md          # OpenAPI spec & JSON examples
└── Dockerfile & docker-compose.yml
```

---

## 🚀 Quickstart: Offline Standalone Run (Demo Day Ready)

Run the service offline with zero external databases or teammates running:

```bash
# 1. Navigate to service folder
cd innovation-scoring-service

# 2. Install dependencies
pip install -r requirements.txt

# 3. Seed SQLite database with 25 synthetic projects
python scripts/seed_db.py

# 4. Run full test suite (all tests green offline)
pytest tests/ -v --cov=app/core

# 5. Start the standalone server
uvicorn app.main:app --port 8004 --reload
```

* Swagger Documentation: `http://localhost:8004/docs`
* Health Endpoint: `http://localhost:8004/health`

---

## 🤝 Team Integration Guide

This service is engineered to mount cleanly into the shared platform backend.

### Switching Between Standalone and Integrated Modes

| Configuration | Standalone Mode | Integrated Mode |
| :--- | :--- | :--- |
| `STANDALONE` | `true` | `false` |
| `DATABASE_URL` | `sqlite:///./innovation_scoring.db` | `postgresql://user:pass@localhost:5433/db` |
| `SIGNAL_SOURCE` | `local` | `http` |
| `PATENT_API_URL` | N/A | `http://localhost:8000/api/patents` |
| `TECH_API_URL` | N/A | `http://localhost:8000/api/technology` |

To pull live signals from teammates (Member 2 & 3), **the only change required is setting environment variables**:
```env
SIGNAL_SOURCE=http
PATENT_API_URL=http://localhost:8000/api/patents
TECH_API_URL=http://localhost:8000/api/technology
```

If teammate endpoints are down, unreachable, or take longer than 3 seconds, `HttpSignalProvider` automatically falls back to local seed data and sets `is_fallback: true` without failing or throwing 5xx errors.
