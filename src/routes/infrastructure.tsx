import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/ui/badge";
import { UtilBar } from "@/components/ops/util-bar";
import { formatNumber } from "@/lib/utils";
import { useOpsStore } from "@/store/ops-store";
import type { InfraNode } from "@/data/types";

export const Route = createFileRoute("/infrastructure")({ component: InfraPage });

export function InfraPage() {
  const infra = useOpsStore((s) => s.infra);
  const select = useOpsStore((s) => s.select);
  const byId = (id: string) => infra.find((n) => n.id === id)!;
  const gw = byId("gw");
  const gpus = infra.filter((n) => n.kind === "gpu");
  const cpu = byId("cpu-01");
  const db = byId("db");
  const obj = byId("obj");
  const mon = byId("mon");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-medium">Infrastructure</h2>
        <p className="text-sm text-muted">Cloud region us-west-2 · compute, data, and observability plane.</p>
      </div>
      <div className="flex flex-col items-stretch gap-3">
        <CloudCard title="Cloud · us-west-2" subtitle="Production VPC · 3 AZs" />
        <div className="ml-0 h-6 w-px self-center bg-border md:ml-[50%]" />
        <NodeCard node={gw} onOpen={() => select("infra", gw.id)}>
          <p className="text-xs text-muted">{formatNumber(gw.requests, 2)} req / 24h · {gw.connections.toLocaleString()} conns</p>
          <UtilBar label="CPU" value={gw.cpu} />
        </NodeCard>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-3">
            <p className="text-xs tracking-wide text-muted uppercase">Compute</p>
            {gpus.map((n) => (
              <NodeCard key={n.id} node={n} onOpen={() => select("infra", n.id)}>
                <UtilBar label="GPU" value={n.gpu} />
                <UtilBar label="VRAM" value={n.vram} />
                <p className="font-mono text-xs text-muted">
                  {n.tempC}°C · {formatNumber(n.requests, 2)} req
                </p>
              </NodeCard>
            ))}
            <NodeCard node={cpu} onOpen={() => select("infra", cpu.id)}>
              <UtilBar label="CPU" value={cpu.cpu} />
              <UtilBar label="RAM" value={cpu.ram} />
            </NodeCard>
          </div>
          <div className="space-y-3">
            <p className="text-xs tracking-wide text-muted uppercase">Data</p>
            <NodeCard node={db} onOpen={() => select("infra", db.id)}>
              <p className="text-xs text-muted">{db.connections} connections · {db.queryMs} ms query</p>
              <UtilBar label="Storage" value={(db.storageUsedTb / db.storageCapTb) * 100} />
            </NodeCard>
            <NodeCard node={obj} onOpen={() => select("infra", obj.id)}>
              <p className="text-xs text-muted">
                {obj.storageUsedTb} / {obj.storageCapTb} TB · +{obj.growthPct}%
              </p>
              <UtilBar label="Capacity" value={(obj.storageUsedTb / obj.storageCapTb) * 100} />
            </NodeCard>
          </div>
          <div className="space-y-3">
            <p className="text-xs tracking-wide text-muted uppercase">Observability</p>
            <NodeCard node={mon} onOpen={() => select("infra", mon.id)}>
              <p className="text-xs text-muted">{mon.connections} scrape targets · {mon.storageUsedTb} TB traces</p>
              <UtilBar label="CPU" value={mon.cpu} />
            </NodeCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function CloudCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3 text-center shadow-panel">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted">{subtitle}</p>
    </div>
  );
}

function NodeCard({ node, onOpen, children }: { node: InfraNode; onOpen: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full space-y-2 rounded-lg border border-border bg-surface p-4 text-left shadow-panel hover:border-border-strong"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{node.name}</p>
        <StatusBadge status={node.status} />
      </div>
      {children}
    </button>
  );
}
