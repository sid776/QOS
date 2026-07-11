from core.audit.audit_service import AuditService
from core.audit.hash_chain import compute_event_hash


def test_audit_hash_chain(db_session):
    svc = AuditService(db_session)
    e1 = svc.emit("job_created", True, resource_id="job-1")
    e2 = svc.emit("job_completed", True, resource_id="job-1")
    assert e1.event_hash != e2.event_hash
    assert e2.previous_hash == e1.event_hash

    h = compute_event_hash(
        "id",
        "op",
        "res",
        True,
        "2020-01-01T00:00:00+00:00",
        None,
        {},
    )
    assert len(h) == 64
