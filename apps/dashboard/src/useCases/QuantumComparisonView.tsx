import { useEffect, useState } from "react";
import type { AnalyzeResult, CompareMetricRow } from "./types";
import { RadialGauge } from "./visuals/ChartPrimitives";
import { ScenarioComparisonVisuals } from "./visuals/ScenarioVisuals";

function formatVal(v: number | string, unit = ""): string {
  if (typeof v === "number") {
    if (unit === "%" || unit === "/100") return `${v}${unit === "/100" ? "/100" : unit}`;
    if (Number.isInteger(v)) return `${v.toLocaleString()}${unit ? ` ${unit.trim()}` : ""}`;
    return `${v.toFixed(2)}${unit ? ` ${unit.trim()}` : ""}`;
  }
  return `${v}${unit ? ` ${unit.trim()}` : ""}`;
}

function CompareBar({
  metric,
  index,
  animate,
  accent,
}: {
  metric: CompareMetricRow;
  index: number;
  animate: boolean;
  accent: string;
}) {
  const cNum = typeof metric.classical === "number" ? metric.classical : parseFloat(String(metric.classical)) || 0;
  const qNum = typeof metric.quantum === "number" ? metric.quantum : parseFloat(String(metric.quantum)) || 0;
  const max = Math.max(cNum, qNum, 0.001) * 1.15;
  const cPct = animate ? (cNum / max) * 100 : 0;
  const qPct = animate ? (qNum / max) * 100 : 0;
  const improved = metric.delta_pct > 0;

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-500"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="text-sm font-semibold text-slate-800">{metric.label}</p>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            improved ? "bg-violet-100 text-violet-800" : "bg-slate-100 text-slate-600"
          }`}
        >
          {metric.delta_pct >= 0 ? "+" : ""}
          {metric.delta_pct}%
        </span>
      </div>

      <div className="space-y-2.5">
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Traditional approach</span>
            <span className="font-mono">{formatVal(metric.classical, metric.unit)}</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${cPct}%`, transitionDelay: `${index * 100}ms` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span className="text-violet-700 font-medium">This feature</span>
            <span className="font-mono text-violet-800">{formatVal(metric.quantum, metric.unit)}</span>
          </div>
          <div className="h-3 bg-violet-50 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${accent} transition-all duration-1000 ease-out`}
              style={{ width: `${qPct}%`, transitionDelay: `${index * 100 + 200}ms` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  useCaseId?: string;
  classical?: AnalyzeResult["classical"];
  quantum?: AnalyzeResult["quantum"];
  comparison?: AnalyzeResult["comparison"];
  accent: string;
};

function hexFromAccent(accent: string): string {
  for (const [k, v] of Object.entries({ sky: "#38bdf8", emerald: "#34d399", violet: "#a78bfa", cyan: "#22d3ee", fuchsia: "#e879f9", blue: "#3b82f6" })) {
    if (accent.includes(k)) return v;
  }
  return "#6366f1";
}

export default function QuantumComparisonView({ useCaseId = "", classical, quantum, comparison, accent }: Props) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(t);
  }, [comparison]);

  if (!comparison || !classical || !quantum) return null;

  const uplift = comparison.improvement_pct;

  const gaugeColor = hexFromAccent(accent);

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl p-6 bg-gradient-to-br ${accent} text-white shadow-xl relative overflow-hidden`}>
        <div className="absolute inset-0 visual-shimmer opacity-30 pointer-events-none" />
        <p className="text-white/70 text-xs uppercase tracking-widest font-semibold relative">Improvement summary</p>
        <p className="text-2xl md:text-3xl font-bold mt-2 relative">{comparison.headline}</p>
        <div className="flex flex-wrap gap-6 mt-5 items-center relative">
          <div className="bg-white/20 backdrop-blur rounded-2xl p-2">
            <RadialGauge
              value={Math.abs(uplift)}
              max={100}
              label={comparison.improvement_label}
              sublabel="%"
              colors={[gaugeColor, "#ffffff"]}
              size={120}
            />
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-4 flex-1 min-w-[200px] border border-white/20">
            <p className="text-white/70 text-[10px] uppercase tracking-wider mb-2">Analysis</p>
            <p className="text-sm leading-relaxed text-white/95">{comparison.narrative}</p>
          </div>
        </div>
      </div>

      <ScenarioComparisonVisuals useCaseId={useCaseId} comparison={comparison} accent={accent} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-lg bg-slate-300 flex items-center justify-center text-sm">C</span>
            <div>
              <p className="font-bold text-slate-800">{classical.label}</p>
              <p className="text-xs text-slate-500">{classical.method}</p>
            </div>
          </div>
          <ul className="text-sm text-slate-600 space-y-1">
            {Object.entries(classical.metrics).slice(0, 4).map(([k, v]) => (
              <li key={k} className="flex justify-between">
                <span className="capitalize">{k.replace(/_/g, " ")}</span>
                <span className="font-mono font-medium">{String(v)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`rounded-xl border-2 border-violet-300 bg-violet-50/80 p-5 shadow-sm`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${accent} flex items-center justify-center text-sm text-white`}>
              Q
            </span>
            <div>
              <p className="font-bold text-violet-900">{quantum.label}</p>
              <p className="text-xs text-violet-600">{quantum.method}</p>
            </div>
          </div>
          <ul className="text-sm text-violet-900 space-y-1">
            {Object.entries(quantum.metrics).slice(0, 4).map(([k, v]) => (
              <li key={k} className="flex justify-between">
                <span className="capitalize">{k.replace(/_/g, " ")}</span>
                <span className="font-mono font-medium">{String(v)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase text-slate-500 mb-3">Metric-by-metric comparison</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {comparison.metrics.map((m: CompareMetricRow, i: number) => (
            <CompareBar key={m.name} metric={m} index={i} animate={animate} accent={accent} />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-5">
        <p className="text-xs font-semibold uppercase text-emerald-700 mb-3">Why this approach wins</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {comparison.quantum_advantage_points.map((pt: string) => (
            <li key={pt} className="flex gap-2 text-sm text-emerald-900">
              <span className="text-emerald-500 shrink-0">⚛</span>
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AnalysisPhaseTracker({
  phases,
  activeIndex,
}: {
  phases: { id: string; label: string; summary?: string; status?: string }[];
  activeIndex: number;
}) {
  return (
    <ol className="space-y-0 max-w-lg mx-auto">
      {phases.map((phase, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        const pending = i > activeIndex;
        return (
          <li key={phase.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-200 animate-pulse"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              {i < phases.length - 1 && (
                <span
                  className={`w-0.5 flex-1 min-h-[32px] my-1 transition-colors duration-500 ${
                    done ? "bg-emerald-400" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
            <div className={`pb-6 min-w-0 flex-1 ${pending ? "opacity-40" : ""}`}>
              <p className={`text-sm font-semibold ${active ? "text-indigo-700" : "text-slate-800"}`}>
                {phase.label}
              </p>
              {(done || active) && phase.summary && (
                <p className="text-xs text-slate-500 mt-1 animate-in fade-in">{phase.summary}</p>
              )}
              {active && (
                <div className="mt-2 flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                      style={{ animationDelay: `${d * 150}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
