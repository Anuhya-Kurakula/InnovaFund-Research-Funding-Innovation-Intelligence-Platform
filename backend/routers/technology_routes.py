from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from services.technology_intelligence_service import TechnologyIntelligenceService
from schemas import (
    EmergingTechTrendResponse,
    TechnologyMaturityResponse,
    CompetitorActivityResponse
)

router = APIRouter(prefix="/technology", tags=["Release — Technology Intelligence Engine"])


@router.get("/emerging", response_model=List[EmergingTechTrendResponse])
def get_emerging_technologies(
    category: Optional[str] = Query(None, description="Optional technology category filter e.g. 'Artificial Intelligence', 'CleanEnergy'"),
    db: Session = Depends(get_db)
):
    """
    Deliverable: Returns top emerging technology domains identified from 
    patent filing rates and academic publication velocity.
    """
    service = TechnologyIntelligenceService(db)
    return service.get_emerging_technologies(category=category)


@router.get("/maturity", response_model=List[TechnologyMaturityResponse])
def get_technology_maturity(
    domain_name: Optional[str] = Query(None, description="Optional domain filter e.g. 'Generative AI', 'Quantum'"),
    db: Session = Depends(get_db)
):
    """
    Deliverable: Classifies technology lifecycle stage (Emerging, Growth, Mature, Declining) 
    and returns Technology Maturity Score (0-100).
    
    *Integration Note for *: This maturity_score supplies 15% of the weighted score to s Innovation Model.
    """
    service = TechnologyIntelligenceService(db)
    return service.get_technology_maturity(domain_name=domain_name)


@router.get("/competitors", response_model=List[CompetitorActivityResponse])
def get_technology_competitors(
    domain_name: Optional[str] = Query(None, description="Optional domain name filter"),
    db: Session = Depends(get_db)
):
    """
    Deliverable: Returns competitive technology monitoring and top patent assignees per domain.
    """
    service = TechnologyIntelligenceService(db)
    return service.get_competitors(domain_name=domain_name)
