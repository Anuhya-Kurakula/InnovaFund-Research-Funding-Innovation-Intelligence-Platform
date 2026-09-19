from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import ProfileResponse, ProfileUpdate
from services.profile_service import ProfileService
from dependencies import get_current_user
from models import User

router = APIRouter(prefix="/profiles", tags=["Research Profile Management"])

@router.get("/me", response_model=ProfileResponse)
def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ProfileService(db)
    return service.get_profile(current_user.id)

@router.put("/me", response_model=ProfileResponse)
def update_my_profile(profile_in: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ProfileService(db)
    return service.update_profile(current_user.id, profile_in)

@router.get("/{user_id}", response_model=ProfileResponse)
def get_profile_by_user_id(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ProfileService(db)
    return service.get_profile(user_id)
