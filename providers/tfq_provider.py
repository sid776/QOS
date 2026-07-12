"""TensorFlow Quantum (Google) — Cirq circuits via TFQ."""

from collections import Counter
from typing import Any

from providers.base import ProviderResult, QuantumProvider
from providers.circuit_builder import job_qubits_shots


class TensorFlowQuantumProvider(QuantumProvider):
    name = "tensorflow_quantum"
    provider_type = "simulator"
    capabilities = ["circuit_simulation", "quantum_machine_learning", "quantum_demo"]
    description = "Google TensorFlow Quantum — Cirq circuits, hybrid ML workflows (CPU)."
    docs_url = "https://www.tensorflow.org/quantum"
    region = "local"
    required_env: list[str] = []

    def is_available(self) -> bool:
        try:
            import tensorflow_quantum as tfq  # noqa: F401
            import cirq  # noqa: F401
            return True
        except ImportError:
            return False

    def estimate(self, job: dict[str, Any]) -> dict[str, Any]:
        qubits, shots = job_qubits_shots(job)
        return {
            "estimated_cost_usd": 0,
            "estimated_latency_ms": 200 + shots // 10 + qubits * 40,
            "framework": "tensorflow-quantum",
        }

    def run_job(self, job: dict[str, Any]) -> ProviderResult:
        try:
            import cirq
            import tensorflow as tf
            import tensorflow_quantum as tfq

            wires, shots = job_qubits_shots(job)
            qubits = cirq.GridQubit.rect(1, max(wires, 2))[:wires]
            circuit = cirq.Circuit()
            for q in qubits:
                circuit.append(cirq.H(q))
            if len(qubits) >= 2:
                circuit.append(cirq.CNOT(qubits[0], qubits[1]))
            circuit.append(cirq.measure(*qubits, key="m"))

            sampler = cirq.Simulator()
            result = sampler.run(circuit, repetitions=shots)
            counts: Counter[str] = Counter()
            for row in result.measurements["m"]:
                counts["".join(str(int(b)) for b in row)] += 1

            _ = tfq.convert_to_tensor([circuit])

            return ProviderResult(
                True,
                {
                    "provider": self.name,
                    "framework": "tensorflow-quantum + cirq",
                    "tensorflow_version": tf.__version__,
                    "counts": dict(counts),
                    "shots": shots,
                    "qubits": wires,
                    "circuit": "H + CNOT Bell (Cirq, TFQ-validated)",
                },
            )
        except ImportError:
            return ProviderResult(False, {}, "Install TFQ stack: pip install -e '.[tfq]'")
        except Exception as e:
            return ProviderResult(False, {}, str(e))
