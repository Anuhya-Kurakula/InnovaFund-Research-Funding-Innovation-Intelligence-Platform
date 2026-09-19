"""
Local Deterministic Signal Provider
Reads patent strength and technology maturity from data/seed_signals.json without network I/O.
"""

import json
import os
from typing import Dict, Any, Optional
from app.providers.base import SignalProvider, SignalResult

class LocalSignalProvider(SignalProvider):
    def __init__(self, seed_file_path: Optional[str] = None):
        if seed_file_path is None:
            # Resolve relative to project root / data directory
            current_dir = os.path.dirname(os.path.abspath(__file__))
            seed_file_path = os.path.abspath(os.path.join(current_dir, "..", "..", "data", "seed_signals.json"))
        
        self.seed_file_path = seed_file_path
        self._signals: Dict[str, Dict[str, Any]] = {}
        self._load_seed_data()

    def _load_seed_data(self) -> None:
        if os.path.exists(self.seed_file_path):
            try:
                with open(self.seed_file_path, "r", encoding="utf-8") as f:
                    self._signals = json.load(f)
            except Exception:
                self._signals = {}
        else:
            self._signals = {}

    def get_patent_strength(self, project_id: str, raw_metrics: Optional[Dict[str, Any]] = None) -> SignalResult:
        if project_id in self._signals and "patent_strength" in self._signals[project_id]:
            item = self._signals[project_id]
            return SignalResult(
                value=float(item["patent_strength"]),
                source="local_seed",
                confidence=float(item.get("confidence", 0.90)),
                is_fallback=True
            )
        return SignalResult(
            value=65.0,
            source="local_seed_default",
            confidence=0.70,
            is_fallback=True
        )

    def get_technology_maturity(self, project_id: str, raw_metrics: Optional[Dict[str, Any]] = None) -> SignalResult:
        if project_id in self._signals and "technology_maturity" in self._signals[project_id]:
            item = self._signals[project_id]
            return SignalResult(
                value=float(item["technology_maturity"]),
                source="local_seed",
                confidence=float(item.get("confidence", 0.90)),
                is_fallback=True
            )
        return SignalResult(
            value=60.0,
            source="local_seed_default",
            confidence=0.70,
            is_fallback=True
        )
