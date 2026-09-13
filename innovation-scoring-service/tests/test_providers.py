"""
Unit Tests for Signal Providers & Fallback Engine
"""

import pytest
from app.providers.local import LocalSignalProvider
from app.providers.heuristic import HeuristicSignalProvider
from app.providers.http import HttpSignalProvider
from app.providers.factory import get_signal_provider

def test_local_provider_deterministic_seed():
    """Requirement 10: Local provider fills signals and is_fallback is true."""
    provider = LocalSignalProvider()
    
    # Known project PRJ-007
    pat_res = provider.get_patent_strength("PRJ-007")
    assert pat_res.value == 66.5
    assert pat_res.source == "local_seed"
    assert pat_res.is_fallback is True
    
    tech_res = provider.get_technology_maturity("PRJ-007")
    assert tech_res.value == 58.0
    assert tech_res.source == "local_seed"
    assert tech_res.is_fallback is True

def test_local_provider_unknown_project():
    """Ensure graceful default when unknown project queried."""
    provider = LocalSignalProvider()
    pat_res = provider.get_patent_strength("PRJ-UNKNOWN-999")
    assert pat_res.value > 0.0
    assert pat_res.is_fallback is True

def test_heuristic_provider_with_raw_metrics():
    """Verify heuristic calculation from raw bibliometric fields."""
    provider = HeuristicSignalProvider()
    raw = {
        "citation_count": 150,
        "claim_count": 25,
        "patent_family_size": 10,
        "years_since_filing": 3.0
    }
    pat_res = provider.get_patent_strength("PRJ-CUSTOM", raw)
    assert 0.0 <= pat_res.value <= 100.0
    assert pat_res.source == "heuristic"
    assert pat_res.is_fallback is False

    tech_res = provider.get_technology_maturity("PRJ-CUSTOM", raw)
    assert 0.0 <= tech_res.value <= 100.0
    assert tech_res.source == "heuristic"
    assert tech_res.is_fallback is False

def test_http_provider_fallback_on_unreachable_host():
    """
    Requirement 11: SIGNAL_SOURCE=http with an unreachable host ->
    falls back to local, sets is_fallback: true, never raises exception.
    """
    provider = HttpSignalProvider()
    # Intentionally point to non-existent port
    provider.patent_api_url = "http://127.0.0.1:59999/api/patents"
    provider.tech_api_url = "http://127.0.0.1:59999/api/technology"

    pat_res = provider.get_patent_strength("PRJ-007")
    assert pat_res.value == 66.5
    assert pat_res.is_fallback is True

    tech_res = provider.get_technology_maturity("PRJ-007")
    assert tech_res.value == 58.0
    assert tech_res.is_fallback is True

def test_provider_factory_selection():
    """Test factory resolution for local, heuristic, and http."""
    local_p = get_signal_provider("local")
    assert isinstance(local_p, LocalSignalProvider)

    heur_p = get_signal_provider("heuristic")
    assert isinstance(heur_p, HeuristicSignalProvider)

    http_p = get_signal_provider("http")
    assert isinstance(http_p, HttpSignalProvider)
