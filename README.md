# QuantumOS

**QuantumOS** is the agentic operating layer for quantum-safe and quantum-accelerated software.

It is a Linux-based developer runtime (not a custom kernel in MVP v1) with API, SDK, CLI, dashboard, quantum job scheduler, backend router, skill registry, policy engine, audit log, and rule-based agents.

## What QuantumOS Is

- Developer runtime for quantum, post-quantum, and hybrid workloads
- Quantum job scheduler and backend router
- Quantum-aware agent platform and skill registry
- Post-quantum security control plane (mock PQC in MVP — see warnings)
- Dashboard for jobs, providers, policies, and audit logs

## What QuantumOS Is Not

- Not a replacement for the Linux kernel in MVP
- Not a custom cryptography invention
- Not a hacking, wallet-cracking, or bank-access tool
- Not a guarantee of quantum speedup
- Not real QKD unless real QKD hardware is integrated
- Not a certified banking security product without compliance work

## Documentation

| Audience | Where |
|----------|--------|
| **Beginners / lay users** | Dashboard → **User Guide** (`/guide`) |
| **Developers** | Dashboard → **Dev Guide** (`/dev-guide`) or [docs/DEV_GUIDE.md](docs/DEV_GUIDE.md) |
| **Skills (features & API)** | [How Skills Work](#how-skills-work) below · Dashboard → `/skills` |
| **Quantum architecture (research)** | Dashboard → **README** → Quantum Research tab, or [docs/QUANTUM_RESEARCH.md](docs/QUANTUM_RESEARCH.md) |
| **Full README in app** | Dashboard → **README** (`/readme`) |

## Quickstart

### Docker Compose (recommended)

```bash
cp .env.example .env
docker compose up --build
```

- API: http://localhost:8000
- Dashboard: http://localhost:5173
- Docs: http://localhost:8000/docs

### Local development

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -e ".[dev]"

# Start PostgreSQL (or use docker compose up postgres -d)
export DATABASE_URL=postgresql://quantumos:quantumos@localhost:5432/quantumos

uvicorn apps.api.quantumos_api.main:app --reload --port 8000

# Dashboard
cd apps/dashboard && npm install && npm run dev
```

### Run tests

```bash
pip install -e ".[dev]"
pytest tests/ -v
```

## API Examples

```bash
curl http://localhost:8000/health
curl http://localhost:8000/v1/providers

curl -X POST http://localhost:8000/v1/jobs \
  -H "Content-Type: application/json" \
  -d '{"job_type":"circuit_simulation","skill":"hello_quantum","input":{"qubits":2,"shots":1024},"constraints":{"max_cost_usd":0,"allow_cloud_quantum":false}}'

curl http://localhost:8000/v1/jobs/job_<uuid>

curl -X POST http://localhost:8000/v1/agents/run \
  -H "Content-Type: application/json" \
  -d '{"agent":"BackendSelectionAgent","task":{"job_type":"optimization","constraints":{"max_cost_usd":0,"allow_cloud_quantum":false}}}'
```

## CLI Examples

```bash
pip install -e .
export QUANTUMOS_API_URL=http://localhost:8000

quantumos health
quantumos providers
quantumos skills list
quantumos run qrng_demo --input skills/qrng_demo/sample_input.json
quantumos jobs list
quantumos agent run BackendSelectionAgent --input examples/agent_task.json
quantumos audit list
quantumos crypto encrypt --input examples/payload.json
```

## Quantum Providers

QuantumOS routes jobs to simulators and cloud QPUs. Install optional SDKs, set credentials in `.env`, then check `GET /v1/providers`.

| Provider | Region | Install | Credentials |
|----------|--------|---------|-------------|
| `qiskit_aer` | Local | `pip install -e ".[quantum]"` | None |
| `pennylane_default_qubit` | Local | `pip install -e ".[quantum]"` | None |
| `origin_quantum` | China / local | `pip install -e ".[origin]"` | Optional `ORIGIN_QUANTUM_API_KEY` for WuKong cloud ([free research program](https://qcloud.originqc.com.cn/en/researchincentive)) |
| `azure_quantum` | Azure global | `pip install -e ".[azure]"` | `AZURE_QUANTUM_RESOURCE_ID` + `az login` |
| `ibm_quantum` | IBM Cloud | `pip install -e ".[ibm]"` | `IBM_QUANTUM_TOKEN` |

Full technical treatment (Bell-state reference circuit, job lifecycle, physics intuition): **[docs/QUANTUM_RESEARCH.md](docs/QUANTUM_RESEARCH.md)**.

```bash
# Local simulators + Origin CPUQVM (free)
pip install -e ".[quantum,origin]"

# Everything including Azure + IBM cloud
pip install -e ".[all]"
```

Cloud jobs require `allow_cloud_quantum: true` in job constraints (the dashboard enables this automatically when you pick a cloud backend).

## How to Add a Provider

1. Create `providers/my_provider.py` implementing `QuantumProvider`:

```python
from providers.base import ProviderResult, QuantumProvider

class MyProvider(QuantumProvider):
    name = "my_provider"
    provider_type = "local"
    capabilities = ["circuit_simulation"]

    def is_available(self) -> bool:
        return True

    def estimate(self, job): ...
    def run_job(self, job) -> ProviderResult: ...
```

2. Register it in `core/registry/provider_registry.py`.

## How Skills Work

Skills are reusable QuantumOS capabilities — small apps that prepare inputs, run domain logic, and return structured results. They are **not** standalone HTTP endpoints; they run inside the **job pipeline** alongside a quantum or classical **provider**.

### Architecture

```
Dashboard / CLI / Use Cases
        │
        ▼
  POST /v1/jobs  (skill + job_type + input)
        │
        ▼
  Job Scheduler
        ├── SkillRegistry.run_skill()  → skill logic (handler.py)
        └── BackendRouter → Provider.run_job()  → simulator / classical / mock
        │
        ▼
  Merged result saved to DB (skill output nested under result.skill)
```

1. **Discovery** — On startup, `SkillRegistry` scans `skills/*/skill.yaml` and loads metadata.
2. **Execution** — When a job includes a `skill` field, the scheduler calls `handler.py` → `run(input_data)`.
3. **Provider pass** — The selected backend (e.g. `qiskit_aer`, `classical_local`, `mock_provider`) also runs based on `job_type`.
4. **Merged output** — Provider output and skill output are combined: `{ ...provider_fields, "skill": { ...skill_fields } }`.

### Built-in skills (v0.2)

| Skill | Category | What it does | Dashboard result view |
|-------|----------|--------------|------------------------|
| `hello_quantum` | Quantum circuits | Builds a Bell-state circuit (H + CNOT + measure); provider adds measurement counts | Circuit steps + histogram |
| `qrng_demo` | Randomness | Generates random bytes with entropy analysis (OS CSPRNG demo) | Hex output + entropy meter |
| `bb84_simulator` | Quantum cryptography | Full BB84 QKD simulation: bases, sifted key, QBER | Protocol timeline table |
| `portfolio_optimizer` | Finance | Risk-aware portfolio weights and USD allocation | Pie chart + return/vol metrics |
| `route_optimizer` | Logistics | Nearest-neighbor TSP route with leg distances | Route timeline |
| `pqc_encryptor` | Security | Encrypts a payload via mock PQC service (Fernet demo) | Plaintext/ciphertext preview |
| `crypto_migration_scan` | Security | Scans code for weak crypto (RSA, MD5, ECDSA, etc.) with line-level findings | Findings table + risk level |

> **Demo disclaimer:** QRNG uses OS randomness, PQC is mock Fernet (not NIST PQC), BB84 is educational simulation, and optimizers use heuristics — not production trading or routing engines.

### Skill folder layout

Each skill lives under `skills/<name>/`:

```
skills/hello_quantum/
  skill.yaml          # Manifest: metadata, input_fields, default_job_type
  handler.py          # def run(input_data: dict) -> dict
  sample_input.json   # Optional default input for API and dashboard
```

### Manifest (`skill.yaml`)

Key fields the API exposes and the dashboard uses:

```yaml
name: hello_quantum
version: 0.2.0
type: quantum_demo
description: Human-readable summary shown on skill cards
default_job_type: circuit_simulation   # Used by scheduler + router
category: Quantum circuits             # Groups cards on /skills
icon: "⚛️"
result_view: circuit                   # Picks dashboard visualization
features:
  - Bullet points shown on skill cards
input_fields:                          # Drives the form on /skills
  - name: qubits
    type: number                       # number | text | tags | select | boolean | code
    label: Qubits
    min: 2
    max: 4
    default: 2
    help: Optional hint text
```

Supported `input_fields` types map to dashboard controls: sliders/numbers, text inputs, comma-separated tags, dropdowns, checkboxes, and code editors.

### API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/v1/skills` | List all skills with full metadata |
| `GET` | `/v1/skills/{name}` | Skill detail + `sample_input` |
| `GET` | `/v1/skills/{name}/sample` | Sample input + `default_job_type` |
| `POST` | `/v1/jobs?wait=true` | **Run a skill** (primary execution path) |

**List skills:**

```bash
curl http://localhost:8000/v1/skills
```

**Run a skill as a job:**

```bash
curl -X POST "http://localhost:8000/v1/jobs?wait=true" \
  -H "Content-Type: application/json" \
  -d '{
    "job_type": "circuit_simulation",
    "skill": "hello_quantum",
    "input": {"qubits": 2, "shots": 1024},
    "constraints": {"max_cost_usd": 0, "allow_cloud_quantum": false, "allow_simulator": true},
    "preferred_backend": "auto",
    "data_classification": "public_demo"
  }'
```

The response includes `state`, `job_id`, and `result`. Skill-specific output is under `result.skill`; provider fields (e.g. `counts`, `provider`) are at the top level of `result`.

**Get skill detail with defaults:**

```bash
curl http://localhost:8000/v1/skills/portfolio_optimizer
```

### Dashboard

| Page | URL | What you can do |
|------|-----|-----------------|
| **Skills catalog** | `/skills` | Browse all skills by category; click a card to expand the feature panel |
| **Skill detail** | `/skills/{name}` | Full-page form, run button, and result visualization |
| **Jobs** | `/jobs` | Submit jobs via JSON; view history |
| **Job detail** | `/jobs/{id}` | Skill-aware result view when the job has a `skill` field |
| **Home** | `/` | Quick Launch — one-click run for every skill |

**Using the Skills page:**

1. Open http://localhost:5173/skills (API must be running on port 8000).
2. Click a skill card to expand it.
3. Configure inputs in the form (or switch to **Advanced JSON editor**).
4. Click **Run skill** — the job runs synchronously (`wait=true`).
5. Results appear in the right panel (charts, tables, timelines depending on `result_view`).

If the page is empty, the API is likely offline. Start it with:

```bash
# Windows (from repo root)
$env:PYTHONPATH = (Get-Location)
$env:DATABASE_URL = "sqlite:///./quantumos_local.db"
.\.venv\Scripts\uvicorn apps.api.quantumos_api.main:app --host 127.0.0.1 --port 8000
```

```bash
# Dashboard (separate terminal)
cd apps/dashboard
$env:VITE_API_URL = "http://127.0.0.1:8000"
npm run dev -- --host 127.0.0.1 --port 5173
```

Or use `.\scripts\start-local.ps1` on Windows.

### CLI

```bash
quantumos skills list
quantumos run hello_quantum --input skills/hello_quantum/sample_input.json
quantumos run crypto_migration_scan --input skills/crypto_migration_scan/sample_input.json
```

### Handler contract

Every `handler.py` must expose:

```python
from typing import Any

def run(input_data: dict[str, Any]) -> dict[str, Any]:
    # Read inputs, run logic, return structured dict
    return {"skill": "my_skill", "output_key": "value"}
```

Return structured data (lists, metrics, previews) that both the API and dashboard `result_view` components can render.

## How to Add a Skill

1. Create `skills/my_skill/skill.yaml` with `name`, `description`, `default_job_type`, `input_fields`, and `result_view`.
2. Create `skills/my_skill/handler.py` with `def run(input_data: dict) -> dict`.
3. Add optional `skills/my_skill/sample_input.json` for defaults.
4. Restart the API (registry auto-discovers on each request) — the skill appears on `/skills` and in `GET /v1/skills`.
5. Run via dashboard, `POST /v1/jobs`, or `quantumos run my_skill --input ...`.

No database migration is required; skills are filesystem-discovered.

## Security Warnings

- **Mock PQC**: Encryption in MVP uses Fernet (symmetric demo). It is labeled `MOCK_PQC_NON_PRODUCTION`. Do not use for production secrets.
- **No plaintext secrets in logs**: Do not pass credentials in job inputs logged to audit metadata.
- **Cloud placeholders**: Azure/QCompute/pyQPanda providers are disabled placeholders until configured.
- **Policy engine**: Default policy blocks cloud quantum without approval and restricts cost-zero jobs to local providers.

## Roadmap

- Redis/Celery/Temporal job queue
- LLM-based agents
- liboqs / OQS provider integration
- Kubernetes appliance packaging
- QShield integration
- Certified compliance modes for fintech tenants

## Monorepo Layout

```
quantumos/
  apps/api/          FastAPI service
  apps/cli/          Typer CLI
  apps/dashboard/    React + TypeScript + Tailwind
  core/              Kernel, scheduler, router, policy, audit
  providers/         Quantum and classical backends
  agents/            Rule-based agents
  skills/            Reusable QuantumOS apps
  security/          Crypto services
  db/                SQLAlchemy models
  tests/
```

## License

Apache-2.0 (adjust as needed for your organization).
