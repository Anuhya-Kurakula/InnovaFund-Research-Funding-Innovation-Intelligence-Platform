from pydantic import BaseModel, Field, HttpUrl

class UserProfileUpdate(BaseModel):
    bio: str | None = Field(default=None, max_length=5000)
    phone: str | None = Field(default=None, max_length=40)

class OrganizationIn(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    organization_type: str | None = Field(default=None, max_length=100)
    website: HttpUrl | None = None
    description: str | None = Field(default=None, max_length=5000)

class AcademicIn(BaseModel):
    academic_title: str | None = Field(default=None, max_length=160)
    degree: str | None = Field(default=None, max_length=160)
    institution: str | None = Field(default=None, max_length=200)
    academic_profile_url: HttpUrl | None = None
    research_summary: str | None = Field(default=None, max_length=10000)

class ResearchProfileCreate(BaseModel):
    academic: AcademicIn | None = None
    organization: OrganizationIn | None = None

class ResearchProfileUpdate(ResearchProfileCreate):
    pass

class ValueIn(BaseModel):
    value: str = Field(min_length=1, max_length=200)

class HistoryIn(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    start_year: int | None = Field(default=None, ge=1900, le=2100)
    end_year: int | None = Field(default=None, ge=1900, le=2100)

class HistoryOut(HistoryIn):
    id: int
    model_config = {"from_attributes": True}

class OrganizationOut(OrganizationIn):
    id: int
    model_config = {"from_attributes": True}

class AcademicOut(AcademicIn):
    pass

class ResearchProfileOut(BaseModel):
    id: int
    academic: AcademicOut
    organization: OrganizationOut | None
    research_domains: list[str]
    research_interests: list[str]
    keywords: list[str]
    technology_areas: list[str]
    research_history: list[HistoryOut]
    publication_ids: list[int]
    patent_ids: list[int]
