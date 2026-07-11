import { useEffect, useState } from "react";
import { fetchApi } from "../api";

export default function Audit() {
  const [events, setEvents] = useState<
    { operation: string; success: boolean; event_hash: string; created_at: string }[]
  >([]);

  useEffect(() => {
    fetchApi<{ events: typeof events }>("/v1/audit").then((d) => setEvents(d.events));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Audit Logs</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-300 text-left">
            <th className="py-2">Time</th>
            <th className="py-2">Operation</th>
            <th className="py-2">OK</th>
            <th className="py-2">Hash</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, i) => (
            <tr key={i} className="border-b border-slate-200">
              <td className="py-2">{e.created_at}</td>
              <td className="py-2">{e.operation}</td>
              <td className="py-2">{e.success ? "Yes" : "No"}</td>
              <td className="py-2 font-mono text-xs truncate max-w-xs">{e.event_hash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
