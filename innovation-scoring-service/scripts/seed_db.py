"""
Database Seeding and Pre-computation Script
Loads 25 synthetic projects across 5 domains and pre-computes their baseline scores.
"""

import sys
import os
import json

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import init_db, SessionLocal
from app.db.crud import seed_projects_if_empty, save_score_history
from app.core.scoring import (
    calculate_innovation_score,
    calculate_derived_scores,
    generate_explanation
)
from app.core.bands import get_score_band
from app.config import settings

def run_seed():
    print("[INIT] Initializing Innovation Scoring Database...")
    init_db()
    db = SessionLocal()

    current_dir = os.path.dirname(os.path.abspath(__file__))
    seed_path = os.path.abspath(os.path.join(current_dir, "..", "data", "seed_projects.json"))
    
    with open(seed_path, "r", encoding="utf-8") as f:
        projects = json.load(f)

    print(f"[DATA] Loaded {len(projects)} projects from seed file.")
    seed_projects_if_empty(db, seed_path)

    print("\n" + "=" * 95)
    print(f"{'PROJECT ID':<10} | {'DOMAIN':<14} | {'SCORE':<6} | {'BAND':<10} | {'TRL':<4} | {'TITLE':<40}")
    print("=" * 95)

    for p in projects:
        pillars = {
            "research_novelty": p["research_novelty"],
            "patent_strength": p["patent_strength"],
            "technology_maturity": p["technology_maturity"],
            "market_potential": p["market_potential"],
            "funding_relevance": p["funding_relevance"],
        }
        score, breakdown = calculate_innovation_score(pillars)
        derived = calculate_derived_scores(pillars)
        band = get_score_band(score)
        explanation = generate_explanation(pillars, score)

        # Build pillars dictionary for DB persistence
        pillars_db = {
            k: {
                "value": v["value"],
                "weight": v["weight"],
                "contribution": v["contribution"],
                "source": "local_seed",
                "is_fallback": True if k in ("patent_strength", "technology_maturity") else False
            }
            for k, v in breakdown.items()
        }

        save_score_history(
            db=db,
            project_id=p["project_id"],
            model_version=settings.MODEL_VERSION,
            innovation_score=score,
            band=band,
            pillars=pillars_db,
            derived_scores=derived,
            explanation=explanation
        )

        trl = derived["technology_readiness"]["trl"]
        title_truncated = (p["title"][:37] + "...") if len(p["title"]) > 40 else p["title"]
        print(f"{p['project_id']:<10} | {p['domain']:<14} | {score:<6.2f} | {band:<10} | TRL {trl} | {title_truncated:<40}")

    print("=" * 95)
    print(f"[SUCCESS] Successfully scored and persisted {len(projects)} projects.")
    db.close()

if __name__ == "__main__":
    run_seed()
