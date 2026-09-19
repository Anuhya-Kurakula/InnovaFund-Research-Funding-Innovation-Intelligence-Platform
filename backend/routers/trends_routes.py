"""
Publication Trend Analysis API ().

Exposes the NLP trend pipeline in services/trends_service.py:
topic extraction, emerging-topic detection, research-hotspot clustering
and citation analytics.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from services.trends_service import (
    get_topic_trends,
    get_research_hotspots,
    get_emerging_topics,
    get_citation_analytics,
)

router = APIRouter(prefix="/trends", tags=["Research Intelligence Trends"])


@router.get("/topics", summary="Topic trends extracted from the research corpus")
def get_topics(db: Session = Depends(get_db)):
    """TF-IDF topics with a per-year publication series and growth velocity."""
    return {"topics": get_topic_trends(db)}


@router.get("/hotspots", summary="Research hotspots (KMeans clusters)")
def get_hotspots(db: Session = Depends(get_db)):
    """Clustered research hotspots plus domain-level activity."""
    return get_research_hotspots(db)


@router.get("/emerging", summary="Emerging topics detected from growth velocity")
def get_emerging(db: Session = Depends(get_db)):
    """Topics whose recent activity grew beyond the emerging threshold."""
    return get_emerging_topics(db)


@router.get("/citations", summary="Citation analytics across the corpus")
def get_citations(db: Session = Depends(get_db)):
    """Total and average citations, h-index estimate and top-cited works."""
    return get_citation_analytics(db)
