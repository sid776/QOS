import type { ReactNode } from "react";
import type { AnalyzeResult } from "./types";
import { DonutChart, EntropyWaveVisual, MetricTiles, RouteMapVisual, ShieldVaultVisual } from "./visuals/ChartPrimitives";
import { ScenarioHeroVisual } from "./visuals/ScenarioVisuals";

type Output = Record<string, unknown>;

function StatGrid({ items }: { items: [string, string | number][] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
      {items.map(([label, val]) => (
        <div key={label} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-slate-500 text-xs uppercase tracking-wide">{label}</p>
          <p className="font-semibold text-slate-800 mt-0.5">{String(val)}</p>
        </div>
      ))}
    </div>
  );
}

function EntropyNonceBlock({ output }: { output: Output }) {
  const entropy = Number(output.entropy_bits_per_byte ?? 0);
  const max = Number(output.max_entropy ?? 8);
  const hex = String(output.random_hex ?? "");
  const bits = Number(output.bits ?? 0) || Number(output.bytes ?? 0) * 8 || (hex.length / 2) * 8;

  return (
    <div className="rounded-2xl border border-cyan-200/80 bg-gradient-to-br from-cyan-50/80 to-white p-5 space-y-4 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase text-cyan-800 tracking-wider">Step 1 — Session nonce (QRNG)</p>
        <p className="text-sm text-slate-600 mt-1">
          High-entropy random bytes bind this encryption to your active session. Unpredictable even if an
          attacker knows your server software.
        </p>
      </div>
      <EntropyWaveVisual hex={hex} entropy={entropy} max={max} />
      <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-xl break-all border border-slate-700 shadow-inner">
        {hex || "—"}
      </div>
      <p className="text-xs text-slate-500">
        Source: {String(output.source ?? "qrng_interface")} · {bits} bits total · Preview:{" "}
        {String(output.random_binary_preview ?? "").slice(0, 64)}
        {(String(output.random_binary_preview ?? "").length > 64 ? "…" : "")}
      </p>
    </div>
  );
}

function AccountVaultBlock({ encryption }: { encryption: Output }) {
  const stack = encryption.algorithm_stack as string[] | undefined;
  const flow = encryption.encryption_flow as string[] | undefined;
  const compliance = encryption.standards_compliance as string[] | undefined;
  const pkg = encryption.vault_package as Output | undefined;

  return (
    <div className="rounded-2xl border-2 border-indigo-200/80 bg-gradient-to-br from-indigo-50/60 to-white p-5 space-y-4 shadow-sm visual-glow">
      <div className="flex flex-wrap gap-6 items-start">
        <ShieldVaultVisual layers={stack ?? ["ML-KEM-768", "AES-256-GCM", "ML-DSA-65"]} />
        <div className="flex-1 min-w-[200px] space-y-3">
          <div>
            <p className="text-xs font-bold uppercase text-indigo-800 tracking-wider">Step 2 — NIST post-quantum vault</p>
            <p className="text-sm text-slate-600 mt-1">
              ML-KEM-768 + AES-256-GCM + ML-DSA-65. Cannot be decrypted by classical or quantum computers.
            </p>
          </div>
          {stack && (
            <div className="flex flex-wrap gap-2">
              {stack.map((algo) => (
                <span key={algo} className="text-xs font-semibold bg-indigo-100 text-indigo-900 px-2.5 py-1 rounded-lg border border-indigo-200/60">
                  {algo}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {flow && (
        <ol className="text-sm text-slate-700 space-y-1.5 list-decimal list-inside bg-white/60 rounded-xl p-4 border border-indigo-100">
          {flow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )}
      {pkg && (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
            <dt className="text-xs text-slate-500">Account</dt>
            <dd className="font-medium">{String(pkg.account_id ?? "—")}</dd>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
            <dt className="text-xs text-slate-500">Tenant</dt>
            <dd className="font-medium font-mono text-xs">{String(pkg.tenant_id ?? "—")}</dd>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200 sm:col-span-2 shadow-sm">
            <dt className="text-xs text-slate-500">KEM ciphertext (ML-KEM-768)</dt>
            <dd className="font-mono text-xs break-all text-indigo-800">
              {String(pkg.kem_ciphertext_b64 ?? "").slice(0, 80)}…
            </dd>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200 sm:col-span-2 shadow-sm">
            <dt className="text-xs text-slate-500">Encrypted payload (AES-256-GCM)</dt>
            <dd className="font-mono text-xs break-all text-slate-800">
              {String(encryption.ciphertext_preview ?? pkg.ciphertext_b64 ?? "").slice(0, 120)}
            </dd>
          </div>
        </dl>
      )}
      {compliance && (
        <ul className="text-xs text-slate-600 space-y-1 border-t border-indigo-100 pt-3">
          {compliance.map((s) => (
            <li key={s}>✓ {s}</li>
          ))}
        </ul>
      )}
      {Boolean(encryption.quantum_safe) && (
        <p className="text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-xl px-4 py-2 border border-emerald-200">
          ✓ Vault sealed — account not decryptable by quantum adversaries
        </p>
      )}
    </div>
  );
}

function PortfolioBlock({ output }: { output: Output }) {
  const chart = (output.chart as { asset: string; weight_pct: number; usd: number }[]) ?? [];
  const alloc = output.allocation as Record<string, number> | undefined;
  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
  const segments = chart.length
    ? chart.map((c, i) => ({ label: c.asset, value: c.weight_pct || c.usd, color: colors[i % colors.length] }))
    : alloc
      ? Object.entries(alloc).map(([asset, usd], i) => ({ label: asset, value: Number(usd), color: colors[i % colors.length] }))
      : [];

  const rows =
    chart.length > 0
      ? chart
      : alloc
        ? Object.entries(alloc).map(([asset, usd]) => ({ asset, weight_pct: 0, usd: Number(usd) }))
        : [];

  return (
    <div className="space-y-4">
      {segments.length > 0 && (
        <DonutChart
          segments={segments}
          centerValue={`${(Number(output.expected_annual_return ?? 0) * 100).toFixed(1)}%`}
          centerLabel="exp. return"
        />
      )}
      <div className="space-y-2">
        {rows.map((c, i) => (
          <div key={c.asset} className="flex items-center gap-2 text-sm bg-white rounded-lg px-3 py-2 border border-slate-100">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: colors[i % colors.length] }} />
            <span className="font-medium w-16">{c.asset}</span>
            {c.weight_pct > 0 && <span className="text-slate-500">{c.weight_pct}%</span>}
            <span className="ml-auto font-mono">${Number(c.usd).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <StatGrid
        items={[
          ["Expected return", `${(Number(output.expected_annual_return ?? 0) * 100).toFixed(2)}%`],
          ["Volatility", `${(Number(output.portfolio_volatility ?? 0) * 100).toFixed(2)}%`],
          ["Method", String(output.method ?? "optimizer")],
          ["Budget", output.budget ? `$${Number(output.budget).toLocaleString()}` : "—"],
        ]}
      />
    </div>
  );
}

function RouteBlock({ output, accent }: { output: Output; accent: string }) {
  const ordered = (output.ordered_stops as string[]) ?? [];
  const legs = (output.legs as { from: string; to: string; distance_km: number }[]) ?? [];
  const color = accent.includes("emerald") ? "#34d399" : accent.includes("blue") ? "#3b82f6" : "#6366f1";
  return (
    <div className="space-y-4">
      <RouteMapVisual stops={ordered.length ? ordered : ["Depot"]} legs={legs} accent={color} />
      <StatGrid
        items={[
          ["Total distance", `${output.total_distance_km ?? "—"} km`],
          ["Stops", ordered.length],
          ["Method", String(output.method ?? "optimizer")],
          ["Return to depot", output.return_to_start ? "Yes" : "No"],
        ]}
      />
      <ol className="space-y-0">
        {ordered.map((stop, i) => (
          <li key={`${stop}-${i}`} className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
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

function CircuitBlock({ output, accent }: { output: Output; accent: string }) {
  const circuit = output.circuit as { gates?: { gate: string; label: string }[] } | undefined;
  const expected = output.expected_distribution as Record<string, number> | null | undefined;
  const color = accent.includes("amber") ? "#fbbf24" : accent.includes("teal") ? "#2dd4bf" : "#818cf8";
  return (
    <div className="space-y-4">
      <StatGrid
        items={[
          ["Qubits", Number(output.qubits ?? 0)],
          ["Shots", Number(output.shots ?? 0)],
          ["Material", String(output.material ?? output.compound ?? output.fab ?? "—")],
          ["Yield / fidelity", String(output.yield_pct ?? output.binding_kcal_mol ?? "—")],
        ]}
      />
      {circuit?.gates && (
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500 mb-2 tracking-wider">Circuit gates</p>
          <ol className="space-y-1">
            {circuit.gates.map((g, i) => (
              <li key={i} className="text-sm bg-violet-50 border border-violet-100 rounded-xl px-3 py-2 font-mono flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-violet-200 text-violet-800 text-[10px] flex items-center justify-center font-bold">{i + 1}</span>
                {g.gate} — {g.label}
              </li>
            ))}
          </ol>
        </div>
      )}
      {expected && (
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500 mb-2 tracking-wider">Measurement distribution</p>
          <div className="space-y-2">
            {Object.entries(expected).map(([state, count]) => (
              <div key={state} className="flex items-center gap-3 text-sm">
                <span className="font-mono w-16">{state}</span>
                <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${count * 100}%`, background: color }} />
                </div>
                <span className="font-mono text-slate-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GenericMetricsBlock({ output, method }: { output: Output; method?: string }) {
  const skip = new Set(["circuit", "chart", "legs", "ordered_stops", "account_encryption", "random_hex"]);
  const entries = Object.entries(output).filter(
    ([k, v]) => !skip.has(k) && (typeof v === "string" || typeof v === "number" || typeof v === "boolean")
  );
  return (
    <div className="space-y-3">
      {method && <p className="text-sm text-slate-600">{method}</p>}
      <StatGrid items={entries.slice(0, 8).map(([k, v]) => [k.replace(/_/g, " "), String(v)]) as [string, string][]} />
    </div>
  );
}

type Props = {
  useCaseId: string;
  quantum?: AnalyzeResult["quantum"];
  accent: string;
};

function ResultShell({
  useCaseId,
  output,
  accent,
  children,
}: {
  useCaseId: string;
  output: Output;
  accent: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="visual-hero">
        <ScenarioHeroVisual useCaseId={useCaseId} output={output} accent={accent} />
      </div>
      {children}
    </div>
  );
}

export default function FeatureResultView({ useCaseId, quantum, accent }: Props) {
  const output = quantum?.output as Output | undefined;
  if (!output) return <p className="text-slate-500 text-sm">No feature output available.</p>;

  if (useCaseId === "cloud_api_entropy" || useCaseId === "crypto_pqc_wallet_hardening") {
    const enc = output.account_encryption as Output | undefined;
    if (useCaseId === "crypto_pqc_wallet_hardening") {
      return (
        <ResultShell useCaseId={useCaseId} output={output} accent={accent}>
          <MetricTiles
            tiles={[
              { label: "Chain", value: String(output.chain ?? "—"), icon: "⛓️" },
              { label: "Wallet", value: `${String(output.wallet_address ?? "").slice(0, 12)}…`, icon: "🔑" },
              { label: "Holdings", value: `$${Number(output.holdings_usd ?? 0).toLocaleString()}`, icon: "₿" },
              { label: "Timeline", value: String(output.migration_timeline ?? "2027"), icon: "📅" },
            ]}
          />
          {enc && <AccountVaultBlock encryption={enc} />}
          {Boolean(output.quantum_safe) && (
            <p className="text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-200">
              ✓ Wallet hardened — immune to harvest-now-decrypt-later quantum attacks
            </p>
          )}
        </ResultShell>
      );
    }
    return (
      <ResultShell useCaseId={useCaseId} output={output} accent={accent}>
        <EntropyNonceBlock output={output} />
        {enc && <AccountVaultBlock encryption={enc} />}
      </ResultShell>
    );
  }

  if (useCaseId === "ai_llm_quantum_retrieval") {
    return (
      <ResultShell useCaseId={useCaseId} output={output} accent={accent}>
        <StatGrid
          items={[
            ["Corpus", String(output.corpus ?? "—")],
            ["Recall@K", `${output.recall_at_k ?? "—"}%`],
            ["Top-K", Number(output.top_k ?? 10)],
            ["Vectors examined", Number(output.vectors_examined ?? 0).toLocaleString()],
          ]}
        />
        <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/80 to-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-purple-800 mb-1 tracking-wider">Query</p>
          <p className="text-sm text-slate-800">{String(output.query ?? "—")}</p>
        </div>
        <CircuitBlock output={output} accent={accent} />
      </ResultShell>
    );
  }

  if (useCaseId === "genomics_protein_folding") {
    return (
      <ResultShell useCaseId={useCaseId} output={output} accent={accent}>
        <CircuitBlock output={output} accent={accent} />
      </ResultShell>
    );
  }

  if (useCaseId === "smart_city_traffic_flow") {
    return (
      <ResultShell useCaseId={useCaseId} output={output} accent={accent}>
        <RouteBlock output={output} accent={accent} />
      </ResultShell>
    );
  }

  if (useCaseId === "fintech_portfolio_rebalance" || useCaseId === "energy_grid_quantum_dispatch") {
    return (
      <ResultShell useCaseId={useCaseId} output={output} accent={accent}>
        <PortfolioBlock output={output} />
      </ResultShell>
    );
  }

  if (useCaseId === "logistics_delivery_routes") {
    return (
      <ResultShell useCaseId={useCaseId} output={output} accent={accent}>
        <RouteBlock output={output} accent={accent} />
      </ResultShell>
    );
  }

  if (
    useCaseId === "automotive_battery_chemistry" ||
    useCaseId === "pharma_molecular_binding" ||
    useCaseId === "semiconductor_yield_quantum" ||
    useCaseId === "research_simulator_benchmark"
  ) {
    return (
      <ResultShell useCaseId={useCaseId} output={output} accent={accent}>
        <CircuitBlock output={output} accent={accent} />
      </ResultShell>
    );
  }

  if (useCaseId === "finance_quantum_monte_carlo") {
    return (
      <ResultShell useCaseId={useCaseId} output={output} accent={accent}>
        <GenericMetricsBlock
          output={output}
          method={`Quantum amplitude estimation for ${String(output.book ?? "trading book")}`}
        />
      </ResultShell>
    );
  }

  if (useCaseId === "telecom_qkd_link_planning") {
    return (
      <ResultShell useCaseId={useCaseId} output={output} accent={accent}>
        <StatGrid
          items={[
            ["Raw bits", Number(output.raw_bits ?? 0)],
            ["Sifted key", Number(output.sifted_key_length ?? 0)],
            ["QBER", String(output.qber ?? "—")],
            ["Link km", Number(output.link_distance_km ?? 0)],
          ]}
        />
        {output.sifted_key_preview != null && (
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 mb-2 tracking-wider">Sifted key preview</p>
            <p className="font-mono text-sm bg-emerald-50 p-4 rounded-xl border border-emerald-100 break-all shadow-inner">
              {String(output.sifted_key_preview)}
            </p>
          </div>
        )}
      </ResultShell>
    );
  }

  if (useCaseId === "bank_legacy_crypto_audit" || useCaseId === "insurance_fraud_feature_probe") {
    return (
      <ResultShell useCaseId={useCaseId} output={output} accent={accent}>
        <StatGrid
          items={[
            ["Findings", Number(output.finding_count ?? 0)],
            ["Risk", String(output.risk_level ?? "—")],
            ["Lines scanned", Number(output.lines_scanned ?? 0)],
            ["Policy", String(output.policy ?? output.pipeline ?? "—")],
          ]}
        />
        {output.recommendation != null && (
          <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-4 border border-slate-200">
            {String(output.recommendation)}
          </p>
        )}
      </ResultShell>
    );
  }

  return (
    <ResultShell useCaseId={useCaseId} output={output} accent={accent}>
      <GenericMetricsBlock output={output} method={quantum?.method} />
    </ResultShell>
  );
}
