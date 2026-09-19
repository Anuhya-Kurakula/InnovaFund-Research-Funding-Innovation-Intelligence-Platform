import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Research Funding & Innovation Intelligence Platform"
    environment: str = "development"
    api_prefix: str = "/api/v1"

    cors_origins: str = "http://localhost:5173"
    database_url: str = "postgresql+psycopg://rfip:rfip@localhost:5432/rfip"
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_database: str = "rfip"
    jwt_secret: str = "CHANGE_ME_IN_ENV"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    openalex_base_url: str = "https://api.openalex.org"
    openalex_api_key: str | None = None
    patents_provider: str = "local"
    patentsview_base_url: str = "https://search.patentsview.org/api/v1"
    patentsview_api_key: str | None = None
    local_patent_dataset: str = "data/patents_public_sample.json"

    # Compatibility attributes for Release/3 routers
    PROJECT_NAME: str = "Research Funding & Innovation Intelligence Platform"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    ENV: str = "development"
    SECRET_KEY: str = "super-secret-key-change-in-production-innovafund-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    POSTGRES_URL: str = "postgresql://postgres:postgres@localhost:5433/funding_innovation_platform"
    MONGO_URL: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "funding_innovation_platform"
    OPENALEX_MAILTO: str = "admin@innovafund.ai"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
