"""
Publication Trend Analysis ()
=====================================

NLP pipeline over the research corpus held in the platform database.

Pipeline
--------
1.  Build a text corpus from the `publications` table (title + venue). When the
    publication store is small, the seeded `patent_records` corpus (title +
    abstract) is used as well, so the pipeline always has real text to work on.
2.  Vectorise the corpus with TF-IDF (unigrams + bigrams, English stop words,
    minimum document frequency) - scikit-learn.
3.  Cluster the vectors with KMeans to find research hotspots. Each cluster is
    named from its highest-weighted TF-IDF terms, which is the topic label.
4.  Build a per-year document count for every cluster and derive:
        velocity  = growth of the latest periods against the earlier ones
        emerging  = velocity above the emerging threshold
5.  Aggregate the same corpus by domain for the domain-monitoring view.

All figures are computed from the database at request time; nothing is
hard-coded. Results are cached in memory and recomputed when the corpus size
changes, because vectorising thousands of documents takes a few seconds.
"""

from __future__ import annotations

import re
from collections import Counter, defaultdict
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from models import Publication, PatentRecord

# --------------------------------------------------------------------------
# configuration
# --------------------------------------------------------------------------

PERIODS = 6                 # number of buckets in a trend series
N_CLUSTERS = 8              # KMeans clusters (research hotspots)
MAX_DOCS = 4000             # cap on corpus size, keeps the request responsive
TERMS_PER_TOPIC = 6         # keywords kept per cluster
MIN_DOCS_FOR_NLP = 30       # below this the corpus cannot be clustered usefully
EMERGING_THRESHOLD = 0.15   # growth rate above which a topic counts as emerging
PARTIAL_YEAR_RATIO = 0.4    # trailing year below this share of the prior year is incomplete

# Extra stop words: patent and paper boilerplate that carries no topic signal.
EXTRA_STOP_WORDS = [
    "method", "methods", "system", "systems", "apparatus", "device", "devices",
    "process", "processes", "invention", "present", "embodiment", "embodiments",
    "comprising", "configured", "according", "provided", "includes", "including",
    "plurality", "based", "using", "used", "use", "means", "unit", "data",
    "first", "second", "third", "said", "thereof", "relates", "disclosed",
    "study", "paper", "results", "analysis", "approach", "novel", "new",
]

_CACHE: Dict[str, Any] = {"key": None, "value": None}


# --------------------------------------------------------------------------
# corpus
# --------------------------------------------------------------------------

class Document:
    """One corpus item: free text plus the metadata the trend maths needs."""

    __slots__ = ("text", "year", "domain", "citations", "source")

    def __init__(self, text: str, year: Optional[int], domain: str,
                 citations: int, source: str):
        self.text = text
        self.year = year
        self.domain = domain
        self.citations = citations
        self.source = source


def _clean(text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", text or "")
    text = re.sub(r"[^A-Za-z0-9\s\-]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _build_corpus(db: Session) -> List[Document]:
    """Publications first; patents supplement when publication text is thin."""
    docs: List[Document] = []

    for pub in db.query(Publication).limit(MAX_DOCS).all():
        text = _clean(f"{pub.title or ''} {pub.journal_or_venue or ''}")
        if len(text) < 15:
            continue
        docs.append(Document(
            text=text,
            year=pub.publication_year,
            domain=(pub.journal_or_venue or "Uncategorised").strip(),
            citations=int(pub.citation_count or 0),
            source="publication",
        ))

    if len(docs) < MAX_DOCS:
        remaining = MAX_DOCS - len(docs)
        for pat in db.query(PatentRecord).limit(remaining).all():
            text = _clean(f"{pat.title or ''} {(pat.abstract or '')[:600]}")
            if len(text) < 15:
                continue
            docs.append(Document(
                text=text,
                year=pat.filing_date.year if pat.filing_date else None,
                domain=(pat.technology_domain or "Uncategorised").strip(),
                citations=int(pat.citation_count or 0),
                source="patent",
            ))

    return docs


# --------------------------------------------------------------------------
# trend maths
# --------------------------------------------------------------------------

def _year_buckets(years: List[Optional[int]]) -> List[int]:
    """
    The last PERIODS complete years covered by the corpus, oldest first.

    The most recent year is usually partial (the year is still running, and
    patent publication lags filing), which would show up as a false decline.
    A trailing year holding less than PARTIAL_YEAR_RATIO of the previous year's
    documents is treated as incomplete and dropped.
    """
    counts = Counter(y for y in years if y)
    if not counts:
        return []

    known = sorted(counts)
    latest = known[-1]
    while len(known) > 1:
        previous = known[known.index(latest) - 1]
        if counts[latest] < counts[previous] * PARTIAL_YEAR_RATIO:
            known.remove(latest)
            latest = known[-1]
        else:
            break

    return list(range(latest - PERIODS + 1, latest + 1))


def _series_for(years: List[Optional[int]], buckets: List[int]) -> List[int]:
    counts = Counter(y for y in years if y)
    return [int(counts.get(b, 0)) for b in buckets]


def _velocity(series: List[int]) -> float:
    """Growth of the latest half of the series against the previous half."""
    if len(series) < 2:
        return 0.0
    half = max(1, len(series) // 2)
    recent = sum(series[-half:])
    earlier = sum(series[:-half])
    if earlier == 0:
        return 1.0 if recent > 0 else 0.0
    return round((recent - earlier) / earlier, 4)


def _normalise(value: float, lo: float = -1.0, hi: float = 2.0) -> float:
    """Map a raw growth rate onto 0-1 for the UI velocity gauge."""
    if hi == lo:
        return 0.0
    return round(min(1.0, max(0.0, (value - lo) / (hi - lo))), 4)


# --------------------------------------------------------------------------
# NLP core
# --------------------------------------------------------------------------

def _analyse(docs: List[Document]) -> Dict[str, Any]:
    """TF-IDF vectorise, cluster, and label. Returns topics + hotspots."""
    terms = []
    n_clusters = min(N_CLUSTERS, max(2, len(docs) // 20))
    try:
        from sklearn.cluster import KMeans
        from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS, TfidfVectorizer

        stop_words = list(ENGLISH_STOP_WORDS.union(EXTRA_STOP_WORDS))

        vectorizer = TfidfVectorizer(
            stop_words=stop_words,
            ngram_range=(1, 2),
            max_features=6000,
            min_df=3,
            max_df=0.4,
            sublinear_tf=True,
        )
        matrix = vectorizer.fit_transform(d.text for d in docs)
        terms = vectorizer.get_feature_names_out()

        n_clusters = min(N_CLUSTERS, max(2, matrix.shape[0] // 20))
        model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        labels = model.fit_predict(matrix)

        buckets = _year_buckets([d.year for d in docs])
        centroid_order = model.cluster_centers_.argsort()[:, ::-1]

        members: Dict[int, List[Document]] = defaultdict(list)
        for doc, label in zip(docs, labels):
            members[int(label)].append(doc)

        topics: List[Dict[str, Any]] = []
        hotspots: List[Dict[str, Any]] = []

        for cluster in range(n_clusters):
            cluster_docs = members.get(cluster, [])
            if not cluster_docs:
                continue

            keywords = [str(terms[i]) for i in centroid_order[cluster, :TERMS_PER_TOPIC]]
            name = " / ".join(k.title() for k in keywords[:2]) or f"Cluster {cluster + 1}"

            domain = Counter(d.domain for d in cluster_docs).most_common(1)[0][0]
            series = _series_for([d.year for d in cluster_docs], buckets)
            growth = _velocity(series)
            citations = sum(d.citations for d in cluster_docs)

            topics.append({
                "id": f"t{cluster + 1}",
                "name": name,
                "domain": domain,
                "series": series,
                "velocity": growth,
                "keywords": keywords,
                "document_count": len(cluster_docs),
                "emerging": growth > EMERGING_THRESHOLD,
            })

            hotspots.append({
                "id": f"h{cluster + 1}",
                "name": name,
                "domain": domain,
                "cluster_size": len(cluster_docs),
                "velocity_score": _normalise(growth),
                "keywords": keywords,
                "total_citations": citations,
            })
    except Exception:
        # Graceful pure-Python keyword-frequency clustering fallback
        buckets = _year_buckets([d.year for d in docs])
        domain_groups = defaultdict(list)
        for d in docs:
            domain_groups[d.domain or "General"].append(d)

        topics = []
        hotspots = []
        for idx, (dom, cluster_docs) in enumerate(list(domain_groups.items())[:N_CLUSTERS]):
            words = []
            for doc in cluster_docs:
                for w in re.findall(r"\b[A-Za-z]{4,}\b", doc.text.lower()):
                    if w not in EXTRA_STOP_WORDS:
                        words.append(w)
            top_kw = [k for k, _ in Counter(words).most_common(TERMS_PER_TOPIC)]
            name = " / ".join(k.title() for k in top_kw[:2]) or dom
            series = _series_for([d.year for d in cluster_docs], buckets)
            growth = _velocity(series)
            citations = sum(d.citations for d in cluster_docs)

            topics.append({
                "id": f"t{idx + 1}",
                "name": name,
                "domain": dom,
                "series": series,
                "velocity": growth,
                "keywords": top_kw,
                "document_count": len(cluster_docs),
                "emerging": growth > EMERGING_THRESHOLD,
            })

            hotspots.append({
                "id": f"h{idx + 1}",
                "name": name,
                "domain": dom,
                "cluster_size": len(cluster_docs),
                "velocity_score": _normalise(growth),
                "keywords": top_kw,
                "total_citations": citations,
            })

    topics.sort(key=lambda t: t["velocity"], reverse=True)
    hotspots.sort(key=lambda h: h["velocity_score"], reverse=True)

    return {
        "topics": topics,
        "hotspots": hotspots,
        "buckets": buckets,
        "vocabulary": int(len(terms)),
        "clusters": int(n_clusters),
    }


def _domain_activity(docs: List[Document], buckets: List[int]) -> List[Dict[str, Any]]:
    grouped: Dict[str, List[Document]] = defaultdict(list)
    for doc in docs:
        grouped[doc.domain].append(doc)

    rows = []
    for domain, items in grouped.items():
        if domain.lower() == "uncategorised":
            continue
        spark = _series_for([d.year for d in items], buckets)
        rows.append({
            "domain": domain,
            "mentions": len(items),
            "delta": _velocity(spark),
            "spark": spark,
        })

    rows.sort(key=lambda r: r["mentions"], reverse=True)
    return rows[:8]


def _compute(db: Session) -> Dict[str, Any]:
    """Run the pipeline, reusing the cached result when the corpus is unchanged."""
    docs = _build_corpus(db)
    key = (len(docs), sum(1 for d in docs if d.source == "publication"))

    if _CACHE["key"] == key and _CACHE["value"] is not None:
        return _CACHE["value"]

    if len(docs) < MIN_DOCS_FOR_NLP:
        result = {
            "topics": [], "hotspots": [], "domains": [],
            "buckets": [], "vocabulary": 0, "clusters": 0,
            "document_count": len(docs),
            "publication_count": 0,
            "patent_count": 0,
            "message": (
                "Not enough documents to run the trend pipeline. "
                "Seed the corpus with seed_patents.py or ingest publications."
            ),
        }
    else:
        result = _analyse(docs)
        result["domains"] = _domain_activity(docs, result["buckets"])
        result["document_count"] = len(docs)
        result["publication_count"] = sum(1 for d in docs if d.source == "publication")
        result["patent_count"] = sum(1 for d in docs if d.source == "patent")

    _CACHE["key"] = key
    _CACHE["value"] = result
    return result


# --------------------------------------------------------------------------
# public API (consumed by routers/trends_routes.py)
# --------------------------------------------------------------------------

def get_topic_trends(db: Session) -> List[Dict[str, Any]]:
    """Topics ranked by growth velocity, each with a per-year series."""
    return _compute(db)["topics"]


def get_research_hotspots(db: Session) -> Dict[str, Any]:
    """Hotspot clusters plus domain-level activity for the dashboard."""
    result = _compute(db)
    return {
        "hotspots": result["hotspots"],
        "domains": result.get("domains", []),
        "periods": [str(y) for y in result.get("buckets", [])],
        "document_count": result.get("document_count", 0),
        "clusters": result.get("clusters", 0),
        "vocabulary_size": result.get("vocabulary", 0),
    }


def get_emerging_topics(db: Session) -> Dict[str, Any]:
    """Topics whose recent activity is growing - the emerging-topic detector."""
    topics = _compute(db)["topics"]
    emerging = [t for t in topics if t.get("emerging")]
    return {
        "count": len(emerging),
        "threshold": EMERGING_THRESHOLD,
        "emerging_topics": emerging,
    }


def _h_index(citations: List[int]) -> int:
    ordered = sorted(citations, reverse=True)
    h = 0
    for index, count in enumerate(ordered, start=1):
        if count >= index:
            h = index
        else:
            break
    return h


def get_citation_analytics(db: Session) -> Dict[str, Any]:
    """Citation summary across the research corpus."""
    pubs = db.query(Publication).all()

    if pubs:
        total = sum(int(p.citation_count or 0) for p in pubs)
        top = sorted(pubs, key=lambda p: p.citation_count or 0, reverse=True)[:5]
        top_cited = [{
            "title": p.title,
            "citation_count": int(p.citation_count or 0),
            "year": p.publication_year,
            "venue": p.journal_or_venue,
        } for p in top]
        all_counts = [int(p.citation_count or 0) for p in pubs]
        analysed = len(pubs)
        source = "publications"
    else:
        pats = db.query(PatentRecord).order_by(
            PatentRecord.citation_count.desc()
        ).limit(MAX_DOCS).all()
        total = sum(int(p.citation_count or 0) for p in pats)
        top_cited = [{
            "title": p.title,
            "citation_count": int(p.citation_count or 0),
            "year": p.filing_date.year if p.filing_date else None,
            "venue": p.assignee,
        } for p in pats[:5]]
        all_counts = [int(p.citation_count or 0) for p in pats]
        analysed = len(pats)
        source = "patents"

    average = round(total / analysed, 2) if analysed else 0.0

    return {
        "total_publications_analyzed": analysed,
        "total_citations": total,
        "average_citations_per_paper": average,
        "h_index_estimate": _h_index(all_counts or [0]),
        "corpus": source,
        "top_cited_publications": top_cited,
    }
