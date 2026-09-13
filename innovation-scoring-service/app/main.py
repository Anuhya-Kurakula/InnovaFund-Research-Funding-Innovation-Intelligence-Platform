"""
Innovation Scoring Engine - Main Application Entry Point
Supports both standalone execution and unified microservice mount.
"""

import sys
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure service directory is on python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import settings
from app.core.weights import validate_weights
from app.db.session import init_db
from app.api.routes_scoring import router as scoring_router
from app.api.routes_health import router as health_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("innovation-scoring")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: validate weights
    logger.info("Starting Innovation Scoring Engine...")
    validate_weights()
    logger.info("Weights validated: primary and derived weights sum to 1.0.")
    
    # Initialize DB tables (SQLite auto-creation)
    init_db()
    logger.info(f"Database initialized with URL: {settings.DATABASE_URL}")
    logger.info(f"Active Signal Provider: {settings.SIGNAL_SOURCE}")
    
    yield
    
    logger.info("Shutting down Innovation Scoring Engine.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Standalone Innovation Scoring microservice for Research Funding & Innovation Intelligence Platform (Milestone 3)",
    version=settings.MODEL_VERSION,
    lifespan=lifespan
)

# Enable permissive CORS in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(scoring_router)
app.include_router(health_router)

@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.MODEL_VERSION,
        "status": "online",
        "docs_url": "/docs",
        "active_signal_provider": settings.SIGNAL_SOURCE
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
