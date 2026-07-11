import os
from pathlib import Path

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/v1/docs", tags=["docs"])

DOCS: dict[str, dict[str, str]] = {
    "readme": {
        "title": "QuantumOS README",
        "path": "README.md",
        "description": "Project overview, quickstart, skills, providers, API examples",
    },
    "quantum-research": {
        "title": "Quantum Research Notes",
        "path": "docs/QUANTUM_RESEARCH.md",
        "description": "Research-style architecture and quantum execution model",
    },
    "dev-guide": {
        "title": "Developer Guide (Markdown)",
        "path": "docs/DEV_GUIDE.md",
        "description": "Technical developer reference from the repository",
    },
}


def _repo_root() -> Path:
    env = os.getenv("QUANTUMOS_ROOT")
    if env:
        return Path(env).resolve()
    here = Path(__file__).resolve()
    for parent in here.parents:
        if (parent / "README.md").is_file() and (parent / "pyproject.toml").is_file():
            return parent
    return here.parents[4]


@router.get("")
def list_docs():
    return {
        "docs": [
            {"id": doc_id, "title": meta["title"], "description": meta["description"]}
            for doc_id, meta in DOCS.items()
        ]
    }


@router.get("/{doc_id}")
def get_doc(doc_id: str):
    meta = DOCS.get(doc_id)
    if not meta:
        raise HTTPException(404, f"Document not found: {doc_id}")
    file_path = _repo_root() / meta["path"]
    if not file_path.is_file():
        raise HTTPException(404, f"File missing on server: {meta['path']}")
    return {
        "id": doc_id,
        "title": meta["title"],
        "path": meta["path"],
        "content": file_path.read_text(encoding="utf-8"),
    }
