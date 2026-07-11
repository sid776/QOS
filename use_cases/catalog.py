"""Real-world quantum and quantum-adjacent use case catalog for QuantumOS demos."""

from dataclasses import dataclass, field
from typing import Any, Literal


@dataclass
class UseCase:
    id: str
    industry: str
    title: str
    description: str
    problem: str
    quantum_value: str
    mode: Literal["workflow", "job"]
    audience: str = ""
    outcome_preview: str = ""
    highlights: list[str] = field(default_factory=list)
    steps: list[str] = field(default_factory=list)
    tags: list[str] = field(default_factory=list)
    metrics: list[dict[str, str]] = field(default_factory=list)
    workflow: str | None = None
    skill: str | None = None
    job_type: str | None = None
    task: dict[str, Any] | None = None
    input: dict[str, Any] | None = None
    input_fields: list[dict[str, Any]] = field(default_factory=list)


from use_cases.input_schemas import schema_for


def default_input_for(uc: UseCase) -> dict[str, Any]:
    """Flatten task/input defaults for the dashboard form."""
    schema_defaults = dict(schema_for(uc.id).get("default_input") or {})
    if uc.mode == "workflow":
        out = {**schema_defaults, **dict(uc.task or {})}
        constraints = dict(out.pop("constraints", {}) or {})
        if "allow_cloud_quantum" in constraints:
            out["allow_cloud_quantum"] = constraints["allow_cloud_quantum"]
        if "max_cost_usd" in constraints:
            out["max_cost_usd"] = constraints["max_cost_usd"]
        return out
    return {**schema_defaults, **dict(uc.input or {})}


def _hydrate_use_case_schemas() -> None:
    for uc in USE_CASES:
        s = schema_for(uc.id)
        uc.input_fields = list(s.get("input_fields") or [])


USE_CASES: list[UseCase] = [
    UseCase(
        id="fintech_portfolio_rebalance",
        industry="Fintech / Asset Management",
        title="Multi-asset portfolio rebalance",
        description="Split a $2.5M tech portfolio across major equities using a guided agent pipeline that picks backends and explains the allocation.",
        problem="A fund manager needs to rebalance $2.5M across five large-cap tech stocks under a medium risk profile — without sending data to expensive cloud quantum hardware.",
        quantum_value="Quantum and quantum-inspired optimizers explore huge allocation landscapes faster than brute force. This demo runs a full agent pipeline: policy check → optimization plan → backend selection → portfolio skill → plain-English explanation.",
        audience="Portfolio managers, fintech analysts, and anyone curious how quantum tooling fits into asset allocation.",
        outcome_preview="Pie-chart style weights, dollar allocations per ticker, and a written summary of why the pipeline chose each step.",
        highlights=[
            "Full 5-step agent pipeline with live timeline",
            "$2.5M budget across AAPL, MSFT, NVDA, GOOGL, AMZN",
            "Zero cloud spend — local backends only",
            "Natural-language explanation at the end",
        ],
        steps=[
            "Security policy agent checks constraints",
            "Optimization agent plans the approach",
            "Backend selector picks the best local provider",
            "Portfolio optimizer skill computes weights",
            "Explanation agent summarizes results for you",
        ],
        tags=["Agents", "Finance", "Optimization", "Pipeline"],
        metrics=[
            {"label": "Budget", "value": "$2.5M"},
            {"label": "Assets", "value": "5 stocks"},
            {"label": "Risk", "value": "Medium"},
        ],
        mode="workflow",
        workflow="portfolio_quantum_pipeline",
        task={
            "assets": ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN"],
            "budget": 2_500_000,
            "risk": "medium",
            "constraints": {"max_cost_usd": 0, "allow_cloud_quantum": False},
        },
    ),
    UseCase(
        id="logistics_delivery_routes",
        industry="Logistics / Supply Chain",
        title="Last-mile delivery routing",
        description="Plan the smartest route to visit eight urban stops starting from a central warehouse hub.",
        problem="A delivery fleet must visit eight locations across a city starting from one warehouse. Wrong stop order wastes fuel, driver time, and customer satisfaction.",
        quantum_value="Route planning is a traveling-salesperson problem — a classic target for quantum annealing and QAOA. This demo uses a nearest-neighbor heuristic through the same API you'd use for quantum backends in production.",
        audience="Logistics planners, supply-chain students, and operations teams evaluating smart routing.",
        outcome_preview="A numbered route map with per-leg distances in km and total route length.",
        highlights=[
            "8 real-world stop names (warehouse, mall, hospital…)",
            "Visual route timeline with distances",
            "Nearest-neighbor optimization",
            "Runs in seconds on your laptop",
        ],
        steps=[
            "Load depot + delivery stops",
            "Compute distance matrix between stops",
            "Apply nearest-neighbor TSP heuristic",
            "Return ordered route and leg breakdown",
        ],
        tags=["Logistics", "Optimization", "Route"],
        metrics=[
            {"label": "Stops", "value": "8"},
            {"label": "Method", "value": "TSP heuristic"},
            {"label": "Return", "value": "To depot"},
        ],
        mode="job",
        skill="route_optimizer",
        job_type="optimization",
        input={
            "stops": [
                "Warehouse Hub",
                "Downtown Office",
                "Airport Cargo",
                "North Mall",
                "University",
                "Hospital",
                "Industrial Park",
                "Suburb Depot",
            ],
            "return_to_start": True,
        },
    ),
    UseCase(
        id="bank_legacy_crypto_audit",
        industry="Banking / Compliance",
        title="PQC migration assessment",
        description="Audit synthetic payment-gateway code for quantum-vulnerable crypto before regulatory PQC deadlines hit.",
        problem="Banks still run legacy payment code using RSA signatures and MD5 hashes. Quantum computers threaten these algorithms — regulators are pushing post-quantum migration timelines.",
        quantum_value="Post-quantum cryptography (PQC) replaces vulnerable algorithms with quantum-resistant ones. This workflow scans code, flags weak patterns, demos mock encryption, and runs a policy review.",
        audience="Compliance officers, security architects, and developers planning crypto migration.",
        outcome_preview="Line-by-line security findings with severity badges, mock PQC ciphertext demo, and policy verdict.",
        highlights=[
            "Scans real-style Python payment code",
            "Flags RSA, MD5, SHA-1, ECDSA patterns",
            "Mock PQC encrypt step (educational)",
            "Policy agent reviews data classification",
        ],
        steps=[
            "Crypto migration agent scans source code",
            "Migration skill returns structured findings",
            "Mock PQC encryptor wraps a sample payload",
            "Security policy agent checks restrictions",
        ],
        tags=["Banking", "Security", "PQC", "Compliance"],
        metrics=[
            {"label": "Patterns", "value": "RSA, MD5…"},
            {"label": "Mode", "value": "Workflow"},
            {"label": "Risk", "value": "High if found"},
        ],
        mode="workflow",
        workflow="crypto_migration_assessment",
        task={
            "code": """
# Legacy payment HSM integration (synthetic)
from Crypto.PublicKey import RSA
from Crypto.Hash import MD5, SHA1
from Crypto.Signature import PKCS1_v1_5

def settle_batch(transactions):
    key = RSA.generate(2048)
    digest = MD5.new(batch_id(transactions).encode())
    return PKCS1_v1_5.new(key).sign(digest)
""",
        },
    ),
    UseCase(
        id="telecom_qkd_link_planning",
        industry="Telecommunications",
        title="Metro fiber QKD (BB84)",
        description="Simulate a metropolitan quantum key distribution link and estimate sifted key rates over ~40 km of fiber.",
        problem="Telecom operators planning quantum-secure fiber links need to estimate how many secret key bits they can distill before investing in hardware for a 40 km metropolitan pilot.",
        quantum_value="Quantum Key Distribution (QKD) uses quantum physics — not math assumptions — to share secret keys. BB84 is the most famous protocol. Simulation validates link budgets before capex.",
        audience="Telecom engineers, cryptography researchers, and anyone learning how QKD works.",
        outcome_preview="BB84 protocol table, sifted key preview, QBER percentage, and matching-basis statistics.",
        highlights=[
            "4,096 simulated raw bits",
            "Alice/Bob basis reconciliation visualized",
            "Quantum bit error rate (QBER) estimate",
            "Educational — not real hardware QKD",
        ],
        steps=[
            "Alice generates random bits and random bases",
            "Bob chooses measurement bases and measures",
            "Public basis comparison → sifted key",
            "Sample bits revealed to estimate QBER",
        ],
        tags=["Telecom", "QKD", "BB84", "Security"],
        metrics=[
            {"label": "Raw bits", "value": "4,096"},
            {"label": "Link", "value": "~40 km"},
            {"label": "Protocol", "value": "BB84"},
        ],
        mode="job",
        skill="bb84_simulator",
        job_type="qkd_simulation",
        input={"bits": 4096, "sample_check": 16, "link_distance_km": 40},
    ),
    UseCase(
        id="cloud_api_entropy",
        industry="Cloud / Security",
        title="NIST post-quantum account vault",
        description="Encrypt user accounts with NIST FIPS 203 ML-KEM-768 + FIPS 204 ML-DSA-65 so they cannot be decrypted — even by a quantum computer.",
        problem="Account sessions today rely on RSA and predictable randomness. Shor's algorithm will break RSA; weak nonces enable session hijacking. Enterprises need CNSA 2.0–aligned identity vaults before fault-tolerant quantum arrives.",
        quantum_value="Industry-standard hybrid encryption: QRNG session nonce → ML-KEM-768 key encapsulation → AES-256-GCM payload → ML-DSA-65 signature. Accounts encrypted with this vault remain secure against both classical and quantum adversaries.",
        audience="CISOs, identity architects, zero-trust platform engineers, and DevSecOps teams migrating to post-quantum cryptography.",
        outcome_preview="NIST algorithm stack, encrypted account vault package, ML-KEM ciphertext, ML-DSA signature, and side-by-side comparison vs quantum-vulnerable RSA binding.",
        highlights=[
            "NIST FIPS 203 ML-KEM-768 (Kyber-class KEM)",
            "NIST FIPS 204 ML-DSA-65 account signatures",
            "AES-256-GCM + QRNG session nonce binding",
            "CNSA 2.0 / NIST SP 800-227 hybrid pattern",
            "Accounts not decryptable by quantum computers",
        ],
        steps=[
            "Configure account, tenant, and gateway identity",
            "Generate quantum-random session nonce (QRNG)",
            "ML-KEM-768 encapsulate shared secret (FIPS 203)",
            "Encrypt account binding with AES-256-GCM",
            "ML-DSA-65 sign canonical record (FIPS 204)",
            "Compare vs RSA-2048 quantum-vulnerable baseline",
        ],
        tags=["Security", "PQC", "Identity", "NIST", "Zero trust"],
        metrics=[
            {"label": "KEM", "value": "ML-KEM-768"},
            {"label": "Signature", "value": "ML-DSA-65"},
            {"label": "Standard", "value": "FIPS 203/204"},
        ],
        mode="job",
        skill="account_vault_encrypt",
        job_type="post_quantum_crypto",
        input={
            "account_email": "user@enterprise.example",
            "tenant_id": "org_7f3a9c2e",
            "gateway_name": "identity-edge-gw-prod",
            "purpose": "zero_trust_session",
            "bytes": 32,
        },
    ),
    UseCase(
        id="automotive_battery_chemistry",
        industry="Automotive / Energy",
        title="Battery cathode circuit proxy",
        description="Sample a simplified 2-qubit quantum model as a stepping stone toward full battery cathode chemistry simulation.",
        problem="Battery makers want to simulate electron interactions in cathode materials. Full quantum chemistry (VQE) needs many qubits — researchers start with tiny models to validate encoding.",
        quantum_value="Quantum computers may simulate molecules that classical supercomputers cannot. A 2-qubit Bell-style circuit here stands in for a minimal magnetic-observable sampling experiment.",
        audience="Materials scientists, automotive R&D teams, and quantum chemistry learners.",
        outcome_preview="Circuit gate list (Hadamard, CNOT, measure), qubit count, and measurement histogram from the simulator.",
        highlights=[
            "2-qubit entangled circuit",
            "2,048 measurement shots",
            "Gate-by-gate circuit breakdown",
            "Provider measurement histogram",
        ],
        steps=[
            "Build Bell-state preparation circuit",
            "Submit to quantum simulator backend",
            "Run 2,048 shots",
            "Aggregate measurement counts (00 / 11)",
        ],
        tags=["Automotive", "Chemistry", "Circuit", "Research"],
        metrics=[
            {"label": "Qubits", "value": "2"},
            {"label": "Shots", "value": "2,048"},
            {"label": "Circuit", "value": "Bell state"},
        ],
        mode="job",
        skill="hello_quantum",
        job_type="circuit_simulation",
        input={"qubits": 2, "shots": 2048, "material": "NMC"},
    ),
    UseCase(
        id="research_simulator_benchmark",
        industry="Research / R&D",
        title="Simulator benchmark",
        description="Run the same 2-qubit workload on Qiskit Aer, PennyLane, mock, and classical backends to compare outcomes.",
        problem="Research labs evaluating quantum SDKs need apples-to-apples comparisons before committing to a vendor stack or cloud provider.",
        quantum_value="Different simulators use different math engines — results should match for identical circuits. Benchmarking de-risks production deployment.",
        audience="Quantum researchers, platform engineers, and R&D teams picking a toolchain.",
        outcome_preview="Side-by-side provider results, step timeline showing each backend run, and a recommendation summary.",
        highlights=[
            "Same circuit on 4+ backends",
            "Qiskit Aer, PennyLane, mock, classical",
            "Workflow timeline per provider",
            "Comparison recommendation at end",
        ],
        steps=[
            "Define identical 2-qubit, 512-shot workload",
            "Run on Qiskit Aer (if installed)",
            "Run on PennyLane (if installed)",
            "Run on mock + classical fallbacks",
            "Aggregate and recommend best fit",
        ],
        tags=["Research", "Benchmark", "Providers", "Pipeline"],
        metrics=[
            {"label": "Providers", "value": "4+"},
            {"label": "Qubits", "value": "2"},
            {"label": "Shots", "value": "512"},
        ],
        mode="workflow",
        workflow="research_benchmark",
        task={"qubits": 2, "shots": 512},
    ),
    UseCase(
        id="insurance_fraud_feature_probe",
        industry="Insurance",
        title="Secure fraud-scoring pipeline",
        description="Scan fraud-scoring code for weak cryptography, then run a quantum circuit only if security policy allows.",
        problem="Insurance ML pipelines that score fraud often embed legacy crypto in feature stores. Running quantum circuits on sensitive data requires a security gate first.",
        quantum_value="Hybrid quantum classifiers are an active research area for high-dimensional fraud. This pipeline enforces scan → design → policy → simulate → explain before any circuit runs.",
        audience="Insurance data scientists, fraud teams, and security-conscious ML engineers.",
        outcome_preview="Crypto scan findings, circuit design plan, policy verdict, simulation counts, and explanation.",
        highlights=[
            "Scans feature-store code for RSA/MD5",
            "Circuit generation agent designs qubits",
            "Policy gate blocks non-compliant runs",
            "Full explanation of final result",
        ],
        steps=[
            "Optional crypto migration scan on code",
            "Circuit generation agent plans qubits",
            "Security policy agent approves or blocks",
            "Simulator runs approved circuit",
            "Explanation agent narrates outcome",
        ],
        tags=["Insurance", "Fraud", "Policy", "Pipeline"],
        metrics=[
            {"label": "Qubits", "value": "2"},
            {"label": "Shots", "value": "1,024"},
            {"label": "Gate", "value": "Policy first"},
        ],
        mode="workflow",
        workflow="secure_circuit_pipeline",
        task={
            "qubits": 2,
            "shots": 1024,
            "code": "feature_store_key = RSA.import_key(pem)\nscore_hash = MD5.new(features).hexdigest()",
            "constraints": {"max_cost_usd": 0, "allow_cloud_quantum": False},
        },
    ),
    UseCase(
        id="pharma_molecular_binding",
        industry="Pharma / Life Sciences",
        title="Drug-target binding (VQE)",
        description="Predict how tightly a drug candidate binds its protein target using variational quantum eigensolver chemistry — beyond classical force fields.",
        problem="Pharma R&D spends billions on molecules that fail in trials because classical docking (MM/GBSA) misses quantum electron correlation in binding pockets. Wrong affinity estimates waste 12–15 years per drug program.",
        quantum_value="VQE-based quantum chemistry captures electron correlation that force fields ignore. This demo runs an entangled ansatz proxy for binding affinity — the same path Pfizer, Roche, and national labs are scaling to fault-tolerant hardware.",
        audience="Computational chemists, drug discovery teams, and biotech CTOs evaluating quantum chemistry ROI.",
        outcome_preview="Binding affinity (kcal/mol), confidence score, conformation search space comparison, and circuit measurement histogram.",
        highlights=[
            "VQE proxy for protein-ligand binding",
            "100×+ conformation search vs classical docking",
            "FDA-aligned computational evidence workflow",
            "Scales to fault-tolerant chemistry circuits",
        ],
        steps=[
            "Configure compound, target protein, and chemistry",
            "Classical MM/GBSA baseline affinity estimate",
            "Build variational quantum ansatz for binding pocket",
            "Run VQE iterations with measurement shots",
            "Compare confidence and affinity vs classical",
        ],
        tags=["Pharma", "VQE", "Chemistry", "Drug discovery"],
        metrics=[
            {"label": "Method", "value": "VQE"},
            {"label": "Target", "value": "KRAS G12C"},
            {"label": "Gain", "value": "+20% conf."},
        ],
        mode="job",
        skill="hello_quantum",
        job_type="quantum_chemistry",
        input={"compound_name": "KRAS-G12C inhibitor", "target_protein": "KRAS G12C", "qubits": 4, "shots": 4096},
    ),
    UseCase(
        id="energy_grid_quantum_dispatch",
        industry="Energy / Utilities",
        title="Renewable grid dispatch",
        description="Optimize power dispatch across solar, wind, hydro, and peaker assets when renewables dominate the grid — a problem classical solvers struggle with at scale.",
        problem="Grid operators face volatile renewable output and must dispatch thousands of megawatts in real time. Classical merit-order dispatch wastes renewable energy (curtailment) and misses globally optimal unit commitment when weather shifts hourly.",
        quantum_value="Quantum and quantum-inspired optimizers handle combinatorial unit commitment that exhausts classical solvers. National labs (NREL, Oak Ridge) are actively researching quantum grid dispatch for 80%+ renewable grids.",
        audience="ISO/RTO planners, utility CTOs, and energy transition strategists.",
        outcome_preview="Cost index, CO₂ intensity, renewable utilization, and per-region dispatch weights.",
        highlights=[
            "Multi-region renewable dispatch optimization",
            "Lower curtailment vs greedy merit-order",
            "N-1 contingency-aware re-dispatch",
            "National lab quantum grid research pattern",
        ],
        steps=[
            "Load grid operator, regions, and demand profile",
            "Classical merit-order economic dispatch baseline",
            "Quantum-inspired unit commitment optimizer",
            "Compare cost, carbon, and renewable utilization",
        ],
        tags=["Energy", "Grid", "Optimization", "Climate"],
        metrics=[
            {"label": "Renewables", "value": "68%"},
            {"label": "Demand", "value": "4.2 GW"},
            {"label": "Regions", "value": "4"},
        ],
        mode="job",
        skill="portfolio_optimizer",
        job_type="optimization",
        input={"grid_operator": "PJM Interconnection", "peak_demand_mw": 4200, "renewable_mix_pct": 68},
    ),
    UseCase(
        id="finance_quantum_monte_carlo",
        industry="Financial Services",
        title="Quantum Monte Carlo risk",
        description="Estimate tail risk (VaR99) for trading books using quantum amplitude estimation — quadratic speedup over classical Monte Carlo.",
        problem="Banks must compute Value-at-Risk across millions of scenarios for Basel III and FRTB compliance. Classical Monte Carlo needs 10,000+ paths for accurate tails — expensive, slow, and still noisy for complex derivatives books.",
        quantum_value="Quantum Amplitude Estimation (QAE) provides quadratic speedup for tail probability estimation. JPMorgan, Goldman Sachs, and ECB research teams are building QAE pipelines for production risk engines.",
        audience="Quantitative analysts, CRO offices, and regulatory risk teams.",
        outcome_preview="VaR99 comparison, effective scenario paths, wall-clock time, and QAE qubit configuration.",
        highlights=[
            "Quantum amplitude estimation for tail risk",
            "32× effective scenario coverage",
            "Basel III / FRTB compatible reporting",
            "Goldman/JPM research-track pattern",
        ],
        steps=[
            "Configure trading book, notional, and horizon",
            "Classical Monte Carlo with 10K paths",
            "Quantum amplitude estimation proxy",
            "Compare VaR99, paths, and runtime",
        ],
        tags=["Finance", "Risk", "Monte Carlo", "QAE"],
        metrics=[
            {"label": "Notional", "value": "$500M"},
            {"label": "Paths", "value": "320K eff."},
            {"label": "Horizon", "value": "10d"},
        ],
        mode="job",
        skill="portfolio_optimizer",
        job_type="optimization",
        input={"trading_book": "Global Rates & FX", "notional_usd": 500_000_000, "simulation_paths": 10000},
    ),
    UseCase(
        id="semiconductor_yield_quantum",
        industry="Semiconductor / Manufacturing",
        title="Fab yield intelligence",
        description="Detect lithography and overlay defects on advanced-node wafers using quantum kernel methods — before wafers are scrapped.",
        problem="At 3nm and below, a single undetected overlay defect ruins an entire wafer batch costing $500K+. Classical statistical process control (SPC) is lagging — defects are found after scrap, not inline during lithography.",
        quantum_value="Quantum kernel methods map high-dimensional metrology data into Hilbert space where subtle defect patterns separate cleanly. IBM and TSMC research partnerships use quantum ML for inline fab anomaly detection.",
        audience="Fab yield engineers, semiconductor VP ops, and advanced-node process teams.",
        outcome_preview="Predicted yield %, defect PPM, anomaly detection latency, and quantum circuit histogram.",
        highlights=[
            "Sub-10ms inline anomaly detection",
            "Near 2× defect PPM reduction vs SPC",
            "Quantum kernel for overlay metrology",
            "IBM/TSMC fab research pattern",
        ],
        steps=[
            "Configure fab, wafer size, and process node",
            "Classical SPC/PCA yield baseline",
            "Quantum kernel anomaly detection circuit",
            "Compare yield, defect PPM, and latency",
        ],
        tags=["Semiconductor", "Manufacturing", "QML", "Yield"],
        metrics=[
            {"label": "Node", "value": "N3"},
            {"label": "Yield", "value": "+7%"},
            {"label": "Latency", "value": "8ms"},
        ],
        mode="job",
        skill="hello_quantum",
        job_type="quantum_machine_learning",
        input={"fab_name": "TSMC N3 Pilot Line", "wafer_size": "300mm", "qubits": 3, "shots": 8192},
    ),
    UseCase(
        id="ai_llm_quantum_retrieval",
        industry="AI / Large Language Models",
        title="Quantum RAG vector search",
        description="Accelerate billion-scale embedding retrieval for LLM RAG pipelines using quantum amplitude amplification — the bottleneck every AI team hits at production scale.",
        problem="Enterprise RAG systems search millions of document embeddings per query. Classical approximate nearest-neighbor (HNSW, IVF) degrades in recall at scale and costs grow linearly with corpus size — the #1 latency bottleneck in production LLM apps.",
        quantum_value="Grover-style amplitude amplification searches unstructured databases with quadratic speedup. OpenAI, Google, and IBM research teams are exploring quantum subroutines for embedding retrieval when corpora exceed 100M vectors.",
        audience="ML platform engineers, LLM infra teams, and AI architects scaling RAG beyond classical ANN limits.",
        outcome_preview="Recall@10, query latency, vectors searched, and quantum circuit depth for similarity amplification.",
        highlights=[
            "Quadratic speedup for similarity search",
            "Recall uplift vs HNSW at 100M+ vectors",
            "Production RAG latency modeling",
            "OpenAI/IBM quantum ML research pattern",
        ],
        steps=[
            "Configure corpus size, embedding dims, and query",
            "Classical HNSW approximate search baseline",
            "Quantum amplitude amplification retrieval",
            "Compare recall, latency, and vectors examined",
        ],
        tags=["AI", "LLM", "RAG", "QML"],
        metrics=[
            {"label": "Corpus", "value": "100M vec"},
            {"label": "Recall", "value": "+18%"},
            {"label": "Speedup", "value": "√N"},
        ],
        mode="job",
        skill="hello_quantum",
        job_type="quantum_machine_learning",
        input={"corpus_name": "Enterprise Knowledge Base", "corpus_vectors": 100_000_000, "embedding_dims": 1536, "qubits": 4, "shots": 4096},
    ),
    UseCase(
        id="genomics_protein_folding",
        industry="Genomics / Precision Medicine",
        title="Protein folding (VQE)",
        description="Predict 3D protein structures for precision medicine using variational quantum eigensolver — beyond classical homology modeling when no template exists.",
        problem="Personalized medicine needs accurate protein structures for novel mutations. Classical homology modeling fails when no similar template exists in PDB — leaving 30%+ of human proteins 'unfoldable' and blocking CRISPR and antibody design.",
        quantum_value="Quantum chemistry simulates folding energy landscapes that classical MD cannot reach at atomistic fidelity. Google, IBM, and biotech startups are racing to apply VQE/QPE to folding — the next frontier after AlphaFold's template limits.",
        audience="Computational biologists, genomics labs, and precision medicine teams.",
        outcome_preview="Folding energy (kcal/mol), RMSD confidence, conformation search space, and VQE circuit histogram.",
        highlights=[
            "Folds proteins without PDB templates",
            "1000× conformation landscape exploration",
            "CRISPR/antibody design ready outputs",
            "Post-AlphaFold quantum research frontier",
        ],
        steps=[
            "Configure protein sequence, organism, and disease context",
            "Classical homology modeling baseline",
            "VQE folding energy minimization",
            "Compare RMSD confidence and energy",
        ],
        tags=["Genomics", "VQE", "Medicine", "Folding"],
        metrics=[
            {"label": "Method", "value": "VQE"},
            {"label": "RMSD conf.", "value": "+24%"},
            {"label": "No template", "value": "Yes"},
        ],
        mode="job",
        skill="hello_quantum",
        job_type="quantum_chemistry",
        input={"protein_name": "BRCA1 variant R1699Q", "sequence_length": 1863, "organism": "Homo sapiens", "qubits": 4, "shots": 8192},
    ),
    UseCase(
        id="crypto_pqc_wallet_hardening",
        industry="Crypto / Web3",
        title="Post-quantum wallet hardening",
        description="Migrate blockchain wallets from ECDSA/secp256k1 to NIST post-quantum keys before quantum computers break elliptic-curve cryptography — protecting billions in digital assets.",
        problem="Bitcoin, Ethereum, and Solana wallets use ECDSA and Ed25519 — broken by Shor's algorithm on fault-tolerant quantum computers. The 'Harvest Now, Decrypt Later' threat means adversaries archive signed transactions today to steal funds tomorrow.",
        quantum_value="NIST ML-KEM-768 + ML-DSA-65 wallet key hierarchy replaces elliptic-curve keys with lattice cryptography. Coinbase, Ethereum Foundation PQC working groups, and NIST are driving 2026–2030 migration timelines.",
        audience="Wallet developers, crypto custodians, DeFi protocol teams, and Web3 security engineers.",
        outcome_preview="PQC wallet key package, ML-KEM ciphertext, signature migration plan, and ECDSA vulnerability score.",
        highlights=[
            "NIST FIPS 203/204 wallet key hierarchy",
            "ECDSA → ML-DSA migration path",
            "Harvest-now-decrypt-later threat model",
            "Ethereum Foundation PQC pattern",
        ],
        steps=[
            "Configure chain, wallet address, and asset holdings",
            "Assess ECDSA/secp256k1 quantum vulnerability",
            "Generate ML-KEM + ML-DSA hardened wallet package",
            "Compare security score vs classical wallet",
        ],
        tags=["Crypto", "Web3", "PQC", "Wallet"],
        metrics=[
            {"label": "Chain", "value": "Ethereum"},
            {"label": "KEM", "value": "ML-KEM-768"},
            {"label": "Safe", "value": "PQC"},
        ],
        mode="job",
        skill="account_vault_encrypt",
        job_type="post_quantum_crypto",
        input={"wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", "chain": "Ethereum", "asset_symbol": "ETH", "holdings_usd": 2_400_000},
    ),
    UseCase(
        id="smart_city_traffic_flow",
        industry="Smart Cities / Mobility",
        title="City-wide traffic optimization",
        description="Coordinate thousands of intersections in real time using quantum optimization — cutting congestion, emissions, and commute times across entire metro areas.",
        problem="A typical metro has 5,000+ signalized intersections. Classical fixed-timing plans and greedy local optimization cause cascading gridlock — wasting 54 hours per driver per year and 30% of urban CO₂ emissions.",
        quantum_value="Quantum annealing and QAOA solve city-scale coordinated signal timing as a massive combinatorial problem. Volkswagen, D-Wave, and Tokyo/Osaka pilot programs demonstrated 10–20% commute time reductions using quantum traffic optimization.",
        audience="City DOT planners, mobility startups, autonomous vehicle fleet operators, and smart city CTOs.",
        outcome_preview="Average commute reduction, CO₂ saved, intersections coordinated, and optimized signal phase map.",
        highlights=[
            "5,000+ intersection coordination",
            "10–20% commute time reduction (VW pilots)",
            "Real-time adaptive signal phasing",
            "D-Wave smart city research pattern",
        ],
        steps=[
            "Configure metro, intersection count, and peak demand",
            "Classical fixed-timing traffic baseline",
            "Quantum coordinated signal optimization",
            "Compare commute time, CO₂, and throughput",
        ],
        tags=["Smart city", "Mobility", "Optimization", "Climate"],
        metrics=[
            {"label": "Intersections", "value": "5,000"},
            {"label": "Commute", "value": "-17%"},
            {"label": "CO₂", "value": "-22%"},
        ],
        mode="job",
        skill="route_optimizer",
        job_type="optimization",
        input={"metro_name": "Greater Metro Area", "intersection_count": 5000, "peak_vehicles_per_hour": 850_000, "optimize_for": "commute_time"},
    ),
]


_hydrate_use_case_schemas()


def get_use_case(use_case_id: str) -> UseCase:
    for uc in USE_CASES:
        if uc.id == use_case_id:
            return uc
    raise ValueError(f"Unknown use case: {use_case_id}")
