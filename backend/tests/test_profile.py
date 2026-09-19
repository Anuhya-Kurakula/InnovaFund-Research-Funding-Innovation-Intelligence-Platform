from .conftest import register,login

def auth(client): register(client); return {'Authorization':f"Bearer {login(client).json()['access_token']}"}
def test_profile_crud_and_components(client):
    h=auth(client); r=client.post('/api/v1/profile',headers=h,json={'academic':{'degree':'MTech','institution':'Example University'},'organization':{'name':'Example Lab','organization_type':'Research'}}); assert r.status_code==201
    assert client.get('/api/v1/profile',headers=h).status_code==200
    assert client.put('/api/v1/profile',headers=h,json={'academic':{'academic_title':'Researcher','degree':'PhD','institution':'Example University'}}).status_code==200
    for path in ['domains','interests','keywords','technology-areas']:
        assert client.post(f'/api/v1/profile/{path}',headers=h,json={'value':f'AI-{path}'}).status_code==200
        assert client.post(f'/api/v1/profile/{path}',headers=h,json={'value':f'AI-{path}'}).status_code==409
    hist=client.post('/api/v1/profile/research-history',headers=h,json={'title':'Research Project','start_year':2020,'end_year':2023}); assert hist.status_code==201
    assert client.get('/api/v1/profile',headers=h).json()['research_history'][0]['title']=='Research Project'

def test_invalid_history(client):
    h=auth(client); client.post('/api/v1/profile',headers=h,json={}); r=client.post('/api/v1/profile/research-history',headers=h,json={'title':'x','start_year':2024,'end_year':2020}); assert r.status_code==422

def test_cross_user_isolation(client):
    h1=auth(client); client.post('/api/v1/profile',headers=h1,json={'academic':{'degree':'User One'}})
    register(client,'user2@example.com','StrongPass123!'); h2={'Authorization':f"Bearer {login(client,'user2@example.com','StrongPass123!').json()['access_token']}"}
    assert client.get('/api/v1/profile',headers=h2).status_code==404
    assert client.put('/api/v1/users/me/profile',headers=h2,json={'bio':'only user two'}).status_code==200
