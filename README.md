# QuantumOS

QuantumOS is a developer platform for running quantum simulations, post-quantum security checks, and hybrid “classical + quantum” workflows from one place. There is a web dashboard (Industry Apps, Skills, Jobs), a REST API, and a CLI.

This repo is **not** a new operating system kernel. It runs on normal Linux (or in Docker) and coordinates simulators, optional cloud quantum backends, skills, agents, and an audit log.

**Live demo:** open your deployed URL at `/` for the full dashboard. The API lives on the same host under `/v1/*`. Health check: `/health`.

---

## Quick start

### Docker (local)

```bash
cp .env.example .env
docker compose up --build
```

- Dashboard: http://localhost:5173  
- API: http://localhost:8000  
- Swagger: http://localhost:8000/swagger  

### Railway

Push to GitHub and deploy the root `Dockerfile`. The build includes the React dashboard — you get UI + API on one URL. See [docs/RAILWAY.md](docs/RAILWAY.md).

### Local dev (API + dashboard separate)

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -e ".[dev]"

export DATABASE_URL=postgresql://quantumos:quantumos@localhost:5432/quantumos
uvicorn apps.api.quantumos_api.main:app --reload --port 8000

cd apps/dashboard && npm install && npm run dev
```

Windows shortcut: `.\scripts\start-local.ps1`

### Tests

```bash
pytest tests/ -v
```

---

## Industry Apps — what each one is for

These are the sixteen scenarios under **Industry Apps** in the dashboard. Each one walks you through inputs, runs a real pipeline, shows you results, and compares them to a simpler “traditional” approach at the bottom.

None of these replace production systems out of the box. They are working demos with honest baselines — useful for learning, sales engineering, and prototyping.

---

### 1. Multi-asset portfolio rebalance

**Who it’s for:** Anyone allocating money across several stocks or funds — portfolio managers, fintech teams, or students learning asset allocation.

**The situation:** You have a pool of cash (say $2.5M) and five tech stocks. Splitting evenly is easy but usually wrong: some names are more volatile, some move together, and “equal weight” ignores the risk level you actually want.

**What you do:** Enter fund name, budget, tickers, and risk appetite. Hit Analyze.

**What happens:** The app runs a short agent pipeline (policy check → optimizer → backend pick → portfolio skill → plain summary). It searches many possible weight combinations instead of defaulting to 1/N.

**What you get:** A pie chart of weights, dollar amounts per ticker, expected return and volatility, and a comparison showing how much better this is than naïve equal-weighting.

---

### 2. Last-mile delivery routing

**Who it’s for:** Dispatchers, logistics startups, anyone planning multi-stop driving routes.

**The situation:** A driver leaves a warehouse and must hit eight addresses. Order matters. Eight stops means tens of thousands of possible routes; guessing wastes fuel and time.

**What you do:** List your depot and stops, fuel price, and whether the driver returns to the depot.

**What happens:** The app keeps your original stop order as the “before” baseline, then runs a route optimizer to shorten total distance.

**What you get:** A map-style route list, km per leg, total distance, fuel cost estimate, and how much distance you saved versus driving in input order.

---

### 3. Bank legacy crypto audit (PQC migration)

**Who it’s for:** Security engineers at banks or payment companies staring at a post-quantum migration deadline.

**The situation:** Old code still uses RSA, MD5, or weak TLS patterns. Quantum computers won’t break those tomorrow, but regulators and NIST timelines are real. Grep finds strings; it doesn’t give you a migration story.

**What you do:** Paste gateway or payment code, pick a target PQC algorithm and compliance framework.

**What happens:** A structured scan flags weak patterns with severity, suggests fixes, and runs a small encrypt demo with post-quantum-style packaging.

**What you get:** Line-level findings, risk level, recommendation text, and a side-by-side vs “we only ran regex” baseline.

---

### 4. Metro fiber QKD (BB84 link planning)

**Who it’s for:** Telecom engineers evaluating quantum key distribution before buying hardware.

**The situation:** QKD promises keys an eavesdropper can’t copy without being detected — but fiber loss, distance, and error rates decide if a link is worth building. Spreadsheets don’t simulate the protocol.

**What you do:** Enter carrier, city pair, fiber distance, and target key rate.

**What happens:** BB84 is simulated: raw bits, sifting, quantum bit error rate (QBER), sifted key preview.

**What you get:** Alice/Bob style protocol stats, QBER, key length, and comparison to classical pre-shared key approaches.

---

### 5. NIST post-quantum account vault

**Who it’s for:** Identity, platform, or security teams planning CNSA 2.0 / NIST PQC migration for stored accounts.

**The situation:** Accounts encrypted with RSA or predictable session randomness are vulnerable to “harvest now, decrypt later” once large quantum computers exist. NIST finalized ML-KEM and ML-DSA for a reason.

**What you do:** Enter account email, tenant, and compliance target. Run the vault flow.

**What happens:** Step 1 generates a high-entropy session nonce (QRNG demo). Step 2 wraps the account with ML-KEM-768 + AES-256-GCM + ML-DSA-65 (real libraries: kyber-py, dilithium-py).

**What you get:** Entropy spectrum, algorithm stack, KEM ciphertext preview, encrypted payload preview, and compliance notes. Comparison at the bottom vs RSA-style storage.

---

### 6. Battery cathode circuit (automotive chemistry)

**Who it’s for:** Battery R&D teams who want a tangible link between quantum simulation and cell materials — not just slides.

**The situation:** Better EV batteries depend on electron behavior in cathodes. Classical mean-field models are fast but miss correlations; that means wrong predictions and expensive wet-lab iterations.

**What you do:** Pick cathode family (NMC, LFP, etc.), cell format, qubit count, shots.

**What happens:** A small entangled circuit runs on a simulator (stepping stone to full VQE chemistry). Results include gate list and measurement histogram.

**What you get:** Fidelity vs classical mean-field, material context, circuit breakdown, shot counts.

---

### 7. Simulator benchmark (research lab)

**Who it’s for:** Grad students, lab engineers, or anyone choosing between Qiskit, PennyLane, and mock backends.

**The situation:** You need the same circuit on every SDK to compare results. Doing that by hand in four notebooks gets old fast, and silent disagreements between backends have ruined more than one paper.

**What you do:** Set qubits, shots, noise model, cost ceiling.

**What happens:** One workflow hits multiple backends and compares fidelity and timing.

**What you get:** Per-backend previews, recommendation, agreement score, export-friendly summary.

---

### 8. Insurance fraud feature probe (secure pipeline)

**Who it’s for:** Insurers running ML on sensitive features who can’t skip security review.

**The situation:** Fraud models depend on feature-store code that sometimes still imports weak crypto. Running quantum or ML jobs on that data without a gate is a compliance incident waiting to happen.

**What you do:** Paste feature-store code, set PII level and whether to block on critical crypto findings.

**What happens:** Crypto scan → policy agent → quantum simulate (only if allowed) → explanation.

**What you get:** Findings table, approve/block verdict, circuit output if cleared, auditor-friendly narrative.

---

### 9. Drug–target binding (pharma VQE)

**Who it’s for:** Computational chemists and drug-discovery teams comparing classical docking to quantum chemistry proxies.

**The situation:** Classical docking (force fields) is fast but can miss electron effects in the binding pocket. Bad affinity estimates send you down expensive dead-end molecules.

**What you do:** Enter compound name, target protein, VQE settings.

**What happens:** A VQE-style proxy runs vs a classical MM/GBSA baseline on the same inputs.

**What you get:** Binding energy estimates, confidence comparison, conformation search context, measurement histogram.

---

### 10. Renewable grid dispatch

**Who it’s for:** Grid operators and energy researchers juggling solar, wind, storage, and gas.

**The situation:** When renewables dominate, “cheapest plant first” dispatch wastes green power (curtailment) and misses cheaper global schedules. That costs money and carbon.

**What you do:** Configure operator, regions, peak demand, renewable mix, contingency flags.

**What happens:** Classical greedy dispatch vs a quantum-inspired unit commitment optimizer on the same grid inputs.

**What you get:** Cost index, CO₂ intensity, renewable utilization, regional dispatch weights.

---

### 11. Quantum Monte Carlo (trading risk / VaR)

**Who it’s for:** Risk desks measuring Value-at-Risk on derivatives books.

**The situation:** Classical Monte Carlo needs huge numbers of paths for accurate tail risk (VaR99). That’s slow and still noisy on complex books.

**What you do:** Enter book name, notional, horizon, path count.

**What happens:** Classical MC vs quantum amplitude estimation proxy on identical inputs.

**What you get:** VaR numbers, effective paths compared, runtime, regulatory framework context (Basel / FRTB as labels, not certification).

---

### 12. Semiconductor fab yield

**Who it’s for:** Fab engineers watching advanced-node yield and inline metrology.

**The situation:** At 3nm, tiny overlay errors scrap whole batches. Classical SPC often tells you after the damage is done.

**What you do:** Set fab name, process node, yield target, inline metrology flag.

**What happens:** Classical SPC baseline vs a quantum-kernel anomaly detector proxy.

**What you get:** Predicted yield, defect PPM, detection latency, circuit histogram.

---

### 13. Quantum RAG / vector search (LLM retrieval)

**Who it’s for:** Teams building RAG pipelines whose embedding indexes are outgrowing classical ANN search.

**The situation:** At 100M+ vectors, HNSW-style search gets slower and recall drops. Your LLM hallucinates more because retrieval missed the right chunk.

**What you do:** Corpus size, query text, top-K, latency budget.

**What happens:** Classical approximate search vs amplitude-amplification-style retrieval proxy.

**What you get:** Recall@K, latency, vectors examined, similarity circuit context.

---

### 14. Protein folding (genomics / VQE)

**Who it’s for:** Clinicians and bioinformatics folks dealing with variants where no PDB template exists.

**The situation:** Homology modeling needs a similar known structure. For many mutations and orphan proteins, there isn’t one — so classical tools stall.

**What you do:** Protein name, organism, sequence length, disease context.

**What happens:** VQE folding proxy vs homology baseline when template flag is off.

**What you get:** RMSD estimate, folding energy, confidence comparison, circuit output.

---

### 15. Post-quantum wallet hardening

**Who it’s for:** Crypto holders and wallet teams planning ECDSA → PQC migration before Shor’s algorithm threatens secp256k1.

**The situation:** Public addresses leak the curve points attackers will target later. “Harvest now, decrypt later” is already rational for patient adversaries.

**What you do:** Wallet address, chain, holdings value, migration timeline.

**What happens:** Same NIST vault stack as the account app (ML-KEM + AES-GCM + ML-DSA), framed for wallet keys.

**What you get:** Vault package preview, holdings at risk, migration timeline, quantum-safe status.

---

### 16. City-wide traffic optimization

**Who it’s for:** City traffic engineers and mobility researchers tired of fixed signal timers.

**The situation:** Thousands of intersections run on old timing plans. One backup propagates gridlock; idling traffic burns time and fuel.

**What you do:** Metro name, intersection count, peak vehicles, optimize for commute vs emissions vs throughput.

**What happens:** Fixed-timing baseline vs coordinated signal optimization proxy across the network.

**What you get:** Commute time delta, CO₂ comparison, throughput uplift, route/heatmap-style visuals.

---

## Skills (smaller building blocks)

Skills live under `/skills` in the dashboard. They are single-purpose tools (QRNG demo, BB84 sim, portfolio optimizer, etc.) invoked via jobs.

| Skill | What it does |
|-------|----------------|
| `hello_quantum` | Bell-state circuit, measurement counts |
| `qrng_demo` | Random bytes + entropy readout |
| `bb84_simulator` | BB84 QKD simulation |
| `portfolio_optimizer` | Weights and USD allocation |
| `route_optimizer` | TSP-style route |
| `pqc_encryptor` | Mock encrypt demo (not production PQC) |
| `crypto_migration_scan` | Weak crypto grep with findings |
| `account_vault_encrypt` | NIST ML-KEM / ML-DSA account vault |

Run via dashboard, `POST /v1/jobs?wait=true`, or `quantumos run <skill> --input ...`.

See [How skills work](#how-skills-work) below for folder layout and handler contract.

---

## API quick reference

```bash
curl https://your-host/health
curl https://your-host/v1/providers
curl https://your-host/v1/use-cases

curl -X POST "https://your-host/v1/jobs?wait=true" \
  -H "Content-Type: application/json" \
  -d '{"job_type":"circuit_simulation","skill":"hello_quantum","input":{"qubits":2,"shots":1024},"constraints":{"max_cost_usd":0,"allow_cloud_quantum":false}}'
```

CLI (local):

```bash
export QUANTUMOS_API_URL=http://localhost:8000
quantumos health
quantumos skills list
quantumos run qrng_demo --input skills/qrng_demo/sample_input.json
```

---

## Quantum providers

| Provider | Where | Install extra | Credentials |
|----------|-------|---------------|-------------|
| `qiskit_aer` | Local sim | `.[quantum]` | None |
| `pennylane_default_qubit` | Local sim | `.[quantum]` | None |
| `origin_quantum` | Local / cloud | `.[origin]` | Optional API key |
| `azure_quantum` | Cloud | `.[azure]` | Azure resource + `az login` |
| `ibm_quantum` | Cloud | `.[ibm]` | `IBM_QUANTUM_TOKEN` |

Cloud jobs need `allow_cloud_quantum: true` in constraints. Deep dive: [docs/QUANTUM_RESEARCH.md](docs/QUANTUM_RESEARCH.md).

---

## How skills work

```
Dashboard / CLI / Use Cases
        │
        ▼
  POST /v1/jobs
        │
        ├── SkillRegistry → skills/*/handler.py
        └── BackendRouter → simulator / classical / cloud
        │
        ▼
  Result in DB (provider fields + result.skill)
```

Each skill is a folder under `skills/<name>/`:

```
skills/hello_quantum/
  skill.yaml
  handler.py
  sample_input.json
```

`handler.py` must define `run(input_data: dict) -> dict`.

To add a skill: create the folder, restart the API, it shows up on `/v1/skills`.

---

## Honest limitations (read this)

- **Mock PQC skill** uses Fernet for demos. The **account vault** use case uses real ML-KEM / ML-DSA libraries — still not a certified HSM product.
- **QRNG demo** uses OS randomness unless you wire real hardware.
- **Optimizers** are heuristics and simulators, not production trading or routing engines.
- **BB84 / QKD** here is simulation, not fiber hardware.
- **No guaranteed quantum speedup** — many paths are quantum-inspired classical code on simulators.

---

## Repo layout

```
quantumos/
  apps/api/           FastAPI
  apps/dashboard/     React UI
  apps/cli/           Typer CLI
  core/               Scheduler, router, policy, audit
  providers/          Backends
  agents/             Rule-based agents
  skills/             Skill handlers
  use_cases/          Industry app catalog + comparison
  security/           Crypto helpers
  db/                 SQLAlchemy
  tests/
```

---

## Docs in the app

| Page | URL |
|------|-----|
| User guide | `/guide` |
| Dev guide | `/dev-guide` |
| README (in app) | `/readme` |
| Industry Apps | `/use-cases` |

---

## License

Apache-2.0 (adjust for your org if needed).
