type Props = { status: string; version: string; service: string };

export default function SystemHealthCard({ status, version, service }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">System Health</h3>
      <p className={status === "ok" ? "text-emerald-600 font-medium" : "text-amber-600"}>{status}</p>
      <p className="text-slate-500 text-sm mt-2">
        {service} v{version}
      </p>
    </div>
  );
}
