import type { AnalyzeResult } from "../types";
import {
  DonutChart,
  DualBarCompare,
  EntropyWaveVisual,
  GridHeatmap,
  MetricTiles,
  RadialGauge,
  RouteMapVisual,
  ShieldVaultVisual,
  Sparkline,
  VaRTailChart,
  VisualPanel,
} from "./ChartPrimitives";

type Output = Record<string, unknown>;

const PALETTE = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#f97316"];

function hexFromAccent(accent: string): string {
  const map: Record<string, string> = {
    sky: "#38bdf8",
    blue: "#3b82f6",
    emerald: "#34d399",
    teal: "#2dd4bf",
    rose: "#fb7185",
    violet: "#a78bfa",
    cyan: "#22d3ee",
    amber: "#fbbf24",
    orange: "#fb923c",
    indigo: "#818cf8",
    lime: "#a3e635",
    fuchsia: "#e879f9",
    slate: "#94a3b8",
    purple: "#c084fc",
    pink: "#f472b6",
    yellow: "#facc15",
  };
  for (const [k, v] of Object.entries(map)) {
    if (accent.includes(k)) return v;
  }
  return "#6366f1";
}

function CircuitDiagram({ qubits = 4, accent }: { qubits?: number; accent: string }) {
  const color = hexFromAccent(accent);
  const n = Math.min(qubits, 6);
  return (
    <svg viewBox="0 0 200 80" className="w-full max-w-sm mx-auto">
      {Array.from({ length: n }, (_, i) => {
        const y = 15 + i * 12;
        return (
          <g key={i}>
            <line x1="10" y1={y} x2="190" y2={y} stroke="#e2e8f0" strokeWidth={1} />
            <text x="4" y={y + 3} fontSize={6} fill="#94a3b8">
              q{i}
            </text>
            {[40, 80, 120, 160].slice(0, 2 + (i % 3)).map((x, j) => (
              <rect key={j} x={x - 6} y={y - 5} width={12} height={10} rx={2} fill={color} opacity={0.85 - j * 0.15} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function ProteinHelix({ accent }: { accent: string }) {
  const color = hexFromAccent(accent);
  const pts = Array.from({ length: 24 }, (_, i) => {
    const x = 10 + i * 7;
    const y = 40 + Math.sin(i * 0.8) * 18;
    return `${x},${y}`;
  });
  return (
    <svg viewBox="0 0 180 80" className="w-full max-w-xs mx-auto">
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
      {pts.map((p, i) => {
        const [x, y] = p.split(",").map(Number);
        return i % 3 === 0 ? <circle key={i} cx={x} cy={y} r={3} fill={color} opacity={0.7} /> : null;
      })}
    </svg>
  );
}

function VectorSearchPlane({ recall, accent }: { recall: number; accent: string }) {
  const color = hexFromAccent(accent);
  const dots = Array.from({ length: 40 }, (_, i) => ({
    x: 15 + ((i * 17) % 170),
    y: 15 + ((i * 23) % 60),
    hit: i < recall / 3,
  }));
  return (
    <svg viewBox="0 0 200 90" className="w-full max-w-md mx-auto">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.hit ? 4 : 2.5} fill={d.hit ? color : "#cbd5e1"} opacity={d.hit ? 1 : 0.5} />
      ))}
      <circle cx="100" cy="45" r="22" fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6} />
      <text x="100" y="48" textAnchor="middle" fontSize={8} fill={color} fontWeight="bold">
        query
      </text>
    </svg>
  );
}

function QKDTimeline({ raw, sifted, qber }: { raw: number; sifted: number; qber: string }) {
  const pct = raw > 0 ? (sifted / raw) * 100 : 50;
  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center text-xs">
        <span className="w-20 text-slate-500">Alice → Bob</span>
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-violet-400" style={{ width: "100%" }} />
        </div>
        <span className="font-mono text-slate-600">{raw} raw</span>
      </div>
      <div className="flex gap-2 items-center text-xs">
        <span className="w-20 text-slate-500">Sifting</span>
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
        </div>
        <span className="font-mono text-emerald-700">{sifted} bits</span>
      </div>
      <p className="text-center text-xs text-slate-500">QBER {qber} · BB84 protocol</p>
    </div>
  );
}

function AuditRiskMeter({ findings, risk }: { findings: number; risk: string }) {
  const riskVal = risk === "critical" ? 90 : risk === "high" ? 70 : risk === "medium" ? 45 : 20;
  const colors: [string, string] = riskVal > 60 ? ["#ef4444", "#f97316"] : ["#f59e0b", "#eab308"];
  return (
    <div className="flex flex-wrap gap-6 justify-center items-center">
      <RadialGauge value={findings} max={Math.max(findings + 5, 10)} label="Findings flagged" colors={colors} />
      <RadialGauge value={riskVal} max={100} label={`Risk: ${risk}`} sublabel="/ 100" colors={colors} />
    </div>
  );
}

export function ScenarioHeroVisual({
  useCaseId,
  output,
  accent,
}: {
  useCaseId: string;
  output: Output;
  accent: string;
}) {
  const color = hexFromAccent(accent);

  switch (useCaseId) {
    case "fintech_portfolio_rebalance": {
      const chart = (output.chart as { asset: string; weight_pct: number; usd: number }[]) ?? [];
      const segments = chart.map((c, i) => ({ label: c.asset, value: c.weight_pct || c.usd, color: PALETTE[i % PALETTE.length] }));
      return (
        <VisualPanel title="Portfolio allocation" subtitle="Optimized asset mix" gradient={accent}>
          <DonutChart segments={segments.length ? segments : [{ label: "Equity", value: 60, color: PALETTE[0] }, { label: "Bonds", value: 40, color: PALETTE[1] }]} centerValue={`${(Number(output.expected_annual_return ?? 0) * 100).toFixed(1)}%`} centerLabel="exp. return" />
          <div className="mt-4">
            <Sparkline points={chart.map((c) => c.usd / 1000) || [40, 55, 48, 62, 58, 70]} color={color} />
            <p className="text-[10px] text-slate-400 mt-1 text-center">Capital deployment trajectory</p>
          </div>
        </VisualPanel>
      );
    }
    case "logistics_delivery_routes": {
      const ordered = (output.ordered_stops as string[]) ?? [];
      const legs = (output.legs as { distance_km: number }[]) ?? [];
      return (
        <VisualPanel title="Optimized route map" subtitle={`${output.total_distance_km ?? "—"} km total`} gradient={accent}>
          <RouteMapVisual stops={ordered.length ? ordered : ["Depot", "A", "B", "C"]} legs={legs} accent={color} />
        </VisualPanel>
      );
    }
    case "bank_legacy_crypto_audit":
    case "insurance_fraud_feature_probe":
      return (
        <VisualPanel title="Risk assessment" subtitle={String(output.policy ?? output.pipeline ?? "Security scan")} gradient={accent}>
          <AuditRiskMeter findings={Number(output.finding_count ?? 0)} risk={String(output.risk_level ?? "medium")} />
        </VisualPanel>
      );
    case "telecom_qkd_link_planning":
      return (
        <VisualPanel title="QKD key exchange" subtitle={`${output.link_distance_km ?? 0} km fiber link`} gradient={accent}>
          <QKDTimeline raw={Number(output.raw_bits ?? 0)} sifted={Number(output.sifted_key_length ?? 0)} qber={String(output.qber ?? "—")} />
        </VisualPanel>
      );
    case "cloud_api_entropy":
      return (
        <VisualPanel title="QRNG entropy spectrum" subtitle="Quantum random session nonce" gradient={accent}>
          <EntropyWaveVisual hex={String(output.random_hex ?? "")} entropy={Number(output.entropy_bits_per_byte ?? 0)} max={Number(output.max_entropy ?? 8)} />
        </VisualPanel>
      );
    case "crypto_pqc_wallet_hardening": {
      const enc = output.account_encryption as Output | undefined;
      const stack = (enc?.algorithm_stack as string[]) ?? ["ML-KEM-768", "AES-256-GCM", "ML-DSA-65"];
      return (
        <VisualPanel title="Post-quantum wallet vault" subtitle={String(output.chain ?? "Multi-chain")} gradient={accent}>
          <ShieldVaultVisual layers={stack} />
          <MetricTiles
            tiles={[
              { label: "Holdings", value: `$${Number(output.holdings_usd ?? 0).toLocaleString()}`, icon: "₿", tint: "from-yellow-50 to-amber-50" },
              { label: "Migration", value: String(output.migration_timeline ?? "2027"), icon: "🛡️" },
              { label: "Wallet", value: `${String(output.wallet_address ?? "").slice(0, 8)}…`, icon: "🔑" },
              { label: "Status", value: output.quantum_safe ? "Quantum-safe" : "Pending", icon: "✓", tint: "from-emerald-50 to-green-50" },
            ]}
          />
        </VisualPanel>
      );
    }
    case "automotive_battery_chemistry":
    case "pharma_molecular_binding":
    case "semiconductor_yield_quantum":
    case "research_simulator_benchmark":
      return (
        <VisualPanel title="Quantum circuit" subtitle={String(output.material ?? output.compound ?? output.fab ?? output.backend ?? "VQE proxy")} gradient={accent}>
          <CircuitDiagram qubits={Number(output.qubits ?? 4)} accent={accent} />
          {Boolean(output.expected_distribution) && (
            <div className="mt-4 space-y-1">
              {Object.entries(output.expected_distribution as Record<string, number>).slice(0, 4).map(([state, count]) => (
                <div key={state} className="flex items-center gap-2 text-xs">
                  <span className="font-mono w-12">{state}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded overflow-hidden">
                    <div className="h-full rounded" style={{ width: `${count * 100}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </VisualPanel>
      );
    case "energy_grid_quantum_dispatch": {
      const chart = (output.chart as { asset: string; weight_pct: number }[]) ?? [];
      return (
        <VisualPanel title="Grid dispatch mix" subtitle="Renewable + storage optimization" gradient={accent}>
          <DonutChart
            segments={chart.length ? chart.map((c, i) => ({ label: c.asset, value: c.weight_pct, color: PALETTE[i % PALETTE.length] })) : [{ label: "Solar", value: 35, color: "#facc15" }, { label: "Wind", value: 30, color: "#38bdf8" }, { label: "Storage", value: 35, color: "#34d399" }]}
            centerLabel="dispatch"
            centerValue="100%"
          />
        </VisualPanel>
      );
    }
    case "finance_quantum_monte_carlo":
      return (
        <VisualPanel title="VaR tail risk" subtitle={String(output.book ?? "Trading book")} gradient={accent}>
          <VaRTailChart classicalVar={Number(output.classical_var_usd ?? output.var_99_usd ?? 1e6)} quantumVar={Number(output.quantum_var_usd ?? output.var_99_usd ?? 8e5)} notional={Number(output.notional_usd ?? output.book_notional ?? 1e8)} />
        </VisualPanel>
      );
    case "ai_llm_quantum_retrieval":
      return (
        <VisualPanel title="Vector search space" subtitle={`Recall@K ${output.recall_at_k ?? "—"}%`} gradient={accent}>
          <VectorSearchPlane recall={Number(output.recall_at_k ?? 30)} accent={accent} />
        </VisualPanel>
      );
    case "genomics_protein_folding":
      return (
        <VisualPanel title="Protein fold preview" subtitle={String(output.protein ?? "Target structure")} gradient={accent}>
          <ProteinHelix accent={accent} />
          <MetricTiles
            tiles={[
              { label: "RMSD", value: `${output.rmsd_angstrom ?? "—"} Å`, icon: "📐" },
              { label: "Energy", value: `${output.folding_energy_kcal ?? "—"} kcal`, icon: "⚡" },
              { label: "Organism", value: String(output.organism ?? "—").slice(0, 12), icon: "🧬" },
              { label: "Method", value: "VQE", icon: "⚛" },
            ]}
          />
        </VisualPanel>
      );
    case "smart_city_traffic_flow":
      return (
        <VisualPanel title="Traffic flow heatmap" subtitle={String(output.metro ?? "Metro network")} gradient={accent}>
          <GridHeatmap rows={5} cols={10} intensity={0.75} label={`${Number(output.intersections ?? 0).toLocaleString()} intersections · avg ${output.commute_min ?? "—"} min commute`} />
        </VisualPanel>
      );
    default:
      return null;
  }
}

export function ScenarioComparisonVisuals({
  comparison,
  accent,
}: {
  useCaseId: string;
  comparison: NonNullable<AnalyzeResult["comparison"]>;
  accent: string;
}) {
  const topMetrics = comparison.metrics.slice(0, 3);
  const color = hexFromAccent(accent);

  return (
    <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/30 p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-6 justify-between">
        <RadialGauge
          value={Math.abs(comparison.improvement_pct)}
          max={100}
          label={comparison.improvement_label}
          sublabel="% uplift"
          colors={[color, "#a855f7"]}
          size={130}
        />
        <div className="flex-1 min-w-[200px] space-y-3">
          {topMetrics.map((m) => (
            <DualBarCompare
              key={m.name}
              label={m.label}
              classical={typeof m.classical === "number" ? m.classical : parseFloat(String(m.classical)) || 0}
              quantum={typeof m.quantum === "number" ? m.quantum : parseFloat(String(m.quantum)) || 0}
              unit={m.unit === "%" ? "%" : m.unit ? ` ${m.unit}` : ""}
              quantumGradient={accent}
              higherIsBetter={m.delta_pct >= 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
