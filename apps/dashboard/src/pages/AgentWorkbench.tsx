import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi, postApi } from "../api";
import OSWindow from "../components/OSWindow";
import ActionButton from "../components/ActionButton";

type WorkflowMeta = {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: "blue" | "purple" | "emerald" | "amber";
  defaultTask: Record<string, unknown>;
};

const WORKFLOWS: WorkflowMeta[] = [
  {
    id: "portfolio_quantum_pipeline",
    title: "Portfolio Quantum Pipeline",
    description:
      "Security policy → optimization plan → backend selection → portfolio job → natural-language explanation.",
    icon: "📊",
    accent: "emerald",
    defaultTask: {
      assets: ["AAPL", "MSFT", "NVDA", "GOOGL"],
      budget: 250000,
      risk: "medium",
      constraints: { max_cost_usd: 0, allow_cloud_quantum: false },
    },
  },
  {
    id: "secure_circuit_pipeline",
    title: "Secure Circuit Pipeline",
    description:
      "Optional crypto scan → circuit design → policy check → simulator run → result explanation.",
    icon: "⚛",
    accent: "blue",
    defaultTask: {
      qubits: 2,
      shots: 1024,
      code: "RSA_private_key = load()\nsign = ECDSA.sign(msg)",
      constraints: { max_cost_usd: 0, allow_cloud_quantum: false },
    },
  },
  {
    id: "crypto_migration_assessment",
    title: "Crypto Migration Assessment",
    description:
      "Weak-crypto agent scan → migration skill → mock PQC demo → restricted-data policy review.",
    icon: "🛡",
    accent: "amber",
    defaultTask: {
      code: "from Crypto.Hash import MD5\nfrom Crypto.PublicKey import RSA\nkey = RSA.generate(2048)",
    },
  },
  {
    id: "research_benchmark",
    title: "Provider Research Benchmark",
    description: "Run the same circuit across Qiskit, PennyLane, mock, and classical providers; compare outcomes.",
    icon: "🔬",
    accent: "purple",
    defaultTask: { qubits: 2, shots: 256 },
  },
];

type Step = { step_id: string; agent: string; status: string; summary: string; output: unknown };
type WorkflowResult = {
  workflow_id: string;
  workflow_name: string;
  status: string;
  recommendation: string;
  final_job_id?: string;
  final_result?: unknown;
  steps: Step[];
  error?: string;
};

export default function AgentWorkbench() {
  const [selected, setSelected] = useState(WORKFLOWS[0]);
  const [taskJson, setTaskJson] = useState(JSON.stringify(WORKFLOWS[0].defaultTask, null, 2));
  const [result, setResult] = useState<WorkflowResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<string[]>([]);

  useEffect(() => {
    fetchApi<{ agents: string[]; workflows: string[] }>("/v1/agents").then((d) => {
      setAgents(d.agents);
    });
  }, []);

  const selectWorkflow = (w: WorkflowMeta) => {
    setSelected(w);
    setTaskJson(JSON.stringify(w.defaultTask, null, 2));
    setResult(null);
  };

  const runWorkflow = async () => {
    setLoading(true);
    setResult(null);
    try {
      const task = JSON.parse(taskJson);
      const r = await postApi<WorkflowResult>("/v1/agents/workflows/run", {
        workflow: selected.id,
        task,
      });
      setResult(r);
    } catch (e) {
      setResult({
        workflow_id: "",
        workflow_name: selected.id,
        status: "FAILED",
        recommendation: "",
        steps: [],
        error: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s: string) => {
    if (s === "completed" || s === "COMPLETED") return "text-emerald-600";
    if (s === "failed" || s === "FAILED" || s === "REJECTED") return "text-red-600";
    return "text-blue-400";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Agent Workbench</h2>
        <p className="text-slate-600 max-w-3xl">
          Multi-agent quantum pipelines orchestrate policy, planning, backend routing, job execution, and
          explanation — practical workflows you can run from the desktop.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <OSWindow title="Workflow Launcher" icon="🚀" accent="purple" width="full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {WORKFLOWS.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => selectWorkflow(w)}
                className={`text-left p-3 rounded-lg border transition ${
                  selected.id === w.id
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-slate-200 hover:border-slate-500 bg-slate-50/50"
                }`}
              >
                <span className="text-xl">{w.icon}</span>
                <h4 className="font-medium mt-1">{w.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{w.description}</p>
              </button>
            ))}
          </div>
          <label className="text-xs text-slate-500">Task payload (JSON)</label>
          <textarea
            className="w-full h-44 mt-1 bg-slate-50 border border-slate-200 rounded p-3 font-mono text-xs"
            value={taskJson}
            onChange={(e) => setTaskJson(e.target.value)}
          />
          <div className="mt-4 flex gap-3">
            <ActionButton onClick={runWorkflow} loading={loading}>
              Run {selected.title}
            </ActionButton>
            <ActionButton
              variant="secondary"
              onClick={() => setTaskJson(JSON.stringify(selected.defaultTask, null, 2))}
            >
              Reset task
            </ActionButton>
          </div>
        </OSWindow>

        <OSWindow
          title="Pipeline Timeline"
          icon="📡"
          accent={selected.accent}
          width="full"
          className={loading ? "opacity-90" : ""}
        >
          {!result && !loading && (
            <p className="text-slate-500 text-sm">Select a workflow and click Run to see agent steps here.</p>
          )}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-slate-100/50 rounded animate-pulse" />
              ))}
            </div>
          )}
          {result?.error && (
            <p className="text-red-600 text-sm">{result.error}</p>
          )}
          {result && !result.error && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`font-bold ${statusColor(result.status)}`}>{result.status}</span>
                <span className="text-xs font-mono text-slate-500">{result.workflow_id}</span>
              </div>
              <div className="relative border-l-2 border-slate-200 ml-3 pl-6 space-y-4">
                {result.steps.map((step, i) => (
                  <div key={step.step_id} className="relative">
                    <span className="absolute -left-[1.65rem] w-3 h-3 rounded-full bg-slate-200 border-2 border-cyan-500" />
                    <p className="text-xs text-blue-700 font-mono">{step.agent}</p>
                    <p className={`text-sm font-medium ${statusColor(step.status)}`}>{step.summary}</p>
                    {step.output != null && (
                      <details className="mt-1">
                        <summary className="text-xs text-slate-500 cursor-pointer">Output</summary>
                        <pre className="text-[10px] mt-1 bg-slate-100 p-2 rounded overflow-auto max-h-32">
                          {JSON.stringify(step.output, null, 2)}
                        </pre>
                      </details>
                    )}
                    {i < result.steps.length - 1 && (
                      <div className="text-[10px] text-slate-600 mt-1">↓</div>
                    )}
                  </div>
                ))}
              </div>
              {result.recommendation && (
                <div className="bg-blue-50 border border-blue-800/50 rounded p-3 text-sm">
                  <strong className="text-blue-600">Recommendation:</strong> {result.recommendation}
                </div>
              )}
              {result.final_job_id && (
                <Link to={`/jobs/${result.final_job_id}`} className="text-blue-600 text-sm hover:underline">
                  Open final job →
                </Link>
              )}
            </div>
          )}
        </OSWindow>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OSWindow title="Agent Registry" icon="🧠" accent="blue" width="full">
          <ul className="grid grid-cols-2 gap-2 text-sm font-mono">
            {agents.map((a) => (
              <li key={a} className="px-2 py-1.5 bg-slate-50 rounded border border-slate-200">
                {a}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500 mt-3">
            Single agents available via <Link to="/agents" className="text-blue-600">Agents app</Link>.
          </p>
        </OSWindow>

        <OSWindow title="Final Output" icon="📦" accent="emerald" width="full">
          {result?.final_result ? (
            <pre className="text-xs overflow-auto max-h-64 bg-slate-100 p-3 rounded">
              {JSON.stringify(result.final_result, null, 2)}
            </pre>
          ) : (
            <p className="text-slate-500 text-sm">Workflow result JSON appears here after a successful run.</p>
          )}
        </OSWindow>
      </div>
    </div>
  );
}
