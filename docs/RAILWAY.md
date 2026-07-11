# Deploy QuantumOS on Railway

## Two deployment options

| Mode | Postgres | DATABASE_URL | Best for |
|------|----------|--------------|----------|
| **A — Single QOS service** (default Dockerfile) | Embedded in container | Auto-set by entrypoint | Fastest fix, one Railway service |
| **B — Docker Compose** (recommended prod) | Dedicated `postgres` service | Set in compose file | Persistent DB, separate scaling |

---

## Option A — Single QOS service (works immediately)

The root `Dockerfile` includes PostgreSQL. If `DATABASE_URL` is **not** set, the entrypoint **starts embedded Postgres** and exports:

```
postgresql://quantumos:quantumos@127.0.0.1:5432/quantumos
```

### Railway steps

1. Deploy from GitHub repo `sid776/QOS` (Dockerfile at root).
2. **Do not** set `DATABASE_URL` unless you have an external Postgres.
3. **Optional but recommended:** attach a Railway **Volume** mounted at `/data/postgres` so data survives redeploys.
4. Redeploy → check logs for `Embedded PostgreSQL ready`.
5. Verify: `GET /health` → `"database": "connected"`.

> Remove any broken `${{Postgres.DATABASE_URL}}` variable reference from the QOS service — it fails when no Postgres plugin exists.

---

## Option B — Docker Compose (dedicated Postgres)

File: [`docker-compose.railway.yml`](./docker-compose.railway.yml)

Creates two services with `DATABASE_URL` wired internally — **no reference variables**.

### Railway steps

1. Project → **Settings** → **Deploy** → enable **Docker Compose**
2. Compose file: `docker-compose.railway.yml`
3. Redeploy — Railway creates **postgres** + **qos** services
4. Generate a public domain on the **qos** service
5. Verify: `GET /health` on qos domain

---

## Dashboard (optional third service)

1. **+ New** → same GitHub repo
2. Dockerfile path: `Dockerfile.dashboard`
3. Variable: `VITE_API_URL=https://YOUR-QOS-DOMAIN.railway.app`
4. Generate domain → redeploy dashboard

---

## Verify

```bash
curl https://YOUR-QOS-DOMAIN.railway.app/health
```

Expected:

```json
{
  "status": "ok",
  "database": "connected",
  "use_case_count": 16
}
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Entrypoint exits immediately | Pull latest `main` — old entrypoint required DATABASE_URL |
| `${{Postgres.DATABASE_URL}}` unresolved | Delete that variable OR add Postgres plugin OR use Option A/B above |
| `"database": "pending"` | Wait 60s for Postgres init; check deploy logs |
| Data lost on redeploy (Option A) | Mount Railway volume at `/data/postgres` |

## Local development

```bash
cp .env.example .env
docker compose up --build
```

Uses `docker-compose.yml` with separate postgres + api + dashboard.
