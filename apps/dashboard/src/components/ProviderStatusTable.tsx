type Provider = {
  name: string;
  available: boolean;
  capabilities: string[];
  provider_type?: string;
};

export default function ProviderStatusTable({ providers }: { providers: Provider[] }) {
  return (
    <table className="w-full text-left border-collapse text-slate-800">
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50">
          <th className="py-2 px-2 font-medium">Name</th>
          <th className="py-2 px-2 font-medium">Available</th>
          <th className="py-2 px-2 font-medium">Type</th>
          <th className="py-2 px-2 font-medium">Capabilities</th>
        </tr>
      </thead>
      <tbody>
        {providers.map((p) => (
          <tr key={p.name} className="border-b border-slate-100 hover:bg-slate-50">
            <td className="py-2 px-2 font-mono text-sm">{p.name}</td>
            <td className="py-2 px-2">{p.available ? "Yes" : "No"}</td>
            <td className="py-2 px-2">{p.provider_type || "—"}</td>
            <td className="py-2 px-2 text-sm text-slate-600">{p.capabilities.join(", ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
