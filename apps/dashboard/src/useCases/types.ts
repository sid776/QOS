import type { InputField } from "../skills/types";

export type UseCaseMeta = {
  id: string;
  industry: string;
  title: string;
  description: string;
  problem: string;
  quantum_value: string;
  mode: string;
  audience?: string;
  outcome_preview?: string;
  highlights?: string[];
  steps?: string[];
  tags?: string[];
  metrics?: { label: string; value: string }[];
  skill?: string;
  workflow?: string;
  input_fields?: InputField[];
  default_input?: Record<string, unknown>;
};

export type CompareMetricRow = {
  name: string;
  label: string;
  classical: number | string;
  quantum: number | string;
  unit?: string;
  delta_pct: number;
  higher_is_better: boolean;
};

export type AnalyzePhase = {
  id: string;
  label: string;
  status: string;
  summary?: string;
  metrics?: Record<string, unknown>;
};

export type AnalyzeResult = {
  use_case_id: string;
  title: string;
  industry: string;
  status: string;
  input_used?: Record<string, unknown>;
  phases?: AnalyzePhase[];
  classical?: {
    label: string;
    method: string;
    metrics: Record<string, unknown>;
    output: Record<string, unknown>;
  };
  quantum?: {
    label: string;
    method: string;
    metrics: Record<string, unknown>;
    output: Record<string, unknown>;
  };
  comparison?: {
    headline: string;
    improvement_pct: number;
    improvement_label: string;
    metrics: CompareMetricRow[];
    narrative: string;
    quantum_advantage_points: string[];
  };
  quantum_run?: Record<string, unknown>;
  pipeline_error?: string;
  pipeline_status?: string;
  error?: string;
};

export type UseCaseRunResult = {
  use_case_id: string;
  title: string;
  industry: string;
  status: string;
  input_used?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
};

export type WizardStep = "understand" | "intro" | "inputs" | "review" | "analyzing" | "results";
