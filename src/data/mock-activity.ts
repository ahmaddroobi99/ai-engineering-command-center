import type { ActivityEvent } from "./types";

const now = Date.UTC(2026, 7, 29, 22, 42, 11);

export const SEED_ACTIVITY: ActivityEvent[] = [
  { id: "a1", at: now - 0, kind: "deployment", title: "Deployment v2.8.4 completed", detail: "api-gateway rolled to 8/8 healthy replicas." },
  { id: "a2", at: now - 63_000, kind: "infrastructure", title: "Vision API scaled 4 → 6 replicas", detail: "HPA on request rate 1.4k rps." },
  { id: "a3", at: now - 109_000, kind: "infrastructure", title: "GPU Node 02 crossed 80%", detail: "util 82.4% · VRAM 76% · 79°C." },
  { id: "a4", at: now - 174_000, kind: "ai", title: "1,200 inference requests processed", detail: "YOLO 11 batch window flushed in 81 ms." },
  { id: "a5", at: now - 248_000, kind: "incidents", title: "Incident INC-1042 resolved", detail: "GPU spike mitigated; eval job paused." },
  { id: "a6", at: now - 312_000, kind: "ai", title: "Vision API processed 2,481 requests", detail: "p50 74 ms · p95 128 ms." },
  { id: "a7", at: now - 401_000, kind: "security", title: "mTLS cert rotated", detail: "auth identity mesh, 14 services renewed." },
  { id: "a8", at: now - 488_000, kind: "ai", title: "LLM Gateway latency returned to normal", detail: "p95 612 ms after canary drain." },
  { id: "a9", at: now - 577_000, kind: "deployment", title: "model-registry signed YOLO 11.2", detail: "Promotion gate accuracy 94.6%." },
  { id: "a10", at: now - 690_000, kind: "infrastructure", title: "Object storage lifecycle rule applied", detail: "frames-raw → intelligent-tiering, 30d." },
  { id: "a11", at: now - 804_000, kind: "security", title: "WAF rule 2041 enabled", detail: "Blocked 38 anomalous embed-flood IPs." },
  { id: "a12", at: now - 955_000, kind: "incidents", title: "INC-1041 opened", detail: "Vision API latency SLO burn in progress." },
];

const AI_TITLES = [
  ["Vision API processed {n} requests", "Detection batch completed on gpu-node-01."],
  ["Embedding Model encoded {n} documents", "Mean 42 ms · queue depth 3."],
  ["Forecast Model scored {n} series", "Nightly batch shard 4/12."],
  ["Speech Model transcribed {n} clips", "WER holding at 3.9%."],
];

const INFRA_TITLES = [
  ["GPU Node 01 utilization {n}%", "Temperature within envelope."],
  ["CPU Node 01 request rate {n} rps", "Autoscaler idle."],
  ["Database connections {n}", "Primary lag 12 ms."],
];

const DEPLOY_TITLES = [
  ["Canary probe passed on {svc}", "Error budget intact."],
  ["Config reload on {svc}", "Zero-downtime drain."],
];

export function nextActivity(seq: number, at: number): ActivityEvent {
  const bucket = seq % 11;
  if (bucket < 5) {
    const [title, detail] = AI_TITLES[seq % AI_TITLES.length];
    const n = 1840 + ((seq * 137) % 2200);
    return { id: `live-${seq}`, at, kind: "ai", title: title.replace("{n}", n.toLocaleString()), detail };
  }
  if (bucket < 8) {
    const [title, detail] = INFRA_TITLES[seq % INFRA_TITLES.length];
    const n = 58 + ((seq * 3) % 24);
    return { id: `live-${seq}`, at, kind: "infrastructure", title: title.replace("{n}", String(n)), detail };
  }
  if (bucket === 8) {
    const svc = ["api-gateway", "llm-gateway", "vision-api"][seq % 3];
    const [title, detail] = DEPLOY_TITLES[seq % DEPLOY_TITLES.length];
    return { id: `live-${seq}`, at, kind: "deployment", title: title.replace("{svc}", svc), detail };
  }
  if (bucket === 9) {
    return {
      id: `live-${seq}`,
      at,
      kind: "security",
      title: "Service token minted for batch-inference",
      detail: "TTL 15m · audience internal.",
    };
  }
  return {
    id: `live-${seq}`,
    at,
    kind: "incidents",
    title: "SLO burn rate normal",
    detail: "No new pages. INC-1041 still investigating.",
  };
}
