"""
Heuristic Signal Provider
Computes deterministic signals from raw bibliometric and patent metrics
(citations, claim count, family size, filing age) using tunable settings from config.
"""

from typing import Dict, Any, Optional
from app.providers.base import SignalProvider, SignalResult
from app.providers.local import LocalSignalProvider
from app.core.normalize import log_normalize, min_max, clamp
from app.config import settings

class HeuristicSignalProvider(SignalProvider):
    def __init__(self, fallback_provider: Optional[SignalProvider] = None):
        self.fallback_provider = fallback_provider or LocalSignalProvider()

    def get_patent_strength(self, project_id: str, raw_metrics: Optional[Dict[str, Any]] = None) -> SignalResult:
        if raw_metrics and any(k in raw_metrics for k in ("citation_count", "claim_count", "patent_family_size")):
            citations = float(raw_metrics.get("citation_count", 0))
            claims = float(raw_metrics.get("claim_count", 0))
            family_size = float(raw_metrics.get("patent_family_size", 0))

            # Citations (40%), Claims (30%), Family Size (30%)
            cit_score = log_normalize(citations, settings.MAX_CITATIONS)
            claim_score = min_max(claims, 1.0, settings.MAX_CLAIMS)
            fam_score = min_max(family_size, 1.0, settings.MAX_FAMILY_SIZE)

            score = 0.40 * cit_score + 0.30 * claim_score + 0.30 * fam_score
            return SignalResult(
                value=clamp(score, 0.0, 100.0),
                source="heuristic",
                confidence=0.85,
                is_fallback=False
            )

        # Fallback to local deterministic signals if raw metrics absent
        res = self.fallback_provider.get_patent_strength(project_id, raw_metrics)
        return res

    def get_technology_maturity(self, project_id: str, raw_metrics: Optional[Dict[str, Any]] = None) -> SignalResult:
        if raw_metrics and any(k in raw_metrics for k in ("years_since_filing", "citation_count")):
            years = float(raw_metrics.get("years_since_filing", 0))
            citations = float(raw_metrics.get("citation_count", 0))

            # Maturation curve over time (50%) + academic/industrial adoption signals (50%)
            age_score = min_max(years, 0.0, settings.MAX_FILING_YEARS)
            adoption_score = log_normalize(citations, settings.MAX_CITATIONS)

            score = 0.50 * age_score + 0.50 * adoption_score
            return SignalResult(
                value=clamp(score, 0.0, 100.0),
                source="heuristic",
                confidence=0.80,
                is_fallback=False
            )

        # Fallback to local deterministic signals
        res = self.fallback_provider.get_technology_maturity(project_id, raw_metrics)
        return res
