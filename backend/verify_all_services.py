import httpx
import json

BASE_URL = "http://127.0.0.1:8000/api"

def run_verification():
    print("==================================================")
    print("COMPLETE SYSTEM VERIFICATION RUN")
    print("==================================================")
    
    results = {}
    
    # 1. Patent Search Tests
    search_keywords = [
        "Artificial Intelligence",
        "Machine Learning",
        "Blockchain",
        "Robotics",
        "Biotechnology"
    ]
    
    search_passed = True
    print("\n--- 1. PATENT SEARCH (GET /patents/search) ---")
    for kw in search_keywords:
        try:
            res = httpx.get(f"{BASE_URL}/patents/search", params={"query": kw, "source": "all", "limit": 10}, timeout=5.0)
            if res.status_code == 200:
                data = res.json()
                if isinstance(data, list) and len(data) > 0:
                    first = data[0]
                    # Verify required fields
                    required_fields = ["patent_number", "title", "assignee", "status", "external_source"]
                    missing = [f for f in required_fields if f not in first]
                    if not missing:
                        print(f" [PASS] Keyword '{kw}': {len(data)} results. Sample title: '{first['title'][:50]}...'")
                    else:
                        print(f" [FAIL] Keyword '{kw}': Missing fields {missing}")
                        search_passed = False
                else:
                    print(f" [FAIL] Keyword '{kw}': Returned empty or non-list response")
                    search_passed = False
            else:
                print(f" [FAIL] Keyword '{kw}': HTTP {res.status_code}")
                search_passed = False
        except Exception as e:
            print(f" [FAIL] Keyword '{kw}': Exception {e}")
            search_passed = False
            
    results["Patent Search"] = "PASS" if search_passed else "FAIL"
    
    # 2. Patent Clustering
    print("\n--- 2. PATENT CLUSTERING (GET /patents/clusters) ---")
    try:
        res = httpx.get(f"{BASE_URL}/patents/clusters", timeout=5.0)
        if res.status_code == 200:
            data = res.json()
            if isinstance(data, list) and len(data) > 0:
                first = data[0]
                req = ["cluster_id", "cluster_name", "patent_count", "key_terms", "top_assignees", "growth_rate_pct", "description"]
                missing = [f for f in req if f not in first]
                if not missing:
                    print(f" [PASS] Patent Clusters: {len(data)} clusters found. Sample: '{first['cluster_name']}' ({first['patent_count']} patents)")
                    results["Patent Clustering"] = "PASS"
                else:
                    print(f" [FAIL] Missing fields: {missing}")
                    results["Patent Clustering"] = "FAIL"
            else:
                print(" [FAIL] Empty or invalid response")
                results["Patent Clustering"] = "FAIL"
        else:
            print(f" [FAIL] HTTP {res.status_code}")
            results["Patent Clustering"] = "FAIL"
    except Exception as e:
        print(f" [FAIL] Exception {e}")
        results["Patent Clustering"] = "FAIL"

    # 3. Patent Trend Analysis
    print("\n--- 3. PATENT TREND ANALYSIS (GET /patents/trends) ---")
    try:
        res = httpx.get(f"{BASE_URL}/patents/trends", timeout=5.0)
        if res.status_code == 200:
            data = res.json()
            if isinstance(data, list) and len(data) > 0:
                first = data[0]
                req = ["time_period", "patent_count", "growth_rate_pct", "top_categories", "filing_velocity"]
                missing = [f for f in req if f not in first]
                if not missing:
                    print(f" [PASS] Patent Trends: {len(data)} trends found. Sample period: '{first['time_period']}' ({first['patent_count']} patents)")
                    results["Patent Trends"] = "PASS"
                else:
                    print(f" [FAIL] Missing fields: {missing}")
                    results["Patent Trends"] = "FAIL"
            else:
                print(" [FAIL] Empty response")
                results["Patent Trends"] = "FAIL"
        else:
            print(f" [FAIL] HTTP {res.status_code}")
            results["Patent Trends"] = "FAIL"
    except Exception as e:
        print(f" [FAIL] Exception {e}")
        results["Patent Trends"] = "FAIL"

    # 4. Emerging Technologies
    print("\n--- 4. EMERGING TECHNOLOGIES (GET /technology/emerging) ---")
    try:
        res = httpx.get(f"{BASE_URL}/technology/emerging", timeout=5.0)
        if res.status_code == 200:
            data = res.json()
            if isinstance(data, list) and len(data) > 0:
                first = data[0]
                req = ["id", "name", "category", "patent_count", "publication_count", "growth_rate_pct", "is_emerging", "description"]
                missing = [f for f in req if f not in first]
                if not missing:
                    print(f" [PASS] Emerging Technologies: {len(data)} records found. Sample tech: '{first['name']}' (+{first['growth_rate_pct']}%)")
                    results["Emerging Technologies"] = "PASS"
                else:
                    print(f" [FAIL] Missing fields: {missing}")
                    results["Emerging Technologies"] = "FAIL"
            else:
                print(" [FAIL] Empty response")
                results["Emerging Technologies"] = "FAIL"
        else:
            print(f" [FAIL] HTTP {res.status_code}")
            results["Emerging Technologies"] = "FAIL"
    except Exception as e:
        print(f" [FAIL] Exception {e}")
        results["Emerging Technologies"] = "FAIL"

    # 5. Technology Maturity
    print("\n--- 5. TECHNOLOGY MATURITY (GET /technology/maturity) ---")
    try:
        res = httpx.get(f"{BASE_URL}/technology/maturity", timeout=5.0)
        if res.status_code == 200:
            data = res.json()
            if isinstance(data, list) and len(data) > 0:
                first = data[0]
                req = ["domain_name", "lifecycle_stage", "trl_level", "maturity_score", "adoption_velocity", "commercial_readiness"]
                missing = [f for f in req if f not in first]
                if not missing:
                    print(f" [PASS] Technology Maturity: {len(data)} domains found. Sample domain: '{first['domain_name']}' Score: {first['maturity_score']}/100")
                    results["Technology Maturity"] = "PASS"
                else:
                    print(f" [FAIL] Missing fields: {missing}")
                    results["Technology Maturity"] = "FAIL"
            else:
                print(" [FAIL] Empty response")
                results["Technology Maturity"] = "FAIL"
        else:
            print(f" [FAIL] HTTP {res.status_code}")
            results["Technology Maturity"] = "FAIL"
    except Exception as e:
        print(f" [FAIL] Exception {e}")
        results["Technology Maturity"] = "FAIL"

    # 6. Technology Competitors
    print("\n--- 6. TECHNOLOGY COMPETITORS (GET /technology/competitors) ---")
    try:
        res = httpx.get(f"{BASE_URL}/technology/competitors", timeout=5.0)
        if res.status_code == 200:
            data = res.json()
            if isinstance(data, list) and len(data) > 0:
                first = data[0]
                req = ["id", "domain_name", "assignee_name", "patent_holdings", "market_share_pct", "activity_status"]
                missing = [f for f in req if f not in first]
                if not missing:
                    print(f" [PASS] Technology Competitors: {len(data)} competitor records. Sample assignee: '{first['assignee_name']}' ({first['patent_holdings']} patents)")
                    results["Technology Competitors"] = "PASS"
                else:
                    print(f" [FAIL] Missing fields: {missing}")
                    results["Technology Competitors"] = "FAIL"
            else:
                print(" [FAIL] Empty response")
                results["Technology Competitors"] = "FAIL"
        else:
            print(f" [FAIL] HTTP {res.status_code}")
            results["Technology Competitors"] = "FAIL"
    except Exception as e:
        print(f" [FAIL] Exception {e}")
        results["Technology Competitors"] = "FAIL"

    print("\n==================================================")
    print("FINAL SUMMARY RESULTS:")
    print("==================================================")
    for k, v in results.items():
        print(f"[{v}] {k}")

if __name__ == "__main__":
    run_verification()
