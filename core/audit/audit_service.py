import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from core.audit.hash_chain import compute_event_hash
from db.models import AuditEvent


class AuditService:
    def __init__(self, db: Session):
        self.db = db

    def _last_hash(self, tenant_id: uuid.UUID | None) -> str | None:
        stmt = (
            select(AuditEvent.event_hash)
            .where(AuditEvent.tenant_id == tenant_id)
            .order_by(AuditEvent.created_at.desc())
            .limit(1)
        )
        row = self.db.execute(stmt).scalar_one_or_none()
        return row

    def emit(
        self,
        operation: str,
        success: bool,
        *,
        tenant_id: uuid.UUID | None = None,
        actor: str | None = "system",
        resource_type: str | None = None,
        resource_id: str | None = None,
        metadata: dict[str, Any] | None = None,
        policy_version: str | None = None,
        request_id: str | None = None,
    ) -> AuditEvent:
        event_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)
        previous_hash = self._last_hash(tenant_id)
        event_hash = compute_event_hash(
            event_id=event_id,
            operation=operation,
            resource_id=resource_id,
            success=success,
            timestamp=now.isoformat(),
            previous_hash=previous_hash,
            metadata=metadata,
        )
        event = AuditEvent(
            id=uuid.UUID(event_id),
            tenant_id=tenant_id,
            actor=actor,
            operation=operation,
            resource_type=resource_type,
            resource_id=resource_id,
            success=success,
            metadata_json=metadata,
            policy_version=policy_version,
            request_id=request_id,
            previous_hash=previous_hash,
            event_hash=event_hash,
            created_at=now,
        )
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

    def list_events(self, limit: int = 100) -> list[AuditEvent]:
        stmt = select(AuditEvent).order_by(AuditEvent.created_at.desc()).limit(limit)
        return list(self.db.execute(stmt).scalars().all())
