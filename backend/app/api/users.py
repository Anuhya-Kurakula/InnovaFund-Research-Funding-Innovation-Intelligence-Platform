from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.postgres import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.profile import UserProfile
from pydantic import BaseModel, Field

router=APIRouter(prefix="/users", tags=["Users"])
class UserProfilePayload(BaseModel):
    bio: str|None=Field(default=None,max_length=5000)
    phone: str|None=Field(default=None,max_length=40)
@router.get("/me/profile")
def get_me_profile(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    p=db.query(UserProfile).filter(UserProfile.user_id==user.id).first(); return {"user":user,"profile":p}
@router.put("/me/profile")
def update_me_profile(payload:UserProfilePayload,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    p=db.query(UserProfile).filter(UserProfile.user_id==user.id).first()
    if not p: p=UserProfile(user_id=user.id); db.add(p)
    p.bio=payload.bio;p.phone=payload.phone;db.commit();db.refresh(p);return {"user":user,"profile":p}
