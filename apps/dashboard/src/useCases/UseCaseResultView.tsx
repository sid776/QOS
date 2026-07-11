import { Link } from "react-router-dom";
import SkillResultView from "../skills/SkillResults";

type WorkflowStep = {
  step_id?: string;
  agent: string;
  status: string;
  summary: string;
  output?: unknown;
};

function WorkflowTimeline({ steps }: { steps: WorkflowStep[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((step, i) => (
        <li key={step.step_id ?? i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step.status === "completed"
                  ? "bg-emerald-500 text-white"
                  : step.status === "failed"
                    ? "bg-rose-500 text-white"
                    : "bg-slate-300 text-slate-700"
              }`}
            >
              {i + 1}
            </span>
            {i < steps.length - 1 && <span className="w-0.5 flex-1 bg-slate-200 my-1 min-h-[24px]" />}
          </div>
          <div className="pb-5 min-w-0 flex-1">
            <p className="text-xs font-mono text-indigo-600">{step.agent}</p>
            <p className="text-sm font-medium text-slate-800 mt-0.5">{step.summary}</p>
            <span
              className={`inline-block mt-1 text-[10px] uppercase px-2 py-0.5 rounded-full ${
                step.status === "completed"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {step.status}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function PortfolioMiniChart({ allocation }: { allocation: Record<string, number> }) {
  const entries = Object.entries(allocation);
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
  let acc = 0;
  const gradient = entries
    .map(([_, v], i) => {
      const pct = (v / total) * 100;
      const start = acc;
      acc += pct;
      return `${colors[i % colors.length]} ${start}% ${acc}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div
        className="w-24 h-24 rounded-full border-4 border-white shadow-md shrink-0"
        style={{ background: `conic-gradient(${gradient})` }}
      />
      <div className="space-y-1.5 flex-1 min-w-[160px]">
        {entries.map(([asset, usd], i) => (
          <div key={asset} className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors[i % colors.length] }} />
            <span className="font-medium w-14">{asset}</span>
            <span className="text-slate-500 ml-auto font-mono">${usd.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = {
  output?: Record<string, unknown>;
  skillName?: string;
};

export default function UseCaseResultView({ output, skillName }: Props) {
  if (!output) return null;

  const steps = output.steps as WorkflowStep[] | undefined;
  const recommendation = output.recommendation as string | undefined;
  const finalResult = output.final_result as Record<string, unknown> | undefined;
  const jobResult = output.result as Record<string, unknown> | undefined;
  const skillData = (jobResult?.skill ?? finalResult?.skill ?? output.skill) as
    | Record<string, unknown>
    | undefined;

  if (steps && steps.length > 0) {
    const alloc =
      (finalResult?.allocation as Record<string, number> | undefined) ??
      (skillData?.allocation as Record<string, number> | undefined);

    return (
      <div className="space-y-5">
        {recommendation && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase text-indigo-600 mb-1">Recommendation</p>
            <p className="text-sm text-slate-800 leading-relaxed">{recommendation}</p>
          </div>
        )}
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500 mb-3">Pipeline timeline</p>
          <WorkflowTimeline steps={steps} />
        </div>
        {alloc && Object.keys(alloc).length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500 mb-3">Allocation preview</p>
            <PortfolioMiniChart allocation={alloc} />
          </div>
        )}
        {finalResult && (
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <SkillResultView jobResult={finalResult} skillName={skillName} />
          </div>
        )}
        {output.final_job_id != null && (
          <Link to={`/jobs/${String(output.final_job_id)}`} className="q-link text-sm">
            View final job →
          </Link>
        )}
      </div>
    );
  }

  if (jobResult) {
    return (
      <div className="space-y-3">
        {output.selected_provider != null && (
          <p className="text-xs text-slate-500">
            Provider: <span className="font-mono font-medium">{String(output.selected_provider)}</span>
          </p>
        )}
        <SkillResultView jobResult={jobResult} skillName={skillName} />
        {output.job_id != null && (
          <Link to={`/jobs/${String(output.job_id).replace("job_", "job_")}`} className="q-link text-sm">
            View job details →
          </Link>
        )}
      </div>
    );
  }

  return (
    <pre className="text-xs bg-white/80 border border-slate-200 p-4 rounded-xl overflow-auto max-h-64 text-slate-700">
      {JSON.stringify(output, null, 2)}
    </pre>
  );
}
