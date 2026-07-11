import hashlib
import math
from typing import Any


def _distance(a: str, b: str) -> float:
    if a == b:
        return 0.0
    ha = int(hashlib.sha256(a.encode()).hexdigest()[:8], 16)
    hb = int(hashlib.sha256(b.encode()).hexdigest()[:8], 16)
    return round(5 + abs(ha - hb) % 45 + math.sqrt(abs(ha ^ hb) % 100), 2)


def _distance_matrix(stops: list[str]) -> dict[str, dict[str, float]]:
    return {s: {t: _distance(s, t) for t in stops} for s in stops}


def _nearest_neighbor(stops: list[str], dist: dict[str, dict[str, float]], return_to_start: bool) -> list[str]:
    if len(stops) <= 1:
        return stops[:]
    unvisited = set(stops[1:])
    route = [stops[0]]
    current = stops[0]
    while unvisited:
        nxt = min(unvisited, key=lambda s: dist[current][s])
        route.append(nxt)
        unvisited.remove(nxt)
        current = nxt
    if return_to_start and route[0] != route[-1]:
        route.append(route[0])
    return route


def run(input_data: dict[str, Any]) -> dict[str, Any]:
    stops = input_data.get("stops", ["Warehouse", "Store A", "Store B"])
    if isinstance(stops, str):
        stops = [s.strip() for s in stops.split(",") if s.strip()]
    if len(stops) < 2:
        stops = ["Depot", "Stop A", "Stop B"]
    return_to_start = bool(input_data.get("return_to_start", True))

    dist = _distance_matrix(stops)
    ordered = _nearest_neighbor(stops, dist, return_to_start)

    legs: list[dict[str, Any]] = []
    total = 0.0
    for i in range(len(ordered) - 1):
        d = dist[ordered[i]][ordered[i + 1]]
        total += d
        legs.append({"from": ordered[i], "to": ordered[i + 1], "distance_km": d})

    return {
        "skill": "route_optimizer",
        "input_stops": stops,
        "ordered_stops": ordered,
        "legs": legs,
        "total_distance_km": round(total, 2),
        "method": "nearest_neighbor",
        "return_to_start": return_to_start,
        "stop_count": len(stops),
    }
