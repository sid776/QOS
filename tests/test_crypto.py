import pytest

from security.crypto.pqc_service import PQCService


def test_crypto_encrypt_decrypt():
    svc = PQCService(master_secret="test-key-12345")
    payload = {"message": "quantum-safe demo"}
    enc = svc.encrypt(payload)
    assert "warning" in enc
    dec = svc.decrypt(enc)
    assert dec == payload


def test_tampered_decrypt_failure():
    svc = PQCService(master_secret="test-key-12345")
    enc = svc.encrypt({"x": 1})
    enc["ciphertext"] = enc["ciphertext"][:-4] + "XXXX"
    with pytest.raises(ValueError, match="tampered|failed|Decryption"):
        svc.decrypt(enc)
