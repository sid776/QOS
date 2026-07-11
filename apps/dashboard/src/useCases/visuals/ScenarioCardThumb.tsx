/** Compact decorative SVG art for use-case launcher cards */
import type { ReactElement } from "react";

function hexFromAccent(accent: string): string {
  for (const [k, v] of Object.entries({ sky: "#38bdf8", emerald: "#34d399", violet: "#a78bfa", cyan: "#22d3ee", amber: "#fbbf24", rose: "#fb7185", fuchsia: "#e879f9", teal: "#2dd4bf", indigo: "#818cf8", orange: "#fb923c", lime: "#a3e635", purple: "#c084fc", pink: "#f472b6", yellow: "#facc15", blue: "#3b82f6", slate: "#94a3b8" })) {
    if (accent.includes(k)) return v;
  }
  return "#6366f1";
}

export default function ScenarioCardThumb({ useCaseId, accent }: { useCaseId: string; accent: string }) {
  const c = hexFromAccent(accent);

  const art: Record<string, ReactElement> = {
    fintech_portfolio_rebalance: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        <circle cx="28" cy="24" r="16" fill="none" stroke={c} strokeWidth="6" strokeDasharray="40 60" />
        <rect x="52" y="12" width="22" height="4" rx="2" fill={c} opacity="0.5" />
        <rect x="52" y="22" width="18" height="4" rx="2" fill={c} opacity="0.7" />
        <rect x="52" y="32" width="24" height="4" rx="2" fill={c} />
      </svg>
    ),
    logistics_delivery_routes: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        <path d="M12 36 Q40 8 68 36" fill="none" stroke={c} strokeWidth="2" strokeDasharray="4 3" />
        {[12, 40, 68].map((x, i) => (
          <circle key={i} cx={x} cy={i === 1 ? 14 : 36} r="4" fill={c} opacity={0.6 + i * 0.15} />
        ))}
      </svg>
    ),
    bank_legacy_crypto_audit: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        <rect x="20" y="10" width="40" height="28" rx="4" fill="none" stroke={c} strokeWidth="2" />
        <path d="M28 22 L36 30 L52 18" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    telecom_qkd_link_planning: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        <circle cx="16" cy="24" r="6" fill={c} opacity="0.5" />
        <circle cx="64" cy="24" r="6" fill={c} />
        <line x1="22" y1="24" x2="58" y2="24" stroke={c} strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="40" cy="24" r="3" fill="#fff" stroke={c} strokeWidth="1.5" />
      </svg>
    ),
    cloud_api_entropy: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={8 + i * 4.5} y={40 - (i % 5) * 6 - 8} width="3" height={(i % 5) * 6 + 8} rx="1" fill={c} opacity={0.4 + (i % 5) * 0.12} />
        ))}
      </svg>
    ),
    automotive_battery_chemistry: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        <rect x="18" y="14" width="44" height="20" rx="3" fill="none" stroke={c} strokeWidth="2" />
        <rect x="62" y="20" width="4" height="8" rx="1" fill={c} />
        {[24, 36, 48].map((x) => (
          <rect key={x} x={x} y="20" width="6" height="8" rx="1" fill={c} opacity="0.6" />
        ))}
      </svg>
    ),
    research_simulator_benchmark: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        <polyline points="8,38 20,28 32,32 44,18 56,22 68,10" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="68" cy="10" r="3" fill={c} />
      </svg>
    ),
    insurance_fraud_feature_probe: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        <path d="M40 8 L62 18 L62 34 Q40 44 18 34 L18 18 Z" fill={c} opacity="0.2" stroke={c} strokeWidth="1.5" />
        <text x="40" y="28" textAnchor="middle" fontSize="10" fill={c} fontWeight="bold">!</text>
      </svg>
    ),
    pharma_molecular_binding: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        <circle cx="24" cy="24" r="8" fill="none" stroke={c} strokeWidth="2" />
        <circle cx="56" cy="24" r="8" fill="none" stroke={c} strokeWidth="2" />
        <line x1="32" y1="24" x2="48" y2="24" stroke={c} strokeWidth="2" />
      </svg>
    ),
    energy_grid_quantum_dispatch: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        <path d="M40 8 L48 28 L40 22 L32 28 Z" fill={c} />
        <rect x="14" y="32" width="52" height="3" rx="1.5" fill={c} opacity="0.3" />
        <rect x="20" y="36" width="40" height="3" rx="1.5" fill={c} opacity="0.5" />
      </svg>
    ),
    finance_quantum_monte_carlo: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        <path d="M8 38 Q20 38 28 20 T48 20 T68 38 L72 38" fill={c} opacity="0.15" />
        <path d="M8 38 Q20 38 28 20 T48 20 T68 38" fill="none" stroke={c} strokeWidth="2" />
        <line x1="58" y1="8" x2="58" y2="38" stroke="#ef4444" strokeDasharray="2 2" strokeWidth="1" />
      </svg>
    ),
    semiconductor_yield_quantum: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        <rect x="16" y="12" width="48" height="24" rx="2" fill="none" stroke={c} strokeWidth="1.5" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={20 + (i % 4) * 11} y={16 + Math.floor(i / 4) * 7} width="8" height="5" rx="1" fill={c} opacity={0.3 + (i % 3) * 0.2} />
        ))}
      </svg>
    ),
    ai_llm_quantum_retrieval: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={12 + (i % 4) * 18} cy={12 + Math.floor(i / 4) * 14} r="3" fill={i < 4 ? c : "#cbd5e1"} />
        ))}
        <circle cx="40" cy="24" r="10" fill="none" stroke={c} strokeDasharray="3 2" strokeWidth="1.5" />
      </svg>
    ),
    genomics_protein_folding: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        <path d="M8 24 Q20 8 32 24 T56 24 T72 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    crypto_pqc_wallet_hardening: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        <path d="M40 6 L58 14 L58 30 Q40 42 22 30 L22 14 Z" fill={c} opacity="0.25" stroke={c} strokeWidth="1.5" />
        <text x="40" y="26" textAnchor="middle" fontSize="8" fill={c} fontWeight="bold">₿</text>
      </svg>
    ),
    smart_city_traffic_flow: (
      <svg viewBox="0 0 80 48" className="w-full h-full">
        {Array.from({ length: 20 }, (_, i) => (
          <rect key={i} x={8 + (i % 5) * 14} y={8 + Math.floor(i / 5) * 12} width="10" height="8" rx="1" fill={c} opacity={0.2 + ((i * 7) % 10) * 0.07} />
        ))}
      </svg>
    ),
  };

  return (
    <div className={`absolute inset-0 opacity-[0.12] group-hover:opacity-[0.18] transition-opacity pointer-events-none bg-gradient-to-br ${accent}`}>
      <div className="absolute right-2 bottom-0 w-24 h-14">{art[useCaseId] ?? art.fintech_portfolio_rebalance}</div>
    </div>
  );
}
