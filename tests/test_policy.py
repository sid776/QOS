from core.policy.policy_engine import PolicyEngine
from providers.azure_quantum_provider import AzureQuantumPlaceholder


def test_policy_rejection_cloud():
    engine = PolicyEngine()
    job = {
        "constraints": {"allow_cloud_quantum": False, "max_cost_usd": 0},
        "data_classification": "public_demo",
    }
    azure = AzureQuantumPlaceholder()
    decision = engine.evaluate_job(job, azure)
    assert not decision.allowed
