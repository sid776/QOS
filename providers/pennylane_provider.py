from collections import Counter
from typing import Any

from providers.base import ProviderResult, QuantumProvider
from providers.circuit_builder import job_qubits_shots


class PennyLaneProvider(QuantumProvider):
    name = "pennylane_default_qubit"
    provider_type = "simulator"
    capabilities = ["circuit_simulation", "quantum_machine_learning", "quantum_demo", "quantum_chemistry"]
    description = "PennyLane default.qubit simulator — differentiable quantum programming."
    docs_url = "https://pennylane.ai/"
    region = "local"
    required_env: list[str] = []

    def is_available(self) -> bool:
        try:
            import pennylane  # noqa: F401
            return True
        except ImportError:
            return False

    def estimate(self, job: dict[str, Any]) -> dict[str, Any]:
        qubits, shots = job_qubits_shots(job)
        return {"estimated_cost_usd": 0, "estimated_latency_ms": 80 + shots // 30, "wires": qubits}

    def run_job(self, job: dict[str, Any]) -> ProviderResult:
        try:
            import pennylane as qml

            wires, shots = job_qubits_shots(job)
            dev = qml.device("default.qubit", wires=wires, shots=shots)

            @qml.qnode(dev)
            def circuit():
                for w in range(wires):
                    qml.Hadamard(wires=w)
                if wires >= 2:
                    qml.CNOT(wires=[0, 1])
                return qml.sample(wires=range(wires))

            samples = circuit()
            # samples shape: (shots, wires) — build bitstring counts
            counts: Counter[str] = Counter()
            for row in samples:
                key = "".join(str(int(b)) for b in row)
                counts[key] += 1

            return ProviderResult(
                True,
                {
                    "provider": self.name,
                    "framework": "pennylane",
                    "device": "default.qubit",
                    "counts": dict(counts),
                    "shots": shots,
                    "qubits": wires,
                    "circuit": "Hadamard + CNOT Bell preparation",
                },
            )
        except Exception as e:
            return ProviderResult(False, {}, str(e))
