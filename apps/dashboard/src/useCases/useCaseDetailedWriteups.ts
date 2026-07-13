import type { AnalyzeFlowStep } from "./useCaseExplanations";

export type UseCaseDetailed = {
  audience: string;
  realWorldContext: string;
  problemDeep: string;
  solutionDeep: string;
  userSteps: string[];
  analyzeFlow: AnalyzeFlowStep[];
  classicalDeep: string;
  quantumDeep: string;
  technicalDeep: string;
  outputsDeep: string[];
  limitations: string[];
};

export const USE_CASE_DETAILED: Record<string, UseCaseDetailed> = {
  fintech_portfolio_rebalance: {
    audience:
      "Portfolio managers, fintech analysts, and quant researchers who need to explain allocation decisions to investment committees without running a separate optimization stack.",
    realWorldContext:
      "Asset managers rebalance quarterly or monthly across dozens of holdings. A $2.5M tech sleeve split across five large-cap names sounds simple until you account for volatility differences and correlation. Most teams still default to equal weighting because building a custom optimizer pipeline takes weeks. QuantumOS packages the same agent-driven flow used in research labs into a guided wizard that runs locally with zero cloud spend.",
    problemDeep:
      "You have $2.5M to deploy across AAPL, MSFT, NVDA, GOOGL, and AMZN under a medium risk mandate. Equal weighting puts 20% in each ticker regardless of how volatile NVDA is versus GOOGL. A spreadsheet can compute one split, but comparing thousands of weight combinations by hand is impractical — with five assets there are continuous weight choices, and even discretized grids explode quickly. Risk-adjusted metrics like Sharpe ratio require return and volatility estimates per asset, then a search over feasible allocations. Teams without a quant desk often ship 1/N because the tooling gap is too wide.",
    solutionDeep:
      "QuantumOS walks you from fund inputs through a classical equal-weight baseline, then runs the portfolio_optimizer skill with risk-adjusted heuristics. The Analyze view compares Sharpe ratio, expected return, and volatility side by side. If you run the full workflow, SecurityPolicyAgent checks constraints, OptimizationAgent plans the job, BackendSelectionAgent picks a local provider, portfolio_optimizer computes weights, and ExplanationAgent narrates the result. Dollar allocations per ticker, pie-chart weights, and a written pipeline summary land on one results screen.",
    userSteps: [
      "Understand: Read the scenario — you are rebalancing a $2.5M tech portfolio and want something smarter than equal slices.",
      "Inputs: Enter fund name, budget ($2.5M default), tickers, risk level (low/medium/high), and optional ESG screen flag.",
      "Review: Confirm assets, budget, and risk profile match your mandate before spending compute.",
      "Analyze: Click Optimize — the app validates inputs, runs equal-weight baseline, then portfolio_optimizer, and computes Sharpe uplift.",
      "Compare: Review expected return, volatility, Sharpe ratio, and search-space metrics on the comparison chart.",
      "Pipeline: Optionally run the full portfolio_quantum_pipeline workflow to see SecurityPolicyAgent through ExplanationAgent steps live.",
      "Results: Export pie chart, per-ticker dollar amounts, and the ExplanationAgent narrative for your memo.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We check that your fund name, budget, tickers, and risk level are present and sensible before any math runs. Missing tickers or a zero budget stop here with a clear error instead of a nonsense allocation.",
        technical:
          "The analyze endpoint parses payload assets, budget, and risk from the dashboard form and validates against bundledUseCaseSchemas defaults. Invalid or empty asset lists short-circuit before comparison.py calls _synthetic_metrics or portfolio_run.",
      },
      {
        phase: "classical",
        layman:
          "We compute what happens if you split money evenly — the lazy 1/N baseline every spreadsheet defaults to. You get expected return, volatility, and Sharpe for that equal-weight split so you have a fair reference point.",
        technical:
          "analyze_portfolio builds eq_w = 1/n weights, aggregates _synthetic_metrics per asset, and records classical Sharpe. Output includes allocation dollars per ticker under the equal_weight method with no optimizer involved.",
      },
      {
        phase: "quantum",
        layman:
          "We run the risk-aware optimizer that searches a much larger space of weight combinations than you could try manually. It returns a new split tuned to your risk setting with expected return and volatility attached.",
        technical:
          "portfolio_optimizer skill handler runs with assets, budget, and risk; _weights_for_risk applies heuristics and returns expected_annual_return, portfolio_volatility, and method label. BackendSelectionAgent may route to classical_local or Qiskit Aer when allow_cloud_quantum is true.",
      },
      {
        phase: "compare",
        layman:
          "We put classical and optimized numbers on the same chart so you see Sharpe uplift, return delta, and how many combinations each path effectively explored. The headline tells you the risk-adjusted improvement in plain language.",
        technical:
          "comparison.py emits _metric rows for return, volatility, sharpe, and search space (n vs 2^min(n,12)). Primary delta_pct drives the headline; quantum_advantage_points list documents agent pipeline and return spread.",
      },
      {
        phase: "pipeline",
        layman:
          "If you run the full workflow, five agents execute in order — policy, plan, backend pick, optimize, explain — and you watch each step complete on a timeline. This mirrors how production QuantumOS jobs are orchestrated, not just the quick Analyze shortcut.",
        technical:
          "WorkflowOrchestrator._portfolio_pipeline runs SecurityPolicyAgent, OptimizationAgent, BackendSelectionAgent, JobExecutor(portfolio_optimizer), and ExplanationAgent. Steps persist in workflow result with final_job_id and recommendation string from BackendSelectionAgent.",
      },
    ],
    classicalDeep:
      "The classical path is deliberate simplicity: equal weight across every ticker in your list. Returns and volatilities come from synthetic per-asset metrics embedded in the portfolio_optimizer skill — consistent demo data, not live market feeds. Allocation dollars are budget × (1/n). Sharpe is return divided by volatility with no covariance-aware optimization. Search space is reported as n discrete equal splits, underscoring how little exploration 1/N actually performs. This baseline is what many real desks ship when rebalance tooling is missing.",
    quantumDeep:
      "The quantum-inspired path calls portfolio_optimizer with risk-adjusted weight heuristics (_weights_for_risk) that concentrate or diversify based on your low/medium/high setting. Expected return and volatility are recomputed on the optimized weights. When BackendSelectionAgent selects a quantum-capable provider, the same skill interface can target QAOA-style circuit proxies via PennyLane or Qiskit Aer — though the default demo stays local at zero cost. Search space is reported up to 2^min(n,12) combinations, illustrating why optimizers beat manual grids even before fault-tolerant hardware.",
    technicalDeep:
      "Stack: comparison.analyze_portfolio → skills/portfolio_optimizer/handler.py → agents/orchestrator.py for portfolio_quantum_pipeline. Agents: SecurityPolicyAgent (constraint gate), OptimizationAgent (job plan), BackendSelectionAgent (provider router), ExplanationAgent (narrative). Libraries: PennyLane and Qiskit Aer when installed; classical_local fallback. Dashboard merges USE_CASE_DETAILED with USE_CASE_EXPLANATIONS via getUseCaseExplanation. Job mode uses skill=portfolio_optimizer; workflow mode uses workflow=portfolio_quantum_pipeline.",
    outputsDeep: [
      "Per-ticker weight percentages after optimization versus equal-weight baseline, suitable for pie-chart rendering.",
      "Dollar allocation per asset computed as weight × budget (e.g., $2.5M spread across five names).",
      "Expected annual return and portfolio volatility for both classical and optimized paths.",
      "Sharpe ratio comparison with delta percentage driving the comparison headline.",
      "Search-space metric showing classical n combos vs quantum-inspired 2^min(n,12) exploration count.",
      "Full quantum optimizer output object including method string (risk_adjusted_heuristic) and raw weights map.",
      "Workflow timeline steps when portfolio_quantum_pipeline runs: policy, optimization plan, backend choice, job result, explanation.",
      "ExplanationAgent plain-language summary suitable for pasting into investment committee notes.",
    ],
    limitations: [
      "Returns and volatilities are synthetic demo metrics, not live Bloomberg or Refinitiv feeds.",
      "No transaction costs, tax lots, or regulatory position limits are modeled — weights ignore real-world constraints.",
      "Quantum backend execution requires optional SDK installs; default runs use classical_local heuristics at zero cloud cost.",
      "Five-asset demo scale — production portfolios with hundreds of names need different solvers and data pipelines.",
    ],
  },

  logistics_delivery_routes: {
    audience:
      "Last-mile logistics planners, fleet dispatchers, and supply-chain students evaluating route optimization without standing up a full TMS integration.",
    realWorldContext:
      "Urban delivery fleets run hundreds of routes daily from a central depot. Stop order is often whatever the ERP exported — warehouse first, then addresses in upload sequence. Fuel prices near $1.45/L and driver overtime make extra kilometers expensive. Quantum annealing and QAOA research targets traveling-salesperson problems exactly like this, but most ops teams only need a clear before/after on distance and fuel.",
    problemDeep:
      "Your driver starts at Warehouse Hub and must hit eight stops — Downtown Office, Airport Cargo, North Mall, University, Hospital, Industrial Park, Suburb Depot — then return. The order in your CSV is rarely optimal; eight stops means 40,320 possible permutations (7! for the loop). Driving the input order might cover 45 km while a better ordering covers 32 km. At $1.45/L and ~8 L/100 km, that gap is real money per run, multiplied across dozens of drivers. Manual reordering does not scale past a handful of stops.",
    solutionDeep:
      "QuantumOS keeps your uploaded stop order as the classical baseline and measures total km, fuel cost, and drive time. The route_optimizer skill builds a haversine-style distance matrix and runs nearest-neighbor TSP heuristics to produce a reordered route with per-leg breakdown. Analyze compares distance saved, fuel dollars, and minutes. Results show numbered stops, km between legs, and percent improvement — the same API surface production would use for QAOA or annealing backends.",
    userSteps: [
      "Understand: You have eight urban delivery stops from one depot — the goal is less driving, not just a map picture.",
      "Inputs: List depot plus stops (comma or line separated), set fuel price per liter, priority (cost/time/balance/emissions), and return-to-start flag.",
      "Review: Verify the first stop is your warehouse and all eight names appear before optimization.",
      "Analyze: Run route optimization — validate stops, measure input-order distance, run route_optimizer, compute savings.",
      "Compare: Read total km, fuel cost, and drive time classical vs optimized on the comparison chart.",
      "Results: Inspect numbered route legs with km per segment and headline percent distance reduction.",
      "Optional: Toggle CO₂ reporting flag to include emissions context in the narrative output.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We confirm you have at least two stops, a depot at the start, and numeric fuel price before building any distance matrix. Empty or single-stop lists fail fast with a readable validation message.",
        technical:
          "analyze_route parses stops array or comma string, normalizes return_to_start, and calls _distance_matrix from route_optimizer handler. Payload fleet_name and priority pass through to comparison narrative.",
      },
      {
        phase: "classical",
        layman:
          "We measure what happens if the driver follows your list exactly — the order the stops were typed or imported. Total kilometers, estimated fuel cost, and drive time are calculated for that fixed path.",
        technical:
          "Classical order copies stops list; if return_to_start, appends depot terminus. _route_total sums dist matrix edges for classical_order; fuel uses distance × fuel_price × 0.08 heuristic; time assumes 40 km/h average.",
      },
      {
        phase: "quantum",
        layman:
          "We reorder stops using a route optimizer that greedily picks the nearest unvisited location — a practical TSP heuristic that often beats input order by double-digit percent. You get a new sequence and per-leg distances.",
        technical:
          "route_optimizer skill run() builds distance matrix, executes _nearest_neighbor from depot, returns ordered_stops, total_distance_km, legs array, and method nearest_neighbor. Labeled quantum/QAOA-style in comparison output for backend swap compatibility.",
      },
      {
        phase: "compare",
        layman:
          "We subtract optimized distance from your original route and express savings as percent, fuel dollars, and minutes. The headline states km saved in language a dispatcher can repeat on a standup call.",
        technical:
          "Metrics: distance, fuel, time via _metric with higher_is_better false for cost/distance. primary delta on distance drives headline; narrative includes fleet name, stop count, priority, and fuel price from payload.",
      },
      {
        phase: "pipeline",
        layman:
          "We assemble the full route report — ordered stops, leg table, method labels, and advantage bullets — so you can screenshot or export one coherent job output rather than raw JSON fragments.",
        technical:
          "Job mode executes skill=route_optimizer, job_type=optimization via use_cases/runner.py. Final result bundles quantum.output with classical.output under comparison.comparison for FeatureResultView route timeline rendering.",
      },
    ],
    classicalDeep:
      "Classical baseline is intentionally naive: visit stops strictly in input order, optionally closing the loop back to depot. Distances come from the route_optimizer internal matrix — deterministic pseudo-geographic spacing for demo, not GPS routing engine results. Fuel cost applies a fixed liters-per-km factor (0.08 × distance × price). Drive time divides distance by 40 km/h. This mirrors how many fleets actually operate when TMS optimization is disabled or when drivers follow manifest sequence.",
    quantumDeep:
      "The optimized path uses nearest-neighbor TSP from the depot: repeatedly visit the closest unvisited stop until all are covered, then return if configured. Total distance is recomputed on the reordered list. The comparison layer labels this 'Quantum / QAOA-style routing' because the route_optimizer skill shares the same job interface used for QAOA or quantum annealing backends in production deployments. Per-leg km breakdown is included in quantum output for timeline UI. Savings typically appear as 10–25% distance reduction on eight-stop urban demos.",
    technicalDeep:
      "Skills: route_optimizer (handler.py: _distance_matrix, _nearest_neighbor, run). comparison.analyze_route orchestrates classical vs skill output. Provider: classical_local default; Qiskit Aer path available via provider router. Dashboard phases from useCaseActions.ts: validate → classical → quantum → compare → pipeline. No workflow agents — single job skill execution. CO₂ and priority fields adjust narrative strings only in demo metrics.",
    outputsDeep: [
      "Numbered ordered_stops list after optimization with depot return if return_to_start is true.",
      "Per-leg distance table in kilometers between consecutive stops in the optimized route.",
      "Total route distance for both classical input-order and optimized paths.",
      "Estimated fuel cost in USD derived from distance × fuel_price_per_liter × consumption factor.",
      "Estimated drive time in minutes assuming 40 km/h average urban speed.",
      "Percent distance reduction headline and absolute km saved figure.",
      "Method labels: input_order (classical) vs nearest_neighbor (quantum-labeled) for audit trail.",
      "Quantum advantage bullet list citing API compatibility with annealing/QAOA backends and reorder count.",
    ],
    limitations: [
      "Distance matrix is synthetic/demo — not Google Maps, OSRM, or live traffic.",
      "Nearest-neighbor is a heuristic, not proven optimal; eight stops are small enough that exact TSP would differ slightly.",
      "No time windows, vehicle capacity, or driver shift constraints — pure distance TSP only.",
      "QAOA/annealing backends are not invoked in default zero-cost local runs; label is interface-ready, not hardware execution.",
    ],
  },

  bank_legacy_crypto_audit: {
    audience:
      "Bank compliance officers, payment-gateway engineers, and security architects planning post-quantum migration before regulatory deadlines.",
    realWorldContext:
      "Payment HSM integrations still ship RSA-2048 signing, MD5 digests, and PKCS#1 v1.5 padding in production codebases. NIST and PCI timelines push ML-KEM and ML-DSA adoption through 2030. Internal audits often start with grep for 'RSA' — which finds strings but not structured severity, sample PQC ciphertext, or policy framing executives expect in workshop decks.",
    problemDeep:
      "Your synthetic gateway snippet imports RSA, MD5, SHA1, and PKCS1_v1_5 — patterns that fail a post-quantum readiness review. Line-by-line grep might count six matches but cannot rank severity, show a mock ML-KEM encrypt of a sample payload, or tie findings to PCI-DSS language. Migration teams need a structured finding list (line, algorithm, severity), a demonstration that PQC libraries can wrap a payload, and a SecurityPolicyAgent pass on data classification — all in one run.",
    solutionDeep:
      "QuantumOS loads your code, runs a regex classical baseline, then crypto_migration_scan for structured findings. The crypto_migration_assessment workflow adds CryptoMigrationAgent analysis, pqc_encryptor mock demo, and SecurityPolicyAgent restricted-data check. Compare scores migration readiness: keyword grep vs full scan plus encrypt step. Results include severity badges, sample ciphertext preview, framework label, and executive recommendation text.",
    userSteps: [
      "Understand: You are auditing legacy payment code for algorithms that quantum computers or regulators will deprecate.",
      "Inputs: Paste institution name, Python gateway/HSM source, target PQC algorithm (e.g., ML-KEM-768), and compliance framework (PCI-DSS, etc.).",
      "Review: Skim the bundled default snippet or your paste — confirm it represents the integration you need assessed.",
      "Analyze: Run audit — keyword scan baseline, crypto_migration_scan skill, readiness score, mock PQC encrypt.",
      "Compare: See structured findings vs flat grep counts and migration readiness delta on the chart.",
      "Pipeline: Execute crypto_migration_assessment workflow for CryptoMigrationAgent → scan job → pqc_encryptor → SecurityPolicyAgent timeline.",
      "Results: Export findings table, mock ciphertext preview, risk level, and recommendation string for workshop slides.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We load your source snippet and confirm institution metadata and framework labels are present. Empty code stops here — there is nothing to scan.",
        technical:
          "Payload code string and institution_name parsed from form; default LEGACY_PAYMENT_CODE from bundledUseCaseSchemas used when blank. Task passed to analyze_crypto_migration in comparison.py.",
      },
      {
        phase: "classical",
        layman:
          "We run a simple keyword scan — looking for RSA, MD5, SHA-1, and ECDSA strings line by line. You get a flat finding count without severity structure or migration guidance.",
        technical:
          "_classical_crypto_scan applies regex patterns RSA|PKCS1|MD5|SHA1|ECDSA per line; assigns high/medium severity; returns finding_count and risk label critical/high/low based on match density only.",
      },
      {
        phase: "quantum",
        layman:
          "We run the full migration scan skill that returns structured JSON findings plus context for remediation. A mock PQC encrypt step wraps a sample payload so you can show stakeholders what ciphertext looks like after migration.",
        technical:
          "crypto_migration_scan skill handler runs on code snippet; crypto_migration_assessment workflow invokes CryptoMigrationAgent, JobExecutor(crypto_migration_scan), JobExecutor(pqc_encryptor) with demo payload. NISTAccountVault helpers referenced in skill output.",
      },
      {
        phase: "compare",
        layman:
          "We score how much more actionable the structured audit is versus grep — finding detail, encrypt demo presence, and overall migration readiness index on one chart.",
        technical:
          "comparison metrics contrast classical finding_count vs skill finding structures, adds pqc_demo flag and readiness score; headline references delta on structured finding coverage and policy context.",
      },
      {
        phase: "pipeline",
        layman:
          "The full workflow runs four orchestrated steps — agent scan, skill scan, mock encrypt, policy check — with a written recommendation about ML-KEM/ML-DSA migration and current risk level.",
        technical:
          "WorkflowOrchestrator._migration_assessment: CryptoMigrationAgent → crypto_migration_scan job → pqc_encryptor job → SecurityPolicyAgent with restricted classification; WorkflowResult recommendation includes mig.plan risk_level.",
      },
    ],
    classicalDeep:
      "Classical baseline is regex over source lines: patterns for RSA, MD5, SHA-1, ECDSA without AST parsing or data-flow analysis. Each hit becomes a finding with line number and coarse severity. Risk aggregates to critical if three or more hits, else high or low. No encrypt demo, no framework mapping, no agent narrative — deliberately weak to highlight why structured scans matter. This mimics what a hurried grep audit produces before a proper SAST or migration workshop.",
    quantumDeep:
      "The PQC path uses crypto_migration_scan skill output with structured findings (algorithm, line, severity, remediation hints in demo form) plus CryptoMigrationAgent plan with risk_level. pqc_encryptor job produces mock ML-KEM/ML-DSA ciphertext preview — educational, not production HSM integration. SecurityPolicyAgent validates restricted-data handling with allow_cloud_quantum false. Together they model the workshop flow: scan → demonstrate PQC wrap → policy sign-off → executive recommendation citing ML-KEM / ML-DSA.",
    technicalDeep:
      "Workflow: crypto_migration_assessment. Skills: crypto_migration_scan, pqc_encryptor. Agents: CryptoMigrationAgent, SecurityPolicyAgent. Libraries: cryptography stack, NISTAccountVault in security/crypto/nist_account_vault.py. comparison.analyze_crypto_migration coordinates classical regex vs skill paths. Dashboard bundled schema includes LEGACY_PAYMENT_CODE default snippet for instant demo.",
    outputsDeep: [
      "Line-by-line findings array with algorithm name (RSA, MD5, etc.) and severity badge per hit.",
      "Classical vs structured finding count comparison with readiness score uplift metric.",
      "CryptoMigrationAgent risk_level summary (e.g., critical when RSA+MD5 co-occur).",
      "Mock PQC ciphertext preview from pqc_encryptor job output — base64 or hex snippet for slides.",
      "Target PQC algorithm label (ML-KEM-768) and compliance framework string from inputs.",
      "SecurityPolicyAgent policy verdict on restricted-data constraints.",
      "Workflow recommendation text: migrate asymmetric crypto to ML-KEM/ML-DSA when liboqs enabled.",
      "Executive narrative suitable for audit trail — scan completed, encrypt demo non-production disclaimer.",
    ],
    limitations: [
      "Regex and skill scans are pattern-based — no full static analysis or taint tracking across modules.",
      "pqc_encryptor output is mock/educational — not wired to your actual HSM or payment gateway.",
      "Sample code is synthetic Python — Java, COBOL, or HSM config formats need different scanners.",
      "Policy agent uses demo classification rules — not your bank's actual InfoSec policy engine.",
    ],
  },

  telecom_qkd_link_planning: {
    audience:
      "Telecom network engineers, QKD vendor presales teams, and cryptography researchers estimating metropolitan fiber link budgets before hardware purchase.",
    realWorldContext:
      "Quantum key distribution sells on physics-backed tamper evidence — not on math assumptions alone. Metro fiber pilots at 20–50 km must hit target key rates (kbps) for VPN or encryptor feedstock. Vendors quote boxes; engineers need sifted key length and QBER on *their* distance and bit budget. BB84 remains the teaching and planning standard for discrete-variable QKD.",
    problemDeep:
      "You plan a ~40 km fiber link between two carrier PoPs and need roughly 1 kbps of sifted key for a pilot. Classical pre-shared keys (PSK) require secure courier or manual provisioning and offer no physics-based eavesdrop alarm. BB84 generates raw quantum bits, publicly compares bases, discards mismatches, and samples a subset to estimate quantum bit error rate (QBER). At 40 km loss, raw 4096 bits might sift to ~2000 with QBER near 2–5% — if QBER exceeds threshold, the link is unsafe. Sales slides rarely run your numbers.",
    solutionDeep:
      "Enter carrier name, endpoints, link_distance_km (~40), raw bits (4096), sample_check size, and target_key_rate_kbps. QuantumOS simulates BB84 via bb84_simulator: Alice/Bob basis choices, sifting, QBER estimate, sifted key preview. Classical side models static PSK with no tamper detection. Analyze compares security index and effective key material. Results table shows raw vs sifted counts, QBER percentage, and key hex preview for customer calls.",
    userSteps: [
      "Understand: You are sanity-checking whether a BB84 QKD link meets your key-rate target over real fiber km — before capex.",
      "Inputs: Set link_distance_km (40 default), bits (4096), sample_check (16), target_key_rate_kbps, carrier and endpoint names.",
      "Review: Confirm distance and bit budget match your engineering worksheet or vendor RFP.",
      "Analyze: Validate parameters → classical PSK estimate → bb84_simulator run → security uplift score.",
      "Compare: Read QBER, sifted key length, and security index vs classical PSK on comparison chart.",
      "Results: Copy sifted key preview snippet and QBER for slide deck or customer email.",
      "Note: Simulation is educational — not connected to ID Quantique or Toshiba hardware.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We check fiber distance, raw bit count, and sample size are positive numbers before starting the BB84 simulation. Absurd values (zero bits) are rejected before any quantum randomness runs.",
        technical:
          "analyze_qkd parses link_distance_km, bits, sample_check from payload; defaults 4096 bits and 40 km from catalog input. Validates sample_check ≤ bits for QBER estimation branch.",
      },
      {
        phase: "classical",
        layman:
          "We model classical pre-shared key delivery — keys installed out-of-band with no way to detect an in-fiber eavesdropper from physics alone. You get a nominal key length but zero tamper-evidence score.",
        technical:
          "Classical branch returns PSK baseline: effective_key_bits = bits (no sifting loss), qber = 0, security_index low, method classical_psk, no bb84_simulator invocation.",
      },
      {
        phase: "quantum",
        layman:
          "We simulate BB84 — random bases, measurement, public basis reconciliation, and error sampling on a subset of bits. Distance increases loss and QBER; you see how many bits survive sifting.",
        technical:
          "bb84_simulator skill run() models Alice/Bob basis arrays, sifting mask, QBER from sample_check revealed bits, distance-dependent error model; returns sifted_key_length, qber_pct, key_preview hex.",
      },
      {
        phase: "compare",
        layman:
          "We contrast tamper-evident sifted key rate and QBER against the classical story so you can argue security uplift in a customer workshop — even if absolute kbps still needs hardware validation.",
        technical:
          "Metrics include sifted bits, QBER, security_index delta; narrative references target_key_rate_kbps from payload and link_distance_km loss scaling from skill.",
      },
      {
        phase: "pipeline",
        layman:
          "We bundle the link report — protocol steps, statistics table, key preview, classical comparison — into one job result you can screenshot for presales.",
        technical:
          "Job mode skill=bb84_simulator, job_type=qkd_simulation via runner.py; output feeds FeatureResultView QKD table and comparison.comparison block for QuantumComparisonView.",
      },
    ],
    classicalDeep:
      "Classical PSK baseline assumes keys are delivered securely by courier or key ceremony with full bit count preserved — no sifting loss, zero QBER, but also zero eavesdrop detection from quantum mechanics. Security index in the demo is intentionally low to reflect 'trust the courier' threat model. No link-distance penalty applies because PSK math ignores fiber loss. This is the comparison anchor telecom slides use when contrasting 'math secrecy' vs 'physics secrecy'.",
    quantumDeep:
      "BB84 simulation generates random raw bits and random bases for Alice and Bob, simulates measurement outcomes, publicly compares bases, keeps matching positions, and reveals sample_check bits to estimate QBER. Link distance scales photon loss and error probability in the skill handler. Sifted key length is typically ~50% of raw for unbiased bases minus additional loss from distance. Key preview shows truncated hex of sifted material. QBER above demo threshold flags link as marginal — educational, not ITU-T compliant certification.",
    technicalDeep:
      "Skill: bb84_simulator (skills/bb84_simulator/handler.py). comparison.analyze_qkd orchestrates classical PSK vs bb84_run. No workflow agents — single job. Input schema: bits, sample_check, link_distance_km from use_cases/input_schemas.py. Dashboard fieldHelp covers target_key_rate_kbps for business case context. Pure Python simulation — no QuTiP or hardware SDK.",
    outputsDeep: [
      "Raw bit count (e.g., 4096) vs sifted key length after basis reconciliation.",
      "QBER percentage estimated from sample_check revealed bits.",
      "Truncated sifted key preview (hex snippet) safe for screenshots — not production key material.",
      "Matching-basis statistics and protocol step summary (Alice generate, Bob measure, sift, estimate QBER).",
      "Security index comparison: BB84 tamper-evidence vs classical PSK score.",
      "Link distance km and target key rate kbps echoed in narrative for RFP traceability.",
      "Classical output block labeled classical_psk with zero tamper detection flags.",
      "Quantum advantage bullets: physics-backed eavesdrop alarm, distance-dependent loss modeling.",
    ],
    limitations: [
      "Software simulation only — not certified QKD hardware or ITU-T compliance testing.",
      "Loss and QBER models are simplified — real deployments need device-specific calibrations.",
      "No finite-key security analysis or privacy amplification accounting.",
      "Does not model multiplexing, trusted nodes, or satellite QKD architectures.",
    ],
  },

  cloud_api_entropy: {
    audience:
      "CISOs, identity platform engineers, and DevSecOps teams migrating session binding and account storage to NIST post-quantum algorithms under CNSA 2.0 guidance.",
    realWorldContext:
      "Enterprise identity gateways still seal sessions with RSA-2048 and PRNG nonces. NIST finalized ML-KEM (FIPS 203) and ML-DSA (FIPS 204) in 2024. Harvest-now-decrypt-later adversaries archive ciphertext today. Zero-trust platforms need demonstrable hybrid vaults — QRNG nonce, KEM encapsulation, AEAD payload, signature — before hardware security modules catch up.",
    problemDeep:
      "Account records bound with RSA and predictable randomness fail two threats: Shor's algorithm breaks RSA public keys on future quantum hardware, and weak nonces enable session replay analysis. A $0 demo must still show real algorithm names — ML-KEM-768, AES-256-GCM, ML-DSA-65 — wired to kyber-py and dilithium-py, not fake base64. Teams need side-by-side comparison: RSA+seeded PRNG vs QRNG+KEM+AEAD+signature on the same account_email and tenant_id.",
    solutionDeep:
      "Step 1: qrng_demo generates a quantum-random session nonce with entropy spectrum. Step 2: account_vault_encrypt wraps the account record via NISTAccountVault — ML-KEM-768 encapsulation, AES-256-GCM encryption, ML-DSA-65 signature. Classical path models RSA-2048 binding with deterministic PRNG. Analyze scores quantum attack resistance. Results show algorithm stack list, KEM ciphertext preview, signature preview, and entropy chart.",
    userSteps: [
      "Understand: You are sealing a user account with NIST PQC so the binding survives both classical and quantum adversary models.",
      "Inputs: Enter account_email, tenant_id, gateway_name, pqc_kem (ML-KEM-768), pqc_signature (ML-DSA-65), compliance tag (CNSA 2.0).",
      "Review: Confirm tenant and purpose fields match your zero-trust identity model.",
      "Analyze: Validate identity → RSA baseline → QRNG nonce + account_vault_encrypt → resistance score.",
      "Compare: Review algorithm stack, ciphertext previews, and quantum vs classical vulnerability labels.",
      "Results: Inspect entropy spectrum for session nonce and full vault package JSON structure.",
      "Export: Copy algorithm list and ciphertext previews for architecture review boards.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We verify account email, tenant ID, and PQC algorithm selections are present before touching any cryptographic libraries. Missing tenant_id would produce an incomplete vault record.",
        technical:
          "analyze_account_vault parses account_email, tenant_id, gateway_name, bytes (nonce length default 32); validates against bundledUseCaseSchemas cloud_api_entropy default_input.",
      },
      {
        phase: "classical",
        layman:
          "We model how the same account would be stored with RSA-2048 and a predictable pseudo-random nonce — the pattern most gateways use today and that Shor's algorithm eventually breaks.",
        technical:
          "Classical branch uses NISTAccountVault comparison baseline: RSA-2048 binding simulation with seeded PRNG nonce; _byte_entropy on deterministic bytes; flags quantum_vulnerable true on asymmetric leg.",
      },
      {
        phase: "quantum",
        layman:
          "We draw a session nonce from qrng_demo random bytes, then seal the account with ML-KEM key encapsulation, AES-GCM encryption, and ML-DSA signature — the hybrid pattern NIST recommends.",
        technical:
          "qrng_run generates nonce; account_vault_run invokes NISTAccountVault with kyber-py ML-KEM-768 and dilithium-py ML-DSA-65; returns kem_ciphertext, encrypted_payload, signature, algorithm_stack array.",
      },
      {
        phase: "compare",
        layman:
          "We score how much stronger the vault package is against quantum attack models — highlighting lattice KEM vs RSA and QRNG entropy vs PRNG.",
        technical:
          "Metrics: entropy bits, algorithm count, quantum_resistance_score; comparison narrative lists FIPS 203/204 labels and CNSA 2.0 hybrid pattern references from vault output.",
      },
      {
        phase: "pipeline",
        layman:
          "We assemble the sealed vault package — nonce spectrum, full algorithm stack, ciphertext previews — as one exportable job result for security architecture reviews.",
        technical:
          "JobExecutor skill=account_vault_encrypt, job_type=post_quantum_crypto; qrng_demo may run as nested step in comparison.analyze_account_vault before vault seal.",
      },
    ],
    classicalDeep:
      "Classical baseline binds account metadata with RSA-2048 public-key semantics and a PRNG seeded nonce — low byte entropy visible in the spectrum chart. Vulnerability flags mark Shor-capable break of RSA and lack of NIST PQC algorithms. No ML-KEM or ML-DSA present. This mirrors typical OAuth session sealing before PQC migration projects. Entropy chart shows predictable patterns compared to QRNG output.",
    quantumDeep:
      "Quantum-safe path runs qrng_demo for session nonce bytes with _byte_entropy analysis, then account_vault_encrypt using NISTAccountVault: ML-KEM-768 encapsulates shared secret, AES-256-GCM encrypts canonical account JSON, ML-DSA-65 signs the record. kyber-py and dilithium-py provide real lattice operations in demo scale. Output includes kem_ciphertext and signature hex previews truncated for UI. Resistant to Shor on the KEM/SIG layer; symmetric AES remains secure with adequate key material from KEM.",
    technicalDeep:
      "Skills: qrng_demo, account_vault_encrypt. Module: security/crypto/nist_account_vault.py (NISTAccountVault). Libraries: kyber-py (ML-KEM-768), dilithium-py (ML-DSA-65), cryptography AES-GCM. comparison.analyze_account_vault sequences classical baseline, qrng_run, account_vault_run. Job mode only — no workflow agents. Tests in tests/test_account_vault.py validate catalog integration.",
    outputsDeep: [
      "QRNG session nonce byte array with entropy spectrum visualization data for dashboard chart.",
      "Algorithm stack ordered list: QRNG → ML-KEM-768 → AES-256-GCM → ML-DSA-65.",
      "ML-KEM ciphertext preview (truncated hex) from encapsulation step.",
      "AES-GCM encrypted payload preview of account binding JSON.",
      "ML-DSA-65 signature preview over canonical record bytes.",
      "Classical RSA baseline block with quantum_vulnerable flags and PRNG entropy score.",
      "Quantum resistance comparison score and delta vs classical binding.",
      "Tenant_id, account_email, gateway_name, compliance label echoed in vault metadata for audit.",
    ],
    limitations: [
      "Demo-scale keys — not integrated with your production HSM or cloud KMS.",
      "kyber-py/dilithium-py builds may differ from final FIPS-certified module deployments.",
      "No key rotation, escrow, or multi-tenant KMS partitioning modeled.",
      "QRNG is software random unless external QRNG hardware provider configured.",
    ],
  },

  automotive_battery_chemistry: {
    audience:
      "Automotive battery R&D engineers, materials scientists, and quantum chemistry learners exploring how circuit simulators proxy cathode electron correlation before full VQE deployments.",
    realWorldContext:
      "EV OEMs spend billions optimizing NMC, LFP, and solid-state cathodes. Mean-field Hartree-Fock models run overnight on HPC but miss electron correlation that drives voltage fade and thermal runaway risk. National labs target variational quantum eigensolvers (VQE) on small active spaces first — validating qubit encodings with Bell-state and entanglement tests on 2–4 qubits before scaling Hamiltonians.",
    problemDeep:
      "Your cathode program targets NMC811 at 250 Wh/kg but mean-field approximations misestimate magnetic observables and correlation energy. Full ab initio VQE needs dozens of qubits — unavailable on today's hardware. Teams start with minimal entangled circuits (2 qubits, 2048 shots) to validate simulators, gate decomposition, and measurement statistics before trusting larger ansätze. Without a inspectable circuit output, program managers only see a fidelity number buried in a PDF.",
    solutionDeep:
      "Pick material (NMC/LFP/solid-state), cell format, qubits (2–4), and shots (2048). QuantumOS runs hello_quantum Bell-state preparation on Qiskit Aer or PennyLane, compares fidelity to Hartree-Fock mean-field baseline, and returns gate list plus measurement histogram. Analyze walks validate → mean-field → circuit → fidelity compare → shot aggregation. Results show H, CNOT, measure sequence and |00⟩/|11⟩ counts you can inspect in a review meeting.",
    userSteps: [
      "Understand: You are running a minimal quantum circuit proxy for cathode electron behavior — a stepping stone toward full VQE, not production cell sign-off.",
      "Inputs: Set material family, target energy density Wh/kg, qubits (2 default), shots (2048), cell format label.",
      "Review: Confirm qubit count matches your simulator budget and material label matches program codename.",
      "Analyze: Load parameters → mean-field baseline → hello_quantum circuit → fidelity uplift → histogram aggregation.",
      "Compare: Read fidelity vs mean-field and measurement distribution on comparison chart.",
      "Results: Inspect gate-by-gate circuit breakdown and shot histogram (00 vs 11 populations).",
      "Context: Use output to explain to managers why entanglement tests precede full Hamiltonian VQE on PennyLane.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We confirm material label, qubit count (2–4 demo range), and shot count are valid integers before compiling any circuit. Zero qubits or zero shots stop with a clear validation error.",
        technical:
          "analyze_battery parses material, qubits, shots from payload; defaults qubits=2, shots=2048 from catalog. Validates qubits ≤ 4 for demo circuit width in hello_quantum handler.",
      },
      {
        phase: "classical",
        layman:
          "We compute a mean-field (Hartree-Fock style) baseline fidelity — fast but missing electron correlation that quantum circuits aim to capture. This is the number your legacy materials pipeline would trust.",
        technical:
          "Classical branch returns mean_field fidelity estimate ~0.72 demo constant, method hartree_fock_proxy, no circuit execution; serves as comparison anchor in comparison.analyze_battery.",
      },
      {
        phase: "quantum",
        layman:
          "We build and run a small entangled circuit — Hadamard plus CNOT Bell pair — on a simulator for your chosen shots. You get real gate list and measurement counts back.",
        technical:
          "hello_quantum skill run() prepares Bell state, executes on provider router default qiskit_aer or pennylane_default_qubit; returns gates array, counts histogram, fidelity vs mean-field.",
      },
      {
        phase: "compare",
        layman:
          "We show fidelity improvement over mean-field and explain in plain language why entanglement sampling matters for cathode modeling programs.",
        technical:
          "Metrics: fidelity delta, counts distribution skew; narrative references material, target_energy_density, PennyLane VQE path as production extension.",
      },
      {
        phase: "pipeline",
        layman:
          "We aggregate all measurement shots into a final histogram and package material metadata with circuit output for your R&D log.",
        technical:
          "Job mode skill=hello_quantum, job_type=circuit_simulation; result feeds FeatureResultView circuit panel and ScenarioVisuals battery thumb.",
      },
    ],
    classicalDeep:
      "Mean-field baseline uses a fixed Hartree-Fock proxy fidelity (~0.72 in demo) without running a quantum circuit. It represents fast DFT or HF calculations that automotive teams run today — scalable but missing dynamic correlation. No gate list or shot noise. Material and target_energy_density labels pass through for report context only. This is intentionally pessimistic on correlation-sensitive observables to highlight why quantum methods attract R&D funding.",
    quantumDeep:
      "hello_quantum constructs |Φ+⟩ Bell pair: H on qubit 0, CNOT(0,1), measure both. Shots aggregate into |00⟩ and |11⟩ counts (ideally ~50/50 for ideal simulator). Reported fidelity exceeds mean-field baseline in demo metrics. Same skill path extends toward PennyLane VQE on cathode Hamiltonians when qubits and ansatz depth increase. Provider histogram is inspectable — not a black-box scalar.",
    technicalDeep:
      "Skill: hello_quantum (skills/hello_quantum/handler.py). Libraries: Qiskit Aer, PennyLane when installed. comparison.analyze_battery orchestrates classical HF vs hello_quantum_run. No workflow — single job. PennyLane noted as VQE extension in USE_CASE_EXPLANATIONS libraries array. Input: material, qubits, shots from catalog default NMC 2-qubit 2048 shots.",
    outputsDeep: [
      "Gate list sequence: Hadamard, CNOT, Measure on qubits 0 and 1.",
      "Measurement histogram counts for |00⟩ and |11⟩ states across all shots.",
      "Fidelity metric classical mean-field vs quantum circuit comparison with delta percentage.",
      "Material label (NMC, LFP, solid-state) and target energy density echoed in result metadata.",
      "Qubit count and shot count used for reproducibility in lab notebooks.",
      "Provider name selected by router (qiskit_aer, pennylane_default_qubit, etc.).",
      "Method strings: hartree_fock_proxy vs bell_state_circuit for audit trail.",
      "Quantum advantage bullets referencing path toward PennyLane VQE on cathode Hamiltonians.",
    ],
    limitations: [
      "2–4 qubit Bell demo — not a real NMC811 Hamiltonian or electrolyte model.",
      "Fidelity comparison uses demo constants — not DFT-validated correlation energies.",
      "No thermal effects, SEI growth, or cycle-life degradation modeled.",
      "Requires optional Qiskit/PennyLane install; mock provider returns simplified counts if missing.",
    ],
  },

  research_simulator_benchmark: {
    audience:
      "Quantum platform engineers, university lab PIs, and R&D teams picking between Qiskit, PennyLane, and cloud simulators before production commitment.",
    realWorldContext:
      "Labs evaluating quantum SDKs re-run the same 2-qubit notebook on Qiskit Aer, PennyLane, TensorFlow Quantum, cuQuantum, Azure Quantum, and IBM Quantum — manually copying results into spreadsheets. Timing differs, shot aggregation varies, and agreement is rarely documented. A single workflow that hits every installed provider and recommends BackendSelectionAgent choice saves a week of glue scripts.",
    problemDeep:
      "Your lab needs apples-to-apples comparison: identical 2-qubit circuit, 512 shots, same entanglement pattern — across every SDK you might buy. One provider returning skewed counts indicates install misconfiguration or version drift. Without cross-check, you pick a stack on marketing slides and discover simulator mismatch in month two. Cost ceiling ($0 default) must keep cloud backends off unless credentials exist.",
    solutionDeep:
      "Configure lab_name, circuit_type, qubits (2), shots (512), noise_model (ideal/noisy). research_benchmark workflow loops providers: qiskit_aer, pennylane_default_qubit, mock_provider, classical_local — each running hello_quantum via JobExecutor. BackendSelectionAgent posts recommendation after benchmarks complete. Analyze compares classical-only vs multi-provider agreement score. Timeline shows per-provider pass/fail and result preview.",
    userSteps: [
      "Understand: You are benchmarking which quantum simulator SDK agrees on the same workload before standardizing your lab stack.",
      "Inputs: Set lab name, qubits, shots, noise model, cost ceiling USD (0 for local-only).",
      "Review: Confirm 2-qubit 512-shot workload matches your internal benchmark spec.",
      "Analyze: Configure workload → classical_local baseline → multi-provider hello_quantum runs → agreement score.",
      "Compare: Read per-backend result previews and fidelity/agreement metrics.",
      "Pipeline: Run research_benchmark workflow to see full JobExecutor loop and BackendSelectionAgent recommendation.",
      "Results: Export benchmark table and recommended provider string for procurement memo.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We lock qubit count, shot count, and noise model before firing any backend jobs — changing mid-run would invalidate comparison. Invalid qubits (<1) are rejected immediately.",
        technical:
          "Task qubits and shots parsed in analyze_benchmark; workflow task defaults qubits=2, shots=512 from catalog. cost_ceiling_usd and noise_model pass to provider constraints.",
      },
      {
        phase: "classical",
        layman:
          "We run the workload on a classical-only fallback so you have a deterministic baseline when no quantum SDK is installed. This shows what mock mode looks like on a laptop with zero dependencies.",
        technical:
          "classical_local provider executes hello_quantum or comparison classical branch first; returns deterministic counts for agreement denominator.",
      },
      {
        phase: "quantum",
        layman:
          "We run the identical circuit on every installed SDK — Qiskit Aer, PennyLane, mock, and others if drivers exist. Each backend reports its own histogram preview.",
        technical:
          "research_benchmark WorkflowOrchestrator loops providers list; _run_job hello_quantum per provider; benchmarks array collects state, result_preview truncated 120 chars.",
      },
      {
        phase: "compare",
        layman:
          "We score how closely backends agree on measurement outcomes — high agreement means your stack is consistent; divergence flags a provider to debug before production.",
        technical:
          "Agreement score computed across benchmark result previews; metrics include provider pass count, failed installs; narrative lists which SDKs responded COMPLETED.",
      },
      {
        phase: "pipeline",
        layman:
          "BackendSelectionAgent reads all benchmark results and writes a recommendation — which provider to standardize on for cost-zero circuit simulation in your lab.",
        technical:
          "BackendSelectionAgent invoked post-loop with job_type circuit_simulation; WorkflowResult final_result.benchmarks array and recommendation from backend.plan reason field.",
      },
    ],
    classicalDeep:
      "Classical_local baseline executes deterministic simulation without quantum SDK dependencies — useful on CI machines or laptops missing Qiskit. Counts are predictable and serve as fallback when Aer/PennyLane not installed. No cross-provider timing in classical-only path. Represents 'lowest common denominator' simulators some teams accidentally ship when SDK install fails silently.",
    quantumDeep:
      "Multi-provider loop runs same hello_quantum payload on qiskit_aer, pennylane_default_qubit, mock_provider, classical_local sequentially. Each JobExecutor step appends to workflow timeline. Failed providers mark step failed but continue loop. Result previews truncated for UI. BackendSelectionAgent recommends best fit given max_cost_usd=0 and allow_cloud_quantum=false — typically qiskit_aer or pennylane when installed.",
    technicalDeep:
      "Workflow: research_benchmark in agents/orchestrator.py._research_benchmark. Skill: hello_quantum per provider. Agent: BackendSelectionAgent post-benchmark. ProviderRegistry probes installed SDKs. Libraries: Qiskit Aer, PennyLane, TensorFlow Quantum, NVIDIA cuQuantum, Azure Quantum, IBM Quantum when credentials present. comparison.analyze_benchmark for Analyze shortcut. Tests: test_workflows.py research_benchmark.",
    outputsDeep: [
      "Per-provider benchmark row: provider name, job state COMPLETED/FAILED, result preview string.",
      "Workflow timeline steps — one JobExecutor entry per provider attempted.",
      "Agreement score across providers that completed successfully.",
      "Classical_local baseline histogram for fallback comparison.",
      "BackendSelectionAgent recommended_provider string and reason text.",
      "Qubits, shots, noise_model echoed in final_result metadata.",
      "Lab_name label on report header for multi-team shared installs.",
      "CSV export toggle data fields when enabled in dashboard (if configured in schema).",
    ],
    limitations: [
      "2-qubit Bell workload only — not representative of production VQE or QAOA depth.",
      "Cloud providers (IBM, Azure) skipped unless credentials and cost ceiling allow.",
      "No wall-clock timing benchmarks in all comparison paths — focus on outcome agreement.",
      "TensorFlow Quantum and cuQuantum require optional heavy installs often absent on laptops.",
    ],
  },

  insurance_fraud_feature_probe: {
    audience:
      "Insurance data scientists, fraud analytics leads, and security-conscious ML engineers who must gate quantum experiments on feature-store code containing legacy crypto.",
    realWorldContext:
      "P&C insurers run gradient boosting and neural nets on feature stores fed by claims, geospatial, and third-party data. Those pipelines often embed RSA key imports and MD5 hashing from copy-pasted utility modules. Running quantum classifiers on sensitive features without a crypto scan violates internal policy and triggers audit findings. Hybrid quantum fraud research is active — but only after compliance gates pass.",
    problemDeep:
      "Your feature_store_key = RSA.import_key(pem) and score_hash = MD5.new(features) snippet is typical of legacy ETL. Direct inference would train on non-compliant code paths. Insurance ML teams need: crypto scan → severity findings → SecurityPolicyAgent approve/block → hello_quantum simulation only if cleared → ExplanationAgent audit narrative. Skipping the gate is how SOC2 tickets get opened.",
    solutionDeep:
      "Paste insurer name, feature-store code, PII level (high/medium/low), block_on_critical_crypto flag. secure_circuit_pipeline workflow runs CryptoMigrationAgent when code present, CircuitGenerationAgent plans qubits, SecurityPolicyAgent gates execution, BackendSelectionAgent picks simulator, hello_quantum runs if approved, ExplanationAgent narrates. Analyze compares insecure direct inference vs gated secure pipeline with security uplift score.",
    userSteps: [
      "Understand: You are proving fraud-scoring code is crypto-clean before any quantum circuit touches sensitive features.",
      "Inputs: Enter insurer name, paste feature-store Python, set PII level, toggle block_on_critical_crypto.",
      "Review: Confirm code snippet matches the module your data science team actually deploys.",
      "Analyze: Load code → direct inference baseline → secure_circuit_pipeline → security uplift score.",
      "Compare: See crypto findings count and approve/block verdict vs ungated path.",
      "Pipeline: Watch CryptoMigrationAgent → CircuitGenerationAgent → SecurityPolicyAgent → hello_quantum → ExplanationAgent timeline.",
      "Results: Export findings, policy verdict, circuit histogram, and auditor explanation text.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We load your feature-store code and PII level before any agent runs. Empty code may skip crypto scan but still runs circuit with defaults — you choose whether that matches your policy.",
        technical:
          "Task code, qubits=2, shots=1024, constraints max_cost_usd=0 from catalog; pii_level and block_on_critical_crypto parsed for policy agent context.",
      },
      {
        phase: "classical",
        layman:
          "We model what happens if you ran ML inference directly — no crypto scan, no policy gate, immediate model execution. This is the risky path most notebooks take.",
        technical:
          "Classical direct inference baseline: zero findings enforced, policy bypass flag, security_score low; represents analyze_insurance classical branch without crypto_migration_scan.",
      },
      {
        phase: "quantum",
        layman:
          "We run the secure pipeline — scan code for RSA/MD5, design a small circuit, wait for policy approval, then simulate only if allowed.",
        technical:
          "secure_circuit_pipeline: CryptoMigrationAgent on code → CircuitGenerationAgent → SecurityPolicyAgent allowed check → BackendSelectionAgent → JobExecutor hello_quantum; REJECTED if policy fails.",
      },
      {
        phase: "compare",
        layman:
          "We score security uplift — structured findings, block capability, and gated execution vs direct inference — so auditors see the control difference.",
        technical:
          "Metrics: finding_count, policy_allowed boolean, security_index delta; comparison references secure_circuit_pipeline output block in comparison.py analyze_insurance.",
      },
      {
        phase: "pipeline",
        layman:
          "ExplanationAgent writes plain-language summary of whether the run was approved, what crypto was found, and what the circuit measured — ready for audit trail PDF.",
        technical:
          "ExplanationAgent step final in _secure_circuit_pipeline; output includes qubits, shots, pipeline secure_circuit_pipeline label in job result.",
      },
    ],
    classicalDeep:
      "Direct inference baseline assumes feature code executes without crypto review — security score minimized, finding count treated as zero for comparison purposes. Represents notebooks that jump straight to model.fit on raw feature pipelines. No CircuitGenerationAgent or policy gate. Deliberately unsafe narrative for contrast. PII level ignored in classical path to show what happens when compliance is skipped.",
    quantumDeep:
      "Secure path executes full secure_circuit_pipeline: CryptoMigrationAgent risk on RSA/MD5 snippet, CircuitGenerationAgent 2-qubit plan, SecurityPolicyAgent enforces constraints and block_on_critical_crypto, BackendSelectionAgent selects qiskit_aer default, hello_quantum runs 1024 shots if allowed. Blocked runs return REJECTED workflow status with failed SecurityPolicyAgent step. Approved runs include measurement counts for fraud-feature proxy demo.",
    technicalDeep:
      "Workflow: secure_circuit_pipeline. Agents: CryptoMigrationAgent, CircuitGenerationAgent, SecurityPolicyAgent, BackendSelectionAgent, ExplanationAgent. Skills: crypto_migration_scan (via migration agent plan), hello_quantum. comparison.analyze_insurance. Default code: RSA.import_key + MD5 feature hash from catalog task. Tests: test_workflows.py secure_circuit_pipeline.",
    outputsDeep: [
      "Crypto findings list from CryptoMigrationAgent with algorithm and severity per line.",
      "Policy verdict allowed/blocked with SecurityPolicyAgent plan JSON.",
      "CircuitGenerationAgent qubit plan and circuit_description string.",
      "hello_quantum measurement counts when execution approved (1024 shots default).",
      "Security uplift score classical direct vs gated pipeline comparison metric.",
      "ExplanationAgent narrative for auditor consumption.",
      "Workflow status COMPLETED vs REJECTED with step timeline.",
      "PII level and block_on_critical_crypto echo in report metadata.",
    ],
    limitations: [
      "Crypto scan is pattern-based on pasted snippet — not full feature store repo scan.",
      "hello_quantum circuit is fraud proxy demo — not trained QML classifier on claims data.",
      "Policy rules are demo SecurityPolicyAgent logic — not your insurer's GRC system.",
      "No actual PII processing — synthetic code sample only.",
    ],
  },

  pharma_molecular_binding: {
    audience:
      "Computational chemists, medicinal chemistry leads, and biotech CTOs comparing force-field docking to VQE binding proxies on lead optimization programs.",
    realWorldContext:
      "Pharma R&D spends $2B+ per approved drug; early binding affinity mistakes send teams down multi-year dead ends. MM/GBSA and AutoDock-style force fields ignore quantum electron correlation in protein-ligand pockets. Pfizer, Roche, and national lab consortia fund VQE experiments on small active spaces while hardware catches up. Teams need side-by-side kcal/mol and confidence labels on the same compound in discovery meetings.",
    problemDeep:
      "Your KRAS G12C inhibitor candidate against KRAS G12C target reports -8.2 kcal/mol from MM/GBSA — but force fields treat electrons classically and miss polarization in the binding pocket. Wrong affinity by 1–2 kcal/mol can mis-rank an entire SAR series. VQE on even a 4-qubit ansatz proxy explores more correlation-aware conformations in the demo narrative. Medicinal chemists need both numbers on one screen with confidence comparison, not separate PDFs from two vendors.",
    solutionDeep:
      "Enter compound_name, target_protein, vqe_iterations, basis_set label, qubits (4), shots (4096). Analyze runs MM/GBSA classical baseline then hello_quantum VQE proxy circuit with shot histogram. Compare binding affinity kcal/mol and confidence uplift. Results include conformation search space context, method labels, and measurement distribution for the variational ansatz demo.",
    userSteps: [
      "Understand: You are comparing classical force-field docking to a VQE-style quantum binding proxy on one compound-target pair.",
      "Inputs: Set compound name, protein target, VQE iterations, basis set, qubits, shots.",
      "Review: Confirm target matches your current lead optimization program (default KRAS G12C).",
      "Analyze: Load compound → MM/GBSA baseline → VQE hello_quantum → confidence uplift → chemistry report.",
      "Compare: Read binding affinity kcal/mol classical vs quantum and confidence delta.",
      "Results: Inspect shot histogram and conformation search space metric on comparison chart.",
      "Context: Use confidence labels to explain why quantum chemistry pilots follow force-field triage.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We verify compound name, protein target, and qubit settings before running any chemistry estimate. Missing target name stops the run — binding needs a receptor context.",
        technical:
          "analyze_pharma parses compound_name, target_protein, qubits, shots, vqe_iterations; defaults KRAS G12C inhibitor from catalog input_schemas.",
      },
      {
        phase: "classical",
        layman:
          "We estimate binding affinity using MM/GBSA force-field heuristics — the fast method every medchem team runs first. Confidence is lower because electron correlation is ignored.",
        technical:
          "Classical MM/GBSA branch returns binding_kcal_mol ~-8.2 demo, confidence 0.62, method mm_gbsa, conformation_search_count low; no hello_quantum call.",
      },
      {
        phase: "quantum",
        layman:
          "We run a variational quantum eigensolver proxy — a small entangled circuit standing in for pocket correlation — and report affinity with higher stated confidence in the demo metrics.",
        technical:
          "hello_quantum skill with qubits=4, shots=4096 as VQE proxy; comparison labels method vqe_proxy; returns counts histogram and improved confidence ~0.82 in demo.",
      },
      {
        phase: "compare",
        layman:
          "We place both affinity estimates and confidence scores on one chart so medchem can discuss whether the quantum number changes go/no-go on the series.",
        technical:
          "Metrics: binding_kcal_mol, confidence, conformation_search_space; delta_pct on confidence as primary headline in analyze_pharma.",
      },
      {
        phase: "pipeline",
        layman:
          "We assemble the chemistry report — compound, target, both methods, histogram — for discovery meeting slides.",
        technical:
          "Job mode skill=hello_quantum, job_type=quantum_chemistry; FeatureResultView renders binding comparison for pharma_molecular_binding id.",
      },
    ],
    classicalDeep:
      "MM/GBSA baseline applies molecular mechanics with generalized Born surface area implicit solvent — O(n) fast, widely trusted for ranking similar ligands, weak on charge transfer and polarization. Demo returns fixed affinity and confidence 0.62. Conformation search count limited. No quantum circuit executed. Represents Schrödinger Glide or OpenEye docking pipelines in approximate terms.",
    quantumDeep:
      "VQE proxy uses hello_quantum entangled ansatz on 4 qubits with 4096 shots — not a full protein Hamiltonian. Demo reports tighter binding estimate and confidence 0.82 with expanded conformation search narrative (100× vs classical in marketing metrics). PennyLane path noted as production extension for real active-space Hamiltonians. Histogram shows measurement distribution from variational loop proxy.",
    technicalDeep:
      "Skill: hello_quantum (VQE proxy). comparison.analyze_pharma. Libraries: PennyLane cited for production VQE. Job type quantum_chemistry. No workflow agents. Input: compound_name, target_protein, qubits, shots from catalog. USE_CASE_EXPLANATIONS libraries: PennyLane, hello_quantum.",
    outputsDeep: [
      "Binding affinity kcal/mol classical MM/GBSA vs quantum VQE proxy side by side.",
      "Confidence scores (0–1 scale) for each method with delta percentage headline.",
      "Conformation search space comparison count (classical low vs quantum expanded demo).",
      "hello_quantum measurement histogram from VQE proxy shots.",
      "Compound name and target protein labels on all output blocks.",
      "VQE iterations and basis_set echo from form inputs for notebook reproducibility.",
      "Method strings mm_gbsa vs vqe_proxy for regulatory computational evidence logs.",
      "Quantum advantage bullets on correlation capture and conformation exploration.",
    ],
    limitations: [
      "4-qubit Bell/VQE proxy — not molecular Hamiltonian for KRAS G12C pocket.",
      "Affinity numbers are demo synthetic — not validated against wet-lab IC50.",
      "No protein structure PDB loading or ligand pose preparation pipeline.",
      "PennyLane VQE on real chemistry Hamiltonians not executed in default job.",
    ],
  },

  energy_grid_quantum_dispatch: {
    audience:
      "ISO/RTO planners, utility dispatch operators, and energy transition strategists optimizing renewable-heavy grids where greedy merit-order wastes wind and solar.",
    realWorldContext:
      "PJM, ERCOT, and CAISO operators rebalance every 5–15 minutes as wind ramps and clouds move. Merit-order 'cheapest unit first' curtail renewables because it cannot see global unit commitment across four regions. NREL and Oak Ridge research quantum and quantum-inspired dispatch for 80%+ renewable scenarios. Demo uses 4.2 GW peak, 68% renewable mix — realistic shape, synthetic cost curves.",
    problemDeep:
      "Your grid faces 4.2 GW peak demand with 68% renewable mix across four regions. Greedy merit-order dispatches peaker gas first when wind dips locally, curtailing cheap wind in adjacent zones — raising cost index and CO₂ intensity. Classical solvers struggle with combinatorial unit commitment at scale. You need cost, carbon, and renewable utilization on one comparison chart with per-region dispatch weights, not a single scalar LCOE.",
    solutionDeep:
      "Configure grid_operator (PJM default), peak_demand_mw, renewable_mix_pct, n1_contingency flag, regions. Classical merit-order greedy dispatch sets baseline cost and carbon. portfolio_optimizer skill reuses risk-adjusted weighting heuristics as quantum-inspired unit commitment proxy across generation regions. Analyze compares cost index, CO₂ intensity, renewable utilization, and regional weights.",
    userSteps: [
      "Understand: You are optimizing dispatch across renewable-heavy regions vs turning on peakers too early.",
      "Inputs: Set grid operator name, peak demand MW, renewable mix %, N-1 contingency flag, region count context.",
      "Review: Confirm peak demand and renewable share match your scenario (4.2 GW / 68% defaults).",
      "Analyze: Load grid params → merit-order baseline → portfolio_optimizer dispatch → cost & carbon savings.",
      "Compare: Read cost index, CO₂, renewable utilization classical vs quantum-inspired on chart.",
      "Results: Inspect per-region dispatch weights and curtailment reduction narrative.",
      "Context: Explain to executives why quantum-inspired commit beats greedy when renewables dominate.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We check grid operator name, peak demand, and renewable percentage are valid numbers before dispatch math runs. Zero peak demand would mean nothing to optimize.",
        technical:
          "analyze_grid parses grid_operator, peak_demand_mw, renewable_mix_pct, n1_contingency; portfolio_run payload constructed with region asset labels from comparison helper.",
      },
      {
        phase: "classical",
        layman:
          "We simulate greedy merit-order dispatch — always pick the cheapest available unit locally, which often wastes renewable energy in the demo scenario.",
        technical:
          "Merit-order baseline computes cost_index, co2_intensity, renewable_utilization ~0.71 demo; method merit_order_greedy; regional weights uniform or peaker-heavy.",
      },
      {
        phase: "quantum",
        layman:
          "We run a quantum-inspired unit commitment optimizer that balances regions together — reducing curtailment and lowering cost index in the demo metrics.",
        technical:
          "portfolio_optimizer skill reused with grid-themed assets; _weights_for_risk maps to regional dispatch weights; method risk_adjusted_heuristic labeled unit commitment proxy.",
      },
      {
        phase: "compare",
        layman:
          "We chart cost, carbon, and renewable utilization side by side so operators see whether global optimization beats local greed in your scenario.",
        technical:
          "Metrics: cost_index, co2_intensity, renewable_utilization; primary delta on cost or renewable util; narrative names grid_operator and peak_demand_mw.",
      },
      {
        phase: "pipeline",
        layman:
          "We build the dispatch report with regional weight breakdown and advantage bullets for grid research presentations.",
        technical:
          "Job mode skill=portfolio_optimizer, job_type=optimization; FeatureResultView shared with fintech portfolio chart types for energy_grid_quantum_dispatch id.",
      },
    ],
    classicalDeep:
      "Merit-order greedy dispatch activates generators from lowest marginal cost upward until demand met — ignores inter-regional transfers and startup costs. Demo shows higher cost index, higher CO₂ intensity, lower renewable utilization (~71%). Regional weights reflect local peaker preference. N-1 contingency flag adjusts narrative only in demo. Matches how many SCED approximations behave before full MIP unit commitment.",
    quantumDeep:
      "portfolio_optimizer reuses finance weight heuristics as multi-region dispatch proxy — risk_adjusted spread across solar, wind, hydro, peaker labels. Demo improves renewable utilization and lowers cost index vs greedy. Not a power flow or OPF solver — combinatorial dispatch narrative only. Same skill interface as portfolio rebalance enables code reuse in QuantumOS comparison engine.",
    technicalDeep:
      "Skill: portfolio_optimizer (shared with fintech). comparison.analyze_grid maps grid inputs to portfolio payload. Provider: classical_local. No workflow agents. FeatureResultView treats energy_grid like portfolio for chart rendering. Input from catalog: PJM, 4200 MW peak, 68% renewable.",
    outputsDeep: [
      "Cost index classical merit-order vs quantum-inspired dispatch comparison.",
      "CO₂ intensity metric with delta percentage (lower is better).",
      "Renewable utilization percentage both paths with uplift headline.",
      "Per-region dispatch weights map (solar, wind, hydro, peaker regions).",
      "Grid operator name and peak demand MW in report header.",
      "N-1 contingency flag status in narrative when enabled.",
      "Method labels merit_order_greedy vs risk_adjusted_unit_commitment.",
      "Quantum advantage bullets on curtailment reduction and global commit.",
    ],
    limitations: [
      "Not a real OPF or FERC-compliant market simulation — demo cost curves only.",
      "portfolio_optimizer finance heuristics stand in for true unit commitment MIP.",
      "No transmission constraints, ramp rates, or reserve product modeling.",
      "Regional assets are synthetic labels — not actual PJM unit IDs.",
    ],
  },

  finance_quantum_monte_carlo: {
    audience:
      "Quantitative analysts, CRO office staff, and regulatory risk teams estimating VaR99 for Basel III and FRTB reporting who want to see QAE vs classical MC on the same book.",
    realWorldContext:
      "Global rates and FX desks run overnight Monte Carlo on $500M+ notionals. Classical paths need 10,000+ simulations for stable 99th percentile tails — noisy for complex derivatives. JPMorgan, Goldman Sachs, and ECB research teams publish quantum amplitude estimation (QAE) speedups for tail probabilities. Labs need VaR, effective paths, and wall time on one dashboard before building custom Jupyter pipelines.",
    problemDeep:
      "Your Global Rates & FX book carries $500M notional with 10-day horizon. Classical Monte Carlo with 10,000 paths produces VaR99 that wobbles run-to-run on fat tails. Risk committees wait hours for numbers regulators expect daily. QAE promises quadratic speedup in effective sample count — but quant teams need identical book inputs compared side-by-side: same notional, same horizon, different sampling strategy. Demo uses portfolio_optimizer as QAE proxy with qae_qubits configuration.",
    solutionDeep:
      "Enter trading_book, notional_usd ($500M default), simulation_paths (10000), qae_qubits, horizon. Classical MC draws random paths proportional to simulation_paths. Quantum path uses PennyLane amplitude-estimation proxy via portfolio_optimizer reuse reporting higher effective path coverage at lower wall time. Analyze compares VaR99 USD, effective paths, runtime, with Basel/FRTB context labels.",
    userSteps: [
      "Understand: You are comparing tail risk (VaR99) estimation via classical Monte Carlo vs quantum amplitude estimation proxy.",
      "Inputs: Set trading book name, notional USD, simulation paths, QAE qubits, horizon days.",
      "Review: Confirm notional and path count match your internal risk engine settings.",
      "Analyze: Load book → classical MC → QAE proxy → VaR precision compare → risk report.",
      "Compare: Read VaR99 classical vs quantum, effective paths, and runtime on chart.",
      "Results: Export Basel/FRTB context labels and advantage bullets for quant committee.",
      "Note: QAE proxy uses portfolio_optimizer demo path — not production trading system integration.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We verify trading book name, notional, and simulation path count before running either MC or QAE. Zero notional or zero paths stop with validation error.",
        technical:
          "analyze_monte_carlo parses trading_book, notional_usd, simulation_paths, qae_qubits; defaults $500M and 10000 paths from catalog.",
      },
      {
        phase: "classical",
        layman:
          "We run classical Monte Carlo with your specified path count — thousands of random scenarios — and compute VaR99 from the empirical tail. Slow tails stay noisy in the demo.",
        technical:
          "Classical branch draws simulation_paths proportional VaR99 ~ demo USD, effective_paths = simulation_paths, runtime_ms high; method classical_monte_carlo.",
      },
      {
        phase: "quantum",
        layman:
          "We run a quantum amplitude estimation proxy that reports equivalent tail accuracy with fewer wall-clock seconds and higher effective path count in demo metrics.",
        technical:
          "portfolio_optimizer skill invoked as QAE proxy; PennyLane amplitude estimation referenced; effective_paths ~320k demo, runtime_ms lower, method qae_proxy.",
      },
      {
        phase: "compare",
        layman:
          "We put VaR99, effective paths, and runtime side by side so risk quants can discuss whether QAE research is worth pilot budget on this book shape.",
        technical:
          "Metrics: var99_usd, effective_paths, runtime_ms; primary delta on effective_paths or var stability; narrative includes Basel III / FRTB labels.",
      },
      {
        phase: "pipeline",
        layman:
          "We assemble the risk report with book metadata, both VaR numbers, and research-track bullets citing Goldman/JPM QAE patterns.",
        technical:
          "Job mode skill=portfolio_optimizer, job_type=optimization; comparison.analyze_monte_carlo output feeds FeatureResultView finance metrics.",
      },
    ],
    classicalDeep:
      "Classical Monte Carlo generates simulation_paths (default 10,000) independent scenarios, takes 99th percentile loss as VaR99. Effective paths equal raw path count. Runtime scales linearly with paths in demo metrics. Tail noise remains visible for fat-tailed books. Represents overnight batch jobs on grid compute that CRO teams run today.",
    quantumDeep:
      "QAE proxy via portfolio_optimizer reports higher effective_paths (~320k demo) at lower runtime_ms than classical 10k paths — illustrating quadratic sampling advantage narrative. PennyLane amplitude estimation cited as production path. Not true QAE circuit on fault-tolerant hardware — heuristic proxy sharing optimizer skill code with grid dispatch and portfolio apps.",
    technicalDeep:
      "Skill: portfolio_optimizer (QAE proxy reuse). comparison.analyze_monte_carlo. Libraries: PennyLane for amplitude estimation reference. Job type optimization. No workflow. Input: trading_book, notional_usd, simulation_paths from catalog.",
    outputsDeep: [
      "VaR99 USD classical Monte Carlo vs quantum QAE proxy comparison.",
      "Effective scenario path counts for each method with delta headline.",
      "Wall-clock runtime milliseconds comparison (demo synthetic timing).",
      "Trading book name and notional USD in report header.",
      "Simulation_paths and qae_qubits configuration echo for reproducibility.",
      "Basel III and FRTB context label strings in narrative.",
      "Method labels classical_monte_carlo vs qae_proxy.",
      "Quantum advantage bullets on tail precision and research-track alignment.",
    ],
    limitations: [
      "Not connected to production risk engine or historical P&L feeds.",
      "QAE is portfolio_optimizer heuristic — not certified QAE implementation.",
      "VaR numbers are demo synthetic — not validated against desk official risk.",
      "No correlation matrix, volatility surface, or greek sensitivity modeling.",
    ],
  },

  semiconductor_yield_quantum: {
    audience:
      "Fab yield engineers, VP operations at advanced-node pilots, and inline metrology teams detecting overlay defects before wafer scrap at N3 and below.",
    realWorldContext:
      "A single 300mm N3 wafer batch can exceed $500K. Statistical process control charts often flag overlay errors after lithography damage is done. IBM and TSMC research partnerships explore quantum kernel methods on high-dimensional metrology vectors for sub-10ms inline detection. Demo uses TSMC N3 Pilot Line defaults with hello_quantum as quantum-kernel anomaly proxy.",
    problemDeep:
      "Your N3 pilot targets 92% yield but classical SPC/PCA lags — defects surface at end-of-line when wafers are already committed. Inline metrology generates high-dimensional overlay vectors where subtle shifts precede yield collapse. Classical PCA misses nonlinear boundaries. Quantum kernel feature maps (demo: 3-qubit entangled circuit, 8192 shots) claim lower defect PPM and ~8ms detection latency in comparison metrics — useful for explaining research ROI to fab leadership.",
    solutionDeep:
      "Set fab_name, process_node (N3), wafer_size (300mm), target_yield_pct, inline_metrology flag, qubits (3), shots (8192). Classical SPC/PCA baseline sets yield and defect PPM. hello_quantum runs entangled feature-map circuit as quantum-kernel anomaly proxy. Compare yield %, defect PPM, detection latency ms, and circuit histogram.",
    userSteps: [
      "Understand: You are comparing lagging SPC charts to a quantum-kernel inline anomaly detector proxy on advanced-node fab data shapes.",
      "Inputs: Enter fab name, process node, wafer size, target yield %, inline metrology toggle, qubits, shots.",
      "Review: Confirm node (N3) and yield target match your pilot line KPIs.",
      "Analyze: Load fab params → SPC baseline → quantum kernel circuit → yield projection → yield report.",
      "Compare: Read yield %, defect PPM, detection latency classical vs quantum on chart.",
      "Results: Inspect hello_quantum histogram and latency metric for inline metrology story.",
      "Context: Frame as research pattern — not replacement for ASML or KLA inline tools.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We confirm fab name, process node, and target yield are set before running detection models. Missing node label makes the report useless for fab comparisons.",
        technical:
          "analyze_semiconductor parses fab_name, process_node, target_yield_pct, qubits, shots; defaults TSMC N3 Pilot Line from catalog.",
      },
      {
        phase: "classical",
        layman:
          "We run classical SPC/PCA baseline — the charts fabs use today that often detect problems only after yield is already lost.",
        technical:
          "Classical SPC branch: yield_pct ~85 demo, defect_ppm high, detection_latency_ms ~120; method spc_pca_baseline.",
      },
      {
        phase: "quantum",
        layman:
          "We run a quantum-kernel detector proxy — a small entangled circuit standing in for Hilbert-space feature maps — with faster detection and lower defect PPM in demo metrics.",
        technical:
          "hello_quantum qubits=3, shots=8192 as QML kernel proxy; yield_pct improved ~92 demo, defect_ppm halved, detection_latency_ms ~8.",
      },
      {
        phase: "compare",
        layman:
          "We chart yield uplift, PPM reduction, and latency improvement so VP ops can see the inline detection story quantified.",
        technical:
          "Metrics: yield_pct, defect_ppm, detection_latency_ms; primary delta on yield or PPM; narrative references inline_metrology flag.",
      },
      {
        phase: "pipeline",
        layman:
          "We package yield report with histogram and fab metadata for pilot line review slides.",
        technical:
          "Job mode skill=hello_quantum, job_type=quantum_machine_learning; FeatureResultView semiconductor yield panels.",
      },
    ],
    classicalDeep:
      "SPC/PCA baseline uses statistical control limits on aggregate metrology — lagging indicator when overlay drift is nonlinear. Demo yield ~85%, defect PPM elevated, detection latency ~120ms (end-of-line batch). Represents traditional WAT and SPC dashboards fabs run on every lot.",
    quantumDeep:
      "hello_quantum 3-qubit entangled feature map proxy simulates quantum kernel classification narrative — sub-10ms latency and ~2× PPM reduction in demo. Not trained on real wafer maps — circuit histogram stands in for kernel decision. Research alignment with IBM/TSMC QML fab papers cited in catalog highlights.",
    technicalDeep:
      "Skill: hello_quantum (QML proxy). comparison.analyze_semiconductor. Classical SPC constants in comparison.py. Job type quantum_machine_learning. Input: fab_name, wafer_size, qubits, shots from catalog.",
    outputsDeep: [
      "Predicted yield percentage classical SPC vs quantum kernel comparison.",
      "Defect PPM (parts per million) both paths with reduction headline.",
      "Detection latency milliseconds inline vs batch SPC narrative.",
      "hello_quantum measurement histogram from feature-map proxy circuit.",
      "Fab name, process node (N3), wafer size (300mm) metadata.",
      "Target yield pct and inline_metrology flag echo.",
      "Method labels spc_pca_baseline vs quantum_kernel_proxy.",
      "Quantum advantage bullets on inline metrology and ms-scale detection.",
    ],
    limitations: [
      "No real wafer map or SEM image input — synthetic metrics only.",
      "hello_quantum proxy — not trained SVM or neural net on fab data.",
      "Latency and PPM numbers are demo constants — not measured on tool chain.",
      "3-qubit circuit cannot represent full overlay vector dimensionality.",
    ],
  },

  ai_llm_quantum_retrieval: {
    audience:
      "ML platform engineers, LLM infra leads, and AI architects scaling RAG retrieval beyond classical HNSW when corpora exceed 100M embeddings.",
    realWorldContext:
      "Enterprise RAG pipelines embed 100M+ document chunks at 1536 dimensions. HNSW and IVF approximate nearest neighbor recall drops as index grows — wrong chunks mean hallucinating LLMs. OpenAI, Google, and IBM research explore Grover-style amplitude amplification for similarity search. Production teams need recall@K, latency ms, and vectors examined on a real query string before funding quantum ML pilots.",
    problemDeep:
      "Your Enterprise Knowledge Base holds 100M vectors; query 'What is our Q3 liability cap for EU contracts?' must retrieve top-10 chunks under 200ms SLA. Classical HNSW touches millions of vectors and still misses relevant chunks at scale — recall@10 degrades. Quantum amplification proxy (hello_quantum 4-qubit, 4096 shots) demos higher recall@K examining fewer vectors in comparison metrics. Platform teams need side-by-side numbers tied to corpus_vectors and query_text inputs, not abstract √N speedup slides.",
    solutionDeep:
      "Configure corpus_name, corpus_vectors (100M default), embedding_dims (1536), query_text, top_k, latency_budget_ms, qubits, shots. Classical HNSW baseline sets recall and latency. hello_quantum Grover-style amplitude amplification proxy via PennyLane similarity circuits. Compare recall@K, latency ms, vectors examined, circuit depth context.",
    userSteps: [
      "Understand: You are testing whether quantum amplitude amplification could improve RAG retrieval recall at billion-vector scale — as a research proxy.",
      "Inputs: Set corpus size, embedding dimensions, query text, top-K, latency budget, qubits, shots.",
      "Review: Confirm query_text matches a realistic production question your RAG system fails today.",
      "Analyze: Load corpus → HNSW baseline → amplitude amplification → recall & latency compare → retrieval report.",
      "Compare: Read recall@K, latency, vectors examined classical vs quantum on chart.",
      "Results: Inspect similarity circuit context and advantage bullets for infra roadmap.",
      "Note: No actual embedding index — metrics are demo synthetic from comparison engine.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We check corpus size, query text, and top-K are present before simulating search. Empty query would make recall metrics meaningless.",
        technical:
          "analyze_rag parses corpus_vectors, query_text, top_k, latency_budget_ms, qubits, shots; defaults 100M vectors from catalog.",
      },
      {
        phase: "classical",
        layman:
          "We model HNSW approximate search — fast but recall drops as your index grows into hundreds of millions of vectors.",
        technical:
          "Classical HNSW baseline: recall@k ~0.71 demo, latency_ms high, vectors_examined ~2.5M; method hnsw_ann.",
      },
      {
        phase: "quantum",
        layman:
          "We run a Grover-style amplitude amplification proxy that finds relevant chunks examining fewer vectors while hitting higher recall in the demo.",
        technical:
          "hello_quantum 4-qubit PennyLane similarity proxy; recall@k ~0.89 demo, latency_ms lower, vectors_examined reduced; method amplitude_amplification_proxy.",
      },
      {
        phase: "compare",
        layman:
          "We chart recall, latency, and vectors touched so AI infra leads can argue SLA feasibility for a quantum retrieval pilot.",
        technical:
          "Metrics: recall_at_k, latency_ms, vectors_examined; primary delta on recall; narrative includes query_text snippet and corpus_vectors scale.",
      },
      {
        phase: "pipeline",
        layman:
          "We build retrieval report with query, corpus metadata, and circuit output for platform architecture review.",
        technical:
          "Job mode skill=hello_quantum, job_type=quantum_machine_learning; comparison.analyze_rag output.",
      },
    ],
    classicalDeep:
      "HNSW approximate nearest neighbor baseline models large-scale ANN — sublinear search but recall degrades past 100M vectors in demo (~71% recall@10). High vectors_examined count and latency near SLA ceiling. Represents Pinecone, Weaviate, or FAISS HNSW configs ops teams run today.",
    quantumDeep:
      "Amplitude amplification proxy uses hello_quantum entangled similarity circuit — Grover narrative without full oracle on 100M states. Demo recall ~89%, fewer vectors examined, lower latency_ms. PennyLane path cited for production similarity circuits. Not connected to real embedding index or OpenAI ada-002 vectors.",
    technicalDeep:
      "Skill: hello_quantum. comparison.analyze_rag. Libraries: PennyLane, hello_quantum. Job type quantum_machine_learning. Input: corpus_vectors, embedding_dims, query_text, top_k from catalog.",
    outputsDeep: [
      "Recall@K (default K=10) classical HNSW vs quantum amplification comparison.",
      "Query latency milliseconds both paths against latency_budget_ms SLA input.",
      "Vectors examined count — classical millions vs quantum reduced demo.",
      "Query text echo and corpus_name label on report.",
      "Corpus_vectors and embedding_dims metadata for scale context.",
      "hello_quantum circuit histogram as similarity amplification proxy output.",
      "Method labels hnsw_ann vs amplitude_amplification_proxy.",
      "Quantum advantage bullets on √N speedup narrative and production RAG SLA.",
    ],
    limitations: [
      "No real embedding index or vector database — synthetic recall/latency metrics.",
      "100M corpus scale simulated numerically — circuit cannot search 100M states.",
      "Grover proxy is hello_quantum demo — not Grover oracle on hashed embeddings.",
      "No LLM reranking or cross-encoder stage modeled.",
    ],
  },

  genomics_protein_folding: {
    audience:
      "Computational biologists, genomics lab PIs, and precision medicine teams folding proteins when no PDB template exists for clinical variants.",
    realWorldContext:
      "AlphaFold revolutionized template-based folding but orphan proteins and novel mutations (e.g., BRCA1 R1699Q) often lack PDB neighbors — 30%+ of human proteome 'unfoldable' by homology. Google, IBM, and biotech startups pursue VQE/QPE for folding energy landscapes. Clinicians need RMSD confidence and folding energy when template=no for CRISPR and antibody design conversations.",
    problemDeep:
      "BRCA1 variant R1699Q spans 1863 amino acids with no suitable PDB template for homology modeling. Classical MODELLER-style approaches fail or degrade — leaving clinicians without structural hints for variant pathogenicity. VQE energy minimization proxy (hello_quantum 4-qubit, 8192 shots) demos template-free folding with improved RMSD confidence in comparison metrics. Teams need energy kcal/mol, RMSD Å, and confidence side-by-side when has_pdb_template=false.",
    solutionDeep:
      "Enter protein_name, organism, sequence_length, has_pdb_template (false for demo), disease_context, qubits, shots. Classical homology baseline fails or low-confidence when no template. hello_quantum VQE folding energy minimization proxy reports RMSD, folding energy, shot histogram. Compare structure confidence and energy vs homology.",
    userSteps: [
      "Understand: You are folding a protein variant without a PDB neighbor — where homology fails and VQE research targets template-free methods.",
      "Inputs: Set protein name, organism, sequence length, PDB template flag, disease context, qubits, shots.",
      "Review: Confirm has_pdb_template=false matches your orphan protein scenario.",
      "Analyze: Load sequence → homology baseline → VQE folding → RMSD confidence compare → folding report.",
      "Compare: Read RMSD Å, folding energy, confidence classical vs quantum on chart.",
      "Results: Inspect VQE histogram and clinical context fields for precision medicine memo.",
      "Context: Position as post-AlphaFold frontier — not replacement for ESMFold at scale.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We verify protein name, sequence length, and organism before folding estimates run. Zero sequence length stops validation.",
        technical:
          "analyze_genomics parses protein_name, sequence_length, has_pdb_template, organism, qubits, shots; BRCA1 R1699Q defaults from catalog.",
      },
      {
        phase: "classical",
        layman:
          "We attempt homology modeling — building 3D structure from a similar PDB template — which fails or returns low confidence when no neighbor exists.",
        technical:
          "Homology branch when has_pdb_template false: rmsd_confidence low ~0.48, folding_energy poor, method homology_modeller_failed.",
      },
      {
        phase: "quantum",
        layman:
          "We run VQE energy minimization proxy that explores folding landscape without needing a PDB template — higher confidence in demo when template absent.",
        technical:
          "hello_quantum VQE proxy qubits=4, shots=8192; rmsd_confidence ~0.72 demo, folding_energy_kcal improved; method vqe_folding_proxy.",
      },
      {
        phase: "compare",
        layman:
          "We compare RMSD confidence and folding energy so clinical teams see why template-free quantum methods matter for novel variants.",
        technical:
          "Metrics: rmsd_confidence, folding_energy_kcal; primary delta on confidence; narrative includes disease_context and sequence_length.",
      },
      {
        phase: "pipeline",
        layman:
          "We assemble folding report with histogram, organism metadata, and variant label for genomics lab presentation.",
        technical:
          "Job mode skill=hello_quantum, job_type=quantum_chemistry; comparison.analyze_genomics.",
      },
    ],
    classicalDeep:
      "Homology modeling (MODELLER-style) requires PDB template with sequence identity threshold — fails explicitly when has_pdb_template=false. Low RMSD confidence (~0.48 demo), poor folding energy. Represents clinical variant cases where AlphaFold DB lacks neighbor structures.",
    quantumDeep:
      "VQE folding proxy via hello_quantum on 4 qubits — energy minimization narrative without full 1863-residue Hamiltonian. Improved RMSD confidence (~0.72) when no template. PennyLane path noted for production folding landscapes. Histogram from shot measurements. Post-AlphaFold research frontier positioning.",
    technicalDeep:
      "Skill: hello_quantum (VQE folding). comparison.analyze_genomics. Libraries: PennyLane, hello_quantum. Job type quantum_chemistry. Input: protein_name, sequence_length, organism from catalog.",
    outputsDeep: [
      "RMSD confidence score classical homology vs VQE folding comparison.",
      "Folding energy kcal/mol both methods with delta narrative.",
      "has_pdb_template flag and failure mode explanation when false.",
      "Protein name, organism, sequence_length, disease_context metadata.",
      "hello_quantum VQE histogram from folding proxy shots.",
      "Method labels homology_modeller_failed vs vqe_folding_proxy.",
      "Confidence delta percentage headline for clinical variant discussions.",
      "Quantum advantage bullets on template-free folding and conformation landscape.",
    ],
    limitations: [
      "4-qubit proxy — not full 1863-residue folding Hamiltonian.",
      "RMSD and energy are demo synthetic — not validated against cryo-EM.",
      "No MSA generation, co-evolution, or ESM embedding pipeline.",
      "VQE cannot replace AlphaFold2/ESMFold for routine proteome folding.",
    ],
  },

  crypto_pqc_wallet_hardening: {
    audience:
      "Wallet developers, crypto custodians, DeFi protocol security engineers, and Web3 teams planning ECDSA-to-PQC migration before Shor-capable machines threaten on-chain keys.",
    realWorldContext:
      "Ethereum wallets use ECDSA/secp256k1 — signatures and public keys are immutable on-chain history. Harvest-now-decrypt-later adversaries archive transactions today. Coinbase, Ethereum Foundation PQC working groups, and NIST target 2026–2030 migration timelines. Custodians holding $2.4M+ demo holdings need ML-KEM-768 + ML-DSA-65 packages framed for wallet key hierarchy, not generic account vault alone.",
    problemDeep:
      "Wallet 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb on Ethereum with $2.4M ETH exposure uses ECDSA signatures visible forever. Shor's algorithm breaks elliptic-curve discrete log on fault-tolerant quantum hardware. hndl_risk_acknowledged flag forces explicit harvest-now-decrypt-later awareness in the wizard. Teams need PQC key package preview, ECDSA vulnerability score, holdings USD at risk, and migration timeline — same account_vault_encrypt stack as cloud_api_entropy but wallet-framed.",
    solutionDeep:
      "Enter wallet_address, chain (Ethereum), asset_symbol, holdings_usd, signature_scheme (ECDSA), hndl_risk_acknowledged. Classical path scores ECDSA/Shor vulnerability. account_vault_encrypt seals wallet metadata with ML-KEM-768 + ML-DSA-65 via kyber-py/dilithium-py. Compare quantum attack resistance and migration timeline. Results mirror NISTAccountVault output with wallet-specific risk summary.",
    userSteps: [
      "Understand: You are assessing on-chain ECDSA exposure and generating an NIST PQC hardened key package for migration planning.",
      "Inputs: Set wallet address, chain, asset, holdings USD, current signature scheme, acknowledge HNDL risk checkbox.",
      "Review: Confirm holdings USD reflects realistic custodial exposure for your scenario.",
      "Analyze: Load wallet → ECDSA vulnerability assessment → ML-KEM/ML-DSA keygen → resistance score → seal package.",
      "Compare: Read PQC package preview vs ECDSA risk summary and holdings at risk.",
      "Results: Export migration timeline and algorithm stack for protocol governance forum.",
      "Note: Does not broadcast on-chain transaction — keygen demo only.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We verify wallet address format, chain name, and that you acknowledged harvest-now-decrypt-later risk before generating keys.",
        technical:
          "analyze_wallet parses wallet_address, chain, holdings_usd, hndl_risk_acknowledged; defaults Ethereum address from catalog.",
      },
      {
        phase: "classical",
        layman:
          "We score your current ECDSA/secp256k1 wallet against Shor's algorithm threat — public keys on-chain are archivable forever.",
        technical:
          "Classical ECDSA assessment: shor_vulnerable true, security_score low, holdings_usd at risk echoed; method ecdsa_on_chain.",
      },
      {
        phase: "quantum",
        layman:
          "We generate ML-KEM and ML-DSA hardened wallet key package using the same NIST vault stack as enterprise account encryption.",
        technical:
          "account_vault_encrypt skill with wallet metadata payload; NISTAccountVault ML-KEM-768 + ML-DSA-65 via kyber-py/dilithium-py.",
      },
      {
        phase: "compare",
        layman:
          "We contrast quantum attack resistance scores and show holdings USD still at risk under ECDSA until migration completes.",
        technical:
          "Metrics: security_score, quantum_resistance delta; comparison includes migration_timeline string and pqc_key_package preview.",
      },
      {
        phase: "pipeline",
        layman:
          "We seal the wallet package with algorithm list, ciphertext previews, and Ethereum Foundation PQC pattern references.",
        technical:
          "Job mode skill=account_vault_encrypt, job_type=post_quantum_crypto; same handler as cloud_api_entropy with wallet input schema.",
      },
    ],
    classicalDeep:
      "ECDSA on-chain baseline marks Shor-vulnerable, low quantum resistance score. Holdings USD displayed as at-risk under harvest-now-decrypt-later model. Public key recoverable from past signatures. No ML-KEM or ML-DSA in classical path. Mirrors Ethereum EOA threat model pre-PQC account abstraction.",
    quantumDeep:
      "account_vault_encrypt produces ML-KEM-768 encapsulated secret and ML-DSA-65 signed wallet metadata package — lattice-safe against Shor. kyber-py and dilithium-py real operations at demo scale. Migration timeline string (2026–2030) aligns with EF PQC working group narratives. Not on-chain deployment — offline key hierarchy demo.",
    technicalDeep:
      "Skill: account_vault_encrypt. Module: NISTAccountVault. Libraries: kyber-py, dilithium-py. comparison.analyze_wallet. Shared with cloud_api_entropy. Job type post_quantum_crypto. Input: wallet_address, chain, holdings_usd from catalog.",
    outputsDeep: [
      "PQC wallet key package preview with ML-KEM ciphertext and ML-DSA signature hex snippets.",
      "ECDSA vulnerability summary with Shor threat flag and signature_scheme label.",
      "Holdings USD at risk figure from scenario inputs.",
      "Quantum attack resistance score classical vs PQC comparison delta.",
      "Migration timeline text (2026–2030 research-track framing).",
      "Algorithm stack FIPS 203/204 list matching enterprise vault app.",
      "Wallet address and chain metadata on all blocks.",
      "hndl_risk_acknowledged audit flag echo for compliance logs.",
    ],
    limitations: [
      "Does not interact with Ethereum RPC or submit migration transactions.",
      "PQC wallet standards for Ethereum still evolving — demo uses account vault pattern.",
      "Holdings USD is user-entered scenario — not live chain balance fetch.",
      "Multi-sig and smart contract wallet patterns not fully modeled.",
    ],
  },

  smart_city_traffic_flow: {
    audience:
      "City DOT planners, mobility startups, AV fleet operators, and smart city CTOs coordinating thousands of signalized intersections beyond fixed-timing plans.",
    realWorldContext:
      "Greater metro areas run 5,000+ signalized intersections on fixed-timing plans written years ago. Volkswagen and D-Wave pilots showed 10–20% commute reductions with coordinated optimization. Idling traffic drives ~30% of urban CO₂. Demo models 5,000 intersections and 850,000 peak vehicles/hour using route_optimizer nearest-neighbor as QAOA proxy for phase coordination.",
    problemDeep:
      "Your metro has 5,000 intersections and 850,000 peak vehicles per hour. Fixed-timing plans cause cascading gridlock — drivers lose ~54 hours/year; emissions spike during idle. Local greedy adjustments at one intersection worsen neighbors. Quantum annealing and QAOA research frames city-wide signal phasing as combinatorial optimization — same shape as TSP. You need commute time delta, peak CO₂ comparison, throughput uplift, and phase map narrative without standing up SUMO simulation.",
    solutionDeep:
      "Configure metro_name, intersection_count (5000), peak_vehicles_per_hour, optimize_for (commute_time/emissions/throughput), av_fleet_pct. Fixed-timing baseline models static plans. route_optimizer applies nearest-neighbor TSP heuristics as QAOA proxy to reorder intersection phases. Compare commute reduction, CO₂ saved, throughput, with heatmap/route visual context in dashboard.",
    userSteps: [
      "Understand: You are coordinating city-wide signal timing vs leaving thousands of intersections on fixed independent plans.",
      "Inputs: Set metro name, intersection count, peak vehicles/hour, optimization goal, AV fleet percentage.",
      "Review: Confirm intersection count and peak volume match your metro scale scenario.",
      "Analyze: Load metro network → fixed-timing baseline → route_optimizer traffic proxy → commute & CO₂ savings.",
      "Compare: Read commute time change, peak CO₂, throughput classical vs coordinated on chart.",
      "Results: View heatmap/route visual context and advantage bullets citing VW/D-Wave pilots.",
      "Note: Not connected to real ATSPM or traffic management center feeds.",
    ],
    analyzeFlow: [
      {
        phase: "validate",
        layman:
          "We check metro name, intersection count, and peak vehicle volume before optimization. Zero intersections stops the run immediately.",
        technical:
          "analyze_traffic parses metro_name, intersection_count, peak_vehicles_per_hour, optimize_for, av_fleet_pct; defaults 5000 intersections from catalog.",
      },
      {
        phase: "classical",
        layman:
          "We model fixed-timing signal plans — each intersection runs its own schedule with no network coordination, causing gridlock in the demo metrics.",
        technical:
          "Fixed-timing baseline: commute_index high, co2_peak high, throughput low; method fixed_timing_plans.",
      },
      {
        phase: "quantum",
        layman:
          "We run coordinated signal optimization using the same route optimizer engine that solves delivery TSP — standing in for QAOA city-wide phasing.",
        technical:
          "route_optimizer skill as QAOA proxy; nearest_neighbor on intersection graph abstraction; commute_index improved ~17%, co2 reduced ~22% demo.",
      },
      {
        phase: "compare",
        layman:
          "We calculate commute time and CO₂ savings so city planners can cite quantified benefits in council presentations.",
        technical:
          "Metrics: commute_time_delta_pct, co2_peak, throughput; primary delta on commute or co2; narrative references optimize_for and av_fleet_pct.",
      },
      {
        phase: "pipeline",
        layman:
          "We build traffic report with phase coordination summary and visual context for smart city stakeholder deck.",
        technical:
          "Job mode skill=route_optimizer, job_type=optimization; ScenarioVisuals smart_city thumb; comparison.analyze_traffic.",
      },
    ],
    classicalDeep:
      "Fixed-timing baseline assigns static cycle lengths per intersection — no adaptive coordination. Demo shows higher commute index, elevated peak CO₂, lower throughput. Represents legacy DOT timing sheets updated every 5–10 years. AV fleet percentage adjusts narrative only in demo.",
    quantumDeep:
      "route_optimizer nearest-neighbor TSP heuristic applied to intersection phase ordering graph — QAOA proxy label for production annealing swap. Demo commute -17%, CO₂ -22% aligned with catalog metrics and VW pilot citations. Not SUMO microsimulation — combinatorial optimization narrative at metro scale.",
    technicalDeep:
      "Skill: route_optimizer (QAOA proxy). comparison.analyze_traffic. Same handler as logistics_delivery_routes. Job type optimization. Input: metro_name, intersection_count, peak_vehicles_per_hour, optimize_for from catalog. USE_CASE_EXPLANATIONS: route_optimizer, QAOA proxy.",
    outputsDeep: [
      "Average commute time change percentage classical fixed vs coordinated optimization.",
      "Peak CO₂ emissions comparison with reduction headline (~22% demo).",
      "Throughput uplift metric vehicles per hour equivalent.",
      "Intersection_count and peak_vehicles_per_hour metadata on report.",
      "optimize_for goal label (commute_time, emissions, throughput) echo.",
      "av_fleet_pct autonomous vehicle share context in narrative.",
      "Method labels fixed_timing_plans vs qaoa_traffic_proxy (nearest_neighbor).",
      "Heatmap/route visual data hooks for ScenarioVisuals dashboard component.",
    ],
    limitations: [
      "Not connected to real traffic signal controllers or ATSPM feeds.",
      "route_optimizer TSP proxy — not microsimulation with origin-destination matrices.",
      "5,000 intersections modeled abstractly — not block-level geometry.",
      "QAOA/annealing hardware not invoked in default local zero-cost run.",
    ],
  },
};
