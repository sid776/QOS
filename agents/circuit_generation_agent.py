from typing import Any

from agents.base import AgentResult, BaseAgent


class CircuitGenerationAgent(BaseAgent):
    name = "CircuitGenerationAgent"

    def run(self, task: dict[str, Any]) -> AgentResult:
        qubits = int(task.get("qubits", task.get("input", {}).get("qubits", 2)))
        gates = ["h"] * qubits + ["measure"] * qubits
        return AgentResult(
            self.name,
            {
                "circuit_description": f"{qubits}-qubit superposition with measurement",
                "gates": gates,
                "qubits": qubits,
                "recommended_provider": "qiskit_aer",
            },
        )
