from abc import ABC, abstractmethod
from typing import Any


class AgentResult:
    def __init__(self, agent: str, plan: dict[str, Any]):
        self.agent = agent
        self.plan = plan


class BaseAgent(ABC):
    name: str

    @abstractmethod
    def run(self, task: dict[str, Any]) -> AgentResult:
        pass
