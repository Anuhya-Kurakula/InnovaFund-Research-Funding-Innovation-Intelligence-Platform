"""
API Router for Innovation Scoring Endpoints
"""

import asyncio
from datetime import datetime, timezone
import json
import os
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.config import settings
from app.db.session import get_db
from app.db.crud import (
    save_score_history,
    get_latest_score,
    get_score_history,
    get_project_input
)
from app.core.weights import PRIMARY_PILLAR_WEIGHTS, DERIVED_SCORE_WEIGHTS
from app.core.bands import SCORE_BANDS, get_score_band
from app.core.scoring import (
    calculate_innovation_score,
    calculate_derived_scores,
    generate_explanation
)
from app.providers.factory import get_signal_provider
from app.schemas.scoring import (
    ScoreRequest,
    ScoreResponse,
    BatchScoreRequest,
    BatchScoreResponse,
    WeightsConfigResponse,
    PillarDetail,
    DerivedScores,
    DerivedReadiness,
    ExplanationDetail
)

router = APIRouter(
    prefix=settings.API_PREFIX,
    tags=["Innovation Scoring Engine (Member 4)"]
)

# In-memory cache for seed project baseline values
_SEED_PROJECTS_CACHE: Optional[Dict[str, Dict[str, Any]]] = None

def _get_seed_project_defaults(project_id: str) -> Optional[Dict[str, Any]]:
    global _SEED_PROJECTS_CACHE
    if _SEED_PROJECTS_CACHE is None:
        _SEED_PROJECTS_CACHE = {}
        current_dir = os.path.dirname(os.path.abspath(__file__))
        seed_path = os.path.abspath(os.path.join(current_dir, "..", "..", "data", "seed_projects.json"))
        if os.path.exists(seed_path):
            try:
                with open(seed_path, "r", encoding="utf-8") as f:
                    projects = json.load(f)
                    for p in projects:
                        _SEED_PROJECTS_CACHE[p["project_id"]] = p
            except Exception:
                pass
    return _SEED_PROJECTS_CACHE.get(project_id)

def _process_score_calculation(payload: ScoreRequest, db: Optional[Session] = None) -> ScoreResponse:
    project_id = payload.project_id or "PRJ-CUSTOM"
    seed_data = _get_seed_project_defaults(project_id)
    raw_metrics_dict = payload.raw_metrics.model_dump() if payload.raw_metrics else (seed_data.get("raw_metrics") if seed_data else None)

    provider = get_signal_provider()

    # 1. Resolve Research Novelty
    if payload.research_novelty is not None:
        nov_val, nov_src, nov_fallback = float(payload.research_novelty), "input", False
    elif seed_data and "research_novelty" in seed_data:
        nov_val, nov_src, nov_fallback = float(seed_data["research_novelty"]), "local_seed", True
    else:
        nov_val, nov_src, nov_fallback = 65.0, "default_fallback", True

    # 2. Resolve Patent Strength
    if payload.patent_strength is not None:
        pat_val, pat_src, pat_fallback = float(payload.patent_strength), "input", False
    else:
        res = provider.get_patent_strength(project_id, raw_metrics_dict)
        pat_val, pat_src, pat_fallback = res.value, res.source, res.is_fallback

    # 3. Resolve Technology Maturity
    if payload.technology_maturity is not None:
        mat_val, mat_src, mat_fallback = float(payload.technology_maturity), "input", False
    else:
        res = provider.get_technology_maturity(project_id, raw_metrics_dict)
        mat_val, mat_src, mat_fallback = res.value, res.source, res.is_fallback

    # 4. Resolve Market Potential
    if payload.market_potential is not None:
        mkt_val, mkt_src, mkt_fallback = float(payload.market_potential), "input", False
    elif seed_data and "market_potential" in seed_data:
        mkt_val, mkt_src, mkt_fallback = float(seed_data["market_potential"]), "local_seed", True
    else:
        mkt_val, mkt_src, mkt_fallback = 60.0, "default_fallback", True

    # 5. Resolve Funding Relevance
    if payload.funding_relevance is not None:
        fnd_val, fnd_src, fnd_fallback = float(payload.funding_relevance), "input", False
    elif seed_data and "funding_relevance" in seed_data:
        fnd_val, fnd_src, fnd_fallback = float(seed_data["funding_relevance"]), "local_seed", True
    else:
        fnd_val, fnd_src, fnd_fallback = 65.0, "default_fallback", True

    pillars_raw = {
        "research_novelty": nov_val,
        "patent_strength": pat_val,
        "technology_maturity": mat_val,
        "market_potential": mkt_val,
        "funding_relevance": fnd_val
    }

    # Core Mathematical Calculations
    composite_score, breakdown = calculate_innovation_score(pillars_raw)
    derived_data = calculate_derived_scores(pillars_raw)
    band = get_score_band(composite_score)
    explanation_data = generate_explanation(pillars_raw, composite_score)

    # Detailed Pillar Metadata Assembly
    sources = {
        "research_novelty": (nov_src, nov_fallback),
        "patent_strength": (pat_src, pat_fallback),
        "technology_maturity": (mat_src, mat_fallback),
        "market_potential": (mkt_src, mkt_fallback),
        "funding_relevance": (fnd_src, fnd_fallback)
    }

    pillars_response = {}
    for key, info in breakdown.items():
        src, is_fb = sources[key]
        pillars_response[key] = PillarDetail(
            value=info["value"],
            weight=info["weight"],
            contribution=info["contribution"],
            source=src,
            is_fallback=is_fb
        )

    computed_iso = datetime.now(timezone.utc).isoformat()

    # Persist to Database if session provided
    if db is not None:
        try:
            save_score_history(
                db=db,
                project_id=project_id,
                model_version=settings.MODEL_VERSION,
                innovation_score=composite_score,
                band=band,
                pillars={k: v.model_dump() for k, v in pillars_response.items()},
                derived_scores=derived_data,
                explanation=explanation_data
            )
        except Exception:
            if hasattr(db, "rollback"):
                db.rollback()

    return ScoreResponse(
        project_id=project_id,
        model_version=settings.MODEL_VERSION,
        innovation_score=composite_score,
        band=band,
        pillars=pillars_response,
        derived_scores=DerivedScores(
            innovation_potential=derived_data["innovation_potential"],
            research_impact=derived_data["research_impact"],
            technology_readiness=DerivedReadiness(
                score=derived_data["technology_readiness"]["score"],
                trl=derived_data["technology_readiness"]["trl"]
            ),
            commercial_viability=derived_data["commercial_viability"],
            funding_attractiveness=derived_data["funding_attractiveness"]
        ),
        explanation=ExplanationDetail(
            top_drivers=explanation_data["top_drivers"],
            weakest_pillars=explanation_data["weakest_pillars"],
            narrative=explanation_data["narrative"]
        ),
        computed_at=computed_iso
    )


@router.post("/calculate", response_model=ScoreResponse, summary="Compute & Persist Innovation Score")
def calculate_score(
    payload: ScoreRequest,
    db: Session = Depends(get_db)
):
    """
    Computes and stores a comprehensive 5-pillar composite innovation score.
    Accepts full inline values, raw bibliometric fields, or a simple `project_id`.
    Zero external dependencies required.
    """
    return _process_score_calculation(payload, db=db)


@router.get("/model/weights", response_model=WeightsConfigResponse, summary="Retrieve Scoring Weights & Bands Configuration")
def get_model_weights():
    """
    Returns active scoring model weights, derived formulas coefficients, and qualitative score bands.
    Allows frontend clients to dynamically render breakdown charts without hardcoded values.
    """
    return WeightsConfigResponse(
        model_version=settings.MODEL_VERSION,
        primary_weights=PRIMARY_PILLAR_WEIGHTS,
        derived_weights=DERIVED_SCORE_WEIGHTS,
        bands=SCORE_BANDS
    )


@router.get("/{project_id}", response_model=ScoreResponse, summary="Get Latest Score for Project")
def get_project_score(
    project_id: str,
    db: Session = Depends(get_db)
):
    """
    Fetches the most recently computed innovation score for a project.
    Returns HTTP 404 if no score exists.
    """
    record = get_latest_score(db, project_id)
    if not record:
        # Check if project exists in seed dataset, auto-score and return if present
        seed_data = _get_seed_project_defaults(project_id)
        if seed_data:
            req = ScoreRequest(project_id=project_id)
            return _process_score_calculation(req, db=db)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No innovation score found for project '{project_id}'."
        )

    # Convert persisted DB record to ScoreResponse
    return ScoreResponse(
        project_id=record.project_id,
        model_version=record.model_version,
        innovation_score=record.innovation_score,
        band=record.band,
        pillars={k: PillarDetail(**v) for k, v in record.pillars.items()},
        derived_scores=DerivedScores(
            innovation_potential=record.derived_scores["innovation_potential"],
            research_impact=record.derived_scores["research_impact"],
            technology_readiness=DerivedReadiness(
                score=record.derived_scores["technology_readiness"]["score"],
                trl=record.derived_scores["technology_readiness"]["trl"]
            ),
            commercial_viability=record.derived_scores["commercial_viability"],
            funding_attractiveness=record.derived_scores["funding_attractiveness"]
        ),
        explanation=ExplanationDetail(
            top_drivers=record.explanation["top_drivers"],
            weakest_pillars=record.explanation["weakest_pillars"],
            narrative=record.explanation["narrative"]
        ),
        computed_at=record.computed_at.isoformat() if hasattr(record.computed_at, "isoformat") else str(record.computed_at)
    )


@router.get("/{project_id}/history", response_model=List[ScoreResponse], summary="Get Historical Scores for Project")
def get_project_score_history(
    project_id: str,
    db: Session = Depends(get_db)
):
    """
    Returns full chronological computation history for a project, newest first.
    """
    records = get_score_history(db, project_id)
    if not records:
        # If no records exist but project is a seed project, calculate first score
        seed_data = _get_seed_project_defaults(project_id)
        if seed_data:
            first_score = _process_score_calculation(ScoreRequest(project_id=project_id), db=db)
            return [first_score]
        return []

    return [
        ScoreResponse(
            project_id=r.project_id,
            model_version=r.model_version,
            innovation_score=r.innovation_score,
            band=r.band,
            pillars={k: PillarDetail(**v) for k, v in r.pillars.items()},
            derived_scores=DerivedScores(
                innovation_potential=r.derived_scores["innovation_potential"],
                research_impact=r.derived_scores["research_impact"],
                technology_readiness=DerivedReadiness(
                    score=r.derived_scores["technology_readiness"]["score"],
                    trl=r.derived_scores["technology_readiness"]["trl"]
                ),
                commercial_viability=r.derived_scores["commercial_viability"],
                funding_attractiveness=r.derived_scores["funding_attractiveness"]
            ),
            explanation=ExplanationDetail(
                top_drivers=r.explanation["top_drivers"],
                weakest_pillars=r.explanation["weakest_pillars"],
                narrative=r.explanation["narrative"]
            ),
            computed_at=r.computed_at.isoformat() if hasattr(r.computed_at, "isoformat") else str(r.computed_at)
        )
        for r in records
    ]


@router.post("/batch", response_model=BatchScoreResponse, summary="Batch Score Multiple Projects Concurrently")
def batch_score_projects(
    payload: BatchScoreRequest,
    db: Session = Depends(get_db)
):
    """
    Evaluates up to 50 projects cleanly with sequential database persistence.
    """
    results = [_process_score_calculation(item, db=db) for item in payload.projects]
    return BatchScoreResponse(
        total_scored=len(results),
        scores=results
    )
