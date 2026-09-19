from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas import UserResponse, AuditLogResponse
from repositories.user_repository import UserRepository
from repositories.audit_repository import AuditRepository
from dependencies import require_role
from models import User

router = APIRouter(prefix="/admin", tags=["Admin & System Operations"])

@router.get("/users", response_model=List[UserResponse])
def list_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(require_role("administrator")),
    db: Session = Depends(get_db)
):
    user_repo = UserRepository(db)
    users = user_repo.list_all(skip, limit)
    return [UserResponse.model_validate(u) for u in users]

@router.get("/audit-logs", response_model=List[AuditLogResponse])
def list_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(require_role("administrator")),
    db: Session = Depends(get_db)
):
    audit_repo = AuditRepository(db)
    logs = audit_repo.list_logs(skip, limit)
    return [AuditLogResponse.model_validate(l) for l in logs]

@router.get("/metrics")
def get_system_metrics(
    current_user: User = Depends(require_role("administrator", "innovation_manager")),
    db: Session = Depends(get_db)
):
    user_count = db.query(User).count()
    from models import ResearchProfile, Publication, Patent
    profile_count = db.query(ResearchProfile).count()
    pub_count = db.query(Publication).count()
    patent_count = db.query(Patent).count()

    return {
        "status": "operational",
        "total_users": user_count,
        "total_research_profiles": profile_count,
        "total_publications_indexed": pub_count,
        "total_patents_indexed": patent_count
    }
