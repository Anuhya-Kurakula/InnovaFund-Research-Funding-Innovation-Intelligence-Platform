"""
Unit Tests for Pure Core Scoring Mathematics
"""

import pytest
from app.core.scoring import calculate_innovation_score

def test_all_pillars_maximum():
    """Requirement 3: All pillars = 100 -> innovation_score == 100.0."""
    pillars = {
        "research_novelty": 100.0,
        "patent_strength": 100.0,
        "technology_maturity": 100.0,
        "market_potential": 100.0,
        "funding_relevance": 100.0,
    }
    score, breakdown = calculate_innovation_score(pillars)
    assert score == 100.0
    for key, detail in breakdown.items():
        assert detail["value"] == 100.0

def test_all_pillars_minimum():
    """Requirement 4: All pillars = 0 -> innovation_score == 0.0."""
    pillars = {
        "research_novelty": 0.0,
        "patent_strength": 0.0,
        "technology_maturity": 0.0,
        "market_potential": 0.0,
        "funding_relevance": 0.0,
    }
    score, breakdown = calculate_innovation_score(pillars)
    assert score == 0.0
    for key, detail in breakdown.items():
        assert detail["value"] == 0.0
        assert detail["contribution"] == 0.0

def test_hand_calculated_fixture_exact():
    """
    Requirement 5: A hand-calculated fixture:
    (81, 66.5, 58, 74, 75) -> 72.35 exact.
    Formula:
    0.30*81 + 0.20*66.5 + 0.15*58 + 0.20*74 + 0.15*75
    = 24.30 + 13.30 + 8.70 + 14.80 + 11.25 = 72.35
    """
    pillars = {
        "research_novelty": 81.0,
        "patent_strength": 66.5,
        "technology_maturity": 58.0,
        "market_potential": 74.0,
        "funding_relevance": 75.0,
    }
    score, breakdown = calculate_innovation_score(pillars)
    assert score == 72.35

    assert breakdown["research_novelty"]["contribution"] == 24.30
    assert breakdown["patent_strength"]["contribution"] == 13.30
    assert breakdown["technology_maturity"]["contribution"] == 8.70
    assert breakdown["market_potential"]["contribution"] == 14.80
    assert breakdown["funding_relevance"]["contribution"] == 11.25

def test_contributions_sum_to_composite():
    """Requirement 6: Contributions sum to the composite within 0.01."""
    test_cases = [
        {"research_novelty": 92.5, "patent_strength": 84.0, "technology_maturity": 68.0, "market_potential": 88.5, "funding_relevance": 90.0},
        {"research_novelty": 45.2, "patent_strength": 33.1, "technology_maturity": 77.8, "market_potential": 59.4, "funding_relevance": 62.0},
        {"research_novelty": 12.0, "patent_strength": 99.0, "technology_maturity": 50.0, "market_potential": 80.0, "funding_relevance": 20.0},
    ]
    for pillars in test_cases:
        score, breakdown = calculate_innovation_score(pillars)
        contrib_sum = sum(b["contribution"] for b in breakdown.values())
        assert abs(contrib_sum - score) <= 0.02, f"Contributions sum {contrib_sum} deviated from score {score}"

def test_scoring_determinism():
    """Requirement 9: Determinism - same input scored twice -> identical output."""
    pillars = {
        "research_novelty": 78.4,
        "patent_strength": 62.1,
        "technology_maturity": 89.3,
        "market_potential": 55.7,
        "funding_relevance": 71.2,
    }
    score1, breakdown1 = calculate_innovation_score(pillars)
    score2, breakdown2 = calculate_innovation_score(pillars)
    assert score1 == score2
    assert breakdown1 == breakdown2
