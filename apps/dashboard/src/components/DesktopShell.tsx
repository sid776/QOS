import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { fetchApi } from "../api";

const NAV = [
  { path: "/readme", label: "README", icon: "📄", highlight: true },
  { path: "/guide", label: "User Guide", icon: "📖", highlight: true },
  { path: "/dev-guide", label: "Dev Guide", icon: "🛠", highlight: true },
  { path: "/", label: "Desktop", icon: "⊞" },
  { path: "/use-cases", label: "Use Cases", icon: "🌐" },
  { path: "/agent-workbench", label: "Workbench", icon: "🤖" },
  { path: "/playground", label: "Playground", icon: "⚗" },
  { path: "/jobs", label: "Jobs", icon: "▣" },
  { path: "/providers", label: "Providers", icon: "◎" },
  { path: "/skills", label: "Skills", icon: "◆" },
  { path: "/security", label: "Security", icon: "🔐" },
  { path: "/audit", label: "Audit", icon: "📋" },
];

export default function DesktopShell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () =>
      fetchApi<{ status: string }>("/health")
        .then((h) => setApiOk(h.status === "ok"))
        .catch(() => setApiOk(false));
    check();
    const t = setInterval(check, 15000);
    return () => clearInterval(t);
  }, []);

  const isActive = (path: string) =>
    loc.pathname === path || (path !== "/" && loc.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col desktop-bg">
      <header className="h-14 flex items-center px-5 glass-bar border-b z-20">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            Q
          </span>
          <span className="font-semibold text-slate-800 tracking-tight">QuantumOS</span>
        </div>
        <Link
          to="/readme"
          className="ml-3 hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 hover:bg-slate-50 transition"
        >
          📄 README
        </Link>
        <Link
          to="/guide"
          className="ml-5 hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100 hover:bg-indigo-100/80 transition"
        >
          📖 User Guide
        </Link>
        <div className="ml-auto flex items-center gap-2.5 text-xs text-slate-500">
          <span
            className={`w-2 h-2 rounded-full transition ${
              apiOk === true
                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                : apiOk === false
                  ? "bg-rose-400"
                  : "bg-slate-300"
            }`}
          />
          <span className="font-medium">
            {apiOk === true ? "Online" : apiOk === false ? "Offline" : "…"}
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-52 shrink-0 glass-sidebar border-r border-slate-200/60 p-3 flex flex-col gap-0.5">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 px-3 mb-2 font-medium">
            Apps
          </p>
          {NAV.map(({ path, label, icon, highlight }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all ${
                isActive(path)
                  ? "nav-pill-active"
                  : highlight
                    ? "text-indigo-700 bg-indigo-50/70 border border-indigo-100/80 hover:bg-indigo-50"
                    : "nav-pill"
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </Link>
          ))}
        </aside>

        <main className="flex-1 overflow-auto p-6 md:p-8 relative">{children}</main>
      </div>

      <footer className="h-9 flex items-center px-5 glass-bar border-t text-[11px] text-slate-400 gap-5">
        <Link to="/guide" className="q-link text-xs">
          Help
        </Link>
        <span className="opacity-60">Kernel</span>
        <span className="opacity-60">Policy</span>
        <span className="opacity-60">Audit</span>
        <span className="ml-auto tabular-nums">{new Date().toLocaleTimeString()}</span>
      </footer>
    </div>
  );
}
