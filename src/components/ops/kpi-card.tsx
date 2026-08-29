import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  invert,
}: {
  label: string;
  value: string;
  delta: number;
  invert?: boolean;
}) {
  const up = delta >= 0;
  const good = invert ? !up : up;
  return (
    <article className="rounded-lg border border-border bg-surface p-4 shadow-panel">
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-2 font-mono text-2xl tabular tracking-tight text-fg">{value}</p>
      <p className={cn("mt-2 inline-flex items-center gap-1 text-xs tabular", good ? "text-ok" : "text-danger")}>
        {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
        {up ? "+" : ""}
        {delta}
        {label.includes("Services") ? "" : "%"}
      </p>
    </article>
  );
}
