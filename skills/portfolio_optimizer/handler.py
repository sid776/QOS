import hashlib
from typing import Any


def _synthetic_metrics(assets: list[str]) -> tuple[dict[str, float], dict[str, float]]:
    returns: dict[str, float] = {}
    volatility: dict[str, float] = {}
    for a in assets:
        h = int(hashlib.md5(a.encode()).hexdigest()[:8], 16)
        returns[a] = round(0.04 + (h % 120) / 1000, 4)
        volatility[a] = round(0.12 + (h % 80) / 500, 4)
    return returns, volatility


def _weights_for_risk(assets: list[str], risk: str) -> dict[str, float]:
    n = len(assets) or 1
    if risk == "low":
        w = [1 / n] * n
    elif risk == "high":
        base = [0.5] + [0.5 / (n - 1)] * (n - 1) if n > 1 else [1.0]
        w = base[:n]
        total = sum(w)
        w = [x / total for x in w]
    else:
        _, vol = _synthetic_metrics(assets)
        inv = [1 / vol[a] for a in assets]
        total = sum(inv)
        w = [v / total for v in inv]
    return {a: round(weights, 4) for a, weights in zip(assets, w)}


def run(input_data: dict[str, Any]) -> dict[str, Any]:
    assets = input_data.get("assets", ["AAPL", "MSFT", "NVDA"])
    if isinstance(assets, str):
        assets = [a.strip() for a in assets.split(",") if a.strip()]
    if not assets:
        assets = ["AAPL", "MSFT"]
    budget = float(input_data.get("budget", 100000))
    risk = str(input_data.get("risk", "medium")).lower()
    if risk not in ("low", "medium", "high"):
        risk = "medium"

    returns, volatility = _synthetic_metrics(assets)
    weights = _weights_for_risk(assets, risk)
    allocation = {a: round(weights[a] * budget, 2) for a in assets}
    port_return = round(sum(weights[a] * returns[a] for a in assets), 4)
    port_vol = round(sum(weights[a] * volatility[a] for a in assets), 4)

    chart = [{"asset": a, "weight_pct": round(weights[a] * 100, 2), "usd": allocation[a]} for a in assets]

    return {
        "skill": "portfolio_optimizer",
        "weights": weights,
        "allocation": allocation,
        "budget": budget,
        "risk": risk,
        "method": "risk_adjusted_heuristic",
        "expected_annual_return": port_return,
        "portfolio_volatility": port_vol,
        "asset_metrics": {
            a: {"expected_return": returns[a], "volatility": volatility[a]} for a in assets
        },
        "chart": chart,
    }
