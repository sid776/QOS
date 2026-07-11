import uuid
from pathlib import Path

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from apps.api.quantumos_api.dependencies import get_db
from db.models import PolicyRecord

router = APIRouter(prefix="/v1/policies", tags=["policies"])


class PolicyBody(BaseModel):
    name: str
    version: str = "0.1.0"
    policy_yaml: str | None = None
    tenant_id: str | None = None


@router.get("")
def list_policies(db: Session = Depends(get_db)):
    policies = db.query(PolicyRecord).filter(PolicyRecord.enabled.is_(True)).all()
    if not policies:
        default_path = Path(__file__).resolve().parents[4] / "core" / "policy" / "default_policy.yaml"
        yaml_text = default_path.read_text(encoding="utf-8")
        return {
            "policies": [
                {
                    "name": "default_policy",
                    "version": "0.1.0",
                    "source": "builtin",
                    "policy_yaml": yaml_text,
                }
            ]
        }
    return {
        "policies": [
            {
                "id": str(p.id),
                "name": p.name,
                "version": p.version,
                "policy_yaml": p.policy_yaml,
            }
            for p in policies
        ]
    }


@router.post("")
def create_policy(body: PolicyBody, db: Session = Depends(get_db)):
    if body.policy_yaml is None:
        default_path = Path(__file__).resolve().parents[4] / "core" / "policy" / "default_policy.yaml"
        yaml_text = default_path.read_text(encoding="utf-8")
    else:
        yaml_text = body.policy_yaml
    record = PolicyRecord(
        name=body.name,
        version=body.version,
        policy_yaml=yaml_text,
    )
    db.add(record)
    db.commit()
    return {"id": str(record.id), "name": record.name, "version": record.version}
