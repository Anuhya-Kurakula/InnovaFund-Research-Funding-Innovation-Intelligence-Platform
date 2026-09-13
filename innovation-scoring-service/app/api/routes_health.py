"""
Health Check and Liveness Endpoint
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.config import settings
from app.db.session import get_db
from app.schemas.scoring import HealthResponse

router = APIRouter(tags=["Health & Status"])

@router.get("/health", response_model=HealthResponse, summary="Service Health & Liveness Probe")
def get_health(db: Session = Depends(get_db)):
    """
    Returns service liveness, model version, active signal provider, and DB reachability.
    """
    db_connected = False
    try:
        db.execute(text("SELECT 1"))
        db_connected = True
    except Exception:
        db_connected = False

    return HealthResponse(
        status="ok",
        service="Innovation Scoring Engine",
        version=settings.MODEL_VERSION,
        active_signal_provider=settings.SIGNAL_SOURCE,
        database_connected=db_connected
    )
