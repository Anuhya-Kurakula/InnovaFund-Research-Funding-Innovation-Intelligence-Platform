from datetime import date
from models import PatentRecord


def compute_patent_strength(patent: PatentRecord, max_citation_count: int) -> float:
    """
    Returns a 0.0–1.0 'Patent Strength' score for a single patent.
    Combines citation impact (60%) and recency (40%).
    This is the signal Member 4 consumes as 20% of the weighted innovation score.
    """
    citation_score = (patent.citation_count / max_citation_count) if max_citation_count else 0

    if patent.filing_date:
        age_years = (date.today() - patent.filing_date).days / 365
        recency_score = max(0, 1 - (age_years / 20))  # patents older than 20 years score 0
    else:
        recency_score = 0

    return round((citation_score * 0.6) + (recency_score * 0.4), 4)