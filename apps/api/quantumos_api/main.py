import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apps.api.quantumos_api.routers import (
    health,
    providers,
    jobs,
    agents,
    skills,
    audit,
    policies,
    crypto,
    use_cases,
    docs,
)
from db.bootstrap import init_database
from apps.api.quantumos_api.dashboard_static import mount_dashboard

logger = logging.getLogger("quantumos.api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Do not block HTTP startup — Railway healthcheck hits /health while Postgres spins up.
    import asyncio

    async def _bootstrap_db() -> None:
        ok = await asyncio.to_thread(init_database, 120, 2.0)
        if not ok:
            logger.warning("API running without database — job/audit endpoints may fail until DATABASE_URL is set")

    task = asyncio.create_task(_bootstrap_db())
    yield
    task.cancel()


app = FastAPI(
    title="QuantumOS",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/swagger",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(providers.router)
app.include_router(jobs.router)
app.include_router(agents.router)
app.include_router(skills.router)
app.include_router(audit.router)
app.include_router(policies.router)
app.include_router(crypto.router)
app.include_router(use_cases.router)
app.include_router(docs.router)
mount_dashboard(app)
