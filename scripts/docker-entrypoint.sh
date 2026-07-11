#!/bin/sh
set -e

PORT="${PORT:-8000}"

if [ -n "$RAILWAY_ENVIRONMENT" ] || [ -n "$RAILWAY_SERVICE_NAME" ]; then
  if [ -z "$DATABASE_URL" ]; then
    echo "============================================================"
    echo "ERROR: DATABASE_URL is not set on this Railway service."
    echo ""
    echo "Fix in Railway dashboard:"
    echo "  1. Project -> + New -> Database -> PostgreSQL"
    echo "  2. Open the QOS (API) service -> Variables"
    echo "  3. + New Variable -> Add Reference -> Postgres -> DATABASE_URL"
    echo "  4. Redeploy this service"
    echo "============================================================"
    exit 1
  fi
  echo "Railway deploy: DATABASE_URL is set, waiting for Postgres..."
fi

exec uvicorn apps.api.quantumos_api.main:app --host 0.0.0.0 --port "$PORT"
