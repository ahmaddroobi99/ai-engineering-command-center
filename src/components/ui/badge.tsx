import { cn } from "@/lib/utils";
import type { Health, IncidentStatus, Priority } from "@/data/types";

export function StatusDot({ status }: { status: Health }) {
  const color =
    status === "healthy"
      ? "bg-ok text-ok"
      : status === "degraded"
        ? "bg-warn text-warn"
        : status === "offline"
          ? "bg-subtle text-subtle"
          : "bg-danger text-danger";
  return <span className={cn("size-2 rounded-full pulse-dot", color)} />;
}

export function StatusBadge({ status }: { status: Health }) {
  const label = status === "healthy" ? "Healthy" : status === "degraded" ? "Degraded" : status === "offline" ? "Offline" : "Critical";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-elevated px-2 py-0.5 text-xs text-fg">
      <StatusDot status={status} />
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const tone =
    priority === "P1"
      ? "text-danger border-danger/30"
      : priority === "P2"
        ? "text-warn border-warn/30"
        : "text-muted border-border";
  return (
    <span className={cn("rounded-sm border px-1.5 py-0.5 font-mono text-[11px] tracking-wide", tone)}>
      {priority}
    </span>
  );
}

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  return (
    <span className="rounded-sm border border-border bg-elevated px-2 py-0.5 text-xs capitalize text-muted">
      {status}
    </span>
  );
}
