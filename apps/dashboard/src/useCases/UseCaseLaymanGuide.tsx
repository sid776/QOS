import type { ReactNode } from "react";
import type { InputField } from "../skills/types";
import { getUseCaseExplanation } from "./useCaseExplanations";

type Props = {
  useCaseId: string;
  inputFields?: InputField[];
  compact?: boolean;
};

function Section({
  title,
  subtitle,
  children,
  variant = "default",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  variant?: "default" | "warn" | "tech";
}) {
  const styles = {
    default: "border-slate-200 bg-white",
    warn: "border-amber-200 bg-amber-50/80",
    tech: "border-slate-200 bg-slate-50",
  };
  return (
    <section className={`rounded-xl border p-5 ${styles[variant]}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">{title}</p>
      {subtitle && <p className="text-sm font-semibold text-slate-800 mb-3">{subtitle}</p>}
      {children}
    </section>
  );
}

export default function UseCaseLaymanGuide({ useCaseId, inputFields, compact }: Props) {
  const guide = getUseCaseExplanation(useCaseId);
  if (!guide) return null;

  const fieldMap = new Map(guide.fieldHelp.map((f) => [f.name, f.plain]));
  const extraFields = (inputFields ?? [])
    .filter((f) => !fieldMap.has(f.name))
    .slice(0, compact ? 0 : 6);

  const hasDetail = Boolean(guide.problemDeep || guide.analyzeFlow?.length);

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-5 shadow-md">
        <p className="text-indigo-200 text-xs uppercase tracking-wider font-semibold">In one sentence</p>
        <p className="text-lg font-semibold mt-1 leading-snug">{guide.tagline}</p>
        <p className="text-sm text-indigo-100 mt-2 italic">{guide.analogy}</p>
        {!compact && guide.audience && (
          <p className="text-sm text-indigo-50 mt-4 pt-4 border-t border-indigo-400/40">
            <span className="font-semibold text-white">Who this is for: </span>
            {guide.audience}
          </p>
        )}
      </div>

      {!compact && guide.realWorldContext && (
        <Section title="Real-world context" subtitle="Why teams run this scenario">
          <p className="text-sm text-slate-700 leading-relaxed">{guide.realWorldContext}</p>
        </Section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border-2 border-rose-200 bg-rose-50/80 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-rose-700 mb-2">❌ {guide.problemTitle}</p>
          <p className="text-sm text-slate-800 leading-relaxed">{guide.problemPlain}</p>
          {!compact && guide.problemDeep && (
            <p className="text-sm text-slate-700 leading-relaxed mt-4 pt-4 border-t border-rose-200/80">
              {guide.problemDeep}
            </p>
          )}
          {!compact && (
            <div className="mt-4 pt-4 border-t border-rose-200/80">
              <p className="text-xs font-semibold text-rose-800 mb-1">Classical approach today</p>
              <p className="text-sm text-slate-700">{guide.classicalApproach}</p>
              {guide.classicalDeep && (
                <p className="text-sm text-slate-600 leading-relaxed mt-2">{guide.classicalDeep}</p>
              )}
            </div>
          )}
        </div>
        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/80 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-800 mb-2">✅ {guide.solutionTitle}</p>
          <p className="text-sm text-slate-800 leading-relaxed">{guide.solutionPlain}</p>
          {!compact && guide.solutionDeep && (
            <p className="text-sm text-slate-700 leading-relaxed mt-4 pt-4 border-t border-emerald-200/80">
              {guide.solutionDeep}
            </p>
          )}
          {!compact && (
            <div className="mt-4 pt-4 border-t border-emerald-200/80">
              <p className="text-xs font-semibold text-emerald-900 mb-1">Quantum approach here</p>
              <p className="text-sm text-slate-700">{guide.quantumApproach}</p>
              {guide.quantumDeep && (
                <p className="text-sm text-slate-600 leading-relaxed mt-2">{guide.quantumDeep}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {!compact && guide.userSteps && guide.userSteps.length > 0 && (
        <Section title="How to use this app" subtitle="Step-by-step through the wizard">
          <ol className="space-y-2">
            {guide.userSteps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {!compact && guide.analyzeFlow && guide.analyzeFlow.length > 0 && (
        <Section title="End-to-end: what Analyze does" subtitle="Five phases from input to comparison">
          <div className="space-y-4">
            {guide.analyzeFlow.map((step, i) => (
              <div key={step.phase} className="relative pl-8 pb-4 last:pb-0 border-l-2 border-indigo-200 last:border-transparent ml-2">
                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white" />
                <p className="text-xs font-bold uppercase text-indigo-700">
                  Phase {i + 1}: {step.phase}
                </p>
                <p className="text-sm text-slate-800 mt-1 leading-relaxed">{step.layman}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-mono bg-slate-100 rounded-lg px-3 py-2">
                  {step.technical}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {!compact && (
        <>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase text-slate-600 mb-1">{guide.technicalTitle}</p>
            <p className="text-sm text-slate-800 leading-relaxed">{guide.technicalPlain}</p>
            {guide.technicalDeep && (
              <p className="text-sm text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-200">
                {guide.technicalDeep}
              </p>
            )}
            {guide.libraries.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {guide.libraries.map((lib) => (
                  <span
                    key={lib}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                  >
                    {lib}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
            <p className="text-xs font-bold uppercase text-violet-800 mb-1">Notes</p>
            <p className="text-sm text-violet-950 leading-relaxed">{guide.innovation}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 mb-2">
              {hasDetail && guide.outputsDeep?.length ? "Outputs after Analyze (detailed)" : "What you'll get after Analyze"}
            </p>
            <ul className="grid grid-cols-1 gap-2">
              {(guide.outputsDeep?.length ? guide.outputsDeep : guide.whatYouGet).map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm text-slate-700 bg-white rounded-lg border border-slate-200 px-3 py-2.5 leading-relaxed"
                >
                  <span className="text-emerald-500 shrink-0 mt-0.5">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {guide.limitations && guide.limitations.length > 0 && (
            <Section title="Honest limitations" subtitle="What this demo is — and is not" variant="warn">
              <ul className="space-y-2">
                {guide.limitations.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-amber-950 leading-relaxed">
                    <span className="shrink-0 text-amber-600">⚠</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <details className="rounded-xl border border-slate-200 bg-white">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-800">
              Explain every input field in plain English
            </summary>
            <dl className="px-4 pb-4 space-y-2 border-t border-slate-100 pt-3">
              {guide.fieldHelp.map((f) => (
                <div key={f.name} className="text-sm">
                  <dt className="font-medium text-indigo-700">{f.name.replace(/_/g, " ")}</dt>
                  <dd className="text-slate-600 mt-0.5">{f.plain}</dd>
                </div>
              ))}
              {extraFields.map((f) => (
                <div key={f.name} className="text-sm">
                  <dt className="font-medium text-slate-700">{f.label}</dt>
                  <dd className="text-slate-600 mt-0.5">{f.help ?? "Configure this for your scenario."}</dd>
                </div>
              ))}
            </dl>
          </details>
        </>
      )}
    </div>
  );
}
