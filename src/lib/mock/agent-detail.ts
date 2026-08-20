import type { Flow } from "@/lib/types";

export interface FlowVersion {
  version: string;
  releasedAt: string;
  author: string;
  changes: string;
  active: boolean;
}

export interface FlowExecutionRecord {
  id: string;
  startedAt: string;
  durationMs: number;
  status: "success" | "failed" | "running";
  errorCode?: "platform_disconnect" | "api_timeout" | "logic_error";
  trigger: "schedule" | "manual" | "event";
}

export interface FlowCostRecord {
  month: string;
  executionMinutes: number;
  executions: number;
  licenseFee: number;
  total: number;
}

export const flowVersions: Record<string, FlowVersion[]> = {
  flow_001: [
    { version: "v1.4.2", releasedAt: "2026-07-28", author: "张三", changes: "增加京东订单过滤逻辑", active: true },
    { version: "v1.4.1", releasedAt: "2026-07-12", author: "张三", changes: "修复 ERP 创建销售单字段映射", active: false },
    { version: "v1.4.0", releasedAt: "2026-06-30", author: "李四", changes: "升级到用友 ERP v3 API", active: false },
    { version: "v1.3.0", releasedAt: "2026-05-15", author: "李四", changes: "增加订单去重逻辑", active: false },
  ],
};

export const flowExecutionRecords: FlowExecutionRecord[] = [
  { id: "exec_001", startedAt: "2026-08-03T11:52:00+08:00", durationMs: 11_800, status: "success", trigger: "schedule" },
  { id: "exec_002", startedAt: "2026-08-03T11:37:00+08:00", durationMs: 12_400, status: "success", trigger: "schedule" },
  { id: "exec_003", startedAt: "2026-08-03T11:22:00+08:00", durationMs: 13_100, status: "success", trigger: "schedule" },
  { id: "exec_004", startedAt: "2026-08-03T11:07:00+08:00", durationMs: 9_200, status: "success", trigger: "schedule" },
  { id: "exec_005", startedAt: "2026-08-03T10:52:00+08:00", durationMs: 14_500, status: "failed", errorCode: "api_timeout", trigger: "schedule" },
  { id: "exec_006", startedAt: "2026-08-03T10:37:00+08:00", durationMs: 11_900, status: "success", trigger: "schedule" },
  { id: "exec_007", startedAt: "2026-08-03T10:22:00+08:00", durationMs: 12_000, status: "success", trigger: "manual" },
  { id: "exec_008", startedAt: "2026-08-03T10:07:00+08:00", durationMs: 12_300, status: "success", trigger: "schedule" },
];

export const flowCostRecords: FlowCostRecord[] = [
  { month: "2026-08", executionMinutes: 198, executions: 2688, licenseFee: 1200, total: 198 * 0.4 + 2688 * 0.02 + 1200 },
  { month: "2026-07", executionMinutes: 412, executions: 5952, licenseFee: 1200, total: 412 * 0.4 + 5952 * 0.02 + 1200 },
  { month: "2026-06", executionMinutes: 389, executions: 5760, licenseFee: 1200, total: 389 * 0.4 + 5760 * 0.02 + 1200 },
  { month: "2026-05", executionMinutes: 358, executions: 5328, licenseFee: 1200, total: 358 * 0.4 + 5328 * 0.02 + 1200 },
  { month: "2026-04", executionMinutes: 332, executions: 5040, licenseFee: 1200, total: 332 * 0.4 + 5040 * 0.02 + 1200 },
];

export interface CostSuggestion {
  id: string;
  title: string;
  saving: number;
  reason: string;
  action: string;
  status: "pending" | "applied" | "rejected";
}

export const costSuggestions: CostSuggestion[] = [
  {
    id: "sug_1",
    title: "下线 flow_008（月度财务对账归档）闲置许可",
    saving: 240,
    reason: "该流程从未执行过，但占用 APath 平台 1 个企业级许可位（¥240/月）。建议复用现有许可位或下线。",
    action: "下线流程",
    status: "pending",
  },
  {
    id: "sug_2",
    title: "合并 flow_005 与 flow_006 至单次采集任务",
    saving: 480,
    reason: "两个八爪鱼流程均每小时采集电商数据，可合并为单次任务，节省 50% 云端执行时长。",
    action: "查看合并方案",
    status: "pending",
  },
  {
    id: "sug_3",
    title: "flow_003 失败重试优化",
    saving: 180,
    reason: "TARS 大模型 API 超时率高，建议增加指数退避重试（最多 3 次），减少失败后的全量重跑成本。",
    action: "应用重试策略",
    status: "applied",
  },
  {
    id: "sug_4",
    title: "影刀许可从 5 个降至 3 个",
    saving: 800,
    reason: "近 30 天仅 3 个影刀流程活跃，2 个许可位闲置。建议季度评审后回收。",
    action: "申请回收",
    status: "pending",
  },
];

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  platform: Flow["platform"];
  scope: string;
  lastUsedAt: string | null;
  createdAt: string;
  status: "active" | "revoked";
  owner: string;
}

export const apiKeys: ApiKey[] = [
  { id: "key_001", name: "影刀 生产环境", prefix: "yd_prd_8f3a", platform: "yingdao", scope: "flows:read,execute", lastUsedAt: "2026-08-03T11:52:00+08:00", createdAt: "2026-04-12", status: "active", owner: "张三" },
  { id: "key_002", name: "实在智能 默认", prefix: "sz_def_a2b9", platform: "shizai", scope: "flows:read,execute,models:infer", lastUsedAt: "2026-08-03T11:48:00+08:00", createdAt: "2026-03-08", status: "active", owner: "法务数字化组" },
  { id: "key_003", name: "八爪鱼 采集专用", prefix: "bz_col_77c1", platform: "bazhuayu", scope: "collect:run,export:read", lastUsedAt: "2026-08-02T22:00:00+08:00", createdAt: "2026-02-20", status: "active", owner: "市场情报组" },
  { id: "key_004", name: "APath 编排服务", prefix: "ap_org_3f2e", platform: "apath", scope: "workflows:full", lastUsedAt: "2026-08-03T11:15:00+08:00", createdAt: "2026-01-30", status: "active", owner: "IT 运维组" },
  { id: "key_005", name: "影刀 测试环境（旧）", prefix: "yd_tst_1d4c", platform: "yingdao", scope: "flows:read", lastUsedAt: null, createdAt: "2025-11-12", status: "revoked", owner: "张三" },
  { id: "key_006", name: "实在智能 法务只读", prefix: "sz_ro_9e8d", platform: "shizai", scope: "flows:read,contracts:read", lastUsedAt: "2026-07-15T10:00:00+08:00", createdAt: "2026-05-22", status: "active", owner: "法务数字化组" },
  { id: "key_007", name: "弘玑 集团共享中心", prefix: "hj_grp_5c7e", platform: "hongji", scope: "workflows:full,audit:read", lastUsedAt: "2026-08-03T06:00:00+08:00", createdAt: "2025-12-08", status: "active", owner: "集团财务共享中心" },
];

export interface AuditLog {
  id: string;
  ts: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  risk: "low" | "medium" | "high";
  detail: string;
}

export const auditLogs: AuditLog[] = [
  { id: "log_001", ts: "2026-08-03T11:52:14+08:00", actor: "张三", action: "执行流程", target: "flow_001", ip: "10.0.1.34", risk: "low", detail: "淘宝订单同步到 ERP（手动触发）" },
  { id: "log_002", ts: "2026-08-03T11:48:02+08:00", actor: "系统", action: "自动熔断", target: "flow_003", ip: "internal", risk: "high", detail: "TARS 大模型 API 连续超时 3 次，已自动熔断 5 分钟" },
  { id: "log_003", ts: "2026-08-03T10:30:00+08:00", actor: "李四", action: "更新流程版本", target: "flow_001 → v1.4.2", ip: "10.0.1.55", risk: "low", detail: "增加京东订单过滤逻辑" },
  { id: "log_004", ts: "2026-08-03T09:15:22+08:00", actor: "王五", action: "导出数据", target: "flow_004 / 7月", ip: "10.0.2.18", risk: "medium", detail: "导出 7 月发票核验数据（482 条）到本地 Excel" },
  { id: "log_005", ts: "2026-08-03T02:00:00+08:00", actor: "系统", action: "调度执行", target: "flow_002", ip: "internal", risk: "low", detail: "京东售后单自动审核（每天 08:00 触发）" },
  { id: "log_006", ts: "2026-08-02T18:42:11+08:00", actor: "张三", action: "回收 API Key", target: "key_005", ip: "10.0.1.34", risk: "medium", detail: "影刀 测试环境（旧）许可 90 天未使用" },
  { id: "log_007", ts: "2026-08-02T14:22:08+08:00", actor: "未知", action: "登录失败", target: "控制台", ip: "203.0.113.42", risk: "high", detail: "连续 5 次 2FA 验证失败，IP 已自动封禁 1 小时" },
];

export interface AiAnomaly {
  id: string;
  ts: string;
  severity: "high" | "medium" | "low";
  type: string;
  description: string;
  relatedKey?: string;
  status: "open" | "resolved";
}

export const aiAnomalies: AiAnomaly[] = [
  { id: "an_001", ts: "2026-08-03T11:48:02+08:00", severity: "high", type: "API 异常高频", description: "key_002 在 5 分钟内调用 TARS 模型 47 次（正常 < 10），疑似循环触发", relatedKey: "key_002", status: "open" },
  { id: "an_002", ts: "2026-08-03T09:15:22+08:00", severity: "medium", type: "异常数据导出", description: "王五 在非工作时间导出 482 条发票数据，超过日常平均 3 倍", relatedKey: "key_003", status: "open" },
  { id: "an_003", ts: "2026-08-02T14:22:08+08:00", severity: "high", type: "凭证爆破", description: "外部 IP 203.0.113.42 尝试 5 次 2FA，已自动封禁", status: "resolved" },
];
