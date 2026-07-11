import logging
import os
import time

from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from db.models import Base
from db.session import engine

logger = logging.getLogger("quantumos.db")

_db_ready = False
_db_error: str | None = None


def is_db_ready() -> bool:
    return _db_ready


def db_status() -> dict:
    return {"ready": _db_ready, "error": _db_error}


def _normalize_database_url() -> str | None:
    url = os.getenv("DATABASE_URL", "").strip()
    if not url:
        return None
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url


def init_database(max_wait_seconds: int = 120, retry_interval: float = 2.0) -> bool:
    """Create tables once Postgres is reachable. Retries for Railway cold starts."""
    global _db_ready, _db_error

    url = _normalize_database_url()
    if not url:
        _db_error = (
            "DATABASE_URL is not set and embedded PostgreSQL did not start. "
            "Check container logs, or set DATABASE_URL / deploy docker-compose.railway.yml."
        )
        logger.error(_db_error)
        return False

    deadline = time.monotonic() + max_wait_seconds
    attempt = 0
    last_err: Exception | None = None

    while time.monotonic() < deadline:
        attempt += 1
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            Base.metadata.create_all(bind=engine)
            _db_ready = True
            _db_error = None
            logger.info("Database ready (attempt %s)", attempt)
            return True
        except OperationalError as exc:
            last_err = exc
            _db_error = str(exc)
            logger.warning("Database not ready (attempt %s): %s", attempt, exc)
            time.sleep(retry_interval)

    _db_ready = False
    _db_error = str(last_err) if last_err else "Database connection timed out"
    logger.error("Database init failed after %s attempts: %s", attempt, _db_error)
    return False
