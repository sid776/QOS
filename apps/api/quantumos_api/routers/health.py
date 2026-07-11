from fastapi import APIRouter

from apps.api.quantumos_api.config import settings
from db.bootstrap import db_status
from use_cases.catalog import USE_CASES

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    db = db_status()
    return {
        "status": "ok",
        "service": "quantumos-api",
        "version": settings.api_version,
        "database": "connected" if db["ready"] else "pending",
        "database_error": None if db["ready"] else db["error"],
        "use_case_count": len(USE_CASES),
        "use_case_ids": [uc.id for uc in USE_CASES],
    }
