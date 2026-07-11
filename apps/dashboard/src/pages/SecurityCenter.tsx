import { useState } from "react";
import { postApi } from "../api";
import ActionButton from "../components/ActionButton";

type Tab = "encrypt" | "decrypt" | "sign" | "verify" | "scan";

export default function SecurityCenter() {
  const [tab, setTab] = useState<Tab>("encrypt");
  const [payload, setPayload] = useState('{"message":"demo secret"}');
  const [encrypted, setEncrypted] = useState("");
  const [signature, setSignature] = useState("");
  const [output, setOutput] = useState("");
  const [scanCode, setScanCode] = useState("RSA_key = generate(2048)\ndigest = MD5(data)");
  const [loading, setLoading] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setLoading(true);
    setOutput("");
    try {
      await fn();
    } catch (e) {
      setOutput(String(e));
    } finally {
      setLoading(false);
    }
  };

  const encrypt = () =>
    run(async () => {
      const r = await postApi<Record<string, string>>("/v1/crypto/encrypt", {
        payload: JSON.parse(payload),
      });
      const text = JSON.stringify(r, null, 2);
      setEncrypted(text);
      setOutput(text);
    });

  const decrypt = () =>
    run(async () => {
      const body = encrypted ? JSON.parse(encrypted) : JSON.parse(payload);
      const r = await postApi<{ payload?: unknown; error?: string }>("/v1/crypto/decrypt", body);
      setOutput(JSON.stringify(r, null, 2));
    });

  const sign = () =>
    run(async () => {
      const r = await postApi<{ signature: string; warning?: string }>("/v1/crypto/sign", {
        payload: JSON.parse(payload),
      });
      setSignature(r.signature);
      setOutput(JSON.stringify(r, null, 2));
    });

  const verify = () =>
    run(async () => {
      const r = await postApi<{ valid: boolean }>("/v1/crypto/verify", {
        payload: JSON.parse(payload),
        signature: signature || prompt("Paste signature hex:") || "",
      });
      setOutput(JSON.stringify(r, null, 2));
    });

  const scan = () =>
    run(async () => {
      const r = await postApi<{ agent: string; plan: unknown }>("/v1/agents/run", {
        agent: "CryptoMigrationAgent",
        task: { snippet: scanCode },
      });
      setOutput(JSON.stringify(r, null, 2));
    });

  const tabs: { id: Tab; label: string }[] = [
    { id: "encrypt", label: "Encrypt" },
    { id: "decrypt", label: "Decrypt" },
    { id: "sign", label: "Sign" },
    { id: "verify", label: "Verify" },
    { id: "scan", label: "Migration scan" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Security Center</h2>
        <p className="text-amber-800 text-sm">
          Mock PQC — NON-PRODUCTION. Demo encryption only; not NIST-certified post-quantum crypto.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded text-sm ${
              tab === t.id ? "bg-quantum-500" : "bg-slate-200 hover:bg-slate-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "scan" ? (
        <>
          <textarea
            className="w-full h-32 bg-slate-50 border border-slate-300 rounded p-2 font-mono text-sm"
            value={scanCode}
            onChange={(e) => setScanCode(e.target.value)}
            placeholder="Paste code to scan for RSA, MD5, ECC…"
          />
          <ActionButton onClick={scan} loading={loading}>
            Scan for weak crypto
          </ActionButton>
        </>
      ) : (
        <>
          <label className="block text-sm text-slate-600">
            {tab === "decrypt" ? "Encrypted JSON (from encrypt step)" : "Payload JSON"}
          </label>
          <textarea
            className="w-full h-28 bg-slate-50 border border-slate-300 rounded p-2 font-mono text-sm mt-1"
            value={tab === "decrypt" ? encrypted || payload : payload}
            onChange={(e) =>
              tab === "decrypt" ? setEncrypted(e.target.value) : setPayload(e.target.value)
            }
          />
          {tab === "verify" && (
            <input
              className="w-full mt-3 bg-slate-50 border border-slate-300 rounded p-2 font-mono text-sm"
              placeholder="Signature (from sign step)"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
            />
          )}
          <div className="flex flex-wrap gap-3 mt-4">
            {tab === "encrypt" && (
              <ActionButton onClick={encrypt} loading={loading}>
                Encrypt
              </ActionButton>
            )}
            {tab === "decrypt" && (
              <ActionButton onClick={decrypt} loading={loading}>
                Decrypt
              </ActionButton>
            )}
            {tab === "sign" && (
              <ActionButton onClick={sign} loading={loading}>
                Sign
              </ActionButton>
            )}
            {tab === "verify" && (
              <ActionButton onClick={verify} loading={loading}>
                Verify
              </ActionButton>
            )}
          </div>
          {tab === "encrypt" && encrypted && (
            <p className="text-sm text-slate-600">
              Tip: switch to <strong>Decrypt</strong> tab — ciphertext is pre-filled.
            </p>
          )}
        </>
      )}

      {output && (
        <pre className="bg-white p-4 rounded text-sm overflow-auto max-h-80">{output}</pre>
      )}
    </div>
  );
}
