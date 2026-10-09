import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["indexed_documents"] >= 100

def test_auth_login_admin():
    response = client.post("/api/auth/login", json={"username": "admin", "password": "Admin@123"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["username"] == "admin"
    assert data["user"]["role"] == "SUPER_ADMIN"

def test_list_subsidiaries():
    response = client.get("/api/subsidiaries")
    assert response.status_code == 200
    subs = response.json()
    assert len(subs) >= 8
    codes = [s["code"] for s in subs]
    assert "CMPDI" in codes
    assert "SECL" in codes
    assert "CCL" in codes

def test_list_mines():
    response = client.get("/api/mines")
    assert response.status_code == 200
    mines = response.json()
    assert len(mines) >= 20
    mine_names = [m["name"] for m in mines]
    assert any("Rajrappa" in n for n in mine_names)
    assert any("Gevra" in n for n in mine_names)

def test_documents_listing():
    response = client.get("/api/documents?limit=10")
    assert response.status_code == 200
    docs = response.json()
    assert len(docs) == 10
    assert "document_id" in docs[0]
    assert "file_name" in docs[0]

def test_hybrid_search():
    payload = {
        "query": "Rajrappa coal production overburden",
        "search_type": "HYBRID",
        "limit": 5
    }
    response = client.post("/api/search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_results"] > 0
    assert len(data["results"]) > 0
    first = data["results"][0]
    assert "score" in first
    assert "snippet" in first
    assert "bounding_box" in first

def test_ai_intelligence_assistant_rag():
    payload = {
        "query": "What was the production of Rajrappa project?",
        "policy": "LOCAL_ONLY"
    }
    response = client.post("/api/ai/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert len(data["sources"]) > 0
    assert "confidence" in data
    assert data["governance_policy_applied"] == "LOCAL_ONLY"

def test_parliamentary_queries_flow():
    response = client.get("/api/parliamentary-queries")
    assert response.status_code == 200
    queries = response.json()
    assert len(queries) >= 2
    first_q = queries[0]
    assert "query_no" in first_q
    assert "ai_draft_response" in first_q
    assert first_q["confidence_score"] > 0.8

def test_automated_report_generation():
    payload = {
        "title": "Quarterly Coal Extraction Intelligence Briefing",
        "report_type": "QUARTERLY",
        "financial_year": "2024-25"
    }
    response = client.post("/api/reports/generate", json=payload)
    assert response.status_code == 200
    report = response.json()
    assert report["title"] == payload["title"]
    assert "metrics_summary_json" in report
    assert "pdf_path" in report
    assert "docx_path" in report
    assert "xlsx_path" in report
    assert "csv_path" in report

def test_dashboard_analytics_kpis():
    response = client.get("/api/analytics")
    assert response.status_code == 200
    data = response.json()
    kpis = data["kpis"]
    assert kpis["documents_processed"] >= 100
    assert kpis["extraction_accuracy"] > 90.0
    assert kpis["time_reduction_percentage"] > 90.0
    assert len(data["production_trends"]) >= 5
    assert len(data["anomalies"]) >= 2

def test_word_cloud_and_topics():
    response = client.get("/api/word-cloud")
    assert response.status_code == 200
    items = response.json()
    assert len(items) > 0
    assert "text" in items[0]
    assert "value" in items[0]

    topics_resp = client.get("/api/topics")
    assert topics_resp.status_code == 200
    topics = topics_resp.json()
    assert len(topics) >= 5

def test_audit_logs_immutability():
    response = client.get("/api/audit-logs")
    assert response.status_code == 200
    logs = response.json()
    assert len(logs) > 0
    first = logs[0]
    assert "hash_signature" in first
    assert len(first["hash_signature"]) == 64 # SHA-256 hash length
