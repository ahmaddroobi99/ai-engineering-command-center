import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IncidentStatusBadge, PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { UtilBar } from "@/components/ops/util-bar";
import { MOCK_INCIDENTS } from "@/data/mock-incidents";
import { formatMs, formatNumber, formatPct } from "@/lib/utils";
import { useOpsStore } from "@/store/ops-store";

export function DetailDrawer() {
  const selectedId = useOpsStore((s) => s.selectedId);
  const kind = useOpsStore((s) => s.selectedKind);
  const select = useOpsStore((s) => s.select);
  const services = useOpsStore((s) => s.services);
  const models = useOpsStore((s) => s.models);
  const infra = useOpsStore((s) => s.infra);

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") select(null, null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, select]);

  if (!selectedId || !kind) return null;

  const service = services.find((s) => s.id === selectedId);
  const model = models.find((m) => m.id === selectedId);
  const node = infra.find((n) => n.id === selectedId);
  const incident = MOCK_INCIDENTS.find((i) => i.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close drawer" className="absolute inset-0 bg-bg/60" onClick={() => select(null, null)} />
      <aside
        role="dialog"
        aria-modal="true"
        className="relative h-full w-full max-w-lg overflow-auto border-l border-border bg-surface p-5 shadow-panel"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-wide text-muted uppercase">
              {kind === "service" ? "Service" : kind === "model" ? "Model" : kind === "infra" ? "Node" : "Incident"}
            </p>
            <h2 className="mt-1 text-lg font-medium">
              {service?.name || model?.name || node?.name || incident?.id}
            </h2>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={() => select(null, null)} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>

        {service && (
          <div className="space-y-4">
            <StatusBadge status={service.status} />
            <p className="text-sm text-muted">{service.description}</p>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Item k="Version" v={service.version} />
              <Item k="Owner" v={service.owner} />
              <Item k="Region" v={service.region} />
              <Item k="Uptime" v={formatPct(service.uptime)} />
              <Item k="Requests / 24h" v={formatNumber(service.requests24h, 2)} />
              <Item k="Latency" v={formatMs(service.latencyMs)} />
              <Item k="Error rate" v={formatPct(service.errorRate)} />
              <Item k="Replicas" v={`${service.replicas} / ${service.targetReplicas}`} />
            </dl>
          </div>
        )}

        {model && (
          <div className="space-y-4">
            <StatusBadge status={model.status} />
            <p className="text-sm text-muted">
              {model.framework} · {model.endpoint}
            </p>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Item k="Version" v={model.version} />
              <Item k="Type" v={model.type} />
              <Item k="Latency" v={formatMs(model.latencyMs)} />
              <Item k="Throughput" v={`${model.throughput}/s`} />
              <Item k="Requests / 24h" v={formatNumber(model.requests24h, 2)} />
              <Item k="Error rate" v={formatPct(model.errorRate)} />
              <Item k="Accuracy" v={formatPct(model.accuracy, 1)} />
              <Item k="Deployed" v={new Date(model.deployedAt).toLocaleDateString()} />
            </dl>
            <UtilBar label="GPU" value={model.gpuUtil} />
          </div>
        )}

        {node && (
          <div className="space-y-4">
            <StatusBadge status={node.status} />
            <p className="text-sm text-muted">{node.region}</p>
            {node.kind === "gpu" && (
              <>
                <UtilBar label="GPU" value={node.gpu} />
                <UtilBar label="VRAM" value={node.vram} />
                <Item k="Temperature" v={`${node.tempC}°C`} />
              </>
            )}
            {(node.kind === "cpu" || node.kind === "gateway") && (
              <>
                <UtilBar label="CPU" value={node.cpu} />
                <UtilBar label="Memory" value={node.ram} />
              </>
            )}
            {node.kind === "database" && (
              <>
                <Item k="Connections" v={String(node.connections)} />
                <Item k="Query latency" v={`${node.queryMs} ms`} />
                <UtilBar label="Storage" value={(node.storageUsedTb / node.storageCapTb) * 100} />
              </>
            )}
            {node.kind === "storage" && (
              <>
                <Item k="Used" v={`${node.storageUsedTb} TB / ${node.storageCapTb} TB`} />
                <Item k="Growth" v={`+${node.growthPct}% WoW`} />
                <Item k="Requests" v={formatNumber(node.requests, 2)} />
              </>
            )}
          </div>
        )}

        {incident && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <PriorityBadge priority={incident.priority} />
              <IncidentStatusBadge status={incident.status} />
            </div>
            <h3 className="text-base font-medium">{incident.title}</h3>
            <p className="text-sm text-muted">{incident.summary}</p>
            <Item k="Commander" v={incident.commander} />
            <Item k="Impact" v={incident.impact} />
            <div>
              <p className="mb-2 text-xs tracking-wide text-muted uppercase">Affected</p>
              <div className="flex flex-wrap gap-1.5">
                {incident.affected.map((a) => (
                  <span key={a} className="rounded-sm border border-border px-2 py-0.5 text-xs">
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <ol className="relative ml-2 border-l border-border pl-4">
              {incident.timeline.map((ev) => (
                <li key={ev.at + ev.label} className="mb-4">
                  <span className="absolute -left-[5px] mt-1.5 size-2 rounded-full bg-primary" />
                  <p className="font-mono text-[11px] text-subtle">
                    {ev.at} · {ev.label}
                  </p>
                  <p className="text-sm">{ev.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </aside>
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="font-mono text-sm tabular">{v}</dd>
    </div>
  );
}
