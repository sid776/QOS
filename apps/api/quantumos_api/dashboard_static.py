"""Serve the built React dashboard from the same origin as the API (Railway production)."""

from __future__ import annotations

import logging
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

logger = logging.getLogger("quantumos.dashboard")

RESERVED_PREFIXES = ("v1/", "health", "swagger", "redoc", "openapi.json", "api-docs")


def _static_root() -> Path | None:
    env = os.getenv("DASHBOARD_STATIC_DIR")
    candidates = [
        Path(env) if env else None,
        Path("/app/static/dashboard"),
        Path(__file__).resolve().parents[3] / "static" / "dashboard",
    ]
    for path in candidates:
        if path and (path / "index.html").is_file():
            return path
    return None


def mount_dashboard(app: FastAPI) -> None:
    root = _static_root()
    if root is None:
        logger.warning("Dashboard static files not found — serving API only")
        return

    logger.info("Serving QuantumOS dashboard from %s", root)
    assets = root / "assets"
    if assets.is_dir():
        app.mount("/assets", StaticFiles(directory=assets), name="dashboard-assets")

    index = root / "index.html"

    @app.get("/", include_in_schema=False)
    async def dashboard_home():
        return FileResponse(index)

    @app.get("/{spa_path:path}", include_in_schema=False)
    async def dashboard_spa(spa_path: str):
        if spa_path in {"health", "swagger", "redoc", "openapi.json"}:
            raise HTTPException(status_code=404, detail="Not Found")
        if any(spa_path.startswith(prefix) for prefix in RESERVED_PREFIXES):
            raise HTTPException(status_code=404, detail="Not Found")
        file_path = root / spa_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(index)
