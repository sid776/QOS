# Deploy QuantumOS on Railway

Repo: [github.com/sid776/QOS](https://github.com/sid776/QOS)

## Why the deploy failed

The API defaults to `localhost:5432` when **`DATABASE_URL` is missing**. On Railway there is no Postgres on localhost — you must add a Railway PostgreSQL database and **reference its `DATABASE_URL`** on the QOS service.

## Fix (existing Railway project) — 2 minutes

### Step 1 — Add PostgreSQL

1. Open your Railway project
2. Click **+ New** → **Database** → **Add PostgreSQL**
3. Wait until Postgres shows **Active**

### Step 2 — Link DATABASE_URL to QOS

1. Click your **QOS** (API) service (not Postgres)
2. Go to **Variables**
3. Click **+ New Variable** → **Add Reference**
4. Select the **Postgres** service → **`DATABASE_URL`**
5. Confirm the variable appears as `DATABASE_URL` (value hidden)

Also add (plain values):

| Variable | Value |
|----------|--------|
| `QUANTUMOS_ENV` | `production` |
| `DEFAULT_TENANT_ID` | `tenant_demo` |

### Step 3 — Redeploy

1. QOS service → **Deployments** → **Redeploy**
2. Check logs — you should see `Database ready`
3. Open `https://YOUR-API-DOMAIN/health` — expect `"database": "connected"`

---

## Fresh deploy (template with Postgres included)

Use the included template so Postgres + `DATABASE_URL` are wired automatically:

1. Railway → **New Project** → **Deploy a template** (or import `railway.template.json`)
2. Or manually create two services from [railway.template.json](./railway.template.json):
   - **Postgres** — database plugin
   - **QOS** — GitHub repo, Dockerfile `Dockerfile`, variable `DATABASE_URL=${{Postgres.DATABASE_URL}}`

---

## Architecture

| Service | Dockerfile | Notes |
|---------|------------|--------|
| **QOS (API)** | `Dockerfile` | Requires `DATABASE_URL` on Railway |
| **Postgres** | Railway plugin | Auto-provisioned |
| **Dashboard** | `Dockerfile.dashboard` | Set `VITE_API_URL` to API public URL |

## Dashboard (optional second service)

1. **+ New** → same GitHub repo
2. Dockerfile path: `Dockerfile.dashboard`
3. Variable: `VITE_API_URL=https://YOUR-API-DOMAIN.railway.app`
4. Generate public domain → redeploy

## Verify

```bash
curl https://YOUR-API-DOMAIN/health
```

Expected:

```json
{
  "status": "ok",
  "database": "connected",
  "use_case_count": 16
}
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Crash: `connection refused localhost:5432` | `DATABASE_URL` not set — follow Step 2 above |
| `"database": "pending"` in /health | Postgres still starting; wait 1–2 min or redeploy |
| Entrypoint error about DATABASE_URL | Add Postgres reference variable, redeploy |
| Use cases work but jobs fail | DB not connected yet — check /health |

## Local Docker (includes Postgres)

```bash
cp .env.example .env
docker compose up --build
```

Uses internal hostname `postgres` — no manual `DATABASE_URL` needed locally.
