import re
from typing import Any

from agents.base import AgentResult, BaseAgent

WEAK_PATTERNS = [
    (r"RSA", "Consider ML-KEM or Kyber for key exchange", "high", "CWE-327"),
    (r"ECC|ECDSA|secp256", "Consider ML-DSA or Dilithium for signatures", "high", "CWE-327"),
    (r"SHA-1", "Upgrade to SHA-256 or SHA-3", "medium", "CWE-328"),
    (r"MD5", "Replace with SHA-256 or BLAKE2", "high", "CWE-328"),
    (r"DES|3DES", "Use AES-256-GCM", "high", "CWE-326"),
    (r"PBKDF1", "Use Argon2id or PBKDF2 with high iteration count", "medium", "CWE-916"),
]


class CryptoMigrationAgent(BaseAgent):
    name = "CryptoMigrationAgent"

    def run(self, task: dict[str, Any]) -> AgentResult:
        snippet = task.get("code", task.get("snippet", ""))
        findings: list[dict[str, Any]] = []
        seen: set[tuple[int, str]] = set()

        for line_no, line in enumerate(snippet.splitlines(), 1):
            for pattern, suggestion, severity, cwe in WEAK_PATTERNS:
                if re.search(pattern, line, re.IGNORECASE):
                    key = (line_no, pattern)
                    if key in seen:
                        continue
                    seen.add(key)
                    findings.append(
                        {
                            "pattern": pattern,
                            "suggestion": suggestion,
                            "line": line_no,
                            "severity": severity,
                            "cwe": cwe,
                            "snippet": line.strip()[:200],
                        }
                    )

        risk = "low"
        if any(f["severity"] == "high" for f in findings):
            risk = "high"
        elif findings:
            risk = "medium"

        return AgentResult(
            self.name,
            {
                "findings": findings,
                "finding_count": len(findings),
                "lines_scanned": len(snippet.splitlines()) if snippet else 0,
                "risk_level": risk,
                "recommendation": (
                    "Migrate to NIST PQC algorithms (ML-KEM, ML-DSA) when liboqs is configured"
                    if findings
                    else "No legacy crypto patterns detected in snippet"
                ),
            },
        )
