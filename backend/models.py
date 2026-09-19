"""
Unified Canonical Models for Research Funding & Innovation Intelligence Platform.
Unifies all models on the DeclarativeBase in app.db.postgres (Base).
"""
import enum
from datetime import datetime, date, timezone
from sqlalchemy import (
    Column, Integer, Float, String, Text, Boolean, TIMESTAMP, ForeignKey, Date, DateTime, Enum, Table, JSON
)
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.postgres import Base


class Role(str, enum.Enum):
    RESEARCHER = "Researcher"
    STARTUP_FOUNDER = "Startup Founder"
    INNOVATION_MANAGER = "Innovation Manager"
    ADMINISTRATOR = "Administrator"


class Organization(Base):
    __tablename__ = "organizations"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    organization_type = Column(String(100), nullable=True) # University, Enterprise, Startup, Lab
    country = Column(String(100), nullable=True)
    website = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    users = relationship("User", back_populates="organization_rel")
    profiles = relationship("ResearchProfile", back_populates="organization")


class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="Researcher", index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    organization_rel = relationship("Organization", back_populates="users")
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    research_profile = relationship("ResearchProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    bio = Column(Text, nullable=True)
    phone = Column(String(40), nullable=True)

    user = relationship("User", back_populates="profile")


# Association tables
profile_publications = Table(
    "profile_publications",
    Base.metadata,
    Column("profile_id", ForeignKey("research_profiles.id", ondelete="CASCADE"), primary_key=True),
    Column("publication_id", ForeignKey("publications.id", ondelete="CASCADE"), primary_key=True),
    extend_existing=True
)

profile_patents = Table(
    "profile_patents",
    Base.metadata,
    Column("profile_id", ForeignKey("research_profiles.id", ondelete="CASCADE"), primary_key=True),
    Column("patent_id", ForeignKey("patents.id", ondelete="CASCADE"), primary_key=True),
    extend_existing=True
)

profile_funding = Table(
    "profile_funding",
    Base.metadata,
    Column("profile_id", Integer, ForeignKey("research_profiles.id", ondelete="CASCADE"), primary_key=True),
    Column("funding_id", Integer, ForeignKey("funding_opportunities.id", ondelete="CASCADE"), primary_key=True),
    extend_existing=True
)


class ResearchProfile(Base):
    __tablename__ = "research_profiles"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    title = Column(String(200), nullable=True)
    academic_title = Column(String(160), nullable=True)
    degree = Column(String(160), nullable=True)
    institution = Column(String(200), nullable=True)
    academic_profile_url = Column(String(500), nullable=True)
    research_summary = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)
    technology_areas_text = Column("technology_areas", Text, nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="research_profile")
    organization = relationship("Organization", back_populates="profiles")
    domains = relationship("ResearchDomain", back_populates="profile", cascade="all, delete-orphan")
    interests = relationship("ResearchInterest", back_populates="profile", cascade="all, delete-orphan")
    keywords = relationship("Keyword", back_populates="profile", cascade="all, delete-orphan")
    technology_areas = relationship("TechnologyArea", back_populates="profile", cascade="all, delete-orphan")
    history = relationship("ResearchHistory", back_populates="profile", cascade="all, delete-orphan")
    publications = relationship("Publication", secondary=profile_publications, back_populates="profiles")
    patents = relationship("Patent", secondary=profile_patents, back_populates="profiles")
    funding_opportunities = relationship("FundingOpportunity", secondary=profile_funding, back_populates="profiles")


class ResearchDomain(Base):
    __tablename__ = "research_domains"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("research_profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(160), nullable=False)

    profile = relationship("ResearchProfile", back_populates="domains")


class ResearchInterest(Base):
    __tablename__ = "research_interests"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("research_profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(200), nullable=True)
    domain_name = Column(String(150), nullable=True, index=True)
    category = Column(String(100), nullable=True)
    weight = Column(Integer, default=1)

    profile = relationship("ResearchProfile", back_populates="interests")


class Keyword(Base):
    __tablename__ = "keywords"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("research_profiles.id", ondelete="CASCADE"), nullable=False)
    keyword_name = Column(String(100), nullable=True, index=True)
    value = Column(String(120), nullable=True)

    profile = relationship("ResearchProfile", back_populates="keywords")


class TechnologyArea(Base):
    __tablename__ = "technology_areas"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("research_profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(160), nullable=False)

    profile = relationship("ResearchProfile", back_populates="technology_areas")


class ResearchHistory(Base):
    __tablename__ = "research_history"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("research_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    start_year = Column(Integer, nullable=True)
    end_year = Column(Integer, nullable=True)

    profile = relationship("ResearchProfile", back_populates="history")


class Publication(Base):
    __tablename__ = "publications"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("research_profiles.id", ondelete="SET NULL"), nullable=True)
    doi = Column(String(500), unique=True, nullable=True, index=True)
    title = Column(Text, nullable=False)
    authors = Column(Text, nullable=True)
    authors_json = Column(Text, nullable=True)
    metadata_json = Column(Text, nullable=True)
    venue = Column(String(300), nullable=True)
    journal_or_venue = Column(String(255), nullable=True)
    publication_year = Column(Integer, nullable=True)
    publication_date = Column(Date, nullable=True)
    citation_count = Column(Integer, default=0)
    source = Column(String(80), default="OpenAlex")
    external_source = Column(String(50), default="OpenAlex")
    external_id = Column(String(500), nullable=True, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    fetched_at = Column(TIMESTAMP, server_default=func.now())

    profiles = relationship("ResearchProfile", secondary=profile_publications, back_populates="publications")


class Patent(Base):
    __tablename__ = "patents"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("research_profiles.id", ondelete="SET NULL"), nullable=True)
    patent_number = Column(String(100), unique=True, nullable=True, index=True)
    external_id = Column(String(300), unique=True, nullable=True, index=True)
    title = Column(Text, nullable=False)
    assignee = Column(String(500), nullable=True)
    filing_date = Column(Date, nullable=True)
    status = Column(String(50), default="Granted")
    classification = Column(String(300), nullable=True)
    technology_domain = Column(String(300), nullable=True)
    citation_count = Column(Integer, default=0)
    metadata_json = Column(Text, nullable=True)
    source = Column(String(80), default="USPTO")
    external_source = Column(String(50), default="USPTO")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    fetched_at = Column(TIMESTAMP, server_default=func.now())

    profiles = relationship("ResearchProfile", secondary=profile_patents, back_populates="patents")


class Session(Base):
    __tablename__ = "sessions"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_token = Column(String(255), unique=True, nullable=False, index=True)
    ip_address = Column(String(50), nullable=True)
    expires_at = Column(TIMESTAMP, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User", back_populates="sessions")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False, index=True)
    resource = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User", back_populates="audit_logs")


class Notification(Base):
    __tablename__ = "notifications"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User", back_populates="notifications")


# ==========================================
# Release: Funding Discovery & Matching Models
# ==========================================

class FundingSource(Base):
    __tablename__ = "funding_sources"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, unique=True, index=True)
    source_type = Column(String(100), nullable=False)
    country = Column(String(100), default="Global")
    website = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    opportunities = relationship("FundingOpportunity", back_populates="source", cascade="all, delete-orphan")


class FundingOpportunity(Base):
    __tablename__ = "funding_opportunities"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("funding_sources.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False, index=True)
    agency = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    source_type = Column(String(100), default="Grant", index=True)
    grant_amount = Column(Integer, nullable=False, default=0)
    amount = Column(String(100), default="Undisclosed")
    currency = Column(String(10), default="USD")
    deadline = Column(String(100), default="Rolling")
    status = Column(String(50), default="Open", index=True)
    research_domain = Column(String(150), nullable=False, default="General", index=True)
    career_stage = Column(String(100), nullable=False, default="Any")
    eligible_geography = Column(String(150), nullable=False, default="Global")
    funding_type = Column(String(100), nullable=False, default="Grant")
    min_qualification = Column(String(100), nullable=True)
    eligibility_criteria = Column(Text, default="")
    tags = Column(JSON, default=list)
    application_url = Column(String(500), default="")
    external_link = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    source = relationship("FundingSource", back_populates="opportunities")
    criteria = relationship("EligibilityCriteria", back_populates="opportunity", cascade="all, delete-orphan")
    profiles = relationship("ResearchProfile", secondary=profile_funding, back_populates="funding_opportunities")


class EligibilityCriteria(Base):
    __tablename__ = "eligibility_criteria"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("funding_opportunities.id", ondelete="CASCADE"), nullable=False)
    criteria_key = Column(String(100), nullable=False)
    criteria_value = Column(String(255), nullable=False)
    is_mandatory = Column(Boolean, default=True)
    weight = Column(Integer, default=25)

    opportunity = relationship("FundingOpportunity", back_populates="criteria")


# ==========================================
# Release: Technology Intelligence Engine Models
# ==========================================

class TechnologyDomain(Base):
    __tablename__ = "technology_domains"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, unique=True, index=True)
    domain_name = Column(String(200), nullable=True, index=True)
    category = Column(String(100), nullable=False, default="DeepTech")
    patent_count = Column(Integer, default=0)
    publication_count = Column(Integer, default=0)
    growth_rate_pct = Column(Float, default=0.0)
    is_emerging = Column(Boolean, default=True, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    maturity = relationship("TechnologyMaturity", back_populates="domain", uselist=False, cascade="all, delete-orphan")
    competitors = relationship("CompetitorActivity", back_populates="domain", cascade="all, delete-orphan")


class TechnologyMaturity(Base):
    __tablename__ = "technology_maturities"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    domain_id = Column(Integer, ForeignKey("technology_domains.id", ondelete="CASCADE"), nullable=False, unique=True)
    lifecycle_stage = Column(String(50), nullable=False, default="Emerging")
    trl_level = Column(Integer, default=3)
    maturity_score = Column(Float, default=65.0)
    adoption_velocity = Column(String(50), default="High")
    commercial_readiness = Column(String(100), default="R&D Phase")
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    domain = relationship("TechnologyDomain", back_populates="maturity")


class CompetitorActivity(Base):
    __tablename__ = "competitor_activities"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    domain_id = Column(Integer, ForeignKey("technology_domains.id", ondelete="CASCADE"), nullable=False)
    assignee_name = Column(String(200), nullable=False, index=True)
    patent_holdings = Column(Integer, default=1)
    market_share_pct = Column(Float, default=0.0)
    activity_status = Column(String(50), default="Active")
    created_at = Column(TIMESTAMP, server_default=func.now())

    domain = relationship("TechnologyDomain", back_populates="competitors")


class Recommendation(Base):
    __tablename__ = "recommendations"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    researcher_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    opportunity_id = Column(Integer, ForeignKey("funding_opportunities.id", ondelete="CASCADE"), nullable=False)
    score = Column(Float, nullable=False)
    domain_fit_score = Column(Float, nullable=True)
    deadline_score = Column(Float, nullable=True)
    amount_score = Column(Float, nullable=True)
    success_rate_score = Column(Float, nullable=True)
    eligible = Column(Integer, default=1)
    reasoning = Column(Text, nullable=True)
    generated_at = Column(TIMESTAMP, server_default=func.now())

    researcher = relationship("User")
    opportunity = relationship("FundingOpportunity")


class PatentRecord(Base):
    __tablename__ = "patent_records"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    assignee = Column(String, nullable=True)
    filing_date = Column(Date, nullable=True)
    classification = Column(String, nullable=True)
    technology_domain = Column(String, nullable=True)
    citation_count = Column(Integer, default=0)
    abstract = Column(String, nullable=True)

