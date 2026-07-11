from core.registry.provider_registry import ProviderRegistry
from providers.origin_quantum_provider import OriginQuantumProvider
from providers.qiskit_provider import QiskitAerProvider


def test_provider_registry_lists_quantum_backends():
    registry = ProviderRegistry()
    names = {p.name for p in registry.list_all()}
    assert "qiskit_aer" in names
    assert "pennylane_default_qubit" in names
    assert "origin_quantum" in names
    assert "azure_quantum" in names
    assert "ibm_quantum" in names


def test_qiskit_aer_bell_counts():
    p = QiskitAerProvider()
    if not p.is_available():
        return
    result = p.run_job(
        {"input": {"qubits": 2, "shots": 256}, "job_type": "circuit_simulation"}
    )
    assert result.success
    counts = result.output["counts"]
    assert sum(counts.values()) == 256
    assert "00" in counts or "11" in counts


def test_origin_local_cpuqvm():
    p = OriginQuantumProvider()
    if not p._local_available():
        return
    result = p.run_job(
        {"input": {"qubits": 2, "shots": 128}, "job_type": "circuit_simulation"}
    )
    assert result.success
    assert result.output["mode"] == "local_cpuqvm"
    assert sum(result.output["counts"].values()) == 128


def test_provider_to_dict_metadata():
    p = QiskitAerProvider()
    meta = p.to_dict()
    assert meta["name"] == "qiskit_aer"
    assert "description" in meta
    assert "docs_url" in meta
