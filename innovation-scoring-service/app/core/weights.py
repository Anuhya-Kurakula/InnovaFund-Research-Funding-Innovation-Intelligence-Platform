"""
Weights Configuration - Single Source of Truth
All primary pillar weights and derived scoring weights must sum to exactly 1.0.
"""

from typing import Dict

# 1. Primary Pillar Weights (must sum to exactly 1.0)
PRIMARY_PILLAR_WEIGHTS: Dict[str, float] = {
    "research_novelty": 0.30,
    "patent_strength": 0.20,
    "technology_maturity": 0.15,
    "market_potential": 0.20,
    "funding_relevance": 0.15,
}

# 2. Derived Sub-Score Weights (each must sum to exactly 1.0)
DERIVED_SCORE_WEIGHTS: Dict[str, Dict[str, float]] = {
    "innovation_potential": {
        "research_novelty": 0.45,
        "patent_strength": 0.30,
        "market_potential": 0.25,
    },
    "research_impact": {
        "research_novelty": 0.55,
        "patent_strength": 0.25,
        "funding_relevance": 0.20,
    },
    "technology_readiness": {
        "technology_maturity": 0.60,
        "patent_strength": 0.25,
        "market_potential": 0.15,
    },
    "commercial_viability": {
        "market_potential": 0.45,
        "technology_maturity": 0.30,
        "patent_strength": 0.25,
    },
    "funding_attractiveness": {
        "funding_relevance": 0.40,
        "research_novelty": 0.30,
        "market_potential": 0.30,
    },
}

def validate_weights() -> None:
    """Validates that all primary and derived sub-weights sum to exactly 1.0 within float tolerance."""
    primary_sum = sum(PRIMARY_PILLAR_WEIGHTS.values())
    if abs(primary_sum - 1.0) > 1e-6:
        raise ValueError(f"Primary pillar weights must sum to 1.0, got {primary_sum}")

    for derived_name, sub_weights in DERIVED_SCORE_WEIGHTS.items():
        sub_sum = sum(sub_weights.values())
        if abs(sub_sum - 1.0) > 1e-6:
            raise ValueError(f"Derived weights for '{derived_name}' must sum to 1.0, got {sub_sum}")

# Execute validation on import
validate_weights()
