from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.postgres import get_db
from app.dependencies.auth import get_current_user, require_roles
from app.models.user import User, Role
from app.schemas.funding import FundingOpportunityOut, FundingOpportunityCreate, RecommendationOut
from app.services.funding import (
    list_funding_opportunities,
    get_personalized_recommendations,
    get_funding_alerts,
    create_funding_opportunity,
    save_profile_funding,
    get_saved_profile_funding
)

router = APIRouter(tags=["Funding Discovery"])

@router.get("/funding/opportunities", response_model=list[FundingOpportunityOut])
def get_opportunities(
    q: str | None = None,
    source_type: str | None = Query(default=None, description="Government Grants, Research Councils, Innovation Funds, Startup Accelerators, Venture Programs, International Funding Agencies"),
    db: Session = Depends(get_db)
):
    return list_funding_opportunities(db, query=q, source_type=source_type)

@router.get("/funding/recommendations", response_model=list[RecommendationOut])
def get_recommendations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return get_personalized_recommendations(db, user.id)

@router.get("/funding/alerts", response_model=list[RecommendationOut])
def get_alerts(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return get_funding_alerts(db, user.id)

@router.post("/funding/opportunities", response_model=FundingOpportunityOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_roles(Role.ADMINISTRATOR))])
def create_opportunity(
    payload: FundingOpportunityCreate,
    db: Session = Depends(get_db)
):
    return create_funding_opportunity(db, payload)

@router.post("/profile/funding/{opportunity_id}", response_model=FundingOpportunityOut, status_code=status.HTTP_201_CREATED)
def bookmark_funding(
    opportunity_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return save_profile_funding(db, user.id, opportunity_id)

@router.get("/profile/funding", response_model=list[FundingOpportunityOut])
def list_saved_funding(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return get_saved_profile_funding(db, user.id)
