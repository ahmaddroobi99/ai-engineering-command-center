import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Command } from "cmdk";
import { MOCK_INCIDENTS } from "@/data/mock-incidents";
import { useOpsStore } from "@/store/ops-store";

const PAGES = [
  { to: "/", label: "Overview" },
  { to: "/models", label: "AI Models" },
  { to: "/infrastructure", label: "Infrastructure" },
  { to: "/services", label: "Services" },
  { to: "/incidents", label: "Incidents" },
  { to: "/activity", label: "Activity" },
];

export function CommandPalette() {
  const open = useOpsStore((s) => s.commandOpen);
  const setOpen = useOpsStore((s) => s.setCommandOpen);
  const services = useOpsStore((s) => s.services);
  const models = useOpsStore((s) => s.models);
  const select = useOpsStore((s) => s.select);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-bg/60 p-4 pt-[12vh]">
      <button type="button" className="absolute inset-0" aria-label="Dismiss search" onClick={() => setOpen(false)} />
      <Command
        label="Command palette"
        className="relative w-full max-w-lg overflow-hidden rounded-lg border border-border bg-surface shadow-panel"
      >
        <Command.Input
          autoFocus
          placeholder="Search services, models, incidents…"
          className="h-12 w-full border-b border-border bg-transparent px-4 text-sm outline-none"
        />
        <Command.List className="max-h-80 overflow-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-muted">No matches.</Command.Empty>
          <Command.Group heading="Pages" className="px-1 py-1 text-[11px] tracking-wide text-muted uppercase">
            {PAGES.map((p) => (
              <Command.Item
                key={p.to}
                value={p.label}
                onSelect={() => {
                  void navigate({ to: p.to });
                  setOpen(false);
                }}
                className="flex h-9 cursor-pointer items-center rounded-sm px-2 text-sm text-fg data-[selected=true]:bg-elevated"
              >
                {p.label}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Services" className="px-1 py-1 text-[11px] tracking-wide text-muted uppercase">
            {services.map((s) => (
              <Command.Item
                key={s.id}
                value={s.name}
                onSelect={() => {
                  void navigate({ to: "/services" });
                  select("service", s.id);
                  setOpen(false);
                }}
                className="flex h-9 cursor-pointer items-center rounded-sm px-2 text-sm data-[selected=true]:bg-elevated"
              >
                {s.name}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Models" className="px-1 py-1 text-[11px] tracking-wide text-muted uppercase">
            {models.map((m) => (
              <Command.Item
                key={m.id}
                value={m.name}
                onSelect={() => {
                  void navigate({ to: "/models" });
                  select("model", m.id);
                  setOpen(false);
                }}
                className="flex h-9 cursor-pointer items-center rounded-sm px-2 text-sm data-[selected=true]:bg-elevated"
              >
                {m.name}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Incidents" className="px-1 py-1 text-[11px] tracking-wide text-muted uppercase">
            {MOCK_INCIDENTS.map((i) => (
              <Command.Item
                key={i.id}
                value={`${i.id} ${i.title}`}
                onSelect={() => {
                  void navigate({ to: "/incidents" });
                  select("incident", i.id);
                  setOpen(false);
                }}
                className="flex h-9 cursor-pointer items-center rounded-sm px-2 text-sm data-[selected=true]:bg-elevated"
              >
                {i.id} · {i.title}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
