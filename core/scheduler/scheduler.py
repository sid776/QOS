import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from core.audit.audit_service import AuditService
from core.kernel.states import JobState
from core.policy.policy_engine import PolicyEngine
from core.registry.provider_registry import ProviderRegistry
from core.registry.skill_registry import SkillRegistry
from core.router.backend_router import BackendRouter
from db.models import Job, JobEvent


class JobScheduler:
    def __init__(
        self,
        db: Session,
        registry: ProviderRegistry,
        skill_registry: SkillRegistry,
        policy: PolicyEngine,
    ):
        self.db = db
        self.registry = registry
        self.skills = skill_registry
        self.policy = policy
        self.router = BackendRouter(registry)
        self.audit = AuditService(db)

    def _add_event(self, job_id: uuid.UUID, event_type: str, message: str, metadata: dict | None = None):
        ev = JobEvent(
            job_id=job_id,
            event_type=event_type,
            message=message,
            metadata_json=metadata,
        )
        self.db.add(ev)

    def process_job(self, job_id: uuid.UUID) -> Job:
        job = self.db.get(Job, job_id)
        if not job:
            raise ValueError(f"Job not found: {job_id}")

        job_payload = self._job_to_dict(job)
        job.state = JobState.PLANNING.value
        self._add_event(job.id, "planning", "Job planning started")
        self.db.commit()

        decision = self.policy.evaluate_job(job_payload)
        if not decision.allowed:
            job.state = JobState.REJECTED.value
            job.error = decision.reason
            self._add_event(job.id, "rejected", decision.reason or "Policy rejected")
            self.audit.emit(
                "policy_rejected",
                False,
                resource_type="job",
                resource_id=str(job.id),
                metadata={"reason": decision.reason},
            )
            self.db.commit()
            return job

        job.state = JobState.ROUTING.value
        self._add_event(job.id, "routing", "Selecting backend")
        self.db.commit()

        provider = self.router.select(job_payload)
        if not provider:
            job.state = JobState.FAILED.value
            job.error = "No suitable provider"
            self.db.commit()
            return job

        provider_decision = self.policy.evaluate_job(job_payload, provider)
        if not provider_decision.allowed:
            job.state = JobState.REJECTED.value
            job.error = provider_decision.reason
            self.audit.emit("policy_rejected", False, resource_type="job", resource_id=str(job.id))
            self.db.commit()
            return job

        job.selected_provider = provider.name
        self.audit.emit(
            "provider_selected",
            True,
            resource_type="job",
            resource_id=str(job.id),
            metadata={"provider": provider.name},
        )

        job.state = JobState.RUNNING.value
        self._add_event(job.id, "running", f"Running on {provider.name}")
        self.audit.emit("job_started", True, resource_type="job", resource_id=str(job.id))
        self.db.commit()

        try:
            if job.skill:
                skill_result = self.skills.run_skill(job.skill, job.input_json)
                job_payload["skill_result"] = skill_result

            result = provider.run_job(job_payload)
            if result.success:
                job.state = JobState.COMPLETED.value
                job.result_json = result.output
                if job.skill and "skill_result" in job_payload:
                    job.result_json = {**result.output, "skill": job_payload["skill_result"]}
                self.audit.emit("job_completed", True, resource_type="job", resource_id=str(job.id))
                self._add_event(job.id, "completed", "Job completed")
            else:
                job.state = JobState.FAILED.value
                job.error = result.error
                self.audit.emit("job_failed", False, resource_type="job", resource_id=str(job.id))
                self._add_event(job.id, "failed", result.error or "Unknown error")
        except Exception as e:
            job.state = JobState.FAILED.value
            job.error = str(e)
            self.audit.emit("job_failed", False, resource_type="job", resource_id=str(job.id))
            self._add_event(job.id, "failed", str(e))

        job.updated_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(job)
        return job

    def _job_to_dict(self, job: Job) -> dict[str, Any]:
        return {
            "job_id": str(job.id),
            "tenant_id": str(job.tenant_id) if job.tenant_id else None,
            "job_type": job.job_type,
            "skill": job.skill,
            "input": job.input_json,
            "constraints": job.constraints_json or {},
            "preferred_backend": job.preferred_backend or "auto",
            "data_classification": (job.constraints_json or {}).get(
                "data_classification", "public_demo"
            ),
        }
