import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi, createJob, API_URL, listSkills, type JobDetail, type SkillMeta } from "../api";
import OSWindow from "../components/OSWindow";
import ActionButton from "../components/ActionButton";
import SkillResultView from "../skills/SkillResults";

export default function Home() {
  const [health, setHealth] = useState({ status: "loading", service: "", version: "" });
  const [apiOnline, setApiOnline] = useState(true);
  const [stats, setStats] = useState({ jobs: 0, skills: 0, providersUp: 0 });
  const [activeRun, setActiveRun] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<JobDetail | null>(null);
  const [error, setError] = useState("");

  const [skillCatalog, setSkillCatalog] = useState<SkillMeta[]>([]);

  const refreshStats = () => {
    Promise.all([
      fetchApi<{ jobs: unknown[] }>("/v1/jobs"),
      fetchApi<{ skills: unknown[] }>("/v1/skills"),
      fetchApi<{ providers: { available: boolean }[] }>("/v1/providers"),
    ])
      .then(([jobs, skills, prov]) => {
        setStats({
          jobs: jobs.jobs.length,
          skills: skills.skills.length,
          providersUp: prov.providers.filter((p) => p.available).length,
        });
        setApiOnline(true);
      })
      .catch(() => setApiOnline(false));
  };

  useEffect(() => {
    fetchApi<{ status: string; service: string; version: string }>("/health")
      .then((h) => {
        setHealth(h);
        setApiOnline(true);
      })
      .catch(() => {
        setHealth({ status: "offline", service: "quantumos-api", version: "—" });
        setApiOnline(false);
      });
    refreshStats();
    listSkills()
      .then((d) => setSkillCatalog(d.skills))
      .catch(() => setSkillCatalog([]));
  }, []);

  const quickRun = async (skill: SkillMeta) => {
    setActiveRun(skill.name);
    setError("");
    setLastResult(null);
    try {
      const input = skill.sample_input ?? {};
      const job = await createJob({
        job_type: skill.default_job_type,
        skill: skill.name,
        input,
      });
      setLastResult(job);
      refreshStats();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setActiveRun(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="page-heading">Desktop</h1>
        <Link
          to="/guide"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
        >
          New here? User Guide →
        </Link>
      </div>

      {!apiOnline && (
        <div className="border border-red-300 bg-red-50 rounded-lg p-4 text-red-800 text-sm">
          API offline at {API_URL}. Start uvicorn on port 8000.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OSWindow title="System Monitor" icon="📟" accent="blue">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Status</p>
              <p className={health.status === "ok" ? "text-emerald-600 font-medium" : "text-red-600"}>
                {health.status}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Version</p>
              <p className="text-slate-900">{health.version}</p>
            </div>
            <div>
              <p className="text-slate-500">Jobs</p>
              <p className="text-2xl font-bold text-blue-600">{stats.jobs}</p>
            </div>
            <div>
              <p className="text-slate-500">Providers up</p>
              <p className="text-2xl font-bold text-blue-600">{stats.providersUp}</p>
            </div>
          </div>
        </OSWindow>

        <OSWindow title="Real-Life Use Cases" icon="🌐" accent="emerald">
          <p className="text-sm text-slate-600 mb-4">
            Fintech, logistics, banking, telecom — 8 industry scenarios. No technical background needed.
          </p>
          <Link
            to="/use-cases"
            className="inline-block px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
          >
            Open Use Cases →
          </Link>
        </OSWindow>
        <OSWindow title="Agent Workbench" icon="🤖" accent="purple">
          <p className="text-sm text-slate-600 mb-4">Multi-step agent pipelines with timeline windows.</p>
          <Link
            to="/agent-workbench"
            className="inline-block px-4 py-2 rounded bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium"
          >
            Open Agent Workbench →
          </Link>
        </OSWindow>
      </div>

      <OSWindow title="Quick Launch" icon="⚡" accent="emerald" width="full">
        <p className="text-sm text-slate-600 mb-4">
          One-click run with default parameters. Open <Link to="/skills" className="q-link">Skills</Link> for full controls.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {skillCatalog.map((s) => (
            <div key={s.name} className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-center">
              <p className="text-xl mb-1">{s.icon}</p>
              <p className="font-medium text-slate-900 text-sm mb-2 capitalize truncate">
                {s.name.replace(/_/g, " ")}
              </p>
              <ActionButton
                onClick={() => quickRun(s)}
                loading={activeRun === s.name}
                disabled={!!activeRun && activeRun !== s.name}
              >
                Run
              </ActionButton>
            </div>
          ))}
        </div>
        {activeRun && (
          <p className="mt-3 text-sm text-blue-600 animate-pulse">Running {activeRun}…</p>
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {lastResult && (
          <div className="mt-4 border border-slate-200 rounded-lg p-4 bg-white">
            <SkillResultView
              skillName={lastResult.skill}
              jobResult={lastResult.result}
            />
          </div>
        )}
      </OSWindow>
    </div>
  );
}
