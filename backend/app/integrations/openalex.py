import httpx
from fastapi import HTTPException
from app.core.config import get_settings

class OpenAlexProvider:
    def __init__(self): self.settings = get_settings()
    async def search(self, query: str, author: str | None = None, page: int = 1, per_page: int = 10):
        params = {"search": query, "page": page, "per-page": per_page}
        if self.settings.openalex_api_key: params["api_key"] = self.settings.openalex_api_key
        if author:
            params["search"] = f"{query} {author}"
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                r = await client.get(f"{self.settings.openalex_base_url}/works", params=params)
                r.raise_for_status()
                return r.json()
        except httpx.HTTPError as exc:
            raise HTTPException(502, f"OpenAlex request failed: {exc}")
    async def get(self, external_id: str):
        params = {"api_key": self.settings.openalex_api_key} if self.settings.openalex_api_key else {}
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                r = await client.get(f"{self.settings.openalex_base_url}/works/{external_id}", params=params)
                r.raise_for_status(); return r.json()
        except httpx.HTTPError as exc: raise HTTPException(502, f"OpenAlex request failed: {exc}")

def normalize_work(w: dict) -> dict:
    primary = w.get("primary_location") or {}
    source = (primary.get("source") or {}).get("display_name")
    authors = [((a.get("author") or {}).get("display_name")) for a in w.get("authorships", [])]
    return {"external_id": w.get("id"), "title": w.get("title") or "Untitled", "doi": w.get("doi"), "publication_date": w.get("publication_date"), "venue": source, "citation_count": int(w.get("cited_by_count") or 0), "authors": [a for a in authors if a], "raw": w}
