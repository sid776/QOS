import { useEffect, useState } from "react";
import { fetchApi, createJob, postApi } from "../api";
import ProviderStatusTable from "../components/ProviderStatusTable";
import ActionButton from "../components/ActionButton";

type Framework = {
  name: string;
  available: boolean;
  docs_url?: string;
  install?: string;
  note?: string;
};

export default function Providers() {
  const [providers, setProviders] = useState<
    { name: string; available: boolean; capabilities: string[]; provider_type?: string }[]
  >([]);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [testResult, setTestResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApi<{ providers: typeof providers }>("/v1/providers").then((d) =>
      setProviders(d.providers)
    );
    fetchApi<{ frameworks: Framework[] }>("/v1/providers/frameworks").then((d) =>
      setFrameworks(d.frameworks)
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

      {frameworks.length > 0 && (
        <section>
          <h3 className="font-semibold mb-2">Quantum software stack</h3>
          <p className="text-sm text-slate-600 mb-3">
            Which SDKs are importable on this server (Qiskit, PennyLane, TFQ, cuQuantum, Azure,
            IBM, NIST PQC). Install extras per README.
          </p>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse text-slate-800 text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-2 px-3 font-medium">Framework</th>
                  <th className="py-2 px-3 font-medium">Installed</th>
                  <th className="py-2 px-3 font-medium">Install hint</th>
                </tr>
              </thead>
              <tbody>
                {frameworks.map((f) => (
                  <tr key={f.name} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2 px-3 font-medium">
                      {f.docs_url ? (
                        <a
                          href={f.docs_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-quantum-700 hover:underline"
                        >
                          {f.name}
                        </a>
                      ) : (
                        f.name
                      )}
                    </td>
                    <td className="py-2 px-3">{f.available ? "Yes" : "No"}</td>
                    <td className="py-2 px-3 font-mono text-xs text-slate-600">
                      {f.available ? "—" : f.install || f.note || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

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
