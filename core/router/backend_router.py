from typing import Any

from core.registry.provider_registry import ProviderRegistry
from providers.base import QuantumProvider

JOB_TYPE_CAPABILITY = {
    "circuit_simulation": "circuit_simulation",
    "optimization": "optimization",
    "quantum_demo": "qrng_demo",
    "qkd_simulation": "qkd_simulation",
    "post_quantum_crypto": "post_quantum_crypto",
    "security": "classical_fallback",
    "quantum_chemistry": "quantum_chemistry",
    "quantum_machine_learning": "quantum_machine_learning",
}


class BackendRouter:
    def __init__(self, registry: ProviderRegistry):
        self.registry = registry

    def select(self, job: dict[str, Any]) -> QuantumProvider | None:
        preferred = job.get("preferred_backend", "auto")
        constraints = job.get("constraints") or {}
        job_type = job.get("job_type", "")
        required_cap = JOB_TYPE_CAPABILITY.get(job_type, "classical_fallback")

        if preferred != "auto":
            provider = self.registry.get(preferred)
            if provider and provider.is_available():
                return provider

        candidates: list[tuple[QuantumProvider, float]] = []
        for provider in self.registry.list_all():
            if not provider.is_available():
                continue
            if required_cap not in provider.capabilities and "classical_fallback" not in provider.capabilities:
                if job_type not in ("optimization",) or "optimization" not in provider.capabilities:
                    continue

            est = provider.estimate(job)
            cost = est.get("estimated_cost_usd", 0)
            if cost > constraints.get("max_cost_usd", 0) and constraints.get("max_cost_usd", 0) == 0:
                if provider.provider_type == "cloud_quantum":
                    continue
            if not constraints.get("allow_cloud_quantum", False) and provider.provider_type == "cloud_quantum":
                continue
            if not constraints.get("allow_simulator", True) and provider.provider_type == "simulator":
                continue

            qubits = job.get("input", {}).get("qubits", 2)
            if qubits > constraints.get("max_qubits", 20):
                continue

            latency = est.get("estimated_latency_ms", 1000)
            score = cost * 1000 + latency
            candidates.append((provider, score))

        if not candidates:
            return self.registry.get("mock_provider")

        candidates.sort(key=lambda x: x[1])
        return candidates[0][0]
