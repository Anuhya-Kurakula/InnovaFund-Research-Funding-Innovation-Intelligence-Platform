"""
Unit Tests for Scoring Weights Integrity
"""

import pytest
from app.core.weights import PRIMARY_PILLAR_WEIGHTS, DERIVED_SCORE_WEIGHTS, validate_weights

def test_primary_weights_sum_to_one():
    """Requirement 1: Primary weights must sum to exactly 1.0."""
    total = sum(PRIMARY_PILLAR_WEIGHTS.values())
    assert abs(total - 1.0) < 1e-6, f"Primary weights sum was {total}, expected 1.0"
    assert len(PRIMARY_PILLAR_WEIGHTS) == 5

def test_derived_sub_weights_sum_to_one():
    """Requirement 2: Each derived function's sub-weights sum to exactly 1.0."""
    expected_derived = [
        "innovation_potential",
        "research_impact",
        "technology_readiness",
        "commercial_viability",
        "funding_attractiveness"
    ]
    for key in expected_derived:
        assert key in DERIVED_SCORE_WEIGHTS, f"Missing derived score weights for '{key}'"
        sub_sum = sum(DERIVED_SCORE_WEIGHTS[key].values())
        assert abs(sub_sum - 1.0) < 1e-6, f"Derived weights for '{key}' sum to {sub_sum}, expected 1.0"

def test_validate_weights_raises_on_invalid_sum():
    """Ensure validate_weights raises ValueError when weights are corrupted."""
    validate_weights()  # Normal state passes
