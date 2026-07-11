from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel, Field

from agents.runtime import run_agent, AGENTS
from agents.orchestrator import run_workflow, WORKFLOW_NAMES

router = APIRouter(prefix="/v1/agents", tags=["agents"])


class AgentRunBody(BaseModel):
    agent: str
    task: dict[str, Any] = Field(default_factory=dict)


class WorkflowRunBody(BaseModel):
    workflow: str
    task: dict[str, Any] = Field(default_factory=dict)


@router.get("")
def list_agents():
    return {
        "agents": list(AGENTS.keys()),
        "workflows": sorted(WORKFLOW_NAMES),
    }


@router.post("/run")
def run_agent_endpoint(body: AgentRunBody):
    try:
        result = run_agent(body.agent, body.task)
    except ValueError as e:
        return {"error": str(e)}
    return {"agent": result.agent, "plan": result.plan}


@router.post("/workflows/run")
def run_workflow_endpoint(body: WorkflowRunBody):
    try:
        return run_workflow(body.workflow, body.task)
    except ValueError as e:
        return {"error": str(e)}
