"""
Configuration Settings for Innovation Scoring Service
Uses pydantic-settings to parse environment variables with resilient defaults.
"""

import os
from pydantic_settings import BaseSettings

class ScoringSettings(BaseSettings):
    PROJECT_NAME: str = "Innovation Scoring Engine"
    MODEL_VERSION: str = "1.0.0"
    API_PREFIX: str = "/scoring"
    
    # Standalone vs Integrated Mode
    STANDALONE: bool = os.getenv("STANDALONE", "false").lower() in ("true", "1", "yes")
    AUTH_REQUIRED: bool = os.getenv("AUTH_REQUIRED", "false").lower() in ("true", "1", "yes")
    
    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./innovation_scoring.db")
    
    # Signal Provider Configuration ('local' | 'heuristic' | 'http')
    SIGNAL_SOURCE: str = os.getenv("SIGNAL_SOURCE", "local")
    
    # External Teammate Service URLs
    PATENT_API_URL: str = os.getenv("PATENT_API_URL", "http://localhost:8000/api/patents")
    TECH_API_URL: str = os.getenv("TECH_API_URL", "http://localhost:8000/api/technology")
    HTTP_PROVIDER_TIMEOUT_SECONDS: float = float(os.getenv("HTTP_PROVIDER_TIMEOUT_SECONDS", "3.0"))
    
    # Heuristic Normalization Bounds (Tunable settings)
    MAX_CITATIONS: float = float(os.getenv("MAX_CITATIONS", "500.0"))
    MAX_CLAIMS: float = float(os.getenv("MAX_CLAIMS", "50.0"))
    MAX_FAMILY_SIZE: float = float(os.getenv("MAX_FAMILY_SIZE", "20.0"))
    MAX_FILING_YEARS: float = float(os.getenv("MAX_FILING_YEARS", "20.0"))
    
    # Server Host & Port
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8004"))

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = ScoringSettings()
