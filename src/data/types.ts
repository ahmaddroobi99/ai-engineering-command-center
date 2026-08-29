export type Health = "healthy" | "degraded" | "critical" | "offline";
export type Priority = "P1" | "P2" | "P3" | "P4";
export type IncidentStatus = "investigating" | "mitigated" | "monitoring" | "resolved";
export type ActivityKind = "deployment" | "infrastructure" | "ai" | "security" | "incidents";
export type ModelType = "detector" | "vlm" | "llm" | "embedding" | "speech" | "forecast";
export type InfraKind = "gateway" | "gpu" | "cpu" | "database" | "storage" | "observability";

export interface KpiSnapshot {
  services: number;
  servicesDelta: number;
  requests24h: number;
  requestsDelta: number;
  latencyMs: number;
  latencyDelta: number;
  errorRate: number;
  errorDelta: number;
  gpuUtil: number;
  gpuDelta: number;
  monthlyCost: number;
  costDelta: number;
}

export interface ServiceRecord {
  id: string;
  name: string;
  slug: string;
  version: string;
  owner: string;
  region: string;
  status: Health;
  uptime: number;
  requests24h: number;
  latencyMs: number;
  errorRate: number;
  replicas: number;
  targetReplicas: number;
  description: string;
}

export interface ModelRecord {
  id: string;
  name: string;
  version: string;
  type: ModelType;
  framework: string;
  requests24h: number;
  latencyMs: number;
  gpuUtil: number;
  accuracy: number;
  status: Health;
  tokensOrFrames: number;
  throughput: number;
  errorRate: number;
  deployedAt: string;
  endpoint: string;
}

export interface IncidentEvent {
  at: string;
  label: string;
  detail: string;
  state: IncidentStatus | "detected";
}

export interface IncidentRecord {
  id: string;
  title: string;
  summary: string;
  priority: Priority;
  status: IncidentStatus;
  openedAt: string;
  resolvedAt: string | null;
  commander: string;
  affected: string[];
  impact: string;
  timeline: IncidentEvent[];
}

export interface InfraNode {
  id: string;
  name: string;
  kind: InfraKind;
  parent?: string;
  status: Health;
  region: string;
  cpu: number;
  ram: number;
  gpu: number;
  vram: number;
  tempC: number;
  requests: number;
  connections: number;
  queryMs: number;
  storageUsedTb: number;
  storageCapTb: number;
  growthPct: number;
}

export interface ActivityEvent {
  id: string;
  at: number;
  kind: ActivityKind;
  title: string;
  detail: string;
}

export interface SeriesPoint {
  t: number;
  requests: number;
  latency: number;
  errors: number;
  gpu: number;
}
