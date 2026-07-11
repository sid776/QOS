type Props = {
  title: string;
  layman: string;
  technical: string;
  files?: string[];
  code?: string;
};

export default function DevSection({ title, layman, technical, files, code }: Props) {
  return (
    <section className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white/60">
      <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800 tracking-tight">{title}</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        <div className="p-5">
          <p className="text-[10px] uppercase tracking-widest text-indigo-600 font-semibold mb-2">
            Plain English
          </p>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{layman}</p>
        </div>
        <div className="p-5 bg-slate-50/40">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-2">
            Developer detail
          </p>
          <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-line font-mono">
            {technical}
          </p>
        </div>
      </div>
      {files && files.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 bg-white/80">
          <p className="text-[10px] uppercase text-slate-400 mb-1.5">Key files</p>
          <ul className="flex flex-wrap gap-2">
            {files.map((f) => (
              <li
                key={f}
                className="text-[11px] font-mono px-2 py-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-100"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
      {code && (
        <pre className="mx-5 mb-5 text-[11px] bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
          {code}
        </pre>
      )}
    </section>
  );
}
