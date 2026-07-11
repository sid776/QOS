export type InputFieldType = "number" | "text" | "tags" | "select" | "boolean" | "code";

export type InputField = {
  name: string;
  type: InputFieldType | string;
  label: string;
  default?: unknown;
  min?: number;
  max?: number;
  options?: string[];
  help?: string;
  section?: string;
};

export type { SkillMeta } from "../api";

export type SkillJobResult = {
  state: string;
  job_id?: string;
  selected_provider?: string;
  result?: Record<string, unknown>;
  error?: string;
};
