import { Activity, Box, Cpu, Shield, Siren } from "lucide-react";
import type { ActivityEvent, ActivityKind } from "@/data/types";
import { cn } from "@/lib/utils";

const ICONS: Record<ActivityKind, typeof Activity> = {
  ai: Activity,
  infrastructure: Cpu,
  deployment: Box,
  security: Shield,
  incidents: Siren,
};

export function ActivityFeed({ events, compact }: { events: ActivityEvent[]; compact?: boolean }) {
  if (events.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
        No events in this filter.
      </div>
    );
  }
  return (
    <ol className={cn("space-y-0", compact ? "max-h-[420px] overflow-auto pr-1" : "")}>
      {events.map((e) => {
        const Icon = ICONS[e.kind];
        return (
          <li key={e.id} className="flex gap-3 border-b border-border py-3 last:border-0">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-sm bg-elevated text-muted">
              <Icon className="size-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-sm text-fg">{e.title}</p>
                <time className="shrink-0 font-mono text-[11px] tabular text-subtle">
                  {new Date(e.at).toLocaleTimeString(undefined, { hour12: false })}
                </time>
              </div>
              <p className="mt-0.5 text-xs text-muted">{e.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
