import hashlib
import json
from typing import Any


def compute_event_hash(
    event_id: str,
    operation: str,
    resource_id: str | None,
    success: bool,
    timestamp: str,
    previous_hash: str | None,
    metadata: dict[str, Any] | None = None,
) -> str:
    payload = {
        "event_id": event_id,
        "operation": operation,
        "resource_id": resource_id,
        "success": success,
        "timestamp": timestamp,
        "previous_hash": previous_hash or "",
        "metadata": metadata or {},
    }
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()
