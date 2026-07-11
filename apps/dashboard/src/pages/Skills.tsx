import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../api";
import SkillFeaturePanel from "../skills/SkillFeaturePanel";
import { getSkillTheme } from "../skills/skillThemes";
import type { SkillMeta } from "../skills/types";

export default function Skills() {
  const [skills, setSkills] = useState<SkillMeta[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchApi<{ skills: SkillMeta[] }>("/v1/skills")
      .then((d) => setSkills(d.skills))
      .catch((e) => {
        setSkills([]);
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (name: string) => setActive((cur) => (cur === name ? null : name));

  const grouped = skills.reduce<Record<string, SkillMeta[]>>((acc, s) => {
    const cat = s.category || "General";
    acc[cat] = acc[cat] ?? [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Skills</h2>
        <p className="text-slate-600 mt-1">
          Full-featured quantum and security capabilities — each skill has its own form, logic, and result visualization.
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-indigo-600 py-8">
          <span className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading skills from API…</span>
        </div>
      )}

      {error && (
        <div className="border border-rose-200 bg-rose-50 rounded-xl p-4 text-rose-800 text-sm">
          <p className="font-semibold mb-1">Cannot load skills</p>
          <p>{error}</p>
          <p className="mt-2 text-rose-700">
            Start the API:{" "}
            <code className="text-xs bg-white/80 px-2 py-1 rounded">
              uvicorn apps.api.quantumos_api.main:app --host 127.0.0.1 --port 8000
            </code>
          </p>
        </div>
      )}

      {!loading && !error && skills.length === 0 && (
        <p className="text-slate-500 text-sm py-8">No skills discovered. Check the API skills registry.</p>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((s) => {
              const theme = getSkillTheme(s.name);
              const isActive = active === s.name;
              return (
                <Fragment key={s.name}>
                  <button
                    type="button"
                    onClick={() => toggle(s.name)}
                    className={`text-left rounded-2xl border p-5 transition shadow-sm bg-gradient-to-br ${theme.gradient} ${
                      isActive ? `${theme.border} ring-2 ring-indigo-200` : "border-white/80 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-2xl">{s.icon ?? "⚡"}</span>
                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${theme.badge} ${theme.badgeText}`}>
                        v{s.version}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mt-2 capitalize">{s.name.replace(/_/g, " ")}</h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{s.description || s.type}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {(s.features ?? []).slice(0, 2).map((f) => (
                        <span key={f} className="text-[10px] bg-white/60 rounded px-2 py-0.5 text-slate-500">
                          {f}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-indigo-600 mt-3 font-medium">
                      {isActive ? "Click to collapse" : "Click to open →"}
                    </p>
                  </button>

                  {isActive && (
                    <div className="sm:col-span-2">
                      <SkillFeaturePanel skillName={s.name} onClose={() => setActive(null)} />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </section>
      ))}

      <p className="text-sm text-slate-500">
        Prefer the job queue? <Link to="/jobs" className="q-link">Open Jobs</Link> or use{" "}
        <Link to="/playground" className="q-link">Playground</Link>.
      </p>
    </div>
  );
}
