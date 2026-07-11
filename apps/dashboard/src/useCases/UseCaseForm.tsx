import { useMemo, useState } from "react";
import SkillForm, { buildDefaultInput } from "../skills/SkillForm";
import type { SkillMeta } from "../api";
import type { UseCaseInputField } from "./bundledUseCaseSchemas";
import type { UseCaseMeta } from "./types";

type Props = {
  useCase: UseCaseMeta;
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
};

const SECTION_ICONS: Record<string, string> = {
  Organization: "🏢",
  Portfolio: "📈",
  "Compliance & compute": "🔒",
  Operation: "🚚",
  Route: "🗺️",
  Fleet: "🚛",
  Optimization: "⚡",
  Reporting: "📊",
  Compliance: "📋",
  "Scan settings": "🔍",
  "Source code": "💻",
  Workflow: "⚙️",
  Network: "📡",
  "QKD simulation": "🔐",
  SLA: "✅",
  Service: "☁️",
  Entropy: "🎲",
  Security: "🛡️",
  Program: "🔬",
  Chemistry: "🔋",
  "Quantum model": "⚛️",
  Project: "📁",
  Workload: "🧪",
  Budget: "💰",
  "Feature store": "🗄️",
  "Quantum pipeline": "⚛️",
  Policy: "📜",
  "Data governance": "🔏",
};

function asSkillMeta(uc: UseCaseMeta, fields: UseCaseInputField[]): SkillMeta {
  return {
    name: uc.id,
    version: "1.0",
    type: uc.mode,
    description: uc.description,
    default_job_type: uc.mode,
    category: uc.industry,
    icon: "📦",
    result_view: "generic",
    features: uc.highlights ?? [],
    input_fields: fields,
    sample_input: uc.default_input ?? {},
  };
}

export function buildUseCaseDefaultInput(uc: UseCaseMeta): Record<string, unknown> {
  const skill = asSkillMeta(uc, (uc.input_fields ?? []) as UseCaseInputField[]);
  const fromFields = buildDefaultInput(skill);
  return { ...fromFields, ...(uc.default_input ?? {}) };
}

export default function UseCaseForm({ useCase, value, onChange }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fields = (useCase.input_fields ?? []) as UseCaseInputField[];

  const sections = useMemo(() => {
    const map = new Map<string, UseCaseInputField[]>();
    for (const f of fields) {
      const sec = f.section ?? "General";
      if (!map.has(sec)) map.set(sec, []);
      map.get(sec)!.push(f);
    }
    return Array.from(map.entries());
  }, [fields]);

  if (fields.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">Loading input form…</p>
    );
  }

  if (showAdvanced) {
    const skill = asSkillMeta(useCase, fields);
    return (
      <SkillForm
        skill={skill}
        value={value}
        onChange={onChange}
        showAdvanced
        onToggleAdvanced={() => setShowAdvanced(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {sections.map(([section, sectionFields]) => (
        <fieldset
          key={section}
          className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
        >
          <legend className="w-full px-5 py-3 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-800 flex items-center gap-2">
            <span>{SECTION_ICONS[section] ?? "📌"}</span>
            {section}
            <span className="ml-auto text-xs font-normal text-slate-400">
              {sectionFields.length} field{sectionFields.length === 1 ? "" : "s"}
            </span>
          </legend>
          <div className="p-5">
            <SkillForm
              skill={asSkillMeta(useCase, sectionFields)}
              value={value}
              onChange={onChange}
            />
          </div>
        </fieldset>
      ))}

      <button
        type="button"
        onClick={() => setShowAdvanced(true)}
        className="text-sm text-slate-500 hover:text-indigo-600"
      >
        Advanced JSON editor →
      </button>
    </div>
  );
}
