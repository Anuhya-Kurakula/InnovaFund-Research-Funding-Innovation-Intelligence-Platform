from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse

from app.core.config import get_settings
from database import engine, SessionLocal, Base, get_mongo_db
from models import Role, User
from auth import hash_password

from app.api import (
    auth as app_auth,
    profile as app_profile,
    assets as app_assets,
    admin as app_admin,
    users as app_users,
    funding as app_funding,
    trends as app_trends
)
from routers import (
    auth_routes,
    profile_routes,
    dataset_routes,
    admin_routes,
    grant_matching_routes,
    technology_routes,
    patent_landscape_routes,
    scoring_routes,
    commercialization_routes,
    recommendation_routes,
    portfolio_routes,
    trends_routes,
    patent_routes
)

settings = get_settings()
logger = logging.getLogger(__name__)

# Ensure tables are created
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        # Seed funding data
        try:
            from app.services.funding import seed_funding_data
            seed_funding_data(db)
        except Exception:
            pass
        
        # Seed default admin account
        admin = db.query(User).filter(User.email == "admin@researchsphere.ai").first()
        if not admin:
            admin = User(
                full_name="Platform Administrator",
                email="admin@researchsphere.ai",
                password_hash=hash_password("Admin@123456"),
                role=Role.ADMINISTRATOR.value,
                is_active=True
            )
            db.add(admin)
        db.commit()
    except Exception as e:
        logger.warning(f"Startup DB seed exception: {e}")
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Research Funding & Innovation Intelligence Platform API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Milestone 1 & 2 routes (/api/v1)
app.include_router(app_auth.router, prefix="/api/v1")
app.include_router(app_profile.router, prefix="/api/v1")
app.include_router(app_assets.router, prefix="/api/v1")
app.include_router(app_admin.router, prefix="/api/v1")
app.include_router(app_users.router, prefix="/api/v1")
app.include_router(app_funding.router, prefix="/api/v1")
app.include_router(app_trends.router, prefix="/api/v1")

# Mount Milestone 2 & 3 routes (/api and /api/v1)
app.include_router(auth_routes.router, prefix="/api")
app.include_router(profile_routes.router, prefix="/api")
app.include_router(dataset_routes.router, prefix="/api")
app.include_router(admin_routes.router, prefix="/api")
app.include_router(grant_matching_routes.router, prefix="/api")
app.include_router(grant_matching_routes.router, prefix="/api/v1")
app.include_router(technology_routes.router, prefix="/api")
app.include_router(technology_routes.router, prefix="/api/v1")
app.include_router(patent_landscape_routes.router, prefix="/api")
app.include_router(patent_landscape_routes.router, prefix="/api/v1")
app.include_router(scoring_routes.router, prefix="/api")
app.include_router(scoring_routes.router, prefix="/api/v1")
app.include_router(commercialization_routes.router, prefix="/api")
app.include_router(commercialization_routes.router, prefix="/api/v1")
app.include_router(recommendation_routes.router, prefix="/api")
app.include_router(recommendation_routes.router, prefix="/api/v1")
app.include_router(portfolio_routes.router, prefix="/api")
app.include_router(portfolio_routes.router, prefix="/api/v1")
app.include_router(portfolio_routes.router, prefix="/api/scoring")
app.include_router(trends_routes.router, prefix="/api")
app.include_router(trends_routes.router, prefix="/api/v1")
app.include_router(patent_routes.router, prefix="/api")
app.include_router(patent_routes.router, prefix="/api/v1")

# Root-level endpoints (/patents/search, /scoring/calculate, /commercialization/recommendations, etc.)
app.include_router(patent_landscape_routes.router)
app.include_router(technology_routes.router)
app.include_router(scoring_routes.router)
app.include_router(commercialization_routes.router)
app.include_router(recommendation_routes.router)
app.include_router(portfolio_routes.router)
app.include_router(trends_routes.router)
app.include_router(patent_routes.router)

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "ok",
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

@app.exception_handler(Exception)
async def unhandled_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"detail": str(exc)})
