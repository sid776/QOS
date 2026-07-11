import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchApi } from "../api";
import SkillFeaturePanel from "../skills/SkillFeaturePanel";
import { getSkillTheme } from "../skills/skillThemes";
import type { SkillMeta } from "../skills/types";

export default function SkillDetail() {
  const { skillName } = useParams();
  const [skill, setSkill] = useState<SkillMeta | null>(null);

  useEffect(() => {
    if (!skillName) return;
    fetchApi<SkillMeta>(`/v1/skills/${skillName}`).then(setSkill).catch(() => setSkill(null));
  }, [skillName]);

  if (!skillName) return <p className="text-slate-600">No skill selected.</p>;

  const theme = getSkillTheme(skillName);

  return (
    <div className="space-y-6 max-w-5xl">
      <Link to="/skills" className="text-blue-600 text-sm hover:underline">
        ← All skills
      </Link>
      <div>
        <span className={`text-xs uppercase font-semibold px-2 py-0.5 rounded ${theme.badge} ${theme.badgeText}`}>
          {skill?.category ?? "Skill"}
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-2 flex items-center gap-2">
          <span>{skill?.icon}</span>
          {skillName.replace(/_/g, " ")}
        </h1>
        {skill && <p className="text-slate-600 mt-1">{skill.description}</p>}
      </div>
      <SkillFeaturePanel skillName={skillName} compact />
    </div>
  );
}
