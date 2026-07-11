from typing import Any

from agents.backend_selection_agent import BackendSelectionAgent
from agents.circuit_generation_agent import CircuitGenerationAgent
from agents.optimization_agent import OptimizationAgent
from agents.crypto_migration_agent import CryptoMigrationAgent
from agents.security_policy_agent import SecurityPolicyAgent
from agents.explanation_agent import ExplanationAgent
from agents.base import AgentResult, BaseAgent


AGENTS: dict[str, type[BaseAgent]] = {
    "BackendSelectionAgent": BackendSelectionAgent,
    "CircuitGenerationAgent": CircuitGenerationAgent,
    "OptimizationAgent": OptimizationAgent,
    "CryptoMigrationAgent": CryptoMigrationAgent,
    "SecurityPolicyAgent": SecurityPolicyAgent,
    "ExplanationAgent": ExplanationAgent,
}


def run_agent(name: str, task: dict[str, Any]) -> AgentResult:
    cls = AGENTS.get(name)
    if not cls:
        raise ValueError(f"Unknown agent: {name}")
    return cls().run(task)
