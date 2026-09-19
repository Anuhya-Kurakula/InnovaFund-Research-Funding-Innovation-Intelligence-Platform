from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from database import get_db
from models import FundingOpportunity, ResearchProfile
from recommendation_engine import compute_score

router = APIRouter(prefix="/recommendations", tags=["Release — Funding Recommendation Engine"])

class GenerateRequest(BaseModel):
    researcher_id: int
    top_n: Optional[int] = 10

class RecommendationItem(BaseModel):
    opportunity_id: int
    title: str
    agency: Optional[str] = "Global Research Council"
    amount: Optional[float] = 500000
    deadline: Optional[str] = "2026-12-31"
    score: float
    eligible: bool
    reasoning: str
    url: Optional[str] = "https://seedfund.nsf.gov/"
    external_link: Optional[str] = "https://seedfund.nsf.gov/"

@router.get("/{researcher_id}", response_model=List[RecommendationItem])
def get_recommendations_by_researcher(researcher_id: int, db: Session = Depends(get_db)):
    return generate_recommendations(GenerateRequest(researcher_id=researcher_id, top_n=10), db)

@router.post("/generate", response_model=List[RecommendationItem])
def generate_recommendations(payload: GenerateRequest, db: Session = Depends(get_db)):
    opportunities = db.query(FundingOpportunity).all()
    if not opportunities:
        from services.grant_matching_service import seed_funding_opportunities_if_empty
        seed_funding_opportunities_if_empty(db)
        opportunities = db.query(FundingOpportunity).all()

    profile = db.query(ResearchProfile).filter(ResearchProfile.user_id == payload.researcher_id).first()
    parts = []
    if profile:
        if getattr(profile, "bio", None):
            parts.append(str(profile.bio))
        if getattr(profile, "domains", None):
            for d in profile.domains:
                parts.append(getattr(d, "name", str(d)))
        if getattr(profile, "interests", None):
            for i in profile.interests:
                parts.append(getattr(i, "name", str(i)))
        if getattr(profile, "keywords", None):
            for k in profile.keywords:
                parts.append(getattr(k, "value", str(k)))
        if getattr(profile, "technology_areas", None):
            for t in profile.technology_areas:
                parts.append(getattr(t, "name", str(t)))

    profile_text = " ".join([p for p in parts if isinstance(p, str) and p.strip()])
    if not profile_text:
        profile_text = "artificial intelligence machine learning quantum computing biotechnology clean energy"

    amounts = []
    for opp in opportunities:
        amt = getattr(opp, "grant_amount", None) or getattr(opp, "amount", None)
        if amt:
            try:
                cleaned = "".join(c for c in str(amt) if c.isdigit() or c == '.')
                if cleaned:
                    amounts.append(float(cleaned))
            except Exception:
                pass

    min_amt = min(amounts) if amounts else 100000.0
    max_amt = max(amounts) if amounts else 2500000.0

    results = []
    for opp in opportunities:
        res = compute_score(profile_text, opp, min_amt, max_amt)
        link = getattr(opp, "application_url", None) or getattr(opp, "external_link", None) or "https://seedfund.nsf.gov/"
        
        # Safe amount formatting
        raw_amt = getattr(opp, "grant_amount", None) or getattr(opp, "amount", None)
        amt_val = 500000.0
        if isinstance(raw_amt, (int, float)):
            amt_val = float(raw_amt)
        elif raw_amt:
            try:
                c = "".join(ch for ch in str(raw_amt) if ch.isdigit() or ch == '.')
                if c: amt_val = float(c)
            except Exception:
                amt_val = 500000.0

        deadline_str = str(opp.deadline) if opp.deadline else "2026-12-31"

        results.append(RecommendationItem(
            opportunity_id=opp.id,
            title=opp.title,
            agency=opp.agency or "Global Agency",
            amount=amt_val,
            deadline=deadline_str,
            score=res["score"],
            eligible=res["score"] >= 45.0,
            reasoning=res["reasoning"],
            url=link,
            external_link=link
        ))

    results.sort(key=lambda x: x.score, reverse=True)
    return results[:payload.top_n]

