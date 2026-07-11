from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from core.registry.skill_registry import SkillRegistry

router = APIRouter(prefix="/v1/skills", tags=["skills"])

SKILL_DEFAULT_INPUTS: dict[str, dict] = {
    "hello_quantum": {"qubits": 2, "shots": 1024},
    "qrng_demo": {"bytes": 16},
    "bb84_simulator": {"bits": 64, "sample_check": 8},
    "portfolio_optimizer": {
        "assets": ["AAPL", "MSFT", "NVDA", "GOOG"],
        "budget": 100000,
        "risk": "medium",
    },
    "route_optimizer": {
        "stops": ["Warehouse", "Store A", "Store B", "Store C", "Store D"],
        "return_to_start": True,
    },
    "pqc_encryptor": {"message": "hello quantum-safe world", "label": "demo"},
    "crypto_migration_scan": {
        "code": "from Crypto.PublicKey import RSA\nhash = MD5.new(data)\ncurve = ECDSA.sign(msg)"
    },
}


class InstallBody(BaseModel):
    name: str
    source: str = "local"


def _registry() -> SkillRegistry:
    return SkillRegistry()


@router.get("")
def list_skills():
    registry = _registry()
    return {"skills": [s.to_dict() for s in registry.list_skills()]}


@router.get("/{name}")
def get_skill(name: str):
    registry = _registry()
    info = registry.get(name)
    if not info:
        raise HTTPException(404, f"Skill not found: {name}")
    sample = registry.load_sample_input(name) or SKILL_DEFAULT_INPUTS.get(name, {})
    return {**info.to_dict(include_manifest=True), "sample_input": sample}


@router.get("/{name}/sample")
def get_skill_sample(name: str):
    registry = _registry()
    if not registry.get(name):
        raise HTTPException(404, f"Skill not found: {name}")
    sample = registry.load_sample_input(name)
    if not sample:
        sample = SKILL_DEFAULT_INPUTS.get(name, {})
    info = registry.get(name)
    return {
        "name": name,
        "sample_input": sample,
        "default_job_type": info.manifest.get("default_job_type", "circuit_simulation") if info else "circuit_simulation",
    }


@router.post("/install")
def install_skill(body: InstallBody):
    registry = _registry()
    ok = registry.install_from_local(body.name)
    if not ok:
        return {"installed": False, "name": body.name, "error": "Skill not found"}
    return {"installed": True, "name": body.name}
