from sqlalchemy.orm import Session
from typing import Optional, List
from models import ResearchProfile, ResearchInterest, Keyword
from schemas import ProfileUpdate

class ProfileRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_user_id(self, user_id: int) -> Optional[ResearchProfile]:
        return self.db.query(ResearchProfile).filter(ResearchProfile.user_id == user_id).first()

    def get_or_create(self, user_id: int) -> ResearchProfile:
        profile = self.get_by_user_id(user_id)
        if not profile:
            profile = ResearchProfile(
                user_id=user_id,
                title="Researcher / Specialist",
                bio="Research interest in innovation, artificial intelligence, and deep tech.",
                technology_areas="Artificial Intelligence, Machine Learning, Data Analytics"
            )
            self.db.add(profile)
            self.db.commit()
            self.db.refresh(profile)
        return profile

    def update(self, user_id: int, profile_in: ProfileUpdate) -> ResearchProfile:
        profile = self.get_or_create(user_id)

        if profile_in.title is not None:
            profile.title = profile_in.title
        if profile_in.bio is not None:
            profile.bio = profile_in.bio
        if profile_in.technology_areas is not None:
            profile.technology_areas = profile_in.technology_areas

        if profile_in.research_domains is not None:
            self.db.query(ResearchInterest).filter(ResearchInterest.profile_id == profile.id).delete()
            for domain in profile_in.research_domains:
                if domain.strip():
                    interest = ResearchInterest(profile_id=profile.id, domain_name=domain.strip())
                    self.db.add(interest)

        if profile_in.keywords is not None:
            self.db.query(Keyword).filter(Keyword.profile_id == profile.id).delete()
            for kw in profile_in.keywords:
                if kw.strip():
                    kw_obj = Keyword(profile_id=profile.id, keyword_name=kw.strip())
                    self.db.add(kw_obj)

        self.db.commit()
        self.db.refresh(profile)
        return profile
