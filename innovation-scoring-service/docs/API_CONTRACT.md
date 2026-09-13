# Innovation Scoring API Contract (Member 4)

---

## Base Path
- **Standalone**: `http://localhost:8004/scoring`
- **Integrated Backend**: `http://localhost:8000/api/scoring` (and `http://localhost:8000/scoring`)

---

## Endpoints Reference

### 1. `POST /scoring/calculate`
Computes and stores a 5-pillar composite innovation score.

#### Request Body
```json
{
  "project_id": "PRJ-007",
  "research_novelty": 81.0,
  "patent_strength": 66.5,
  "technology_maturity": 58.0,
  "market_potential": 74.0,
  "funding_relevance": 75.0,
  "raw_metrics": {
    "citation_count": 62,
    "claim_count": 16,
    "patent_family_size": 5,
    "years_since_filing": 3
  }
}
```

*Note*: Any omitted pillar is automatically resolved via the active `SignalProvider`.

#### Response (200 OK)
```json
{
  "project_id": "PRJ-007",
  "model_version": "1.0.0",
  "innovation_score": 72.35,
  "band": "High",
  "pillars": {
    "research_novelty": {
      "value": 81.0,
      "weight": 0.30,
      "contribution": 24.30,
      "source": "input",
      "is_fallback": false
    },
    "patent_strength": {
      "value": 66.5,
      "weight": 0.20,
      "contribution": 13.30,
      "source": "local_seed",
      "is_fallback": true
    },
    "technology_maturity": {
      "value": 58.0,
      "weight": 0.15,
      "contribution": 8.70,
      "source": "local_seed",
      "is_fallback": true
    },
    "market_potential": {
      "value": 74.0,
      "weight": 0.20,
      "contribution": 14.80,
      "source": "input",
      "is_fallback": false
    },
    "funding_relevance": {
      "value": 75.0,
      "weight": 0.15,
      "contribution": 11.25,
      "source": "input",
      "is_fallback": false
    }
  },
  "derived_scores": {
    "innovation_potential": 74.90,
    "research_impact": 76.18,
    "technology_readiness": {
      "score": 62.53,
      "trl": 6
    },
    "commercial_viability": 67.33,
    "funding_attractiveness": 76.50
  },
  "explanation": {
    "top_drivers": ["research_novelty", "funding_relevance"],
    "weakest_pillars": ["technology_maturity"],
    "narrative": "Strong research novelty and funding relevance position this project in the 'High' innovation band; technology maturity represents the primary growth opportunity."
  },
  "computed_at": "2026-09-02T10:15:00Z"
}
```

---

### 2. `GET /scoring/{project_id}`
Returns the most recently computed score record for a project.

#### Response (200 OK)
Returns `ScoreResponse` JSON matching the structure above.
#### Response (404 Not Found)
```json
{
  "detail": "No innovation score found for project 'PRJ-UNKNOWN'."
}
```

---

### 3. `GET /scoring/{project_id}/history`
Returns historical score computations for the project, sorted chronologically from newest to oldest.

#### Response (200 OK)
```json
[
  { "project_id": "PRJ-007", "innovation_score": 72.35, "band": "High", ... },
  { "project_id": "PRJ-007", "innovation_score": 70.10, "band": "High", ... }
]
```

---

### 4. `POST /scoring/batch`
Scores up to 50 projects concurrently in parallel worker pools.

#### Request Body
```json
{
  "projects": [
    { "project_id": "PRJ-001" },
    { "project_id": "PRJ-002", "research_novelty": 90.0 }
  ]
}
```

#### Response (200 OK)
```json
{
  "total_scored": 2,
  "scores": [ ... ]
}
```

---

### 5. `GET /scoring/model/weights`
Exposes the central weight dictionary and score bands to frontend clients.

#### Response (200 OK)
```json
{
  "model_version": "1.0.0",
  "primary_weights": {
    "research_novelty": 0.30,
    "patent_strength": 0.20,
    "technology_maturity": 0.15,
    "market_potential": 0.20,
    "funding_relevance": 0.15
  },
  "derived_weights": {
    "innovation_potential": { "research_novelty": 0.45, "patent_strength": 0.30, "market_potential": 0.25 },
    "research_impact": { "research_novelty": 0.55, "patent_strength": 0.25, "funding_relevance": 0.20 },
    "technology_readiness": { "technology_maturity": 0.60, "patent_strength": 0.25, "market_potential": 0.15 },
    "commercial_viability": { "market_potential": 0.45, "technology_maturity": 0.30, "patent_strength": 0.25 },
    "funding_attractiveness": { "funding_relevance": 0.40, "research_novelty": 0.30, "market_potential": 0.30 }
  },
  "bands": [
    { "name": "Very High", "min": 80.0, "max": 100.0, "color": "#10b981" },
    { "name": "High", "min": 65.0, "max": 79.99, "color": "#0ea5e9" },
    { "name": "Moderate", "min": 50.0, "max": 64.99, "color": "#f59e0b" },
    { "name": "Low", "min": 35.0, "max": 49.99, "color": "#f97316" },
    { "name": "Very Low", "min": 0.0, "max": 34.99, "color": "#ef4444" }
  ]
}
```

---

### 6. `GET /health`
Liveness probe, active signal provider, and DB reachability check.

#### Response (200 OK)
```json
{
  "status": "ok",
  "service": "Innovation Scoring Engine",
  "version": "1.0.0",
  "active_signal_provider": "local",
  "database_connected": true
}
```
