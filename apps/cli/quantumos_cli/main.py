import json
import os
from pathlib import Path
from typing import Optional

import httpx
import typer

app = typer.Typer(name="quantumos", help="QuantumOS CLI")

API_URL = os.getenv("QUANTUMOS_API_URL", "http://localhost:8000")


def _client() -> httpx.Client:
    return httpx.Client(base_url=API_URL, timeout=120.0)


@app.command("health")
def health_cmd():
    r = _client().get("/health")
    typer.echo(json.dumps(r.json(), indent=2))


@app.command("providers")
def providers_cmd():
    r = _client().get("/v1/providers")
    typer.echo(json.dumps(r.json(), indent=2))


skills_app = typer.Typer(help="Skill commands")
app.add_typer(skills_app, name="skills")


@skills_app.command("list")
def skills_list():
    r = _client().get("/v1/skills")
    typer.echo(json.dumps(r.json(), indent=2))


jobs_app = typer.Typer(help="Job commands")
app.add_typer(jobs_app, name="jobs")


@jobs_app.command("list")
def jobs_list():
    r = _client().get("/v1/jobs")
    typer.echo(json.dumps(r.json(), indent=2))


@jobs_app.command("get")
def jobs_get(job_id: str):
    r = _client().get(f"/v1/jobs/{job_id}")
    typer.echo(json.dumps(r.json(), indent=2))


@app.command("run")
def run_skill(
    skill_name: str,
    input: Path = typer.Option(..., "--input", help="Input JSON file"),
):
    data = json.loads(input.read_text(encoding="utf-8"))
    job_type = "circuit_simulation"
    if skill_name in ("portfolio_optimizer", "route_optimizer"):
        job_type = "optimization"
    elif skill_name in ("qrng_demo", "bb84_simulator"):
        job_type = "quantum_demo"
    body = {
        "job_type": job_type,
        "skill": skill_name,
        "input": data,
        "constraints": {"max_cost_usd": 0, "allow_cloud_quantum": False},
        "preferred_backend": "auto",
    }
    c = _client()
    r = c.post("/v1/jobs", json=body)
    typer.echo(json.dumps(r.json(), indent=2))
    job_id = r.json().get("job_id")
    if job_id:
        import time
        for _ in range(30):
            time.sleep(0.5)
            jr = c.get(f"/v1/jobs/{job_id}")
            state = jr.json().get("state")
            if state in ("COMPLETED", "FAILED", "REJECTED"):
                typer.echo(json.dumps(jr.json(), indent=2))
                break


agent_app = typer.Typer(help="Agent commands")
app.add_typer(agent_app, name="agent")


@agent_app.command("run")
def agent_run(
    agent_name: str,
    input: Path = typer.Option(..., "--input", help="Task JSON file"),
):
    task = json.loads(input.read_text(encoding="utf-8"))
    r = _client().post("/v1/agents/run", json={"agent": agent_name, "task": task})
    typer.echo(json.dumps(r.json(), indent=2))


audit_app = typer.Typer(help="Audit commands")
app.add_typer(audit_app, name="audit")


@audit_app.command("list")
def audit_list():
    r = _client().get("/v1/audit")
    typer.echo(json.dumps(r.json(), indent=2))


crypto_app = typer.Typer(help="Crypto commands (mock PQC — non-production)")
app.add_typer(crypto_app, name="crypto")


@crypto_app.command("encrypt")
def crypto_encrypt(
    input: Path = typer.Option(..., "--input", help="Payload JSON"),
):
    payload = json.loads(input.read_text(encoding="utf-8"))
    r = _client().post("/v1/crypto/encrypt", json={"payload": payload})
    typer.echo(json.dumps(r.json(), indent=2))


@crypto_app.command("decrypt")
def crypto_decrypt(
    input: Path = typer.Option(..., "--input", help="Encrypted JSON"),
):
    data = json.loads(input.read_text(encoding="utf-8"))
    r = _client().post("/v1/crypto/decrypt", json=data)
    typer.echo(json.dumps(r.json(), indent=2))


if __name__ == "__main__":
    app()
