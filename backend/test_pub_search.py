import sys
import os

# Ensure backend directory is in python sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app
from database import SessionLocal
from models import Publication

client = TestClient(app)

def test_publications():
    print("==================================================")
    print("PUBLICATIONS SEARCH FLOW VERIFICATION RUN")
    print("==================================================")
    
    db = SessionLocal()
    queries = ["Artificial Intelligence", "Machine Learning", "Deep Learning", "Blockchain"]
    sources = ["all", "openalex", "crossref", "semantic_scholar", "arxiv"]
    
    print("\n--- 1. Testing GET /api/datasets/publications/search for required terms ---")
    all_passed = True
    for q in queries:
        res = client.get(f"/api/datasets/publications/search?query={q}&source=all&limit=10")
        if res.status_code == 200:
            data = res.json()
            if isinstance(data, list) and len(data) > 0:
                first = data[0]
                print(f" [PASS] Keyword '{q}': {len(data)} results. First title: '{first['title'][:60]}...' (Source: {first['external_source']})")
            else:
                print(f" [FAIL] Keyword '{q}': Returned empty array []")
                all_passed = False
        else:
            print(f" [FAIL] Keyword '{q}': HTTP {res.status_code} - {res.text}")
            all_passed = False

    print("\n--- 2. Testing repository sources for 'Artificial Intelligence' ---")
    for src in sources:
        res = client.get(f"/api/datasets/publications/search?query=Artificial%20Intelligence&source={src}&limit=5")
        if res.status_code == 200:
            data = res.json()
            print(f" [PASS] Source '{src}': {len(data)} results returned.")
        else:
            print(f" [FAIL] Source '{src}': HTTP {res.status_code} - {res.text}")

    # Check DB count after searches
    pub_count = db.query(Publication).count()
    print(f"\nTotal Publications in SQLite DB: {pub_count}")
    
    print("\n==================================================")
    print(f"FINAL RESULT: {'ALL PASSED [PASS]' if all_passed else 'FAILED [FAIL]'}")
    print("==================================================")

if __name__ == "__main__":
    test_publications()
