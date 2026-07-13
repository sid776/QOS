import { USE_CASE_DETAILED } from "./useCaseDetailedWriteups";

export type FieldExplanation = {
  name: string;
  plain: string;
};

export type AnalyzeFlowStep = {
  phase: string;
  layman: string;
  technical: string;
};

export type UseCaseExplanation = {
  tagline: string;
  problemTitle: string;
  problemPlain: string;
  solutionTitle: string;
  solutionPlain: string;
  technicalTitle: string;
  technicalPlain: string;
  libraries: string[];
  innovation: string;
  analogy: string;
  classicalApproach: string;
  quantumApproach: string;
  whatYouGet: string[];
  fieldHelp: FieldExplanation[];
  /** Extended end-to-end writeup (merged from useCaseDetailedWriteups) */
  audience?: string;
  realWorldContext?: string;
  problemDeep?: string;
  solutionDeep?: string;
  userSteps?: string[];
  analyzeFlow?: AnalyzeFlowStep[];
  classicalDeep?: string;
  quantumDeep?: string;
  technicalDeep?: string;
  outputsDeep?: string[];
  limitations?: string[];
};

export const USE_CASE_EXPLANATIONS: Record<string, UseCaseExplanation> = {
  fintech_portfolio_rebalance: {
    tagline: "Split a fund across stocks without defaulting to equal slices.",
    problemTitle: "The situation",
    problemPlain:
      "You have a fixed budget — maybe $2.5M — and several tickers. Equal weighting is the lazy default, but it ignores how risky each name is and how they move together. Spreadsheets break down when you try to compare thousands of weight combinations by hand.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Enter your fund, budget, tickers, and risk level. The app walks through policy check → optimizer → backend selection → portfolio skill, then explains the allocation in plain language.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "The agent calls the portfolio_optimizer skill with risk-adjusted weight heuristics and compares against equal-weight baseline. When the provider router selects a quantum backend, PennyLane or Qiskit Aer can run QAOA-style circuit proxies on the same inputs.",
    libraries: ["PennyLane", "Qiskit Aer", "portfolio_optimizer skill"],
    innovation:
      "You see both the optimized weights and a straight equal-weight baseline on the same screen, with dollar amounts and a short narrative you could paste into a memo.",
    analogy: "Like comparing ‘everyone gets the same slice’ to ‘slices sized for how spicy each stock is.’",
    classicalApproach: "Equal weight: same percentage in every ticker, ignores risk.",
    quantumApproach: "Optimizer searches many weight combos and picks a risk-aware split.",
    whatYouGet: [
      "Pie chart and dollar amount per ticker",
      "Expected return and volatility",
      "Comparison vs equal-weight baseline",
      "Written summary of the pipeline steps",
    ],
    fieldHelp: [
      { name: "fund_name", plain: "Name on the report — your fund or mandate." },
      { name: "budget", plain: "Total dollars to spread across tickers." },
      { name: "risk", plain: "Low = safer spread; high = more concentrated." },
      { name: "esg_screen", plain: "Demo flag to exclude certain sectors." },
    ],
  },
  logistics_delivery_routes: {
    tagline: "Reorder delivery stops so the driver covers less ground.",
    problemTitle: "The situation",
    problemPlain:
      "Your driver starts at a warehouse and has eight drops. The order you typed into the system is rarely the cheapest route. With eight stops there are over 40,000 orderings — you can't eyeball the best one.",
    solutionTitle: "What you run here",
    solutionPlain:
      "List depot + stops, fuel price, and priorities. We keep your original order as the baseline, then run a route optimizer and show distance, fuel, and time saved.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "Classical baseline keeps stops in input order; the route_optimizer skill builds a distance matrix and runs nearest-neighbor TSP heuristics. Production deployments can swap in Qiskit QAOA or annealing backends through the same skill interface.",
    libraries: ["route_optimizer", "Qiskit Aer", "classical_local provider"],
    innovation:
      "Same API surface you'd use for a routing backend, but with a clear before/after and leg-by-leg km on one page.",
    analogy: "Typing addresses in the order they came in vs letting a dispatcher reorder them.",
    classicalApproach: "Drive stops in the order listed, return to depot.",
    quantumApproach: "TSP-style optimizer shuffles stops to cut total km.",
    whatYouGet: [
      "Numbered route with km between legs",
      "Fuel cost from your price per liter",
      "Percent distance saved vs input order",
      "Optional CO₂ reporting flag",
    ],
    fieldHelp: [
      { name: "stops", plain: "Places to visit — first entry is the warehouse." },
      { name: "priority", plain: "Optimize for cost, time, balance, or emissions." },
      { name: "fuel_price_per_liter", plain: "Turns km saved into dollars saved." },
      { name: "return_to_start", plain: "Whether the route ends back at the depot." },
    ],
  },
  bank_legacy_crypto_audit: {
    tagline: "Find payment code that won't survive a post-quantum migration.",
    problemTitle: "The situation",
    problemPlain:
      "Lots of bank code still calls RSA, MD5, or old TLS patterns. Migration deadlines are real even if quantum computers aren't in your server room yet. Keyword grep finds strings; it doesn't give executives a plan.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Paste gateway or HSM integration code, pick a target PQC algorithm and framework. You get structured findings, a sample encrypt step, and policy context — not just a list of matches.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "Regex baseline flags RSA, MD5, SHA-1, and ECDSA patterns line-by-line. The crypto_migration_scan skill returns structured findings plus a mock PQC encrypt step via the cryptography stack and NISTAccountVault helpers.",
    libraries: ["crypto_migration_scan", "cryptography", "NISTAccountVault"],
    innovation:
      "Scan, sample PQC encrypt, and compliance framing in one flow — closer to how migration workshops run than a lone static analyzer.",
    analogy: "A building inspector who notes cracks and shows a reinforcement option, not just a red tag.",
    classicalApproach: "Regex for 'RSA' and 'MD5' with no migration story.",
    quantumApproach: "Structured findings plus PQC demo and policy pass.",
    whatYouGet: [
      "Findings with severity",
      "Sample post-quantum ciphertext",
      "Framework label (PCI-DSS, etc.)",
      "Executive summary text",
    ],
    fieldHelp: [
      { name: "institution_name", plain: "Bank or org name on the report." },
      { name: "code", plain: "Source to scan." },
      { name: "pqc_algorithm_target", plain: "Algorithm you're migrating toward." },
      { name: "compliance_framework", plain: "Which standard you're mapping to." },
    ],
  },
  telecom_qkd_link_planning: {
    tagline: "Sanity-check a QKD fiber link before you buy boxes.",
    problemTitle: "The situation",
    problemPlain:
      "QKD uses physics so an eavesdropper can't copy keys quietly. But loss, distance, and error rates decide if your link works. Sales decks rarely show sifted key rate on *your* km of fiber.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Enter carrier, endpoints, fiber km, and target key rate. BB84 is simulated: raw bits, sifting, QBER, sifted key preview — compared to a classical pre-shared key story.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "The bb84_simulator skill models Alice/Bob basis choices, sifting, and QBER from your link distance and bit count. Output includes sifted key length and a key preview compared to a classical PSK baseline with no tamper detection.",
    libraries: ["bb84_simulator"],
    innovation:
      "Link-length-specific BB84 numbers you can screenshot for a customer call, not a generic protocol animation.",
    analogy: "Test-driving a tamper-evident line before trenching fiber.",
    classicalApproach: "Math-only pre-shared keys — no tamper alarm from physics.",
    quantumApproach: "BB84 sim with QBER and sifted key length.",
    whatYouGet: [
      "Raw vs sifted bit counts",
      "QBER percentage",
      "Key preview snippet",
      "Security index vs classical PSK",
    ],
    fieldHelp: [
      { name: "link_distance_km", plain: "Fiber length between endpoints." },
      { name: "bits", plain: "Raw quantum bits to simulate." },
      { name: "sample_check", plain: "Bits used to estimate error rate." },
      { name: "target_key_rate_kbps", plain: "Throughput you need for the business case." },
    ],
  },
  cloud_api_entropy: {
    tagline: "Store accounts with NIST post-quantum crypto, not RSA.",
    problemTitle: "The situation",
    problemPlain:
      "RSA-encrypted accounts and weak session randomness are fine until they're not. NIST shipped ML-KEM and ML-DSA so you can migrate before large quantum machines break public-key math. 'Harvest now, decrypt later' already makes sense for patient attackers.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Step 1: quantum-random session nonce. Step 2: account sealed with ML-KEM-768 + AES-256-GCM + ML-DSA-65 (real kyber-py / dilithium-py). You see ciphertext previews, not hand-wavy slides.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "qrng_demo generates the session nonce; account_vault_encrypt wraps the record with ML-KEM-768 and ML-DSA-65 via kyber-py and dilithium-py, then AES-256-GCM. A classical RSA binding with seeded PRNG is shown side-by-side for comparison.",
    libraries: ["kyber-py", "dilithium-py", "qrng_demo", "account_vault_encrypt"],
    innovation:
      "Interactive vault with the same algorithm names enterprises put on migration slides — wired to libraries, not mock base64.",
    analogy: "Swapping a pickable padlock for lattice math, then sealing the receipt in noisy random bytes.",
    classicalApproach: "RSA + predictable PRNG — vulnerable to Shor's algorithm later.",
    quantumApproach: "ML-KEM + AES-GCM + ML-DSA + QRNG nonce.",
    whatYouGet: [
      "Entropy spectrum for the session nonce",
      "Full algorithm stack list",
      "KEM ciphertext and payload previews",
      "Comparison vs RSA-style storage",
    ],
    fieldHelp: [
      { name: "account_email", plain: "Account being vaulted." },
      { name: "pqc_kem", plain: "Key encapsulation algorithm (ML-KEM-768)." },
      { name: "pqc_signature", plain: "Signature on the binding (ML-DSA-65)." },
      { name: "tenant_id", plain: "Org ID stored in the record." },
      { name: "compliance", plain: "Target standard (e.g. CNSA 2.0)." },
    ],
  },
  automotive_battery_chemistry: {
    tagline: "See a quantum circuit stand in for cathode electron behavior.",
    problemTitle: "The situation",
    problemPlain:
      "Better EV cells need better models of electrons in the cathode. Mean-field approximations are fast but miss correlation — so teams burn money on lab cycles that simulations should have ruled out.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Pick cathode chemistry, cell format, qubits, and shots. A small entangled circuit runs on a simulator with gates and histograms you can actually inspect.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "hello_quantum builds a Bell-state entangled circuit with configurable qubits and shots; fidelity metrics are compared to a Hartree-Fock mean-field baseline. The same pipeline is the stepping stone toward PennyLane VQE on cathode Hamiltonians via Qiskit Aer.",
    libraries: ["hello_quantum", "PennyLane", "Qiskit Aer"],
    innovation:
      "Battery program managers get circuit output, not just a fidelity number buried in a PDF.",
    analogy: "Flat sketch of a molecule vs a rough 3D model — still a demo, but closer to the physics.",
    classicalApproach: "Mean-field: quick, misses electron correlation.",
    quantumApproach: "Entangled circuit + shot histogram.",
    whatYouGet: [
      "Gate list (H, CNOT, measure)",
      "Fidelity vs mean-field",
      "Material and format labels",
      "Measurement distribution",
    ],
    fieldHelp: [
      { name: "material", plain: "Cathode family (NMC, LFP, solid-state)." },
      { name: "target_energy_density", plain: "Wh/kg goal for the program." },
      { name: "qubits", plain: "Circuit width (demo: 2–4)." },
      { name: "shots", plain: "Measurement repetitions." },
    ],
  },
  research_simulator_benchmark: {
    tagline: "Run the same circuit on every SDK you're evaluating.",
    problemTitle: "The situation",
    problemPlain:
      "Labs compare Qiskit, PennyLane, and cloud simulators by re-running the same notebook four times. Results drift, timing differs, and nobody writes it down the same way twice.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Set qubits, shots, and noise. One workflow hits multiple backends and tells you which agreed and which didn't.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "ProviderRegistry probes installed SDKs and runs the same hello_quantum circuit across Qiskit Aer, PennyLane, TensorFlow Quantum, NVIDIA cuQuantum, Azure Quantum, and IBM Quantum when credentials and drivers are present.",
    libraries: [
      "Qiskit Aer",
      "PennyLane",
      "TensorFlow Quantum",
      "NVIDIA cuQuantum",
      "Azure Quantum",
      "IBM Quantum",
    ],
    innovation:
      "Benchmark report without maintaining four separate scripts — useful the week before you pick a stack.",
    analogy: "Running the same game benchmark on four GPUs before you buy.",
    classicalApproach: "One simulator, no cross-check.",
    quantumApproach: "Same circuit, multiple backends, agreement score.",
    whatYouGet: [
      "Per-backend previews",
      "Timeline of steps",
      "Fidelity vs classical-only",
      "CSV export toggle",
    ],
    fieldHelp: [
      { name: "lab_name", plain: "Group name on the report." },
      { name: "circuit_type", plain: "Standard circuit to run everywhere." },
      { name: "noise_model", plain: "Ideal vs noisy simulation." },
      { name: "cost_ceiling_usd", plain: "Cap for cloud spend." },
    ],
  },
  insurance_fraud_feature_probe: {
    tagline: "Scan feature-store code before you run anything quantum on it.",
    problemTitle: "The situation",
    problemPlain:
      "Fraud models touch sensitive features. Feature pipelines often still import RSA or MD5 helpers. Running ML or quantum jobs without a crypto check is how compliance tickets get opened.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Paste feature-store code, set PII level, choose whether to block on critical findings. Crypto scan → policy gate → simulate only if allowed → short explanation for auditors.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "crypto_migration_scan flags legacy crypto in feature-store code before any job runs. If policy gates pass, hello_quantum executes a small circuit with configurable qubits and shots as the quantum simulation step.",
    libraries: ["crypto_migration_scan", "hello_quantum"],
    innovation:
      "Security gate is mandatory in the flow, not a separate checklist someone forgot.",
    analogy: "Consent and sterilization before surgery, not operate-first.",
    classicalApproach: "Jump straight to model run — skips crypto and policy.",
    quantumApproach: "Scan, policy, then simulate if cleared.",
    whatYouGet: [
      "Crypto findings on your code",
      "Approve / block verdict",
      "Circuit counts if approved",
      "Narrative for audit trail",
    ],
    fieldHelp: [
      { name: "insurer_name", plain: "Company name on the report." },
      { name: "code", plain: "Feature-store or scoring code." },
      { name: "pii_level", plain: "Sensitivity — drives policy strictness." },
      { name: "block_on_critical_crypto", plain: "Stop the run if critical issues found." },
    ],
  },
  pharma_molecular_binding: {
    tagline: "Compare classical docking to a VQE binding proxy on one compound.",
    problemTitle: "The situation",
    problemPlain:
      "Force-field docking is fast and often wrong about electrons in the binding pocket. One bad affinity number can send medicinal chemistry down a two-year blind alley.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Enter compound and protein target. VQE-style proxy runs beside MM/GBSA baseline on the same inputs so you can see the gap, not just a single headline kcal/mol.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "Classical MM/GBSA estimates binding kcal/mol from force-field heuristics. hello_quantum runs an entangled VQE proxy circuit with shot histograms; conformation search space scales with qubit count on the PennyLane path.",
    libraries: ["PennyLane", "hello_quantum"],
    innovation:
      "Side-by-side binding estimates with confidence labels — useful in a discovery meeting even as a teaching demo.",
    analogy: "Flat map vs terrain model when picking where to pour a foundation.",
    classicalApproach: "MM/GBSA force field — fast, misses correlation.",
    quantumApproach: "VQE proxy — explores more conformations, higher stated confidence.",
    whatYouGet: [
      "Binding affinity classical vs quantum",
      "Confidence comparison",
      "Conformation search context",
      "Shot histogram",
    ],
    fieldHelp: [
      { name: "compound_name", plain: "Molecule you're evaluating." },
      { name: "target_protein", plain: "Protein it must bind." },
      { name: "vqe_iterations", plain: "Optimization rounds." },
      { name: "basis_set", plain: "Basis set label for the chemistry run." },
    ],
  },
  energy_grid_quantum_dispatch: {
    tagline: "Dispatch solar, wind, and gas without wasting green power.",
    problemTitle: "The situation",
    problemPlain:
      "Operators rebalance every few minutes. When renewables dominate, 'cheapest unit first' curtail wind and solar because it can't see the whole schedule — that costs money and carbon.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Configure operator, regions, peak MW, renewable share. Greedy classical dispatch vs quantum-inspired unit commitment on the same grid inputs.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "Classical merit-order greedy dispatch sets the baseline cost and carbon index. portfolio_optimizer reuses its risk-adjusted weighting heuristics as a quantum-inspired unit-commitment proxy across generation regions.",
    libraries: ["portfolio_optimizer", "classical_local provider"],
    innovation:
      "Cost, carbon, and renewable utilization on one comparison chart — grid researchers recognize the shape even in demo form.",
    analogy: "Playing chess one capture at a time vs thinking a few moves ahead.",
    classicalApproach: "Merit-order greedy dispatch.",
    quantumApproach: "Unit commitment optimizer — less curtailment, lower cost in the demo metrics.",
    whatYouGet: [
      "Cost index comparison",
      "CO₂ intensity",
      "Renewable utilization",
      "Regional weights",
    ],
    fieldHelp: [
      { name: "grid_operator", plain: "ISO/RTO name (PJM, ERCOT, etc.)." },
      { name: "peak_demand_mw", plain: "Peak load to cover." },
      { name: "renewable_mix_pct", plain: "Share of renewables on the grid." },
      { name: "n1_contingency", plain: "Reserve if one big asset trips." },
    ],
  },
  finance_quantum_monte_carlo: {
    tagline: "Estimate tail risk (VaR) with fewer wasted Monte Carlo paths.",
    problemTitle: "The situation",
    problemPlain:
      "VaR on derivatives needs the bad-day tail. Classical Monte Carlo throws thousands of paths and still wobbles on fat tails. Risk teams wait hours for numbers regulators want daily.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Enter book, notional, horizon, path count. Classical MC vs quantum amplitude estimation proxy on identical inputs — same book, different sampling strategy.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "Classical Monte Carlo draws random paths proportional to simulation_paths for VaR99. The quantum side uses a PennyLane amplitude-estimation proxy that reports higher effective path coverage at lower wall time for the same notional.",
    libraries: ["PennyLane"],
    innovation:
      "VaR99 and effective paths on one screen — the conversation risk quants actually have about QAE, without a custom Jupyter notebook.",
    analogy: "Ten survey drones vs a hundred — you find the cliff edge faster.",
    classicalApproach: "10K paths — slow tails, noisy VaR99.",
    quantumApproach: "QAE proxy — more effective samples in less wall time in the demo.",
    whatYouGet: [
      "VaR99 classical vs quantum (USD)",
      "Effective path counts",
      "Runtime comparison",
      "Basel / FRTB labels as context",
    ],
    fieldHelp: [
      { name: "trading_book", plain: "Desk or book name." },
      { name: "notional_usd", plain: "Exposure size." },
      { name: "simulation_paths", plain: "Classical MC paths." },
      { name: "qae_qubits", plain: "Qubits for amplitude estimation demo." },
    ],
  },
  semiconductor_yield_quantum: {
    tagline: "Catch fab anomalies before a whole batch is scrap.",
    problemTitle: "The situation",
    problemPlain:
      "At advanced nodes, overlay errors are invisible until yield collapses. Classical SPC charts often move after the wafers are already bad — expensive at 3nm.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Set fab, node, yield target. Classical SPC vs quantum-kernel anomaly proxy with latency and defect PPM in the comparison.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "Classical SPC/PCA sets yield and defect PPM baselines from statistical process control. hello_quantum runs an entangled feature-map circuit as a quantum-kernel anomaly proxy with sub-10ms detection latency in the demo metrics.",
    libraries: ["hello_quantum", "classical SPC"],
    innovation:
      "Inline metrology story with ms-scale detection in the metrics — fab people know what that's aiming at.",
    analogy: "MRI before the bone breaks vs X-ray after.",
    classicalApproach: "SPC after the fact — lagging yield loss.",
    quantumApproach: "Kernel detector proxy — lower PPM, faster detection in demo.",
    whatYouGet: [
      "Yield % comparison",
      "Defect PPM",
      "Detection latency (ms)",
      "Circuit histogram",
    ],
    fieldHelp: [
      { name: "fab_name", plain: "Line or pilot fab name." },
      { name: "process_node", plain: "N3, N5, etc." },
      { name: "target_yield_pct", plain: "Target for this product." },
      { name: "inline_metrology", plain: "Flag for inline vs end-of-line." },
    ],
  },
  ai_llm_quantum_retrieval: {
    tagline: "Retrieve documents faster when your embedding index gets huge.",
    problemTitle: "The situation",
    problemPlain:
      "RAG pipelines die when vector search slows down. At 100M+ embeddings, approximate nearest neighbor recall slips and your LLM answers from the wrong chunks.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Set corpus size, query, top-K, latency budget. Classical HNSW-style search vs amplitude-amplification retrieval proxy — recall and latency on the same chart.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "Classical HNSW approximate search sets recall and latency baselines at large corpus scale. hello_quantum runs a Grover-style amplitude amplification proxy via PennyLane similarity circuits, reporting fewer vectors examined at higher recall@K.",
    libraries: ["PennyLane", "hello_quantum"],
    innovation:
      "Recall@K and vectors-touched metrics tied to a real query string — closer to a production SLA discussion than a toy cosine demo.",
    analogy: "Parallel shelf check vs walking every aisle with a flashlight.",
    classicalApproach: "ANN search — recall drops as index grows.",
    quantumApproach: "Amplification proxy — better recall, fewer vectors touched in demo.",
    whatYouGet: [
      "Recall@K comparison",
      "Latency (ms)",
      "Vectors examined",
      "Similarity circuit context",
    ],
    fieldHelp: [
      { name: "corpus_vectors", plain: "Embeddings in the knowledge base." },
      { name: "query_text", plain: "Question the RAG pipeline must answer." },
      { name: "top_k", plain: "Chunks passed to the LLM." },
      { name: "latency_budget_ms", plain: "SLA ceiling for search." },
    ],
  },
  genomics_protein_folding: {
    tagline: "Fold a protein when there's no PDB template to copy.",
    problemTitle: "The situation",
    problemPlain:
      "Homology modeling needs a similar structure in a database. Novel mutations and orphan proteins often have none — so clinicians are stuck waiting for lab work with no structural hint.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Enter protein, organism, sequence length. VQE folding proxy vs homology when you mark 'no template' — RMSD and energy on the comparison.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "Classical homology modeling (MODELLER-style) fails or degrades without a PDB template. hello_quantum runs a VQE energy-minimization proxy on a PennyLane path, reporting RMSD, folding energy, and shot histograms.",
    libraries: ["PennyLane", "hello_quantum"],
    innovation:
      "Clinical variant context next to folding metrics — useful for explaining why template-free methods matter.",
    analogy: "Building the 3D puzzle with no picture on the box.",
    classicalApproach: "Homology — needs PDB neighbor, fails on novel cases.",
    quantumApproach: "VQE energy minimization — no template required in the demo.",
    whatYouGet: [
      "RMSD (Å) comparison",
      "Folding energy",
      "Confidence scores",
      "VQE histogram",
    ],
    fieldHelp: [
      { name: "protein_name", plain: "Protein or variant label." },
      { name: "has_pdb_template", plain: "Whether a PDB neighbor exists." },
      { name: "disease_context", plain: "Clinical reason you need the fold." },
      { name: "sequence_length", plain: "Amino acid count." },
    ],
  },
  crypto_pqc_wallet_hardening: {
    tagline: "Move wallet keys off ECDSA before Shor's algorithm shows up.",
    problemTitle: "The situation",
    problemPlain:
      "Ethereum-style wallets use ECDSA. Public keys and signatures are on-chain forever. Patient attackers archive chain data now because breaking ECC later unlocks past balances.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Enter wallet, chain, holdings. Same NIST vault stack as the account app — ML-KEM, AES-GCM, ML-DSA — framed for wallet migration timelines.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "account_vault_encrypt seals wallet metadata with ML-KEM-768 and ML-DSA-65 through kyber-py and dilithium-py, same NISTAccountVault stack as cloud_api_entropy. ECDSA on-chain exposure is scored against the hardened key package.",
    libraries: ["kyber-py", "dilithium-py", "account_vault_encrypt"],
    innovation:
      "Holdings-at-risk and HNDL acknowledgment on the same screen as the key package — how wallet teams actually prioritize migration.",
    analogy: "Changing the lock before someone mass-produces the master pick.",
    classicalApproach: "ECDSA on-chain — Shor-vulnerable, archive-friendly.",
    quantumApproach: "ML-KEM + ML-DSA vault packaging in the demo.",
    whatYouGet: [
      "PQC key package preview",
      "ECDSA risk summary",
      "Holdings USD at risk",
      "Migration timeline",
    ],
    fieldHelp: [
      { name: "wallet_address", plain: "Address to harden." },
      { name: "signature_scheme", plain: "Current scheme (usually ECDSA)." },
      { name: "holdings_usd", plain: "Value at risk in the scenario." },
      { name: "hndl_risk_acknowledged", plain: "Confirm harvest-now-decrypt-later awareness." },
    ],
  },
  smart_city_traffic_flow: {
    tagline: "Coordinate traffic lights instead of running fixed timers.",
    problemTitle: "The situation",
    problemPlain:
      "Most cities time signals from plans written years ago. One congested intersection backs up the metro. Drivers lose tens of hours a year; idling cars dump CO₂.",
    solutionTitle: "What you run here",
    solutionPlain:
      "Enter metro, intersection count, peak traffic, goal (time vs emissions vs throughput). Fixed-timing baseline vs coordinated optimization proxy with commute and CO₂ deltas.",
    technicalTitle: "Under the hood",
    technicalPlain:
      "Fixed-timing baseline models static signal plans with no network coordination. route_optimizer applies nearest-neighbor TSP heuristics as a QAOA proxy to reorder intersection phases across the metro grid.",
    libraries: ["route_optimizer", "QAOA proxy"],
    innovation:
      "City-scale intersection count in the inputs — the demo feels like a traffic engineer's worksheet, not a four-light toy.",
    analogy: "One conductor vs thousands of musicians reading their own tempo.",
    classicalApproach: "Fixed plans — no network coordination.",
    quantumApproach: "Coordinated phases — shorter commutes in demo metrics.",
    whatYouGet: [
      "Commute time change",
      "Peak CO₂ comparison",
      "Throughput uplift",
      "Heatmap / route visual",
    ],
    fieldHelp: [
      { name: "intersection_count", plain: "Signalized intersections modeled." },
      { name: "peak_vehicles_per_hour", plain: "Rush-hour volume." },
      { name: "optimize_for", plain: "Time, emissions, or throughput." },
      { name: "av_fleet_pct", plain: "Share of autonomous vehicles." },
    ],
  },
};

export function getUseCaseExplanation(id: string): UseCaseExplanation | null {
  const base = USE_CASE_EXPLANATIONS[id];
  if (!base) return null;
  const detail = USE_CASE_DETAILED[id];
  return detail ? { ...base, ...detail } : base;
}
