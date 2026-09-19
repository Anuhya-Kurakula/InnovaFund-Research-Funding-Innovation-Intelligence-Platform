import json
from datetime import date
from sqlalchemy import select
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.research_assets import Publication, Patent
from app.services.profile import get_profile
from app.db.mongo import get_mongo_db, ping_mongo

def save_publication(db: Session, user_id: int, data: dict):
    profile=get_profile(db,user_id)
    if not profile: raise HTTPException(404,"Create a research profile first")
    ext=data.get("external_id")
    pub=db.scalar(select(Publication).where(Publication.external_id==ext))
    if not pub:
        if isinstance(data.get("publication_date"), str):
            data["publication_date"] = date.fromisoformat(data["publication_date"])
        pub=Publication(source="OpenAlex", external_id=ext, title=data["title"], doi=data.get("doi"), publication_date=data.get("publication_date"), venue=data.get("venue"), citation_count=data.get("citation_count",0), authors_json=json.dumps(data.get("authors",[])), metadata_json=json.dumps(data.get("raw",{})))
        db.add(pub); db.flush()
    if pub not in profile.publications: profile.publications.append(pub)
    db.commit(); db.refresh(pub)
    if ping_mongo(): get_mongo_db()["publications_raw"].replace_one({"external_id":ext},{"external_id":ext,"source":"OpenAlex","data":data.get("raw",{})},upsert=True)
    return pub

def save_patent(db: Session, user_id: int, data: dict):
    profile=get_profile(db,user_id)
    if not profile: raise HTTPException(404,"Create a research profile first")
    ext=data.get("external_id")
    patent=db.scalar(select(Patent).where(Patent.external_id==ext))
    if not patent:
        if isinstance(data.get("filing_date"), str):
            data["filing_date"] = date.fromisoformat(data["filing_date"])
        patent=Patent(source=data.get("source","Local public dataset"), external_id=ext, title=data["title"], assignee=data.get("assignee"), filing_date=data.get("filing_date"), classification=data.get("classification"), technology_domain=data.get("technology_domain"), citation_count=data.get("citation_count",0), metadata_json=json.dumps(data.get("raw",data), default=str))
        db.add(patent); db.flush()
    if patent not in profile.patents: profile.patents.append(patent)
    db.commit(); db.refresh(patent)
    if ping_mongo(): get_mongo_db()["patents_raw"].replace_one({"external_id":ext},{"external_id":ext,"source":data.get("source"),"data":data.get("raw",data)},upsert=True)
    return patent
