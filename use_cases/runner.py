"""Execute catalog use cases and collect structured results."""

from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from typing import Any

from agents.orchestrator import run_workflow
from core.kernel.job_kernel import QuantumKernel
from db.models import Base
from db.session import SessionLocal, engine
from use_cases.catalog import USE_CASES, UseCase, default_input_for, get_use_case
from use_cases.comparison import run_comparison


def _merge_user_input(uc: UseCase, user_input: dict[str, Any] | None) -> dict[str, Any]:
    base = default_input_for(uc)
    merged = {**base, **(user_input or {})}

    if uc.mode == "workflow":
        constraints = dict((uc.task or {}).get("constraints") or {})
        if "allow_cloud_quantum" in merged:
            constraints["allow_cloud_quantum"] = bool(merged.pop("allow_cloud_quantum"))
        if "max_cost_usd" in merged:
            constraints["max_cost_usd"] = float(merged.pop("max_cost_usd"))
        if constraints:
            merged["constraints"] = constraints

    return merged


def _run_job_use_case(uc: UseCase, job_input: dict[str, Any]) -> dict[str, Any]:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        kernel = QuantumKernel(db)
        job = kernel.create_job(
            {
                "job_type": uc.job_type,
                "skill": uc.skill,
                "input": job_input,
                "constraints": {
                    "max_cost_usd": 0,
                    "allow_cloud_quantum": False,
                    "allow_simulator": True,
                },
                "preferred_backend": "auto",
                "data_classification": "public_demo",
            }
        )
        finished = kernel.scheduler.process_job(job.id)
        return {
            "job_id": f"job_{finished.id}",
            "state": finished.state,
            "selected_provider": finished.selected_provider,
            "result": finished.result_json,
            "error": finished.error,
            "input_used": job_input,
        }
    finally:
        db.close()


def run_use_case(use_case_id: str, user_input: dict[str, Any] | None = None) -> dict[str, Any]:
    uc = get_use_case(use_case_id)
    started = datetime.now(timezone.utc).isoformat()
    payload = _merge_user_input(uc, user_input)

    if uc.mode == "workflow":
        output = run_workflow(uc.workflow or "", payload)
        status = output.get("status", "UNKNOWN")
    else:
        output = _run_job_use_case(uc, payload)
        status = output.get("state", "UNKNOWN")

    return {
        "use_case_id": uc.id,
        "industry": uc.industry,
        "title": uc.title,
        "problem": uc.problem,
        "quantum_value": uc.quantum_value,
        "mode": uc.mode,
        "status": status,
        "started_at": started,
        "completed_at": datetime.now(timezone.utc).isoformat(),
        "input_used": payload,
        "output": output,
    }


def analyze_use_case(use_case_id: str, user_input: dict[str, Any] | None = None) -> dict[str, Any]:
    """Run classical baseline, quantum path, comparison, and full pipeline."""
    uc = get_use_case(use_case_id)
    started = datetime.now(timezone.utc).isoformat()
    payload = _merge_user_input(uc, user_input)

    comparison = run_comparison(use_case_id, payload)

    pipeline_error: str | None = None
    try:
        if uc.mode == "workflow":
            quantum_run = run_workflow(uc.workflow or "", payload)
            pipeline_status = quantum_run.get("status", "UNKNOWN")
        else:
            quantum_run = _run_job_use_case(uc, payload)
            pipeline_status = quantum_run.get("state", "UNKNOWN")
    except Exception as exc:
        pipeline_error = str(exc)
        quantum_run = {"state": "FAILED", "error": pipeline_error}
        pipeline_status = "FAILED"

    # Analysis succeeds when comparison completes; pipeline is supplementary.
    overall_status = "COMPLETED" if pipeline_status == "COMPLETED" else "PARTIAL"

    phases = [
        {
            "id": "validate",
            "label": "Validating your inputs",
            "status": "completed",
            "summary": f"{len(payload)} parameters accepted",
        },
        {
            "id": "classical",
            "label": comparison["classical"]["label"],
            "status": "completed",
            "summary": comparison["classical"]["method"],
            "metrics": comparison["classical"]["metrics"],
        },
        {
            "id": "quantum",
            "label": comparison["quantum"]["label"],
            "status": "completed",
            "summary": comparison["quantum"]["method"],
            "metrics": comparison["quantum"]["metrics"],
        },
        {
            "id": "compare",
            "label": "Computing quantum advantage",
            "status": "completed",
            "summary": comparison["comparison"]["headline"],
        },
        {
            "id": "pipeline",
            "label": "Running full QuantumOS pipeline",
            "status": "completed" if pipeline_status == "COMPLETED" else "failed",
            "summary": (
                f"Pipeline status: {pipeline_status}"
                if not pipeline_error
                else f"Pipeline failed: {pipeline_error[:120]}"
            ),
        },
    ]

    return {
        "use_case_id": uc.id,
        "industry": uc.industry,
        "title": uc.title,
        "status": overall_status,
        "pipeline_status": pipeline_status,
        "pipeline_error": pipeline_error,
        "started_at": started,
        "completed_at": datetime.now(timezone.utc).isoformat(),
        "input_used": payload,
        "phases": phases,
        "classical": comparison["classical"],
        "quantum": comparison["quantum"],
        "comparison": comparison["comparison"],
        "quantum_run": quantum_run,
    }


def run_all_use_cases() -> dict[str, Any]:
    results = []
    for uc in USE_CASES:
        try:
            results.append(run_use_case(uc.id))
        except Exception as e:
            results.append(
                {
                    "use_case_id": uc.id,
                    "title": uc.title,
                    "status": "FAILED",
                    "error": str(e),
                }
            )
    completed = sum(1 for r in results if r.get("status") == "COMPLETED")
    return {
        "summary": {
            "total": len(USE_CASES),
            "completed": completed,
            "failed": len(results) - completed,
        },
        "results": results,
    }


def _serialize_use_case(uc: UseCase) -> dict[str, Any]:
    out: dict[str, Any] = {
        "id": uc.id,
        "industry": uc.industry,
        "title": uc.title,
        "description": uc.description,
        "problem": uc.problem,
        "quantum_value": uc.quantum_value,
        "audience": uc.audience,
        "outcome_preview": uc.outcome_preview,
        "highlights": uc.highlights,
        "steps": uc.steps,
        "tags": uc.tags,
        "metrics": uc.metrics,
        "mode": uc.mode,
        "input_fields": deepcopy(uc.input_fields),
        "default_input": default_input_for(uc),
    }
    if uc.workflow:
        out["workflow"] = uc.workflow
    if uc.skill:
        out["skill"] = uc.skill
    return out


def list_use_cases() -> list[dict[str, Any]]:
    return [_serialize_use_case(uc) for uc in USE_CASES]
