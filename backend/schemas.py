from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Union, Dict, Any
from datetime import datetime, date

# User & Auth Schemas
class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field("researcher", pattern="^(researcher|startup_founder|innovation_manager|administrator)$")
    organization: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = "researcher"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    full_name: str
    email: str
    role: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Publication & Patent Schemas
class PublicationCreate(BaseModel):
    title: str
    authors: Optional[str] = None
    doi: Optional[str] = None
    journal_or_venue: Optional[str] = None
    publication_year: Optional[int] = None
    citation_count: int = 0
    external_source: str

class PublicationResponse(PublicationCreate):
    id: int
    fetched_at: datetime

    class Config:
        from_attributes = True

class PatentCreate(BaseModel):
    patent_number: str
    title: str
    assignee: Optional[str] = None
    filing_date: Optional[date] = None
    status: str = "Granted"
    external_source: str

class PatentResponse(PatentCreate):
    id: int
    fetched_at: datetime

    class Config:
        from_attributes = True

# Profile Schemas
class ProfileUpdate(BaseModel):
    title: Optional[str] = None
    bio: Optional[str] = None
    technology_areas: Optional[str] = None
    research_domains: Optional[List[str]] = None
    keywords: Optional[List[str]] = None

class ProfileResponse(BaseModel):
    id: int
    user_id: int
    title: Optional[str] = None
    bio: Optional[str] = None
    technology_areas: Optional[str] = None
    research_domains: List[str] = []
    keywords: List[str] = []
    publications: List[PublicationResponse] = []
    patents: List[PatentResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

# Audit Log & Notification Schemas
class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    action: str
    resource: str
    details: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# Milestone 2: Member 2 Grant Matching Schemas
# ==========================================

class FundingOpportunityResponse(BaseModel):
    id: int
    title: str
    agency: str
    description: Optional[str] = None
    grant_amount: int
    currency: str = "USD"
    deadline: date
    status: str
    research_domain: str
    career_stage: str
    eligible_geography: str
    funding_type: str
    external_link: Optional[str] = None

    class Config:
        from_attributes = True


class GrantMatchRequest(BaseModel):
    researcher_id: Optional[int] = None
    research_domains: List[str] = Field(default_factory=list, description="List of research domains e.g. ['Artificial Intelligence', 'Biotechnology']")
    career_stage: Optional[str] = Field("Early-Career", description="Early-Career, Mid-Career, Senior/Lead, Startup/SME, Any")
    geography: Optional[str] = Field("Global", description="Global, US, EU, India, UK, Asia-Pacific")
    funding_types: List[str] = Field(default_factory=lambda: ["Grant", "Fellowship", "Accelerator"], description="Types of funding preferred")
    min_amount: Optional[int] = Field(0, description="Minimum funding amount USD")
    max_amount: Optional[int] = Field(None, description="Maximum funding amount USD")
    include_expired: bool = Field(False, description="Whether to include expired grants for testing")


class CriteriaMatchDetail(BaseModel):
    criterion: str
    status: str # MATCHED, PARTIAL, MISMATCHED, EXPIRED
    score: float # 0 to 100
    weight: float
    message: str


class EligibilityMatchResult(BaseModel):
    opportunity: FundingOpportunityResponse
    eligibility_status: str # ELIGIBLE, PARTIAL_MATCH, INELIGIBLE, EXPIRED
    is_eligible: bool # True if mandatory criteria pass
    overall_eligibility_score: float # Weighted eligibility score 0 to 100
    criteria_breakdown: List[CriteriaMatchDetail]
    rejection_reasons: List[str] = []


class GrantMatchResponse(BaseModel):
    total_evaluated: int
    total_eligible: int
    total_partial: int
    total_ineligible: int
    matched_grants: List[EligibilityMatchResult]


class MatchingRulesConfig(BaseModel):
    domain_weight: float = Field(35.0, description="Weight percentage for research domain match")
    career_stage_weight: float = Field(25.0, description="Weight percentage for career stage match")
    geography_weight: float = Field(25.0, description="Weight percentage for geographical eligibility match")
    funding_type_weight: float = Field(15.0, description="Weight percentage for funding type match")
    min_pass_threshold: float = Field(50.0, description="Minimum overall score threshold for eligibility")
    strict_geography_check: bool = Field(True, description="Strictly exclude grants if geography is restricted and mismatched")
    strict_deadline_check: bool = Field(True, description="Strictly mark grants past deadline as EXPIRED/INELIGIBLE")


# ==========================================
# Milestone 3: Technology Intelligence Schemas (Member 2 Deliverable)
# ==========================================

class EmergingTechTrendResponse(BaseModel):
    id: int
    name: str
    category: str
    patent_count: int
    publication_count: int
    growth_rate_pct: float
    is_emerging: bool
    description: Optional[str] = None

    class Config:
        from_attributes = True


class TechnologyMaturityResponse(BaseModel):
    domain_id: int
    domain_name: str
    category: str
    lifecycle_stage: str # Emerging, Growth, Mature, Declining
    trl_level: int # Technology Readiness Level 1-9
    maturity_score: float # 0.0 to 100.0 (Supplies 15% weight to Member 4's scoring model)
    adoption_velocity: str # Low, Moderate, High, Rapid
    commercial_readiness: str

    class Config:
        from_attributes = True


class CompetitorActivityResponse(BaseModel):
    id: int
    domain_name: str
    assignee_name: str
    patent_holdings: int
    market_share_pct: float
    activity_status: str

    class Config:
        from_attributes = True


# ==========================================
# Milestone 3: Patent Landscape, Innovation Scoring & Commercialization Schemas
# ==========================================

class PatentClusterResponse(BaseModel):
    cluster_id: int
    cluster_name: str
    patent_count: int
    key_terms: List[str]
    top_assignees: List[str]
    growth_rate_pct: float
    description: Optional[str] = None


class PatentTrendResponse(BaseModel):
    time_period: str
    patent_count: int
    growth_rate_pct: float
    top_categories: List[str]
    filing_velocity: str


class ScoringRequest(BaseModel):
    project_id: Optional[Union[int, str]] = Field("PRJ-001", description="Target Project ID")
    project_title: Optional[str] = Field("DeepTech Innovation Project", description="Project Title")
    research_novelty: Optional[float] = Field(None, ge=0.0, le=100.0, description="Research Novelty (30% weight)")
    patent_strength: Optional[float] = Field(None, ge=0.0, le=100.0, description="Patent Strength (20% weight)")
    technology_maturity: Optional[float] = Field(None, ge=0.0, le=100.0, description="Technology Maturity (15% weight)")
    market_potential: Optional[float] = Field(None, ge=0.0, le=100.0, description="Market Potential (20% weight)")
    funding_relevance: Optional[float] = Field(None, ge=0.0, le=100.0, description="Funding Relevance (15% weight)")
    raw_metrics: Optional[Dict[str, Any]] = None

    class Config:
        extra = "allow"


class ScoringBreakdown(BaseModel):
    research_novelty_score: float
    research_novelty_weighted: float
    patent_strength_score: float
    patent_strength_weighted: float
    technology_maturity_score: float
    technology_maturity_weighted: float
    market_potential_score: float
    market_potential_weighted: float
    funding_relevance_score: float
    funding_relevance_weighted: float


class ScoringResponse(BaseModel):
    project_id: Union[int, str]
    project_title: Optional[str] = None
    overall_score: float # Weighted calculation out of 100.0
    innovation_score: Optional[float] = None
    tier: Optional[str] = None
    band: Optional[str] = None
    model_version: Optional[str] = "1.0.0"
    breakdown: Optional[ScoringBreakdown] = None
    summary: Optional[str] = None
    pillars: Optional[Dict[str, Any]] = None
    derived_scores: Optional[Dict[str, Any]] = None
    explanation: Optional[Dict[str, Any]] = None
    calculated_at: Optional[Union[datetime, str]] = None
    computed_at: Optional[str] = None

    class Config:
        extra = "allow"


class LicensingOpportunity(BaseModel):
    title: str
    potential_licensee: str
    estimated_royalty_range: str
    readiness_level: str


class StartupRecommendation(BaseModel):
    title: str
    incubation_stage: str
    target_funding_round: str
    key_requirements: List[str]


class IndustryPartnership(BaseModel):
    partner_name: str
    sector: str
    collaboration_type: str
    value_proposition: str


class CommercializationResponse(BaseModel):
    project_id: int
    project_title: str
    productization_recommendations: List[str]
    licensing_opportunities: List[LicensingOpportunity]
    startup_creation_recommendations: List[StartupRecommendation]
    industry_partnership_recommendations: List[IndustryPartnership]
    overall_readiness_score: float

