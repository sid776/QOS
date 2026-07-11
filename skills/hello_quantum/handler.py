from typing import Any


def _build_circuit(qubits: int) -> dict[str, Any]:
    gates: list[dict[str, Any]] = []
    for i in range(qubits):
        gates.append({"gate": "H", "qubit": i, "label": f"Superposition on q{i}"})
    if qubits >= 2:
        gates.append({"gate": "CX", "control": 0, "target": 1, "label": "Entangle q0 → q1 (Bell pair)"})
    for i in range(qubits):
        gates.append({"gate": "M", "qubit": i, "label": f"Measure q{i}"})
    return {
        "qubits": qubits,
        "gates": gates,
        "depth": len(gates),
        "description": "Hadamard on all qubits, CNOT 0→1 when qubits≥2, then measure",
    }


def run(input_data: dict[str, Any]) -> dict[str, Any]:
    qubits = max(2, min(4, int(input_data.get("qubits", 2))))
    shots = max(64, min(8192, int(input_data.get("shots", 1024))))
    circuit = _build_circuit(qubits)
    expected = {"00": 0.5, "11": 0.5} if qubits == 2 else None
    return {
        "skill": "hello_quantum",
        "message": "Bell-state circuit prepared for simulation",
        "qubits": qubits,
        "shots": shots,
        "circuit": circuit,
        "expected_distribution": expected,
        "note": "Provider merges measurement counts into job result",
    }
