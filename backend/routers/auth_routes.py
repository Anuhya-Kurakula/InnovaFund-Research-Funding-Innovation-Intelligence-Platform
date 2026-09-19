from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import UserRegister, UserLogin, GoogleAuthRequest, TokenResponse, UserResponse
from services.auth_service import AuthService
from dependencies import get_current_user
from models import User

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.register(user_in)

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.login(login_in)

@router.post("/google", response_model=TokenResponse)
def google_auth(google_in: GoogleAuthRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.google_login(google_in)

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out session", "user_id": current_user.id}
