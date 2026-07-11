import os

os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from agents.orchestrator import run_workflow


def test_portfolio_workflow(db_session):
    del db_session
    result = run_workflow(
        "portfolio_quantum_pipeline",
        {"assets": ["A", "B"], "budget": 1000, "constraints": {"max_cost_usd": 0}},
    )
    assert result["workflow_name"] == "portfolio_quantum_pipeline"
    assert len(result["steps"]) >= 4
    assert result["status"] in ("COMPLETED", "FAILED", "REJECTED")


def test_secure_circuit_workflow(db_session):
    del db_session
    result = run_workflow("secure_circuit_pipeline", {"qubits": 2, "shots": 64})
    assert result["workflow_name"] == "secure_circuit_pipeline"
    assert any(s["agent"] == "CircuitGenerationAgent" for s in result["steps"])
