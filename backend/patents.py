def search_patents(query: str, limit: int = 10):
    # Placeholder — swap this out once a real patent API key (USPTO ODP, Google Patents, etc.) is set up.
    return [
        {
            "title": f"Sample patent result for '{query}' #{i+1}",
            "assignee": "Placeholder Assignee",
            "filing_date": None,
            "classification": None,
            "note": "Stub data — real patent API integration pending"
        }
        for i in range(limit)
    ]