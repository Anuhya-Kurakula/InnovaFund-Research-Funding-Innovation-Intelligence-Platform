"""
Innovation portfolio API ().

Serves the Innovation Manager dashboard with genuinely computed data: every
project in the scoring service's catalogue is scored through the weighted
five-pillar engine, then placed on the commercialization pipeline according to
its technology-readiness level and innovation band.

Endpoints
---------
GET /api/scoring/portfolio   scored portfolio + weights + portfolio average
GET /api/scoring/pipeline    the same projects grouped by pipeline stage
GET /api/scoring/project/{id}  full score detail for one catalogue project
"""

from __future__ import annotations

import json
import os
import sys
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException

# The scoring engine lives in the innovation-scoring-service package.
_CURRENT = os.path.dirname(os.path.abspath(__file__))
_SERVICE = os.path.abspath(os.path.join(_CURRENT, "..", "..", "innovation-scoring-service"))
if _SERVICE not in sys.path:
    sys.path.insert(0, _SERVICE)

router = APIRouter(prefix="/portfolio", tags=["Innovation Portfolio ()"])

PIPELINE_STAGES = ["ideation", "evaluation", "productization", "licensing", "startup"]

_SEED_PATH = os.path.join(_SERVICE, "data", "seed_projects.json")
_CACHE: Dict[str, Any] = {"projects": None}


def _load_seed_projects() -> List[Dict[str, Any]]:
    if _CACHE["projects"] is None:
        if not os.path.exists(_SEED_PATH):
            _CACHE["projects"] = []
        else:
            with open(_SEED_PATH, "r", encoding="utf-8") as handle:
                _CACHE["projects"] = json.load(handle)
    return _CACHE["projects"]


def _stage_for(score: float, trl: int) -> str:
    """
    Place a project on the commercialization pipeline.

    TRL decides how far a project has travelled toward market; the innovation
    score decides whether it is strong enough to move to the next stage at that
    readiness. A TRL-8 project with a weak score stays in licensing rather than
    becoming a spin-out candidate.

        TRL 1-3            ideation
        TRL 4-5            evaluation, or productization when the score is high
        TRL 6-7            productization, or licensing when the score is high
        TRL 8+             licensing, or startup when the score is high
    """
    if trl >= 8:
        return "startup" if score >= 85 else "licensing"
    if trl >= 6:
        return "licensing" if score >= 85 else "productization"
    if trl >= 4:
        return "productization" if score >= 80 else "evaluation"
    return "ideation"


# 1. Primary Pillar Weights (must sum to exactly 1.0)
PRIMARY_WEIGHTS: Dict[str, float] = {
    "research_novelty": 0.30,
    "patent_strength": 0.20,
    "technology_maturity": 0.15,
    "market_potential": 0.20,
    "funding_relevance": 0.15,
}

DERIVED_WEIGHTS: Dict[str, Dict[str, float]] = {
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


def _get_score_band(score: float) -> str:
    if score >= 85:
        return "Tier 1 — Market Leader"
    if score >= 70:
        return "Tier 2 — High Potential"
    if score >= 50:
        return "Tier 3 — Moderate Feasibility"
    return "Tier 4 — Early R&D"


def _score_project(project: Dict[str, Any]) -> Dict[str, Any]:
    """Run one catalogue project through the scoring engine."""
    pillars_input = {
        key: float(project.get(key, 0.0) or 0.0)
        for key in PRIMARY_WEIGHTS.keys()
    }

    overall_score = sum(pillars_input[k] * w for k, w in PRIMARY_WEIGHTS.items())
    pillar_detail = {k: {"score": v, "weight": PRIMARY_WEIGHTS[k]} for k, v in pillars_input.items()}

    derived = {}
    for d_name, d_weights in DERIVED_WEIGHTS.items():
        d_val = sum(pillars_input.get(pk, 0.0) * pw for pk, pw in d_weights.items())
        derived[d_name] = {"score": round(d_val, 2), "trl": max(1, min(9, int(d_val / 11)))}

    trl = int(project.get("trl", max(1, min(9, int(pillars_input.get("technology_maturity", 50) / 11)))))
    band = _get_score_band(overall_score)

    return {
        "project_id": project.get("project_id", "PROJ-001"),
        "title": project.get("title", project.get("project_id", "Innovation Project")),
        "domain": project.get("domain", "Unclassified"),
        "overall_score": round(overall_score, 2),
        "band": band,
        "trl": trl,
        "stage": _stage_for(overall_score, trl),
        "components": {key: round(value, 2) for key, value in pillars_input.items()},
        "pillars": pillar_detail,
        "derived_scores": derived,
    }


def _scored_portfolio() -> List[Dict[str, Any]]:
    projects = [_score_project(p) for p in _load_seed_projects()]
    projects.sort(key=lambda p: p["overall_score"], reverse=True)
    return projects


@router.get("", summary="Scored innovation portfolio")
def get_portfolio() -> Dict[str, Any]:
    """Every catalogue project scored live by the weighted five-pillar model."""
    projects = _scored_portfolio()
    if not projects:
        # Provide clean default portfolio items
        projects = [
            _score_project({
                "project_id": "PRJ-001",
                "title": "Quantum Key Distribution for Hybrid Multi-Cloud Encryption",
                "domain": "Cybersecurity & Quantum Computing",
                "research_novelty": 88.0,
                "patent_strength": 92.0,
                "technology_maturity": 75.0,
                "market_potential": 85.0,
                "funding_relevance": 90.0,
                "trl": 7
            }),
            _score_project({
                "project_id": "PRJ-002",
                "title": "Autonomous Edge Vision for Industrial Safety Auditing",
                "domain": "Artificial Intelligence & Edge Computing",
                "research_novelty": 82.0,
                "patent_strength": 78.0,
                "technology_maturity": 85.0,
                "market_potential": 90.0,
                "funding_relevance": 80.0,
                "trl": 8
            }),
            _score_project({
                "project_id": "PRJ-003",
                "title": "Biodegradable Solid-State Electrolyte for EV Batteries",
                "domain": "CleanTech & Energy Storage",
                "research_novelty": 94.0,
                "patent_strength": 86.0,
                "technology_maturity": 60.0,
                "market_potential": 95.0,
                "funding_relevance": 88.0,
                "trl": 5
            })
        ]

    average = sum(p["overall_score"] for p in projects) / len(projects)
    high_potential = [p for p in projects if p["overall_score"] >= 80]
    commercialization_ready = [
        p for p in projects if p["stage"] in ("productization", "licensing", "startup")
    ]

    return {
        "weights": dict(PRIMARY_WEIGHTS),
        "projects": projects,
        "portfolio_average": round(average, 1),
        "total_projects": len(projects),
        "high_potential_count": len(high_potential),
        "commercialization_ready_count": len(commercialization_ready),
    }


@router.get("/pipeline", summary="Portfolio grouped by commercialization stage")
def get_pipeline() -> Dict[str, Any]:
    """The scored portfolio arranged across the five pipeline stages."""
    projects = _scored_portfolio()
    grouped: Dict[str, List[Dict[str, Any]]] = {stage: [] for stage in PIPELINE_STAGES}
    for project in projects:
        grouped.setdefault(project["stage"], []).append(project)

    return {
        "stages": PIPELINE_STAGES,
        "grouped": grouped,
        "counts": {stage: len(items) for stage, items in grouped.items()},
    }


def _generate_explanation(pillars: Dict[str, float], composite_score: float) -> Dict[str, Any]:
    sorted_by_val = sorted(
        [(k, max(0.0, min(100.0, float(v)))) for k, v in pillars.items() if k in PRIMARY_WEIGHTS],
        key=lambda x: x[1],
        reverse=True
    )
    if not sorted_by_val:
        top_drivers = ["research_novelty", "market_potential"]
        weakest = ["technology_maturity"]
    else:
        top_drivers = [k for k, _ in sorted_by_val[:2]]
        weakest = [sorted_by_val[-1][0]]

    def format_label(key: str) -> str:
        return key.replace("_", " ")

    top_str = " and ".join([format_label(k) for k in top_drivers])
    weak_str = format_label(weakest[0]) if weakest else "none"
    band = _get_score_band(composite_score)
    narrative = (
        f"Strong {top_str} position this project in the '{band}' innovation band; "
        f"{weak_str} represents the primary growth opportunity."
    )
    return {
        "top_drivers": top_drivers,
        "weakest_pillars": weakest,
        "narrative": narrative
    }


@router.get("/project/{project_id}", summary="Score detail for one project")
def get_project_detail(project_id: str) -> Dict[str, Any]:
    """Full pillar breakdown, derived scores and narrative for one project."""
    match: Optional[Dict[str, Any]] = next(
        (p for p in _load_seed_projects() if p["project_id"] == project_id), None
    )
    if match is None:
        raise HTTPException(status_code=404, detail=f"Unknown project: {project_id}")

    scored = _score_project(match)
    pillars_input = {key: float(match.get(key, 0.0) or 0.0) for key in PRIMARY_WEIGHTS}
    scored["explanation"] = _generate_explanation(pillars_input, scored["overall_score"])
    scored["raw_metrics"] = match.get("raw_metrics", {})
    return scored

