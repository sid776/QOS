import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchApi, postApi, listSkills, type JobDetail as Job } from "../api";
import ActionButton from "../components/ActionButton";
import SkillResultView from "../skills/SkillResults";

export default function JobDetail() {
  const { jobId } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [explanation, setExplanation] = useState("");
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [resultView, setResultView] = useState<string | undefined>();

  const load = useCallback(() => {
    if (jobId) fetchApi<Job>(`/v1/jobs/${jobId}`).then(setJob);
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;
    load();
    const terminal = ["COMPLETED", "FAILED", "REJECTED", "CANCELLED"];
    const t = setInterval(() => {
      fetchApi<Job>(`/v1/jobs/${jobId}`).then((j) => {
        setJob(j);
        if (terminal.includes(j.state)) clearInterval(t);
      });
    }, 1500);
    return () => clearInterval(t);
  }, [jobId, load]);

  useEffect(() => {
    if (!job?.skill) return;
    listSkills()
      .then((d) => {
        const meta = d.skills.find((s) => s.name === job.skill);
        setResultView(meta?.result_view);
      })
      .catch(() => setResultView(undefined));
  }, [job?.skill]);

  const explain = async () => {
    if (!job) return;
    setLoadingExplain(true);
    try {
      const r = await postApi<{ plan: { explanation: string } }>("/v1/agents/run", {
        agent: "ExplanationAgent",
        task: {
          state: job.state,
          result: job.result || {},
          error: job.error,
        },
      });
      setExplanation(r.plan.explanation);
    } finally {
      setLoadingExplain(false);
    }
  };

  if (!job) return <p className="text-slate-600">Loading…</p>;

  return (
    <div className="space-y-6">
      <Link to="/jobs" className="text-blue-600 text-sm hover:underline">
        ← Back to jobs
      </Link>
      <div className="flex flex-wrap items-center gap-4">
        <h2 className="text-2xl font-bold font-mono">{job.job_id}</h2>
        <span
          className={`px-3 py-1 rounded text-sm ${
            job.state === "COMPLETED"
              ? "bg-emerald-900 text-emerald-800"
              : job.state === "FAILED"
                ? "bg-red-900 text-red-700"
                : "bg-slate-200"
          }`}
        >
          {job.state}
        </span>
        <ActionButton onClick={load} variant="secondary">
          Refresh
        </ActionButton>
        <ActionButton onClick={explain} loading={loadingExplain} variant="secondary">
          Explain result
        </ActionButton>
      </div>

      {job.selected_provider && (
        <p className="text-slate-600">
          Provider: <span className="text-white font-mono">{job.selected_provider}</span>
        </p>
      )}

      {explanation && (
        <div className="border border-quantum-500/50 rounded-lg p-4 bg-white">
          <h3 className="font-semibold text-blue-600 mb-2">Explanation</h3>
          <p>{explanation}</p>
        </div>
      )}

      {job.error && (
        <div className="border border-red-800 rounded p-4 text-red-700">{job.error}</div>
      )}

      {job.result && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 className="font-semibold">Result</h3>
            {job.skill && (
              <Link to={`/skills/${job.skill}`} className="text-sm q-link">
                Open {job.skill} feature →
              </Link>
            )}
          </div>
          {job.skill ? (
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <SkillResultView skillName={job.skill} resultView={resultView} jobResult={job.result} />
            </div>
          ) : (
            <pre className="bg-white p-4 rounded overflow-auto text-sm">
              {JSON.stringify(job.result, null, 2)}
            </pre>
          )}
        </div>
      )}

      <details className="text-sm">
        <summary className="cursor-pointer text-slate-600">Raw job JSON</summary>
        <pre className="mt-2 bg-white p-4 rounded overflow-auto">
          {JSON.stringify(job, null, 2)}
        </pre>
      </details>
    </div>
  );
}
