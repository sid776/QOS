import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchApi } from "../api";
import MarkdownDoc from "../components/MarkdownDoc";
import OSWindow from "../components/OSWindow";
import { BUNDLED_DOCS, getBundledDoc, listBundledDocs } from "../content/bundledDocs";

type DocMeta = { id: string; title: string; description: string };
type DocContent = DocMeta & { content: string; path: string; source?: "api" | "bundled" };

const DOC_TABS: { id: string; label: string; icon: string }[] = [
  { id: "readme", label: "README", icon: "📄" },
  { id: "quantum-research", label: "Quantum Research", icon: "⚛️" },
  { id: "dev-guide", label: "DEV_GUIDE.md", icon: "🛠" },
];

async function loadDoc(activeId: string): Promise<DocContent> {
  const bundled = getBundledDoc(activeId);
  if (!bundled) {
    throw new Error(`Unknown document: ${activeId}`);
  }
  try {
    const fromApi = await fetchApi<DocContent>(`/v1/docs/${activeId}`);
    return { ...fromApi, source: "api" };
  } catch {
    return {
      id: bundled.id,
      title: bundled.title,
      description: bundled.description,
      path: bundled.path,
      content: bundled.content,
      source: "bundled",
    };
  }
}

export default function Docs() {
  const { docId } = useParams();
  const activeId = docId ?? "readme";
  const [catalog, setCatalog] = useState<DocMeta[]>(listBundledDocs());
  const [doc, setDoc] = useState<DocContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApi<{ docs: DocMeta[] }>("/v1/docs")
      .then((d) => setCatalog(d.docs))
      .catch(() => setCatalog(listBundledDocs()));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    loadDoc(activeId)
      .then(setDoc)
      .catch((e) => {
        setDoc(null);
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => setLoading(false));
  }, [activeId]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-heading">Documentation</h1>
          <p className="page-sub mt-1">
            README, quantum research notes, and dev guide — bundled in the app; live from API when
            available.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/guide" className="text-sm q-link">
            User Guide →
          </Link>
          <Link to="/dev-guide" className="text-sm q-link">
            Interactive Dev Guide →
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {DOC_TABS.map((tab) => (
          <Link
            key={tab.id}
            to={tab.id === "readme" ? "/readme" : `/readme/${tab.id}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeId === tab.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:border-indigo-200"
            }`}
          >
            {tab.icon} {tab.label}
          </Link>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-indigo-600 py-12">
          <span className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-sm">Loading document…</span>
        </div>
      )}

      {error && (
        <OSWindow title="Cannot load document" icon="⚠️" accent="amber" width="full">
          <p className="text-rose-700 text-sm mb-3">{error}</p>
        </OSWindow>
      )}

      {doc && !loading && (
        <OSWindow title={doc.title} icon="📄" accent="blue" width="full">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <p className="text-xs text-slate-500 font-mono">{doc.path}</p>
            {doc.source === "bundled" && (
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Bundled copy — restart API for live sync
              </span>
            )}
            {doc.source === "api" && (
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Live from API
              </span>
            )}
          </div>
          <MarkdownDoc content={doc.content} />
        </OSWindow>
      )}

      {!loading && doc && (
        <p className="text-xs text-slate-400">
          {catalog.length} documents · keys: {Object.keys(BUNDLED_DOCS).join(", ")}
        </p>
      )}
    </div>
  );
}
