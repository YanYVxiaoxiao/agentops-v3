export type FlowStatus = "OK" | "FAILING" | "SILENT" | "NEVER_RAN" | "IDLE";

export type RpaPlatformId = "yingdao" | "shizai" | "bazhuayu" | "apath" | "hongji";

export interface Flow {
  id: string;
  name: string;
  description: string;
  platform: RpaPlatformId;
  status: FlowStatus;
  schedule: string;
  scheduleCron: string;
  executions24h: number;
  avgDurationMs: number;
  successRate: number;
  lastRunAt: string | null;
  owner: string;
  department: string;
  tags: string[];
  /** 24h 时间桶的执行次数（每小时一个，0-23） */
  hourlyRuns: number[];
  /** 调用链路步骤（用于 Stepper / Kanban / DAG 三视图） */
  steps: FlowStep[];
}

export interface FlowStep {
  id: string;
  title: string;
  actor: "rpa" | "api" | "human";
  status: "done" | "running" | "pending" | "failed";
  durationMs?: number;
  /** DAG 中的下游 step id */
  next?: string[];
}

export interface Execution {
  id: string;
  flowId: string;
  startedAt: string;
  durationMs: number;
  status: "success" | "failed" | "running";
  errorCode?: "platform_disconnect" | "api_timeout" | "logic_error";
  trace: TraceSpan;
}

export interface TraceSpan {
  id: string;
  type: "rpa_step" | "api_call";
  name: string;
  durationMs: number;
  status: "ok" | "err";
  children?: TraceSpan[];
}
