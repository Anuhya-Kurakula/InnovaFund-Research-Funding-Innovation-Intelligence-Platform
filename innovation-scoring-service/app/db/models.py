"""
SQLAlchemy Models for Innovation Scoring Engine
Compatible with both PostgreSQL (JSONB) and SQLite (JSON).
"""

from sqlalchemy import Column, Integer, Float, String, Text, DateTime, Index
from sqlalchemy.dialects import postgresql
from sqlalchemy.types import JSON
from sqlalchemy.sql import func
try:
    from database import Base
except ImportError:
    from sqlalchemy.orm import declarative_base
    Base = declarative_base()

# Dialect-Adaptive JSON Type (PostgreSQL JSONB / SQLite JSON)
JSON_TYPE = JSON().with_variant(postgresql.JSONB, "postgresql")

class InnovationScoreHistory(Base):
    """
    Stores historical and current computed innovation scores for auditability and tracking.
    """
    __tablename__ = "innovation_score_history"
    __table_args__ = (
        Index("idx_score_history_project_time", "project_id", "computed_at"),
        {"extend_existing": True}
    )

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(100), nullable=False, index=True)
    model_version = Column(String(20), nullable=False, default="1.0.0")
    innovation_score = Column(Float, nullable=False)
    band = Column(String(50), nullable=False)
    pillars = Column(JSON_TYPE, nullable=False)
    derived_scores = Column(JSON_TYPE, nullable=False)
    explanation = Column(JSON_TYPE, nullable=False)
    computed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class InnovationScoreInput(Base):
    """
    Stores project baseline metadata and raw metrics used during scoring.
    """
    __tablename__ = "innovation_score_inputs"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(100), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=True)
    domain = Column(String(100), nullable=True, index=True)
    raw_metrics = Column(JSON_TYPE, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
