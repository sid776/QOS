import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createJob,
  getSkillSample,
  listSkills,
  fetchApi,
  SKILL_JOB_TYPES,
  type JobDetail,
  type SkillMeta,
} from "../api";
import ActionButton from "./ActionButton";

type Props = {
  initialSkill?: string;
  onComplete?: (job: JobDetail) => void;
  redirectToJob?: boolean;
};

export default function JobForm({
  initialSkill = "hello_quantum",
  onComplete,
  redirectToJob = true,
}: Props) {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<SkillMeta[]>([]);
  const [skill, setSkill] = useState(initialSkill);
  const [jobType, setJobType] = useState(SKILL_JOB_TYPES[initialSkill] || "circuit_simulation");
  const [inputJson, setInputJson] = useState("{}");
  const [backend, setBackend] = useState("auto");
  const [providers, setProviders] = useState<
    { name: string; available: boolean; provider_type?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    listSkills()
      .then((d) => setSkills(d.skills))
      .catch(() => setSkills([]));
    fetchApi<{ providers: { name: string; available: boolean; provider_type?: string }[] }>(
      "/v1/providers"
    )
      .then((d) => setProviders(d.providers))
      .catch(() => setProviders([]));
  }, []);

  useEffect(() => {
    setSkill(initialSkill);
    setJobType(SKILL_JOB_TYPES[initialSkill] || "circuit_simulation");
  }, [initialSkill]);

  const loadSample = async () => {
    try {
      const { sample_input, default_job_type } = await getSkillSample(skill);
      setInputJson(JSON.stringify(sample_input, null, 2));
      setJobType(default_job_type || SKILL_JOB_TYPES[skill] || "circuit_simulation");
      setError("");
    } catch (e) {
      setError(String(e));
    }
  };

  useEffect(() => {
    void loadSample();
  }, [skill]);

  const submit = async () => {
    setLoading(true);
    setError("");
    setStatus("Creating job…");
    try {
      const input = JSON.parse(inputJson) as Record<string, unknown>;
      setStatus("Submitting job…");
      const meta = skills.find((s) => s.name === skill);
      const selected = providers.find((p) => p.name === backend);
      const allowCloud =
        selected?.provider_type === "cloud_quantum" || backend === "azure_quantum" || backend === "ibm_quantum" || backend === "origin_quantum";
      const job = await createJob({
        job_type: meta?.default_job_type || jobType,
        skill,
        input,
        preferred_backend: backend,
        constraints: {
          max_cost_usd: allowCloud ? 10 : 0,
          allow_cloud_quantum: allowCloud,
          allow_simulator: true,
        },
      });
      setStatus(`Done: ${job.state}`);
      onComplete?.(job);
      if (redirectToJob) navigate(`/jobs/${job.job_id}`);
    } catch (e) {
      setError(String(e));
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  const skillOptions = skills.length
    ? skills
    : Object.keys(SKILL_JOB_TYPES).map((name) => ({ name, default_job_type: SKILL_JOB_TYPES[name] } as SkillMeta));

  return (
    <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm space-y-4">
      <h3 className="font-semibold text-lg text-slate-900">Run a quantum job</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-sm text-slate-600">Skill</span>
          <select
            className="mt-1 w-full q-input p-2"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          >
            {skillOptions.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">Job type</span>
          <input
            className="mt-1 w-full q-input p-2"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">Backend</span>
          <select
            className="mt-1 w-full q-input p-2"
            value={backend}
            onChange={(e) => setBackend(e.target.value)}
          >
            <option value="auto">auto (router picks best)</option>
            {providers
              .filter((p) => p.available)
              .map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                  {p.provider_type === "cloud_quantum" ? " ☁" : ""}
                </option>
              ))}
            {providers.filter((p) => !p.available).length > 0 && (
              <optgroup label="Unavailable (needs install / credentials)">
                {providers
                  .filter((p) => !p.available)
                  .map((p) => (
                    <option key={p.name} value={p.name} disabled>
                      {p.name}
                    </option>
                  ))}
              </optgroup>
            )}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-sm text-slate-600">Input (JSON)</span>
        <textarea
          className="mt-1 w-full h-36 q-input p-2 font-mono text-sm"
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
        />
      </label>
      <div className="flex flex-wrap gap-3 items-center">
        <ActionButton onClick={submit} loading={loading}>
          Submit job
        </ActionButton>
        <ActionButton onClick={loadSample} variant="secondary">
          Reset sample input
        </ActionButton>
        {status && <span className="text-sm text-slate-600">{status}</span>}
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
