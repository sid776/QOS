from typing import Any

from providers.base import ProviderResult, QuantumProvider


class ClassicalLocalProvider(QuantumProvider):
    name = "classical_local"
    provider_type = "local"
    capabilities = ["optimization", "classical_fallback"]

    def is_available(self) -> bool:
        return True

    def estimate(self, job: dict[str, Any]) -> dict[str, Any]:
        return {"estimated_cost_usd": 0, "estimated_latency_ms": 50}

    def run_job(self, job: dict[str, Any]) -> ProviderResult:
        inp = job.get("input", {})
        if job.get("job_type") == "optimization" or job.get("skill") in (
            "portfolio_optimizer",
            "route_optimizer",
        ):
            assets = inp.get("assets", ["A", "B"])
            budget = inp.get("budget", 10000)
            weights = {a: round(1 / len(assets), 4) for a in assets}
            return ProviderResult(
                True,
                {
                    "provider": self.name,
                    "method": "classical_heuristic",
                    "weights": weights,
                    "allocated_budget": budget,
                },
            )
        return ProviderResult(
            True,
            {"provider": self.name, "message": "Classical fallback executed"},
        )
