import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../api";
import JobForm from "../components/JobForm";
import ActionButton from "../components/ActionButton";

const STATE_COLORS: Record<string, string> = {
  COMPLETED: "text-emerald-600",
  FAILED: "text-red-600",
  REJECTED: "text-amber-800",
  RUNNING: "text-blue-400",
  QUEUED: "text-slate-600",
};

export default function Jobs() {
  const [jobs, setJobs] = useState<
    { job_id: string; state: string; job_type: string; skill?: string; selected_provider?: string }[]
  >([]);
  const [filter, setFilter] = useState("all");

  const load = useCallback(() => {
    fetchApi<{ jobs: typeof jobs }>("/v1/jobs").then((d) => setJobs(d.jobs));
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  const filtered =
    filter === "all" ? jobs : jobs.filter((j) => j.state.toLowerCase() === filter.toLowerCase());

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Jobs</h2>
        <ActionButton onClick={load} variant="secondary">
          Refresh list
        </ActionButton>
      </div>

      <JobForm redirectToJob />

      <div className="flex gap-2 flex-wrap">
        {["all", "COMPLETED", "RUNNING", "FAILED", "REJECTED"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-sm ${
              filter === f ? "bg-quantum-500" : "bg-slate-200 hover:bg-slate-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filtered.length === 0 && (
          <li className="text-slate-500">No jobs yet — submit one above.</li>
        )}
        {filtered.map((j) => (
          <li
            key={j.job_id}
            className="border border-slate-200 rounded p-3 flex flex-wrap items-center gap-3"
          >
            <Link to={`/jobs/${j.job_id}`} className="text-blue-600 hover:underline font-mono">
              {j.job_id}
            </Link>
            <span className={STATE_COLORS[j.state] || "text-slate-600"}>{j.state}</span>
            <span className="text-sm text-slate-500">{j.skill || j.job_type}</span>
            {j.selected_provider && (
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">{j.selected_provider}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
