from core.registry.skill_registry import SkillRegistry


def test_skill_loading():
    registry = SkillRegistry()
    names = {s.name for s in registry.list_skills()}
    assert "hello_quantum" in names
    assert "qrng_demo" in names
    assert len(names) >= 7


def test_skill_metadata():
    registry = SkillRegistry()
    info = registry.get("portfolio_optimizer")
    assert info is not None
    data = info.to_dict()
    assert data["default_job_type"] == "optimization"
    assert len(data["input_fields"]) > 0
    assert data["description"]


def test_skill_run_hello():
    registry = SkillRegistry()
    out = registry.run_skill("hello_quantum", {"qubits": 2, "shots": 100})
    assert out["skill"] == "hello_quantum"
    assert "circuit" in out


def test_skill_run_bb84():
    registry = SkillRegistry()
    out = registry.run_skill("bb84_simulator", {"bits": 32, "sample_check": 8})
    assert out["sifted_key_length"] > 0
    assert "timeline" in out


def test_skill_run_route():
    registry = SkillRegistry()
    out = registry.run_skill("route_optimizer", {"stops": ["A", "B", "C", "D"]})
    assert len(out["ordered_stops"]) >= 4
    assert out["total_distance_km"] > 0


def test_skill_run_crypto_scan():
    registry = SkillRegistry()
    out = registry.run_skill("crypto_migration_scan", {"code": "RSA.sign(MD5.new())"})
    assert out["finding_count"] >= 1
    assert out["findings"][0]["line"] >= 1
