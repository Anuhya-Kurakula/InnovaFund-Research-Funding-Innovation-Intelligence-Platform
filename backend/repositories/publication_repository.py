from sqlalchemy.orm import Session
from typing import List, Optional
from models import Publication
from schemas import PublicationCreate

class PublicationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, pub_id: int) -> Optional[Publication]:
        return self.db.query(Publication).filter(Publication.id == pub_id).first()

    def get_by_doi(self, doi: str) -> Optional[Publication]:
        return self.db.query(Publication).filter(Publication.doi == doi).first()

    def create_or_update(self, pub_in: PublicationCreate, profile_id: Optional[int] = None) -> Publication:
        existing = None
        if pub_in.doi:
            existing = self.get_by_doi(pub_in.doi)

        if existing:
            existing.citation_count = pub_in.citation_count
            if profile_id and not existing.profile_id:
                existing.profile_id = profile_id
            self.db.commit()
            self.db.refresh(existing)
            return existing

        pub = Publication(
            profile_id=profile_id,
            doi=pub_in.doi,
            title=pub_in.title,
            authors=pub_in.authors,
            journal_or_venue=pub_in.journal_or_venue,
            publication_year=pub_in.publication_year,
            citation_count=pub_in.citation_count,
            external_source=pub_in.external_source
        )
        self.db.add(pub)
        self.db.commit()
        self.db.refresh(pub)
        return pub

    def search(self, query: str, limit: int = 50) -> List[Publication]:
        like_q = f"%{query}%"
        return self.db.query(Publication).filter(
            (Publication.title.ilike(like_q)) |
            (Publication.authors.ilike(like_q)) |
            (Publication.journal_or_venue.ilike(like_q)) |
            (Publication.doi.ilike(like_q))
        ).order_by(Publication.fetched_at.desc()).limit(limit).all()

    def list(self, skip: int = 0, limit: int = 50) -> List[Publication]:
        return self.db.query(Publication).order_by(Publication.fetched_at.desc()).offset(skip).limit(limit).all()

