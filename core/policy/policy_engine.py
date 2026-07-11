from pathlib import Path
from typing import Any

import yaml

from providers.base import QuantumProvider


class PolicyDecision:
    def __init__(self, allowed: bool, reason: str | None = None):
        self.allowed = allowed
        self.reason = reason


class PolicyEngine:
    def __init__(self, policy_path: Path | None = None):
        path = policy_path or Path(__file__).parent / "default_policy.yaml"
        with open(path, encoding="utf-8") as f:
            self.policy = yaml.safe_load(f)

    def evaluate_job(
        self,
        job: dict[str, Any],
        provider: QuantumProvider | None = None,
    ) -> PolicyDecision:
        constraints = job.get("constraints") or {}
        data_classification = job.get("data_classification", "public_demo")

        for rule in self.policy.get("rules", []):
            cond = rule.get("if", {})
            if not self._matches(cond, constraints, data_classification):
                continue

            deny_types = rule.get("deny_provider_types", [])
            if provider and provider.provider_type in deny_types:
                return PolicyDecision(
                    False,
                    f"Policy {rule['id']}: provider type {provider.provider_type} denied",
                )

            deny_caps = rule.get("deny_capabilities", [])
            if provider:
                for cap in deny_caps:
                    if cap in provider.capabilities:
                        return PolicyDecision(
                            False,
                            f"Policy {rule['id']}: capability {cap} denied",
                        )

            require_local = rule.get("require_providers", [])
            if "local" in require_local and provider:
                if provider.provider_type not in ("local", "simulator", "crypto"):
                    return PolicyDecision(
                        False,
                        f"Policy {rule['id']}: only local providers allowed",
                    )

        return PolicyDecision(True)

    def _matches(
        self,
        cond: dict[str, Any],
        constraints: dict[str, Any],
        data_classification: str,
    ) -> bool:
        for key, expected in cond.items():
            if key == "data_classification":
                if data_classification != expected:
                    return False
            elif constraints.get(key) != expected:
                return False
        return True
