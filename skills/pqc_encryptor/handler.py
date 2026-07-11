from typing import Any

from security.crypto.nist_account_vault import NISTAccountVault, encrypt_account_record


def run(input_data: dict[str, Any]) -> dict[str, Any]:
    label = str(input_data.get("label", "demo"))
    message = input_data.get("message")
    use_nist = (
        "account" in label.lower()
        or input_data.get("account_email")
        or input_data.get("tenant_id")
        or input_data.get("use_nist_pqc", False)
    )

    if use_nist:
        payload = {**input_data}
        if message and "account_email" not in payload:
            payload.setdefault("purpose", label)
        return encrypt_account_record(payload)

    # Legacy mock path for generic demo payloads
    from security.crypto.pqc_service import PQCService

    if message is not None:
        payload = {"message": str(message), "label": label}
    else:
        payload = input_data.get("payload", {"message": "demo", "label": label})

    svc = PQCService()
    encrypted = svc.encrypt(payload)
    ciphertext = encrypted.get("ciphertext", "") if isinstance(encrypted, dict) else str(encrypted)

    return {
        "skill": "pqc_encryptor",
        "encrypted": encrypted,
        "algorithm": encrypted.get("algorithm", "mock_fernet") if isinstance(encrypted, dict) else "mock_fernet",
        "plaintext_preview": str(payload.get("message", ""))[:120],
        "ciphertext_preview": str(ciphertext)[:80] + ("…" if len(str(ciphertext)) > 80 else ""),
        "payload_label": label,
        "production_warning": "Mock PQC only — use account_vault_encrypt for NIST ML-KEM/ML-DSA",
    }

