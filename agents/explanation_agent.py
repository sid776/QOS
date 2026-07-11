from typing import Any

from agents.base import AgentResult, BaseAgent


class ExplanationAgent(BaseAgent):
    name = "ExplanationAgent"

    def run(self, task: dict[str, Any]) -> AgentResult:
        result = task.get("result", {})
        state = task.get("state", "COMPLETED")
        if state == "COMPLETED" and "counts" in result:
            explanation = (
                "The quantum simulator measured the circuit many times. "
                "The count distribution shows how often each bitstring appeared."
            )
        elif state == "FAILED":
            explanation = f"The job failed: {task.get('error', 'unknown error')}"
        else:
            explanation = f"Job is in state {state}."
        return AgentResult(self.name, {"explanation": explanation, "state": state})
