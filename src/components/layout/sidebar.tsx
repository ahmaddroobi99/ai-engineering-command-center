import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Box,
  Cpu,
  LayoutDashboard,
  Server,
  Siren,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/store/ops-store";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/models", label: "AI Models", icon: Box },
  { to: "/infrastructure", label: "Infrastructure", icon: Cpu },
  { to: "/services", label: "Services", icon: Server },
  { to: "/incidents", label: "Incidents", icon: Siren },
  { to: "/activity", label: "Activity", icon: Activity },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const open = useOpsStore((s) => s.sidebarOpen);
  const setOpen = useOpsStore((s) => s.setSidebarOpen);

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-bg/60 md:hidden"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={cn(
          "z-40 w-60 flex-col border-r border-border bg-surface",
          "md:static md:flex md:translate-x-0",
          open
            ? "fixed inset-y-0 left-0 flex"
            : "hidden md:flex",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium tracking-tight">Command Center</p>
            <p className="truncate text-[11px] text-muted">us-west-2 · prod</p>
          </div>
          <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={() => setOpen(false)} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex h-10 items-center gap-2.5 rounded-sm px-2.5 text-sm",
                  active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/70 hover:text-fg",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3 text-[11px] leading-relaxed text-subtle">
          Simulated telemetry. No live cluster attached.
        </div>
      </aside>
    </>
  );
}
