from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.postgres import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.profile import ResearchProfileCreate, ResearchProfileUpdate, ResearchProfileOut, ValueIn, HistoryIn, HistoryOut
from app.services.profile import ensure_profile,get_profile,add_value,remove_value,add_history,delete_history
router=APIRouter(prefix="/profile", tags=["Research Profile"])
def serialize(p):
    return {"id":p.id,"academic":{"academic_title":p.academic_title,"degree":p.degree,"institution":p.institution,"academic_profile_url":p.academic_profile_url,"research_summary":p.research_summary},"organization":p.organization,"research_domains":[x.name for x in p.domains],"research_interests":[x.name for x in p.interests],"keywords":[x.value for x in p.keywords],"technology_areas":[x.name for x in p.technology_areas],"research_history":p.history,"publication_ids":[x.id for x in p.publications],"patent_ids":[x.id for x in p.patents]}
@router.post("", response_model=ResearchProfileOut, status_code=201)
def create_profile(payload:ResearchProfileCreate, db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    if get_profile(db,user.id):
        from fastapi import HTTPException; raise HTTPException(409,"Research profile already exists")
    return serialize(ensure_profile(db,user.id,payload))
@router.get("", response_model=ResearchProfileOut)
def read_profile(db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    p=get_profile(db,user.id)
    if not p:
        from fastapi import HTTPException; raise HTTPException(404,"Research profile not found")
    return serialize(p)
@router.put("", response_model=ResearchProfileOut)
def update_profile(payload:ResearchProfileUpdate, db:Session=Depends(get_db), user:User=Depends(get_current_user)): return serialize(ensure_profile(db,user.id,payload))

def value_routes(path, kind):
    @router.post(path)
    def add(payload:ValueIn, db:Session=Depends(get_db), user:User=Depends(get_current_user)): add_value(db,user.id,kind,payload.value); return {"value":payload.value}
    @router.delete(path+"/{item_id}", status_code=204)
    def remove(item_id:int, db:Session=Depends(get_db), user:User=Depends(get_current_user)): remove_value(db,user.id,kind,item_id)
for path,kind in [("/domains","domain"),("/interests","interest"),("/keywords","keyword"),("/technology-areas","technology")]: value_routes(path,kind)
@router.post("/research-history", response_model=HistoryOut, status_code=201)
def create_history(payload:HistoryIn,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return add_history(db,user.id,payload)
@router.delete("/research-history/{item_id}",status_code=204)
def remove_history(item_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)): delete_history(db,user.id,item_id)
