import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://quantumos:quantumos@localhost:5432/quantumos",
    )
    default_tenant_id: str = os.getenv("DEFAULT_TENANT_ID", "tenant_demo")
    api_version: str = "0.1.0"
    quantumos_env: str = os.getenv("QUANTUMOS_ENV", "development")

    class Config:
        env_file = ".env"


settings = Settings()
