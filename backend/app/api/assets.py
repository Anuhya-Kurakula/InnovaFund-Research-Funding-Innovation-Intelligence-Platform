from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.postgres import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.research_assets import Publication, Patent
from app.schemas.assets import PublicationOut, PatentOut
from app.integrations.openalex import OpenAlexProvider, normalize_work
from app.integrations.patents import get_patent_provider
from app.services.assets import save_publication, save_patent
router=APIRouter(tags=["Research Data"])
@router.get("/publications/search")
async def search_publications(q:str=Query(min_length=2),author:str|None=None,page:int=1,per_page:int=10):
    data=await OpenAlexProvider().search(q,author,page,min(25,per_page)); return {"total":data.get("meta",{}).get("count",0),"results":[normalize_work(x) for x in data.get("results",[])]}
@router.get("/publications/{external_id:path}")
async def get_publication(external_id:str): return normalize_work(await OpenAlexProvider().get(external_id))
@router.post("/profile/publications",response_model=PublicationOut,status_code=201)
def add_publication(data:dict,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return save_publication(db,user.id,data)
@router.get("/profile/publications",response_model=list[PublicationOut])
def list_publications(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    from app.services.profile import get_profile
    p=get_profile(db,user.id)
    return p.publications if p else []
@router.get("/patents/search")
async def search_patents(q:str=Query(min_length=2),limit:int=10): return {"results":await get_patent_provider().search(q,min(limit,25))}
@router.post("/profile/patents",response_model=PatentOut,status_code=201)
def add_patent(data:dict,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return save_patent(db,user.id,data)
@router.get("/profile/patents",response_model=list[PatentOut])
def list_patents(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    from app.services.profile import get_profile
    p=get_profile(db,user.id)
    return p.patents if p else []
