from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.postgres import get_db
from app.services.trends import get_topic_trends, get_research_hotspots, get_citation_analytics

router = APIRouter(prefix="/trends", tags=["Research Intelligence Trends"])

@router.get("/topics")
def get_topics(db: Session = Depends(get_db)):
    return {"topics": get_topic_trends(db)}

@router.get("/hotspots")
def get_hotspots(db: Session = Depends(get_db)):
    return get_research_hotspots(db)

@router.get("/citations")
def get_citations(db: Session = Depends(get_db)):
    return get_citation_analytics(db)
