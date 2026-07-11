import { useEffect, useId, useState, type ReactNode } from "react";

export function useAnimateIn(delay = 0) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return on;
}

export function VisualPanel({
  title,
  subtitle,
  gradient,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  gradient: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl overflow-hidden border border-white/20 shadow-lg ${className}`}>
      <div className={`px-5 py-4 bg-gradient-to-r ${gradient}`}>
        <p className="text-white/80 text-[10px] uppercase tracking-widest font-semibold">{title}</p>
        {subtitle && <p className="text-white text-sm font-medium mt-0.5">{subtitle}</p>}
      </div>
      <div className="bg-white/95 backdrop-blur p-5">{children}</div>
    </div>
  );
}

export function RadialGauge({
  value,
  max = 100,
  label,
  sublabel,
  colors = ["#6366f1", "#a855f7"],
  size = 140,
}: {
  value: number;
  max?: number;
  label: string;
  sublabel?: string;
  colors?: [string, string];
  size?: number;
}) {
  const anim = useAnimateIn(200);
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (anim ? (pct / 100) * c : 0);
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="drop-shadow-md">
        <defs>
          <linearGradient id={`rg-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={10} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#rg-${label})`}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <text x="50%" y="46%" textAnchor="middle" className="fill-slate-800 text-2xl font-bold" fontSize={22}>
          {anim ? (Number.isInteger(value) ? value : value.toFixed(1)) : "—"}
        </text>
        <text x="50%" y="58%" textAnchor="middle" className="fill-slate-400" fontSize={10}>
          {sublabel ?? `/ ${max}`}
        </text>
      </svg>
      <p className="text-xs font-semibold text-slate-600 mt-1 text-center">{label}</p>
    </div>
  );
}

export function DualBarCompare({
  label,
  classical,
  quantum,
  unit = "",
  classicalColor = "#94a3b8",
  quantumGradient = "from-violet-500 to-indigo-600",
  higherIsBetter = true,
}: {
  label: string;
  classical: number;
  quantum: number;
  unit?: string;
  classicalColor?: string;
  quantumGradient?: string;
  higherIsBetter?: boolean;
}) {
  const anim = useAnimateIn(150);
  const max = Math.max(classical, quantum, 0.001) * 1.1;
  const cW = anim ? (classical / max) * 100 : 0;
  const qW = anim ? (quantum / max) * 100 : 0;
  const improved = higherIsBetter ? quantum >= classical : quantum <= classical;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        {improved && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">↑ improved</span>
        )}
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-14 shrink-0">Before</span>
          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${cW}%`, background: classicalColor }} />
          </div>
          <span className="text-[10px] font-mono text-slate-500 w-16 text-right">{classical}{unit}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-violet-600 w-14 shrink-0 font-medium">After</span>
          <div className="flex-1 h-3 bg-violet-50 rounded-full overflow-hidden shadow-inner">
            <div className={`h-full rounded-full bg-gradient-to-r ${quantumGradient} transition-all duration-1000 delay-200`} style={{ width: `${qW}%` }} />
          </div>
          <span className="text-[10px] font-mono text-violet-700 w-16 text-right font-semibold">{quantum}{unit}</span>
        </div>
      </div>
    </div>
  );
}

export function DonutChart({
  segments,
  size = 160,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const anim = useAnimateIn(100);
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let acc = 0;
  const r = size * 0.35;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <svg width={size} height={size} className="shrink-0 drop-shadow-sm">
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const a0 = acc * 360;
          acc += pct;
          const a1 = acc * 360;
          const large = a1 - a0 > 180 ? 1 : 0;
          const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
          const x0 = cx + r * Math.cos(rad(a0));
          const y0 = cy + r * Math.sin(rad(a0));
          const x1 = cx + r * Math.cos(rad(a1));
          const y1 = cy + r * Math.sin(rad(a1));
          if (!anim) return null;
          return (
            <path
              key={seg.label}
              d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`}
              fill={seg.color}
              opacity={0.92 - i * 0.05}
              style={{ transition: "opacity 0.6s" }}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={r * 0.55} fill="white" />
        {centerValue && (
          <>
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#1e293b">
              {centerValue}
            </text>
            {centerLabel && (
              <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill="#64748b">
                {centerLabel}
              </text>
            )}
          </>
        )}
      </svg>
      <div className="space-y-1.5 flex-1 min-w-[120px]">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-slate-600 flex-1 truncate">{s.label}</span>
            <span className="font-mono font-semibold text-slate-800">{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Sparkline({ points, color = "#6366f1", height = 48 }: { points: number[]; color?: string; height?: number }) {
  const anim = useAnimateIn(100);
  const w = 200;
  const max = Math.max(...points, 0.001);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1 || 1)) * w;
    const y = height - ((p - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  });
  const area = `0,${height} ${coords.join(" ")} ${w},${height}`;
  const uid = useId();
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {anim && (
        <>
          <polygon points={area} fill={`url(#${uid})`} />
          <polyline points={coords.join(" ")} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

export function RouteMapVisual({
  stops,
  legs,
  accent = "#3b82f6",
}: {
  stops: string[];
  legs?: { distance_km: number }[];
  accent?: string;
}) {
  const anim = useAnimateIn(200);
  const n = stops.length;
  const positions = stops.map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const rx = 42;
    const ry = 32;
    return { x: 50 + rx * Math.cos(angle), y: 50 + ry * Math.sin(angle) };
  });
  return (
    <svg viewBox="0 0 100 72" className="w-full max-w-md mx-auto drop-shadow-sm">
      <defs>
        <linearGradient id="route-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent} stopOpacity={0.3} />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="50" rx="44" ry="34" fill="url(#route-glow)" />
      {anim &&
        positions.map((p, i) => {
          const next = positions[(i + 1) % n];
          return (
            <line
              key={`line-${i}`}
              x1={p.x}
              y1={p.y}
              x2={next.x}
              y2={next.y}
              stroke={accent}
              strokeWidth={0.8}
              strokeDasharray="2 1.5"
              opacity={0.6}
            />
          );
        })}
      {positions.map((p, i) => (
        <g key={stops[i]}>
          <circle cx={p.x} cy={p.y} r={i === 0 ? 4 : 3} fill={i === 0 ? accent : "#fff"} stroke={accent} strokeWidth={1.2} />
          <text x={p.x} y={p.y - 5} textAnchor="middle" fontSize={3.5} fill="#475569">
            {i + 1}
          </text>
        </g>
      ))}
      {legs && legs[0] && (
        <text x="50" y="68" textAnchor="middle" fontSize="4" fill="#64748b">
          Total route · {legs.reduce((s, l) => s + l.distance_km, 0).toFixed(1)} km
        </text>
      )}
    </svg>
  );
}

export function EntropyWaveVisual({ hex, entropy, max = 8 }: { hex: string; entropy: number; max?: number }) {
  const anim = useAnimateIn(100);
  const bytes = hex.match(/.{1,2}/g)?.slice(0, 32) ?? [];
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-0.5 h-16 px-1">
        {bytes.map((b, i) => {
          const h = anim ? ((parseInt(b, 16) / 255) * 100) : 0;
          return (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan-600 to-emerald-400 min-w-[2px]"
              style={{
                height: `${Math.max(8, h)}%`,
                transition: `height 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 20}ms`,
                opacity: 0.7 + (parseInt(b, 16) / 255) * 0.3,
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>Byte entropy spectrum</span>
        <span className="font-semibold text-cyan-700">{entropy.toFixed(2)} / {max} bits/byte</span>
      </div>
    </div>
  );
}

export function ShieldVaultVisual({ layers }: { layers: string[] }) {
  const anim = useAnimateIn(150);
  return (
    <svg viewBox="0 0 120 100" className="w-full max-w-[200px] mx-auto">
      <defs>
        <linearGradient id="shield-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <path
        d="M60 8 L100 24 L100 52 Q100 78 60 92 Q20 78 20 52 L20 24 Z"
        fill={anim ? "url(#shield-grad)" : "#e2e8f0"}
        stroke="#c7d2fe"
        strokeWidth={1.5}
        style={{ transition: "fill 1s" }}
      />
      <text x="60" y="48" textAnchor="middle" fontSize={10} fill="white" fontWeight="bold">
        PQC
      </text>
      <text x="60" y="60" textAnchor="middle" fontSize={6} fill="white" opacity={0.9}>
        VAULT
      </text>
      {layers.slice(0, 3).map((l, i) => (
        <text key={l} x="60" y={78 + i * 7} textAnchor="middle" fontSize={5} fill="#64748b">
          {l}
        </text>
      ))}
    </svg>
  );
}

export function GridHeatmap({ rows = 6, cols = 8, intensity = 0.7, label }: { rows?: number; cols?: number; intensity?: number; label?: string }) {
  const anim = useAnimateIn(100);
  const cells = Array.from({ length: rows * cols }, (_, i) => {
    const noise = Math.sin(i * 1.7) * 0.5 + 0.5;
    return intensity * noise + (1 - intensity) * 0.3;
  });
  return (
    <div>
      {label && <p className="text-xs text-slate-500 mb-2">{label}</p>}
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cells.map((v, i) => (
          <div
            key={i}
            className="aspect-square rounded-sm"
            style={{
              background: anim ? `rgba(59, 130, 246, ${0.15 + v * 0.75})` : "#f1f5f9",
              transition: `background 0.6s ${i * 15}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function VaRTailChart({ classicalVar, quantumVar, notional }: { classicalVar: number; quantumVar: number; notional: number }) {
  const anim = useAnimateIn(200);
  const w = 280;
  const h = 80;
  const points = Array.from({ length: 40 }, (_, i) => {
    const x = i / 39;
    const bell = Math.exp(-((x - 0.5) ** 2) / 0.08);
    return { x: x * w, y: h - bell * (h - 10) - 5 };
  });
  const tailStart = w * 0.78;
  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full">
      <path d={`M 0 ${h} ${points.map((p) => `L ${p.x} ${p.y}`).join(" ")} L ${w} ${h} Z`} fill="#f1f5f9" />
      {anim && (
        <>
          <path d={`M ${tailStart} ${h} ${points.filter((p) => p.x >= tailStart).map((p) => `L ${p.x} ${p.y}`).join(" ")} L ${w} ${h} Z`} fill="#fecaca" opacity={0.8} />
          <path d={points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")} fill="none" stroke="#6366f1" strokeWidth={2} />
          <line x1={tailStart} y1={0} x2={tailStart} y2={h} stroke="#ef4444" strokeDasharray="3 2" strokeWidth={1} />
          <text x={tailStart + 4} y={12} fontSize={8} fill="#ef4444">VaR99 tail</text>
        </>
      )}
      <text x="4" y={h + 14} fontSize={8} fill="#64748b">Classical ${(classicalVar / 1e6).toFixed(2)}M</text>
      <text x={w - 4} y={h + 14} textAnchor="end" fontSize={8} fill="#7c3aed" fontWeight="bold">
        Quantum ${(quantumVar / 1e6).toFixed(2)}M · ${(notional / 1e6).toFixed(0)}M book
      </text>
    </svg>
  );
}

export function MetricTiles({ tiles }: { tiles: { label: string; value: string; icon?: string; tint?: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {tiles.map((t) => (
        <div
          key={t.label}
          className={`rounded-xl border p-3 bg-gradient-to-br ${t.tint ?? "from-slate-50 to-white"} border-slate-200/80 shadow-sm`}
        >
          {t.icon && <span className="text-lg">{t.icon}</span>}
          <p className="text-[10px] uppercase tracking-wide text-slate-500 mt-1">{t.label}</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5 truncate">{t.value}</p>
        </div>
      ))}
    </div>
  );
}

export function UpliftRing({ pct, label, accent }: { pct: number; label: string; accent: string }) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <RadialGauge value={Math.abs(pct)} max={100} label={label} sublabel="%" colors={[accent.split(" ")[0]?.replace("from-", "#") ?? "#6366f1", "#a855f7"]} size={120} />
      <span className="absolute -top-1 -right-1 text-xs font-bold bg-white shadow rounded-full px-2 py-0.5 text-violet-700">
        {pct >= 0 ? "+" : ""}{pct.toFixed(1)}%
      </span>
    </div>
  );
}
