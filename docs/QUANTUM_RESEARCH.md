# QuantumOS: Quantum Execution Architecture and Research Notes

**Document type:** Technical research brief (MVP v0.2)  
**Audience:** Researchers, architects, and advanced users  
**Companion:** [README.md](../README.md) (operations) · Dashboard User Guide (`/guide`)

---

## Abstract

QuantumOS is an agentic control plane that mediates between application-level **skills** (domain logic) and heterogeneous **quantum providers** (simulators, cloud QPUs, classical fallbacks). This document explains *what* happens when a quantum workload executes, *why* the architecture separates skills from providers, and *how* each integrated stack—Qiskit, PennyLane, Microsoft Azure Quantum, IBM Quantum, and Origin Quantum (China)—maps to physical or simulated quantum evolution. We describe the Bell-state reference circuit used across providers, the job lifecycle as a state machine, and the limits of the current MVP relative to fault-tolerant quantum computation.

---

## 1. Introduction

### 1.1 Motivation

Organizations exploring quantum advantage face a fragmented toolchain: circuit builders (Qiskit, Cirq, PennyLane, QPanda), cloud portals (IBM Quantum, Azure Quantum, Origin Quantum Cloud), and classical optimizers. QuantumOS addresses this by presenting a **unified job API** and **backend router** that selects an execution target while preserving a consistent audit trail and policy envelope.

### 1.2 Scope of this deployment

| Layer | Status in MVP |
|-------|----------------|
| Job orchestration, policy, audit | Implemented |
| Local simulators (Qiskit Aer, PennyLane, Origin CPUQVM) | Implemented when SDKs installed |
| Cloud QPUs (Azure, IBM, Origin WuKong) | Implemented behind credentials |
| Fault-tolerant logical qubits | Out of scope |
| Proven quantum advantage on industry data | Out of scope (research frontier) |

---

## 2. System Model

### 2.1 Architectural decomposition

QuantumOS follows a **separation of concerns**:

1. **Skill** — deterministic (or stochastic-seeded) Python logic that prepares problem encoding and interprets results (`skills/*/handler.py`).
2. **Provider** — executes quantum or quantum-inspired computation on a specific backend (`providers/*.py`).
3. **Scheduler** — merges skill output with provider output into `result_json`.
4. **Backend router** — scores providers by capability, cost constraints, and user preference.

```
Client (Dashboard / CLI)
        │
        ▼
   POST /v1/jobs
        │
        ├─► PolicyEngine.evaluate_job()
        │
        ├─► SkillRegistry.run_skill()     ──► handler.py (classical prep)
        │
        ├─► BackendRouter.select()        ──► provider capability match
        │
        └─► Provider.run_job()            ──► quantum stack
                    │
                    ▼
            { provider fields, skill: { ... } }
```

### 2.2 Job state machine

| State | Meaning |
|-------|---------|
| `QUEUED` | Persisted, awaiting scheduler |
| `RUNNING` | Skill and/or provider executing |
| `COMPLETED` | `result_json` populated |
| `FAILED` | Exception or provider error |
| `REJECTED` | Policy denial (e.g. cloud without approval) |

When `?wait=true`, the API blocks until a terminal state—suitable for interactive dashboard use.

---

## 3. Quantum Reference Workload: Bell-State Circuit

### 3.1 Physical intuition

A **Bell state** is a maximally entangled two-qubit state:

\[
|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)
\]

It is prepared by:

1. Apply Hadamard \(H\) on qubit 0 → \((|0\rangle + |1\rangle)/\sqrt{2} \otimes |0\rangle\)
2. Apply CNOT with control 0, target 1 → entangles the pair
3. Measure in computational basis

For ideal hardware, measurement outcomes are only `00` and `11`, each with ~50% probability. Deviations indicate noise, decoherence, or simulator sampling variance.

### 3.2 Implementation across providers

| Provider | Stack | Execution environment |
|----------|-------|------------------------|
| `qiskit_aer` | Qiskit + Aer `qasm_simulator` | Local CPU/GPU simulator |
| `pennylane_default_qubit` | PennyLane `default.qubit` | Local state-vector simulator |
| `origin_quantum` (local) | pyqpanda3 `CPUQVM` | Origin SDK local VM (China) |
| `azure_quantum` | azure-quantum + Qiskit | Azure-hosted target (e.g. `rigetti.sim.qvm`) |
| `ibm_quantum` | qiskit-ibm-runtime `SamplerV2` | IBM Quantum processor or cloud sim |
| `origin_quantum` (cloud) | qpanda3_runtime | Origin WuKong superconducting QPU |

The shared circuit builder (`providers/circuit_builder.py`) ensures **comparable workloads** for benchmarking workflows (see Agent Workbench → Provider Research Benchmark).

### 3.3 Measurement outcomes

Providers return **counts**: a histogram \(\{ \text{bitstring} \rightarrow \text{frequency} \}\). The dashboard renders these as bar charts on skill result views. For Bell states, dominant bins should be `00` and `11`.

---

## 4. Provider Integrations

### 4.1 Qiskit Aer (`qiskit_aer`)

- **Type:** Local high-performance simulator  
- **Install:** `pip install -e ".[quantum]"`  
- **Physics model:** OpenQASM execution with optional noise models (MVP uses ideal simulator)  
- **Cost:** Zero; default for `circuit_simulation` jobs when available  

Qiskit is the *de facto* standard for circuit construction in industry and academia. Aer provides shot-based sampling without queue latency.

### 4.2 PennyLane (`pennylane_default_qubit`)

- **Type:** Local differentiable simulator  
- **Install:** `pip install -e ".[quantum]"`  
- **Use case:** Quantum machine learning, variational algorithms, hybrid classical–quantum training  
- **Distinctive feature:** Native autodiff through quantum nodes; MVP uses sample-based Bell demo  

PennyLane abstracts devices as `qml.device(...)`. The same skill input (`qubits`, `shots`) maps to a PennyLane circuit with equivalent gate semantics.

### 4.3 Microsoft Azure Quantum (`azure_quantum`)

- **Type:** Cloud quantum platform  
- **Install:** `pip install -e ".[azure]"`  
- **Credentials:** `AZURE_QUANTUM_RESOURCE_ID` or subscription/resource group/workspace triple  
- **Target:** `AZURE_QUANTUM_TARGET` (default `rigetti.sim.qvm` simulator)  
- **Authentication:** Azure Identity (DefaultAzureCredential) — `az login` for development  

Azure Quantum aggregates multiple vendor QPUs and simulators. Jobs are submitted via the Qiskit interoperability layer (`azure.quantum.qiskit.AzureQuantumProvider`). Policy must set `allow_cloud_quantum: true` and non-zero `max_cost_usd` budget when routing to paid targets.

### 4.4 IBM Quantum (`ibm_quantum`)

- **Type:** Cloud quantum processors  
- **Install:** `pip install -e ".[ibm]"`  
- **Credentials:** `IBM_QUANTUM_TOKEN` from [quantum.ibm.com](https://quantum.ibm.com/)  
- **Backend:** `IBM_QUANTUM_BACKEND` (e.g. `ibm_torino`)  

IBM provides a free-tier queue for researchers. QuantumOS uses `qiskit-ibm-runtime` SamplerV2 for primitive-level submission—aligned with IBM's current runtime architecture.

### 4.5 Origin Quantum — China (`origin_quantum`)

- **Vendor:** Origin Quantum (本源量子), Hefei, China  
- **Platform:** [Origin Quantum Cloud](https://qcloud.originqc.com.cn/en/)  
- **Install:** `pip install -e ".[origin]"`  

**Two modes:**

| Mode | SDK | Cost | Notes |
|------|-----|------|-------|
| Local `CPUQVM` | `pyqpanda3` | Free | Runs on developer machine; no API key |
| Cloud WuKong QPU | `qpanda3_runtime` | Free for approved research | Requires `ORIGIN_QUANTUM_API_KEY`; apply via [Research Incentive Program](https://qcloud.originqc.com.cn/en/researchincentive) |

Origin WuKong is a superconducting processor (180+ qubits advertised). Real-device access is subject to queue, calibration, and national export/cloud policies. The MVP uses `service.sample(...)` for shot-based execution when cloud credentials are configured.

**Legacy aliases:** `qcompute_placeholder` and `pyqpanda_placeholder` resolve to the same `OriginQuantumProvider` implementation.

---

## 5. Skills vs Providers: Why Both?

A common design question: *why not fold everything into the provider?*

| Concern | Skill | Provider |
|---------|-------|----------|
| Domain semantics | Portfolio weights, BB84 protocol steps, crypto findings | Gate execution, shot sampling |
| Reproducibility without quantum SDK | Yes (pure Python paths) | No (requires SDK/hardware) |
| Swappable backend | Same skill, different provider | N/A |

Example: `hello_quantum` skill emits circuit metadata; `qiskit_aer` returns measurement counts. Merged result:

```json
{
  "provider": "qiskit_aer",
  "counts": { "00": 512, "11": 512 },
  "skill": {
    "skill": "hello_quantum",
    "circuit": { "gates": [...] },
    "expected_distribution": { "00": 0.5, "11": 0.5 }
  }
}
```

This mirrors **separation of algorithm specification from execution substrate** in HPC (MPI code vs cluster scheduler).

---

## 6. Post-Quantum and Classical Paths

Not all jobs invoke quantum evolution:

| Skill / job type | Typical provider |
|------------------|------------------|
| `portfolio_optimizer`, `route_optimizer` | `classical_local` |
| `crypto_migration_scan` | Skill only (agent-assisted) |
| `pqc_encryptor` | `oqs_crypto` (mock Fernet in MVP) |
| `qrng_demo` | Skill CSPRNG; provider optional |

The router maps `job_type` → required capability (`circuit_simulation`, `optimization`, etc.). Optimization jobs never land on a QPU unless explicitly misconfigured.

---

## 7. Security, Policy, and Audit

### 7.1 Policy engine

Default policy blocks:

- Cloud quantum without `allow_cloud_quantum: true`
- Spend above `max_cost_usd` (zero = local/sim only)

### 7.2 Audit hash chain

Each audit event includes `event_hash` chaining to the previous record—supporting **non-repudiation** of control-plane actions (job created, completed, policy denial).

### 7.3 Mock PQC disclaimer

`pqc_encryptor` and Security Center use **Fernet symmetric encryption** labeled non-production. This is *not* NIST post-quantum (ML-KEM, ML-DSA). Real PQC integration is planned via liboqs / `oqs_crypto` provider.

---

## 8. Agent Workflows and Use Cases

### 8.1 Workflows (multi-step)

| Workflow ID | Quantum relevance |
|-------------|-------------------|
| `portfolio_quantum_pipeline` | Optimization routing; optional quantum backend |
| `secure_circuit_pipeline` | Crypto scan → circuit → policy → sim |
| `crypto_migration_assessment` | PQC migration narrative |
| `research_benchmark` | Cross-provider Bell circuit comparison |

### 8.2 Use case catalog

Eight industry scenarios (`use_cases/catalog.py`) map to skills and workflows—translating business language into executable jobs. See User Guide §5 for plain-English descriptions.

---

## 9. Experimental Setup (Reproducibility)

### 9.1 Minimal local quantum stack

```bash
pip install -e ".[quantum,origin]"
export PYTHONPATH=$(pwd)
export DATABASE_URL=sqlite:///./quantumos_local.db
uvicorn apps.api.quantumos_api.main:app --port 8000
```

### 9.2 Full multi-cloud stack

```bash
pip install -e ".[all]"
cp .env.example .env
# Fill IBM_QUANTUM_TOKEN, AZURE_QUANTUM_*, ORIGIN_QUANTUM_API_KEY
```

### 9.3 Verification

```bash
curl http://localhost:8000/v1/providers | jq '.providers[] | {name, available}'
curl -X POST "http://localhost:8000/v1/jobs?wait=true" \
  -H "Content-Type: application/json" \
  -d '{"job_type":"circuit_simulation","skill":"hello_quantum","input":{"qubits":2,"shots":1024},"preferred_backend":"qiskit_aer","constraints":{"max_cost_usd":0,"allow_cloud_quantum":false,"allow_simulator":true}}'
```

---

## 10. Limitations and Future Work

1. **No error mitigation** on real QPUs (zero-noise extrapolation, readout correction) in MVP.  
2. **Circuit depth** limited to shallow demos; no large QAOA/VQE chemistry paths yet.  
3. **Chinese cloud** access requires Origin account approval; latency and availability vary.  
4. **Quantum advantage** not claimed for portfolio/route heuristics—they are classical stand-ins with quantum API compatibility.  
5. **Alembic migrations** and distributed queue (Redis/Celery) remain roadmap items.

---

## 11. Conclusion

QuantumOS treats quantum computation as **one execution backend among many**, orchestrated through policies, skills, and agents. The Bell-state reference circuit provides a pedagogically meaningful and technically verifiable workload across Qiskit, PennyLane, Azure Quantum, IBM Quantum, and Origin Quantum stacks. Researchers can use the Provider Research Benchmark workflow to compare histograms; practitioners can start with free local simulators and graduate to cloud QPUs by setting environment credentials—without changing application-level skill code.

---

## References

1. Nielsen, M. A., & Chuang, I. L. *Quantum Computation and Quantum Information.* Cambridge University Press.  
2. Qiskit Documentation — https://docs.quantum.ibm.com/  
3. PennyLane Documentation — https://docs.pennylane.ai/  
4. Microsoft Azure Quantum — https://learn.microsoft.com/azure/quantum/  
5. Origin Quantum / QPanda3 — https://originqc.com/  
6. NIST Post-Quantum Cryptography Project — https://csrc.nist.gov/projects/post-quantum-cryptography  

---

*QuantumOS MVP v0.2 — Apache-2.0. This document describes demonstration software, not a certified quantum or cryptographic product.*
