import os
from typing import Any

from providers.base import ProviderResult, QuantumProvider
from providers.circuit_builder import build_qiskit_bell_circuit, job_qubits_shots


class QiskitAerProvider(QuantumProvider):
    name = "qiskit_aer"
    provider_type = "simulator"
    capabilities = ["circuit_simulation", "quantum_demo", "qkd_simulation"]
    description = "IBM Qiskit Aer local high-performance simulator (open source)."
    docs_url = "https://qiskit.org/"
    region = "local"
    required_env: list[str] = []

    def is_available(self) -> bool:
        try:
            import qiskit  # noqa: F401
            from qiskit_aer import Aer  # noqa: F401
            return True
        except ImportError:
            return False

    def estimate(self, job: dict[str, Any]) -> dict[str, Any]:
        qubits, shots = job_qubits_shots(job)
        return {
            "estimated_cost_usd": 0,
            "estimated_latency_ms": 100 + qubits * 20 + shots // 20,
            "backend": "qasm_simulator",
        }

    def run_job(self, job: dict[str, Any]) -> ProviderResult:
        try:
            from qiskit_aer import Aer

            qubits, shots = job_qubits_shots(job)
            qc, shots = build_qiskit_bell_circuit(qubits, shots)
            backend = Aer.get_backend("qasm_simulator")
            result = backend.run(qc, shots=shots).result()
            counts = result.get_counts()
            return ProviderResult(
                True,
                {
                    "provider": self.name,
                    "framework": "qiskit",
                    "backend": "qasm_simulator",
                    "counts": counts,
                    "shots": shots,
                    "qubits": qubits,
                    "circuit": "H on all, CX 0→1, measure",
                },
            )
        except Exception as e:
            return ProviderResult(False, {}, str(e))


class IBMQuantumProvider(QuantumProvider):
    """IBM Quantum cloud (free tier with IBM_QUANTUM_TOKEN)."""

    name = "ibm_quantum"
    provider_type = "cloud_quantum"
    capabilities = ["circuit_simulation"]
    description = "IBM Quantum cloud processors and simulators via qiskit-ibm-runtime."
    docs_url = "https://quantum.ibm.com/"
    region = "global (IBM Cloud)"
    required_env = ["IBM_QUANTUM_TOKEN"]

    def is_available(self) -> bool:
        if not os.getenv("IBM_QUANTUM_TOKEN"):
            return False
        try:
            from qiskit_ibm_runtime import QiskitRuntimeService  # noqa: F401
            return True
        except ImportError:
            return False

    def estimate(self, job: dict[str, Any]) -> dict[str, Any]:
        return {"estimated_cost_usd": 0, "estimated_latency_ms": 120000, "note": "IBM free tier queue"}

    def run_job(self, job: dict[str, Any]) -> ProviderResult:
        try:
            from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager
            from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler

            qubits, shots = job_qubits_shots(job)
            qc, shots = build_qiskit_bell_circuit(qubits, shots)
            backend_name = os.getenv("IBM_QUANTUM_BACKEND", "ibm_torino")
            service = QiskitRuntimeService(channel="ibm_quantum", token=os.environ["IBM_QUANTUM_TOKEN"])
            backend = service.backend(backend_name)
            pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
            isa_circuit = pm.run(qc)
            sampler = Sampler(backend)
            job_handle = sampler.run([isa_circuit], shots=shots)
            pub_result = job_handle.result()[0]
            counts = pub_result.data.c.get_counts() if hasattr(pub_result.data, "c") else {}
            return ProviderResult(
                True,
                {
                    "provider": self.name,
                    "framework": "qiskit-ibm-runtime",
                    "backend": backend_name,
                    "counts": dict(counts),
                    "shots": shots,
                    "qubits": qubits,
                },
            )
        except Exception as e:
            return ProviderResult(False, {}, str(e))
