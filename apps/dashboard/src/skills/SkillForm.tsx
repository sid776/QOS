import { useEffect, useState } from "react";
import type { InputField, SkillMeta } from "./types";

type Props = {
  skill: SkillMeta;
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
  showAdvanced?: boolean;
  onToggleAdvanced?: () => void;
};

function fieldDefault(field: InputField, sample: Record<string, unknown>): unknown {
  if (field.name in sample) return sample[field.name];
  if (field.default !== undefined) return field.default;
  if (field.type === "tags") return [];
  if (field.type === "boolean") return false;
  if (field.type === "number") return field.min ?? 0;
  return "";
}

export function buildDefaultInput(skill: SkillMeta): Record<string, unknown> {
  const sample = skill.sample_input ?? {};
  const out: Record<string, unknown> = {};
  for (const f of skill.input_fields ?? []) {
    out[f.name] = fieldDefault(f, sample);
  }
  return { ...out, ...sample };
}

export default function SkillForm({ skill, value, onChange, showAdvanced, onToggleAdvanced }: Props) {
  const [jsonText, setJsonText] = useState(JSON.stringify(value, null, 2));

  useEffect(() => {
    if (!showAdvanced) setJsonText(JSON.stringify(value, null, 2));
  }, [value, showAdvanced]);

  const set = (name: string, v: unknown) => onChange({ ...value, [name]: v });

  if (showAdvanced) {
    return (
      <div className="space-y-3">
        <textarea
          className="w-full h-48 q-input p-3 font-mono text-sm"
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            try {
              onChange(JSON.parse(e.target.value) as Record<string, unknown>);
            } catch {
              /* invalid json while typing */
            }
          }}
        />
        {onToggleAdvanced && (
          <button type="button" onClick={onToggleAdvanced} className="text-sm text-indigo-600 hover:underline">
            ← Back to form
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(skill.input_fields ?? []).map((field) => (
        <label key={field.name} className="block">
          <span className="text-sm font-medium text-slate-700">{field.label}</span>
          {field.help && <p className="text-xs text-slate-500 mt-0.5 mb-1">{field.help}</p>}

          {field.type === "number" && (
            <input
              type="number"
              className="mt-1 w-full q-input p-2"
              min={field.min}
              max={field.max}
              value={Number(value[field.name] ?? field.default ?? 0)}
              onChange={(e) => set(field.name, Number(e.target.value))}
            />
          )}

          {field.type === "text" && (
            <input
              type="text"
              className="mt-1 w-full q-input p-2"
              value={String(value[field.name] ?? field.default ?? "")}
              onChange={(e) => set(field.name, e.target.value)}
            />
          )}

          {field.type === "tags" && (
            <input
              type="text"
              className="mt-1 w-full q-input p-2"
              placeholder="Comma-separated values"
              value={Array.isArray(value[field.name]) ? (value[field.name] as string[]).join(", ") : ""}
              onChange={(e) =>
                set(
                  field.name,
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
            />
          )}

          {field.type === "select" && (
            <select
              className="mt-1 w-full q-input p-2"
              value={String(value[field.name] ?? field.default ?? "")}
              onChange={(e) => set(field.name, e.target.value)}
            >
              {(field.options ?? []).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {field.type === "boolean" && (
            <div className="mt-2">
              <input
                type="checkbox"
                className="mr-2"
                checked={Boolean(value[field.name] ?? field.default ?? false)}
                onChange={(e) => set(field.name, e.target.checked)}
              />
              <span className="text-sm text-slate-600">Enabled</span>
            </div>
          )}

          {field.type === "code" && (
            <textarea
              className="mt-1 w-full h-36 q-input p-3 font-mono text-sm"
              value={String(value[field.name] ?? field.default ?? "")}
              onChange={(e) => set(field.name, e.target.value)}
            />
          )}
        </label>
      ))}

      {onToggleAdvanced && (
        <button type="button" onClick={onToggleAdvanced} className="text-sm text-slate-500 hover:text-indigo-600">
          Advanced JSON editor →
        </button>
      )}
    </div>
  );
}
