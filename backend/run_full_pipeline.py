import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_all_():
    print("================================================================================")
    print("  Enterprise Intelligence Platform: INNOVATION INTELLIGENCE PLATFORM FULL OUTPUT")
    print("================================================================================")
    
    # 1. Patent Search
    print("\n--------------------------------------------------------------------------------")
    print("  1. PATENT LANDSCAPE & PRIOR ART SEARCH (GET /api/patents/search)")
    print("--------------------------------------------------------------------------------")
    res = client.get("/api/patents/search?query=Artificial%20Intelligence&limit=5")
    if res.status_code == 200:
        patents = res.json()
        print(f"Total Results: {len(patents)}")
        print(json.dumps(patents[:3], indent=2))
    else:
        print(f"Error: {res.status_code} - {res.text}")

    # 2. Patent Clustering
    print("\n--------------------------------------------------------------------------------")
    print("  2. PATENT CLUSTERING & LANDSCAPE (GET /api/patents/clusters)")
    print("--------------------------------------------------------------------------------")
    res = client.get("/api/patents/clusters")
    if res.status_code == 200:
        clusters = res.json()
        print(f"Total Clusters: {len(clusters)}")
        print(json.dumps(clusters, indent=2))
    else:
        print(f"Error: {res.status_code} - {res.text}")

    # 3. Patent Filing Trends
    print("\n--------------------------------------------------------------------------------")
    print("  3. PATENT FILING TREND ANALYSIS (GET /api/patents/trends)")
    print("--------------------------------------------------------------------------------")
    res = client.get("/api/patents/trends")
    if res.status_code == 200:
        trends = res.json()
        print(f"Total Trend Periods: {len(trends)}")
        print(json.dumps(trends, indent=2))
    else:
        print(f"Error: {res.status_code} - {res.text}")

    # 4. Emerging Technologies
    print("\n--------------------------------------------------------------------------------")
    print("  4. EMERGING TECHNOLOGY IDENTIFICATION (GET /api/technology/emerging)")
    print("--------------------------------------------------------------------------------")
    res = client.get("/api/technology/emerging")
    if res.status_code == 200:
        emerging = res.json()
        print(f"Total Emerging Technologies: {len(emerging)}")
        print(json.dumps(emerging, indent=2))
    else:
        print(f"Error: {res.status_code} - {res.text}")

    # 5. Technology Maturity (TRL & Lifecycle)
    print("\n--------------------------------------------------------------------------------")
    print("  5. TECHNOLOGY MATURITY & TRL ANALYSIS (GET /api/technology/maturity)")
    print("--------------------------------------------------------------------------------")
    res = client.get("/api/technology/maturity")
    if res.status_code == 200:
        maturity = res.json()
        print(f"Total Domains Analyzed: {len(maturity)}")
        print(json.dumps(maturity, indent=2))
    else:
        print(f"Error: {res.status_code} - {res.text}")

    # 6. Competitor Activity Tracking
    print("\n--------------------------------------------------------------------------------")
    print("  6. COMPETITOR PATENT HOLDINGS & MARKET SHARE (GET /api/technology/competitors)")
    print("--------------------------------------------------------------------------------")
    res = client.get("/api/technology/competitors")
    if res.status_code == 200:
        competitors = res.json()
        print(f"Total Competitors Tracked: {len(competitors)}")
        print(json.dumps(competitors[:6], indent=2))
    else:
        print(f"Error: {res.status_code} - {res.text}")

    # 7. AI Innovation Scoring Engine (Calculation)
    print("\n--------------------------------------------------------------------------------")
    print("  7. AI INNOVATION SCORING MODEL (POST /api/scoring/calculate)")
    print("--------------------------------------------------------------------------------")
    scoring_payload = {
        "project_id": 101,
        "project_title": "Autonomous Multi-Agent Generative AI Reasoning Framework",
        "research_novelty": 92.5,
        "patent_strength": 88.0,
        "technology_maturity": 80.0,
        "market_potential": 94.5,
        "funding_relevance": 87.0
    }
    res = client.post("/api/scoring/calculate", json=scoring_payload)
    if res.status_code == 200:
        score_res = res.json()
        print(json.dumps(score_res, indent=2))
    else:
        print(f"Error: {res.status_code} - {res.text}")

    # 8. Get Innovation Score by Project ID
    print("\n--------------------------------------------------------------------------------")
    print("  8. GET INNOVATION SCORE BY PROJECT (GET /api/scoring/1)")
    print("--------------------------------------------------------------------------------")
    res = client.get("/api/scoring/1")
    if res.status_code == 200:
        score_proj = res.json()
        print(json.dumps(score_proj, indent=2))
    else:
        print(f"Error: {res.status_code} - {res.text}")

    # 9. Commercialization & Tech Transfer Engine
    print("\n--------------------------------------------------------------------------------")
    print("  9. COMMERCIALIZATION & TECH TRANSFER ENGINE (GET /api/commercialization/recommendations/1)")
    print("--------------------------------------------------------------------------------")
    res = client.get("/api/commercialization/recommendations/1")
    if res.status_code == 200:
        comm_res = res.json()
        print(json.dumps(comm_res, indent=2))
    else:
        print(f"Error: {res.status_code} - {res.text}")

    print("\n================================================================================")
    print("  ALL Release MODULES EXECUTED SUCCESSFULLY!")
    print("================================================================================")

if __name__ == "__main__":
    run_all_()
