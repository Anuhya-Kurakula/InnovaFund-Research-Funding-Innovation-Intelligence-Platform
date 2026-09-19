from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from app.models.profile import ResearchProfile, Organization, ResearchDomain, ResearchInterest, Keyword, TechnologyArea, ResearchHistory
from app.schemas.profile import ResearchProfileCreate, ResearchProfileUpdate, ValueIn, HistoryIn

def get_profile(db: Session, user_id: int):
    return db.scalar(select(ResearchProfile).options(selectinload(ResearchProfile.domains), selectinload(ResearchProfile.interests), selectinload(ResearchProfile.keywords), selectinload(ResearchProfile.technology_areas), selectinload(ResearchProfile.history), selectinload(ResearchProfile.organization), selectinload(ResearchProfile.publications), selectinload(ResearchProfile.patents)).where(ResearchProfile.user_id == user_id))

def ensure_profile(db: Session, user_id: int, payload: ResearchProfileCreate | ResearchProfileUpdate):
    profile = get_profile(db, user_id)
    if not profile:
        profile = ResearchProfile(user_id=user_id)
        db.add(profile); db.flush()
    if payload.academic:
        for k, v in payload.academic.model_dump().items(): setattr(profile, k, str(v) if k in {"academic_profile_url"} and v is not None else v)
    if payload.organization:
        org = profile.organization
        if org is None:
            org = Organization(**payload.organization.model_dump(mode="json"))
            db.add(org); db.flush(); profile.organization_id = org.id
        else:
            for k,v in payload.organization.model_dump(mode="json").items(): setattr(org,k,v)
    db.commit(); db.refresh(profile)
    return get_profile(db, user_id)

def add_value(db: Session, user_id: int, kind: str, value: str):
    profile = get_profile(db, user_id)
    if not profile: raise HTTPException(404, "Research profile does not exist")
    model = {"domain": ResearchDomain, "interest": ResearchInterest, "keyword": Keyword, "technology": TechnologyArea}[kind]
    field = {ResearchDomain:"name", ResearchInterest:"name", Keyword:"value", TechnologyArea:"name"}[model]
    if db.scalar(select(model).where(model.profile_id == profile.id, getattr(model, field) == value.strip())):
        raise HTTPException(409, "Value already exists")
    db.add(model(profile_id=profile.id, **{field:value.strip()})); db.commit()
    return value.strip()

def remove_value(db: Session, user_id: int, kind: str, item_id: int):
    profile = get_profile(db, user_id)
    if not profile: raise HTTPException(404, "Research profile does not exist")
    model = {"domain": ResearchDomain, "interest": ResearchInterest, "keyword": Keyword, "technology": TechnologyArea}[kind]
    obj = db.scalar(select(model).where(model.id == item_id, model.profile_id == profile.id))
    if not obj: raise HTTPException(404, "Value not found")
    db.delete(obj); db.commit()

def add_history(db: Session, user_id: int, payload: HistoryIn):
    profile = get_profile(db, user_id)
    if not profile: raise HTTPException(404, "Research profile does not exist")
    if payload.start_year and payload.end_year and payload.end_year < payload.start_year: raise HTTPException(422, "end_year cannot be before start_year")
    item = ResearchHistory(profile_id=profile.id, **payload.model_dump()); db.add(item); db.commit(); db.refresh(item); return item

def delete_history(db: Session, user_id: int, item_id: int):
    profile = get_profile(db, user_id)
    item = db.scalar(select(ResearchHistory).where(ResearchHistory.id == item_id, ResearchHistory.profile_id == profile.id)) if profile else None
    if not item: raise HTTPException(404, "Research history entry not found")
    db.delete(item); db.commit()
