from .conftest import register, login
from app.db.postgres import SessionLocal
from app.models.user import User, Role

def auth(client, email='funding_user@example.com'):
    register(client, email=email)
    h = {'Authorization': f"Bearer {login(client, email=email).json()['access_token']}"}
    client.post('/api/v1/profile', headers=h, json={'academic': {'degree': 'PhD'}, 'organization': {'name': 'Lab'}})
    client.post('/api/v1/profile/domains', headers=h, json={'value': 'AI & Machine Learning'})
    client.post('/api/v1/profile/keywords', headers=h, json={'value': 'Deep Learning'})
    return h

def test_funding_list_and_search(client):
    r = client.get('/api/v1/funding/opportunities')
    assert r.status_code == 200
    assert len(r.json()) >= 1

    r_search = client.get('/api/v1/funding/opportunities?q=Machine')
    assert r_search.status_code == 200
    assert len(r_search.json()) >= 1

    r_source = client.get('/api/v1/funding/opportunities?source_type=Government Grants')
    assert r_source.status_code == 200
    assert all(item['source_type'] == 'Government Grants' for item in r_source.json())

def test_personalized_recommendations_and_alerts(client):
    headers = auth(client)
    r_recs = client.get('/api/v1/funding/recommendations', headers=headers)
    assert r_recs.status_code == 200
    data = r_recs.json()
    assert len(data) >= 1
    assert 'match_score' in data[0]
    assert data[0]['match_score'] >= 40

    r_alerts = client.get('/api/v1/funding/alerts', headers=headers)
    assert r_alerts.status_code == 200
    assert len(r_alerts.json()) <= 5

def test_admin_create_funding_opportunity(client):
    # Researcher cannot create
    headers = auth(client, email='researcher_funding@example.com')
    new_opp = {
        'title': 'Test Admin Grant',
        'description': 'Description for test grant',
        'source_type': 'Government Grants',
        'agency': 'NSF Test',
        'amount': '$100,000',
        'deadline': '2026-12-31',
        'eligibility_criteria': 'Eligible PIs',
        'tags': ['Testing'],
        'application_url': 'https://example.com'
    }
    assert client.post('/api/v1/funding/opportunities', headers=headers, json=new_opp).status_code == 403

    # Promote to Administrator
    db = SessionLocal()
    u = db.query(User).filter(User.email == 'researcher_funding@example.com').first()
    u.role = Role.ADMINISTRATOR
    db.commit()
    db.close()

    # Re-login to get updated token
    admin_token = login(client, email='researcher_funding@example.com').json()['access_token']
    admin_headers = {'Authorization': f'Bearer {admin_token}'}

    r_admin = client.post('/api/v1/funding/opportunities', headers=admin_headers, json=new_opp)
    assert r_admin.status_code == 201
    assert r_admin.json()['title'] == 'Test Admin Grant'

def test_bookmark_profile_funding(client):
    headers = auth(client, email='bookmark_user@example.com')
    opps = client.get('/api/v1/funding/opportunities').json()
    opp_id = opps[0]['id']

    r_bookmark = client.post(f'/api/v1/profile/funding/{opp_id}', headers=headers)
    assert r_bookmark.status_code == 201

    r_saved = client.get('/api/v1/profile/funding', headers=headers)
    assert r_saved.status_code == 200
    assert len(r_saved.json()) == 1
    assert r_saved.json()[0]['id'] == opp_id
