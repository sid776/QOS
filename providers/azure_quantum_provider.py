import os
from typing import Any

from providers.base import ProviderResult, QuantumProvider
from providers.circuit_builder import build_qiskit_bell_circuit, job_qubits_shots


class AzureQuantumProvider(QuantumProvider):
    name = "azure_quantum"
    provider_type = "cloud_quantum"
    capabilities = ["circuit_simulation", "optimization"]
    description = (
        "Microsoft Azure Quantum — Rigetti, IonQ, Quantinuum, and simulators via azure-quantum + Qiskit."
    )
    docs_url = "https://learn.microsoft.com/azure/quantum/"
    region = "Azure cloud (global)"
    required_env = ["AZURE_QUANTUM_RESOURCE_ID"]

    def _workspace_configured(self) -> bool:
        return bool(
            os.getenv("AZURE_QUANTUM_RESOURCE_ID")
            or (
                os.getenv("AZURE_QUANTUM_SUBSCRIPTION_ID")
                and os.getenv("AZURE_QUANTUM_RESOURCE_GROUP")
                and os.getenv("AZURE_QUANTUM_WORKSPACE")
            )
        )

    def is_available(self) -> bool:
        if not self._workspace_configured():
            return False
        try:
            from azure.quantum import Workspace  # noqa: F401
            from azure.quantum.qiskit import AzureQuantumProvider as _AQP  # noqa: F401
            return True
        except ImportError:
            return False

    def estimate(self, job: dict[str, Any]) -> dict[str, Any]:
        target = os.getenv("AZURE_QUANTUM_TARGET", "rigetti.sim.qvm")
        sim = "sim" in target.lower()
        return {
            "estimated_cost_usd": 0 if sim else 5.0,
            "estimated_latency_ms": 30000 if sim else 120000,
            "target": target,
        }

    def _workspace(self):
        from azure.quantum import Workspace

        resource_id = os.getenv("AZURE_QUANTUM_RESOURCE_ID")
        if resource_id:
            return Workspace(resource_id=resource_id)
        return Workspace(
            subscription_id=os.environ["AZURE_QUANTUM_SUBSCRIPTION_ID"],
            resource_group=os.environ["AZURE_QUANTUM_RESOURCE_GROUP"],
            name=os.environ["AZURE_QUANTUM_WORKSPACE"],
        )

    def run_job(self, job: dict[str, Any]) -> ProviderResult:
        if not self._workspace_configured():
            return ProviderResult(
                False,
                {},
                "Set AZURE_QUANTUM_RESOURCE_ID (or subscription/resource_group/workspace). "
                "Install: pip install -e '.[azure]'",
            )
        try:
            from azure.quantum.qiskit import AzureQuantumProvider as AzureQiskitProvider

            qubits, shots = job_qubits_shots(job)
            qc, shots = build_qiskit_bell_circuit(qubits, shots)
            target = os.getenv("AZURE_QUANTUM_TARGET", "rigetti.sim.qvm")

            workspace = self._workspace()
            provider = AzureQiskitProvider(workspace)
            backend = provider.get_backend(target)
            azure_job = backend.run(qc, shots=shots)
            result = azure_job.result()
            counts = result.get_counts() if hasattr(result, "get_counts") else {}

            return ProviderResult(
                True,
                {
                    "provider": self.name,
                    "framework": "azure-quantum + qiskit",
                    "target": target,
                    "counts": dict(counts),
                    "shots": shots,
                    "qubits": qubits,
                    "job_id": getattr(azure_job, "id", None),
                },
            )
        except ImportError:
            return ProviderResult(
                False,
                {},
                "azure-quantum not installed. Run: pip install -e '.[azure]'",
            )
        except Exception as e:
            return ProviderResult(False, {}, str(e))


# Backward-compatible alias
class AzureQuantumPlaceholder(AzureQuantumProvider):
    name = "azure_quantum_placeholder"
