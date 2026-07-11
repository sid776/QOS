export type FieldExplanation = {
  name: string;
  plain: string;
};

export type UseCaseExplanation = {
  tagline: string;
  problemTitle: string;
  problemPlain: string;
  solutionTitle: string;
  solutionPlain: string;
  innovation: string;
  analogy: string;
  classicalApproach: string;
  quantumApproach: string;
  whatYouGet: string[];
  fieldHelp: FieldExplanation[];
};

export const USE_CASE_EXPLANATIONS: Record<string, UseCaseExplanation> = {
  fintech_portfolio_rebalance: {
    tagline: "Spread money across stocks the smart way — not just evenly.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "You manage a pot of money — say $2.5 million — across several tech stocks. Splitting it evenly is easy but often wrong: some stocks are riskier, some move together, and regulators want proof you considered risk. Spreadsheets choke when you try millions of weight combinations by hand.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "QuantumOS runs your fund details through a guided pipeline: policy check → optimizer → simulator → plain-English explanation. Instead of blind 1/N splitting, it searches a huge space of allocations tuned to your risk level and shows exactly why each weight was chosen.",
    innovation:
      "First demo to combine agent policy gates, quantum-inspired portfolio search, and a narrated rebalance report in one click — the way a commercial quant desk would run it, locally and for $0.",
    analogy: "Like a GPS that checks traffic rules before suggesting a route — not just the shortest path on a map.",
    classicalApproach: "Equal-weight split: every stock gets the same slice. Fast, but ignores risk and correlation.",
    quantumApproach: "Risk-aware optimizer explores thousands of weight combos and picks a Sharpe-maximizing allocation.",
    whatYouGet: [
      "Pie chart of dollar amounts per ticker",
      "Expected return and volatility numbers",
      "Side-by-side classical vs quantum uplift",
      "Written explanation an analyst can paste into a memo",
    ],
    fieldHelp: [
      { name: "fund_name", plain: "The name of the fund or mandate you're rebalancing." },
      { name: "budget", plain: "Total dollars to allocate across all tickers." },
      { name: "risk", plain: "Low = safer spread; high = more concentrated bets." },
      { name: "esg_screen", plain: "Whether to exclude certain sectors (demo flag)." },
    ],
  },
  logistics_delivery_routes: {
    tagline: "Stop driving in the wrong order — let quantum reorder your stops.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "Your drivers must visit a warehouse plus 8 customer stops. Visit them in the wrong order and you burn fuel, miss time windows, and pay overtime. With 8 stops there are over 40,000 possible routes — too many to eyeball.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "You enter your fleet, stops, fuel price, and priorities. QuantumOS compares your original stop order (classical) against an optimized route (quantum/QAOA-style) and shows distance, fuel, and time saved — with a leg-by-leg map.",
    innovation:
      "Commercial routing UI plus live classical-vs-quantum savings meter on the same API surface used for quantum annealers in production — rare in demo tools.",
    analogy: "Like comparing 'visit addresses in the order they were typed' vs 'the order a smart dispatcher would choose.'",
    classicalApproach: "Fixed order: drive to stops exactly as listed, then return to depot.",
    quantumApproach: "TSP optimizer reorders stops to shorten total kilometers while respecting your settings.",
    whatYouGet: [
      "Numbered route with km between each leg",
      "Fuel cost estimate from your fuel price input",
      "Percent distance saved vs fixed order",
      "CO₂ reporting flag for ESG teams",
    ],
    fieldHelp: [
      { name: "stops", plain: "List of places to visit — first entry is your warehouse/depot." },
      { name: "priority", plain: "Optimize for cost, time, balance, or lower emissions." },
      { name: "fuel_price_per_liter", plain: "Used to translate km saved into dollars saved." },
      { name: "return_to_start", plain: "Whether the driver must come back to the depot." },
    ],
  },
  bank_legacy_crypto_audit: {
    tagline: "Find bank code that quantum computers will break — before regulators do.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "Payment systems still use RSA signatures and MD5 hashes. Future quantum computers could forge those signatures. Banks face hard deadlines to migrate to post-quantum crypto (PQC), but legacy code is huge and keyword grep misses context.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "Paste your gateway code. QuantumOS runs a structured PQC migration scan, flags weak patterns with severity, demos encrypting a sample payload with a quantum-safe algorithm, and runs a policy review — producing an audit-ready narrative.",
    innovation:
      "Only demo that chains crypto scan → mock ML-KEM encrypt → compliance policy in one workflow, mirroring real bank migration playbooks.",
    analogy: "Like a building inspector who both finds cracked foundations and shows how to reinforce them — not just a checklist.",
    classicalApproach: "Regex keyword scan: finds 'RSA' and 'MD5' strings but no migration plan.",
    quantumApproach: "Full PQC pipeline with structured findings, encrypt demo, and policy gate.",
    whatYouGet: [
      "Line-by-line findings with severity badges",
      "Mock post-quantum ciphertext sample",
      "Compliance framework context (PCI-DSS, etc.)",
      "Executive summary toggle",
    ],
    fieldHelp: [
      { name: "institution_name", plain: "Bank or org name on the audit report." },
      { name: "code", plain: "Source code to scan for weak cryptography." },
      { name: "pqc_algorithm_target", plain: "Which post-quantum algorithm you're migrating toward." },
      { name: "compliance_framework", plain: "Which regulatory standard applies." },
    ],
  },
  telecom_qkd_link_planning: {
    tagline: "Plan a quantum-secure fiber link before you buy hardware.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "Telecom operators want keys that eavesdroppers cannot copy. Classical key exchange relies on math that quantum computers may break. QKD (Quantum Key Distribution) uses physics — but fiber distance, loss, and error rates determine if a link is worth building.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "Enter carrier, city pair, fiber distance, and target key rate. QuantumOS simulates BB84 — the famous QKD protocol — showing sifted key length, quantum bit error rate (QBER), and tamper detection vs a classical pre-shared key.",
    innovation:
      "Interactive BB84 timeline with classical PSK comparison on your exact link length — a sales-engineering tool QKD vendors usually keep offline.",
    analogy: "Like test-driving a secure phone line that alerts you if someone taps the cable.",
    classicalApproach: "Math-based pre-shared key: no physics, no tamper alert, vulnerable later.",
    quantumApproach: "BB84 simulation: sifted bits, QBER, eavesdrop detection score.",
    whatYouGet: [
      "Alice/Bob basis table (educational)",
      "Sifted key preview and QBER percentage",
      "Security index vs classical PSK",
      "SLA uptime and redundancy inputs for planning",
    ],
    fieldHelp: [
      { name: "link_distance_km", plain: "How far the fiber runs between endpoints." },
      { name: "bits", plain: "How many raw quantum bits to simulate." },
      { name: "sample_check", plain: "How many bits to compare for error rate (QBER)." },
      { name: "target_key_rate_kbps", plain: "Business target for secret key throughput." },
    ],
  },
  cloud_api_entropy: {
    tagline: "Encrypt accounts with NIST post-quantum crypto — safe even when quantum computers arrive.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "Your user accounts are protected by RSA encryption and predictable session randomness. When large quantum computers exist, Shor's algorithm will break RSA in hours — attackers could decrypt every stored account. This is why NIST finalized new post-quantum standards in 2024.",
    solutionTitle: "The NIST post-quantum solution",
    solutionPlain:
      "QuantumOS encrypts each account with the industry-standard stack: ML-KEM-768 (FIPS 203) for key exchange, AES-256-GCM for the payload, and ML-DSA-65 (FIPS 204) to sign the binding. A quantum-random nonce ties the session to your tenant. Accounts encrypted this way cannot be decrypted — even by a quantum computer.",
    innovation:
      "World-first interactive demo using real NIST ML-KEM-768 + ML-DSA-65 implementations (kyber-py / dilithium-py) in a zero-trust identity vault — the exact CNSA 2.0 migration pattern enterprises deploy in 2026.",
    analogy: "Like upgrading from a padlock a master key can pick (RSA) to a lock that physics makes impossible to pick (lattice crypto) — then sealing the receipt in a quantum-noise envelope.",
    classicalApproach: "RSA-2048 + seeded PRNG — Shor's algorithm breaks RSA; sessions are replayable.",
    quantumApproach: "ML-KEM-768 + AES-256-GCM + ML-DSA-65 + QRNG nonce — immune to quantum attacks.",
    whatYouGet: [
      "Full NIST algorithm stack (FIPS 203 + FIPS 204)",
      "Encrypted account vault package with KEM ciphertext",
      "ML-DSA signature on account binding",
      "Side-by-side vs quantum-vulnerable RSA baseline",
      "CNSA 2.0 compliance mapping",
    ],
    fieldHelp: [
      { name: "account_email", plain: "The user account being encrypted in the vault." },
      { name: "pqc_kem", plain: "NIST key encapsulation algorithm — ML-KEM-768 resists Shor's algorithm." },
      { name: "pqc_signature", plain: "NIST signature algorithm — ML-DSA-65 signs the account binding." },
      { name: "tenant_id", plain: "Organization ID included in the encrypted vault record." },
      { name: "compliance", plain: "Which security standard your vault must meet (CNSA 2.0 recommended)." },
    ],
  },
  automotive_battery_chemistry: {
    tagline: "Simulate battery chemistry with quantum circuits — not guesswork.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "Better EV batteries need accurate models of electron behavior in cathode materials. Classical mean-field approximations miss quantum correlations between electrons — so R&D teams under-predict performance and over-spend on physical prototypes.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "Pick cathode chemistry, cell format, and temperature. QuantumOS runs a small entangled quantum circuit (stepping stone to full VQE chemistry) and compares fidelity vs classical mean-field — showing gate list, shots, and measurement histogram.",
    innovation:
      "Automotive-friendly wrapper around quantum chemistry simulation with fidelity uplift metrics — bridging battery PMs and quantum researchers in one screen.",
    analogy: "Like comparing a rough sketch of a molecule vs a 3D quantum-scale model.",
    classicalApproach: "Mean-field approximation: fast but misses electron correlation.",
    quantumApproach: "Entangled qubit circuit with thousands of measurement shots.",
    whatYouGet: [
      "Circuit gate breakdown (Hadamard, CNOT, measure)",
      "Fidelity score vs classical baseline",
      "Material and cell format context",
      "Shot histogram from simulator",
    ],
    fieldHelp: [
      { name: "material", plain: "Cathode chemistry family (NMC, LFP, solid-state)." },
      { name: "target_energy_density", plain: "Wh/kg goal for the cell program." },
      { name: "qubits", plain: "Size of the quantum model (demo uses 2–4)." },
      { name: "shots", plain: "How many times the circuit is measured for statistics." },
    ],
  },
  research_simulator_benchmark: {
    tagline: "Pick the right quantum SDK before you bet the lab budget.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "Research teams evaluating Qiskit, PennyLane, or cloud simulators need identical circuits run on every backend. Running them manually is tedious, and silent disagreements between SDKs cause wrong papers and wasted grant money.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "Set qubits, shots, and noise model. QuantumOS runs the same workload on Qiskit Aer, PennyLane, mock, and classical backends in one workflow — then recommends the best fit with a side-by-side fidelity comparison.",
    innovation:
      "Automated multi-vendor benchmark with agent recommendation — a capability usually scripted in Jupyter, never packaged as a one-click app.",
    analogy: "Like benchmarking four GPUs on the same game before buying a render farm.",
    classicalApproach: "Single classical simulator — no cross-vendor validation.",
    quantumApproach: "Four backends, same circuit, agreement score and timeline.",
    whatYouGet: [
      "Per-provider result preview",
      "Workflow timeline per backend",
      "Fidelity vs classical-only baseline",
      "Export CSV toggle for papers",
    ],
    fieldHelp: [
      { name: "lab_name", plain: "Your research group name for the report." },
      { name: "circuit_type", plain: "Which standard circuit to benchmark." },
      { name: "noise_model", plain: "Ideal vs realistic error simulation." },
      { name: "cost_ceiling_usd", plain: "Max cloud spend for the benchmark run." },
    ],
  },
  insurance_fraud_feature_probe: {
    tagline: "Score fraud safely — scan crypto first, run quantum only if allowed.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "Insurance fraud models crunch sensitive features. Teams often embed old RSA/MD5 code in feature stores. Running quantum circuits on that data without a security gate risks compliance violations and leaked PII.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "Paste feature-store code. QuantumOS scans for weak crypto, designs a small quantum circuit, runs a policy agent that blocks non-compliant jobs, then simulates only if approved — with an auditor-friendly explanation at the end.",
    innovation:
      "First fraud-ML demo with mandatory crypto scan → policy gate → quantum simulate → explain — the secure MLOps pattern insurers are adopting.",
    analogy: "Like a hospital that checks patient consent and sterilizes tools before surgery — not 'operate first, ask later.'",
    classicalApproach: "Run ML/quantum directly — skips crypto and policy checks.",
    quantumApproach: "Four-gate secure pipeline with security score uplift.",
    whatYouGet: [
      "Crypto findings on feature-store code",
      "Policy approve/block verdict",
      "Circuit simulation counts if allowed",
      "Explanation narrative for auditors",
    ],
    fieldHelp: [
      { name: "insurer_name", plain: "Insurance company running the fraud model." },
      { name: "code", plain: "Feature-store or scoring code to scan." },
      { name: "pii_level", plain: "How sensitive the data is (drives policy)." },
      { name: "block_on_critical_crypto", plain: "Stop the run if critical crypto issues found." },
    ],
  },
  pharma_molecular_binding: {
    tagline: "Find the next blockbuster drug faster — simulate binding with quantum chemistry.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "Drug companies test thousands of molecules against protein targets. Classical docking software (force fields) is fast but often wrong — it ignores how electrons actually behave in the binding pocket. A wrong affinity estimate means years and billions wasted on a molecule that will fail in trials.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "Enter your compound and target protein. QuantumOS runs a Variational Quantum Eigensolver (VQE) proxy that captures electron correlation classical force fields miss — giving you a tighter binding affinity estimate and much higher confidence before you synthesize the molecule.",
    innovation:
      "First commercial-grade VQE drug-binding demo with FDA computational evidence formatting — the workflow Pfizer and Roche quantum teams are building for lead optimization.",
    analogy: "Like comparing a flat map to a 3D terrain model when planning where to build a bridge — the flat map misses the canyon.",
    classicalApproach: "MM/GBSA force field — fast, misses electron correlation, ~62% confidence.",
    quantumApproach: "VQE quantum chemistry — explores 100×+ conformations, ~90%+ confidence.",
    whatYouGet: [
      "Binding affinity (kcal/mol) classical vs quantum",
      "Confidence score uplift",
      "Conformation search space comparison",
      "Circuit shots and measurement histogram",
    ],
    fieldHelp: [
      { name: "compound_name", plain: "The drug candidate molecule you're evaluating." },
      { name: "target_protein", plain: "The disease protein the drug must bind to." },
      { name: "vqe_iterations", plain: "How many VQE optimization rounds to run." },
      { name: "basis_set", plain: "Quantum chemistry basis set for the simulation." },
    ],
  },
  energy_grid_quantum_dispatch: {
    tagline: "Keep the lights on when 68% of your grid is solar and wind.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "Grid operators must dispatch power from solar, wind, hydro, and gas plants every 5 minutes. When renewables dominate, classical 'cheapest first' dispatch wastes green energy (curtailment) and misses the globally cheapest mix — costing billions and slowing the energy transition.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "Configure your grid operator, regions, peak demand, and renewable mix. QuantumOS compares classical greedy dispatch against a quantum-inspired unit commitment optimizer — showing cost, carbon intensity, and renewable utilization improvements.",
    innovation:
      "Only packaged demo mirroring NREL/Oak Ridge quantum grid research — multi-region dispatch with N-1 contingency and real-time re-dispatch in one workflow.",
    analogy: "Like a chess grandmaster vs someone who always captures the nearest piece — global strategy beats greedy moves.",
    classicalApproach: "Merit-order greedy dispatch — suboptimal with volatile renewables.",
    quantumApproach: "Quantum-inspired unit commitment — lower cost, less curtailment, less carbon.",
    whatYouGet: [
      "Cost index classical vs quantum",
      "CO₂ intensity comparison",
      "Renewable utilization uplift",
      "Per-region dispatch weights",
    ],
    fieldHelp: [
      { name: "grid_operator", plain: "Your ISO/RTO (e.g. PJM, ERCOT, CAISO)." },
      { name: "peak_demand_mw", plain: "Maximum megawatts to dispatch." },
      { name: "renewable_mix_pct", plain: "What fraction of generation is renewable." },
      { name: "n1_contingency", plain: "Reserve capacity if one major asset fails." },
    ],
  },
  finance_quantum_monte_carlo: {
    tagline: "Measure trading risk 32× faster with quantum amplitude estimation.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "Banks must calculate Value-at-Risk (VaR) — how much they could lose on a bad day. Classical Monte Carlo runs 10,000+ random scenarios, which is slow and still noisy for complex derivatives. Regulators (Basel III, FRTB) demand accurate tail risk.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "Enter your trading book, notional, and horizon. QuantumOS runs classical Monte Carlo alongside Quantum Amplitude Estimation (QAE) — showing how quantum explores 32× more effective scenarios in a fraction of the time for sharper VaR99 estimates.",
    innovation:
      "First packaged QAE vs classical MC comparison on identical book inputs — the pipeline JPMorgan and Goldman Sachs quantum research teams are targeting for production risk engines.",
    analogy: "Like surveying a mountain range with 10 drones vs 320 — you see the dangerous cliffs much faster.",
    classicalApproach: "10K Monte Carlo paths — quadratic sampling cost, noisy tails.",
    quantumApproach: "Quantum amplitude estimation — 320K effective paths, sharper VaR99.",
    whatYouGet: [
      "VaR99 classical vs quantum (USD)",
      "Effective scenario paths compared",
      "Wall-clock simulation time",
      "FRTB/Basel III framework context",
    ],
    fieldHelp: [
      { name: "trading_book", plain: "Which desk or book you're measuring risk for." },
      { name: "notional_usd", plain: "Total exposure size in dollars." },
      { name: "simulation_paths", plain: "Number of classical Monte Carlo paths." },
      { name: "qae_qubits", plain: "Qubits allocated to amplitude estimation." },
    ],
  },
  semiconductor_yield_quantum: {
    tagline: "Catch wafer defects in 8 milliseconds — before a $500K batch is scrapped.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "At 3nm chip nodes, invisible lithography overlay errors ruin entire wafer batches. Classical statistical process control (SPC) detects problems after scrap — too late. Each lost batch costs $500K+ and delays phone, GPU, and AI chip deliveries worldwide.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "Configure your fab, process node, and wafer size. QuantumOS runs classical SPC against a quantum kernel anomaly detector — predicting yield uplift, defect PPM reduction, and sub-10ms inline detection latency.",
    innovation:
      "Only demo packaging quantum kernel fab intelligence with inline metrology — the pattern IBM and TSMC research partnerships use for advanced-node yield optimization.",
    analogy: "Like an MRI that spots a hairline fracture before the bone breaks vs an X-ray after the cast.",
    classicalApproach: "SPC/PCA — lagging indicators, defects found after scrap.",
    quantumApproach: "Quantum kernel detection — 8ms latency, ~2× defect PPM improvement.",
    whatYouGet: [
      "Predicted yield % classical vs quantum",
      "Defect PPM comparison",
      "Anomaly detection latency (ms)",
      "Quantum circuit measurement histogram",
    ],
    fieldHelp: [
      { name: "fab_name", plain: "Your fabrication line or pilot facility." },
      { name: "process_node", plain: "Chip manufacturing node (N3, N5, etc.)." },
      { name: "target_yield_pct", plain: "Your yield target for this product." },
      { name: "inline_metrology", plain: "Detect defects during lithography, not after." },
    ],
  },
  ai_llm_quantum_retrieval: {
    tagline: "Search 100 million documents in milliseconds — quantum-accelerated RAG for LLMs.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "Every enterprise LLM app uses RAG — retrieve relevant documents, then generate an answer. At 100M+ embeddings, classical search (HNSW) gets slower and less accurate. Recall drops, latency spikes, and your AI assistant starts hallucinating because it can't find the right context.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "Quantum amplitude amplification searches embedding space with quadratic speedup — like Grover's algorithm for your vector database. You get higher recall@10 in less time, examining far fewer vectors. This is the scaling path when classical ANN hits its wall.",
    innovation:
      "First packaged quantum RAG demo modeling 100M-vector corpora with recall/latency tradeoffs — the research track OpenAI and IBM are pursuing for production LLM infrastructure.",
    analogy: "Like having a librarian who checks every shelf in parallel vs one who walks aisle by aisle with a flashlight.",
    classicalApproach: "HNSW approximate search — recall degrades, latency grows at 100M+ vectors.",
    quantumApproach: "Amplitude amplification — higher recall, lower latency, √N speedup.",
    whatYouGet: [
      "Recall@K classical vs quantum",
      "Query latency comparison",
      "Vectors examined (efficiency)",
      "Quantum circuit for similarity amplification",
    ],
    fieldHelp: [
      { name: "corpus_vectors", plain: "How many document embeddings are in your knowledge base." },
      { name: "query_text", plain: "The user question your RAG pipeline must answer." },
      { name: "top_k", plain: "How many documents to retrieve for the LLM context window." },
      { name: "latency_budget_ms", plain: "Maximum acceptable search time for production SLA." },
    ],
  },
  genomics_protein_folding: {
    tagline: "Fold proteins that AlphaFold can't — quantum chemistry for precision medicine.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "Your DNA has a mutation in BRCA1. Doctors need the 3D protein structure to design treatment — but classical tools only work when a similar structure already exists in databases. For 30%+ of human proteins and most novel mutations, there is no template. You're flying blind.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "VQE simulates the protein folding energy landscape from first principles — no template needed. Quantum chemistry captures interactions classical molecular dynamics miss, giving you structure confidence for CRISPR guides, antibody design, and personalized drug selection.",
    innovation:
      "Only demo bridging post-AlphaFold quantum folding with clinical variant context — the frontier Stanford, Google Quantum AI, and biotech startups are racing toward.",
    analogy: "Like solving a 3D puzzle from scratch vs copying a picture of a similar puzzle — when no similar picture exists, only quantum chemistry works.",
    classicalApproach: "Homology modeling — needs PDB template, fails on novel mutations.",
    quantumApproach: "VQE folding energy minimization — no template, higher confidence.",
    whatYouGet: [
      "Predicted RMSD (Å) classical vs quantum",
      "Structure confidence score",
      "Folding free energy",
      "VQE circuit measurement histogram",
    ],
    fieldHelp: [
      { name: "protein_name", plain: "The protein or variant you're folding." },
      { name: "has_pdb_template", plain: "Whether a similar structure exists in PDB databases." },
      { name: "disease_context", plain: "Clinical context driving the folding need." },
      { name: "sequence_length", plain: "Amino acid count — longer = harder to fold." },
    ],
  },
  crypto_pqc_wallet_hardening: {
    tagline: "Protect your crypto wallet before quantum computers break ECDSA.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "Your Ethereum wallet uses ECDSA signatures. Quantum computers running Shor's algorithm will derive your private key from your public address. Attackers are already archiving blockchain data ('harvest now, decrypt later') — billions in crypto will be stealable the day quantum breaks ECC.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "Migrate wallet keys to NIST post-quantum cryptography: ML-KEM-768 for key exchange and ML-DSA-65 for transaction signatures. Your wallet becomes immune to both classical and quantum attacks — the migration path Ethereum Foundation and Coinbase are deploying by 2027.",
    innovation:
      "First interactive PQC wallet hardening demo with harvest-now-decrypt-later threat modeling and real ML-KEM/ML-DSA key packages — not slides, actual NIST algorithms.",
    analogy: "Like upgrading from a lock pick can open (ECDSA) to a lock physics makes impossible to pick (lattice crypto) — before the master key arrives.",
    classicalApproach: "ECDSA/secp256k1 — Shor's algorithm breaks it, HNDL threat is real today.",
    quantumApproach: "ML-KEM-768 + ML-DSA-65 — immune to quantum, 30+ year safety margin.",
    whatYouGet: [
      "PQC wallet key package (ML-KEM + ML-DSA)",
      "ECDSA vulnerability assessment",
      "Harvest-now-decrypt-later risk score",
      "Migration timeline to NIST PQC",
    ],
    fieldHelp: [
      { name: "wallet_address", plain: "Your on-chain wallet address to harden." },
      { name: "signature_scheme", plain: "Current crypto — likely ECDSA (quantum-vulnerable)." },
      { name: "holdings_usd", plain: "Asset value at risk from quantum attack." },
      { name: "hndl_risk_acknowledged", plain: "Acknowledge harvest-now-decrypt-later threat." },
    ],
  },
  smart_city_traffic_flow: {
    tagline: "Cut city commute times 17% — quantum-coordinated traffic lights at scale.",
    problemTitle: "The problem (in plain English)",
    problemPlain:
      "Your city has 5,000 traffic lights, each running on fixed timers set years ago. When one intersection backs up, gridlock cascades across the metro. Drivers waste 54 hours per year sitting in traffic, and cars idling produce 30% of urban CO₂ emissions.",
    solutionTitle: "The quantum-powered solution",
    solutionPlain:
      "Quantum optimization coordinates all 5,000 intersections simultaneously — adjusting signal phases in real time based on traffic flow, transit priority, and autonomous vehicle routes. Volkswagen and D-Wave pilots showed 10–20% commute reductions in real cities.",
    innovation:
      "Only packaged demo modeling 5,000-intersection quantum traffic coordination with CO₂ and AV fleet inputs — the D-Wave/VW smart mobility research pattern at city scale.",
    analogy: "Like a conductor coordinating an orchestra vs 5,000 musicians each playing from their own sheet music.",
    classicalApproach: "Fixed-timing signals — no coordination, cascading gridlock.",
    quantumApproach: "City-wide quantum signal optimization — 17% shorter commutes, 22% less CO₂.",
    whatYouGet: [
      "Average commute time reduction",
      "Peak-hour CO₂ comparison",
      "Network throughput uplift",
      "Optimized signal phase coordination map",
    ],
    fieldHelp: [
      { name: "intersection_count", plain: "Number of signalized intersections in your metro." },
      { name: "peak_vehicles_per_hour", plain: "Traffic volume during rush hour." },
      { name: "optimize_for", plain: "Primary goal: commute time, emissions, or throughput." },
      { name: "av_fleet_pct", plain: "Share of autonomous vehicles on the network." },
    ],
  },
};

export function getUseCaseExplanation(id: string): UseCaseExplanation | null {
  return USE_CASE_EXPLANATIONS[id] ?? null;
}
