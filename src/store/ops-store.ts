import { create } from "zustand";
import { MOCK_SERVICES } from "@/data/mock-services";
import { MOCK_MODELS } from "@/data/mock-models";
import { MOCK_INFRA } from "@/data/mock-infrastructure";
import { SEED_ACTIVITY, nextActivity as makeActivity } from "@/data/mock-activity";
import { buildSeries } from "@/data/series";
import { clamp } from "@/lib/utils";
import type {
  ActivityEvent,
  InfraNode,
  KpiSnapshot,
  ModelRecord,
  SeriesPoint,
  ServiceRecord,
} from "@/data/types";

const BASE_NOW = Date.UTC(2026, 7, 29, 22, 42, 11);

function walk(value: number, delta: number, min: number, max: number) {
  return clamp(value + (Math.random() * 2 - 1) * delta, min, max);
}

interface OpsState {
  tick: number;
  now: number;
  kpis: KpiSnapshot;
  services: ServiceRecord[];
  models: ModelRecord[];
  infra: InfraNode[];
  activity: ActivityEvent[];
  series: SeriesPoint[];
  notifications: number;
  selectedId: string | null;
  selectedKind: "service" | "model" | "incident" | "infra" | null;
  commandOpen: boolean;
  search: string;
  sidebarOpen: boolean;
  setSearch: (q: string) => void;
  setCommandOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  select: (kind: OpsState["selectedKind"], id: string | null) => void;
  step: () => void;
}

const initialKpis: KpiSnapshot = {
  services: 12,
  servicesDelta: 2,
  requests24h: 1_842_110,
  requestsDelta: 12.4,
  latencyMs: 184,
  latencyDelta: -8.2,
  errorRate: 0.18,
  errorDelta: -0.04,
  gpuUtil: 67,
  gpuDelta: 4.1,
  monthlyCost: 18_420,
  costDelta: 2.8,
};

export const useOpsStore = create<OpsState>((set, get) => ({
  tick: 0,
  now: BASE_NOW,
  kpis: initialKpis,
  services: MOCK_SERVICES,
  models: MOCK_MODELS,
  infra: MOCK_INFRA,
  activity: SEED_ACTIVITY,
  series: buildSeries(BASE_NOW, 168, 60, 91),
  notifications: 3,
  selectedId: null,
  selectedKind: null,
  commandOpen: false,
  search: "",
  sidebarOpen: false,
  setSearch: (q) => set({ search: q }),
  setCommandOpen: (open) => set({ commandOpen: open }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  select: (kind, id) => set({ selectedKind: kind, selectedId: id, sidebarOpen: false }),
  step: () => {
    const { tick, kpis, services, models, infra, activity, series, now } = get();
    const nextTick = tick + 1;
    const nextNow = now + 2_000;
    const gpuUtil = walk(kpis.gpuUtil, 1.1, 60, 75);
    const latencyMs = walk(kpis.latencyMs, 4.5, 160, 220);
    const errorRate = walk(kpis.errorRate, 0.012, 0.11, 0.32);
    const requests24h = kpis.requests24h + 18 + Math.floor(Math.random() * 14);

    const nextServices = services.map((s) => {
      if (s.id === "svc-vision") {
        return {
          ...s,
          latencyMs: Math.round(walk(s.latencyMs, 6, 180, 240)),
          errorRate: Number(walk(s.errorRate, 0.02, 0.22, 0.4).toFixed(2)),
          requests24h: s.requests24h + 4 + Math.floor(Math.random() * 6),
        };
      }
      return {
        ...s,
        latencyMs: Math.round(walk(s.latencyMs, 1.4, Math.max(6, s.latencyMs * 0.85), s.latencyMs * 1.15)),
        requests24h: s.requests24h + Math.floor(Math.random() * 8),
      };
    });

    const nextModels = models.map((m) => ({
      ...m,
      gpuUtil: Number(walk(m.gpuUtil, 1.4, Math.max(18, m.gpuUtil - 8), Math.min(92, m.gpuUtil + 8)).toFixed(1)),
      latencyMs: Math.round(walk(m.latencyMs, m.latencyMs * 0.03, m.latencyMs * 0.9, m.latencyMs * 1.12)),
      requests24h: m.requests24h + Math.floor(Math.random() * 5),
    }));

    const nextInfra = infra.map((n) => {
      if (n.kind === "gpu") {
        const gpu = Number(walk(n.gpu, 1.3, 58, 88).toFixed(1));
        return {
          ...n,
          gpu,
          vram: Number(walk(n.vram, 1.1, 50, 86).toFixed(1)),
          tempC: Math.round(walk(n.tempC, 0.8, 66, 84)),
          status: (gpu > 84 ? "degraded" : "healthy") as InfraNode["status"],
          requests: n.requests + Math.floor(Math.random() * 12),
        };
      }
      if (n.kind === "cpu" || n.kind === "gateway") {
        return {
          ...n,
          cpu: Number(walk(n.cpu, 1.2, 22, 68).toFixed(1)),
          ram: Number(walk(n.ram, 1.0, 30, 78).toFixed(1)),
        };
      }
      return n;
    });

    const last = series[series.length - 1];
    const nextPoint: SeriesPoint = {
      t: nextNow,
      requests: Math.round(walk(last?.requests ?? 18000, 400, 12000, 28000)),
      latency: Math.round(latencyMs),
      errors: Number(errorRate.toFixed(3)),
      gpu: Number(gpuUtil.toFixed(1)),
    };

    let nextFeed = activity;
    if (nextTick % 2 === 0) {
      nextFeed = [makeActivity(nextTick, nextNow), ...activity].slice(0, 80);
    }

    set({
      tick: nextTick,
      now: nextNow,
      kpis: {
        ...kpis,
        gpuUtil: Number(gpuUtil.toFixed(1)),
        latencyMs: Math.round(latencyMs),
        errorRate: Number(errorRate.toFixed(2)),
        requests24h,
      },
      services: nextServices,
      models: nextModels,
      infra: nextInfra,
      series: [...series.slice(-400), nextPoint],
      activity: nextFeed,
    });
  },
}));
