# Member 2 Technical Documentation: Grant Matching & Technology Intelligence Engine

## Executive Overview
Member 2 is responsible for **Backend Engine Architecture, Data Evaluation Services, and Analytics Integrations** across Milestone 2 and Milestone 3 of the **Research Funding & Innovation Intelligence Platform**.

---

## 🔹 Milestone 2 Deliverables: Grant Matching Rules Engine

### 1. Architectural Design
The Grant Matching Engine evaluates research profiles against grant criteria using a configurable weighted scoring algorithm:
- **Research Domain Match (35%)**: Compares profile research domain keywords against grant focus areas.
- **Career Stage Compatibility (25%)**: Validates eligibility (`Early-Career`, `Mid-Career`, `Senior/Lead`, `Startup/SME`, `Any`).
- **Geographical Eligibility (25%)**: Enforces regional restrictions (`Global`, `US`, `EU`, `India`, `UK`, `Asia-Pacific`).
- **Funding Type Preference (15%)**: Matches funding mechanism (`Grant`, `Fellowship`, `Accelerator`, `R&D Subsidy`).
- **Strict Deadline Check**: Automatically marks grants past deadline as `EXPIRED` / `INELIGIBLE`.

### 2. FastAPI Endpoints
- `POST /api/grants/match`: Evaluates a researcher profile against active funding opportunities.
- `GET /api/grants/eligible/{id}`: Returns detailed criteria match breakdown for a specific opportunity.
- `GET /api/grants/matching-rules`: Retrieves active rule weights.
- `PUT /api/grants/matching-rules`: Live tuning of criteria weights without code changes.

---

## 🔹 Milestone 3 Deliverables: Technology Intelligence Engine

### 1. Architectural Design
The Technology Intelligence Engine analyzes patent filing rates and academic publication velocity to identify emerging technology domains, classify lifecycle maturity stages, and monitor competitor market share.

### 2. Technology Maturity Score (15% Weight for Member 4)
Classifies technology domains into lifecycle stages (**`Emerging`**, **`Growth`**, **`Mature`**, **`Declining`**) and calculates Technology Readiness Levels (**TRL 1–9**), producing a **Maturity Score (0.0 to 100.0)** that supplies 15% of the weighted score to Member 4's Innovation Model.

### 3. FastAPI Endpoints
- `GET /api/technology/emerging`: Returns top emerging technology domains sorted by growth rate (% YoY).
- `GET /api/technology/maturity`: Returns lifecycle stage, TRL level (1-9), and 15% weight maturity score.
- `GET /api/technology/competitors`: Returns competitive patent assignees and market share percentages.

---

## 🧪 Verification & PyTest Suite
Run automated test suite:
```bash
python -m pytest backend/tests/test_grant_matching.py backend/tests/test_technology_intelligence.py
```
*(Result: 11 / 11 tests passing)*
