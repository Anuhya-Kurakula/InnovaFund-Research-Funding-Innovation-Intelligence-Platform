import sys
import os

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_endpoints():
    print("--- TESTING BACKEND ENDPOINTS ---")
    
    # 1. Patent Search
    queries = ["Artificial Intelligence", "Machine Learning", "Blockchain", "Robotics", "Biotechnology"]
    for q in queries:
        res = client.get(f"/api/patents/search?query={q}&source=all&limit=10")
        print(f"GET /api/patents/search?query={q}: status={res.status_code}, count={len(res.json()) if res.status_code == 200 else res.text}")
        if res.status_code == 200:
            data = res.json()
            if len(data) > 0:
                print(f"   First result title: {data[0]['title']}")

    # Direct route test
    res_direct = client.get("/patents/search?query=Artificial%20Intelligence")
    print(f"GET /patents/search (direct): status={res_direct.status_code}, count={len(res_direct.json()) if res_direct.status_code == 200 else res_direct.text}")

    # 2. Patent Clusters
    res = client.get("/api/patents/clusters")
    print(f"GET /api/patents/clusters: status={res.status_code}, count={len(res.json()) if res.status_code == 200 else res.text}")

    # 3. Patent Trends
    res = client.get("/api/patents/trends")
    print(f"GET /api/patents/trends: status={res.status_code}, count={len(res.json()) if res.status_code == 200 else res.text}")

    # 4. Emerging Tech
    res = client.get("/api/technology/emerging")
    print(f"GET /api/technology/emerging: status={res.status_code}, count={len(res.json()) if res.status_code == 200 else res.text}")

    # 5. Technology Maturity
    res = client.get("/api/technology/maturity")
    print(f"GET /api/technology/maturity: status={res.status_code}, count={len(res.json()) if res.status_code == 200 else res.text}")

    # 6. Technology Competitors
    res = client.get("/api/technology/competitors")
    print(f"GET /api/technology/competitors: status={res.status_code}, count={len(res.json()) if res.status_code == 200 else res.text}")

if __name__ == "__main__":
    test_endpoints()
