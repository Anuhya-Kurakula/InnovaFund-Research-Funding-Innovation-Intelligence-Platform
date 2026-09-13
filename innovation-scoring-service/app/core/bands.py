"""
Score Bands Classification
Maps numeric innovation scores (0-100) to qualitative evaluation bands.
"""

from typing import Dict, List

SCORE_BANDS: List[Dict[str, any]] = [
    {"name": "Very High", "min": 80.0, "max": 100.0, "color": "#10b981", "description": "Exceptional innovation with high market & patent maturity"},
    {"name": "High",      "min": 65.0, "max": 79.99, "color": "#0ea5e9", "description": "Strong innovation potential and robust scientific merit"},
    {"name": "Moderate",  "min": 50.0, "max": 64.99, "color": "#f59e0b", "description": "Viable research with moderate commercial or technical hurdles"},
    {"name": "Low",       "min": 35.0, "max": 49.99, "color": "#f97316", "description": "Early exploratory stage requiring significant maturation"},
    {"name": "Very Low",  "min": 0.0,  "max": 34.99, "color": "#ef4444", "description": "High risk or unproven baseline requiring conceptual refactoring"},
]

def get_score_band(score: float) -> str:
    """
    Returns the qualitative band name for a given score (0-100).
    Explicit boundary thresholds:
      score >= 80.0 -> 'Very High'
      score >= 65.0 -> 'High'
      score >= 50.0 -> 'Moderate'
      score >= 35.0 -> 'Low'
      score < 35.0  -> 'Very Low'
    """
    val = float(score)
    if val >= 80.0:
        return "Very High"
    elif val >= 65.0:
        return "High"
    elif val >= 50.0:
        return "Moderate"
    elif val >= 35.0:
        return "Low"
    else:
        return "Very Low"
