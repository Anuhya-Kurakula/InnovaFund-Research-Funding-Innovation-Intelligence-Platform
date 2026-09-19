"""
Signal Provider Factory
Selects and initializes the appropriate SignalProvider based on environment configuration.
"""

from typing import Optional
from app.providers.base import SignalProvider
from app.providers.local import LocalSignalProvider
from app.providers.heuristic import HeuristicSignalProvider
from app.providers.http import HttpSignalProvider
from app.config import settings

def get_signal_provider(source_override: Optional[str] = None) -> SignalProvider:
    """
    Factory function returning the configured SignalProvider instance.
    Source can be overridden dynamically for testing or specific requests.
    """
    source = (source_override or settings.SIGNAL_SOURCE).lower().strip()
    
    if source == "http":
        return HttpSignalProvider()
    elif source == "heuristic":
        return HeuristicSignalProvider()
    elif source == "local":
        return LocalSignalProvider()
    else:
        # Fallback to local deterministic provider
        return LocalSignalProvider()
