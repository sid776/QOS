type SkillData = Record<string, unknown>;

function extractSkill(result?: Record<string, unknown>): SkillData | null {
  if (!result) return null;
  const skill = result.skill;
  if (skill && typeof skill === "object") return skill as SkillData;
  if (result.skill && typeof result.skill === "string") return result;
  return result;
}

function Histogram({ counts }: { counts: Record<string, number> }) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, v]) => v), 1);
  return (
    <div className="space-y-2">
      {entries.map(([state, count]) => (
        <div key={state} className="flex items-center gap-3 text-sm">
          <span className="font-mono w-16 text-slate-600">{state}</span>
          <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded transition-all"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="w-14 text-right text-slate-500">{count}</span>
        </div>
      ))}
    </div>
  );
}

function CircuitResult({ data }: { data: SkillData }) {
  const circuit = data.circuit as { gates?: { gate: string; label: string }[]; depth?: number } | undefined;
  const expected = data.expected_distribution as Record<string, number> | null | undefined;
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-700">{String(data.message ?? "")}</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-white rounded-xl p-3 border border-slate-200">
          <span className="text-slate-500">Qubits</span>
          <p className="text-xl font-semibold text-slate-800">{String(data.qubits)}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-200">
          <span className="text-slate-500">Shots</span>
          <p className="text-xl font-semibold text-slate-800">{String(data.shots)}</p>
        </div>
      </div>
      {circuit?.gates && (
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500 mb-2">Circuit steps</p>
          <ol className="space-y-1">
            {circuit.gates.map((g, i) => (
              <li key={i} className="text-sm bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 font-mono">
                {g.gate} — {g.label}
              </li>
            ))}
          </ol>
        </div>
      )}
      {expected && (
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500 mb-2">Expected distribution (2-qubit Bell)</p>
          <Histogram counts={expected} />
        </div>
      )}
    </div>
  );
}

function QrngResult({ data }: { data: SkillData }) {
  const entropy = Number(data.entropy_bits_per_byte ?? 0);
  const max = Number(data.max_entropy ?? 8);
  const pct = Math.min(100, (entropy / max) * 100);
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 text-emerald-400 font-mono text-sm p-4 rounded-xl break-all">
        {String(data.random_hex)}
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-600">Entropy (bits/byte)</span>
          <span className="font-semibold">{entropy} / {max}</span>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <p className="text-xs text-slate-500 font-mono">Binary preview: {String(data.random_binary_preview)}</p>
      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-2">{String(data.note)}</p>
    </div>
  );
}

function Bb84Result({ data }: { data: SkillData }) {
  const timeline = (data.timeline as { index: number; alice_bit: number; alice_basis: string; bob_basis: string; bases_match: boolean; in_sifted_key: boolean }[]) ?? [];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
        {[
          ["Raw bits", data.raw_bits],
          ["Matching bases", data.matching_bases],
          ["Sifted key", data.sifted_key_length],
          ["QBER", data.qber],
        ].map(([label, val]) => (
          <div key={String(label)} className="bg-white border border-emerald-100 rounded-xl p-3">
            <p className="text-slate-500 text-xs">{String(label)}</p>
            <p className="font-semibold text-emerald-800">{String(val)}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase text-slate-500 mb-2">Sifted key preview</p>
        <p className="font-mono text-sm bg-emerald-50 p-3 rounded-xl border border-emerald-100 break-all">
          {String(data.sifted_key_preview)}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2 pr-2">#</th>
              <th className="py-2 pr-2">Alice bit</th>
              <th className="py-2 pr-2">A basis</th>
              <th className="py-2 pr-2">B basis</th>
              <th className="py-2">Sifted</th>
            </tr>
          </thead>
          <tbody>
            {timeline.map((row) => (
              <tr key={row.index} className={row.in_sifted_key ? "bg-emerald-50" : ""}>
                <td className="py-1 pr-2 font-mono">{row.index}</td>
                <td className="py-1 pr-2">{row.alice_bit}</td>
                <td className="py-1 pr-2">{row.alice_basis}</td>
                <td className="py-1 pr-2">{row.bob_basis}</td>
                <td className="py-1">{row.in_sifted_key ? "✓" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PortfolioResult({ data }: { data: SkillData }) {
  const chart = (data.chart as { asset: string; weight_pct: number; usd: number }[]) ?? [];
  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
  let gradient = "conic-gradient(";
  let acc = 0;
  chart.forEach((c, i) => {
    const start = acc;
    acc += c.weight_pct;
    gradient += `${colors[i % colors.length]} ${start}% ${acc}%, `;
  });
  gradient = gradient.replace(/, $/, ")");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-6 items-center">
        <div
          className="w-32 h-32 rounded-full border-4 border-white shadow-md shrink-0"
          style={{ background: chart.length ? gradient : "#e2e8f0" }}
        />
        <div className="space-y-2 flex-1 min-w-[200px]">
          {chart.map((c, i) => (
            <div key={c.asset} className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: colors[i % colors.length] }} />
              <span className="font-medium w-16">{c.asset}</span>
              <span className="text-slate-500">{c.weight_pct}%</span>
              <span className="ml-auto font-mono">${c.usd.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p className="text-slate-500 text-xs">Expected return</p>
          <p className="font-semibold">{(Number(data.expected_annual_return) * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p className="text-slate-500 text-xs">Portfolio volatility</p>
          <p className="font-semibold">{(Number(data.portfolio_volatility) * 100).toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
}

function RouteResult({ data }: { data: SkillData }) {
  const legs = (data.legs as { from: string; to: string; distance_km: number }[]) ?? [];
  const ordered = (data.ordered_stops as string[]) ?? [];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-blue-800">
        Total: {String(data.total_distance_km)} km · {String(data.method)}
      </div>
      <ol className="space-y-0">
        {ordered.map((stop, i) => (
          <li key={`${stop}-${i}`} className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div className="flex-1 pb-4 border-l-2 border-blue-100 pl-4 -ml-4">
              <p className="font-medium text-slate-800">{stop}</p>
              {legs[i] && (
                <p className="text-xs text-slate-500">→ {legs[i].distance_km} km to {legs[i].to}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function AccountVaultResult({ data }: { data: SkillData }) {
  const stack = data.algorithm_stack as string[] | undefined;
  const flow = data.encryption_flow as string[] | undefined;
  const compliance = data.standards_compliance as string[] | undefined;
  const pkg = data.vault_package as SkillData | undefined;

  return (
    <div className="space-y-4">
      {stack && (
        <div className="flex flex-wrap gap-2">
          {stack.map((algo) => (
            <span key={algo} className="text-xs font-semibold bg-indigo-100 text-indigo-900 px-2.5 py-1 rounded-md">
              {algo}
            </span>
          ))}
        </div>
      )}
      {flow && (
        <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
          {flow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )}
      {pkg && (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <dt className="text-xs text-slate-500">Account</dt>
            <dd className="font-medium">{String(pkg.account_id ?? "—")}</dd>
          </div>
          <div className="bg-white rounded-lg p-3 border border-slate-200 sm:col-span-2">
            <dt className="text-xs text-slate-500">Encrypted payload</dt>
            <dd className="font-mono text-xs break-all text-slate-800">
              {String(data.ciphertext_preview ?? pkg.ciphertext_b64 ?? "").slice(0, 120)}
            </dd>
          </div>
        </dl>
      )}
      {compliance && (
        <ul className="text-xs text-slate-600 space-y-1">
          {compliance.map((s) => (
            <li key={s}>✓ {s}</li>
          ))}
        </ul>
      )}
      {Boolean(data.quantum_safe) && (
        <p className="text-sm font-semibold text-emerald-700">✓ Quantum-safe — not decryptable by quantum adversaries</p>
      )}
    </div>
  );
}

function PqcResult({ data }: { data: SkillData }) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-xl p-3">
        ⚠️ {String(data.production_warning)}
      </div>
      <div className="grid gap-3 text-sm">
        <div>
          <p className="text-slate-500 text-xs mb-1">Plaintext</p>
          <p className="font-mono bg-slate-50 p-2 rounded-lg">{String(data.plaintext_preview)}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-1">Ciphertext preview</p>
          <p className="font-mono bg-slate-900 text-rose-300 p-2 rounded-lg break-all text-xs">
            {String(data.ciphertext_preview)}
          </p>
        </div>
        <p className="text-slate-600">Algorithm: <span className="font-mono">{String(data.algorithm)}</span></p>
      </div>
    </div>
  );
}

function FindingsResult({ data }: { data: SkillData }) {
  const findings = (data.findings as { pattern: string; suggestion: string; line: number; severity: string; cwe: string; snippet: string }[]) ?? [];
  const risk = String(data.risk_level ?? "low");
  const riskColor =
    risk === "high" ? "bg-rose-100 text-rose-800" : risk === "medium" ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${riskColor}`}>
          Risk: {risk}
        </span>
        <span className="text-sm text-slate-600">{String(data.finding_count ?? findings.length)} findings · {String(data.lines_scanned)} lines scanned</span>
      </div>
      <p className="text-sm text-slate-700">{String(data.recommendation)}</p>
      {findings.length === 0 ? (
        <p className="text-emerald-700 bg-emerald-50 rounded-xl p-4 text-sm">No weak crypto patterns detected.</p>
      ) : (
        <div className="space-y-2">
          {findings.map((f, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-3 bg-white text-sm">
              <div className="flex flex-wrap gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded ${f.severity === "high" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-900"}`}>
                  {f.severity}
                </span>
                <span className="text-xs text-slate-500">Line {f.line} · {f.cwe}</span>
              </div>
              <p className="font-mono text-xs text-slate-600 mb-1">{f.snippet}</p>
              <p className="text-slate-800">{f.suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type Props = {
  skillName?: string;
  resultView?: string;
  jobResult?: Record<string, unknown>;
  providerOnly?: boolean;
};

const SKILL_RESULT_VIEW: Record<string, string> = {
  bb84_simulator: "bb84",
  crypto_migration_scan: "findings",
  hello_quantum: "circuit",
  portfolio_optimizer: "portfolio",
  pqc_encryptor: "encryption",
  account_vault_encrypt: "account_vault",
  qrng_demo: "entropy",
  route_optimizer: "route",
};

export default function SkillResultView({ skillName, resultView, jobResult }: Props) {
  const skillData = extractSkill(jobResult);
  const skillId = (skillData?.skill as string | undefined) ?? skillName;
  const view = resultView ?? (skillId ? SKILL_RESULT_VIEW[skillId] : undefined) ?? skillId ?? "json";

  if (!skillData && !jobResult) {
    return <p className="text-slate-500 text-sm">Run the skill to see results.</p>;
  }

  const counts = jobResult?.counts as Record<string, number> | undefined;

  return (
    <div className="space-y-5">
      {view === "circuit" && skillData && <CircuitResult data={skillData} />}
      {view === "entropy" && skillData && <QrngResult data={skillData} />}
      {view === "bb84" && skillData && <Bb84Result data={skillData} />}
      {view === "portfolio" && skillData && <PortfolioResult data={skillData} />}
      {view === "route" && skillData && <RouteResult data={skillData} />}
      {view === "encryption" && skillData && <PqcResult data={skillData} />}
      {view === "account_vault" && skillData && <AccountVaultResult data={skillData} />}
      {view === "findings" && skillData && <FindingsResult data={skillData} />}

      {counts && Object.keys(counts).length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500 mb-2">Provider measurement counts</p>
          <Histogram counts={counts} />
        </div>
      )}

      {jobResult?.provider != null && (
        <p className="text-xs text-slate-500">
          Provider: <span className="font-mono">{String(jobResult.provider)}</span>
        </p>
      )}
    </div>
  );
}

export { extractSkill };
