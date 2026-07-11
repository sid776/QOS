# QuantumOS — API + React dashboard (single Railway service)
FROM node:20-alpine AS dashboard
WORKDIR /dashboard
COPY apps/dashboard/package.json apps/dashboard/package-lock.json ./
RUN npm ci
COPY apps/dashboard .
# Same-origin API calls in production (FastAPI serves UI + /v1/*)
ENV VITE_API_URL=
RUN npm run build

FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev postgresql postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml README.md ./
COPY core ./core
COPY providers ./providers
COPY agents ./agents
COPY db ./db
COPY security ./security
COPY skills ./skills
COPY use_cases ./use_cases
COPY apps ./apps

RUN pip install --no-cache-dir -e ".[quantum]"

COPY --from=dashboard /dashboard/dist ./static/dashboard

COPY scripts/docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh \
    && mkdir -p /data/postgres \
    && chown -R postgres:postgres /data/postgres

ENV PYTHONPATH=/app
ENV PGDATA=/data/postgres
ENV DASHBOARD_STATIC_DIR=/app/static/dashboard
VOLUME ["/data/postgres"]
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=5 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:' + __import__('os').environ.get('PORT','8000') + '/health')" || exit 1

ENTRYPOINT ["/entrypoint.sh"]
