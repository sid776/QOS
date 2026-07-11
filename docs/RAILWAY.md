# Deploy QuantumOS on Railway

Repo: [github.com/sid776/QOS](https://github.com/sid776/QOS)

## Architecture

| Service | Dockerfile | Port | Purpose |
|---------|------------|------|---------|
| **API** | `Dockerfile` | `$PORT` (Railway) | FastAPI backend |
| **Dashboard** | `Dockerfile.dashboard` | 80 | React SPA (nginx) |
| **PostgreSQL** | Railway plugin | 5432 | Database |

## Step 1 — Push to GitHub

Already done if you cloned from `sid776/QOS`. Local push:

```bash
git remote add origin https://github.com/sid776/QOS.git
git push -u origin main
```

## Step 2 — Create Railway project

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select **sid776/QOS**
3. Railway creates a service from the root `Dockerfile` (API)

## Step 3 — Add PostgreSQL

1. In the project → **+ New** → **Database** → **PostgreSQL**
2. Open the **API** service → **Variables** → **Add reference** → link `DATABASE_URL` from Postgres

Also set:

| Variable | Value |
|----------|--------|
| `QUANTUMOS_ENV` | `production` |
| `DEFAULT_TENANT_ID` | `tenant_demo` |

Generate a domain for the API: **Settings → Networking → Generate Domain** (e.g. `qos-api-production.up.railway.app`).

## Step 4 — Deploy the dashboard (second service)

1. **+ New** → **GitHub Repo** → same **QOS** repo
2. **Settings → Build → Dockerfile path**: `Dockerfile.dashboard`
3. **Variables** (required at build time):

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://qos-api-production.up.railway.app` |

4. **Settings → Networking → Generate Domain** for the dashboard

> **Important:** `VITE_API_URL` is baked in at build time. After changing it, trigger a **Redeploy**.

## Step 5 — Verify

```bash
curl https://YOUR-API-DOMAIN/health
```

Open the dashboard URL → **Industry Apps** → run any use case.

## Local Docker (same images as Railway)

```bash
cp .env.example .env
docker compose up --build
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| API 502 on startup | Wait for Postgres; check `DATABASE_URL` is linked |
| Dashboard can't reach API | Set `VITE_API_URL` to public API URL and redeploy dashboard |
| Use cases 404 | Ensure API image includes `use_cases/` (root `Dockerfile` does) |
| CORS errors | API allows all origins in MVP; check `VITE_API_URL` matches API domain |
