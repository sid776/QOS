"""
Origin Quantum (China) — QPanda3 local CPUQVM simulator (free) and
Origin Quantum Cloud QPU via qpanda3_runtime (API key / research program).
https://qcloud.originqc.com.cn/
"""

import os
from typing import Any

from providers.base import ProviderResult, QuantumProvider
from providers.circuit_builder import job_qubits_shots


def _build_origin_bell_prog(qubits: int):
    from pyqpanda3.core import CNOT, H, QCircuit, QProg, measure

    circuit = QCircuit(qubits)
    for i in range(qubits):
        circuit << H(i)
    if qubits >= 2:
        circuit << CNOT(0, 1)
    prog = QProg()
    prog << circuit
    for i in range(qubits):
        prog << measure(i, i)
    return prog


class OriginQuantumProvider(QuantumProvider):
    name = "origin_quantum"
    provider_type = "cloud_quantum"
    capabilities = ["circuit_simulation", "quantum_demo", "qkd_simulation"]
    description = (
        "Origin Quantum (China) — free local CPUQVM via pyqpanda3; "
        "cloud WuKong QPU with ORIGIN_QUANTUM_API_KEY (research incentive program)."
    )
    docs_url = "https://qcloud.originqc.com.cn/en/"
    region = "China (Origin Quantum Cloud)"
    required_env = ["ORIGIN_QUANTUM_API_KEY"]

    def _local_available(self) -> bool:
        try:
            from pyqpanda3.core import CPUQVM  # noqa: F401
            return True
        except ImportError:
            return False

    def _cloud_available(self) -> bool:
        if not os.getenv("ORIGIN_QUANTUM_API_KEY"):
            return False
        try:
            from qpanda3_runtime import RuntimeService  # noqa: F401
            return True
        except ImportError:
            return False

    def is_available(self) -> bool:
        return self._local_available() or self._cloud_available()

    def estimate(self, job: dict[str, Any]) -> dict[str, Any]:
        if self._cloud_available():
            device = os.getenv("ORIGIN_QUANTUM_DEVICE", "WK_C180")
            return {
                "estimated_cost_usd": 0,
                "estimated_latency_ms": 180000,
                "mode": "cloud_qpu",
                "device": device,
                "note": "Free runtime via Origin research program when approved",
            }
        return {
            "estimated_cost_usd": 0,
            "estimated_latency_ms": 150,
            "mode": "local_cpuqvm",
        }

    def run_job(self, job: dict[str, Any]) -> ProviderResult:
        prefer_cloud = os.getenv("ORIGIN_QUANTUM_PREFER_CLOUD", "").lower() in ("1", "true", "yes")
        if prefer_cloud and self._cloud_available():
            return self._run_cloud(job)
        if self._local_available():
            return self._run_local(job)
        if self._cloud_available():
            return self._run_cloud(job)
        return ProviderResult(
            False,
            {},
            "Install pyqpanda3 for free local sim: pip install -e '.[origin]'. "
            "For WuKong cloud QPU set ORIGIN_QUANTUM_API_KEY from qcloud.originqc.com.cn",
        )

    def _run_local(self, job: dict[str, Any]) -> ProviderResult:
        try:
            from pyqpanda3.core import CPUQVM

            qubits, shots = job_qubits_shots(job)
            prog = _build_origin_bell_prog(qubits)
            vm = CPUQVM()
            vm.run(prog, shots)
            counts = dict(vm.result().get_counts())
            return ProviderResult(
                True,
                {
                    "provider": self.name,
                    "framework": "pyqpanda3",
                    "mode": "local_cpuqvm",
                    "counts": counts,
                    "shots": shots,
                    "qubits": qubits,
                    "region": "local (Origin QPanda3 SDK)",
                },
            )
        except Exception as e:
            return ProviderResult(False, {}, str(e))

    def _run_cloud(self, job: dict[str, Any]) -> ProviderResult:
        try:
            from qpanda3_runtime import RuntimeService

            qubits, shots = job_qubits_shots(job)
            prog = _build_origin_bell_prog(qubits)
            device_id = os.getenv("ORIGIN_QUANTUM_DEVICE", "WK_C180")
            api_key = os.environ["ORIGIN_QUANTUM_API_KEY"]

            service = RuntimeService()
            service.login(api_key)
            task = service.sample(circuit=prog, qubit_count=qubits, shot_count=shots, device=service.device(device_id))
            result = task.get_result_sync()
            counts = {}
            if hasattr(result, "get_counts"):
                counts = dict(result.get_counts())
            elif isinstance(result, dict):
                counts = result.get("counts", result)

            return ProviderResult(
                True,
                {
                    "provider": self.name,
                    "framework": "qpanda3_runtime",
                    "mode": "cloud_qpu",
                    "device": device_id,
                    "counts": counts,
                    "shots": shots,
                    "qubits": qubits,
                    "region": "China — Origin Quantum Cloud",
                    "raw_result": str(result)[:500],
                },
            )
        except Exception as e:
            return ProviderResult(
                False,
                {},
                f"Origin cloud error: {e}. Apply for free research time at "
                "https://qcloud.originqc.com.cn/en/researchincentive",
            )


class QComputePlaceholder(OriginQuantumProvider):
    """Legacy name — Origin Quantum / QCompute cloud."""

    name = "qcompute_placeholder"


class PyQPandaPlaceholder(OriginQuantumProvider):
    """Legacy name — pyQPanda SDK."""

    name = "pyqpanda_placeholder"
