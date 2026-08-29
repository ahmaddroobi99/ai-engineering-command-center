import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { KpiCard } from "@/components/ops/kpi-card";
import { MetricChart } from "@/components/ops/metric-chart";
import { UtilBar } from "@/components/ops/util-bar";
import { ActivityFeed } from "@/components/ops/activity-feed";
import { StatusBadge } from "@/components/ui/badge";
import { PriorityBadge, IncidentStatusBadge } from "@/components/ui/badge";
import { MOCK_INCIDENTS } from "@/data/mock-incidents";
import { formatMs, formatNumber, formatPct, formatUsd } from "@/lib/utils";
import { useOpsStore } from "@/store/ops-store";

export const Route = createFileRoute("/")({ component: Overview });

function Overview() {
  const kpis = useOpsStore((s) => s.kpis);
  const services = useOpsStore((s) => s.services);
  const infra = useOpsStore((s) => s.infra);
  const activity = useOpsStore((s) => s.activity);
  const select = useOpsStore((s) => s.select);
  const [range, setRange] = useState(24);

  const cpu = infra.find((n) => n.id === "cpu-01")?.cpu ?? 41;
  const ram = infra.find((n) => n.id === "cpu-01")?.ram ?? 55;
  const storage = infra.find((n) => n.id === "obj");
  const storagePct = storage ? (storage.storageUsedTb / storage.storageCapTb) * 100 : 34;

  const healthServices = services.filter((s) =>
    ["svc-vision", "svc-llm", "svc-vector", "svc-pipe"].includes(s.id),
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <KpiCard label="Services" value={String(kpis.services)} delta={kpis.servicesDelta} />
        <KpiCard label="Requests / 24h" value={formatNumber(kpis.requests24h, 2)} delta={kpis.requestsDelta} />
        <KpiCard label="Average latency" value={formatMs(kpis.latencyMs)} delta={kpis.latencyDelta} invert />
        <KpiCard label="Error rate" value={formatPct(kpis.errorRate)} delta={kpis.errorDelta} invert />
        <KpiCard label="GPU utilization" value={formatPct(kpis.gpuUtil, 1)} delta={kpis.gpuDelta} invert />
        <KpiCard label="Monthly cloud cost" value={formatUsd(kpis.monthlyCost)} delta={kpis.costDelta} invert />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-lg border border-border bg-surface p-4 shadow-panel lg:col-span-2">
          <h2 className="mb-3 text-sm font-medium">Service health</h2>
          <ul className="divide-y divide-border">
            {healthServices.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => select("service", s.id)}
                  className="flex w-full items-center justify-between gap-3 py-2.5 text-left"
                >
                  <span className="text-sm">{s.name}</span>
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs tabular text-muted">{formatPct(s.uptime)}</span>
                    <StatusBadge status={s.status} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-border bg-surface p-4 shadow-panel">
          <h2 className="mb-3 text-sm font-medium">Recent incidents</h2>
          <ul className="space-y-2">
            {MOCK_INCIDENTS.slice(0, 4).map((i) => (
              <li key={i.id}>
                <button
                  type="button"
                  onClick={() => select("incident", i.id)}
                  className="w-full rounded-md border border-border px-3 py-2 text-left hover:bg-elevated"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-muted">{i.id}</span>
                    <span className="flex gap-1.5">
                      <PriorityBadge priority={i.priority} />
                      <IncidentStatusBadge status={i.status} />
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{i.title}</p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <MetricChart range={range} onRange={setRange} />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-surface p-4 shadow-panel">
          <h2 className="mb-4 text-sm font-medium">Infrastructure utilization</h2>
          <div className="space-y-4">
            <UtilBar label="CPU" value={cpu} />
            <UtilBar label="Memory" value={ram} />
            <UtilBar label="GPU" value={kpis.gpuUtil} />
            <UtilBar label="Storage" value={storagePct} />
          </div>
        </section>
        <section className="rounded-lg border border-border bg-surface p-4 shadow-panel">
          <h2 className="mb-3 text-sm font-medium">Live activity</h2>
          <ActivityFeed events={activity.slice(0, 6)} compact />
        </section>
      </div>
    </div>
  );
}
