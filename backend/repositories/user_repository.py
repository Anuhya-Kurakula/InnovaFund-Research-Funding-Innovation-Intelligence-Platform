from sqlalchemy.orm import Session
from typing import Optional, List
from models import User, Organization
from schemas import UserRegister
from auth import hash_password

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email.lower()).first()

    def create(self, user_in: UserRegister) -> User:
        org_id = None
        if user_in.organization:
            org = self.db.query(Organization).filter(Organization.name == user_in.organization).first()
            if not org:
                org = Organization(name=user_in.organization, org_type="Enterprise")
                self.db.add(org)
                self.db.flush()
            org_id = org.id

        user = User(
            full_name=user_in.full_name,
            email=user_in.email.lower(),
            password_hash=hash_password(user_in.password),
            role=user_in.role,
            organization_id=org_id,
            is_active=True
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def list_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        return self.db.query(User).offset(skip).limit(limit).all()
