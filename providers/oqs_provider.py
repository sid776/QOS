from typing import Any

from providers.base import ProviderResult, QuantumProvider


class OQSCryptoProvider(QuantumProvider):
    name = "oqs_crypto"
    provider_type = "crypto"
    capabilities = ["post_quantum_crypto"]

    def is_available(self) -> bool:
        return True

    def estimate(self, job: dict[str, Any]) -> dict[str, Any]:
        return {"estimated_cost_usd": 0, "estimated_latency_ms": 20}

    def run_job(self, job: dict[str, Any]) -> ProviderResult:
        return ProviderResult(
            True,
            {
                "provider": self.name,
                "note": "Use Security Center crypto API for PQC operations",
                "mock_pqc": True,
                "non_production": True,
            },
        )
