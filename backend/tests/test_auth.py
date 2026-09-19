from .conftest import register, login
from app.db.postgres import SessionLocal
from app.models.user import User, Role
from app.models.profile import UserProfile
from app.core.security import hash_password

def test_registration_and_duplicate(client):
    r=register(client); assert r.status_code==201
    assert r.json()['role']=='Researcher'
    assert register(client).status_code==409

def test_login_and_me(client):
    register(client); r=login(client); assert r.status_code==200
    token=r.json()['access_token']; me=client.get('/api/v1/auth/me',headers={'Authorization':f'Bearer {token}'})
    assert me.status_code==200 and me.json()['email']=='researcher@example.com'

def test_bad_password_and_tokens(client):
    register(client); assert login(client,password='wrongpass').status_code==401
    assert client.get('/api/v1/auth/me').status_code==401
    assert client.get('/api/v1/auth/me',headers={'Authorization':'Bearer bad'}).status_code==401

def test_admin_rbac(client):
    register(client,'admin@example.com','StrongPass123!')
    db=SessionLocal();u=db.query(User).filter(User.email=='admin@example.com').first();u.role=Role.ADMINISTRATOR;db.commit();db.close()
    token=login(client,'admin@example.com','StrongPass123!').json()['access_token']
    assert client.get('/api/v1/admin/users',headers={'Authorization':f'Bearer {token}'}).status_code==200

def test_researcher_cannot_admin(client):
    register(client); token=login(client).json()['access_token']; assert client.get('/api/v1/admin/users',headers={'Authorization':f'Bearer {token}'}).status_code==403
