from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from apps.api.quantumos_api.dependencies import get_db
from core.audit.audit_service import AuditService
from security.crypto.pqc_service import PQCService

router = APIRouter(prefix="/v1/crypto", tags=["crypto"])


class CryptoPayload(BaseModel):
    payload: dict[str, Any] = Field(default_factory=dict)


class DecryptBody(BaseModel):
    ciphertext: str
    algorithm: str | None = None


class VerifyBody(BaseModel):
    payload: dict[str, Any]
    signature: str


@router.post("/encrypt")
def encrypt(body: CryptoPayload, db: Session = Depends(get_db)):
    svc = PQCService()
    result = svc.encrypt(body.payload)
    AuditService(db).emit(
        "encryption_requested",
        True,
        resource_type="crypto",
        metadata={"algorithm": result.get("algorithm")},
    )
    return result


@router.post("/decrypt")
def decrypt(body: dict[str, Any], db: Session = Depends(get_db)):
    svc = PQCService()
    try:
        result = svc.decrypt(body)
        AuditService(db).emit("decryption_requested", True, resource_type="crypto")
        return {"payload": result}
    except ValueError as e:
        AuditService(db).emit("decryption_requested", False, resource_type="crypto")
        return {"error": str(e)}


@router.post("/sign")
def sign(body: CryptoPayload, db: Session = Depends(get_db)):
    svc = PQCService()
    result = svc.sign(body.payload)
    AuditService(db).emit("signature_created", True, resource_type="crypto")
    return result


@router.post("/verify")
def verify(body: VerifyBody, db: Session = Depends(get_db)):
    svc = PQCService()
    ok = svc.verify(body.payload, body.signature)
    AuditService(db).emit("signature_verified", ok, resource_type="crypto")
    return {"valid": ok}
