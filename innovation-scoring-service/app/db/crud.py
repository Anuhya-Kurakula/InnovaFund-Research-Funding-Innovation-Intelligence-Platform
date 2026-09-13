"""
Database CRUD Operations for Innovation Scoring
"""

import json
import os
import logging
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.models import InnovationScoreHistory, InnovationScoreInput

logger = logging.getLogger(__name__)

def save_score_history(
    db: Session,
    project_id: str,
    model_version: str,
    innovation_score: float,
    band: str,
    pillars: Dict[str, Any],
    derived_scores: Dict[str, Any],
    explanation: Dict[str, Any]
) -> InnovationScoreHistory:
    """Persists a computed score record into history."""
    record = InnovationScoreHistory(
        project_id=project_id,
        model_version=model_version,
        innovation_score=innovation_score,
        band=band,
        pillars=pillars,
        derived_scores=derived_scores,
        explanation=explanation
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_latest_score(db: Session, project_id: str) -> Optional[InnovationScoreHistory]:
    """Retrieves the most recent score computation for a given project_id."""
    return (
        db.query(InnovationScoreHistory)
        .filter(InnovationScoreHistory.project_id == project_id)
        .order_by(desc(InnovationScoreHistory.computed_at), desc(InnovationScoreHistory.id))
        .first()
    )

def get_score_history(db: Session, project_id: str) -> List[InnovationScoreHistory]:
    """Retrieves all historical score records for a project_id, newest first."""
    return (
        db.query(InnovationScoreHistory)
        .filter(InnovationScoreHistory.project_id == project_id)
        .order_by(desc(InnovationScoreHistory.computed_at), desc(InnovationScoreHistory.id))
        .all()
    )

def get_project_input(db: Session, project_id: str) -> Optional[InnovationScoreInput]:
    """Retrieves stored raw input metrics for a project."""
    return (
        db.query(InnovationScoreInput)
        .filter(InnovationScoreInput.project_id == project_id)
        .first()
    )

def seed_projects_if_empty(db: Session, seed_file_path: Optional[str] = None) -> int:
    """
    Seeds initial synthetic projects into innovation_score_inputs if table is empty.
    Returns count of seeded projects.
    """
    existing_count = db.query(InnovationScoreInput).count()
    if existing_count > 0:
        return 0

    if seed_file_path is None:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        seed_file_path = os.path.abspath(os.path.join(current_dir, "..", "..", "data", "seed_projects.json"))

    if not os.path.exists(seed_file_path):
        logger.warning(f"Seed file not found at {seed_file_path}")
        return 0

    try:
        with open(seed_file_path, "r", encoding="utf-8") as f:
            projects = json.load(f)

        seeded = 0
        for p in projects:
            inp = InnovationScoreInput(
                project_id=p["project_id"],
                title=p.get("title", ""),
                domain=p.get("domain", "General"),
                raw_metrics=p.get("raw_metrics", {})
            )
            db.add(inp)
            seeded += 1
        db.commit()
        logger.info(f"Successfully seeded {seeded} projects into database.")
        return seeded
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to seed projects: {e}")
        return 0
