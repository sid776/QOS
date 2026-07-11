from typing import Any

from security.crypto.nist_account_vault import encrypt_account_record


def run(input_data: dict[str, Any]) -> dict[str, Any]:
    return encrypt_account_record(input_data)
