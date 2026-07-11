import json
from pathlib import Path

from use_cases.input_schemas import FRAUD_FEATURE_CODE, LEGACY_PAYMENT_CODE, USE_CASE_INPUT_SCHEMAS
from use_cases.runner import list_use_cases

catalog = list_use_cases()

catalog_json = json.dumps(catalog, indent=2)

out = Path("apps/dashboard/src/useCases/bundledUseCaseSchemas.ts")
lines = [
    'import type { InputField } from "../skills/types";',
    'import type { UseCaseMeta } from "./types";',
    "",
    "export type UseCaseInputField = InputField & { section?: string };",
    "",
    f"export const LEGACY_PAYMENT_CODE = {json.dumps(LEGACY_PAYMENT_CODE)};",
    f"export const FRAUD_FEATURE_CODE = {json.dumps(FRAUD_FEATURE_CODE)};",
    "",
    "type BundledSchema = {",
    "  input_fields: UseCaseInputField[];",
    "  default_input: Record<string, unknown>;",
    "};",
    "",
    "export const BUNDLED_USE_CASE_SCHEMAS: Record<string, BundledSchema> = ",
    json.dumps(USE_CASE_INPUT_SCHEMAS, indent=2),
    ";",
    "",
    "/** Full catalog snapshot — used when API is stale or offline. */",
    f"export const BUNDLED_USE_CASE_CATALOG: UseCaseMeta[] = {catalog_json};",
    "",
    """/** Always prefer bundled commercial schemas (richer than stale API). */
export function enrichUseCaseMeta(api: UseCaseMeta): UseCaseMeta {
  const bundled = BUNDLED_USE_CASE_SCHEMAS[api.id];
  if (!bundled) return api;

  const input_fields = bundled.input_fields;
  const default_input = { ...bundled.default_input, ...(api.default_input ?? {}) };

  return { ...api, input_fields, default_input };
}

/** Merge API catalog with bundled snapshot so new apps always appear in the launcher. */
export function mergeUseCaseCatalog(apiCases: UseCaseMeta[]): UseCaseMeta[] {
  const byId = new Map<string, UseCaseMeta>();
  for (const bundled of BUNDLED_USE_CASE_CATALOG) {
    byId.set(bundled.id, enrichUseCaseMeta(bundled));
  }
  for (const api of apiCases) {
    const base = byId.get(api.id);
    byId.set(api.id, enrichUseCaseMeta({ ...(base ?? {}), ...api, id: api.id }));
  }
  const order = BUNDLED_USE_CASE_CATALOG.map((c) => c.id);
  return order.filter((id) => byId.has(id)).map((id) => byId.get(id)!);
}

export function getBundledUseCaseOrNull(id: string): UseCaseMeta | null {
  const fromCatalog = BUNDLED_USE_CASE_CATALOG.find((c) => c.id === id);
  if (!fromCatalog) return null;
  return enrichUseCaseMeta(fromCatalog);
}
""",
]

out.write_text("\n".join(lines), encoding="utf-8")
print("wrote", out, f"({len(catalog)} use cases)")
