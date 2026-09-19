from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import (
    CommercializationResponse,
    LicensingOpportunity,
    StartupRecommendation,
    IndustryPartnership
)

router = APIRouter(prefix="/commercialization", tags=["Release — Commercialization Engine"])


@router.get("/recommendations/{project_id}", response_model=CommercializationResponse)
def get_commercialization_recommendations(project_id: int, db: Session = Depends(get_db)):
    """
    GET /commercialization/recommendations/{project_id}: Returns commercialization recommendations including:
    - Productization recommendations
    - Licensing opportunities
    - Startup creation recommendations
    - Industry partnership recommendations
    """
    return CommercializationResponse(
        project_id=project_id,
        project_title=f"DeepTech R&D Portfolio #{project_id}",
        overall_readiness_score=85.5,
        productization_recommendations=[
            "Package multi-agent reasoning framework into enterprise API SDK (TRL 7)",
            "Develop containerized microservice module for real-time patent landscape extraction",
            "Establish automated benchmark validation suites for enterprise compliance"
        ],
        licensing_opportunities=[
            LicensingOpportunity(
                title="Exclusive BioTech IP License for AI-Driven Drug Discovery",
                potential_licensee="Global Pharma Labs Inc.",
                estimated_royalty_range="$500K - $1.5M upfront + 3.5% royalty",
                readiness_level="High - Granted Patent Portfolio"
            ),
            LicensingOpportunity(
                title="Quantum Error Mitigation Software IP License",
                potential_licensee="Enterprise Quantum Hardware Corp",
                estimated_royalty_range="$250K/year enterprise site license",
                readiness_level="Medium - TRL 6 Lab Validation"
            )
        ],
        startup_creation_recommendations=[
            StartupRecommendation(
                title="InnovaAgent AI Inc. (Spin-off Entity)",
                incubation_stage="Seed / Accelerator Phase",
                target_funding_round="Pre-Seed / NSF SBIR Phase I ($300,000)",
                key_requirements=[
                    "File provisional PCT patent on multi-agent consensus protocol",
                    "Recruit co-founder for Chief Commercial Officer (CCO) role",
                    "Validate pilot integration with 3 enterprise beta customers"
                ]
            )
        ],
        industry_partnership_recommendations=[
            IndustryPartnership(
                partner_name="Google Cloud & DeepMind Academic Research Program",
                sector="Artificial Intelligence & Cloud Computing",
                collaboration_type="Joint R&D & TPU Compute Grant",
                value_proposition="Access to high-performance TPU v5e clusters & co-marketing rights"
            ),
            IndustryPartnership(
                partner_name="Toyota Energy Systems & Battery Research Lab",
                sector="CleanEnergy & Energy Storage",
                collaboration_type="Sponsored Research Agreement ($450K)",
                value_proposition="Pilot line validation for solid-state electrolyte formulation"
            )
        ]
    )
