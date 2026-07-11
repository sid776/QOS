#!/usr/bin/env python3
"""Run all QuantumOS real-life use cases and print a summary report."""

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
os.environ.setdefault("DATABASE_URL", f"sqlite:///{ROOT / 'use_cases_run.db'}")
os.environ.setdefault("PYTHONPATH", str(ROOT))

from use_cases.runner import run_all_use_cases  # noqa: E402


def main() -> None:
    print("=" * 72)
    print("QuantumOS — Real-Life Quantum Use Case Runner")
    print("=" * 72)
    report = run_all_use_cases()
    summary = report["summary"]
    print(f"\nTotal: {summary['total']}  |  Completed: {summary['completed']}  |  Failed: {summary['failed']}\n")

    for r in report["results"]:
        status = r.get("status", "?")
        icon = "OK" if status == "COMPLETED" else "!!"
        print(f"[{icon}] {r.get('title', r.get('use_case_id'))}")
        print(f"     Industry: {r.get('industry', '—')}")
        print(f"     Status:   {status}")
        out = r.get("output", {})
        if r.get("mode") == "job" or "job_id" in str(out):
            job = out if isinstance(out, dict) and "job_id" in out else out
            if isinstance(job, dict):
                print(f"     Job:      {job.get('job_id', '—')} @ {job.get('selected_provider', '—')}")
                preview = job.get("result")
                if preview:
                    text = json.dumps(preview, default=str)[:200]
                    print(f"     Result:   {text}...")
        elif isinstance(out, dict):
            print(f"     Workflow: {out.get('workflow_name', '—')}")
            print(f"     Steps:    {len(out.get('steps', []))}")
            if out.get("recommendation"):
                print(f"     Advice:   {out['recommendation'][:120]}...")
        if r.get("error"):
            print(f"     Error:    {r['error']}")
        print()

    out_path = ROOT / "use_cases_report.json"
    out_path.write_text(json.dumps(report, indent=2, default=str), encoding="utf-8")
    print(f"Full report written to: {out_path}")


if __name__ == "__main__":
    main()
