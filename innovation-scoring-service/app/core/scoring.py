"""
Pure Core Scoring Functions
Implements the mathematical models for innovation score, derived sub-scores, TRL mapping,
and explanation generation. Contains NO I/O, database, or network operations.
"""

import math
from typing import Dict, List, Tuple, Any

from app.core.weights import PRIMARY_PILLAR_WEIGHTS, DERIVED_SCORE_WEIGHTS
from app.core.bands import get_score_band
from app.core.normalize import clamp

def calculate_trl(readiness_score: float) -> int:
    """
    Maps technology readiness score (0-100) to TRL level (1-9).
    Formula: clamp(ceil(score / 100 * 9), 1, 9)
    """
    if readiness_score <= 0:
        return 1
    trl_raw = math.ceil((readiness_score / 100.0) * 9)
    return int(clamp(trl_raw, 1, 9))

def calculate_innovation_score(pillars: Dict[str, float]) -> Tuple[float, Dict[str, Dict[str, float]]]:
    """
    Calculates the primary composite innovation score and per-pillar breakdown.
    Returns:
      (composite_score_rounded_2dp, pillar_breakdown)
    """
    breakdown = {}
    total_score = 0.0

    for key, weight in PRIMARY_PILLAR_WEIGHTS.items():
        val = clamp(float(pillars.get(key, 0.0)), 0.0, 100.0)
        contribution = round(val * weight, 2)
        total_score += val * weight
        breakdown[key] = {
            "value": round(val, 2),
            "weight": weight,
            "contribution": contribution
        }

    composite_score = round(total_score, 2)
    return composite_score, breakdown

def calculate_derived_scores(pillars: Dict[str, float]) -> Dict[str, Any]:
    """
    Calculates the 5 specialized derived scores and TRL mapping.
    """
    novelty = clamp(float(pillars.get("research_novelty", 0.0)), 0.0, 100.0)
    patent = clamp(float(pillars.get("patent_strength", 0.0)), 0.0, 100.0)
    maturity = clamp(float(pillars.get("technology_maturity", 0.0)), 0.0, 100.0)
    market = clamp(float(pillars.get("market_potential", 0.0)), 0.0, 100.0)
    funding = clamp(float(pillars.get("funding_relevance", 0.0)), 0.0, 100.0)

    # 1. Innovation Potential: 0.45*novelty + 0.30*patent + 0.25*market
    w_ip = DERIVED_SCORE_WEIGHTS["innovation_potential"]
    ip_score = round(
        w_ip["research_novelty"] * novelty +
        w_ip["patent_strength"] * patent +
        w_ip["market_potential"] * market,
        2
    )

    # 2. Research Impact: 0.55*novelty + 0.25*patent + 0.20*funding
    w_ri = DERIVED_SCORE_WEIGHTS["research_impact"]
    ri_score = round(
        w_ri["research_novelty"] * novelty +
        w_ri["patent_strength"] * patent +
        w_ri["funding_relevance"] * funding,
        2
    )

    # 3. Technology Readiness: 0.60*maturity + 0.25*patent + 0.15*market
    w_tr = DERIVED_SCORE_WEIGHTS["technology_readiness"]
    tr_score = round(
        w_tr["technology_maturity"] * maturity +
        w_tr["patent_strength"] * patent +
        w_tr["market_potential"] * market,
        2
    )
    trl_level = calculate_trl(tr_score)

    # 4. Commercial Viability: 0.45*market + 0.30*maturity + 0.25*patent
    w_cv = DERIVED_SCORE_WEIGHTS["commercial_viability"]
    cv_score = round(
        w_cv["market_potential"] * market +
        w_cv["technology_maturity"] * maturity +
        w_cv["patent_strength"] * patent,
        2
    )

    # 5. Funding Attractiveness: 0.40*funding + 0.30*novelty + 0.30*market
    w_fa = DERIVED_SCORE_WEIGHTS["funding_attractiveness"]
    fa_score = round(
        w_fa["funding_relevance"] * funding +
        w_fa["research_novelty"] * novelty +
        w_fa["market_potential"] * market,
        2
    )

    return {
        "innovation_potential": ip_score,
        "research_impact": ri_score,
        "technology_readiness": {
            "score": tr_score,
            "trl": trl_level
        },
        "commercial_viability": cv_score,
        "funding_attractiveness": fa_score
    }

def generate_explanation(pillars: Dict[str, float], composite_score: float) -> Dict[str, Any]:
    """
    Generates deterministic explanation identifying top driving pillars, weakest pillars,
    and a cohesive human-readable narrative.
    """
    # Sort pillars by value descending
    sorted_by_val = sorted(
        [(k, clamp(float(v), 0.0, 100.0)) for k, v in pillars.items() if k in PRIMARY_PILLAR_WEIGHTS],
        key=lambda x: x[1],
        reverse=True
    )

    if not sorted_by_val:
        top_drivers = ["research_novelty", "market_potential"]
        weakest = ["technology_maturity"]
    else:
        top_drivers = [k for k, _ in sorted_by_val[:2]]
        weakest = [sorted_by_val[-1][0]]

    # Format human-friendly labels
    def format_label(key: str) -> str:
        return key.replace("_", " ")

    top_str = " and ".join([format_label(k) for k in top_drivers])
    weak_str = format_label(weakest[0]) if weakest else "none"

    band = get_score_band(composite_score)
    narrative = (
        f"Strong {top_str} position this project in the '{band}' innovation band; "
        f"{weak_str} represents the primary growth opportunity."
    )

    return {
        "top_drivers": top_drivers,
        "weakest_pillars": weakest,
        "narrative": narrative
    }
