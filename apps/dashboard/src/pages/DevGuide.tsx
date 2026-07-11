import { Link } from "react-router-dom";
import OSWindow from "../components/OSWindow";
import DevSection from "../components/DevSection";

const QUICK_START = `cd quantumos
pip install -r requirements-dev.txt
pip install -e ".[quantum]"

$env:PYTHONPATH = (Get-Location)
$env:DATABASE_URL = "sqlite:///./quantumos_local.db"
.\\venv2\\Scripts\\uvicorn apps.api.quantumos_api.main:app --port 8000

cd apps/dashboard && npm install && npm run dev`;

export default function DevGuide() {
  return (
    <div className="space-y-8 max-w-5xl pb-12">
      <div>
        <h1 className="page-heading">Developer Guide</h1>
        <p className="page-sub mt-2 max-w-3xl">
          Technical reference for QuantumOS v0.1. Each section has a <strong>plain English</strong> explanation
          and a <strong>developer detail</strong> column. For end users, see{" "}
          <Link to="/guide" className="q-link">
            User Guide
          </Link>
          .
        </p>
      </div>

      <OSWindow title="Architecture at a glance" icon="🏗" accent="indigo" width="full">
        <pre className="text-[11px] text-slate-600 leading-relaxed font-mono bg-slate-50 rounded-xl p-4 overflow-x-auto">
{`Dashboard / CLI  →  FastAPI (apps/api)  →  Quantum Kernel
                              ↓
         Policy Engine ← Scheduler → Backend Router → Providers
                              ↓
                    Skills (handler.py) + Agents + Workflows
                              ↓
                    PostgreSQL / SQLite + Audit hash chain`}
        </pre>
        <p className="text-sm text-slate-600 mt-4">
          <strong>Layman:</strong> The dashboard talks to a Python server. The server receives a “job,”
          checks rules, picks where to run it, runs the code, saves results, and logs everything.
        </p>
      </OSWindow>

      <DevSection
        title="1. What QuantumOS is (MVP)"
        layman={`QuantumOS is not a new operating system on your PC. It is a control plane — like an air-traffic tower for quantum-related tasks. You send work items (jobs), and the platform routes them to simulators or classical fallbacks, runs small apps (skills), and uses helper bots (agents) to plan and explain.`}
        technical={`MVP scope: Linux-hosted Python runtime, FastAPI REST API, Typer CLI, React dashboard, in-process job queue, SQLAlchemy persistence, rule-based agents (no LLM required), pluggable Provider interface, YAML policy rules, hash-chained audit log. Not a custom kernel; not production PQC.`}
        files={["README.md", "apps/api/quantumos_api/main.py", "core/kernel/job_kernel.py"]}
      />

      <DevSection
        title="2. Monorepo layout"
        layman={`The project is one folder with several neighborhoods: the website (dashboard), the server (api), the brain (core), workers that talk to quantum tools (providers), small apps (skills), and helpers (agents).`}
        technical={`quantumos/
  apps/api/          FastAPI + routers
  apps/cli/          Typer CLI (quantumos command)
  apps/dashboard/    React + Vite + Tailwind
  core/              kernel, scheduler, router, policy, audit, registries
  providers/         QuantumProvider implementations
  skills/            skill.yaml + handler.py per app
  agents/            BaseAgent + orchestrator workflows
  use_cases/         Industry scenario catalog + runner
  db/                SQLAlchemy models + session
  security/crypto/   Mock PQC (Fernet demo)
  tests/`}
        files={["pyproject.toml", "docker-compose.yml"]}
      />

      <DevSection
        title="3. Job lifecycle (the heart of the system)"
        layman={`When you click Run, the system creates a ticket (job). The ticket moves through states: created → queued → planning → routing → running → completed/failed. Along the way it picks a backend, runs your skill, and stores the answer.`}
        technical={`Flow:
1. POST /v1/jobs?wait=true → QuantumKernel.create_job() writes Job + JobEvent rows
2. JobScheduler.process_job(job_id) runs synchronously in thread pool when wait=true
3. PolicyEngine.evaluate_job() — may REJECT
4. BackendRouter.select() scores providers by capability, cost, cloud flags
5. SkillRegistry.run_skill() if skill set — dynamic import of skills/<name>/handler.py
6. Provider.run_job() — qiskit_aer, classical_local, mock_provider, etc.
7. AuditService.emit() for job_created, provider_selected, job_completed, etc.

States enum: core/kernel/states.py (CREATED, QUEUED, PLANNING, ROUTING, RUNNING, COMPLETED, FAILED, REJECTED, CANCELLED)`}
        files={[
          "core/kernel/job_kernel.py",
          "core/scheduler/scheduler.py",
          "core/router/backend_router.py",
          "apps/api/quantumos_api/routers/jobs.py",
        ]}
        code={`POST /v1/jobs
{
  "job_type": "circuit_simulation",
  "skill": "hello_quantum",
  "input": { "qubits": 2, "shots": 1024 },
  "constraints": { "max_cost_usd": 0, "allow_cloud_quantum": false }
}`}
      />

      <DevSection
        title="4. Backend router & providers"
        layman={`The router is like a smart receptionist. It reads your job type and budget rules, then sends you to the right desk: a quantum simulator, a classical solver, or a practice mock.`}
        technical={`BackendRouter.select(job) filters providers by:
- is_available()
- required capability from job_type map (circuit_simulation → circuit_simulation, etc.)
- constraints.max_cost_usd, allow_cloud_quantum, allow_simulator, max_qubits
- preferred_backend if not "auto"
- lowest score = cost*1000 + latency

Each provider implements QuantumProvider in providers/base.py:
  is_available(), estimate(job), run_job(job) → ProviderResult

Registered in core/registry/provider_registry.py`}
        files={["core/router/backend_router.py", "providers/qiskit_provider.py", "providers/classical_provider.py"]}
      />

      <DevSection
        title="5. Skills (plug-in apps)"
        layman={`A skill is a mini-app with a recipe file (skill.yaml) and a Python script (handler.py). When a job names a skill, QuantumOS runs that script with your JSON input and merges the output into the job result.`}
        technical={`SkillRegistry.discover() scans skills/*/skill.yaml at startup.
run_skill(name, input):
  importlib loads skills/<name>/handler.py
  calls module.run(input_data) → dict

Manifest example (skills/hello_quantum/skill.yaml):
  name, version, type, description

API: GET /v1/skills, POST /v1/skills/install, GET /v1/skills/{name}/sample`}
        files={["core/registry/skill_registry.py", "skills/hello_quantum/handler.py"]}
        code={`# skills/my_skill/handler.py
def run(input_data: dict) -> dict:
    return {"skill": "my_skill", "result": input_data}`}
      />

      <DevSection
        title="6. Agents (rule-based helpers)"
        layman={`Agents do not use ChatGPT in MVP. They are fixed Python rules: pick a backend, suggest a circuit, check policy, scan for weak crypto, explain results in simple words.`}
        technical={`BaseAgent in agents/base.py with run(task) → AgentResult(plan dict).

Registered in agents/runtime.py:
  BackendSelectionAgent, CircuitGenerationAgent, OptimizationAgent,
  CryptoMigrationAgent, SecurityPolicyAgent, ExplanationAgent

API: POST /v1/agents/run { "agent": "...", "task": { ... } }

Orchestrator (agents/orchestrator.py) chains agents + jobs for workflows:
  portfolio_quantum_pipeline, secure_circuit_pipeline,
  crypto_migration_assessment, research_benchmark

API: POST /v1/agents/workflows/run`}
        files={["agents/runtime.py", "agents/orchestrator.py", "agents/backend_selection_agent.py"]}
      />

      <DevSection
        title="7. Use cases (industry scenarios)"
        layman={`Use cases are pre-packaged stories for demos — fintech portfolio, delivery routes, bank crypto audit, etc. Each maps to either a single job or a full multi-agent workflow.`}
        technical={`use_cases/catalog.py — UseCase dataclass list (id, industry, mode workflow|job, task/input).

use_cases/runner.py — run_use_case(id) dispatches to orchestrator or JobScheduler.

API:
  GET  /v1/use-cases
  POST /v1/use-cases/{id}/run
  POST /v1/use-cases/run-all

CLI: python scripts/run_use_cases.py → use_cases_report.json`}
        files={["use_cases/catalog.py", "use_cases/runner.py", "scripts/run_use_cases.py"]}
      />

      <DevSection
        title="8. Policy engine"
        layman={`Before risky work runs, policy rules ask questions: Is cloud allowed? Is cost zero? Is this restricted data? If a rule fails, the job is rejected with a reason.`}
        technical={`PolicyEngine loads core/policy/default_policy.yaml.

Rules have "if" conditions matching constraints / data_classification and actions:
  deny_provider_types, deny_capabilities, require_providers: [local]

Evaluated in JobScheduler before and after provider selection.

API: GET/POST /v1/policies`}
        files={["core/policy/policy_engine.py", "core/policy/default_policy.yaml"]}
      />

      <DevSection
        title="9. Audit log (tamper-evident)"
        layman={`Every important action gets a line in a diary. Each line links to the previous line with a fingerprint (hash), so tampering breaks the chain.`}
        technical={`AuditService.emit(operation, success, metadata, ...)

compute_event_hash() in core/audit/hash_chain.py:
  SHA-256 of canonical JSON including previous_hash

Stored in audit_events table. API: GET /v1/audit`}
        files={["core/audit/audit_service.py", "core/audit/hash_chain.py", "db/models.py"]}
      />

      <DevSection
        title="10. Security center (mock PQC)"
        layman={`Encrypt/decrypt demos use standard library crypto (Fernet), clearly labeled NOT for production banks. Real post-quantum would use liboqs later.`}
        technical={`security/crypto/pqc_service.py — PBKDF2 + Fernet symmetric encryption.

WARNING string: MOCK_PQC_NON_PRODUCTION

API: POST /v1/crypto/encrypt|decrypt|sign|verify`}
        files={["security/crypto/pqc_service.py", "apps/api/quantumos_api/routers/crypto.py"]}
      />

      <DevSection
        title="11. Database"
        layman={`Jobs, tenants, audit lines, and policies are saved in a database. Locally we often use a single SQLite file; Docker uses PostgreSQL.`}
        technical={`SQLAlchemy models in db/models.py:
  tenants, jobs, job_events, providers, skills, audit_events, policies

DATABASE_URL env var. SQLite for dev; postgresql:// for docker-compose.

Tables created via Base.metadata.create_all() on API startup.`}
        files={["db/models.py", "db/session.py", "docker-compose.yml"]}
      />

      <DevSection
        title="12. Dashboard (this UI)"
        layman={`The website is React. It calls the API with fetch(). Pages are separate screens; OSWindow components look like desktop windows but are just styled divs.`}
        technical={`Vite + React 18 + TypeScript + Tailwind.

apps/dashboard/src/api.ts — fetchApi, postApi, createJob, pollJobUntilDone

Routes in App.tsx inside DesktopShell (glass layout, sidebar nav).

Key pages: Guide (layman), DevGuide (this), UseCases, AgentWorkbench, Jobs, etc.

VITE_API_URL → default http://hostname:8000`}
        files={["apps/dashboard/src/App.tsx", "apps/dashboard/src/api.ts", "apps/dashboard/src/components/OSWindow.tsx"]}
      />

      <DevSection
        title="13. How to extend QuantumOS"
        layman={`To add new capabilities: write a new provider or skill, register it, restart the API. To add a business story, add a row in the use cases catalog.`}
        technical={`Add provider:
  1. providers/my_provider.py extends QuantumProvider
  2. Register in core/registry/provider_registry.py

Add skill:
  1. skills/my_skill/skill.yaml + handler.py with run()
  2. Auto-discovered on restart

Add agent:
  1. agents/my_agent.py extends BaseAgent
  2. Register in agents/runtime.py

Add workflow:
  1. Method on WorkflowOrchestrator in agents/orchestrator.py
  2. Add name to WORKFLOW_NAMES

Add use case:
  1. Entry in use_cases/catalog.py`}
        files={["providers/base.py", "agents/base.py", "use_cases/catalog.py"]}
      />

      <OSWindow title="Local development" icon="⚙" accent="amber" width="full">
        <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto whitespace-pre">
          {QUICK_START}
        </pre>
        <p className="text-sm text-slate-600 mt-4">
          API docs:{" "}
          <a href="http://127.0.0.1:8000/docs" className="q-link" target="_blank" rel="noreferrer">
            http://127.0.0.1:8000/docs
          </a>
          {" · "}
          <code className="text-xs bg-slate-100 px-1 rounded">scripts/start-local.ps1</code> starts both
          services on Windows.
        </p>
      </OSWindow>

      <OSWindow title="API endpoint map" icon="🔌" accent="purple" width="full">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-4">Method</th>
                <th className="py-2 pr-4">Path</th>
                <th className="py-2">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 font-mono">
              {[
                ["GET", "/health", "Health check"],
                ["GET", "/v1/providers", "List backends"],
                ["POST", "/v1/jobs?wait=true", "Create + run job"],
                ["GET", "/v1/jobs/{id}", "Job status/result"],
                ["POST", "/v1/agents/run", "Single agent"],
                ["POST", "/v1/agents/workflows/run", "Multi-agent pipeline"],
                ["GET", "/v1/use-cases", "Industry catalog"],
                ["POST", "/v1/use-cases/{id}/run", "Run scenario"],
                ["GET", "/v1/skills", "List skills"],
                ["GET/POST", "/v1/crypto/*", "Mock encrypt/sign"],
                ["GET", "/v1/audit", "Audit chain"],
                ["GET", "/v1/policies", "Policy YAML"],
              ].map(([m, p, d]) => (
                <tr key={p} className="border-b border-slate-50">
                  <td className="py-2 pr-4 text-indigo-600">{m}</td>
                  <td className="py-2 pr-4">{p}</td>
                  <td className="py-2 font-sans text-slate-600">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </OSWindow>
    </div>
  );
}
