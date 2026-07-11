import type { InputField } from "../skills/types";
import { getUseCaseExplanation } from "./useCaseExplanations";

type Props = {
  useCaseId: string;
  inputFields?: InputField[];
  compact?: boolean;
};

export default function UseCaseLaymanGuide({ useCaseId, inputFields, compact }: Props) {
  const guide = getUseCaseExplanation(useCaseId);
  if (!guide) return null;

  const fieldMap = new Map(guide.fieldHelp.map((f) => [f.name, f.plain]));
  const extraFields = (inputFields ?? [])
    .filter((f) => !fieldMap.has(f.name))
    .slice(0, compact ? 0 : 6);

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-5 shadow-md">
        <p className="text-indigo-200 text-xs uppercase tracking-wider font-semibold">In one sentence</p>
        <p className="text-lg font-semibold mt-1 leading-snug">{guide.tagline}</p>
        <p className="text-sm text-indigo-100 mt-2 italic">{guide.analogy}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border-2 border-rose-200 bg-rose-50/80 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-rose-700 mb-2">❌ {guide.problemTitle}</p>
          <p className="text-sm text-slate-800 leading-relaxed">{guide.problemPlain}</p>
          {!compact && (
            <div className="mt-4 pt-4 border-t border-rose-200/80">
              <p className="text-xs font-semibold text-rose-800 mb-1">Classical approach today</p>
              <p className="text-sm text-slate-700">{guide.classicalApproach}</p>
            </div>
          )}
        </div>
        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/80 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-800 mb-2">✅ {guide.solutionTitle}</p>
          <p className="text-sm text-slate-800 leading-relaxed">{guide.solutionPlain}</p>
          {!compact && (
            <div className="mt-4 pt-4 border-t border-emerald-200/80">
              <p className="text-xs font-semibold text-emerald-900 mb-1">Quantum approach here</p>
              <p className="text-sm text-slate-700">{guide.quantumApproach}</p>
            </div>
          )}
        </div>
      </div>

      {!compact && (
        <>
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
            <p className="text-xs font-bold uppercase text-violet-800 mb-1">What makes this different</p>
            <p className="text-sm text-violet-950 leading-relaxed">{guide.innovation}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 mb-2">What you&apos;ll get after Analyze</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {guide.whatYouGet.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-700 bg-white rounded-lg border border-slate-200 px-3 py-2">
                  <span className="text-emerald-500 shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

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
