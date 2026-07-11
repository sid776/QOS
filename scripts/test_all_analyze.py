"""Smoke-test analyze_use_case for every catalog entry."""

from use_cases.catalog import USE_CASES
from use_cases.runner import analyze_use_case

failures: list[tuple[str, str]] = []
for uc in USE_CASES:
    try:
        r = analyze_use_case(uc.id)
        status = r.get("status")
        err = r.get("error")
        if err:
            failures.append((uc.id, f"error={err}"))
        elif not r.get("comparison"):
            failures.append((uc.id, "missing comparison"))
        elif status == "FAILED":
            failures.append((uc.id, f"status=FAILED quantum_run may have failed"))
        else:
            print(f"OK  {uc.id:40} status={status}")
    except Exception as e:
        failures.append((uc.id, repr(e)))

print("\n--- FAILURES ---")
for fid, err in failures:
    print(f"FAIL {fid}: {err}")
print(f"\n{len(USE_CASES) - len(failures)}/{len(USE_CASES)} passed")
