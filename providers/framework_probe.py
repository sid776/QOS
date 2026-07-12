"""Report which optional quantum frameworks are importable."""

from __future__ import annotations

from typing import Any


def probe_frameworks() -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []

    def _try(name: str, import_fn, docs: str, install: str) -> None:
        try:
            import_fn()
            entries.append({"name": name, "available": True, "docs_url": docs, "install": install})
        except Exception as exc:
            entries.append(
                {
                    "name": name,
                    "available": False,
                    "docs_url": docs,
                    "install": install,
                    "note": str(exc)[:120],
                }
            )

    _try(
        "Qiskit + Aer",
        lambda: (__import__("qiskit"), __import__("qiskit_aer")),
        "https://qiskit.org/",
        "pip install -e '.[quantum]'",
    )
    _try(
        "PennyLane",
        lambda: __import__("pennylane"),
        "https://pennylane.ai/",
        "pip install -e '.[quantum]'",
    )
    _try(
        "TensorFlow Quantum",
        lambda: (__import__("tensorflow_quantum"), __import__("cirq")),
        "https://www.tensorflow.org/quantum",
        "pip install -e '.[tfq]'",
    )
    _try(
        "NVIDIA cuQuantum (Aer GPU)",
        lambda: __import__("qiskit_aer").AerSimulator(method="statevector", device="GPU"),
        "https://developer.nvidia.com/cuquantum-sdk",
        "pip install -e '.[cuquantum]' + CUDA",
    )
    _try(
        "Azure Quantum",
        lambda: (__import__("azure.quantum"), __import__("azure.quantum.qiskit")),
        "https://learn.microsoft.com/azure/quantum/",
        "pip install -e '.[azure]'",
    )
    _try(
        "IBM Quantum Runtime",
        lambda: __import__("qiskit_ibm_runtime"),
        "https://quantum.ibm.com/",
        "pip install -e '.[ibm]'",
    )
    _try(
        "NIST PQC (ML-KEM / ML-DSA)",
        lambda: (__import__("kyber_py"), __import__("dilithium_py")),
        "https://csrc.nist.gov/projects/post-quantum-cryptography",
        "base install",
    )
    return entries
