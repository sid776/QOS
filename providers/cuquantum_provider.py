"""NVIDIA cuQuantum — GPU-accelerated statevector via Qiskit Aer when available."""

from typing import Any

from providers.base import ProviderResult, QuantumProvider
from providers.circuit_builder import build_qiskit_bell_circuit, job_qubits_shots


class CuQuantumProvider(QuantumProvider):
    name = "cuquantum_aer"
    provider_type = "simulator"
    capabilities = ["circuit_simulation", "quantum_demo"]
    description = "NVIDIA cuQuantum / cuStateVec — GPU Qiskit Aer statevector (requires CUDA + cuQuantum)."
    docs_url = "https://developer.nvidia.com/cuquantum-sdk"
    region = "local (GPU)"
    required_env: list[str] = []

    def _gpu_sim_available(self) -> bool:
        try:
            from qiskit_aer import AerSimulator

            sim = AerSimulator(method="statevector", device="GPU")
            devices = getattr(sim, "available_devices", None)
            if callable(devices):
                return "GPU" in devices()
            AerSimulator(method="statevector", device="GPU")
            return True
        except Exception:
            return False

    def is_available(self) -> bool:
        try:
            from qiskit_aer import AerSimulator  # noqa: F401
        except ImportError:
            return False
        return self._gpu_sim_available()

    def estimate(self, job: dict[str, Any]) -> dict[str, Any]:
        qubits, shots = job_qubits_shots(job)
        return {
            "estimated_cost_usd": 0,
            "estimated_latency_ms": 30 + qubits * 5 + shots // 100,
            "backend": "aer_gpu_statevector",
            "acceleration": "cuQuantum / cuStateVec",
        }

    def run_job(self, job: dict[str, Any]) -> ProviderResult:
        try:
            from qiskit_aer import AerSimulator

            qubits, shots = job_qubits_shots(job)
            qc, shots = build_qiskit_bell_circuit(qubits, shots)
            backend = AerSimulator(method="statevector", device="GPU")
            result = backend.run(qc, shots=shots).result()
            counts = result.get_counts()
            return ProviderResult(
                True,
                {
                    "provider": self.name,
                    "framework": "qiskit-aer + cuQuantum",
                    "backend": "statevector/GPU",
                    "counts": counts,
                    "shots": shots,
                    "qubits": qubits,
                    "acceleration": "NVIDIA cuStateVec",
                },
            )
        except ImportError:
            return ProviderResult(
                False,
                {},
                "Install: pip install -e '.[quantum,cuquantum]' with CUDA/cuQuantum drivers.",
            )
        except Exception as e:
            return ProviderResult(
                False,
                {},
                f"cuQuantum GPU path unavailable ({e}). Use qiskit_aer CPU or install NVIDIA cuQuantum.",
            )
