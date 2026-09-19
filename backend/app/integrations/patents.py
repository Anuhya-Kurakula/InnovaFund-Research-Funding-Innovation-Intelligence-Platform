import json
from pathlib import Path
import httpx
from fastapi import HTTPException
from app.core.config import get_settings

class PatentProvider:
    async def search(self, query: str, limit: int = 10): raise NotImplementedError

class PatentsViewProvider(PatentProvider):
    def __init__(self): self.settings=get_settings()
    async def search(self, query: str, limit: int = 10):
        if not self.settings.patentsview_api_key:
            raise HTTPException(503, "PatentsView provider requires PATENTSVIEW_API_KEY; no credential is configured")
        q = json.dumps({"_text_any": {"patent_title": query}})
        fields = json.dumps(["patent_id","patent_title","patent_date","assignees.assignee_organization","ipcs.ipc_class","patent_num_times_cited_by_us_patents"])
        options = json.dumps({"size": min(limit, 100)})
        headers={"X-Api-Key": self.settings.patentsview_api_key}
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                r=await client.get(f"{self.settings.patentsview_base_url}/patent/", params={"q":q,"f":fields,"o":options}, headers=headers)
                r.raise_for_status(); data=r.json()
        except httpx.HTTPError as exc: raise HTTPException(502, f"PatentsView request failed: {exc}")
        return [normalize_patent(x, "PatentsView") for x in data.get("patents", [])]

class LocalPublicPatentProvider(PatentProvider):
    """Reads a clearly labelled public-data snapshot; never pretends it is live API data."""
    def __init__(self, path: str): self.path=Path(path)
    async def search(self, query: str, limit: int = 10):
        if not self.path.exists(): return []
        records=json.loads(self.path.read_text(encoding="utf-8"))
        q=query.lower().strip()
        return [r for r in records if not q or q in (r.get("title","")+" "+str(r.get("assignee", ""))+" "+str(r.get("technology_domain", ""))).lower()][:limit]

def normalize_patent(x: dict, source: str) -> dict:
    assignees=x.get("assignees") or []
    assignee=None
    if assignees:
        a=assignees[0] or {}; assignee=a.get("assignee_organization") or a.get("assignee_name")
    ipcs=x.get("ipcs") or []
    classification=(ipcs[0] or {}).get("ipc_class") if ipcs else None
    return {"source":source,"external_id":str(x.get("patent_id")),"title":x.get("patent_title") or "Untitled","assignee":assignee,"filing_date":x.get("patent_date"),"classification":classification,"technology_domain":classification,"citation_count":int(x.get("patent_num_times_cited_by_us_patents") or 0),"raw":x}

def get_patent_provider() -> PatentProvider:
    settings=get_settings()
    if settings.patents_provider.lower()=="patentsview": return PatentsViewProvider()
    return LocalPublicPatentProvider(settings.local_patent_dataset)
