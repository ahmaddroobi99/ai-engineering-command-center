# AI Engineering Command Center

Observability-style dashboard for AI services, models, and experiments.

This is a **front-end command surface**. Fleet GPU %, cloud cost, and 24-device KPIs in the UI are labeled simulation unless a live collector is wired. Do not read those numbers as production telemetry.

```
Events / logs / experiment records
        ↓
  Normalize into service / model / run
        ↓
  Command center views
        ↓
  Drill into a run
```

## Run

```bash
npm install
npm run dev
```

## Notes

A previous homepage pointed at a Grok sandbox URL that does not survive outside that session. That link has been removed.

## Related

- [meridian](https://github.com/ahmaddroobi99/meridian)
- [ai-perception-lab](https://github.com/ahmaddroobi99/ai-perception-lab)
