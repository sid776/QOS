import random
from typing import Any


def _bob_measurement(alice_bit: int, alice_basis: str, bob_basis: str) -> int:
    if alice_basis == bob_basis:
        return alice_bit
    return random.randint(0, 1)


def run(input_data: dict[str, Any]) -> dict[str, Any]:
    n = max(16, min(4096, int(input_data.get("bits", 64))))
    sample_check = max(4, min(32, int(input_data.get("sample_check", 8))))

    alice_bits = [random.randint(0, 1) for _ in range(n)]
    alice_bases = [random.choice(["Z", "X"]) for _ in range(n)]
    bob_bases = [random.choice(["Z", "X"]) for _ in range(n)]
    bob_bits = [
        _bob_measurement(a, ab, bb)
        for a, ab, bb in zip(alice_bits, alice_bases, bob_bases)
    ]

    matching = [i for i in range(n) if alice_bases[i] == bob_bases[i]]
    sifted_indices = matching
    sifted_key = [alice_bits[i] for i in sifted_indices]

    check_indices = matching[:sample_check]
    errors = sum(1 for i in check_indices if alice_bits[i] != bob_bits[i])
    qber = round(errors / len(check_indices), 4) if check_indices else 0.0

    timeline = []
    preview = min(n, 24)
    for i in range(preview):
        timeline.append(
            {
                "index": i,
                "alice_bit": alice_bits[i],
                "alice_basis": alice_bases[i],
                "bob_basis": bob_bases[i],
                "bases_match": alice_bases[i] == bob_bases[i],
                "bob_bit": bob_bits[i],
                "in_sifted_key": i in sifted_indices,
            }
        )

    return {
        "skill": "bb84_simulator",
        "protocol": "BB84",
        "raw_bits": n,
        "matching_bases": len(matching),
        "sifted_key_length": len(sifted_key),
        "sifted_key_preview": "".join(str(b) for b in sifted_key[:32]),
        "qber_sample_size": len(check_indices),
        "qber": qber,
        "timeline": timeline,
        "steps": [
            "Alice generates random bits and random Z/X bases",
            "Alice encodes bits on quantum channel (simulated)",
            "Bob chooses random measurement bases",
            "Bob measures and obtains classical bits",
            "Alice and Bob compare bases over public channel",
            "Keep bits where bases matched → sifted key",
            f"Estimate QBER on {len(check_indices)} revealed bits",
        ],
        "note": "Educational simulation only — not real QKD hardware",
    }
