from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.postgres import get_db
from app.schemas.auth import RegisterRequest, UserOut, TokenOut
from app.services.auth import register, login
from app.dependencies.auth import get_current_user
from app.models.user import User, Role
router=APIRouter(prefix="/auth", tags=["Authentication"])
@router.post("/register", response_model=UserOut, status_code=201)
def register_user(payload:RegisterRequest, db:Session=Depends(get_db)): return register(db, payload.email, payload.full_name, payload.password, Role.RESEARCHER)
@router.post("/login", response_model=TokenOut)
def login_user(form_data:OAuth2PasswordRequestForm=Depends(), db:Session=Depends(get_db)): return {"access_token":login(db,form_data.username,form_data.password),"token_type":"bearer"}
@router.get("/me", response_model=UserOut)
def me(user:User=Depends(get_current_user)): return user
@router.post("/logout")
def logout(): return {"message":"Logout is client-side token disposal; access tokens are short-lived."}
