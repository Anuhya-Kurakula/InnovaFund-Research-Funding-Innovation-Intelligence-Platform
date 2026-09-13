"""
Unit Tests for Derived Scores, TRL Mapping, and Qualitative Bands
"""

import pytest
from app.core.scoring import calculate_trl, calculate_derived_scores, generate_explanation
from app.core.bands import get_score_band

def test_trl_mapping_exact_values():
    """Requirement 7: TRL mapping: score 0.1 -> TRL 1; score 100 -> TRL 9; score 55 -> TRL 5."""
    assert calculate_trl(0.1) == 1
    assert calculate_trl(0.0) == 1
    assert calculate_trl(11.1) == 1
    assert calculate_trl(11.2) == 2
    assert calculate_trl(55.0) == 5
    assert calculate_trl(88.9) == 9
    assert calculate_trl(100.0) == 9

def test_score_band_boundaries():
    """
    Requirement 8: Band boundaries at 34.99 / 35 / 64.99 / 65 / 79.99 / 80.
    """
    assert get_score_band(34.99) == "Very Low"
    assert get_score_band(35.0) == "Low"
    assert get_score_band(49.99) == "Low"
    assert get_score_band(50.0) == "Moderate"
    assert get_score_band(64.99) == "Moderate"
    assert get_score_band(65.0) == "High"
    assert get_score_band(79.99) == "High"
    assert get_score_band(80.0) == "Very High"
    assert get_score_band(100.0) == "Very High"

def test_derived_scores_formula_precision():
    """Verify derived score calculations on known inputs."""
    pillars = {
        "research_novelty": 80.0,
        "patent_strength": 60.0,
        "technology_maturity": 70.0,
        "market_potential": 90.0,
        "funding_relevance": 50.0
    }
    derived = calculate_derived_scores(pillars)
    
    # innovation_potential: 0.45*80 + 0.30*60 + 0.25*90 = 36 + 18 + 22.5 = 76.5
    assert derived["innovation_potential"] == 76.50
    # research_impact: 0.55*80 + 0.25*60 + 0.20*50 = 44 + 15 + 10 = 69.0
    assert derived["research_impact"] == 69.00
    # technology_readiness: 0.60*70 + 0.25*60 + 0.15*90 = 42 + 15 + 13.5 = 70.5
    assert derived["technology_readiness"]["score"] == 70.50
    assert derived["technology_readiness"]["trl"] == 7
    # commercial_viability: 0.45*90 + 0.30*70 + 0.25*60 = 40.5 + 21 + 15 = 76.5
    assert derived["commercial_viability"] == 76.50
    # funding_attractiveness: 0.40*50 + 0.30*80 + 0.30*90 = 20 + 24 + 27 = 71.0
    assert derived["funding_attractiveness"] == 71.00

def test_explanation_generation():
    """Verify top drivers, weakest pillars and narrative generation."""
    pillars = {
        "research_novelty": 90.0,
        "patent_strength": 80.0,
        "technology_maturity": 40.0,
        "market_potential": 85.0,
        "funding_relevance": 70.0
    }
    explanation = generate_explanation(pillars, 77.5)
    assert "research_novelty" in explanation["top_drivers"]
    assert "technology_maturity" in explanation["weakest_pillars"]
    assert "High" in explanation["narrative"]
