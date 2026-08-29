import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/ui/badge";
import { formatMs, formatNumber, formatPct } from "@/lib/utils";
import { useOpsStore } from "@/store/ops-store";
import type { Health } from "@/data/types";

export const Route = createFileRoute("/models")({ component: ModelsPage });

const COLS = ["name", "version", "type", "requests24h", "latencyMs", "gpuUtil", "accuracy", "status"] as const;

export function ModelsPage() {
  const models = useOpsStore((s) => s.models);
  const select = useOpsStore((s) => s.select);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | Health>("all");
  const [sort, setSort] = useState<(typeof COLS)[number]>("requests24h");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    const filtered = models.filter((m) => {
      const hit = `${m.name} ${m.version} ${m.type}`.toLowerCase().includes(q.toLowerCase());
      return hit && (status === "all" || m.status === status);
    });
    return filtered.sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return dir === "asc" ? cmp : -cmp;
    });
  }, [models, q, status, sort, dir]);

  const toggle = (key: (typeof COLS)[number]) => {
    if (sort === key) setDir(dir === "asc" ? "desc" : "asc");
    else {
      setSort(key);
      setDir("desc");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">AI Models</h2>
          <p className="text-sm text-muted">Inference latency, throughput, and GPU pressure.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search models"
            className="h-10 w-44 rounded-sm border border-border bg-surface px-3 text-sm"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "all" | Health)}
            className="h-10 rounded-sm border border-border bg-surface px-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="healthy">Healthy</option>
            <option value="degraded">Degraded</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border text-xs tracking-wide text-muted uppercase">
            <tr>
              {[
                ["name", "Model"],
                ["version", "Version"],
                ["type", "Type"],
                ["requests24h", "Requests"],
                ["latencyMs", "Latency"],
                ["gpuUtil", "GPU"],
                ["accuracy", "Accuracy"],
                ["status", "Status"],
              ].map(([key, label]) => (
                <th key={key} className="px-3 py-2 font-medium">
                  <button type="button" onClick={() => toggle(key as (typeof COLS)[number])} className="hover:text-fg">
                    {label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-muted">
                  No models match this filter.
                </td>
              </tr>
            )}
            {rows.map((m) => (
              <tr
                key={m.id}
                className="cursor-pointer border-b border-border last:border-0 hover:bg-elevated/60"
                onClick={() => select("model", m.id)}
              >
                <td className="px-3 py-3 font-medium">{m.name}</td>
                <td className="px-3 py-3 font-mono text-xs">{m.version}</td>
                <td className="px-3 py-3 capitalize text-muted">{m.type}</td>
                <td className="px-3 py-3 font-mono tabular">{formatNumber(m.requests24h, 2)}</td>
                <td className="px-3 py-3 font-mono tabular">{formatMs(m.latencyMs)}</td>
                <td className="px-3 py-3 font-mono tabular">{formatPct(m.gpuUtil, 1)}</td>
                <td className="px-3 py-3 font-mono tabular">{formatPct(m.accuracy, 1)}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={m.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
