#!/bin/sh
set -e

PORT="${PORT:-8000}"
PGDATA="${PGDATA:-/data/postgres}"
export PATH="/usr/lib/postgresql/15/bin:$PATH"

start_embedded_postgres() {
  echo "============================================================"
  echo "QuantumOS: DATABASE_URL not set — starting embedded PostgreSQL"
  echo "For production, prefer docker-compose.railway.yml (Postgres + QOS)"
  echo "or link Railway Postgres: Variables -> DATABASE_URL reference"
  echo "============================================================"

  mkdir -p "$PGDATA"
  chown -R postgres:postgres "$PGDATA"

  if [ ! -f "$PGDATA/PG_VERSION" ]; then
    su postgres -s /bin/sh -c "initdb -D '$PGDATA' --auth-host=trust --auth-local=trust"
  fi

  if ! su postgres -s /bin/sh -c "pg_ctl -D '$PGDATA' status" >/dev/null 2>&1; then
    su postgres -s /bin/sh -c "pg_ctl -D '$PGDATA' -l /tmp/postgresql.log -w start"
  fi

  su postgres -s /bin/sh -c "psql -v ON_ERROR_STOP=0 --dbname postgres -c \"CREATE USER quantumos WITH PASSWORD 'quantumos';\"" 2>/dev/null || true
  su postgres -s /bin/sh -c "psql -v ON_ERROR_STOP=0 --dbname postgres -c \"CREATE DATABASE quantumos OWNER quantumos;\"" 2>/dev/null || true
  su postgres -s /bin/sh -c "psql -v ON_ERROR_STOP=0 --dbname postgres -c \"GRANT ALL PRIVILEGES ON DATABASE quantumos TO quantumos;\"" 2>/dev/null || true

  export DATABASE_URL="postgresql://quantumos:quantumos@127.0.0.1:5432/quantumos"
  echo "[quantumos] Embedded PostgreSQL ready"
}

if [ -z "$DATABASE_URL" ]; then
  start_embedded_postgres
else
  echo "[quantumos] Using DATABASE_URL from environment"
fi

exec uvicorn apps.api.quantumos_api.main:app --host 0.0.0.0 --port "$PORT"
