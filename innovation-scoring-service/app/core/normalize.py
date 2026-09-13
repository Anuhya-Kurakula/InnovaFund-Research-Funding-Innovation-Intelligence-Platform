"""
Normalization Helpers
Provides deterministic scaling functions for numerical raw fields.
"""

import math

def clamp(value: float, min_val: float = 0.0, max_val: float = 100.0) -> float:
    """Clamps a numeric value strictly within [min_val, max_val]."""
    return max(min_val, min(float(value), max_val))

def min_max(value: float, lo: float, hi: float) -> float:
    """
    Linearly scales value between lo and hi to a [0.0, 100.0] score.
    If hi <= lo, returns 50.0 as safe midpoint.
    """
    if hi <= lo:
        return 50.0
    scaled = ((float(value) - lo) / (hi - lo)) * 100.0
    return clamp(scaled, 0.0, 100.0)

def log_normalize(value: float, cap: float) -> float:
    """
    Logarithmically scales long-tailed counts (citations, patent claims) up to a defined cap.
    Formula: (ln(1 + value) / ln(1 + cap)) * 100.0
    """
    if cap <= 0:
        return 0.0
    val_clamped = max(0.0, float(value))
    scaled = (math.log1p(val_clamped) / math.log1p(cap)) * 100.0
    return clamp(scaled, 0.0, 100.0)
