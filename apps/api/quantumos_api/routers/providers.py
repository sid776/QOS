from fastapi import APIRouter

from core.registry.provider_registry import ProviderRegistry
from providers.framework_probe import probe_frameworks

router = APIRouter(prefix="/v1/providers", tags=["providers"])


@router.get("")
def list_providers():
    registry = ProviderRegistry()
    return {"providers": [p.to_dict() for p in registry.list_all()]}


@router.get("/frameworks")
def list_frameworks():
    """Optional SDK stack (Qiskit, PennyLane, TFQ, cuQuantum, Azure, IBM, PQC)."""
    return {"frameworks": probe_frameworks()}
