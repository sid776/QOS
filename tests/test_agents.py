from agents.runtime import run_agent


def test_backend_selection_agent():
    result = run_agent(
        "BackendSelectionAgent",
        {
            "job_type": "optimization",
            "constraints": {"max_cost_usd": 0, "allow_cloud_quantum": False},
        },
    )
    assert result.agent == "BackendSelectionAgent"
    assert "recommended_provider" in result.plan
