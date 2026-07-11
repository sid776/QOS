# QuantumOS Developer Guide

Full interactive version: dashboard → **Dev Guide** (`/dev-guide`) or sidebar **Developer Guide**.

Each topic in the UI shows **Plain English** and **Developer detail** side by side.

## Quick start

```bash
cd quantumos
pip install -r requirements-dev.txt
pip install -e ".[quantum]"

export PYTHONPATH=$(pwd)
export DATABASE_URL=sqlite:///./quantumos_local.db
uvicorn apps.api.quantumos_api.main:app --reload --port 8000

cd apps/dashboard && npm install && npm run dev
```

Windows: `.\scripts\start-local.ps1`

## Architecture

```
Client (Dashboard / CLI)
    → FastAPI (apps/api)
        → QuantumKernel.create_job()
        → JobScheduler.process_job()
            → PolicyEngine
            → BackendRouter → Provider
            → SkillRegistry (optional)
        → AuditService
    → SQLAlchemy (PostgreSQL or SQLite)
```

## Core modules

| Module | Layman | Code |
|--------|--------|------|
| Kernel | Receives jobs, tracks state | `core/kernel/job_kernel.py` |
| Scheduler | Runs the job pipeline | `core/scheduler/scheduler.py` |
| Router | Picks provider | `core/router/backend_router.py` |
| Policy | Allow/deny rules | `core/policy/policy_engine.py` |
| Audit | Tamper-evident log | `core/audit/audit_service.py` |
| Skills | Plug-in apps | `skills/*/handler.py` |
| Agents | Rule-based helpers | `agents/*.py` |
| Workflows | Chained agents + jobs | `agents/orchestrator.py` |
| Use cases | Industry demos | `use_cases/catalog.py` |

## Job states

`CREATED` → `QUEUED` → `PLANNING` → `ROUTING` → `RUNNING` → `COMPLETED` | `FAILED` | `REJECTED`

## Adding extensions

See Dev Guide section 13 in the dashboard for step-by-step file paths.

## Tests

```bash
pytest tests/ -v
```

## Security

- Mock PQC only (`security/crypto/pqc_service.py`) — not production.
- No secrets in logs.
- Default policy blocks cloud quantum without approval.
