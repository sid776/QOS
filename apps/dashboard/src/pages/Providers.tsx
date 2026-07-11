import { useEffect, useState } from "react";
import { fetchApi, createJob, postApi } from "../api";
import ProviderStatusTable from "../components/ProviderStatusTable";
import ActionButton from "../components/ActionButton";

export default function Providers() {
  const [providers, setProviders] = useState<
    { name: string; available: boolean; capabilities: string[]; provider_type?: string }[]
  >([]);
  const [testResult, setTestResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApi<{ providers: typeof providers }>("/v1/providers").then((d) =>
      setProviders(d.providers)
    );
  }, []);

  const testProvider = async (providerName: string) => {
    setLoading(true);
    setTestResult(`Testing ${providerName}…`);
    try {
      const job = await createJob({
        job_type: "circuit_simulation",
        skill: "hello_quantum",
        input: { qubits: 2, shots: 256 },
        preferred_backend: providerName,
      });
      setTestResult(JSON.stringify(job, null, 2));
    } catch (e) {
      setTestResult(String(e));
    } finally {
      setLoading(false);
    }
  };

  const recommendBackend = async () => {
    setLoading(true);
    try {
      const r = await postApi<{ agent: string; plan: unknown }>("/v1/agents/run", {
        agent: "BackendSelectionAgent",
        task: {
          job_type: "circuit_simulation",
          constraints: { max_cost_usd: 0, allow_cloud_quantum: false },
        },
      });
      setTestResult(JSON.stringify(r, null, 2));
    } catch (e) {
      setTestResult(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Providers</h2>
        <ActionButton onClick={recommendBackend} loading={loading} variant="secondary">
          Ask agent: best backend
        </ActionButton>
      </div>

      <ProviderStatusTable providers={providers} />

      <section>
        <h3 className="font-semibold mb-3">Test a provider</h3>
        <p className="text-sm text-slate-600 mb-4">
          Runs a 2-qubit hello_quantum job on the selected backend.
        </p>
        <div className="flex flex-wrap gap-2">
          {providers
            .filter((p) => p.available)
            .map((p) => (
              <button
                key={p.name}
                type="button"
                disabled={loading}
                onClick={() => void testProvider(p.name)}
                className="px-3 py-1.5 rounded bg-slate-200 hover:bg-quantum-500 text-sm font-mono disabled:opacity-50"
              >
                Test {p.name}
              </button>
            ))}
        </div>
        {testResult && (
          <pre className="mt-4 text-sm bg-white p-4 rounded overflow-auto max-h-64">
            {testResult}
          </pre>
        )}
      </section>
    </div>
  );
}
