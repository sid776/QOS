import type { InputField } from "../skills/types";
import type { SkillMeta } from "../api";
import SkillForm from "../skills/SkillForm";

type Props = {
  field: InputField;
  fieldIndex: number;
  totalFields: number;
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
  useCase: SkillMeta;
};

export default function UseCaseFieldStep({ field, fieldIndex, totalFields, value, onChange, useCase }: Props) {
  const miniSkill: SkillMeta = {
    ...useCase,
    input_fields: [field],
  };

  const pct = Math.round(((fieldIndex + 1) / totalFields) * 100);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>
            Question {fieldIndex + 1} of {totalFields}
          </span>
          <span>{pct}% complete</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-6">
        <SkillForm skill={miniSkill} value={value} onChange={onChange} />
      </div>

      {field.help && (
        <div className="flex gap-3 text-sm text-slate-600 bg-white rounded-lg border border-slate-200 p-4">
          <span className="text-xl shrink-0">💡</span>
          <p>{field.help}</p>
        </div>
      )}
    </div>
  );
}
