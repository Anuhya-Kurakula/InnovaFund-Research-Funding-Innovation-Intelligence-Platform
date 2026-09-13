"""
Integration Tests for Innovation Scoring API Endpoints
"""

import pytest
from fastapi.testclient import TestClient

def test_calculate_with_full_inline_body(client: TestClient):
    """Test POST /scoring/calculate with all 5 pillars passed inline."""
    payload = {
        "project_id": "PRJ-007",
        "research_novelty": 81.0,
        "patent_strength": 66.5,
        "technology_maturity": 58.0,
        "market_potential": 74.0,
        "funding_relevance": 75.0
    }
    response = client.post("/scoring/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert data["project_id"] == "PRJ-007"
    assert data["innovation_score"] == 72.35
    assert data["band"] == "High"
    
    # Pillars
    assert data["pillars"]["research_novelty"]["value"] == 81.0
    assert data["pillars"]["research_novelty"]["source"] == "input"
    assert data["pillars"]["research_novelty"]["is_fallback"] is False
    
    assert data["pillars"]["patent_strength"]["value"] == 66.5
    assert data["pillars"]["patent_strength"]["source"] == "input"
    assert data["pillars"]["patent_strength"]["is_fallback"] is False

    # Derived
    assert "derived_scores" in data
    assert "technology_readiness" in data["derived_scores"]
    assert "trl" in data["derived_scores"]["technology_readiness"]
    
    # Explanation
    assert "top_drivers" in data["explanation"]
    assert "weakest_pillars" in data["explanation"]
    assert "narrative" in data["explanation"]

def test_calculate_with_project_id_only(client: TestClient):
    """Test POST /scoring/calculate with only project_id using seeded fallback."""
    payload = {"project_id": "PRJ-007"}
    response = client.post("/scoring/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["project_id"] == "PRJ-007"
    assert data["innovation_score"] == 72.35
    assert data["pillars"]["patent_strength"]["is_fallback"] is True
    assert data["pillars"]["technology_maturity"]["is_fallback"] is True

def test_get_project_score_and_history(client: TestClient):
    """Test GET /scoring/{project_id} and GET /scoring/{project_id}/history."""
    # First compute
    payload = {
        "project_id": "PRJ-TEST-API",
        "research_novelty": 90.0,
        "patent_strength": 85.0,
        "technology_maturity": 80.0,
        "market_potential": 75.0,
        "funding_relevance": 70.0
    }
    post_res = client.post("/scoring/calculate", json=payload)
    assert post_res.status_code == 200

    # Get single
    get_res = client.get("/scoring/PRJ-TEST-API")
    assert get_res.status_code == 200
    assert get_res.json()["project_id"] == "PRJ-TEST-API"

    # Get history
    hist_res = client.get("/scoring/PRJ-TEST-API/history")
    assert hist_res.status_code == 200
    hist_data = hist_res.json()
    assert len(hist_data) >= 1
    assert hist_data[0]["project_id"] == "PRJ-TEST-API"

def test_get_unknown_project_returns_404(client: TestClient):
    """Requirement 13: GET /scoring/{unknown_id} -> 404 with clean error body."""
    response = client.get("/scoring/PRJ-TOTALLY-NONEXISTENT-999")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert "PRJ-TOTALLY-NONEXISTENT-999" in data["detail"]

def test_get_model_weights(client: TestClient):
    """Test GET /scoring/model/weights endpoint."""
    response = client.get("/scoring/model/weights")
    assert response.status_code == 200
    data = response.json()
    assert "primary_weights" in data
    assert data["primary_weights"]["research_novelty"] == 0.30
    assert "bands" in data
    assert len(data["bands"]) == 5

def test_health_check(client: TestClient):
    """Test GET /health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "active_signal_provider" in data

def test_batch_scoring(client: TestClient):
    """Test POST /scoring/batch endpoint."""
    payload = {
        "projects": [
            {"project_id": "PRJ-001", "research_novelty": 92.5, "patent_strength": 84.0, "technology_maturity": 68.0, "market_potential": 88.5, "funding_relevance": 90.0},
            {"project_id": "PRJ-002", "research_novelty": 89.0, "patent_strength": 78.5, "technology_maturity": 62.0, "market_potential": 85.0, "funding_relevance": 82.0},
            {"project_id": "PRJ-003", "research_novelty": 85.0, "patent_strength": 91.0, "technology_maturity": 74.0, "market_potential": 94.0, "funding_relevance": 88.0}
        ]
    }
    response = client.post("/scoring/batch", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_scored"] == 3
    assert len(data["scores"]) == 3
