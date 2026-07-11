"""Mock PQC service — NON-PRODUCTION. Uses Fernet (symmetric) for demo encryption only."""

import base64
import hashlib
import json
import os
from typing import Any

from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

NON_PRODUCTION_LABEL = (
    "MOCK_PQC_NON_PRODUCTION — not NIST-certified post-quantum cryptography"
)


class PQCService:
    def __init__(self, master_secret: str | None = None):
        secret = master_secret or os.getenv("QUANTUMOS_CRYPTO_SECRET", "quantumos-dev-secret")
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=b"quantumos-mock-pqc-salt",
            iterations=100_000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(secret.encode()))
        self._fernet = Fernet(key)

    def encrypt(self, payload: dict[str, Any]) -> dict[str, Any]:
        plaintext = json.dumps(payload).encode()
        token = self._fernet.encrypt(plaintext)
        return {
            "ciphertext": base64.b64encode(token).decode(),
            "algorithm": "mock_fernet_demo",
            "warning": NON_PRODUCTION_LABEL,
        }

    def decrypt(self, encrypted: dict[str, Any]) -> dict[str, Any]:
        token = base64.b64decode(encrypted["ciphertext"])
        try:
            plaintext = self._fernet.decrypt(token)
        except InvalidToken:
            raise ValueError("Decryption failed — data may be tampered or wrong key")
        return json.loads(plaintext.decode())

    def sign(self, payload: dict[str, Any]) -> dict[str, Any]:
        canonical = json.dumps(payload, sort_keys=True)
        sig = hashlib.sha256(canonical.encode()).hexdigest()
        return {
            "signature": sig,
            "algorithm": "mock_sha256_demo",
            "warning": NON_PRODUCTION_LABEL,
        }

    def verify(self, payload: dict[str, Any], signature: str) -> bool:
        return self.sign(payload)["signature"] == signature
