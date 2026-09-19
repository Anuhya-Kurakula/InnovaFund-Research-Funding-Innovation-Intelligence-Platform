from .conftest import register,login
from app.integrations.openalex import OpenAlexProvider
from app.integrations.patents import LocalPublicPatentProvider

def auth(client): register(client);h={'Authorization':f"Bearer {login(client).json()['access_token']}"};client.post('/api/v1/profile',headers=h,json={});return h

def test_publication_search_mock(monkeypatch,client):
    async def fake(self,*args,**kwargs): return {'meta':{'count':1},'results':[{'id':'https://openalex.org/W1','title':'Test Work','publication_date':'2025-01-01','cited_by_count':3,'authorships':[],'primary_location':{'source':{'display_name':'Journal'}}}]}
    monkeypatch.setattr(OpenAlexProvider,'search',fake); r=client.get('/api/v1/publications/search?q=test'); assert r.status_code==200 and r.json()['results'][0]['title']=='Test Work'

def test_publication_save_duplicate(client):
    h=auth(client); data={'external_id':'W1','title':'Test Work','publication_date':'2025-01-01','citation_count':3,'authors':[]}
    assert client.post('/api/v1/profile/publications',headers=h,json=data).status_code==201
    assert client.post('/api/v1/profile/publications',headers=h,json=data).status_code==201
    assert len(client.get('/api/v1/profile',headers=h).json()['publication_ids'])==1

def test_patent_search_and_save(client):
    h=auth(client); r=client.get('/api/v1/patents/search?q=nose'); assert r.status_code==200
    data=r.json()['results'][0]; assert client.post('/api/v1/profile/patents',headers=h,json=data).status_code==201
    assert client.post('/api/v1/profile/patents',headers=h,json=data).status_code==201
    assert len(client.get('/api/v1/profile',headers=h).json()['patent_ids'])==1

def test_publication_empty_search(monkeypatch,client):
    async def fake(self,*args,**kwargs): return {'meta':{'count':0},'results':[]}
    monkeypatch.setattr(OpenAlexProvider,'search',fake); r=client.get('/api/v1/publications/search?q=unlikely'); assert r.status_code==200 and r.json()['results']==[]

def test_publication_provider_failure(monkeypatch,client):
    async def fail(self,*args,**kwargs):
        from fastapi import HTTPException
        raise HTTPException(502,'OpenAlex unavailable')
    monkeypatch.setattr(OpenAlexProvider,'search',fail); r=client.get('/api/v1/publications/search?q=test'); assert r.status_code==502

def test_patent_provider_failure(monkeypatch,client):
    import app.api.assets as assets
    class Broken:
        async def search(self,*args,**kwargs):
            from fastapi import HTTPException
            raise HTTPException(502,'Patent provider unavailable')
    monkeypatch.setattr(assets,'get_patent_provider',lambda:Broken()); r=client.get('/api/v1/patents/search?q=test'); assert r.status_code==502
