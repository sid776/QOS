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
from db.models import Base
from db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="QuantumOS API",
    version="0.1.0",
    lifespan=lifespan,
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
