from typing import Any

from agents.base import AgentResult, BaseAgent
from core.policy.policy_engine import PolicyEngine


class SecurityPolicyAgent(BaseAgent):
    name = "SecurityPolicyAgent"

    def run(self, task: dict[str, Any]) -> AgentResult:
        engine = PolicyEngine()
        job = {
            "constraints": task.get("constraints", {}),
            "data_classification": task.get("data_classification", "public_demo"),
            "job_type": task.get("job_type", "circuit_simulation"),
        }
        decision = engine.evaluate_job(job)
        return AgentResult(
            self.name,
            {
                "allowed": decision.allowed,
                "reason": decision.reason or "Job complies with default policy",
                "policy_version": "0.1.0",
            },
        )
