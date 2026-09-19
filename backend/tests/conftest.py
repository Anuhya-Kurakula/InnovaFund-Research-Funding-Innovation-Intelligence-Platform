import os
os.environ["DATABASE_URL"]="sqlite:///./test_Release.db"
os.environ["MONGODB_URL"]="mongodb://localhost:27017"
os.environ["JWT_SECRET"]="test-only-secret-0123456789abcdef0123456789abcdef"
os.environ["PATENTS_PROVIDER"]="local"
os.environ["LOCAL_PATENT_DATASET"]=str((__import__("pathlib").Path(__file__).resolve().parents[2]/"data"/"patents_public_sample.json"))
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.postgres import Base, engine
from app.models.user import User, Role
from app.models.profile import UserProfile
from app.core.security import hash_password

@pytest.fixture(autouse=True)
def clean_db():
    Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    with TestClient(app) as c: yield c

def register(client,email='researcher@example.com',password='StrongPass123!'):
    return client.post('/api/v1/auth/register',json={'email':email,'full_name':'Test User','password':password})

def login(client,email='researcher@example.com',password='StrongPass123!'):
    return client.post('/api/v1/auth/login',data={'username':email,'password':password})
