import { useEffect, useState } from "react";
import { postApi, fetchApi } from "../api";
import OSWindow from "../components/OSWindow";
import ActionButton from "../components/ActionButton";

const AGENTS = [
  "BackendSelectionAgent",
  "CircuitGenerationAgent",
  "OptimizationAgent",
  "CryptoMigrationAgent",
  "SecurityPolicyAgent",
  "ExplanationAgent",
] as const;

const PRESETS: Record<string, string> = {
  BackendSelectionAgent: JSON.stringify(
    { job_type: "optimization", constraints: { max_cost_usd: 0, allow_cloud_quantum: false } },
    null,
    2
  ),
  CircuitGenerationAgent: JSON.stringify({ qubits: 3 }, null, 2),
  OptimizationAgent: JSON.stringify({ job_type: "optimization", constraints: { max_cost_usd: 0 } }, null, 2),
  CryptoMigrationAgent: JSON.stringify({ snippet: "RSA_sign(data)\nMD5_hash = md5(payload)" }, null, 2),
  SecurityPolicyAgent: JSON.stringify(
    { data_classification: "restricted", constraints: { allow_cloud_quantum: false } },
    null,
    2
  ),
  ExplanationAgent: JSON.stringify(
    { state: "COMPLETED", result: { counts: { "00": 512, "11": 512 } } },
    null,
    2
  ),
};

export default function Agents() {
  const [agent, setAgent] = useState<string>(AGENTS[0]);
  const [task, setTask] = useState(PRESETS[AGENTS[0]]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [workflows, setWorkflows] = useState<string[]>([]);

  useEffect(() => {
    fetchApi<{ workflows: string[] }>("/v1/agents").then((d) => setWorkflows(d.workflows || []));
  }, []);

  const onAgentChange = (name: string) => {
    setAgent(name);
    setTask(PRESETS[name] || "{}");
    setResult("");
  };

  const run = async () => {
    setLoading(true);
    try {
      const r = await postApi<{ agent: string; plan: unknown }>("/v1/agents/run", {
        agent,
        task: JSON.parse(task),
      });
      setResult(JSON.stringify(r, null, 2));
    } catch (e) {
      setResult(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="text-xl text-slate-800">Agents</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OSWindow title={`${agent}`} icon="🧠" accent="blue" width="full">
          <div className="flex flex-wrap gap-2 mb-4">
            {AGENTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => onAgentChange(a)}
                className={`text-xs px-2 py-1 rounded border ${
                  agent === a ? "border-cyan-500 bg-cyan-50" : "border-slate-200"
                }`}
              >
                {a.replace("Agent", "")}
              </button>
            ))}
          </div>
          <textarea
            className="w-full h-36 bg-slate-50 border border-slate-200 rounded p-2 font-mono text-xs mb-4"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <ActionButton onClick={run} loading={loading}>
            Run agent
          </ActionButton>
        </OSWindow>

        <OSWindow title="Agent Output" icon="📤" accent="emerald" width="full">
          {result ? (
            <pre className="text-xs overflow-auto max-h-80">{result}</pre>
          ) : (
            <p className="text-slate-500 text-sm">Output appears here.</p>
          )}
        </OSWindow>
      </div>

      <OSWindow title="Multi-Agent Workflows" icon="🔗" accent="purple" width="full">
        <p className="text-sm text-slate-600 mb-3">
          For orchestrated pipelines, use the Agent Workbench:
        </p>
        <ul className="text-sm font-mono space-y-1 text-blue-700/90">
          {workflows.map((w) => (
            <li key={w}>• {w}</li>
          ))}
        </ul>
      </OSWindow>
    </div>
  );
}
