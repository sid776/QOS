"""Edge-case analyze tests for newer use cases."""

import pytest

from use_cases.runner import analyze_use_case

NEW_IDS = [
    "pharma_molecular_binding",
    "energy_grid_quantum_dispatch",
    "finance_quantum_monte_carlo",
    "semiconductor_yield_quantum",
    "ai_llm_quantum_retrieval",
    "genomics_protein_folding",
    "crypto_pqc_wallet_hardening",
    "smart_city_traffic_flow",
    "cloud_api_entropy",
]


@pytest.mark.parametrize("use_case_id", NEW_IDS)
def test_analyze_defaults(use_case_id: str):
    r = analyze_use_case(use_case_id)
    assert r.get("comparison"), f"{use_case_id}: missing comparison"
    assert r["comparison"].get("metrics")
    assert r.get("quantum")
    assert r.get("classical")
    assert r.get("status") in ("COMPLETED", "PARTIAL"), r.get("pipeline_error")


@pytest.mark.parametrize("use_case_id", NEW_IDS)
def test_analyze_empty_input(use_case_id: str):
    r = analyze_use_case(use_case_id, {})
    assert r.get("comparison")


def test_crypto_wallet_custom_input():
    r = analyze_use_case(
        "crypto_pqc_wallet_hardening",
        {
            "wallet_address": "0xabc",
            "chain": "Ethereum",
            "holdings_usd": 1_000_000,
        },
    )
    assert r["quantum"]["output"].get("account_encryption")
    assert r["status"] == "COMPLETED"
