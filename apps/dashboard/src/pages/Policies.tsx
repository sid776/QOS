import { useEffect, useState } from "react";
import { fetchApi } from "../api";

export default function Policies() {
  const [yaml, setYaml] = useState("");

  useEffect(() => {
    fetchApi<{ policies: { policy_yaml: string }[] }>("/v1/policies").then((d) => {
      if (d.policies[0]) setYaml(d.policies[0].policy_yaml);
    });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Policies</h2>
      <pre className="bg-white p-4 rounded text-sm overflow-auto whitespace-pre-wrap">
        {yaml || "Loading..."}
      </pre>
    </div>
  );
}
