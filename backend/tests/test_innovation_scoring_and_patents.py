import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)


def test_patent_search_endpoint():
    res = client.get("/patents/search?query=quantum&limit=5")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)


def test_patent_clusters_endpoint():
    res = client.get("/patents/clusters")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "cluster_name" in data[0]


def test_patent_trends_endpoint():
    res = client.get("/patents/trends")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "filing_velocity" in data[0]


def test_technology_emerging_endpoint():
    res = client.get("/technology/emerging")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)


def test_technology_maturity_endpoint():
    res = client.get("/technology/maturity")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)


def test_technology_competitors_endpoint():
    res = client.get("/technology/competitors")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)


def test_scoring_calculate_endpoint():
    payload = {
        "project_id": 1,
        "project_title": "Test AI Project",
        "research_novelty": 90.0,
        "patent_strength": 80.0,
        "technology_maturity": 70.0,
        "market_potential": 85.0,
        "funding_relevance": 75.0
    }
    # Formula: 90*0.3 + 80*0.2 + 70*0.15 + 85*0.2 + 75*0.15 = 27 + 16 + 10.5 + 17 + 11.25 = 81.75
    res = client.post("/scoring/calculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["overall_score"] == 81.75
    assert "breakdown" in data
    assert data["breakdown"]["research_novelty_weighted"] == 27.0


def test_scoring_get_by_project_id():
    res = client.get("/scoring/1")
    assert res.status_code == 200
    data = res.json()
    assert "overall_score" in data
    assert data["project_id"] == 1


def test_commercialization_recommendations():
    res = client.get("/commercialization/recommendations/1")
    assert res.status_code == 200
    data = res.json()
    assert "productization_recommendations" in data
    assert "licensing_opportunities" in data
    assert "startup_creation_recommendations" in data
    assert "industry_partnership_recommendations" in data
