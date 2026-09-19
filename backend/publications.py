import requests

OPENALEX_BASE_URL = "https://api.openalex.org/works"

def search_publications(query: str, limit: int = 10):
    params = {
        "search": query,
        "per_page": limit
    }
    response = requests.get(OPENALEX_BASE_URL, params=params)
    response.raise_for_status()
    data = response.json()

    results = []
    for work in data.get("results", []):
        results.append({
            "title": work.get("title"),
            "publication_year": work.get("publication_year"),
            "doi": work.get("doi"),
            "cited_by_count": work.get("cited_by_count"),
            "authors": [
                a["author"]["display_name"]
                for a in work.get("authorships", [])
            ]
        })
    return results