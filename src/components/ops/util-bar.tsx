import { cn } from "@/lib/utils";

export function UtilBar({
  label,
  value,
  suffix = "%",
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  const tone = value >= 85 ? "bg-danger" : value >= 70 ? "bg-warn" : "bg-ok";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-mono tabular text-fg">
          {value.toFixed(value % 1 ? 1 : 0)}
          {suffix}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
        <div className={cn("h-full rounded-full transition-[width] duration-500", tone)} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}
