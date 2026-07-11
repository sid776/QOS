from typing import Any

from pydantic import BaseModel, Field


class JobConstraints(BaseModel):
    max_cost_usd: float = 0
    allow_cloud_quantum: bool = False
    allow_simulator: bool = True
    max_qubits: int = 20


class JobCreateRequest(BaseModel):
    tenant_id: str | None = None
    job_type: str
    skill: str | None = None
    input: dict[str, Any] = Field(default_factory=dict)
    constraints: JobConstraints = Field(default_factory=JobConstraints)
    preferred_backend: str = "auto"
    data_classification: str = "public_demo"


class JobResponse(BaseModel):
    job_id: str
    state: str
    selected_provider: str | None = None
    result: dict[str, Any] | None = None
    error: str | None = None
