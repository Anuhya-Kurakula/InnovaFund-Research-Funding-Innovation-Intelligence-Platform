"""
Pydantic v2 Schemas and Contracts for Innovation Scoring Engine
"""

from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field, field_validator, model_validator

class RawMetrics(BaseModel):
    citation_count: Optional[int] = Field(0, ge=0, description="Total academic & patent citations")
    claim_count: Optional[int] = Field(0, ge=0, description="Number of independent and dependent claims")
    patent_family_size: Optional[int] = Field(0, ge=0, description="Number of jurisdictions filed")
    years_since_filing: Optional[float] = Field(0.0, ge=0.0, description="Age of earliest priority filing in years")

class ScoreRequest(BaseModel):
    project_id: Optional[str] = Field("PRJ-CUSTOM", description="Unique project or proposal identifier")
    research_novelty: Optional[float] = Field(None, ge=0.0, le=100.0, description="Novelty & scientific breakthroughs (0-100)")
    patent_strength: Optional[float] = Field(None, ge=0.0, le=100.0, description="Inline Patent Strength score (0-100)")
    technology_maturity: Optional[float] = Field(None, ge=0.0, le=100.0, description="Inline Technology Maturity score (0-100)")
    market_potential: Optional[float] = Field(None, ge=0.0, le=100.0, description="Addressable TAM & commercial viability (0-100)")
    funding_relevance: Optional[float] = Field(None, ge=0.0, le=100.0, description="Alignment with priority funding programs (0-100)")
    raw_metrics: Optional[RawMetrics] = Field(None, description="Optional raw bibliometric & patent fields for heuristic fallback")

    model_config = {
        "json_schema_extra": {
            "example": {
                "project_id": "PRJ-007",
                "research_novelty": 81.0,
                "patent_strength": 66.5,
                "technology_maturity": 58.0,
                "market_potential": 74.0,
                "funding_relevance": 75.0,
                "raw_metrics": {
                    "citation_count": 62,
                    "claim_count": 16,
                    "patent_family_size": 5,
                    "years_since_filing": 3
                }
            }
        }
    }

class BatchScoreRequest(BaseModel):
    projects: List[ScoreRequest] = Field(..., min_length=1, max_length=50, description="List of up to 50 projects to score concurrently")

class PillarDetail(BaseModel):
    value: float = Field(..., ge=0.0, le=100.0, description="Normalized score 0-100")
    weight: float = Field(..., ge=0.0, le=1.0, description="Pillar coefficient")
    contribution: float = Field(..., description="Calculated contribution to composite score (value * weight)")
    source: str = Field(..., description="Origin of signal: 'input', 'local_seed', 'heuristic', or 'http_patent_api'")
    is_fallback: bool = Field(..., description="True if value originated from synthetic or fallback provider")

class DerivedReadiness(BaseModel):
    score: float = Field(..., description="Readiness score 0-100")
    trl: int = Field(..., ge=1, le=9, description="Mapped Technology Readiness Level (1-9)")

class DerivedScores(BaseModel):
    innovation_potential: float = Field(..., description="Combined novelty, patent, and market potential")
    research_impact: float = Field(..., description="Scientific merit & funding relevance")
    technology_readiness: DerivedReadiness = Field(..., description="Maturity & TRL 1-9 classification")
    commercial_viability: float = Field(..., description="Market TAM & execution readiness")
    funding_attractiveness: float = Field(..., description="Investor & grant appeal")

class ExplanationDetail(BaseModel):
    top_drivers: List[str] = Field(..., description="Pillars with highest positive contribution")
    weakest_pillars: List[str] = Field(..., description="Limiting factor pillars with lowest scores")
    narrative: str = Field(..., description="Human-readable synthesis of the scoring rationale")

class ScoreResponse(BaseModel):
    project_id: str
    model_version: str = "1.0.0"
    innovation_score: float = Field(..., ge=0.0, le=100.0)
    band: str = Field(..., description="Qualitative category: Very High, High, Moderate, Low, Very Low")
    pillars: Dict[str, PillarDetail]
    derived_scores: DerivedScores
    explanation: ExplanationDetail
    computed_at: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "project_id": "PRJ-007",
                "model_version": "1.0.0",
                "innovation_score": 72.35,
                "band": "High",
                "pillars": {
                    "research_novelty": {"value": 81.0, "weight": 0.30, "contribution": 24.30, "source": "input", "is_fallback": False},
                    "patent_strength": {"value": 66.5, "weight": 0.20, "contribution": 13.30, "source": "local_seed", "is_fallback": True},
                    "technology_maturity": {"value": 58.0, "weight": 0.15, "contribution": 8.70, "source": "local_seed", "is_fallback": True},
                    "market_potential": {"value": 74.0, "weight": 0.20, "contribution": 14.80, "source": "input", "is_fallback": False},
                    "funding_relevance": {"value": 75.0, "weight": 0.15, "contribution": 11.25, "source": "input", "is_fallback": False}
                },
                "derived_scores": {
                    "innovation_potential": 74.90,
                    "research_impact": 76.18,
                    "technology_readiness": {"score": 62.53, "trl": 6},
                    "commercial_viability": 67.33,
                    "funding_attractiveness": 76.50
                },
                "explanation": {
                    "top_drivers": ["research_novelty", "funding_relevance"],
                    "weakest_pillars": ["technology_maturity"],
                    "narrative": "Strong research novelty and funding relevance position this project in the 'High' innovation band; technology maturity represents the primary growth opportunity."
                },
                "computed_at": "2026-09-02T10:15:00Z"
            }
        }
    }

class BatchScoreResponse(BaseModel):
    total_scored: int
    scores: List[ScoreResponse]

class WeightsConfigResponse(BaseModel):
    model_version: str
    primary_weights: Dict[str, float]
    derived_weights: Dict[str, Dict[str, float]]
    bands: List[Dict[str, Any]]

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    active_signal_provider: str
    database_connected: bool
