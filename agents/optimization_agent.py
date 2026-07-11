from typing import Any

from agents.base import AgentResult, BaseAgent


class OptimizationAgent(BaseAgent):
    name = "OptimizationAgent"

    def run(self, task: dict[str, Any]) -> AgentResult:
        constraints = task.get("constraints", {})
        use_quantum = constraints.get("allow_cloud_quantum", False) and constraints.get(
            "max_cost_usd", 0
        ) > 0
        return AgentResult(
            self.name,
            {
                "workflow": "quantum_inspired" if use_quantum else "classical_heuristic",
                "recommended_provider": "classical_local"
                if not use_quantum
                else "azure_quantum",
                "steps": [
                    "Parse optimization objective",
                    "Encode variables",
                    "Run solver",
                    "Decode solution",
                ],
            },
        )
