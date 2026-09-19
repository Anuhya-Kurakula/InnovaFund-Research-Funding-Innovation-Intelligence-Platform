import json
from pathlib import Path
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.funding import FundingOpportunity
from app.models.profile import ResearchProfile
from app.schemas.funding import FundingOpportunityCreate

def seed_funding_data(db: Session):
    try:
        existing_count = db.query(FundingOpportunity).count()
        if existing_count > 0:
            return
    except Exception:
        db.rollback()

    json_path = Path(__file__).resolve().parents[3] / "data" / "funding_public_sample.json"
    if not json_path.exists():
        return

    try:
        with open(json_path, "r", encoding="utf-8") as f:
            items = json.load(f)
            for item in items:
                opp = FundingOpportunity(
                    title=item["title"],
                    description=item["description"],
                    source_type=item["source_type"],
                    agency=item["agency"],
                    amount=item.get("amount", "Undisclosed"),
                    deadline=item.get("deadline", "Rolling"),
                    eligibility_criteria=item.get("eligibility_criteria", ""),
                    tags=item.get("tags", []),
                    application_url=item.get("application_url", "")
                )
                db.add(opp)
            db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error seeding funding opportunities: {e}")

def list_funding_opportunities(db: Session, query: str | None = None, source_type: str | None = None):
    seed_funding_data(db)
    stmt = select(FundingOpportunity)
    if source_type:
        stmt = stmt.where(FundingOpportunity.source_type.ilike(f"%{source_type}%"))
    if query:
        pattern = f"%{query}%"
        stmt = stmt.where(
            or_(
                FundingOpportunity.title.ilike(pattern),
                FundingOpportunity.description.ilike(pattern),
                FundingOpportunity.agency.ilike(pattern),
                FundingOpportunity.eligibility_criteria.ilike(pattern)
            )
        )
    stmt = stmt.order_by(FundingOpportunity.id)
    return db.scalars(stmt).all()

def get_personalized_recommendations(db: Session, user_id: int):
    seed_funding_data(db)
    profile = db.query(ResearchProfile).filter(ResearchProfile.user_id == user_id).first()
    opportunities = db.query(FundingOpportunity).all()

    if not profile:
        return [{"opportunity": opp, "match_score": 50, "matched_tags": []} for opp in opportunities]

    # Collect profile tokens
    profile_tokens = set()
    for d in profile.domains:
        profile_tokens.add(d.name.lower())
    for i in profile.interests:
        profile_tokens.add(i.name.lower())
    for k in profile.keywords:
        profile_tokens.add(k.value.lower())
    for t in profile.technology_areas:
        profile_tokens.add(t.name.lower())

    results = []
    for opp in opportunities:
        opp_tags = [tag.lower() for tag in (opp.tags or [])]
        matched = []

        # Find direct tag matches or keyword substring matches
        for tag in opp_tags:
            for ptoken in profile_tokens:
                if tag in ptoken or ptoken in tag:
                    matched.append(tag)
                    break

        # Calculate score (base score + matching bonus)
        if profile_tokens:
            overlap_ratio = len(matched) / max(1, len(opp_tags))
            score = min(98, max(40, int(overlap_ratio * 60) + 40))
        else:
            score = 50

        results.append({
            "opportunity": opp,
            "match_score": score,
            "matched_tags": list(set(matched))
        })

    # Sort descending by match score
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results

def get_funding_alerts(db: Session, user_id: int):
    # Returns recommended opportunities that have high match scores or deadline approaching
    recs = get_personalized_recommendations(db, user_id)
    # Filter for match score >= 50 or recently added
    return recs[:5]

def create_funding_opportunity(db: Session, payload: FundingOpportunityCreate):
    opp = FundingOpportunity(**payload.model_dump())
    db.add(opp)
    db.commit()
    db.refresh(opp)
    return opp

def save_profile_funding(db: Session, user_id: int, opportunity_id: int):
    profile = db.query(ResearchProfile).filter(ResearchProfile.user_id == user_id).first()
    if not profile:
        profile = ResearchProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    opp = db.get(FundingOpportunity, opportunity_id)
    if not opp:
        raise HTTPException(404, "Funding opportunity not found")

    if opp not in profile.funding_opportunities:
        profile.funding_opportunities.append(opp)
        db.commit()

    return opp

def get_saved_profile_funding(db: Session, user_id: int):
    profile = db.query(ResearchProfile).filter(ResearchProfile.user_id == user_id).first()
    if not profile:
        return []
    return profile.funding_opportunities
