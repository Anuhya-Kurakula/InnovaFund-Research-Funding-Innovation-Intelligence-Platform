from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User, Role
from app.models.profile import UserProfile

def register(db: Session, email: str, full_name: str, password: str, role: Role) -> User:
    existing = db.scalar(select(User).where(User.email == email.lower()))
    if existing:
        raise HTTPException(status_code=409, detail="A user with this email already exists")
    role_str = role.value if hasattr(role, "value") else str(role)
    user = User(email=email.lower(), full_name=full_name.strip(), password_hash=hash_password(password), role=role_str)
    user.profile = UserProfile()
    db.add(user); db.commit(); db.refresh(user)
    return user

def login(db: Session, email: str, password: str) -> str:
    user = db.scalar(select(User).where(User.email == email.lower()))
    if not user or not user.is_active or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
    return create_access_token(str(user.id), role_str)
