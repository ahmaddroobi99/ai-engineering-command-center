# AI Engineering Command Center

Internal-style observability console for an AI platform: services, models, GPUs, cloud cost, and incidents. Version 1 runs entirely in the browser on generated telemetry — no database, no API keys, no backend.

**Product:** AI infrastructure, model performance and service reliability.

## Architecture (this version)

```
Browser
  └── React UI (TanStack Router)
        ├── Zustand ops store (live simulation)
        ├── Mock catalogs (services, models, infra, incidents)
        └── Recharts time series
```

There is no network hop for metrics. A 2.5s interval walks GPU, latency, and request counters around realistic envelopes so the console feels live without random noise.

## Technology

- React 19 + TypeScript
- TanStack Start / Router
- Tailwind CSS v4
- Zustand
- Recharts
- Lucide icons
- cmdk command palette

## How to run locally

```bash
npm install
npm run dev
```

Open the preview. `npm run build` produces the production bundle. `npm run typecheck` validates TypeScript.

## Mock data

| Module | Role |
| --- | --- |
| `src/data/mock-services.ts` | 12 microservices with SLO-style uptime |
| `src/data/mock-models.ts` | YOLO, VLM, embeddings, speech, forecast |
| `src/data/mock-infrastructure.ts` | Gateway, GPU/CPU nodes, DB, object storage, monitoring |
| `src/data/mock-incidents.ts` | P1–P4 incidents with timelines |
| `src/data/mock-activity.ts` | Seed + generated event stream |
| `src/data/series.ts` | Seeded 7-day request/latency series |
| `src/store/ops-store.ts` | Live walks and selections |

Relationships are intentional: Vision Service is degraded while INC-1041 is investigating; GPU Node 02 runs hotter than Node 01 after INC-1042.

## Replacing mocks with real APIs

| Surface | Production source |
| --- | --- |
| KPI / time series | Prometheus / Grafana, CloudWatch, Datadog |
| Service health | SLO burn from OpenTelemetry traces + RED metrics |
| Models | Model registry + inference sidecars (vLLM, TensorRT) |
| GPU | DCGM exporter, NVIDIA GPU Operator |
| Incidents | PagerDuty / Opsgenie + Blameless |
| Activity | Audit log + CI/CD webhooks |
| Live updates | WebSockets or SSE from an events service |

Keep the same TypeScript types in `src/data/types.ts` and swap the Zustand `step()` for a query + subscription.

## Authentication (not in v1)

Add SSO (OIDC) at the gateway. Roles: viewer, on-call, admin. Scope incidents and cost by team. Never send a client-chosen user id; verify the session on every API.

## Deploy — Vercel (current)

This app is built with the Vercel Nitro preset. Push the repo and import in Vercel, or use the App Builder publish flow. No environment variables are required for v1.

## Deploy — Netlify

`netlify.toml` is included. For a true static export you would add a client-only Vite build; the current server bundle is aimed at Vercel. SPA fallback is already declared.

## Deploy — GitHub Pages

GitHub Pages is static hosting. To put this console on `https://ahmaddroobi99.github.io/`:

1. Produce a client-only build (`vite build` with `base: '/'` and no SSR).
2. Publish `dist/` to the `github-pages` environment.
3. Keep client-side routing (all views already are). Hash history is the most robust option on project Pages.

Until that static target exists, use Vercel or the in-product preview.

A sample workflow (adapt if you add a static preset):

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
```

## Production architecture

```
User
  └── Frontend (this console)
        └── API Gateway
              ├── Microservices (auth, vision, LLM, vector, pipeline)
              ├── AI inference (GPU nodes)
              ├── Database / object storage
              └── Observability (OTel → Prometheus → this UI)
```

The dashboard would consume REST for catalogs, WebSockets for the activity tail, Prometheus for gauges/histograms, and OpenTelemetry traces for incident drill-down.

## Keyboard

- `⌘K` / `Ctrl+K` — command palette
- `Esc` — close drawers
- Theme toggle in the header
