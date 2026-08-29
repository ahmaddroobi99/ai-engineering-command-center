import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { IncidentStatusBadge, PriorityBadge } from "@/components/ui/badge";
import { MOCK_INCIDENTS } from "@/data/mock-incidents";
import type { IncidentStatus, Priority } from "@/data/types";
import { useOpsStore } from "@/store/ops-store";

export const Route = createFileRoute("/incidents")({ component: IncidentsPage });

export function IncidentsPage() {
  const select = useOpsStore((s) => s.select);
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState<"all" | Priority>("all");
  const [status, setStatus] = useState<"all" | IncidentStatus>("all");

  const rows = useMemo(
    () =>
      MOCK_INCIDENTS.filter((i) => {
        const hit = `${i.id} ${i.title} ${i.summary}`.toLowerCase().includes(q.toLowerCase());
        return hit && (priority === "all" || i.priority === priority) && (status === "all" || i.status === status);
      }),
    [q, priority, status],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">Incidents</h2>
          <p className="text-sm text-muted">Detection through resolution for the AI platform.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search incidents"
            className="h-10 w-44 rounded-sm border border-border bg-surface px-3 text-sm"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "all" | Priority)}
            className="h-10 rounded-sm border border-border bg-surface px-2 text-sm"
          >
            <option value="all">All priorities</option>
            {(["P1", "P2", "P3", "P4"] as const).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "all" | IncidentStatus)}
            className="h-10 rounded-sm border border-border bg-surface px-2 text-sm"
          >
            <option value="all">All statuses</option>
            {(["investigating", "mitigated", "monitoring", "resolved"] as const).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      {rows.length === 0 && (
        <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted">
          No incidents match this filter.
        </div>
      )}
      <ul className="space-y-2">
        {rows.map((i) => (
          <li key={i.id}>
            <button
              type="button"
              onClick={() => select("incident", i.id)}
              className="w-full rounded-lg border border-border bg-surface p-4 text-left shadow-panel hover:border-border-strong"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-muted">{i.id}</span>
                <span className="flex gap-1.5">
                  <PriorityBadge priority={i.priority} />
                  <IncidentStatusBadge status={i.status} />
                </span>
              </div>
              <p className="mt-1 text-sm font-medium">{i.title}</p>
              <p className="mt-1 text-xs text-muted">{i.summary}</p>
              <p className="mt-2 text-xs text-subtle">Opened {new Date(i.openedAt).toLocaleString()} · {i.commander}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
