import logging
from datetime import date, datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from models import Base, FundingOpportunity, FundingSource, ResearchProfile, User, ResearchInterest
from schemas import (
    GrantMatchRequest,
    GrantMatchResponse,
    EligibilityMatchResult,
    CriteriaMatchDetail,
    FundingOpportunityResponse,
    MatchingRulesConfig
)

logger = logging.getLogger(__name__)


class GrantMatchingRulesEngine:
    """
    Grant Matching Workflows Engine (Backend)
    
    Evaluates research profiles against funding opportunity criteria (domain, career stage, 
    geography, funding type, deadline). Configurable rules allow tuning weights without code changes.
    """

    def __init__(self, config: Optional[MatchingRulesConfig] = None):
        self.config = config or MatchingRulesConfig()

    def update_config(self, new_config: MatchingRulesConfig) -> MatchingRulesConfig:
        self.config = new_config
        config_data = self.config.model_dump() if hasattr(self.config, 'model_dump') else self.config.dict()
        logger.info(f"Updated Grant Matching rules config: {config_data}")
        return self.config


    def evaluate_opportunity(
        self,
        opp: FundingOpportunity,
        request: GrantMatchRequest,
        today: Optional[date] = None
    ) -> EligibilityMatchResult:
        if today is None:
            today = date.today()

        breakdown: List[CriteriaMatchDetail] = []
        rejection_reasons: List[str] = []
        is_eligible = True

        # -------------------------------------------------------------
        # 1. Deadline & Status Check (Mandatory Rule)
        # -------------------------------------------------------------
        is_past_deadline = opp.deadline < today
        if is_past_deadline:
            if self.config.strict_deadline_check and not request.include_expired:
                is_eligible = False
                rejection_reasons.append(f"Grant deadline expired on {opp.deadline.strftime('%Y-%m-%d')}")
            
            breakdown.append(CriteriaMatchDetail(
                criterion="Deadline",
                status="EXPIRED",
                score=0.0,
                weight=0.0,
                message=f"Deadline passed on {opp.deadline.strftime('%Y-%m-%d')}"
            ))
        else:
            breakdown.append(CriteriaMatchDetail(
                criterion="Deadline",
                status="MATCHED",
                score=100.0,
                weight=0.0,
                message=f"Open (Deadline: {opp.deadline.strftime('%Y-%m-%d')})"
            ))

        # -------------------------------------------------------------
        # 2. Research Domain Match (Weight: 35.0%)
        # -------------------------------------------------------------
        domain_weight = self.config.domain_weight
        domain_score = 0.0
        opp_domain = (opp.research_domain or "").strip().lower()

        if not request.research_domains:
            # If user specified no domains, default partial
            domain_score = 50.0
            domain_status = "PARTIAL"
            domain_msg = "No researcher domain specified; partial default match"
        else:
            matched_domains = []
            for user_dom in request.research_domains:
                user_dom_clean = user_dom.strip().lower()
                if user_dom_clean in opp_domain or opp_domain in user_dom_clean:
                    matched_domains.append(user_dom)
                # Category similarity checks
                elif any(kw in opp_domain for kw in ["ai", "machine learning", "deep learning", "nlp"]) and \
                     any(kw in user_dom_clean for kw in ["ai", "computer science", "data science"]):
                    matched_domains.append(user_dom)
                elif any(kw in opp_domain for kw in ["bio", "health", "pharma"]) and \
                     any(kw in user_dom_clean for kw in ["bio", "medicine", "health"]):
                    matched_domains.append(user_dom)
                elif any(kw in opp_domain for kw in ["climate", "clean", "energy", "sustainability"]) and \
                     any(kw in user_dom_clean for kw in ["climate", "energy", "environment"]):
                    matched_domains.append(user_dom)

            if len(matched_domains) > 0:
                domain_score = 100.0
                domain_status = "MATCHED"
                domain_msg = f"Matched domain: '{opp.research_domain}' with researcher interests ({', '.join(matched_domains)})"
            else:
                domain_score = 0.0
                domain_status = "MISMATCHED"
                domain_msg = f"Grant domain '{opp.research_domain}' does not match researcher domains"
                rejection_reasons.append(f"Domain mismatch: Grant target '{opp.research_domain}' vs Researcher '{', '.join(request.research_domains)}'")

        breakdown.append(CriteriaMatchDetail(
            criterion="Research Domain",
            status=domain_status,
            score=domain_score,
            weight=domain_weight,
            message=domain_msg
        ))

        # -------------------------------------------------------------
        # 3. Career Stage Match (Weight: 25.0%)
        # -------------------------------------------------------------
        career_weight = self.config.career_stage_weight
        career_score = 0.0
        opp_stage = (opp.career_stage or "Any").strip().lower()
        user_stage = (request.career_stage or "Any").strip().lower()

        if opp_stage in ["any", "all"] or user_stage in ["any", "all"]:
            career_score = 100.0
            career_status = "MATCHED"
            career_msg = f"Open to all career stages ({opp.career_stage})"
        elif opp_stage == user_stage:
            career_score = 100.0
            career_status = "MATCHED"
            career_msg = f"Exact career stage match ({opp.career_stage})"
        elif "early" in opp_stage and "mid" in user_stage:
            career_score = 60.0
            career_status = "PARTIAL"
            career_msg = f"Partial match: Grant targets {opp.career_stage}, researcher is {request.career_stage}"
        elif "startup" in opp_stage and "startup" in user_stage:
            career_score = 100.0
            career_status = "MATCHED"
            career_msg = "Startup/SME entrepreneur match"
        else:
            career_score = 0.0
            career_status = "MISMATCHED"
            career_msg = f"Career stage mismatch: Grant requires {opp.career_stage}, researcher is {request.career_stage}"
            rejection_reasons.append(f"Career stage mismatch: Requires '{opp.career_stage}'")

        breakdown.append(CriteriaMatchDetail(
            criterion="Career Stage",
            status=career_status,
            score=career_score,
            weight=career_weight,
            message=career_msg
        ))

        # -------------------------------------------------------------
        # 4. Geographical Eligibility Match (Weight: 25.0%)
        # -------------------------------------------------------------
        geo_weight = self.config.geography_weight
        geo_score = 0.0
        opp_geo = (opp.eligible_geography or "Global").strip().lower()
        user_geo = (request.geography or "Global").strip().lower()

        if opp_geo in ["global", "international", "worldwide"] or user_geo in ["global", "worldwide"]:
            geo_score = 100.0
            geo_status = "MATCHED"
            geo_msg = f"Globally accessible grant opportunity ({opp.eligible_geography})"
        elif opp_geo == user_geo or user_geo in opp_geo or opp_geo in user_geo:
            geo_score = 100.0
            geo_status = "MATCHED"
            geo_msg = f"Geographical match ({opp.eligible_geography})"
        else:
            geo_score = 0.0
            geo_status = "MISMATCHED"
            geo_msg = f"Geography restriction: Grant restricted to {opp.eligible_geography}, researcher located in {request.geography}"
            if self.config.strict_geography_check:
                is_eligible = False
                rejection_reasons.append(f"Geographical restriction: Grant targets '{opp.eligible_geography}'")

        breakdown.append(CriteriaMatchDetail(
            criterion="Geographical Eligibility",
            status=geo_status,
            score=geo_score,
            weight=geo_weight,
            message=geo_msg
        ))

        # -------------------------------------------------------------
        # 5. Funding Type Match (Weight: 15.0%)
        # -------------------------------------------------------------
        type_weight = self.config.funding_type_weight
        type_score = 0.0
        opp_type = (opp.funding_type or "Grant").strip().lower()

        if not request.funding_types:
            type_score = 100.0
            type_status = "MATCHED"
            type_msg = f"Funding type {opp.funding_type}"
        else:
            matched_types = [ft for ft in request.funding_types if ft.strip().lower() in opp_type or opp_type in ft.strip().lower()]
            if len(matched_types) > 0:
                type_score = 100.0
                type_status = "MATCHED"
                type_msg = f"Funding type match: {opp.funding_type}"
            else:
                type_score = 40.0
                type_status = "PARTIAL"
                type_msg = f"Funding type '{opp.funding_type}' differs from preferred ({', '.join(request.funding_types)})"

        breakdown.append(CriteriaMatchDetail(
            criterion="Funding Type",
            status=type_status,
            score=type_score,
            weight=type_weight,
            message=type_msg
        ))

        # -------------------------------------------------------------
        # Overall Score & Status Determination
        # -------------------------------------------------------------
        total_weights = domain_weight + career_weight + geo_weight + type_weight
        weighted_score = (
            (domain_score * domain_weight) +
            (career_score * career_weight) +
            (geo_score * geo_weight) +
            (type_score * type_weight)
        ) / (total_weights if total_weights > 0 else 100.0)

        # Status categorization
        if is_past_deadline and self.config.strict_deadline_check and not request.include_expired:
            eligibility_status = "EXPIRED"
            is_eligible = False
        elif not is_eligible or weighted_score < self.config.min_pass_threshold:
            eligibility_status = "INELIGIBLE"
            is_eligible = False
        elif weighted_score >= 80.0 and len(rejection_reasons) == 0:
            eligibility_status = "ELIGIBLE"
            is_eligible = True
        else:
            eligibility_status = "PARTIAL_MATCH"
        if hasattr(FundingOpportunityResponse, 'model_validate'):
            opp_response = FundingOpportunityResponse.model_validate(opp)
        else:
            opp_response = FundingOpportunityResponse.from_orm(opp)


        return EligibilityMatchResult(
            opportunity=opp_response,
            eligibility_status=eligibility_status,
            is_eligible=is_eligible,
            overall_eligibility_score=round(weighted_score, 2),
            criteria_breakdown=breakdown,
            rejection_reasons=rejection_reasons
        )


def seed_funding_opportunities_if_empty(db: Session):
    """
    Seeds PostgreSQL with representative sample funding records from all 6 sources 
    specified in Release (Data Hand-off Bridge).
    """
    try:
        bind_engine = db.get_bind()
        Base.metadata.create_all(bind=bind_engine)
        
        # Run auto-healing schema check for missing columns on old dev database files
        from database import auto_migrate_schema
        auto_migrate_schema(bind_engine)

        count = db.query(FundingOpportunity).count()
        if count >= 15:
            return

        logger.info("Seeding 20+ Release & 3 Funding Opportunities across Global Agencies...")

        sources_data = [
            {"name": "National Science Foundation (NSF)", "source_type": "Government Grants", "country": "US", "website": "https://nsf.gov"},
            {"name": "Horizon Europe", "source_type": "Research Councils", "country": "EU", "website": "https://ec.europa.eu/info/research-and-innovation"},
            {"name": "European Innovation Council (EIC)", "source_type": "Innovation Funds", "country": "EU", "website": "https://eic.ec.europa.eu"},
            {"name": "Y Combinator BioTech", "source_type": "Startup Accelerators", "country": "US", "website": "https://ycombinator.com"},
            {"name": "Breakthrough Energy Ventures", "source_type": "Venture Programs", "country": "Global", "website": "https://breakthroughenergy.org"},
            {"name": "Bill & Melinda Gates Foundation", "source_type": "Int'l Funding Agencies", "country": "Global", "website": "https://gatesfoundation.org"},
            {"name": "National Institutes of Health (NIH)", "source_type": "Government Grants", "country": "US", "website": "https://nih.gov"},
            {"name": "DARPA Defense Sciences", "source_type": "Government R&D", "country": "US", "website": "https://darpa.mil"},
            {"name": "Google Research Grants", "source_type": "Enterprise Innovation", "country": "Global", "website": "https://research.google"},
            {"name": "ARPA-E Energy Innovation", "source_type": "Government Grants", "country": "US", "website": "https://arpa-e.energy.gov"},
            {"name": "UK Research and Innovation (UKRI)", "source_type": "Research Councils", "country": "UK", "website": "https://ukri.org"},
            {"name": "DST India Science & Tech Fund", "source_type": "Government Grants", "country": "India", "website": "https://dst.gov.in"},
        ]

        source_map = {}
        for s in sources_data:
            db_source = db.query(FundingSource).filter(FundingSource.name == s["name"]).first()
            if not db_source:
                db_source = FundingSource(**s)
                db.add(db_source)
                db.flush()
            source_map[s["name"]] = db_source.id

        sample_grants = [
            {
                "source_id": source_map["National Science Foundation (NSF)"],
                "title": "NSF SBIR Phase II: Artificial Intelligence & Quantum Computing Commercialization",
                "agency": "National Science Foundation",
                "description": "Commercialization grant for AI and Quantum Computing deeptech startups.",
                "grant_amount": 1000000,
                "currency": "USD",
                "deadline": date(2026, 11, 30),
                "status": "Open",
                "research_domain": "Artificial Intelligence",
                "career_stage": "Early-Career",
                "eligible_geography": "US",
                "funding_type": "Grant",
                "external_link": "https://seedfund.nsf.gov/portfolio/"
            },
            {
                "source_id": source_map["Horizon Europe"],
                "title": "Horizon Europe Green Deal: Clean Energy & Decarbonization Innovations",
                "agency": "European Commission",
                "description": "R&D research grant for renewable energy, hydrogen storage, and carbon capture.",
                "grant_amount": 2500000,
                "currency": "USD",
                "deadline": date(2026, 12, 15),
                "status": "Open",
                "research_domain": "Climate & CleanEnergy",
                "career_stage": "Mid-Career",
                "eligible_geography": "EU",
                "funding_type": "Grant",
                "external_link": "https://ec.europa.eu/info/funding-tenders"
            },
            {
                "source_id": source_map["European Innovation Council (EIC)"],
                "title": "EIC Accelerator Challenge: DeepTech Medical Devices & BioTech",
                "agency": "EIC Accelerator",
                "description": "Blended grant and equity investment for high-risk biotechnology startups.",
                "grant_amount": 1500000,
                "currency": "USD",
                "deadline": date(2026, 10, 20),
                "status": "Open",
                "research_domain": "Biotechnology",
                "career_stage": "Startup/SME",
                "eligible_geography": "Global",
                "funding_type": "Accelerator",
                "external_link": "https://eic.ec.europa.eu/eic-funding-opportunities_en"
            },
            {
                "source_id": source_map["Bill & Melinda Gates Foundation"],
                "title": "Grand Challenges Global Health: AI for Diagnostic Medicine",
                "agency": "Gates Foundation",
                "description": "Global research initiative for deploying machine learning diagnostics in low-resource settings.",
                "grant_amount": 500000,
                "currency": "USD",
                "deadline": date(2026, 9, 30),
                "status": "Open",
                "research_domain": "Biotechnology",
                "career_stage": "Any",
                "eligible_geography": "Global",
                "funding_type": "Grant",
                "external_link": "https://gcgh.gatesfoundation.org/"
            },
            {
                "source_id": source_map["Y Combinator BioTech"],
                "title": "Y Combinator BioTech & Healthcare Seed Program",
                "agency": "Y Combinator",
                "description": "Early stage accelerator investment and mentorship for life science founders.",
                "grant_amount": 500000,
                "currency": "USD",
                "deadline": date(2026, 8, 15),
                "status": "Open",
                "research_domain": "Biotechnology",
                "career_stage": "Early-Career",
                "eligible_geography": "Global",
                "funding_type": "Accelerator",
                "external_link": "https://ycombinator.com/apply"
            },
            {
                "source_id": source_map["Breakthrough Energy Ventures"],
                "title": "Breakthrough Energy Fellowship: Next-Gen Battery Storage",
                "agency": "Breakthrough Energy",
                "description": "Fellowship supporting innovators working on zero-emission energy storage.",
                "grant_amount": 750000,
                "currency": "USD",
                "deadline": date(2025, 12, 31),
                "status": "Expired",
                "research_domain": "Climate & CleanEnergy",
                "career_stage": "Senior/Lead",
                "eligible_geography": "Global",
                "funding_type": "Fellowship",
                "external_link": "https://breakthroughenergy.org/fellows"
            },
            {
                "source_id": source_map["National Institutes of Health (NIH)"],
                "title": "NIH R01 Research Project Grant: Genomics & Precision Therapeutics",
                "agency": "National Institutes of Health",
                "description": "Funding for health-related research into gene editing, mRNA delivery, and precision oncology.",
                "grant_amount": 2000000,
                "currency": "USD",
                "deadline": date(2026, 11, 10),
                "status": "Open",
                "research_domain": "Biotechnology",
                "career_stage": "Senior/Lead",
                "eligible_geography": "US",
                "funding_type": "Grant",
                "external_link": "https://grants.nih.gov/grants/funding/r01.htm"
            },
            {
                "source_id": source_map["DARPA Defense Sciences"],
                "title": "DARPA Young Faculty Award: Autonomous Robotics & Swarm Intelligence",
                "agency": "DARPA",
                "description": "Grant designed to identify rising research stars developing next-gen autonomous drone swarms.",
                "grant_amount": 1200000,
                "currency": "USD",
                "deadline": date(2026, 10, 15),
                "status": "Open",
                "research_domain": "Artificial Intelligence",
                "career_stage": "Early-Career",
                "eligible_geography": "US",
                "funding_type": "Grant",
                "external_link": "https://darpa.mil/work-with-us/yfa"
            },
            {
                "source_id": source_map["Google Research Grants"],
                "title": "Google Focused Research Award: Foundation AI & LLM Reasoning",
                "agency": "Google Research",
                "description": "Unrestricted grant awards supporting academic faculty advancing large language model efficiency.",
                "grant_amount": 350000,
                "currency": "USD",
                "deadline": date(2026, 9, 15),
                "status": "Open",
                "research_domain": "Artificial Intelligence",
                "career_stage": "Mid-Career",
                "eligible_geography": "Global",
                "funding_type": "Grant",
                "external_link": "https://research.google/outreach/faculty-research-awards/"
            },
            {
                "source_id": source_map["ARPA-E Energy Innovation"],
                "title": "ARPA-E OPEN 2026: Disruptive Solid-State Fusion & Grid Technologies",
                "agency": "ARPA-E",
                "description": "High-risk, high-reward funding for transformative energy technologies and fusion energy prototypes.",
                "grant_amount": 3000000,
                "currency": "USD",
                "deadline": date(2026, 12, 1),
                "status": "Open",

                "research_domain": "Climate & CleanEnergy",
                "career_stage": "Startup/SME",
                "eligible_geography": "US",
                "funding_type": "R&D Subsidy",
                "external_link": "https://arpa-e.energy.gov/open"
            },
            {
                "source_id": source_map["UK Research and Innovation (UKRI)"],
                "title": "UKRI Future Leaders Fellowship: Quantum Communication & Photonics",
                "agency": "UKRI",
                "description": "Long-term fellowship supporting ambitious early-career researchers establishing quantum labs in the UK.",
                "grant_amount": 1800000,
                "currency": "USD",
                "deadline": date(2026, 11, 25),
                "status": "Open",
                "research_domain": "Quantum Computing",
                "career_stage": "Early-Career",
                "eligible_geography": "UK",
                "funding_type": "Fellowship",
                "external_link": "https://ukri.org/opportunity/future-leaders-fellowships/"
            },
            {
                "source_id": source_map["DST India Science & Tech Fund"],
                "title": "DST-SERB Core Research Grant: DeepTech & Cyber-Physical Systems",
                "agency": "Department of Science and Technology (India)",
                "description": "Research grant promoting frontier scientific breakthroughs in AI, IoT, and smart manufacturing.",
                "grant_amount": 600000,
                "currency": "USD",
                "deadline": date(2026, 10, 5),
                "status": "Open",

                "research_domain": "Artificial Intelligence",
                "career_stage": "Mid-Career",
                "eligible_geography": "India",
                "funding_type": "Grant",
                "external_link": "https://serbonline.in/"
            }
        ]

        for g in sample_grants:
            try:
                db_opp = FundingOpportunity(**g)
                db.add(db_opp)
            except Exception:
                g_copy = {k: v for k, v in g.items() if k != "source_id"}
                db_opp = FundingOpportunity(**g_copy)
                db.add(db_opp)

        db.commit()
        logger.info(f"Successfully seeded {len(sample_grants)} funding opportunities.")
    except Exception as e:
        logger.error(f"Error seeding funding opportunities: {e}")
        db.rollback()
