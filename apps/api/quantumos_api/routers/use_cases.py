from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from use_cases.catalog import get_use_case
from use_cases.runner import _serialize_use_case, analyze_use_case, list_use_cases, run_all_use_cases, run_use_case

router = APIRouter(prefix="/v1/use-cases", tags=["use-cases"])


class RunUseCaseRequest(BaseModel):
    input: dict[str, Any] = Field(default_factory=dict)


def _ensure_use_case(use_case_id: str):
    try:
        return get_use_case(use_case_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e


@router.get("")
def get_catalog():
    return {"use_cases": list_use_cases()}


@router.get("/{use_case_id}")
def get_one(use_case_id: str):
    uc = _ensure_use_case(use_case_id)
    return _serialize_use_case(uc)


@router.post("/{use_case_id}/run")
def run_one(use_case_id: str, body: RunUseCaseRequest | None = None):
    _ensure_use_case(use_case_id)
    try:
        return run_use_case(use_case_id, (body.input if body else {}))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Run failed: {e}") from e


@router.post("/{use_case_id}/analyze")
def analyze_one(use_case_id: str, body: RunUseCaseRequest | None = None):
    _ensure_use_case(use_case_id)
    try:
        return analyze_use_case(use_case_id, (body.input if body else {}))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {e}") from e


@router.post("/run-all")
def run_all():
    return run_all_use_cases()
