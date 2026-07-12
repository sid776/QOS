import { Link } from "react-router-dom";
import GuideSection, { GuideH3, GuideLink, GuideOl, GuideP, GuideUl } from "./GuideSection";

const TOC = [
  { id: "welcome", label: "Welcome & what QuantumOS is" },
  { id: "big-picture", label: "The big picture (end to end)" },
  { id: "interface", label: "Your screen: header, sidebar, online light" },
  { id: "desktop", label: "Desktop (Home)" },
  { id: "use-cases", label: "Use Cases — 16 industry scenarios" },
  { id: "skills", label: "Skills — 7 full features" },
  { id: "jobs", label: "Jobs — history & results" },
  { id: "workbench", label: "Agent Workbench — multi-step pipelines" },
  { id: "agents", label: "Agents — individual helpers" },
  { id: "playground", label: "Playground" },
  { id: "providers", label: "Providers — where work runs" },
  { id: "security", label: "Security Center" },
  { id: "audit-policies", label: "Audit & Policies" },
  { id: "reading-results", label: "How to read results" },
  { id: "demo-vs-real", label: "What is demo vs real" },
  { id: "learning-paths", label: "Suggested learning paths" },
  { id: "glossary", label: "Glossary" },
  { id: "faq", label: "FAQ" },
  { id: "troubleshooting", label: "Troubleshooting" },
];

export default function FullUserGuide() {
  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Hero */}
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 px-5 py-5 text-slate-800">
        <p className="font-semibold text-blue-900 text-xl">QuantumOS — Complete User Guide</p>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Everything in this dashboard, explained end to end in plain language. No physics degree
          required. See also the live{" "}
          <Link to="/readme" className="q-link">
            README
          </Link>{" "}
          and{" "}
          <Link to="/dev-guide" className="q-link">
            Dev Guide
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/use-cases"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            Start with Use Cases →
          </Link>
          <Link
            to="/skills"
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm"
          >
            Browse Skills
          </Link>
        </div>
      </div>

      {/* Table of contents */}
      <nav className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
          On this page
        </p>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
          {TOC.map((item, i) => (
            <li key={item.id}>
              <GuideLink to={`#${item.id}`}>
                {i + 1}. {item.label}
              </GuideLink>
            </li>
          ))}
        </ol>
      </nav>

      {/* 1 Welcome */}
      <GuideSection id="welcome" title="1. Welcome — what is QuantumOS?" icon="👋" accent="blue">
        <GuideP>
          <strong>QuantumOS</strong> is a control panel for quantum-related and quantum-safe
          computing tasks. Think of it as an air-traffic tower: you describe what you want done, and
          the system figures out <em>how</em> to run it, <em>where</em> to run it, and{" "}
          <em>whether</em> it is allowed — then shows you the answer.
        </GuideP>
        <GuideP>
          It is <strong>not</strong> a replacement for Windows or macOS. It runs in your browser
          and talks to a small server on your computer (or in Docker). Everything you see here is a{" "}
          <strong>local demo</strong> — it does not connect to real banks, move real money, or
          access live telecom networks.
        </GuideP>
        <GuideH3>What you can do here</GuideH3>
        <GuideUl>
          <li>
            Run <strong>Industry Apps</strong> — sixteen scenarios with forms, charts, and
            before/after comparisons.
          </li>
          <li>
            Use <strong>Skills</strong> — smaller tools (QRNG, BB84, portfolio optimizer, account
            vault, etc.) with their own result views.
          </li>
          <li>
            Watch <strong>agent pipelines</strong> in the Workbench — policy, routing, and skills
            chained together.
          </li>
          <li>
            Inspect <strong>jobs</strong>, <strong>providers</strong>, security tools, and the{" "}
            <strong>audit log</strong>.
          </li>
        </GuideUl>
        <GuideH3>What you do not need</GuideH3>
        <GuideUl>
          <li>A physical quantum computer — simulators run on your laptop.</li>
          <li>To write code — forms and buttons are enough for every feature.</li>
          <li>Prior knowledge of qubits, entanglement, or post-quantum math.</li>
        </GuideUl>
      </GuideSection>

      {/* 2 Big picture */}
      <GuideSection id="big-picture" title="2. The big picture (end to end)" icon="🗺" accent="indigo">
        <GuideP>When you click <strong>Run</strong> anywhere in the dashboard, this is what happens behind the scenes:</GuideP>
        <GuideOl>
          <li>
            <strong>You send a request</strong> — from Use Cases, Skills, Playground, or Workbench.
          </li>
          <li>
            <strong>A job ticket is created</strong> — stored with a unique ID, your inputs, and a
            status (QUEUED → RUNNING → COMPLETED or FAILED).
          </li>
          <li>
            <strong>Policy checks run</strong> — rules like “no cloud quantum without approval” and
            “zero budget means local only.” Jobs can be rejected if they break policy.
          </li>
          <li>
            <strong>A provider is chosen</strong> — the “backend” where work executes: a quantum
            simulator (Qiskit Aer), a classical fallback, or a mock practice engine.
          </li>
          <li>
            <strong>Skill logic runs</strong> (if applicable) — the small app behind the feature
            (e.g. BB84 simulator, portfolio optimizer) prepares structured output.
          </li>
          <li>
            <strong>Results are merged and saved</strong> — you see skill output plus provider
            output (e.g. measurement counts) on the screen and in Jobs history.
          </li>
          <li>
            <strong>Audit log records the event</strong> — tamper-evident hash chain for
            compliance-style traceability.
          </li>
        </GuideOl>
        <GuideP>
          <strong>Agents</strong> are helpers that sit alongside this flow. Some make one decision
          (pick a backend, scan code for weak crypto). <strong>Workflows</strong> chain several
          agents and skills in order — you see each step in the Agent Workbench timeline.
        </GuideP>
        <pre className="text-xs bg-slate-50 rounded-xl p-4 font-mono text-slate-600 overflow-x-auto">
{`You (dashboard)  →  API server  →  Policy  →  Router  →  Provider
                              ↓                    ↓
                         Skill handler      Simulator / classical / mock
                              ↓
                         Job result + Audit log`}
        </pre>
      </GuideSection>

      {/* 3 Interface */}
      <GuideSection id="interface" title="3. Your screen: header, sidebar, online light" icon="🖥" accent="blue">
        <GuideH3>Top header bar</GuideH3>
        <GuideUl>
          <li><strong>QuantumOS logo</strong> — home branding.</li>
          <li><strong>User Guide</strong> shortcut — returns here.</li>
          <li>
            <strong>Online / Offline dot</strong> — green means the API server is reachable. If it
            says Offline, most buttons will fail until the server is started (see Troubleshooting).
          </li>
        </GuideUl>
        <GuideH3>Left sidebar — Apps</GuideH3>
        <GuideUl>
          <li><Link to="/guide" className="q-link">User Guide</Link> — this document.</li>
          <li><Link to="/dev-guide" className="q-link">Dev Guide</Link> — technical reference for developers.</li>
          <li><Link to="/" className="q-link">Desktop</Link> — home dashboard and Quick Launch.</li>
          <li><Link to="/use-cases" className="q-link">Use Cases</Link> — eight industry scenarios.</li>
          <li><Link to="/agent-workbench" className="q-link">Workbench</Link> — multi-agent workflows.</li>
          <li><Link to="/playground" className="q-link">Playground</Link> — free-form job submission.</li>
          <li><Link to="/jobs" className="q-link">Jobs</Link> — all past tasks and results.</li>
          <li><Link to="/providers" className="q-link">Providers</Link> — backends and health.</li>
          <li><Link to="/skills" className="q-link">Skills</Link> — seven interactive features.</li>
          <li><Link to="/security" className="q-link">Security</Link> — encrypt, decrypt, migration scan.</li>
          <li><Link to="/audit" className="q-link">Audit</Link> — event log.</li>
          <li><Link to="/policies" className="q-link">Policies</Link> — active rules (read-only in MVP).</li>
        </GuideUl>
        <GuideP>
          Window panels can be <strong>minimized</strong> (yellow dot) or <strong>closed</strong>{" "}
          (red dot) like desktop windows. Closed windows reappear as a floating button in the corner.
        </GuideP>
      </GuideSection>

      {/* 4 Desktop */}
      <GuideSection id="desktop" title="4. Desktop (Home)" icon="⊞" accent="emerald">
        <GuideP>
          The <Link to="/" className="q-link">Desktop</Link> page is your starting point after login.
        </GuideP>
        <GuideH3>System Monitor</GuideH3>
        <GuideP>
          Shows API health, version number, how many jobs have run, and how many providers are
          available. If status is not “ok”, the backend needs attention.
        </GuideP>
        <GuideH3>Real-Life Use Cases & Agent Workbench cards</GuideH3>
        <GuideP>Shortcuts to the two best places for beginners: industry stories and agent pipelines.</GuideP>
        <GuideH3>Quick Launch</GuideH3>
        <GuideP>
          One button per skill — runs each skill with default parameters instantly. Results appear
          below with charts or tables (not raw JSON). For full control, open{" "}
          <Link to="/skills" className="q-link">Skills</Link> instead.
        </GuideP>
      </GuideSection>

      {/* 5 Use Cases */}
      <GuideSection id="use-cases" title="5. Use Cases — 16 industry scenarios" icon="🌐" accent="emerald" defaultOpen={false}>
        <GuideP>
          <Link to="/use-cases" className="q-link">Industry Apps</Link> are full walkthroughs: you
          fill in a form, run Analyze, see charts and numbers, then a comparison to a simpler
          traditional approach at the bottom. Pick a card, open the app, and follow the steps
          (Understand → Inputs → Review → Analyze → Results).
        </GuideP>
        <GuideH3>All sixteen apps (short descriptions)</GuideH3>
        <GuideUl>
          <li>
            <strong>Portfolio rebalance</strong> — Spread a budget across tech stocks with a
            risk-aware optimizer instead of equal weighting.
          </li>
          <li>
            <strong>Delivery routing</strong> — Reorder warehouse stops to cut total km vs driving
            in the order you typed them.
          </li>
          <li>
            <strong>Bank crypto audit</strong> — Scan payment code for RSA/MD5 and related weak
            patterns; get a migration-style report.
          </li>
          <li>
            <strong>QKD link planning</strong> — Simulate BB84 on a fiber link: key rate, QBER,
            sifted key preview.
          </li>
          <li>
            <strong>NIST account vault</strong> — QRNG nonce + ML-KEM / AES-GCM / ML-DSA account
            encryption (the post-quantum identity demo).
          </li>
          <li>
            <strong>Battery chemistry</strong> — Small quantum circuit proxy for cathode material
            research with gate list and histogram.
          </li>
          <li>
            <strong>Simulator benchmark</strong> — Same circuit on Qiskit, PennyLane, mock, and
            classical backends; compare agreement.
          </li>
          <li>
            <strong>Insurance fraud pipeline</strong> — Crypto scan on feature-store code, policy
            gate, then simulate only if allowed.
          </li>
          <li>
            <strong>Drug binding (VQE)</strong> — Classical docking vs VQE-style binding estimate on
            one compound and target.
          </li>
          <li>
            <strong>Grid dispatch</strong> — Greedy power dispatch vs optimizer when renewables are a
            large share of the mix.
          </li>
          <li>
            <strong>Monte Carlo / VaR</strong> — Classical risk paths vs quantum amplitude
            estimation proxy on the same trading book inputs.
          </li>
          <li>
            <strong>Fab yield</strong> — SPC baseline vs quantum-kernel anomaly detection for inline
            metrology story.
          </li>
          <li>
            <strong>Quantum RAG</strong> — Vector search recall and latency on a large corpus vs
            classical ANN-style search.
          </li>
          <li>
            <strong>Protein folding</strong> — VQE folding proxy when no PDB template exists.
          </li>
          <li>
            <strong>Wallet hardening</strong> — Post-quantum vault for crypto wallets; ECDSA
            migration framing.
          </li>
          <li>
            <strong>City traffic</strong> — Fixed signal timing vs coordinated optimization across
            many intersections.
          </li>
        </GuideUl>
        <GuideP>
          Longer plain-English writeups for each app live in the repo{" "}
          <Link to="/readme" className="q-link">README</Link> and on each app&apos;s Understand
          step inside the wizard.
        </GuideP>
      </GuideSection>

      {/* 6 Skills */}
      <GuideSection id="skills" title="6. Skills — 7 full features" icon="◆" accent="purple" defaultOpen={false}>
        <GuideP>
          <Link to="/skills" className="q-link">Skills</Link> are the building blocks of QuantumOS —
          reusable capabilities with their own forms and result visualizations. Skills are grouped by
          category. Click a card to expand the feature panel.
        </GuideP>
        <GuideH3>How to use a skill</GuideH3>
        <GuideOl>
          <li>Open Skills and click a card (e.g. Portfolio Optimizer).</li>
          <li>Fill in the form — asset tickers, budget, risk level, etc.</li>
          <li>Optionally switch to <strong>Advanced JSON editor</strong> for power users.</li>
          <li>Click <strong>Run skill</strong> and wait for COMPLETED.</li>
          <li>Read the right-hand panel — pie charts, route timelines, finding tables, etc.</li>
          <li>Use <strong>Full page →</strong> for a dedicated URL you can bookmark.</li>
        </GuideOl>
        <GuideH3>Each skill explained</GuideH3>
        <GuideUl>
          <li>
            <strong>hello_quantum</strong> — Bell-state quantum circuit demo. Set qubits (2–4) and
            shots. See circuit steps (Hadamard, CNOT, measure) and a measurement histogram.
          </li>
          <li>
            <strong>qrng_demo</strong> — Random bytes for security (session IDs, nonces). Shows hex
            output and an entropy meter. Demo uses your computer&apos;s secure randomness, not
            hardware QRNG.
          </li>
          <li>
            <strong>bb84_simulator</strong> — Educational QKD protocol: Alice and Bob bases,
            sifted key, quantum bit error rate (QBER). Table shows which bits survive basis
            matching.
          </li>
          <li>
            <strong>portfolio_optimizer</strong> — Enter stock tickers, budget, and risk (low /
            medium / high). Get a pie chart of weights, dollar allocations, and estimated
            return/volatility.
          </li>
          <li>
            <strong>route_optimizer</strong> — List delivery stops (first = depot). Get
            nearest-neighbor route order and per-leg distances in km.
          </li>
          <li>
            <strong>pqc_encryptor</strong> — Encrypt a message with mock post-quantum crypto. Shows
            plaintext vs ciphertext preview. <em>Not real NIST PQC — demo only.</em>
          </li>
          <li>
            <strong>crypto_migration_scan</strong> — Paste code; get line-by-line findings for RSA,
            MD5, ECDSA, SHA-1, etc., with severity and migration suggestions.
          </li>
        </GuideUl>
        <GuideP>
          If the Skills page is empty, the API is offline — see Troubleshooting. You should see a
          red error box explaining this.
        </GuideP>
      </GuideSection>

      {/* 7 Jobs */}
      <GuideSection id="jobs" title="7. Jobs — history & results" icon="▣" accent="blue" defaultOpen={false}>
        <GuideP>
          Every run creates a <strong>job</strong> — a ticket with a unique ID, status, inputs, and
          outputs. View all jobs on <Link to="/jobs" className="q-link">Jobs</Link>.
        </GuideP>
        <GuideH3>Job states</GuideH3>
        <GuideUl>
          <li><strong>QUEUED / RUNNING</strong> — still in progress (usually seconds).</li>
          <li><strong>COMPLETED</strong> — success; results available.</li>
          <li><strong>FAILED</strong> — error message explains what went wrong.</li>
          <li><strong>REJECTED</strong> — policy engine blocked the job (e.g. cloud not allowed).</li>
        </GuideUl>
        <GuideH3>Job detail page</GuideH3>
        <GuideP>
          Click any job ID to open its detail page. If the job used a skill, you get a{" "}
          <strong>skill-aware result view</strong> (same charts as Skills page) plus a link back to
          that skill. Use <strong>Explain result</strong> to ask the ExplanationAgent for plain
          English. Expand <strong>Raw job JSON</strong> for the full technical payload.
        </GuideP>
      </GuideSection>

      {/* 8 Workbench */}
      <GuideSection id="workbench" title="8. Agent Workbench — multi-step pipelines" icon="🤖" accent="purple" defaultOpen={false}>
        <GuideP>
          The <Link to="/agent-workbench" className="q-link">Agent Workbench</Link> runs{" "}
          <strong>workflows</strong> — ordered sequences where multiple agents and skills cooperate.
          You see a <strong>timeline</strong> of each step: who ran, status, summary, and expandable
          output.
        </GuideP>
        <GuideH3>Four workflows</GuideH3>
        <GuideUl>
          <li>
            <strong>Portfolio Quantum Pipeline</strong> — Security policy → optimization plan →
            backend selection → portfolio job → natural-language explanation. Best for finance demos.
          </li>
          <li>
            <strong>Secure Circuit Pipeline</strong> — Optional crypto scan → circuit design → policy
            check → simulator run → explanation.
          </li>
          <li>
            <strong>Crypto Migration Assessment</strong> — Weak-crypto scan → migration skill → mock
            PQC encrypt → restricted-data policy review. Best for banking/security demos.
          </li>
          <li>
            <strong>Provider Research Benchmark</strong> — Same 2-qubit workload on Qiskit, PennyLane,
            mock, and classical; compare results side by side.
          </li>
        </GuideUl>
        <GuideP>
          Select a workflow, edit the JSON task if you want (or keep defaults), click{" "}
          <strong>Run workflow</strong>, and read the recommendation at the bottom.
        </GuideP>
      </GuideSection>

      {/* 9 Agents */}
      <GuideSection id="agents" title="9. Agents — individual helpers" icon="🧠" accent="blue" defaultOpen={false}>
        <GuideP>
          Agents are small decision-makers. The Agents page (reachable from Workbench sidebar context)
          lets you run <strong>one agent at a time</strong> with a JSON task.
        </GuideP>
        <GuideH3>The six agents</GuideH3>
        <GuideUl>
          <li><strong>BackendSelectionAgent</strong> — Recommends which provider to use for a job type and budget.</li>
          <li><strong>CircuitGenerationAgent</strong> — Suggests a simple circuit structure for N qubits.</li>
          <li><strong>OptimizationAgent</strong> — Plans an optimization approach.</li>
          <li><strong>CryptoMigrationAgent</strong> — Scans code snippets for legacy cryptography.</li>
          <li><strong>SecurityPolicyAgent</strong> — Checks whether a job meets security policy.</li>
          <li><strong>ExplanationAgent</strong> — Explains a job result in plain language.</li>
        </GuideUl>
        <GuideP>
          For chained multi-step runs, use Agent Workbench instead of running agents one by one.
        </GuideP>
      </GuideSection>

      {/* 10 Playground */}
      <GuideSection id="playground" title="10. Playground" icon="⚗" accent="amber" defaultOpen={false}>
        <GuideP>
          <Link to="/playground" className="q-link">Playground</Link> is a sandbox: submit any skill
          as a job via a dropdown and JSON input, without going through Use Cases. Includes a
          separate crypto migration scan using the agent directly.
        </GuideP>
        <GuideP>
          Use Playground when you already know which skill and inputs you want. Use{" "}
          <Link to="/skills" className="q-link">Skills</Link> when you prefer forms and charts.
        </GuideP>
      </GuideSection>

      {/* 11 Providers */}
      <GuideSection id="providers" title="11. Providers — where work runs" icon="◎" accent="indigo" defaultOpen={false}>
        <GuideP>
          A <strong>provider</strong> is an execution backend — software that actually runs quantum
          or classical work. See status on <Link to="/providers" className="q-link">Providers</Link>.
        </GuideP>
        <GuideH3>Integrated quantum stacks</GuideH3>
        <GuideUl>
          <li><strong>qiskit_aer</strong> — IBM Qiskit Aer local simulator (free, open source).</li>
          <li><strong>pennylane_default_qubit</strong> — PennyLane local simulator (free).</li>
          <li><strong>origin_quantum</strong> — Origin Quantum (China): free local CPUQVM; WuKong cloud QPU with API key (research program).</li>
          <li><strong>azure_quantum</strong> — Microsoft Azure Quantum (Rigetti, IonQ, simulators) — needs Azure workspace.</li>
          <li><strong>ibm_quantum</strong> — IBM Quantum cloud — free tier with token.</li>
          <li><strong>mock_provider</strong> — Practice mode when SDKs are not installed.</li>
          <li><strong>classical_local</strong> — Classical optimizers for portfolio/route skills.</li>
        </GuideUl>
        <GuideP>
          For a research-paper style explanation of how quantum execution works in QuantumOS, see{" "}
          <code>docs/QUANTUM_RESEARCH.md</code> in the repository (Bell states, providers, job lifecycle).
        </GuideP>
        <GuideP>
          Click <strong>Test</strong> next to a provider to run a small hello_quantum job on it. Use{" "}
          <strong>Ask agent: best backend</strong> to see BackendSelectionAgent&apos;s recommendation.
        </GuideP>
      </GuideSection>

      {/* 12 Security */}
      <GuideSection id="security" title="12. Security Center" icon="🔐" accent="rose" defaultOpen={false}>
        <GuideP>
          <Link to="/security" className="q-link">Security Center</Link> handles encryption demos and
          code scanning. The yellow banner is important: this uses <strong>mock PQC</strong> (Fernet
          symmetric demo), <em>not</em> certified NIST post-quantum algorithms.
        </GuideP>
        <GuideH3>Tabs</GuideH3>
        <GuideUl>
          <li><strong>Encrypt</strong> — Turn a JSON payload into ciphertext.</li>
          <li><strong>Decrypt</strong> — Reverse encrypt (ciphertext pre-fills after encrypt).</li>
          <li><strong>Sign / Verify</strong> — Demo signature flow.</li>
          <li><strong>Migration scan</strong> — Paste code; agent flags RSA, MD5, ECC patterns.</li>
        </GuideUl>
        <GuideP>
          The <code>crypto_migration_scan</code> skill on the Skills page does similar scanning with
          a richer UI (line numbers, severity badges).
        </GuideP>
      </GuideSection>

      {/* 13 Audit & Policies */}
      <GuideSection id="audit-policies" title="13. Audit & Policies" icon="📋" accent="amber" defaultOpen={false}>
        <GuideH3>Audit log</GuideH3>
        <GuideP>
          <Link to="/audit" className="q-link">Audit</Link> lists every significant operation:
          job created, started, completed, failed, policy decisions. Each row has a{" "}
          <strong>hash</strong> linking to the previous event (hash chain) so tampering is detectable.
          This is how regulated industries prove <em>what happened when</em>.
        </GuideP>
        <GuideH3>Policies</GuideH3>
        <GuideP>
          <Link to="/policies" className="q-link">Policies</Link> shows the active YAML rules — e.g.
          block cloud quantum without approval, enforce cost limits. In MVP you can read but not edit
          from the dashboard.
        </GuideP>
      </GuideSection>

      {/* 14 Reading results */}
      <GuideSection id="reading-results" title="14. How to read results" icon="📊" accent="emerald" defaultOpen={false}>
        <GuideH3>Skill results vs provider results</GuideH3>
        <GuideP>
          A job result often has two layers. <strong>Skill output</strong> (under{" "}
          <code>result.skill</code>) is the feature logic — portfolio weights, BB84 timeline, scan
          findings. <strong>Provider output</strong> is from the simulator/backend — e.g.{" "}
          <code>counts</code> for quantum measurements, or <code>provider</code> name.
        </GuideP>
        <GuideH3>Visual result types</GuideH3>
        <GuideUl>
          <li><strong>Circuit</strong> — Gate list + histogram bars for qubit measurement states.</li>
          <li><strong>Entropy</strong> — Hex random data + entropy progress bar.</li>
          <li><strong>BB84</strong> — Stats cards + sifted key preview + basis-matching table.</li>
          <li><strong>Portfolio</strong> — Pie chart + return/volatility numbers.</li>
          <li><strong>Route</strong> — Numbered stop list with km between legs.</li>
          <li><strong>Encryption</strong> — Plaintext/ciphertext preview + warning banner.</li>
          <li><strong>Findings</strong> — Risk badge + per-line security issues with severity.</li>
        </GuideUl>
      </GuideSection>

      {/* 15 Demo vs real */}
      <GuideSection id="demo-vs-real" title="15. What is demo vs real" icon="⚠️" accent="amber" defaultOpen={false}>
        <GuideUl>
          <li><strong>Real on your laptop:</strong> API server, database, job queue, audit log, policy checks, UI, agent logic, skill handlers.</li>
          <li><strong>Simulated / educational:</strong> Quantum circuits (software simulator), BB84 QKD (not hardware), portfolio/route (heuristics not live markets).</li>
          <li><strong>Mock / not production:</strong> PQC encryptor (Fernet demo), QRNG (OS randomness not hardware QRNG), cloud quantum providers (disabled placeholders).</li>
          <li><strong>Not connected:</strong> Real banks, stock exchanges, delivery fleets, telecom fiber links.</li>
        </GuideUl>
        <GuideP>
          Labels like <code>mock_provider</code> and banners in Security Center are intentional —
          they tell you when you are in practice mode.
        </GuideP>
      </GuideSection>

      {/* 16 Learning paths */}
      <GuideSection id="learning-paths" title="16. Suggested learning paths" icon="🪜" accent="emerald" defaultOpen={false}>
        <GuideH3>Path A — Complete beginner (15 minutes)</GuideH3>
        <GuideOl>
          <li>Check top bar is <strong>Online</strong>.</li>
          <li>Use Cases → <strong>High-entropy API session nonce</strong> → Run.</li>
          <li>Use Cases → <strong>Last-mile delivery</strong> → Run.</li>
          <li>Skills → <strong>portfolio_optimizer</strong> → change risk to High → Run.</li>
          <li>Jobs → open your latest job → Explain result.</li>
        </GuideOl>
        <GuideH3>Path B — Security focus</GuideH3>
        <GuideOl>
          <li>Security Center → Migration scan tab → scan sample code.</li>
          <li>Skills → <strong>crypto_migration_scan</strong> → paste your own snippet.</li>
          <li>Agent Workbench → <strong>Crypto Migration Assessment</strong> workflow.</li>
          <li>Audit → see events logged.</li>
        </GuideOl>
        <GuideH3>Path C — Quantum curiosity</GuideH3>
        <GuideOl>
          <li>Skills → <strong>hello_quantum</strong> → try 1024 shots.</li>
          <li>Skills → <strong>bb84_simulator</strong> → read QBER and sifted key.</li>
          <li>Providers → test <strong>qiskit_aer</strong> if available.</li>
          <li>Agent Workbench → <strong>Provider Research Benchmark</strong>.</li>
        </GuideOl>
      </GuideSection>

      {/* 17 Glossary */}
      <GuideSection id="glossary" title="17. Glossary" icon="📖" accent="amber" defaultOpen={false}>
        <dl className="space-y-4">
          {[
            ["Quantum computer", "Hardware using quantum physics for certain computations. Not used for email or web browsing."],
            ["Qubit", "Quantum bit — can represent 0, 1, or a combination (superposition) until measured."],
            ["Simulator", "Software mimicking a quantum computer on a normal PC. Safe for learning."],
            ["Job", "One unit of work you asked QuantumOS to perform, with inputs and results."],
            ["Skill", "A reusable mini-app (portfolio optimizer, BB84 sim, etc.) with its own UI."],
            ["Provider / Backend", "Where a job executes — simulator, classical engine, or mock."],
            ["Agent", "A helper that makes one focused decision or analysis step."],
            ["Workflow", "Several agents and skills chained in order."],
            ["Post-quantum (PQC)", "New cryptography designed to resist future quantum attacks."],
            ["QKD", "Quantum Key Distribution — sharing secret keys using quantum physics (BB84 is one protocol)."],
            ["QBER", "Quantum Bit Error Rate — fraction of sifted bits that disagree; link quality metric."],
            ["Policy", "Rules that allow or block jobs (cost, cloud, data classification)."],
            ["Audit hash chain", "Linked cryptographic hashes proving log integrity."],
          ].map(([term, def]) => (
            <div key={term}>
              <dt className="font-semibold text-amber-900">{term}</dt>
              <dd className="text-slate-600 mt-0.5">{def}</dd>
            </div>
          ))}
        </dl>
      </GuideSection>

      {/* 18 FAQ */}
      <GuideSection id="faq" title="18. Frequently asked questions" icon="❓" accent="blue" defaultOpen={false}>
        <div className="space-y-5">
          {[
            ["Do I need a quantum computer?", "No. Simulators and mock providers run on your laptop."],
            ["Is my bank account at risk?", "No. This is a local demo with no external financial connections."],
            ["Why is the Skills page empty?", "The API server is probably offline. Top bar should say Online; restart uvicorn on port 8000."],
            ["What should I click first?", "Use Cases → High-entropy API session nonce, or Skills → any card."],
            ["Why mock_provider?", "Practice mode — predictable demo output when simulators aren't installed."],
            ["Can I break anything?", "No. Worst case: stop and restart the local server."],
            ["What's the difference between Use Cases and Skills?", "Use Cases are industry stories (some use workflows). Skills are the underlying tools with full interactive UIs."],
            ["Where do developers go?", "Dev Guide in the sidebar, or README in the repo."],
          ].map(([q, a]) => (
            <div key={q}>
              <p className="font-semibold text-slate-900">{q}</p>
              <p className="text-slate-600 mt-1">{a}</p>
            </div>
          ))}
        </div>
      </GuideSection>

      {/* 19 Troubleshooting */}
      <GuideSection id="troubleshooting" title="19. Troubleshooting" icon="🔧" accent="rose" defaultOpen={false}>
        <GuideH3>Top bar says Offline</GuideH3>
        <GuideP>Start the API from the project folder (Windows PowerShell):</GuideP>
        <pre className="text-xs bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto font-mono">
{`cd quantumos
$env:PYTHONPATH = (Get-Location)
$env:DATABASE_URL = "sqlite:///./quantumos_local.db"
.\\.venv2\\Scripts\\uvicorn apps.api.quantumos_api.main:app --host 127.0.0.1 --port 8000`}
        </pre>
        <GuideP>Then start the dashboard (separate terminal):</GuideP>
        <pre className="text-xs bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto font-mono">
{`cd apps/dashboard
$env:VITE_API_URL = "http://127.0.0.1:8000"
npm run dev -- --host 127.0.0.1 --port 5173`}
        </pre>
        <GuideP>Or run <code>.\scripts\start-local.ps1</code> on Windows.</GuideP>
        <GuideH3>Buttons do nothing / stale page</GuideH3>
        <GuideUl>
          <li>Hard refresh: Ctrl+Shift+R.</li>
          <li>Confirm you are on the port Vite printed (5173 or 5174 if 5173 was busy).</li>
          <li>Check only one API is running on port 8000.</li>
        </GuideUl>
        <GuideH3>Job FAILED</GuideH3>
        <GuideP>Open the job detail page and read the error field. Common causes: invalid JSON input, missing provider, policy rejection.</GuideP>
      </GuideSection>

      <div className="text-center text-sm text-slate-500 pt-4">
        <Link to="/use-cases" className="q-link">
          Ready? Start with Use Cases →
        </Link>
      </div>
    </div>
  );
}
