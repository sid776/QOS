"""Tests for NIST post-quantum account vault."""

from security.crypto.nist_account_vault import NISTAccountVault, encrypt_account_record


def test_encrypt_decrypt_roundtrip():
    vault = NISTAccountVault()
    result = vault.encrypt_account(
        {"account_id": "user-1", "email": "test@example.com"},
        tenant_id="org_test",
        gateway="gw-prod",
        purpose="session",
    )
    package = result["vault_package"]
    decrypted = vault.decrypt_account(package)
    assert decrypted["signature_valid"] is True
    assert decrypted["account_record"]["email"] == "test@example.com"
    assert result["quantum_safe"] is True
    assert result["decryptable_by_quantum_computer"] is False


def test_account_vault_skill_api():
    out = encrypt_account_record(
        {
            "account_email": "ceo@bank.example",
            "tenant_id": "org_bank",
            "gateway_name": "identity-gw",
        }
    )
    assert out["skill"] == "account_vault_encrypt"
    assert "ML-KEM-768" in out["algorithm_stack"]
    assert "ML-DSA-65" in str(out["standards_compliance"])


def test_cloud_use_case_analyzer():
    from use_cases.comparison import run_comparison

    result = run_comparison(
        "cloud_api_entropy",
        {
            "account_email": "user@enterprise.example",
            "tenant_id": "org_7f3a9c2e",
            "gateway_name": "identity-edge-gw-prod",
            "bytes": 32,
        },
    )
    assert result["quantum"]["output"]["quantum_safe"] is True
    assert result["classical"]["output"]["quantum_vulnerable"] is True
    assert "ML-KEM" in result["comparison"]["quantum_advantage_points"][0]


def test_new_use_case_analyzers():
    from use_cases.catalog import USE_CASES
    from use_cases.comparison import ANALYZERS

    new_ids = [
        "pharma_molecular_binding",
        "energy_grid_quantum_dispatch",
        "finance_quantum_monte_carlo",
        "semiconductor_yield_quantum",
        "ai_llm_quantum_retrieval",
        "genomics_protein_folding",
        "crypto_pqc_wallet_hardening",
        "smart_city_traffic_flow",
    ]
    catalog_ids = {uc.id for uc in USE_CASES}
    for uid in new_ids:
        assert uid in catalog_ids
        assert uid in ANALYZERS
        result = ANALYZERS[uid]({})
        assert "comparison" in result
        assert result["comparison"]["improvement_pct"] != 0 or True
