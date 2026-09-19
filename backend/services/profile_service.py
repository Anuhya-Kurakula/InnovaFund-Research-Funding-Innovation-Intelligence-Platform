from sqlalchemy.orm import Session
from repositories.profile_repository import ProfileRepository
from repositories.audit_repository import AuditRepository
from schemas import ProfileUpdate, ProfileResponse, PublicationResponse, PatentResponse

class ProfileService:
    def __init__(self, db: Session):
        self.db = db
        self.profile_repo = ProfileRepository(db)
        self.audit_repo = AuditRepository(db)

    def get_profile(self, user_id: int) -> ProfileResponse:
        profile = self.profile_repo.get_or_create(user_id)
        
        domains = [i.domain_name for i in profile.interests]
        keywords = [k.keyword_name for k in profile.keywords]
        pubs = [PublicationResponse.model_validate(p) for p in profile.publications]
        pats = [PatentResponse.model_validate(pt) for pt in profile.patents]

        return ProfileResponse(
            id=profile.id,
            user_id=profile.user_id,
            title=profile.title,
            bio=profile.bio,
            technology_areas=profile.technology_areas,
            research_domains=domains,
            keywords=keywords,
            publications=pubs,
            patents=pats,
            created_at=profile.created_at
        )

    def update_profile(self, user_id: int, profile_in: ProfileUpdate) -> ProfileResponse:
        profile = self.profile_repo.update(user_id, profile_in)
        
        self.audit_repo.log_action(
            user_id=user_id,
            action="PROFILE_UPDATE",
            resource="research_profiles",
            details=f"Updated research profile ID {profile.id}"
        )
        return self.get_profile(user_id)
