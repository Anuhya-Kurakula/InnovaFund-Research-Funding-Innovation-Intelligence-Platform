"""
HTTP Signal Provider
Calls teammate microservice endpoints with a strict 3-second timeout and automatic,
resilient fallback to LocalSignalProvider on ANY network failure, HTTP error, or timeout.
Never raises uncaught exceptions or returns 5xx to callers.
"""

import logging
import httpx
from typing import Dict, Any, Optional

from app.providers.base import SignalProvider, SignalResult
from app.providers.local import LocalSignalProvider
from app.config import settings

logger = logging.getLogger(__name__)

class HttpSignalProvider(SignalProvider):
    def __init__(self, fallback_provider: Optional[SignalProvider] = None):
        self.fallback_provider = fallback_provider or LocalSignalProvider()
        self.timeout = settings.HTTP_PROVIDER_TIMEOUT_SECONDS
        self.patent_api_url = settings.PATENT_API_URL.rstrip("/")
        self.tech_api_url = settings.TECH_API_URL.rstrip("/")

    def get_patent_strength(self, project_id: str, raw_metrics: Optional[Dict[str, Any]] = None) -> SignalResult:
        endpoint = f"{self.patent_api_url}/strength/{project_id}"
        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.get(endpoint)
                if response.status_code == 200:
                    data = response.json()
                    val = float(data.get("patent_strength", data.get("value", data.get("score", 0.0))))
                    return SignalResult(
                        value=val,
                        source="http_patent_api",
                        confidence=float(data.get("confidence", 0.95)),
                        is_fallback=False
                    )
                logger.warning(f"Patent API returned non-200 status {response.status_code} for {project_id}. Falling back to local.")
        except Exception as e:
            logger.info(f"Patent API call to {endpoint} failed gracefully ({type(e).__name__}). Utilizing local fallback.")

        # Seamless Fallback to local
        fallback_res = self.fallback_provider.get_patent_strength(project_id, raw_metrics)
        fallback_res.is_fallback = True
        return fallback_res

    def get_technology_maturity(self, project_id: str, raw_metrics: Optional[Dict[str, Any]] = None) -> SignalResult:
        endpoint = f"{self.tech_api_url}/maturity/{project_id}"
        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.get(endpoint)
                if response.status_code == 200:
                    data = response.json()
                    val = float(data.get("maturity_score", data.get("value", data.get("score", 0.0))))
                    return SignalResult(
                        value=val,
                        source="http_tech_api",
                        confidence=float(data.get("confidence", 0.95)),
                        is_fallback=False
                    )
                logger.warning(f"Tech Maturity API returned non-200 status {response.status_code} for {project_id}. Falling back to local.")
        except Exception as e:
            logger.info(f"Tech Maturity API call to {endpoint} failed gracefully ({type(e).__name__}). Utilizing local fallback.")

        # Seamless Fallback to local
        fallback_res = self.fallback_provider.get_technology_maturity(project_id, raw_metrics)
        fallback_res.is_fallback = True
        return fallback_res
