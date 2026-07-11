from typing import Any

from agents.crypto_migration_agent import CryptoMigrationAgent


def run(input_data: dict[str, Any]) -> dict[str, Any]:
    agent = CryptoMigrationAgent()
    result = agent.run({"code": input_data.get("code", "")})
    return {"skill": "crypto_migration_scan", **result.plan}
