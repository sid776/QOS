import os
import uuid
from typing import Any

from sqlalchemy.orm import Session

from core.audit.audit_service import AuditService
from core.kernel.states import JobState
from core.scheduler.queue import InProcessJobQueue
from core.scheduler.scheduler import JobScheduler
from core.registry.provider_registry import ProviderRegistry
from core.registry.skill_registry import SkillRegistry
from core.policy.policy_engine import PolicyEngine
from db.models import Job, JobEvent, Tenant


class QuantumKernel:
    _queue = InProcessJobQueue()

    def __init__(self, db: Session):
        self.db = db
        self.registry = ProviderRegistry()
        self.skills = SkillRegistry()
        self.policy = PolicyEngine()
        self.scheduler = JobScheduler(
            db, self.registry, self.skills, self.policy
        )
        self.audit = AuditService(db)

    def _ensure_tenant(self, tenant_id: str | None) -> uuid.UUID:
        tid = tenant_id or os.getenv("DEFAULT_TENANT_ID", "tenant_demo")
        tenant = self.db.query(Tenant).filter(Tenant.name == tid).first()
        if not tenant:
            tenant = Tenant(name=tid)
            self.db.add(tenant)
            self.db.commit()
            self.db.refresh(tenant)
        return tenant.id

    def create_job(self, payload: dict[str, Any]) -> Job:
        tenant_uuid = self._ensure_tenant(payload.get("tenant_id"))
        job = Job(
            tenant_id=tenant_uuid,
            job_type=payload["job_type"],
            skill=payload.get("skill"),
            state=JobState.CREATED.value,
            preferred_backend=payload.get("preferred_backend", "auto"),
            input_json=payload.get("input", {}),
            constraints_json=payload.get("constraints"),
        )
        self.db.add(job)
        self.db.flush()

        self.db.add(
            JobEvent(
                job_id=job.id,
                event_type="created",
                message="Job created",
            )
        )
        job.state = JobState.QUEUED.value
        self.db.add(
            JobEvent(job_id=job.id, event_type="queued", message="Job queued")
        )
        self.audit.emit(
            "job_created",
            True,
            tenant_id=tenant_uuid,
            resource_type="job",
            resource_id=str(job.id),
        )
        self.audit.emit(
            "job_queued",
            True,
            tenant_id=tenant_uuid,
            resource_type="job",
            resource_id=str(job.id),
        )
        self.db.commit()
        self.db.refresh(job)
        return job

    async def enqueue(self, job_id: uuid.UUID) -> None:
        await self._queue.enqueue(job_id)

    async def process_next(self) -> Job | None:
        job_id = await self._queue.dequeue()
        if job_id is None:
            return None
        return self.scheduler.process_job(job_id)

    def get_job(self, job_id: uuid.UUID) -> Job | None:
        return self.db.get(Job, job_id)

    def list_jobs(self, limit: int = 50) -> list[Job]:
        return (
            self.db.query(Job)
            .order_by(Job.created_at.desc())
            .limit(limit)
            .all()
        )
