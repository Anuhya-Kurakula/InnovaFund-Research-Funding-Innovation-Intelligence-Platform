from datetime import date
from pydantic import BaseModel

class PublicationOut(BaseModel):
    id: int
    source: str
    external_id: str
    title: str
    doi: str | None
    publication_date: date | None
    venue: str | None
    citation_count: int
    model_config = {"from_attributes": True}

class PatentOut(BaseModel):
    id: int
    source: str
    external_id: str
    title: str
    assignee: str | None
    filing_date: date | None
    classification: str | None
    technology_domain: str | None
    citation_count: int
    model_config = {"from_attributes": True}

class SearchResult(BaseModel):
    total: int
    results: list[dict]
