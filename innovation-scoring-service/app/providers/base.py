"""
Base Signal Provider Interface & Data Models
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional, Dict, Any

@dataclass
class SignalResult:
    """
    Standard envelope returned by all signal providers.
    - value: Float score normalized between 0.0 and 100.0.
    - source: String descriptor (e.g., 'local_seed', 'heuristic', 'http_patent_api', 'default_fallback').
    - confidence: Confidence level between 0.0 and 1.0.
    - is_fallback: Boolean flag set to True whenever synthetic/seeded fallback values are used.
    """
    value: float
    source: str
    confidence: float = 1.0
    is_fallback: bool = False

    def to_dict(self) -> Dict[str, Any]:
        return {
            "value": round(self.value, 2),
            "source": self.source,
            "confidence": round(self.confidence, 2),
            "is_fallback": self.is_fallback
        }

class SignalProvider(ABC):
    """
    Abstract Base Class for external signal providers.
    Provides decoupled resolution for Patent Strength and Technology Maturity signals.
    """

    @abstractmethod
    def get_patent_strength(self, project_id: str, raw_metrics: Optional[Dict[str, Any]] = None) -> SignalResult:
        """Resolves Patent Strength (0-100) for a given project."""
        pass

    @abstractmethod
    def get_technology_maturity(self, project_id: str, raw_metrics: Optional[Dict[str, Any]] = None) -> SignalResult:
        """Resolves Technology Maturity (0-100) for a given project."""
        pass
