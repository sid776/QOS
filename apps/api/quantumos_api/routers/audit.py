from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from apps.api.quantumos_api.dependencies import get_db
from core.audit.audit_service import AuditService

router = APIRouter(prefix="/v1/audit", tags=["audit"])


@router.get("")
def list_audit(db: Session = Depends(get_db), limit: int = 100):
    svc = AuditService(db)
    events = svc.list_events(limit=limit)
    return {
        "events": [
            {
                "event_id": str(e.id),
                "operation": e.operation,
                "success": e.success,
                "resource_type": e.resource_type,
                "resource_id": e.resource_id,
                "event_hash": e.event_hash,
                "previous_hash": e.previous_hash,
                "created_at": e.created_at.isoformat(),
            }
            for e in events
        ]
    }
