export type UseCaseActionConfig = {
  runButton: string;
  reviewingText: string;
  reviewFlow: string;
  resultsTitle: string;
  comparisonTitle: string;
  phases: { id: string; label: string }[];
};

export const USE_CASE_ACTIONS: Record<string, UseCaseActionConfig> = {
  fintech_portfolio_rebalance: {
    runButton: "Optimize portfolio allocation",
    reviewingText: "We will rebalance your portfolio using risk-aware optimization and show how it compares to equal-weight splitting.",
    reviewFlow: "Equal-weight baseline → Quantum-inspired optimizer → Uplift report → Full agent pipeline",
    resultsTitle: "Your optimized portfolio allocation",
    comparisonTitle: "Optimized allocation vs equal-weight split",
    phases: [
      { id: "validate", label: "Validating fund inputs" },
      { id: "classical", label: "Computing equal-weight baseline" },
      { id: "quantum", label: "Running portfolio optimizer" },
      { id: "compare", label: "Measuring risk-adjusted uplift" },
      { id: "pipeline", label: "Running full agent pipeline" },
    ],
  },
  logistics_delivery_routes: {
    runButton: "Optimize delivery route",
    reviewingText: "We will reorder your stops for the shortest route and compare against your original stop order.",
    reviewFlow: "Fixed stop order → Route optimizer → Distance & fuel savings → Full job output",
    resultsTitle: "Your optimized delivery route",
    comparisonTitle: "Optimized route vs original stop order",
    phases: [
      { id: "validate", label: "Validating stops and fleet" },
      { id: "classical", label: "Measuring original route distance" },
      { id: "quantum", label: "Running route optimizer" },
      { id: "compare", label: "Calculating distance saved" },
      { id: "pipeline", label: "Building route report" },
    ],
  },
  bank_legacy_crypto_audit: {
    runButton: "Run PQC migration audit",
    reviewingText: "We will scan your code for quantum-vulnerable crypto and produce a migration assessment.",
    reviewFlow: "Keyword scan → Full PQC scan → Mock encrypt demo → Policy review",
    resultsTitle: "Your PQC migration audit",
    comparisonTitle: "Structured audit vs keyword grep",
    phases: [
      { id: "validate", label: "Loading source code" },
      { id: "classical", label: "Running keyword scan" },
      { id: "quantum", label: "Running PQC migration scan" },
      { id: "compare", label: "Scoring migration readiness" },
      { id: "pipeline", label: "Running full audit pipeline" },
    ],
  },
  telecom_qkd_link_planning: {
    runButton: "Simulate QKD fiber link",
    reviewingText: "We will simulate BB84 key distribution over your fiber link and compare against classical pre-shared keys.",
    reviewFlow: "Classical PSK → BB84 simulation → QBER & sifted key → Link report",
    resultsTitle: "Your QKD link simulation",
    comparisonTitle: "BB84 QKD vs classical pre-shared key",
    phases: [
      { id: "validate", label: "Validating link parameters" },
      { id: "classical", label: "Estimating classical key exchange" },
      { id: "quantum", label: "Simulating BB84 protocol" },
      { id: "compare", label: "Computing security uplift" },
      { id: "pipeline", label: "Generating link report" },
    ],
  },
  cloud_api_entropy: {
    runButton: "Encrypt account with NIST post-quantum vault",
    reviewingText: "We will generate a quantum-random session nonce, encrypt your account with ML-KEM-768 + ML-DSA-65, and compare against RSA binding.",
    reviewFlow: "QRNG session nonce → NIST PQC vault encrypt → Verify package → Compare vs RSA",
    resultsTitle: "Your encrypted account vault",
    comparisonTitle: "NIST PQC vault vs RSA (quantum-vulnerable)",
    phases: [
      { id: "validate", label: "Validating account identity" },
      { id: "classical", label: "Modeling RSA session binding" },
      { id: "quantum", label: "Generating QRNG nonce & encrypting vault" },
      { id: "compare", label: "Scoring quantum attack resistance" },
      { id: "pipeline", label: "Sealing vault package" },
    ],
  },
  automotive_battery_chemistry: {
    runButton: "Simulate battery chemistry circuit",
    reviewingText: "We will run a quantum circuit model of cathode chemistry and compare fidelity against classical mean-field.",
    reviewFlow: "Mean-field baseline → Quantum circuit → Fidelity comparison → Measurement histogram",
    resultsTitle: "Your battery chemistry simulation",
    comparisonTitle: "Quantum circuit vs classical mean-field",
    phases: [
      { id: "validate", label: "Loading chemistry parameters" },
      { id: "classical", label: "Running mean-field approximation" },
      { id: "quantum", label: "Executing quantum circuit" },
      { id: "compare", label: "Computing fidelity uplift" },
      { id: "pipeline", label: "Aggregating measurement shots" },
    ],
  },
  research_simulator_benchmark: {
    runButton: "Benchmark quantum simulators",
    reviewingText: "We will run the same circuit on multiple SDK backends and recommend the best fit.",
    reviewFlow: "Classical only → Multi-provider runs → Agreement score → Recommendation",
    resultsTitle: "Your simulator benchmark results",
    comparisonTitle: "Multi-vendor benchmark vs single classical simulator",
    phases: [
      { id: "validate", label: "Configuring workload" },
      { id: "classical", label: "Running classical simulator" },
      { id: "quantum", label: "Running Qiskit, PennyLane, mock" },
      { id: "compare", label: "Scoring cross-provider agreement" },
      { id: "pipeline", label: "Generating recommendation" },
    ],
  },
  insurance_fraud_feature_probe: {
    runButton: "Run secure fraud-scoring pipeline",
    reviewingText: "We will scan feature-store code, enforce policy gates, then run quantum simulation only if approved.",
    reviewFlow: "Direct inference → Crypto scan → Policy gate → Quantum simulate → Explain",
    resultsTitle: "Your secure fraud pipeline result",
    comparisonTitle: "Secure pipeline vs direct ML inference",
    phases: [
      { id: "validate", label: "Loading feature-store code" },
      { id: "classical", label: "Modeling direct inference path" },
      { id: "quantum", label: "Running secure quantum pipeline" },
      { id: "compare", label: "Scoring security uplift" },
      { id: "pipeline", label: "Generating auditor explanation" },
    ],
  },
  pharma_molecular_binding: {
    runButton: "Simulate drug-target binding (VQE)",
    reviewingText: "We will estimate binding affinity with quantum VQE chemistry and compare against classical force-field docking.",
    reviewFlow: "MM/GBSA docking → VQE ansatz → Binding confidence → Circuit histogram",
    resultsTitle: "Your drug-target binding prediction",
    comparisonTitle: "VQE quantum chemistry vs classical force field",
    phases: [
      { id: "validate", label: "Loading compound & target" },
      { id: "classical", label: "Running MM/GBSA docking" },
      { id: "quantum", label: "Running VQE binding simulation" },
      { id: "compare", label: "Measuring confidence uplift" },
      { id: "pipeline", label: "Building chemistry report" },
    ],
  },
  energy_grid_quantum_dispatch: {
    runButton: "Optimize renewable grid dispatch",
    reviewingText: "We will optimize power dispatch across your regions and compare against greedy merit-order.",
    reviewFlow: "Greedy dispatch → Quantum unit commitment → Cost & carbon → Dispatch weights",
    resultsTitle: "Your grid dispatch plan",
    comparisonTitle: "Quantum dispatch vs greedy merit-order",
    phases: [
      { id: "validate", label: "Loading grid parameters" },
      { id: "classical", label: "Running merit-order dispatch" },
      { id: "quantum", label: "Running unit commitment optimizer" },
      { id: "compare", label: "Calculating cost & carbon savings" },
      { id: "pipeline", label: "Building dispatch report" },
    ],
  },
  finance_quantum_monte_carlo: {
    runButton: "Run quantum Monte Carlo risk analysis",
    reviewingText: "We will estimate VaR99 with quantum amplitude estimation and compare against classical Monte Carlo.",
    reviewFlow: "Classical MC paths → QAE proxy → VaR comparison → Risk report",
    resultsTitle: "Your tail-risk (VaR) estimate",
    comparisonTitle: "Quantum amplitude estimation vs classical Monte Carlo",
    phases: [
      { id: "validate", label: "Loading trading book" },
      { id: "classical", label: "Running classical Monte Carlo" },
      { id: "quantum", label: "Running quantum amplitude estimation" },
      { id: "compare", label: "Comparing VaR precision" },
      { id: "pipeline", label: "Building risk report" },
    ],
  },
  semiconductor_yield_quantum: {
    runButton: "Run fab yield intelligence scan",
    reviewingText: "We will detect lithography defects with quantum kernel methods and compare against classical SPC.",
    reviewFlow: "SPC baseline → Quantum kernel detector → Yield projection → Histogram",
    resultsTitle: "Your fab yield prediction",
    comparisonTitle: "Quantum kernel detection vs classical SPC",
    phases: [
      { id: "validate", label: "Loading fab parameters" },
      { id: "classical", label: "Running SPC/PCA baseline" },
      { id: "quantum", label: "Running quantum anomaly detector" },
      { id: "compare", label: "Projecting yield uplift" },
      { id: "pipeline", label: "Building yield report" },
    ],
  },
  ai_llm_quantum_retrieval: {
    runButton: "Run quantum RAG vector search",
    reviewingText: "We will search your embedding corpus with quantum amplitude amplification and compare against classical HNSW retrieval.",
    reviewFlow: "HNSW baseline → Quantum amplification → Recall & latency → Circuit output",
    resultsTitle: "Your quantum RAG retrieval results",
    comparisonTitle: "Quantum amplification vs classical HNSW search",
    phases: [
      { id: "validate", label: "Loading corpus & query" },
      { id: "classical", label: "Running HNSW approximate search" },
      { id: "quantum", label: "Running amplitude amplification" },
      { id: "compare", label: "Comparing recall & latency" },
      { id: "pipeline", label: "Building retrieval report" },
    ],
  },
  genomics_protein_folding: {
    runButton: "Fold protein structure (VQE)",
    reviewingText: "We will predict protein structure with quantum VQE folding and compare against classical homology modeling.",
    reviewFlow: "Homology baseline → VQE folding → RMSD confidence → Circuit histogram",
    resultsTitle: "Your protein folding prediction",
    comparisonTitle: "VQE folding vs classical homology modeling",
    phases: [
      { id: "validate", label: "Loading protein sequence" },
      { id: "classical", label: "Running homology modeling" },
      { id: "quantum", label: "Running VQE folding simulation" },
      { id: "compare", label: "Comparing structure confidence" },
      { id: "pipeline", label: "Building folding report" },
    ],
  },
  crypto_pqc_wallet_hardening: {
    runButton: "Harden wallet with post-quantum crypto",
    reviewingText: "We will assess your ECDSA wallet vulnerability and generate an NIST PQC hardened key package with ML-KEM + ML-DSA.",
    reviewFlow: "ECDSA assessment → ML-KEM/ML-DSA keygen → Wallet package → Security comparison",
    resultsTitle: "Your post-quantum hardened wallet",
    comparisonTitle: "PQC wallet vs ECDSA (quantum-vulnerable)",
    phases: [
      { id: "validate", label: "Loading wallet & chain" },
      { id: "classical", label: "Assessing ECDSA vulnerability" },
      { id: "quantum", label: "Generating PQC wallet keys" },
      { id: "compare", label: "Scoring quantum attack resistance" },
      { id: "pipeline", label: "Sealing wallet package" },
    ],
  },
  smart_city_traffic_flow: {
    runButton: "Optimize city traffic flow",
    reviewingText: "We will coordinate signal timing across your metro with quantum optimization and compare against fixed-timing plans.",
    reviewFlow: "Fixed timing → Quantum coordination → Commute & CO₂ → Phase map",
    resultsTitle: "Your city traffic optimization plan",
    comparisonTitle: "Quantum coordination vs fixed-timing signals",
    phases: [
      { id: "validate", label: "Loading metro network" },
      { id: "classical", label: "Modeling fixed-timing baseline" },
      { id: "quantum", label: "Running traffic flow optimizer" },
      { id: "compare", label: "Calculating commute & CO₂ savings" },
      { id: "pipeline", label: "Building traffic report" },
    ],
  },
};

export function getUseCaseActions(id: string): UseCaseActionConfig {
  return (
    USE_CASE_ACTIONS[id] ?? {
      runButton: "Run analysis",
      reviewingText: "We will run this feature on your inputs and show how it compares to the traditional approach.",
      reviewFlow: "Traditional baseline → This approach → Uplift → Full output",
      resultsTitle: "Your results",
      comparisonTitle: "Comparison with traditional approach",
      phases: [
        { id: "validate", label: "Validating your inputs" },
        { id: "classical", label: "Running traditional baseline" },
        { id: "quantum", label: "Running this feature" },
        { id: "compare", label: "Computing improvement" },
        { id: "pipeline", label: "Executing full pipeline" },
      ],
    }
  );
}
