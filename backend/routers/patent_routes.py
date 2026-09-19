from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from datetime import date
from typing import Optional

from database import get_db
from models import PatentRecord
from patent_scoring import compute_patent_strength
router = APIRouter(prefix="/patents", tags=["Patents"])


@router.get("/search")
def search_patents(
    keyword: Optional[str] = Query(None, description="Search in title or abstract"),
    domain: Optional[str] = Query(None, description="Technology domain filter"),
    assignee: Optional[str] = Query(None, description="Assignee/company name"),
    filed_after: Optional[date] = Query(None, description="Filing date lower bound"),
    filed_before: Optional[date] = Query(None, description="Filing date upper bound"),
    db: Session = Depends(get_db)
):
    query = db.query(PatentRecord)
    filters = []

    if keyword:
        filters.append(
            (PatentRecord.title.ilike(f"%{keyword}%")) | (PatentRecord.abstract.ilike(f"%{keyword}%"))
        )
    if domain:
        filters.append(PatentRecord.technology_domain.ilike(f"%{domain}%"))
    if assignee:
        filters.append(PatentRecord.assignee.ilike(f"%{assignee}%"))
    if filed_after:
        filters.append(PatentRecord.filing_date >= filed_after)
    if filed_before:
        filters.append(PatentRecord.filing_date <= filed_before)

    if filters:
        query = query.filter(and_(*filters))

    results = query.all()


    all_citations = [p.citation_count or 0 for p in results]
    max_citation_count = max(all_citations) if all_citations else 1



    return {
    "count": len(results),
    "results": [
        {
            "id": p.id,
            "title": p.title,
            "assignee": p.assignee,
            "filing_date": p.filing_date,
            "technology_domain": p.technology_domain,
            "classification": p.classification,
            "citation_count": p.citation_count,
            "patent_strength": compute_patent_strength(
                p,
                max_citation_count
            ),
        }
        for p in results
    ],
}


@router.get("/clusters")
def get_patent_clusters(db: Session = Depends(get_db)):
    patents = db.query(PatentRecord).all()

    clusters = {}
    for p in patents:
        key = p.technology_domain or "Unclassified"
        if key not in clusters:
            clusters[key] = []
        clusters[key].append({
            "id": p.id,
            "title": p.title,
            "assignee": p.assignee,
            "classification": p.classification,
            "citation_count": p.citation_count,
        })

    return {
        "cluster_count": len(clusters),
        "clusters": [
            {
                "technology_domain": domain,
                "patent_count": len(items),
                "patents": items,
            }
            for domain, items in clusters.items()
        ],
    }


@router.get("/trends")
def get_patent_trends(db: Session = Depends(get_db)):
    results = (
        db.query(
            func.extract("year", PatentRecord.filing_date).label("year"),
            PatentRecord.technology_domain,
            func.count(PatentRecord.id).label("filing_count"),
        )
        .filter(PatentRecord.filing_date.isnot(None))
        .group_by("year", PatentRecord.technology_domain)
        .order_by("year")
        .all()
    )

    return {
        "trend_count": len(results),
        "trends": [
            {
                "year": int(r.year) if r.year else None,
                "technology_domain": r.technology_domain or "Unclassified",
                "filing_count": r.filing_count,
            }
            for r in results
        ],
    }