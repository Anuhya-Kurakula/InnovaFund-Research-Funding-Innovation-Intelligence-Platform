import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from database import get_db
from models import User, ResearchProfile, ResearchInterest, FundingOpportunity
from schemas import (
    GrantMatchRequest,
    GrantMatchResponse,
    EligibilityMatchResult,
    MatchingRulesConfig,
    FundingOpportunityResponse
)
from services.grant_matching_service import (
    GrantMatchingRulesEngine,
    seed_funding_opportunities_if_empty
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/grants",
    tags=["Grant Matching Workflows ()"]
)

# Global in-memory instance of matching rules engine (can be tuned dynamically via API)
matching_engine = GrantMatchingRulesEngine()


@router.on_event("startup")
def init_funding_data():
    """Ensure funding opportunities table is seeded on startup."""
    from database import SessionLocal
    db = SessionLocal()
    try:
        seed_funding_opportunities_if_empty(db)
    finally:
        db.close()


@router.post("/match", response_model=GrantMatchResponse, summary="Match Funding Opportunities ()")
def match_grants(
    payload: GrantMatchRequest,
    db: Session = Depends(get_db)
):
    """
    Grant Matching Workflows API Endpoint:
    
    Evaluates all active funding opportunities against eligibility criteria:
    - Research Domain Fit
    - Career Stage Match
    - Geographical Eligibility
    - Funding Type Preference
    - Deadline Status
    
    Returns matched grants with detailed criteria breakdown, overall eligibility scores, 
    and rejection reasons.
    """
    seed_funding_opportunities_if_empty(db)

    # Fetch all funding opportunities
    query = db.query(FundingOpportunity)
    if not payload.include_expired:
        query = query.filter(FundingOpportunity.status != "Expired")

    if payload.min_amount and payload.min_amount > 0:
        query = query.filter(FundingOpportunity.grant_amount >= payload.min_amount)

    if payload.max_amount and payload.max_amount > 0:
        query = query.filter(FundingOpportunity.grant_amount <= payload.max_amount)

    opportunities = query.all()

    results: List[EligibilityMatchResult] = []
    total_eligible = 0
    total_partial = 0
    total_ineligible = 0

    for opp in opportunities:
        match_result = matching_engine.evaluate_opportunity(opp, payload)
        results.append(match_result)

        if match_result.eligibility_status == "ELIGIBLE":
            total_eligible += 1
        elif match_result.eligibility_status == "PARTIAL_MATCH":
            total_partial += 1
        else:
            total_ineligible += 1

    # Sort results by overall eligibility score descending
    results.sort(key=lambda x: x.overall_eligibility_score, reverse=True)

    return GrantMatchResponse(
        total_evaluated=len(opportunities),
        total_eligible=total_eligible,
        total_partial=total_partial,
        total_ineligible=total_ineligible,
        matched_grants=results
    )


@router.get("/eligible/{researcher_id}", response_model=GrantMatchResponse, summary="Get Eligible Grants for Researcher ()")
def get_eligible_grants_for_researcher(
    researcher_id: int,
    db: Session = Depends(get_db)
):
    """
    Fetch Eligible Grants by Researcher ID:
    
    Loads researcher profile, extracts research interests, technology areas, and role,
    and runs the eligibility rules engine to return custom matched grants.
    """
    seed_funding_opportunities_if_empty(db)

    # Find user or research profile
    user = db.query(User).filter(User.id == researcher_id).first()
    profile = db.query(ResearchProfile).filter(
        (ResearchProfile.user_id == researcher_id) | (ResearchProfile.id == researcher_id)
    ).first()

    research_domains = []
    career_stage = "Early-Career"
    geography = "Global"

    if user:
        if user.role == "startup_founder":
            career_stage = "Startup/SME"
        elif user.role == "innovation_manager":
            career_stage = "Senior/Lead"
        elif user.role == "researcher":
            career_stage = "Early-Career"

    if profile:
        # Extract research interests
        interests = db.query(ResearchInterest).filter(ResearchInterest.profile_id == profile.id).all()
        research_domains = [i.domain_name for i in interests]

        if profile.technology_areas:
            research_domains.extend([t.strip() for t in profile.technology_areas.split(",") if t.strip()])

    if not research_domains:
        # Fallback default domains if empty
        research_domains = ["Artificial Intelligence", "Biotechnology", "Climate & CleanEnergy"]

    # Build match request
    request = GrantMatchRequest(
        researcher_id=researcher_id,
        research_domains=research_domains,
        career_stage=career_stage,
        geography=geography,
        funding_types=["Grant", "Fellowship", "Accelerator"],
        include_expired=False
    )

    return match_grants(request, db)


@router.get("/matching-rules", response_model=MatchingRulesConfig, summary="Get Grant Matching Rules Config ()")
def get_matching_rules():
    """
    Returns current Grant Matching rules configuration (weights & thresholds).
    """
    return matching_engine.config


@router.put("/matching-rules", response_model=MatchingRulesConfig, summary="Tune Grant Matching Rules Config ()")
def update_matching_rules(new_config: MatchingRulesConfig):
    """
    Deliverable — Tune matching rules without code changes:
    Allows dynamically adjusting criterion weights (Domain, Career Stage, Geography, Funding Type).
    """
    return matching_engine.update_config(new_config)


@router.get("/opportunities", response_model=List[FundingOpportunityResponse], summary="List All Funding Opportunities (Interface)")
def list_funding_opportunities(
    db: Session = Depends(get_db)
):
    """
    List all funding opportunities ingested in PostgreSQL (Handed off from ).
    """
    seed_funding_opportunities_if_empty(db)
    opportunities = db.query(FundingOpportunity).all()
    return [
        FundingOpportunityResponse.model_validate(o) if hasattr(FundingOpportunityResponse, 'model_validate')
        else FundingOpportunityResponse.from_orm(o)
        for o in opportunities
    ]
