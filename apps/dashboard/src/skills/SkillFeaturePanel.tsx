import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import { createJob, getSkillDetail, type JobDetail } from "../api";
import SkillForm, { buildDefaultInput } from "./SkillForm";
import SkillResultView from "./SkillResults";
import { getSkillTheme } from "./skillThemes";
import type { SkillMeta } from "./types";

type Props = {
  skillName: string;
  compact?: boolean;
  onClose?: () => void;
};

export default function SkillFeaturePanel({ skillName, compact, onClose }: Props) {
  const [skill, setSkill] = useState<SkillMeta | null>(null);
  const [input, setInput] = useState<Record<string, unknown>>({});
  const [advanced, setAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getSkillDetail(skillName)
      .then((s) => {
        setSkill(s);
        setInput(buildDefaultInput(s));
        setJob(null);
        setError("");
      })
      .catch((e) => setError(String(e)));
  }, [skillName]);

  const run = async () => {
    if (!skill) return;
    setLoading(true);
    setError("");
    setJob(null);
    try {
      const result = await createJob({
        job_type: skill.default_job_type,
        skill: skill.name,
        input,
      });
      setJob(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  if (!skill) {
    return <p className="text-slate-500 text-sm">{error || "Loading skill…"}</p>;
  }

  const theme = getSkillTheme(skill.name);

  return (
    <div className={`use-case-expand rounded-2xl border p-5 bg-gradient-to-br ${theme.gradient} ${theme.border} shadow-md`}>
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <span className={`inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md ${theme.badge} ${theme.badgeText}`}>
            {skill.category}
          </span>
          <h3 className="font-semibold text-slate-800 mt-2 flex items-center gap-2">
            <span>{skill.icon}</span>
            {skill.name.replace(/_/g, " ")}
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">{skill.description}</p>
        </div>
        <div className="flex gap-2">
          {!compact && (
            <Link to={`/skills/${skill.name}`} className="text-sm text-indigo-600 hover:underline px-2 py-1">
              Full page →
            </Link>
          )}
          {onClose && (
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm px-2 py-1 rounded-lg hover:bg-white/60">
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {(skill.features ?? []).length > 0 && (
        <ul className="flex flex-wrap gap-2 mb-5">
          {(skill.features ?? []).map((f) => (
            <li key={f} className="text-xs bg-white/70 border border-white rounded-full px-3 py-1 text-slate-600">
              {f}
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 rounded-xl border border-white p-4">
          <p className="text-xs font-semibold uppercase text-slate-500 mb-3">Configure</p>
          <SkillForm
            skill={skill}
            value={input}
            onChange={setInput}
            showAdvanced={advanced}
            onToggleAdvanced={() => setAdvanced((a) => !a)}
          />
          <div className="mt-4 flex flex-wrap gap-3 items-center">
            <ActionButton onClick={run} loading={loading}>
              Run skill
            </ActionButton>
            <button
              type="button"
              className="text-sm text-slate-500 hover:text-indigo-600"
              onClick={() => setInput(buildDefaultInput(skill))}
            >
              Reset defaults
            </button>
          </div>
          {error && <p className="text-rose-600 text-sm mt-3">{error}</p>}
        </div>

        <div className="bg-white/80 rounded-xl border border-white p-4">
          <p className="text-xs font-semibold uppercase text-slate-500 mb-3">Results</p>
          {loading && (
            <div className="flex items-center gap-3 text-indigo-600">
              <span className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <span className="text-sm font-medium">Running…</span>
            </div>
          )}
          {!loading && !job && <p className="text-slate-500 text-sm">Configure parameters and press Run.</p>}
          {job && (
            <div className="space-y-3">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                  job.state === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
                }`}
              >
                {job.state}
              </span>
              {job.error && <p className="text-rose-700 text-sm bg-rose-50 rounded-lg p-2">{job.error}</p>}
              <SkillResultView skillName={skill.name} resultView={skill.result_view} jobResult={job.result} />
              {job.job_id && (
                <Link to={`/jobs/${job.job_id}`} className="q-link text-sm">
                  View job details →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
