from fastapi.testclient import TestClient

from apps.api.quantumos_api.main import app

client = TestClient(app)


def test_docs_list():
    r = client.get("/v1/docs")
    assert r.status_code == 200
    ids = {d["id"] for d in r.json()["docs"]}
    assert "readme" in ids
    assert "quantum-research" in ids


def test_docs_readme():
    r = client.get("/v1/docs/readme")
    assert r.status_code == 200
    body = r.json()
    assert body["id"] == "readme"
    assert "# QuantumOS" in body["content"]
