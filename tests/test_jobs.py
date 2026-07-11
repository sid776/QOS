import uuid

from core.kernel.job_kernel import QuantumKernel
from core.kernel.states import JobState


def test_job_creation_and_processing(db_session):
    kernel = QuantumKernel(db_session)
    job = kernel.create_job(
        {
            "job_type": "circuit_simulation",
            "skill": "hello_quantum",
            "input": {"qubits": 2, "shots": 128},
            "constraints": {"max_cost_usd": 0, "allow_cloud_quantum": False},
        }
    )
    assert job.state == JobState.QUEUED.value
    processed = kernel.scheduler.process_job(job.id)
    assert processed.state in (
        JobState.COMPLETED.value,
        JobState.FAILED.value,
        JobState.REJECTED.value,
    )


def test_job_state_transitions(db_session):
    kernel = QuantumKernel(db_session)
    job = kernel.create_job(
        {
            "job_type": "optimization",
            "skill": "portfolio_optimizer",
            "input": {"assets": ["A", "B"], "budget": 1000},
            "constraints": {"max_cost_usd": 0},
        }
    )
    result = kernel.scheduler.process_job(job.id)
    assert result.state == JobState.COMPLETED.value
    assert result.result_json is not None
