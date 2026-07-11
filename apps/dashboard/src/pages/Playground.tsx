import { useState } from "react";
import JobForm from "../components/JobForm";
import { postApi, type JobDetail } from "../api";
import ActionButton from "../components/ActionButton";

export default function Playground() {
  const [lastJob, setLastJob] = useState<JobDetail | null>(null);
  const [migrateCode, setMigrateCode] = useState(
    "config = {'cipher': 'RSA', 'hash': 'MD5', 'curve': 'secp256k1'}"
  );
  const [migrateResult, setMigrateResult] = useState("");

  const runMigrationScan = async () => {
    const r = await postApi<{ agent: string; plan: unknown }>("/v1/agents/run", {
      agent: "CryptoMigrationAgent",
      task: { snippet: migrateCode },
    });
    setMigrateResult(JSON.stringify(r, null, 2));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Playground</h2>
        <p className="text-slate-600 max-w-2xl">
          Try QuantumOS end-to-end: submit jobs, scan crypto, and inspect results without using the CLI.
        </p>
      </div>

      <JobForm onComplete={setLastJob} redirectToJob={false} />

      {lastJob && (
        <div className="border border-emerald-800 rounded-lg p-4 bg-emerald-50">
          <h3 className="font-semibold text-emerald-600 mb-2">Last job result</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(lastJob, null, 2)}</pre>
        </div>
      )}

      <div className="border border-slate-200 rounded-lg p-5 bg-white">
        <h3 className="font-semibold mb-3">Crypto migration scan (agent)</h3>
        <textarea
          className="w-full h-24 bg-slate-50 border border-slate-300 rounded p-2 font-mono text-sm mb-3"
          value={migrateCode}
          onChange={(e) => setMigrateCode(e.target.value)}
        />
        <ActionButton onClick={runMigrationScan}>Scan for weak crypto</ActionButton>
        {migrateResult && (
          <pre className="mt-4 text-sm bg-slate-50 p-3 rounded overflow-auto">{migrateResult}</pre>
        )}
      </div>
    </div>
  );
}
