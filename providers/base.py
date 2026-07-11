from abc import ABC, abstractmethod
from typing import Any, ClassVar


class ProviderResult:
    def __init__(
        self,
        success: bool,
        output: dict[str, Any],
        error: str | None = None,
    ):
        self.success = success
        self.output = output
        self.error = error


class QuantumProvider(ABC):
    name: str
    provider_type: str
    capabilities: list[str]
    description: str = ""
    docs_url: str = ""
    region: str = ""
    required_env: ClassVar[list[str]] = []

    @abstractmethod
    def is_available(self) -> bool:
        pass

    @abstractmethod
    def estimate(self, job: dict[str, Any]) -> dict[str, Any]:
        pass

    @abstractmethod
    def run_job(self, job: dict[str, Any]) -> ProviderResult:
        pass

    def to_dict(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "available": self.is_available(),
            "capabilities": self.capabilities,
            "provider_type": self.provider_type,
            "description": self.description,
            "docs_url": self.docs_url,
            "region": self.region,
            "required_env": list(self.required_env),
        }
