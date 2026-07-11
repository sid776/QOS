from typing import Any

from agents.base import AgentResult, BaseAgent
from core.registry.provider_registry import ProviderRegistry
from core.router.backend_router import BackendRouter


class BackendSelectionAgent(BaseAgent):
    name = "BackendSelectionAgent"

    def run(self, task: dict[str, Any]) -> AgentResult:
        registry = ProviderRegistry()
        router = BackendRouter(registry)
        job = {
            "job_type": task.get("job_type", "circuit_simulation"),
            "constraints": task.get("constraints", {}),
            "input": task.get("input", {}),
            "preferred_backend": "auto",
        }
        provider = router.select(job)
        constraints = task.get("constraints", {})
        reason = "Selected based on job type, cost, and policy constraints."
        if not constraints.get("allow_cloud_quantum", False):
            reason = (
                "Cloud execution is not allowed and local provider supports this job type."
            )
        return AgentResult(
            self.name,
            {
                "recommended_provider": provider.name if provider else "mock_provider",
                "reason": reason,
            },
        )
