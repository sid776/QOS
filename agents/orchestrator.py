"""Multi-agent quantum workflows — practical pipelines combining agents and jobs."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from typing import Any

from agents.runtime import run_agent
from core.kernel.job_kernel import QuantumKernel
from db.models import Base
from db.session import SessionLocal, engine


@dataclass
class WorkflowStep:
    step_id: str
    agent: str
    status: str  # pending | running | completed | failed | skipped
    summary: str
    output: dict[str, Any] = field(default_factory=dict)


@dataclass
class WorkflowResult:
    workflow_id: str
    workflow_name: str
    status: str
    steps: list[WorkflowStep]
    final_job_id: str | None = None
    final_result: dict[str, Any] | None = None
    recommendation: str = ""


WORKFLOW_NAMES = {
    "portfolio_quantum_pipeline",
    "secure_circuit_pipeline",
    "crypto_migration_assessment",
    "research_benchmark",
}


def _step(agent: str, summary: str, output: dict, status: str = "completed") -> WorkflowStep:
    return WorkflowStep(
        step_id=str(uuid.uuid4())[:8],
        agent=agent,
        status=status,
        summary=summary,
        output=output,
    )


def _run_job(skill: str, job_type: str, input_data: dict, preferred_backend: str = "auto") -> dict:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        kernel = QuantumKernel(db)
        job = kernel.create_job(
            {
                "job_type": job_type,
                "skill": skill,
                "input": input_data,
                "constraints": {
                    "max_cost_usd": 0,
                    "allow_cloud_quantum": False,
                    "allow_simulator": True,
                },
                "preferred_backend": preferred_backend,
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
        }
    finally:
        db.close()


class WorkflowOrchestrator:
    def run(self, workflow_name: str, task: dict[str, Any]) -> WorkflowResult:
        if workflow_name == "portfolio_quantum_pipeline":
            return self._portfolio_pipeline(task)
        if workflow_name == "secure_circuit_pipeline":
            return self._secure_circuit_pipeline(task)
        if workflow_name == "crypto_migration_assessment":
            return self._migration_assessment(task)
        if workflow_name == "research_benchmark":
            return self._research_benchmark(task)
        raise ValueError(f"Unknown workflow: {workflow_name}")

    def _portfolio_pipeline(self, task: dict[str, Any]) -> WorkflowResult:
        wf_id = str(uuid.uuid4())
        steps: list[WorkflowStep] = []
        assets = task.get("assets", ["AAPL", "MSFT", "NVDA"])
        budget = task.get("budget", 100000)
        constraints = task.get("constraints", {"max_cost_usd": 0, "allow_cloud_quantum": False})

        policy = run_agent(
            "SecurityPolicyAgent",
            {"constraints": constraints, "data_classification": task.get("data_classification", "public_demo")},
        )
        steps.append(
            _step(
                "SecurityPolicyAgent",
                "Policy gate for optimization workload",
                policy.plan,
                "completed" if policy.plan.get("allowed") else "failed",
            )
        )
        if not policy.plan.get("allowed"):
            return WorkflowResult(wf_id, "portfolio_quantum_pipeline", "REJECTED", steps, recommendation=policy.plan.get("reason", ""))

        opt = run_agent("OptimizationAgent", {"job_type": "optimization", "constraints": constraints})
        steps.append(_step("OptimizationAgent", "Built optimization workflow plan", opt.plan))

        backend = run_agent("BackendSelectionAgent", {"job_type": "optimization", "constraints": constraints})
        provider = backend.plan.get("recommended_provider", "classical_local")
        steps.append(_step("BackendSelectionAgent", f"Selected backend: {provider}", backend.plan))

        job_out = _run_job(
            "portfolio_optimizer",
            "optimization",
            {"assets": assets, "budget": budget, "risk": task.get("risk", "medium")},
            preferred_backend=provider,
        )
        steps.append(
            WorkflowStep(
                step_id=str(uuid.uuid4())[:8],
                agent="JobExecutor",
                status="completed" if job_out["state"] == "COMPLETED" else "failed",
                summary=f"Portfolio job {job_out['job_id']} → {job_out['state']}",
                output=job_out,
            )
        )

        explain = run_agent(
            "ExplanationAgent",
            {"state": job_out["state"], "result": job_out.get("result") or {}, "error": job_out.get("error")},
        )
        steps.append(_step("ExplanationAgent", explain.plan.get("explanation", "Done"), explain.plan))

        return WorkflowResult(
            workflow_id=wf_id,
            workflow_name="portfolio_quantum_pipeline",
            status=job_out["state"],
            steps=steps,
            final_job_id=job_out.get("job_id"),
            final_result=job_out.get("result"),
            recommendation=f"Use {provider} for cost-zero portfolio runs. {explain.plan.get('explanation', '')}",
        )

    def _secure_circuit_pipeline(self, task: dict[str, Any]) -> WorkflowResult:
        wf_id = str(uuid.uuid4())
        steps: list[WorkflowStep] = []
        code = task.get("code", "")
        qubits = int(task.get("qubits", 2))
        shots = int(task.get("shots", 512))

        if code:
            mig = run_agent("CryptoMigrationAgent", {"snippet": code})
            steps.append(_step("CryptoMigrationAgent", f"Risk: {mig.plan.get('risk_level')}", mig.plan))

        circuit = run_agent("CircuitGenerationAgent", {"qubits": qubits})
        steps.append(_step("CircuitGenerationAgent", circuit.plan.get("circuit_description", "Circuit ready"), circuit.plan))

        constraints = task.get("constraints", {"max_cost_usd": 0, "allow_cloud_quantum": False})
        policy = run_agent("SecurityPolicyAgent", {"constraints": constraints, "job_type": "circuit_simulation"})
        if not policy.plan.get("allowed"):
            steps.append(_step("SecurityPolicyAgent", "Blocked by policy", policy.plan, "failed"))
            return WorkflowResult(wf_id, "secure_circuit_pipeline", "REJECTED", steps)

        steps.append(_step("SecurityPolicyAgent", "Circuit execution approved", policy.plan))

        backend = run_agent("BackendSelectionAgent", {"job_type": "circuit_simulation", "constraints": constraints})
        provider = backend.plan.get("recommended_provider", "qiskit_aer")
        steps.append(_step("BackendSelectionAgent", f"Simulator: {provider}", backend.plan))

        job_out = _run_job("hello_quantum", "circuit_simulation", {"qubits": qubits, "shots": shots}, provider)
        steps.append(
            WorkflowStep(
                step_id=str(uuid.uuid4())[:8],
                agent="JobExecutor",
                status="completed" if job_out["state"] == "COMPLETED" else "failed",
                summary=f"Circuit job {job_out['state']} on {job_out.get('selected_provider')}",
                output=job_out,
            )
        )

        explain = run_agent(
            "ExplanationAgent",
            {"state": job_out["state"], "result": job_out.get("result") or {}},
        )
        steps.append(_step("ExplanationAgent", explain.plan.get("explanation", ""), explain.plan))

        return WorkflowResult(
            workflow_id=wf_id,
            workflow_name="secure_circuit_pipeline",
            status=job_out["state"],
            steps=steps,
            final_job_id=job_out.get("job_id"),
            final_result=job_out.get("result"),
            recommendation=backend.plan.get("reason", ""),
        )

    def _migration_assessment(self, task: dict[str, Any]) -> WorkflowResult:
        wf_id = str(uuid.uuid4())
        steps: list[WorkflowStep] = []
        snippet = task.get("code", task.get("snippet", ""))

        mig = run_agent("CryptoMigrationAgent", {"snippet": snippet})
        steps.append(_step("CryptoMigrationAgent", f"{len(mig.plan.get('findings', []))} findings", mig.plan))

        scan_job = _run_job("crypto_migration_scan", "circuit_simulation", {"code": snippet})
        steps.append(
            WorkflowStep(
                step_id=str(uuid.uuid4())[:8],
                agent="JobExecutor",
                status="completed",
                summary="Skill scan completed",
                output=scan_job.get("result") or scan_job,
            )
        )

        enc_job = _run_job("pqc_encryptor", "post_quantum_crypto", {"payload": {"assessment": "demo"}})
        steps.append(
            WorkflowStep(
                step_id=str(uuid.uuid4())[:8],
                agent="JobExecutor",
                status="completed",
                summary="Mock PQC encrypt demo (non-production)",
                output=enc_job.get("result") or {},
            )
        )

        policy = run_agent(
            "SecurityPolicyAgent",
            {"data_classification": "restricted", "constraints": {"allow_cloud_quantum": False}},
        )
        steps.append(_step("SecurityPolicyAgent", "Restricted-data policy check", policy.plan))

        rec = (
            "Migrate asymmetric crypto to ML-KEM / ML-DSA when liboqs is enabled. "
            f"Current risk: {mig.plan.get('risk_level')}."
        )
        return WorkflowResult(
            workflow_id=wf_id,
            workflow_name="crypto_migration_assessment",
            status="COMPLETED",
            steps=steps,
            final_job_id=scan_job.get("job_id"),
            final_result={"migration": mig.plan, "skill_scan": scan_job.get("result")},
            recommendation=rec,
        )

    def _research_benchmark(self, task: dict[str, Any]) -> WorkflowResult:
        wf_id = str(uuid.uuid4())
        steps: list[WorkflowStep] = []
        qubits = int(task.get("qubits", 2))
        shots = int(task.get("shots", 256))

        providers = ["qiskit_aer", "pennylane_default_qubit", "mock_provider", "classical_local"]
        benchmarks: list[dict] = []

        for provider in providers:
            job_out = _run_job("hello_quantum", "circuit_simulation", {"qubits": qubits, "shots": shots}, provider)
            benchmarks.append(
                {
                    "provider": provider,
                    "state": job_out["state"],
                    "result_preview": str(job_out.get("result", {}))[:120],
                }
            )
            steps.append(
                WorkflowStep(
                    step_id=str(uuid.uuid4())[:8],
                    agent="JobExecutor",
                    status="completed" if job_out["state"] == "COMPLETED" else "failed",
                    summary=f"Benchmark {provider}: {job_out['state']}",
                    output=job_out,
                )
            )

        backend = run_agent(
            "BackendSelectionAgent",
            {"job_type": "circuit_simulation", "constraints": {"max_cost_usd": 0, "allow_cloud_quantum": False}},
        )
        steps.append(_step("BackendSelectionAgent", "Post-benchmark recommendation", backend.plan))

        return WorkflowResult(
            workflow_id=wf_id,
            workflow_name="research_benchmark",
            status="COMPLETED",
            steps=steps,
            final_result={"benchmarks": benchmarks},
            recommendation=f"Recommended default: {backend.plan.get('recommended_provider')}",
        )


def run_workflow(name: str, task: dict[str, Any]) -> dict[str, Any]:
    result = WorkflowOrchestrator().run(name, task)
    return {
        "workflow_id": result.workflow_id,
        "workflow_name": result.workflow_name,
        "status": result.status,
        "recommendation": result.recommendation,
        "final_job_id": result.final_job_id,
        "final_result": result.final_result,
        "steps": [
            {
                "step_id": s.step_id,
                "agent": s.agent,
                "status": s.status,
                "summary": s.summary,
                "output": s.output,
            }
            for s in result.steps
        ],
    }
