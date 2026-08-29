import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/ui/badge";
import { formatMs, formatNumber, formatPct } from "@/lib/utils";
import { useOpsStore } from "@/store/ops-store";

export const Route = createFileRoute("/services")({ component: ServicesPage });

export function ServicesPage() {
  const services = useOpsStore((s) => s.services);
  const select = useOpsStore((s) => s.select);
  const [q, setQ] = useState("");
  const rows = useMemo(
    () => services.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.owner.includes(q.toLowerCase())),
    [services, q],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">Services</h2>
          <p className="text-sm text-muted">Twelve production microservices behind the AI platform.</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter services"
          className="h-10 w-52 rounded-sm border border-border bg-surface px-3 text-sm"
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => select("service", s.id)}
            className="rounded-lg border border-border bg-surface p-4 text-left shadow-panel hover:border-border-strong"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="font-mono text-xs text-muted">
                  {s.version} · {s.owner}
                </p>
              </div>
              <StatusBadge status={s.status} />
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-muted">{s.description}</p>
            <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs tabular">
              <div>
                <dt className="text-subtle">Uptime</dt>
                <dd>{formatPct(s.uptime)}</dd>
              </div>
              <div>
                <dt className="text-subtle">Latency</dt>
                <dd>{formatMs(s.latencyMs)}</dd>
              </div>
              <div>
                <dt className="text-subtle">Errors</dt>
                <dd>{formatPct(s.errorRate)}</dd>
              </div>
            </dl>
            <p className="mt-2 font-mono text-xs text-muted">{formatNumber(s.requests24h, 2)} req · {s.replicas} replicas</p>
          </button>
        ))}
      </div>
    </div>
  );
}
