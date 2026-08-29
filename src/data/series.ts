import { mulberry32 } from "@/lib/utils";
import type { SeriesPoint } from "./types";

const HOUR = 3_600_000;

export function buildSeries(now: number, hours: number, stepMin: number, seed = 42): SeriesPoint[] {
  const rand = mulberry32(seed);
  const step = stepMin * 60_000;
  const start = now - hours * HOUR;
  const points: SeriesPoint[] = [];
  for (let t = start, i = 0; t <= now; t += step, i++) {
    const hour = new Date(t).getUTCHours();
    const diurnal = 0.72 + 0.38 * Math.sin(((hour - 7) / 24) * Math.PI * 2);
    const burst = hour === 14 || hour === 9 ? 1.12 : 1;
    const noise = 0.92 + rand() * 0.16;
    const req = Math.round(18_400 * diurnal * burst * noise);
    const lat = 148 + (1.2 - diurnal) * 70 + rand() * 18;
    const err = 0.09 + (1.15 - diurnal) * 0.16 + rand() * 0.04;
    const gpu = 58 + diurnal * 16 + Math.sin(i / 9) * 4 + rand() * 3;
    points.push({
      t,
      requests: req,
      latency: Math.round(lat),
      errors: Number(err.toFixed(3)),
      gpu: Number(gpu.toFixed(1)),
    });
  }
  return points;
}

export function sliceSeries(series: SeriesPoint[], hours: number, now: number): SeriesPoint[] {
  const from = now - hours * HOUR;
  return series.filter((p) => p.t >= from);
}
