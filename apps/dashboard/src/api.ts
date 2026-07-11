function resolveApiUrl(): string {
  const env = import.meta.env.VITE_API_URL as string | undefined;
  // Bundled Railway/production build: API + UI on same origin
  if (env === "") {
    return typeof window !== "undefined" ? window.location.origin : "";
  }
  if (env) {
    return env.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }
  return "http://127.0.0.1:8000";
}

const API_URL = resolveApiUrl();

export async function fetchApi<T>(path: string): Promise<T> {
  let r: Response;
  try {
    r = await fetch(`${API_URL}${path}`);
  } catch {
    throw new Error(
      `Cannot reach API at ${API_URL}. Start it with: uvicorn apps.api.quantumos_api.main:app --port 8000`
    );
  }
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function postApi<T>(path: string, body: unknown): Promise<T> {
  let r: Response;
  try {
    r = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      `Cannot reach API at ${API_URL}. Start it with: uvicorn apps.api.quantumos_api.main:app --port 8000`
    );
  }
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export type JobCreatePayload = {
  job_type: string;
  skill?: string;
  input: Record<string, unknown>;
  constraints?: Record<string, unknown>;
  preferred_backend?: string;
  data_classification?: string;
};

export type JobSummary = {
  job_id: string;
  state: string;
  job_type?: string;
  skill?: string;
  selected_provider?: string;
};

export type JobDetail = JobSummary & {
  result?: Record<string, unknown>;
  error?: string;
};

export async function createJob(payload: JobCreatePayload, wait = true) {
  const qs = wait ? "?wait=true" : "?wait=false";
  return postApi<JobDetail>(`/v1/jobs${qs}`, {
    constraints: { max_cost_usd: 0, allow_cloud_quantum: false, allow_simulator: true },
    preferred_backend: "auto",
    data_classification: "public_demo",
    ...payload,
  });
}

export async function getJob(jobId: string) {
  return fetchApi<JobDetail>(`/v1/jobs/${jobId}`);
}

export async function pollJobUntilDone(
  jobId: string,
  onUpdate?: (job: JobDetail) => void,
  maxAttempts = 40,
  intervalMs = 500
): Promise<JobDetail> {
  for (let i = 0; i < maxAttempts; i++) {
    const job = await getJob(jobId);
    onUpdate?.(job);
    if (["COMPLETED", "FAILED", "REJECTED", "CANCELLED"].includes(job.state)) {
      return job;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return getJob(jobId);
}

export async function getSkillSample(name: string) {
  return fetchApi<{
    name: string;
    sample_input: Record<string, unknown>;
    default_job_type: string;
  }>(`/v1/skills/${name}/sample`);
}

export type SkillMeta = {
  name: string;
  version: string;
  type: string;
  description: string;
  default_job_type: string;
  category: string;
  icon: string;
  result_view: string;
  features: string[];
  input_fields: {
    name: string;
    type: string;
    label: string;
    default?: unknown;
    min?: number;
    max?: number;
    options?: string[];
    help?: string;
  }[];
  sample_input?: Record<string, unknown>;
};

export async function listSkills() {
  return fetchApi<{ skills: SkillMeta[] }>("/v1/skills");
}

export async function getSkillDetail(name: string) {
  return fetchApi<SkillMeta>(`/v1/skills/${name}`);
}

/** @deprecated Use skill.default_job_type from API instead */
export const SKILL_JOB_TYPES: Record<string, string> = {
  hello_quantum: "circuit_simulation",
  qrng_demo: "quantum_demo",
  bb84_simulator: "qkd_simulation",
  portfolio_optimizer: "optimization",
  route_optimizer: "optimization",
  pqc_encryptor: "post_quantum_crypto",
  crypto_migration_scan: "security",
};

export { API_URL };
