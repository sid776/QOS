export type SkillTheme = {
  gradient: string;
  border: string;
  badge: string;
  badgeText: string;
  accent: string;
};

const THEMES: Record<string, SkillTheme> = {
  hello_quantum: {
    gradient: "from-violet-50 to-indigo-50",
    border: "border-violet-200",
    badge: "bg-violet-100",
    badgeText: "text-violet-800",
    accent: "text-violet-700",
  },
  qrng_demo: {
    gradient: "from-cyan-50 to-sky-50",
    border: "border-cyan-200",
    badge: "bg-cyan-100",
    badgeText: "text-cyan-800",
    accent: "text-cyan-700",
  },
  bb84_simulator: {
    gradient: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100",
    badgeText: "text-emerald-800",
    accent: "text-emerald-700",
  },
  portfolio_optimizer: {
    gradient: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    badge: "bg-amber-100",
    badgeText: "text-amber-900",
    accent: "text-amber-800",
  },
  route_optimizer: {
    gradient: "from-blue-50 to-slate-50",
    border: "border-blue-200",
    badge: "bg-blue-100",
    badgeText: "text-blue-800",
    accent: "text-blue-700",
  },
  pqc_encryptor: {
    gradient: "from-rose-50 to-pink-50",
    border: "border-rose-200",
    badge: "bg-rose-100",
    badgeText: "text-rose-800",
    accent: "text-rose-700",
  },
  crypto_migration_scan: {
    gradient: "from-slate-50 to-zinc-100",
    border: "border-slate-300",
    badge: "bg-slate-200",
    badgeText: "text-slate-800",
    accent: "text-slate-700",
  },
};

const FALLBACK: SkillTheme = {
  gradient: "from-indigo-50 to-purple-50",
  border: "border-indigo-200",
  badge: "bg-indigo-100",
  badgeText: "text-indigo-800",
  accent: "text-indigo-700",
};

export function getSkillTheme(name: string): SkillTheme {
  return THEMES[name] ?? FALLBACK;
}
