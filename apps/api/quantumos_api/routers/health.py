from fastapi import APIRouter

from apps.api.quantumos_api.config import settings
from use_cases.catalog import USE_CASES

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    return {
        "status": "ok",
        "service": "quantumos-api",
        "version": settings.api_version,
        "use_case_count": len(USE_CASES),
        "use_case_ids": [uc.id for uc in USE_CASES],
    }
