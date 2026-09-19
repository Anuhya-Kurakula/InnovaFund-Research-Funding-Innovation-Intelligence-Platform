from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.postgres import get_db
from app.dependencies.auth import require_roles
from app.models.user import User, Role
from app.schemas.auth import UserOut
from app.schemas.admin import RoleUpdate, UserStatusUpdate
router=APIRouter(prefix="/admin", tags=["Administration"], dependencies=[Depends(require_roles(Role.ADMINISTRATOR))])
@router.get("/users",response_model=list[UserOut])
def users(db:Session=Depends(get_db)): return db.scalars(select(User).order_by(User.id)).all()
@router.patch("/users/{user_id}/role",response_model=UserOut)
def update_role(user_id:int,payload:RoleUpdate,db:Session=Depends(get_db)):
    u=db.get(User,user_id)
    if not u: raise HTTPException(404,"User not found")
    u.role=payload.role; db.commit(); db.refresh(u); return u
@router.patch("/users/{user_id}/status",response_model=UserOut)
def update_status(user_id:int,payload:UserStatusUpdate,db:Session=Depends(get_db)):
    u=db.get(User,user_id)
    if not u: raise HTTPException(404,"User not found")
    u.is_active=payload.is_active; db.commit(); db.refresh(u); return u
