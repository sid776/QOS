import importlib.util
import json
from pathlib import Path
from typing import Any

import yaml


class SkillInfo:
    def __init__(self, name: str, version: str, skill_type: str, path: Path, manifest: dict):
        self.name = name
        self.version = version
        self.skill_type = skill_type
        self.path = path
        self.manifest = manifest

    def to_dict(self, include_manifest: bool = False) -> dict[str, Any]:
        data: dict[str, Any] = {
            "name": self.name,
            "version": self.version,
            "type": self.skill_type,
            "description": self.manifest.get("description", ""),
            "default_job_type": self.manifest.get("default_job_type", "circuit_simulation"),
            "category": self.manifest.get("category", "General"),
            "icon": self.manifest.get("icon", "⚡"),
            "result_view": self.manifest.get("result_view", "json"),
            "features": self.manifest.get("features", []),
            "input_fields": self.manifest.get("input_fields", []),
        }
        if include_manifest:
            data["manifest"] = self.manifest
        return data


class SkillRegistry:
    def __init__(self, skills_root: Path | None = None):
        root = skills_root or Path(__file__).resolve().parents[2] / "skills"
        self.skills_root = root
        self._skills: dict[str, SkillInfo] = {}
        self.discover()

    def discover(self) -> None:
        self._skills.clear()
        if not self.skills_root.exists():
            return
        for skill_dir in self.skills_root.iterdir():
            if not skill_dir.is_dir():
                continue
            manifest_path = skill_dir / "skill.yaml"
            if not manifest_path.exists():
                continue
            with open(manifest_path, encoding="utf-8") as f:
                manifest = yaml.safe_load(f)
            info = SkillInfo(
                name=manifest["name"],
                version=manifest.get("version", "0.1.0"),
                skill_type=manifest.get("type", "generic"),
                path=skill_dir,
                manifest=manifest,
            )
            self._skills[info.name] = info

    def list_skills(self) -> list[SkillInfo]:
        return list(self._skills.values())

    def get(self, name: str) -> SkillInfo | None:
        return self._skills.get(name)

    def run_skill(self, name: str, input_data: dict[str, Any]) -> dict[str, Any]:
        info = self._skills.get(name)
        if not info:
            raise ValueError(f"Skill not found: {name}")
        handler_path = info.path / "handler.py"
        spec = importlib.util.spec_from_file_location(f"skill_{name}", handler_path)
        if spec is None or spec.loader is None:
            raise RuntimeError(f"Cannot load handler for {name}")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        if not hasattr(module, "run"):
            raise RuntimeError(f"Skill {name} handler missing run()")
        return module.run(input_data)

    def install_from_local(self, name: str) -> bool:
        self.discover()
        return name in self._skills

    def load_sample_input(self, name: str) -> dict[str, Any]:
        path = self.skills_root / name / "sample_input.json"
        if path.exists():
            return json.loads(path.read_text(encoding="utf-8"))
        return {}
