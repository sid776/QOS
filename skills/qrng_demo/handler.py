import math
import secrets
from typing import Any


def _byte_entropy(data: bytes) -> float:
    if not data:
        return 0.0
    freq: dict[int, int] = {}
    for b in data:
        freq[b] = freq.get(b, 0) + 1
    n = len(data)
    return round(
        -sum((c / n) * math.log2(c / n) for c in freq.values()),
        4,
    )


def run(input_data: dict[str, Any]) -> dict[str, Any]:
    nbytes = max(1, min(256, int(input_data.get("bytes", 16))))
    raw = secrets.token_bytes(nbytes)
    random_hex = raw.hex()
    bits = nbytes * 8
    per_byte_entropy = [_byte_entropy(bytes([b])) for b in raw[:16]]
    avg_entropy = round(sum(per_byte_entropy) / len(per_byte_entropy), 4) if per_byte_entropy else 0
    return {
        "skill": "qrng_demo",
        "random_hex": random_hex,
        "random_binary_preview": "".join(f"{b:08b}" for b in raw[:8]),
        "bytes": nbytes,
        "bits": bits,
        "entropy_bits_per_byte": avg_entropy,
        "max_entropy": 8.0,
        "source": "os_csprng",
        "byte_samples": [{"index": i, "hex": f"{b:02x}", "decimal": b} for i, b in enumerate(raw[:8])],
        "note": "Demo uses OS CSPRNG; connect real QRNG hardware for production",
    }
