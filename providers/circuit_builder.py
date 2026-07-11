"""Shared Bell-state / GHZ-style circuit parameters for provider backends."""

from typing import Any


def job_qubits_shots(job: dict[str, Any]) -> tuple[int, int]:
    inp = job.get("input", {})
    qubits = max(2, min(8, int(inp.get("qubits", 2))))
    shots = max(64, min(8192, int(inp.get("shots", 1024))))
    return qubits, shots


def build_qiskit_bell_circuit(qubits: int, shots: int):
    from qiskit import QuantumCircuit

    qc = QuantumCircuit(qubits, qubits)
    for i in range(qubits):
        qc.h(i)
    if qubits >= 2:
        qc.cx(0, 1)
    qc.measure(range(qubits), range(qubits))
    return qc, shots
