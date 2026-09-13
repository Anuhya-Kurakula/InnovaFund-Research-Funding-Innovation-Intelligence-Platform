"""
Validation Tests for Input Payloads & Boundary Checks
"""

import pytest
from fastapi.testclient import TestClient

def test_pillar_value_out_of_bounds_negative(client: TestClient):
    """Requirement 12: Pillar value of -5 -> HTTP 422."""
    payload = {
        "project_id": "PRJ-TEST",
        "research_novelty": -5.0,
        "patent_strength": 50.0,
        "technology_maturity": 50.0,
        "market_potential": 50.0,
        "funding_relevance": 50.0
    }
    response = client.post("/scoring/calculate", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data

def test_pillar_value_out_of_bounds_excessive(client: TestClient):
    """Requirement 12: Pillar value of 150 -> HTTP 422."""
    payload = {
        "project_id": "PRJ-TEST",
        "research_novelty": 50.0,
        "patent_strength": 150.0,
        "technology_maturity": 50.0,
        "market_potential": 50.0,
        "funding_relevance": 50.0
    }
    response = client.post("/scoring/calculate", json=payload)
    assert response.status_code == 422

def test_batch_size_exceeds_limit(client: TestClient):
    """Batch size > 50 -> HTTP 422."""
    projects = [{"project_id": f"PRJ-{i}"} for i in range(55)]
    response = client.post("/scoring/batch", json={"projects": projects})
    assert response.status_code == 422
