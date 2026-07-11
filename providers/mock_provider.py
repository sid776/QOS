from typing import Any

from providers.base import ProviderResult, QuantumProvider


class MockProvider(QuantumProvider):
    name = "mock_provider"
    provider_type = "local"
    capabilities = ["circuit_simulation", "classical_fallback", "optimization"]

    def is_available(self) -> bool:
        return True

    def estimate(self, job: dict[str, Any]) -> dict[str, Any]:
        return {"estimated_cost_usd": 0, "estimated_latency_ms": 1}

    def run_job(self, job: dict[str, Any]) -> ProviderResult:
        return ProviderResult(
            True,
            {
                "provider": self.name,
                "mock": True,
                "counts": {"00": 512, "11": 512},
            },
        )
