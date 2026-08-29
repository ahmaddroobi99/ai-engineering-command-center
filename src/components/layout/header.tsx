import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useOpsStore } from "@/store/ops-store";

export function Header() {
  const { theme, toggle } = useTheme();
  const kpis = useOpsStore((s) => s.kpis);
  const setCommandOpen = useOpsStore((s) => s.setCommandOpen);
  const setSidebarOpen = useOpsStore((s) => s.setSidebarOpen);
  const notifications = useOpsStore((s) => s.notifications);
  const healthy = kpis.errorRate < 0.35 && kpis.gpuUtil < 90;

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-surface px-3 md:px-5">
      <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
        <Menu className="size-4" />
      </Button>
      <div className="min-w-0 md:hidden">
        <p className="truncate text-sm font-medium tracking-tight">Command Center</p>
      </div>
      <div className="hidden min-w-0 md:block">
        <h1 className="truncate text-sm font-medium tracking-tight">AI Engineering Command Center</h1>
        <p className="truncate text-[11px] text-muted">AI infrastructure, model performance and service reliability</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="hidden items-center gap-2 rounded-sm border border-border px-2.5 py-1 text-xs sm:inline-flex">
          <span className={`size-1.5 rounded-full ${healthy ? "bg-ok pulse-dot text-ok" : "bg-warn pulse-dot text-warn"}`} />
          <span className="tracking-wide text-muted uppercase">{healthy ? "All systems operational" : "Degraded performance"}</span>
        </span>
        <Button variant="outline" size="sm" className="hidden gap-2 text-muted md:inline-flex" onClick={() => setCommandOpen(true)}>
          <Search className="size-3.5" />
          Search
          <kbd className="ml-2 rounded-sm border border-border px-1 font-mono text-[10px]">⌘K</kbd>
        </Button>
        <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={() => setCommandOpen(true)} aria-label="Search">
          <Search className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={toggle} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <Button variant="ghost" size="icon-sm" className="relative" aria-label="Notifications">
          <Bell className="size-4" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 size-1.5 rounded-full bg-danger" />
          )}
        </Button>
        <div className="flex size-8 items-center justify-center rounded-full bg-elevated font-mono text-xs">AC</div>
      </div>
    </header>
  );
}
