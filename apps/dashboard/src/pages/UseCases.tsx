import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../api";
import OSWindow from "../components/OSWindow";
import { getUseCaseTheme } from "../theme/useCaseColors";
import { mergeUseCaseCatalog, BUNDLED_USE_CASE_CATALOG } from "../useCases/bundledUseCaseSchemas";
import { getUseCaseExplanation } from "../useCases/useCaseExplanations";
import ScenarioCardThumb from "../useCases/visuals/ScenarioCardThumb";
import type { UseCaseMeta } from "../useCases/types";

function MetricPills({ metrics, theme }: { metrics: { label: string; value: string }[]; theme: ReturnType<typeof getUseCaseTheme> }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={`rounded-lg px-2.5 py-1.5 text-center min-w-[72px] ${theme.accentSoft} border border-white/60`}
        >
          <p className="text-[10px] uppercase tracking-wide text-slate-500">{m.label}</p>
          <p className="text-xs font-bold text-slate-800">{m.value}</p>
        </div>
      ))}
    </div>
  );
}

export default function UseCases() {
  const [catalog, setCatalog] = useState<UseCaseMeta[]>([]);

  useEffect(() => {
    fetchApi<{ use_cases: UseCaseMeta[] }>("/v1/use-cases")
      .then((d) => {
        setCatalog(mergeUseCaseCatalog(d.use_cases));
      })
      .catch(() => {
        setCatalog(mergeUseCaseCatalog([]));
      });
  }, []);

  const industries = new Set(catalog.map((c) => c.industry.split("/")[0].trim())).size;
  const fieldCount = catalog.reduce((n, c) => n + (c.input_fields?.length ?? 0), 0);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap gap-6 items-start justify-between">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Industry Apps</h1>
            <p className="text-slate-600 mt-2 leading-relaxed">
              {catalog.length || BUNDLED_USE_CASE_CATALOG.length} standalone industry apps — each walks you through
              your inputs, runs the feature, and shows how it compares to the traditional approach.
            </p>
          </div>
          <div className="flex gap-4">
            {[
              { n: catalog.length || BUNDLED_USE_CASE_CATALOG.length, label: "Apps" },
              { n: industries || 8, label: "Industries" },
              { n: fieldCount || "30+", label: "Input fields" },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center bg-white/80 rounded-xl px-4 py-3 border border-indigo-100 shadow-sm min-w-[80px]"
              >
                <p className="text-xl font-bold text-indigo-700">{s.n}</p>
                <p className="text-[10px] uppercase tracking-wide text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-indigo-700 mt-4 font-medium">
          New here? Start with <Link to="/use-cases/cloud_api_entropy" className="underline hover:text-indigo-900">NIST account vault</Link> or{" "}
          <Link to="/use-cases/logistics_delivery_routes" className="underline hover:text-indigo-900">Last-mile delivery</Link>.
        </p>
      </div>

      <OSWindow title="App launcher" icon="🚀" accent="indigo" width="full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {catalog.map((uc, index) => {
            const theme = getUseCaseTheme(uc.id, index);
            const metrics = uc.metrics ?? [];

            return (
              <Link
                key={uc.id}
                to={`/use-cases/${uc.id}`}
                className={`group relative text-left rounded-2xl border overflow-hidden transition-all duration-200 ${theme.border} ${theme.card} ${theme.cardHover} shadow-sm hover:shadow-lg hover:scale-[1.01]`}
              >
                <ScenarioCardThumb useCaseId={uc.id} accent={theme.accent} />
                <div className={`h-1.5 bg-gradient-to-r ${theme.accent} opacity-90 relative`} />
                <div className="p-5 relative">
                  <div className="flex items-start gap-4">
                    <span
                      className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-white/80 shadow-sm border ${theme.border} group-hover:scale-105 transition-transform`}
                    >
                      {theme.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span
                        className={`inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md ${theme.badge} ${theme.badgeText}`}
                      >
                        {uc.industry}
                      </span>
                      <p className="font-bold text-slate-900 text-base mt-2 leading-snug group-hover:text-indigo-800 transition-colors">
                        {uc.title}
                      </p>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-2">
                          {getUseCaseExplanation(uc.id)?.tagline ?? uc.description}
                        </p>
                      {(uc.tags ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {uc.tags!.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-white/60 text-slate-500 border border-slate-200/60"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      {metrics.length > 0 && <MetricPills metrics={metrics} theme={theme} />}
                      <p className="text-xs mt-3 font-medium text-indigo-600 group-hover:text-indigo-700">
                        Open app → {(uc.input_fields?.length ?? 0) || "?"} input fields
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </OSWindow>
    </div>
  );
}
