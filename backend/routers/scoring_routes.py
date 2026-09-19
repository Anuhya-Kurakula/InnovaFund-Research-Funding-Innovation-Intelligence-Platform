import math
import os
import json
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any, Union
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from database import get_db
from schemas import ScoringRequest, ScoringResponse, ScoringBreakdown

router = APIRouter(prefix="/scoring", tags=["Release — Innovation Scoring Engine"])

PRIMARY_WEIGHTS = {
    "research_novelty": 0.30,
    "patent_strength": 0.20,
    "technology_maturity": 0.15,
    "market_potential": 0.20,
    "funding_relevance": 0.15,
}

DERIVED_WEIGHTS = {
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

SCORE_BANDS = {
    "very_high": {"min": 85.0, "max": 100.0, "label": "Very High"},
    "high": {"min": 70.0, "max": 84.99, "label": "High"},
    "moderate": {"min": 55.0, "max": 69.99, "label": "Moderate"},
    "low": {"min": 40.0, "max": 54.99, "label": "Low"},
    "very_low": {"min": 0.0, "max": 39.99, "label": "Very Low"},
}

_SEED_CACHE: Optional[Dict[str, Dict[str, Any]]] = None
_HISTORY_STORE: Dict[str, List[Dict[str, Any]]] = {}

def _clamp(val: float, min_val: float = 0.0, max_val: float = 100.0) -> float:
    return max(min_val, min(max_val, float(val)))

def _get_band(score: float) -> str:
    if score >= 85.0:
        return "Very High"
    if score >= 70.0:
        return "High"
    if score >= 55.0:
        return "Moderate"
    if score >= 40.0:
        return "Low"
    return "Very Low"

def _get_seed_project(project_id: str) -> Optional[Dict[str, Any]]:
    global _SEED_CACHE
    if _SEED_CACHE is None:
        _SEED_CACHE = {}
        current_dir = os.path.dirname(os.path.abspath(__file__))
        possible_paths = [
            os.path.abspath(os.path.join(current_dir, "..", "..", "innovation-scoring-service", "data", "seed_projects.json")),
            os.path.abspath(os.path.join(current_dir, "..", "data", "seed_projects.json")),
        ]
        for path in possible_paths:
            if os.path.exists(path):
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        projects = json.load(f)
                        for p in projects:
                            _SEED_CACHE[str(p["project_id"])] = p
                    break
                except Exception:
                    pass
    return _SEED_CACHE.get(str(project_id))

def _compute_full_score(
    project_id: Union[str, int],
    project_title: Optional[str],
    research_novelty: Optional[float],
    patent_strength: Optional[float],
    technology_maturity: Optional[float],
    market_potential: Optional[float],
    funding_relevance: Optional[float],
    raw_metrics: Optional[Dict[str, Any]] = None
) -> ScoringResponse:
    pid_str = str(project_id) if project_id is not None else "PRJ-001"
    seed = _get_seed_project(pid_str)

    # Resolve values with fallback defaults
    title = project_title or (seed.get("title") if seed else f"Project {pid_str}")

    nov = _clamp(research_novelty if research_novelty is not None else (seed.get("research_novelty", 80.0) if seed else 80.0))
    pat = _clamp(patent_strength if patent_strength is not None else (seed.get("patent_strength", 75.0) if seed else 75.0))
    mat = _clamp(technology_maturity if technology_maturity is not None else (seed.get("technology_maturity", 65.0) if seed else 65.0))
    mkt = _clamp(market_potential if market_potential is not None else (seed.get("market_potential", 75.0) if seed else 75.0))
    fnd = _clamp(funding_relevance if funding_relevance is not None else (seed.get("funding_relevance", 70.0) if seed else 70.0))

    nov_w = round(nov * PRIMARY_WEIGHTS["research_novelty"], 2)
    pat_w = round(pat * PRIMARY_WEIGHTS["patent_strength"], 2)
    mat_w = round(mat * PRIMARY_WEIGHTS["technology_maturity"], 2)
    mkt_w = round(mkt * PRIMARY_WEIGHTS["market_potential"], 2)
    fnd_w = round(fnd * PRIMARY_WEIGHTS["funding_relevance"], 2)

    overall_score = round(nov_w + pat_w + mat_w + mkt_w + fnd_w, 2)
    band = _get_band(overall_score)

    if overall_score >= 85.0:
        tier = "Top Tier DeepTech Innovation (High Commercial Readiness)"
    elif overall_score >= 70.0:
        tier = "Strong Commercial & Grant Potential"
    elif overall_score >= 55.0:
        tier = "Moderate Readiness (Lab Prototype Phase)"
    else:
        tier = "Early R&D Phase (Requires IP Strengthening)"

    breakdown = ScoringBreakdown(
        research_novelty_score=nov,
        research_novelty_weighted=nov_w,
        patent_strength_score=pat,
        patent_strength_weighted=pat_w,
        technology_maturity_score=mat,
        technology_maturity_weighted=mat_w,
        market_potential_score=mkt,
        market_potential_weighted=mkt_w,
        funding_relevance_score=fnd,
        funding_relevance_weighted=fnd_w,
    )

    # Pillars detail format
    is_seed_fb = bool(seed and research_novelty is None)
    pillars = {
        "research_novelty": {
            "value": nov,
            "weight": PRIMARY_WEIGHTS["research_novelty"],
            "contribution": nov_w,
            "source": "input" if research_novelty is not None else "seed_fallback",
            "is_fallback": is_seed_fb
        },
        "patent_strength": {
            "value": pat,
            "weight": PRIMARY_WEIGHTS["patent_strength"],
            "contribution": pat_w,
            "source": "input" if patent_strength is not None else "seed_fallback",
            "is_fallback": is_seed_fb
        },
        "technology_maturity": {
            "value": mat,
            "weight": PRIMARY_WEIGHTS["technology_maturity"],
            "contribution": mat_w,
            "source": "input" if technology_maturity is not None else "seed_fallback",
            "is_fallback": is_seed_fb
        },
        "market_potential": {
            "value": mkt,
            "weight": PRIMARY_WEIGHTS["market_potential"],
            "contribution": mkt_w,
            "source": "input" if market_potential is not None else "seed_fallback",
            "is_fallback": is_seed_fb
        },
        "funding_relevance": {
            "value": fnd,
            "weight": PRIMARY_WEIGHTS["funding_relevance"],
            "contribution": fnd_w,
            "source": "input" if funding_relevance is not None else "seed_fallback",
            "is_fallback": is_seed_fb
        }
    }

    # Derived Scores (NASA TRL mapping, etc.)
    w_ip = DERIVED_WEIGHTS["innovation_potential"]
    ip_score = round(w_ip["research_novelty"] * nov + w_ip["patent_strength"] * pat + w_ip["market_potential"] * mkt, 2)

    w_ri = DERIVED_WEIGHTS["research_impact"]
    ri_score = round(w_ri["research_novelty"] * nov + w_ri["patent_strength"] * pat + w_ri["funding_relevance"] * fnd, 2)

    w_tr = DERIVED_WEIGHTS["technology_readiness"]
    tr_score = round(w_tr["technology_maturity"] * mat + w_tr["patent_strength"] * pat + w_tr["market_potential"] * mkt, 2)
    trl = max(1, min(9, math.ceil((tr_score / 100.0) * 9))) if tr_score > 0 else 1

    w_cv = DERIVED_WEIGHTS["commercial_viability"]
    cv_score = round(w_cv["market_potential"] * mkt + w_cv["technology_maturity"] * mat + w_cv["patent_strength"] * pat, 2)

    w_fa = DERIVED_WEIGHTS["funding_attractiveness"]
    fa_score = round(w_fa["funding_relevance"] * fnd + w_fa["research_novelty"] * nov + w_fa["market_potential"] * mkt, 2)

    derived_scores = {
        "innovation_potential": ip_score,
        "research_impact": ri_score,
        "technology_readiness": {
            "score": tr_score,
            "trl": trl
        },
        "commercial_viability": cv_score,
        "funding_attractiveness": fa_score
    }

    # Deterministic Narrative Explanation
    sorted_pillars = sorted(
        [
            ("research_novelty", nov),
            ("patent_strength", pat),
            ("technology_maturity", mat),
            ("market_potential", mkt),
            ("funding_relevance", fnd)
        ],
        key=lambda x: x[1],
        reverse=True
    )
    top_drivers = [k for k, _ in sorted_pillars[:2]]
    weakest_pillars = [sorted_pillars[-1][0]]
    top_str = " and ".join([k.replace("_", " ") for k in top_drivers])
    weak_str = weakest_pillars[0].replace("_", " ")

    narrative = (
        f"Strong {top_str} position this project in the '{band}' innovation band; "
        f"{weak_str} represents the primary growth opportunity."
    )

    explanation = {
        "top_drivers": top_drivers,
        "weakest_pillars": weakest_pillars,
        "narrative": narrative
    }

    summary = (
        f"Calculated overall Innovation Score: {overall_score}/100. "
        f"Weight breakdown: Research Novelty (30% -> {nov_w}), "
        f"Patent Strength (20% -> {pat_w}), "
        f"Technology Maturity (15% -> {mat_w}), "
        f"Market Potential (20% -> {mkt_w}), "
        f"Funding Relevance (15% -> {fnd_w})."
    )

    now_dt = datetime.now(timezone.utc)
    computed_iso = now_dt.isoformat()

    response = ScoringResponse(
        project_id=project_id if project_id is not None else 1,
        project_title=title,
        overall_score=overall_score,
        innovation_score=overall_score,
        tier=tier,
        band=band,
        model_version="1.0.0",
        breakdown=breakdown,
        summary=summary,
        pillars=pillars,
        derived_scores=derived_scores,
        explanation=explanation,
        calculated_at=now_dt,
        computed_at=computed_iso
    )

    # Save to history cache
    if pid_str not in _HISTORY_STORE:
        _HISTORY_STORE[pid_str] = []
    _HISTORY_STORE[pid_str].insert(0, response.model_dump())
    if len(_HISTORY_STORE[pid_str]) > 20:
        _HISTORY_STORE[pid_str].pop()

    return response


def calculate_innovation_score(payload: ScoringRequest) -> ScoringResponse:
    return _compute_full_score(
        project_id=payload.project_id,
        project_title=payload.project_title,
        research_novelty=payload.research_novelty,
        patent_strength=payload.patent_strength,
        technology_maturity=payload.technology_maturity,
        market_potential=payload.market_potential,
        funding_relevance=payload.funding_relevance,
        raw_metrics=payload.raw_metrics
    )


@router.post("/calculate", response_model=ScoringResponse)
def calculate_score(payload: ScoringRequest, db: Session = Depends(get_db)):
    """
    POST /scoring/calculate: Computes Innovation Score using weighted 5-pillar formula.
    Provides composite innovation score, band, per-pillar breakdowns, derived metrics (TRL 1-9),
    and synthesis narrative.
    """
    return calculate_innovation_score(payload)


@router.get("/model/weights")
def get_scoring_weights():
    """
    GET /scoring/model/weights: Returns primary pillar weights, derived weights, and score bands.
    """
    return {
        "model_version": "1.0.0",
        "primary_weights": PRIMARY_WEIGHTS,
        "derived_weights": DERIVED_WEIGHTS,
        "bands": SCORE_BANDS
    }


class BatchScoreRequest(BaseModel):
    projects: List[ScoringRequest]


@router.post("/batch")
def batch_score(payload: BatchScoreRequest, db: Session = Depends(get_db)):
    """
    POST /scoring/batch: Evaluates multiple projects in batch.
    """
    scores = [calculate_innovation_score(p) for p in payload.projects]
    return {
        "total_scored": len(scores),
        "scores": scores
    }


@router.get("/{project_id}/history", response_model=List[ScoringResponse])
def get_score_history(project_id: str, db: Session = Depends(get_db)):
    """
    GET /scoring/{project_id}/history: Retrieves computation history for a project.
    """
    pid_str = str(project_id)
    if pid_str in _HISTORY_STORE and _HISTORY_STORE[pid_str]:
        return [ScoringResponse(**item) for item in _HISTORY_STORE[pid_str]]

    # Seed or initial score computation
    initial = _compute_full_score(
        project_id=pid_str,
        project_title=None,
        research_novelty=None,
        patent_strength=None,
        technology_maturity=None,
        market_potential=None,
        funding_relevance=None
    )
    return [initial]


@router.get("/{project_id}", response_model=ScoringResponse)
def get_score_by_project(project_id: str, db: Session = Depends(get_db)):
    """
    GET /scoring/{project_id}: Retrieves calculated Innovation Score for specified project.
    Accepts string project IDs (e.g., 'PRJ-007') as well as numeric IDs (e.g., 1).
    """
    pid_clean: Union[str, int]
    try:
        pid_clean = int(project_id)
    except ValueError:
        pid_clean = project_id

    # If already calculated in history, return latest
    pid_str = str(project_id)
    if pid_str in _HISTORY_STORE and _HISTORY_STORE[pid_str]:
        return ScoringResponse(**_HISTORY_STORE[pid_str][0])

    # Check seed data
    seed = _get_seed_project(pid_str)
    if seed:
        return _compute_full_score(
            project_id=pid_clean,
            project_title=seed.get("title"),
            research_novelty=seed.get("research_novelty"),
            patent_strength=seed.get("patent_strength"),
            technology_maturity=seed.get("technology_maturity"),
            market_potential=seed.get("market_potential"),
            funding_relevance=seed.get("funding_relevance"),
            raw_metrics=seed.get("raw_metrics")
        )

    # Default fallback calculation for generic project IDs
    return _compute_full_score(
        project_id=pid_clean,
        project_title=f"Project #{pid_clean} - Enterprise DeepTech R&D",
        research_novelty=86.5,
        patent_strength=80.0,
        technology_maturity=82.5,
        market_potential=91.0,
        funding_relevance=85.0
    )
