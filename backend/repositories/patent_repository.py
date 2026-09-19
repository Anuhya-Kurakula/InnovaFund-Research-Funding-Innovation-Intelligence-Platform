from sqlalchemy.orm import Session
from typing import List, Optional
from models import Patent
from schemas import PatentCreate

class PatentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_patent_number(self, patent_number: str) -> Optional[Patent]:
        return self.db.query(Patent).filter(Patent.patent_number == patent_number).first()

    def create_or_update(self, patent_in: PatentCreate, profile_id: Optional[int] = None) -> Patent:
        existing = self.get_by_patent_number(patent_in.patent_number)

        if existing:
            existing.title = patent_in.title
            existing.assignee = patent_in.assignee
            existing.status = patent_in.status
            existing.external_source = patent_in.external_source
            if profile_id and not existing.profile_id:
                existing.profile_id = profile_id
            self.db.commit()
            self.db.refresh(existing)
            return existing

        patent = Patent(
            profile_id=profile_id,
            patent_number=patent_in.patent_number,
            title=patent_in.title,
            assignee=patent_in.assignee,
            filing_date=patent_in.filing_date,
            status=patent_in.status,
            external_source=patent_in.external_source
        )
        self.db.add(patent)
        self.db.commit()
        self.db.refresh(patent)
        return patent

    def search(self, query: str, limit: int = 50) -> List[Patent]:
        like_q = f"%{query}%"
        return self.db.query(Patent).filter(
            (Patent.title.ilike(like_q)) |
            (Patent.assignee.ilike(like_q)) |
            (Patent.patent_number.ilike(like_q))
        ).order_by(Patent.fetched_at.desc()).limit(limit).all()

    def list(self, skip: int = 0, limit: int = 50) -> List[Patent]:
        return self.db.query(Patent).order_by(Patent.fetched_at.desc()).offset(skip).limit(limit).all()

