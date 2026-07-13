import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchApi, postApi } from "../api";
import ActionButton from "../components/ActionButton";
import OSWindow from "../components/OSWindow";
import { getUseCaseTheme } from "../theme/useCaseColors";
import { enrichUseCaseMeta, getBundledUseCaseOrNull } from "./bundledUseCaseSchemas";
import UseCaseForm, { buildUseCaseDefaultInput } from "./UseCaseForm";
import UseCaseLaymanGuide from "./UseCaseLaymanGuide";
import { getUseCaseExplanation } from "./useCaseExplanations";
import { getUseCaseActions } from "./useCaseActions";
import FeatureResultView from "./FeatureResultView";
import QuantumComparisonView, { AnalysisPhaseTracker } from "./QuantumComparisonView";
import UseCaseResultView from "./UseCaseResultView";
import type { AnalyzeResult, UseCaseMeta, WizardStep } from "./types";

const ANALYSIS_PHASE_LABELS = [
  { id: "validate", label: "Validating your inputs" },
  { id: "classical", label: "Running traditional baseline" },
  { id: "quantum", label: "Running this feature" },
  { id: "compare", label: "Computing improvement" },
  { id: "pipeline", label: "Executing full pipeline" },
];

/** Pipeline job output duplicates rich analyze output for these apps. */
const PIPELINE_HIDDEN = new Set(["cloud_api_entropy", "crypto_pqc_wallet_hardening"]);

function InputReview({ form, fields }: { form: Record<string, unknown>; fields: UseCaseMeta["input_fields"] }) {
  return (
    <dl className="space-y-3">
      {(fields ?? []).map((f) => {
        const val = form[f.name];
        let display: string;
        if (Array.isArray(val)) display = val.join(", ");
        else if (val === true) display = "Yes";
        else if (val === false) display = "No";
        else if (typeof val === "string" && val.length > 120) display = `${val.slice(0, 120)}…`;
        else display = String(val ?? "—");
        return (
          <div key={f.name} className="flex flex-col sm:flex-row sm:gap-4 py-3 border-b border-slate-100 last:border-0">
            <dt className="text-sm font-medium text-slate-500 sm:w-1/3">{f.label}</dt>
            <dd className="text-sm text-slate-800 font-mono break-all sm:flex-1">{display}</dd>
          </div>
        );
      })}
    </dl>
  );
}

export default function UseCaseApp() {
  const { useCaseId } = useParams<{ useCaseId: string }>();
  const [uc, setUc] = useState<UseCaseMeta | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [wizardStep, setWizardStep] = useState<WizardStep>("understand");
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [activePhase, setActivePhase] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fields = uc?.input_fields ?? [];
  const hasFields = fields.length > 0;

  const applyUseCase = useCallback((data: UseCaseMeta) => {
    const enriched = enrichUseCaseMeta(data);
    setUc(enriched);
    setForm(buildUseCaseDefaultInput(enriched));
    setWizardStep("understand");
    setAnalyzeResult(null);
  }, []);

  useEffect(() => {
    if (!useCaseId) return;
    setLoadError(null);

    fetchApi<UseCaseMeta>(`/v1/use-cases/${useCaseId}`)
      .then(applyUseCase)
      .catch(() => {
        const fallback = getBundledUseCaseOrNull(useCaseId);
        if (!fallback) {
          setLoadError(`Unknown app: ${useCaseId}`);
          return;
        }
        fetchApi<{ use_cases: UseCaseMeta[] }>("/v1/use-cases")
          .then((catalog) => {
            const fromList = catalog.use_cases.find((c) => c.id === useCaseId);
            applyUseCase(enrichUseCaseMeta({ ...fallback, ...fromList, id: useCaseId }));
          })
          .catch(() => applyUseCase(fallback));
      });
  }, [useCaseId, applyUseCase]);

  const actions = useMemo(() => getUseCaseActions(useCaseId ?? ""), [useCaseId]);
  const phaseLabels = actions.phases.length ? actions.phases : ANALYSIS_PHASE_LABELS;

  const runAnalysis = useCallback(async () => {
    if (!useCaseId) return;
    setWizardStep("analyzing");
    setActivePhase(0);
    setAnalyzeResult(null);
    setLoading(true);

    const phaseTimer = setInterval(() => {
      setActivePhase((p) => Math.min(p + 1, phaseLabels.length - 1));
    }, 900);

    try {
      const r = await postApi<AnalyzeResult>(`/v1/use-cases/${useCaseId}/analyze`, { input: form });
      clearInterval(phaseTimer);
      setActivePhase(phaseLabels.length);
      await new Promise((res) => setTimeout(res, 600));
      setAnalyzeResult(r);
      setWizardStep("results");
    } catch (e) {
      clearInterval(phaseTimer);
      const msg = String(e);
      const staleApi =
        msg.includes("404") || msg.includes("Unknown use case") || msg.includes("Not Found");
      setAnalyzeResult({
        use_case_id: useCaseId,
        title: uc?.title ?? useCaseId,
        industry: uc?.industry ?? "",
        status: "FAILED",
        error: staleApi
          ? "Analysis failed — the API server is out of date (restart uvicorn on port 8000 with the latest QuantumOS code)."
          : msg,
      });
      setWizardStep("results");
    } finally {
      setLoading(false);
    }
  }, [useCaseId, form, uc, phaseLabels.length]);

  const stepLabels: { id: WizardStep; label: string }[] = useMemo(
    () => [
      { id: "understand", label: "0. Understand" },
      { id: "inputs", label: "1. Your inputs" },
      { id: "review", label: "2. Review" },
      { id: "analyzing", label: "3. Analyze" },
      { id: "results", label: "4. Results" },
    ],
    []
  );
  const stepOrder: WizardStep[] = ["understand", "inputs", "review", "analyzing", "results"];
  const currentStepIdx = stepOrder.indexOf(wizardStep === "intro" ? "understand" : wizardStep);
  const guide = getUseCaseExplanation(useCaseId ?? "");

  if (loadError) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <p className="text-rose-600 mb-4">{loadError}</p>
        <Link to="/use-cases" className="q-link">← Back to apps</Link>
      </div>
    );
  }

  if (!uc) {
    return (
      <div className="flex justify-center py-20">
        <span className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const theme = getUseCaseTheme(uc.id);
  const phasesForTracker = phaseLabels.map((p, i) => ({
    ...p,
    summary: analyzeResult?.phases?.[i]?.summary ?? (i === 0 ? `${fields.length} fields configured` : undefined),
    status: i < activePhase ? "completed" : i === activePhase ? "running" : "pending",
  }));

  return (
    <div className="space-y-6 max-w-5xl">
      <div className={`rounded-2xl border overflow-hidden shadow-md ${theme.border}`}>
        <div className={`h-2 bg-gradient-to-r ${theme.accent}`} />
        <div className={`p-6 md:p-8 ${theme.cardSelected}`}>
          <div className="flex gap-4">
            <span className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-white/90 border ${theme.border}`}>
              {theme.icon}
            </span>
            <div>
              <Link to="/use-cases" className="text-xs text-slate-500 hover:text-indigo-600">← All apps</Link>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{uc.title}</h1>
              <p className="text-sm text-slate-600 mt-1">{guide?.tagline ?? uc.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {stepLabels.map((s, i) => {
          const done = i < currentStepIdx;
          const active = s.id === wizardStep;
          const clickable = i <= currentStepIdx && s.id !== "analyzing";
          return (
            <button
              key={s.id}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && setWizardStep(s.id)}
              className={`flex-1 min-w-[100px] text-center py-2.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
                active
                  ? "bg-indigo-600 text-white shadow-md"
                  : done
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {done && !active ? "✓ " : ""}
              {s.label}
            </button>
          );
        })}
      </div>

      {wizardStep === "understand" && (
        <OSWindow title="Full scenario guide — problem, pipeline, outputs" icon="📖" accent="blue" width="full">
          <UseCaseLaymanGuide useCaseId={uc.id} inputFields={fields} />
          <div className="mt-8 pt-6 border-t border-slate-200">
            <ActionButton onClick={() => setWizardStep("inputs")}>Got it — configure my scenario →</ActionButton>
          </div>
        </OSWindow>
      )}

      {(wizardStep === "inputs" || wizardStep === "intro") && (
        <OSWindow title="Enter your scenario details" icon="✏️" accent="indigo" width="full">
          <div className="mb-4 flex flex-wrap gap-2 text-xs">
            {Array.from(new Set((uc.input_fields ?? []).map((f) => (f as { section?: string }).section).filter(Boolean))).map(
              (sec) => (
                <span key={sec} className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium">
                  {sec}
                </span>
              )
            )}
          </div>

          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>{fields.length} configuration fields</strong> — complete each section like a commercial deployment
            wizard. Values drive the feature output and the comparison at the end.
          </div>

          {hasFields ? (
            <UseCaseForm useCase={uc} value={form} onChange={setForm} />
          ) : (
            <p className="text-slate-500">Loading input form…</p>
          )}

          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-slate-200">
            <ActionButton onClick={() => setWizardStep("review")} disabled={!hasFields}>
              Continue to review →
            </ActionButton>
            <button
              type="button"
              className="text-sm px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setForm(buildUseCaseDefaultInput(uc))}
            >
              Reset to defaults
            </button>
            <span className="text-xs text-slate-400 self-center ml-auto">{fields.length} fields</span>
          </div>
        </OSWindow>
      )}

      {wizardStep === "review" && (
        <OSWindow title="Review your answers" icon="📋" accent="blue" width="full">
          <p className="text-sm text-slate-600 mb-4">{actions.reviewingText}</p>
          <InputReview form={form} fields={fields} />
          <div className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900">
            {actions.reviewFlow}
          </div>
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setWizardStep("inputs")}
              className="text-sm px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              ← Edit inputs
            </button>
            <ActionButton onClick={runAnalysis} loading={loading}>
              {actions.runButton}
            </ActionButton>
          </div>
        </OSWindow>
      )}

      {wizardStep === "analyzing" && (
        <OSWindow title="Calculating on your inputs…" icon="⚛️" accent="purple" width="full">
          <div className="py-8">
            <AnalysisPhaseTracker
              phases={phasesForTracker}
              activeIndex={Math.min(activePhase, phaseLabels.length - 1)}
            />
          </div>
        </OSWindow>
      )}

      {wizardStep === "results" && analyzeResult && (
        <div className="space-y-6">
          {analyzeResult.error && (
            <p className="text-rose-700 bg-rose-50 rounded-xl p-4 border border-rose-100">{analyzeResult.error}</p>
          )}

          {analyzeResult.pipeline_error && (
            <p className="text-amber-800 bg-amber-50 rounded-xl p-4 border border-amber-200 text-sm">
              Pipeline note: {analyzeResult.pipeline_error} — feature results above are still valid.
            </p>
          )}

          {analyzeResult.quantum && !analyzeResult.error && (
            <OSWindow title={actions.resultsTitle} icon={theme.icon} accent="emerald" width="full">
              {analyzeResult.quantum.method && (
                <p className="text-sm text-slate-600 mb-5 pb-4 border-b border-slate-200">{analyzeResult.quantum.method}</p>
              )}
              <FeatureResultView useCaseId={uc.id} quantum={analyzeResult.quantum} accent={theme.accent} />
            </OSWindow>
          )}

          {analyzeResult.quantum_run && !PIPELINE_HIDDEN.has(uc.id) && (
            <OSWindow title="Technical pipeline output" icon="🔬" accent="indigo" width="full">
              <UseCaseResultView output={analyzeResult.quantum_run} skillName={uc.skill} />
            </OSWindow>
          )}

          {analyzeResult.comparison && (
            <OSWindow title={actions.comparisonTitle} icon="📊" accent="purple" width="full">
              <QuantumComparisonView
                useCaseId={uc.id}
                classical={analyzeResult.classical}
                quantum={analyzeResult.quantum}
                comparison={analyzeResult.comparison}
                accent={theme.accent}
              />
            </OSWindow>
          )}

          <div className="flex flex-wrap gap-3">
            <ActionButton onClick={() => { setWizardStep("inputs"); setAnalyzeResult(null); }}>
              Change inputs & run again
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
}
