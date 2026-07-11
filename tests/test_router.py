from core.registry.provider_registry import ProviderRegistry
from core.router.backend_router import BackendRouter


def test_provider_selection_local():
    registry = ProviderRegistry()
    router = BackendRouter(registry)
    job = {
        "job_type": "optimization",
        "constraints": {"max_cost_usd": 0, "allow_cloud_quantum": False},
        "input": {},
        "preferred_backend": "auto",
    }
    provider = router.select(job)
    assert provider is not None
    assert provider.name in ("classical_local", "mock_provider")
