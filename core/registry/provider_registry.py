from providers.base import QuantumProvider
from providers.classical_provider import ClassicalLocalProvider
from providers.mock_provider import MockProvider
from providers.oqs_provider import OQSCryptoProvider
from providers.pennylane_provider import PennyLaneProvider
from providers.qiskit_provider import IBMQuantumProvider, QiskitAerProvider
from providers.azure_quantum_provider import AzureQuantumProvider, AzureQuantumPlaceholder
from providers.origin_quantum_provider import (
    OriginQuantumProvider,
    PyQPandaPlaceholder,
    QComputePlaceholder,
)


class ProviderRegistry:
    def __init__(self):
        self._providers: dict[str, QuantumProvider] = {}
        self._register_defaults()

    def _register_defaults(self) -> None:
        for cls in (
            ClassicalLocalProvider,
            MockProvider,
            QiskitAerProvider,
            PennyLaneProvider,
            OriginQuantumProvider,
            AzureQuantumProvider,
            IBMQuantumProvider,
            OQSCryptoProvider,
            # Legacy aliases (same implementation, alternate names)
            AzureQuantumPlaceholder,
            QComputePlaceholder,
            PyQPandaPlaceholder,
        ):
            p = cls()
            self._providers[p.name] = p

    def get(self, name: str) -> QuantumProvider | None:
        return self._providers.get(name)

    def list_all(self) -> list[QuantumProvider]:
        return list(self._providers.values())

    def register(self, provider: QuantumProvider) -> None:
        self._providers[provider.name] = provider
