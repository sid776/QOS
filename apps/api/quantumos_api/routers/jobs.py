import asyncio
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from apps.api.quantumos_api.dependencies import get_db
from core.kernel.job_kernel import QuantumKernel
from db.session import SessionLocal

router = APIRouter(prefix="/v1/jobs", tags=["jobs"])


class JobCreateBody(BaseModel):
    tenant_id: str | None = None
    job_type: str
    skill: str | None = None
    input: dict[str, Any] = Field(default_factory=dict)
    constraints: dict[str, Any] = Field(default_factory=dict)
    preferred_backend: str = "auto"
    data_classification: str = "public_demo"


def _process_job_sync(job_id: uuid.UUID) -> dict[str, Any]:
    """Run in a thread with a fresh DB session (request session is closed after response)."""
    db = SessionLocal()
    try:
        kernel = QuantumKernel(db)
        job = kernel.scheduler.process_job(job_id)
        return {
            "job_id": f"job_{job.id}",
            "state": job.state,
            "selected_provider": job.selected_provider,
            "result": job.result_json,
            "error": job.error,
            "job_type": job.job_type,
            "skill": job.skill,
        }
    finally:
        db.close()


@router.post("")
async def create_job(
    body: JobCreateBody,
    db: Session = Depends(get_db),
    wait: bool = Query(True, description="Wait for job to finish before responding"),
):
    kernel = QuantumKernel(db)
    payload = body.model_dump()
    payload["constraints"] = {
        **body.constraints,
        "data_classification": body.data_classification,
    }
    job = kernel.create_job(payload)
    job_id = job.id

    if wait:
        loop = asyncio.get_running_loop()
        result = await loop.run_in_executor(None, _process_job_sync, job_id)
        return result

    asyncio.create_task(asyncio.to_thread(_process_job_sync, job_id))
    return {"job_id": f"job_{job_id}", "state": job.state}


@router.get("")
def list_jobs(db: Session = Depends(get_db), limit: int = 50):
    kernel = QuantumKernel(db)
    jobs = kernel.list_jobs(limit=limit)
    return {
        "jobs": [
            {
                "job_id": f"job_{j.id}",
                "state": j.state,
                "job_type": j.job_type,
                "skill": j.skill,
                "selected_provider": j.selected_provider,
            }
            for j in jobs
        ]
    }


@router.get("/{job_id}")
def get_job(job_id: str, db: Session = Depends(get_db)):
    raw_id = job_id.replace("job_", "")
    try:
        uid = uuid.UUID(raw_id)
    except ValueError:
        raise HTTPException(404, "Invalid job id")
    kernel = QuantumKernel(db)
    job = kernel.get_job(uid)
    if not job:
        raise HTTPException(404, "Job not found")
    return {
        "job_id": f"job_{job.id}",
        "state": job.state,
        "selected_provider": job.selected_provider,
        "result": job.result_json,
        "error": job.error,
        "job_type": job.job_type,
        "skill": job.skill,
    }
