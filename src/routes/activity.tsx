import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ActivityFeed } from "@/components/ops/activity-feed";
import type { ActivityKind } from "@/data/types";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/store/ops-store";

export const Route = createFileRoute("/activity")({ component: ActivityPage });

const FILTERS: Array<{ id: "all" | ActivityKind; label: string }> = [
  { id: "all", label: "All" },
  { id: "deployment", label: "Deployments" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "ai", label: "AI" },
  { id: "security", label: "Security" },
  { id: "incidents", label: "Incidents" },
];

export function ActivityPage() {
  const activity = useOpsStore((s) => s.activity);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const events = useMemo(
    () => (filter === "all" ? activity : activity.filter((e) => e.kind === filter)),
    [activity, filter],
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium">Activity</h2>
        <p className="text-sm text-muted">Chronological engineering event stream.</p>
      </div>
      <div className="flex flex-wrap gap-1 rounded-sm border border-border p-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "h-9 rounded-[6px] px-3 text-xs",
              filter === f.id ? "bg-elevated text-fg" : "text-muted hover:text-fg",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <section className="rounded-lg border border-border bg-surface px-4 py-2 shadow-panel">
        <ActivityFeed events={events} />
      </section>
    </div>
  );
}
