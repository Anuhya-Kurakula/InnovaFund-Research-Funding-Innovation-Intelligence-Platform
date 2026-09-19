from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl

class FundingOpportunityBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str
    source_type: str = Field(..., description="Government Grants, Research Councils, Innovation Funds, Startup Accelerators, Venture Programs, International Funding Agencies")
    agency: str
    amount: str = "Undisclosed"
    deadline: str = "Rolling"
    eligibility_criteria: str = ""
    tags: list[str] = Field(default_factory=list)
    application_url: str = ""

class FundingOpportunityCreate(FundingOpportunityBase):
    pass

class FundingOpportunityOut(FundingOpportunityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class RecommendationOut(BaseModel):
    opportunity: FundingOpportunityOut
    match_score: int
    matched_tags: list[str]
