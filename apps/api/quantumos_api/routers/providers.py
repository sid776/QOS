from fastapi import APIRouter

from core.registry.provider_registry import ProviderRegistry

router = APIRouter(prefix="/v1/providers", tags=["providers"])


@router.get("")
def list_providers():
    registry = ProviderRegistry()
    return {"providers": [p.to_dict() for p in registry.list_all()]}
