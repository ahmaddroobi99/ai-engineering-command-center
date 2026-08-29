import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { sliceSeries } from "@/data/series";
import { useOpsStore } from "@/store/ops-store";
import { cn } from "@/lib/utils";

const RANGES = [
  { id: 1, label: "1h" },
  { id: 6, label: "6h" },
  { id: 24, label: "24h" },
  { id: 168, label: "7d" },
] as const;

export function MetricChart({ range, onRange }: { range: number; onRange: (n: number) => void }) {
  const series = useOpsStore((s) => s.series);
  const now = useOpsStore((s) => s.now);
  const data = useMemo(() => sliceSeries(series, range, now), [series, range, now]);

  return (
    <section className="rounded-lg border border-border bg-surface p-4 shadow-panel">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">Request volume and latency</h2>
          <p className="text-xs text-muted">Simulated telemetry · last {range >= 24 ? `${range / 24}d` : `${range}h`}</p>
        </div>
        <div className="flex rounded-sm border border-border p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onRange(r.id)}
              className={cn(
                "h-8 min-w-11 rounded-[6px] px-2.5 text-xs",
                range === r.id ? "bg-elevated text-fg" : "text-muted hover:text-fg",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
            <XAxis
              dataKey="t"
              tickFormatter={(t) =>
                range >= 168
                  ? new Date(t).toLocaleDateString(undefined, { weekday: "short" })
                  : new Date(t).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
              }
              tick={{ fontSize: 11, fill: "currentColor" }}
              stroke="transparent"
              minTickGap={28}
            />
            <YAxis yAxisId="req" tick={{ fontSize: 11, fill: "currentColor" }} stroke="transparent" width={42} />
            <YAxis yAxisId="lat" orientation="right" tick={{ fontSize: 11, fill: "currentColor" }} stroke="transparent" width={36} />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelFormatter={(t) => new Date(Number(t)).toLocaleString()}
            />
            <Area
              yAxisId="req"
              type="monotone"
              dataKey="requests"
              stroke="var(--primary)"
              fill="var(--primary)"
              fillOpacity={0.12}
              strokeWidth={1.6}
              name="Requests"
            />
            <Line
              yAxisId="lat"
              type="monotone"
              dataKey="latency"
              stroke="var(--warn)"
              strokeWidth={1.5}
              dot={false}
              name="Latency ms"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
