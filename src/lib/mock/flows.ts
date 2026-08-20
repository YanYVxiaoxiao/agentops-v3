import type { Flow, Execution } from "@/lib/types";

/**
 * Mock 数据 — 真实场景化的 9 个 RPA 流程
 * 覆盖 5 个平台 × 5 种状态（OK / FAILING / SILENT / NEVER_RAN / IDLE）
 * 所有时间用 ISO string，方便 date-fns 处理
 */

const now = new Date();
const iso = (minsAgo: number) =>
  new Date(now.getTime() - minsAgo * 60 * 1000).toISOString();

// 24h 时间桶（24 个值）—— 模拟真实执行节奏
const bucket = (pattern: number[]) => {
  const out = new Array(24).fill(0);
  pattern.forEach((v, i) => (out[i % 24] = v));
  return out;
};

export const flows: Flow[] = [
  {
    id: "flow_001",
    name: "淘宝订单同步到 ERP",
    description: "每 15 分钟拉取淘宝待发货订单，写入用友 ERP，触发仓库拣货",
    platform: "yingdao",
    status: "OK",
    schedule: "每 15 分钟",
    scheduleCron: "*/15 * * * *",
    executions24h: 96,
    avgDurationMs: 12_400,
    successRate: 0.99,
    lastRunAt: iso(8),
    owner: "电商运维组",
    department: "电商事业部",
    tags: ["电商", "订单", "核心"],
    hourlyRuns: bucket([6, 5, 4, 3, 3, 4, 8, 12, 14, 11, 9, 7, 6, 5, 4, 6, 9, 13, 15, 11, 8, 6, 5, 4]),
    steps: [
      { id: "s1", title: "登录淘宝卖家中心", actor: "rpa", status: "done", durationMs: 2_100, next: ["s2"] },
      { id: "s2", title: "拉取待发货订单列表", actor: "api", status: "done", durationMs: 800, next: ["s3"] },
      { id: "s3", title: "过滤已同步订单", actor: "rpa", status: "done", durationMs: 350, next: ["s4"] },
      { id: "s4", title: "调用 ERP 创建销售单", actor: "api", status: "done", durationMs: 4_200, next: ["s5"] },
      { id: "s5", title: "更新订单同步状态标记", actor: "rpa", status: "done", durationMs: 280 },
    ],
  },
  {
    id: "flow_002",
    name: "京东售后单自动审核",
    description: "每天 8 点拉取京东售后单，按规则审核后回写处理结果，超时单据转人工",
    platform: "yingdao",
    status: "OK",
    schedule: "每天 08:00",
    scheduleCron: "0 8 * * *",
    executions24h: 1,
    avgDurationMs: 48_300,
    successRate: 0.95,
    lastRunAt: iso(240),
    owner: "电商运维组",
    department: "电商事业部",
    tags: ["电商", "售后"],
    hourlyRuns: bucket([0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
    steps: [
      { id: "s1", title: "登录京东商家后台", actor: "rpa", status: "done", durationMs: 3_400, next: ["s2"] },
      { id: "s2", title: "拉取待审核售后单", actor: "api", status: "done", durationMs: 1_200, next: ["s3"] },
      { id: "s3", title: "按规则引擎审核", actor: "rpa", status: "done", durationMs: 12_800, next: ["s4"] },
      { id: "s4", title: "回写审核结果", actor: "api", status: "done", durationMs: 1_900, next: ["s5"] },
      { id: "s5", title: "通知人工处理超时单", actor: "rpa", status: "done", durationMs: 600 },
    ],
  },
  {
    id: "flow_003",
    name: "合同智能识别入 OA",
    description: "实时识别上传的 PDF 合同，提取甲乙方/金额/条款，自动创建 OA 审批流",
    platform: "shizai",
    status: "FAILING",
    schedule: "事件触发",
    scheduleCron: "on_upload",
    executions24h: 23,
    avgDurationMs: 8_700,
    successRate: 0.65,
    lastRunAt: iso(14),
    owner: "法务数字化组",
    department: "法务部",
    tags: ["法务", "IDP", "AI"],
    hourlyRuns: bucket([0,1,0,2,1,0,1,2,3,2,1,2,3,2,1,0,1,2,1,0,1,0,1,0]),
    steps: [
      { id: "s1", title: "监听 OSS 上传事件", actor: "api", status: "done", durationMs: 120, next: ["s2"] },
      { id: "s2", title: "下载 PDF 到本地", actor: "api", status: "done", durationMs: 1_800, next: ["s3"] },
      { id: "s3", title: "OCR 提取文本", actor: "rpa", status: "done", durationMs: 3_200, next: ["s4"] },
      { id: "s4", title: "TARS 大模型抽取字段", actor: "api", status: "failed", durationMs: 9_800 },
    ],
  },
  {
    id: "flow_004",
    name: "增值税发票自动核验",
    description: "每 30 分钟从邮箱拉取发票，OCR 识别后调国税 API 核验真伪，写入财务系统",
    platform: "shizai",
    status: "OK",
    schedule: "每 30 分钟",
    scheduleCron: "*/30 * * * *",
    executions24h: 48,
    avgDurationMs: 6_200,
    successRate: 0.97,
    lastRunAt: iso(12),
    owner: "财务自动化组",
    department: "财务部",
    tags: ["财务", "发票", "OCR"],
    hourlyRuns: bucket([2,1,1,2,1,2,3,3,2,2,3,2,2,3,2,2,3,3,2,2,3,2,1,2]),
    steps: [
      { id: "s1", title: "拉取邮箱未读发票邮件", actor: "rpa", status: "done", durationMs: 1_400, next: ["s2"] },
      { id: "s2", title: "下载附件 PDF", actor: "rpa", status: "done", durationMs: 800, next: ["s3"] },
      { id: "s3", title: "OCR 识别发票字段", actor: "api", status: "done", durationMs: 2_100, next: ["s4"] },
      { id: "s4", title: "调国税 API 核验", actor: "api", status: "done", durationMs: 1_900, next: ["s5"] },
      { id: "s5", title: "写入用友财务系统", actor: "api", status: "done", durationMs: 600 },
    ],
  },
  {
    id: "flow_005",
    name: "竞品价格采集入库",
    description: "每小时采集 200+ 电商网站竞品价格，写入 MongoDB，触发价格预警邮件",
    platform: "bazhuayu",
    status: "SILENT",
    schedule: "每小时",
    scheduleCron: "0 * * * *",
    executions24h: 0,
    avgDurationMs: 124_000,
    successRate: 0.92,
    lastRunAt: iso(180),
    owner: "市场情报组",
    department: "市场部",
    tags: ["采集", "竞品", "预警"],
    hourlyRuns: bucket([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
    steps: [
      { id: "s1", title: "加载 200+ 网站适配器", actor: "rpa", status: "pending", next: ["s2"] },
      { id: "s2", title: "并发采集价格数据", actor: "rpa", status: "pending", next: ["s3"] },
      { id: "s3", title: "清洗去重", actor: "api", status: "pending", next: ["s4"] },
      { id: "s4", title: "写入 MongoDB", actor: "api", status: "pending", next: ["s5"] },
      { id: "s5", title: "触发价格预警邮件", actor: "api", status: "pending" },
    ],
  },
  {
    id: "flow_006",
    name: "微博热搜监控",
    description: "每 10 分钟采集微博热搜榜，与品牌词库匹配，命中后企业微信通知 PR 团队",
    platform: "bazhuayu",
    status: "OK",
    schedule: "每 10 分钟",
    scheduleCron: "*/10 * * * *",
    executions24h: 144,
    avgDurationMs: 4_300,
    successRate: 0.998,
    lastRunAt: iso(3),
    owner: "品牌公关组",
    department: "市场部",
    tags: ["采集", "舆情", "预警"],
    hourlyRuns: bucket([6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6]),
    steps: [
      { id: "s1", title: "采集微博热搜榜", actor: "rpa", status: "done", durationMs: 1_200, next: ["s2"] },
      { id: "s2", title: "匹配品牌词库", actor: "api", status: "done", durationMs: 350, next: ["s3"] },
      { id: "s3", title: "命中后企微通知", actor: "api", status: "done", durationMs: 280 },
    ],
  },
  {
    id: "flow_007",
    name: "员工入职跨系统开通",
    description: "OA 收到入职审批通过后，自动在 AD/邮箱/企微/CRM/工单系统创建账号",
    platform: "apath",
    status: "OK",
    schedule: "事件触发",
    scheduleCron: "on_approval",
    executions24h: 8,
    avgDurationMs: 32_000,
    successRate: 0.96,
    lastRunAt: iso(45),
    owner: "IT 运维组",
    department: "信息技术部",
    tags: ["HR", "跨系统", "编排"],
    hourlyRuns: bucket([0,0,0,0,0,0,1,2,1,0,1,0,0,1,0,0,1,0,1,0,0,0,0,0]),
    steps: [
      { id: "s1", title: "OA 拉取入职审批单", actor: "api", status: "done", durationMs: 400, next: ["s2","s3","s4","s5"] },
      { id: "s2", title: "AD 创建域账号", actor: "api", status: "done", durationMs: 1_800 },
      { id: "s3", title: "Exchange 开通邮箱", actor: "api", status: "done", durationMs: 2_400 },
      { id: "s4", title: "企微开通成员账号", actor: "api", status: "done", durationMs: 1_100 },
      { id: "s5", title: "CRM/工单系统建账号", actor: "api", status: "done", durationMs: 2_200 },
    ],
  },
  {
    id: "flow_008",
    name: "月度财务对账归档",
    description: "每月 1 号凌晨拉取上月所有 RPA 流程执行日志，与 ERP 流水对账，生成归档报告",
    platform: "apath",
    status: "NEVER_RAN",
    schedule: "每月 1 号 02:00",
    scheduleCron: "0 2 1 * *",
    executions24h: 0,
    avgDurationMs: 0,
    successRate: 0,
    lastRunAt: null,
    owner: "财务自动化组",
    department: "财务部",
    tags: ["财务", "对账", "归档"],
    hourlyRuns: bucket([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
    steps: [
      { id: "s1", title: "拉取上月执行日志", actor: "api", status: "pending", next: ["s2"] },
      { id: "s2", title: "ERP 拉取流水", actor: "api", status: "pending", next: ["s3"] },
      { id: "s3", title: "对账匹配", actor: "rpa", status: "pending", next: ["s4"] },
      { id: "s4", title: "生成归档报告", actor: "rpa", status: "pending" },
    ],
  },
  {
    id: "flow_009",
    name: "财务月结跨系统编排",
    description: "每月初自动拉通 ERP 财务数据、银行流水、税务系统，跨 5 个系统完成月结编报与审计留痕",
    platform: "hongji",
    status: "OK",
    schedule: "每月 1 号 06:00",
    scheduleCron: "0 6 1 * *",
    executions24h: 1,
    avgDurationMs: 286_000,
    successRate: 0.98,
    lastRunAt: iso(360),
    owner: "集团财务共享中心",
    department: "财务部",
    tags: ["财务", "月结", "跨系统", "审计"],
    hourlyRuns: bucket([0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
    steps: [
      { id: "s1", title: "ERP 拉取总账与明细", actor: "api", status: "done", durationMs: 12_400, next: ["s2","s3"] },
      { id: "s2", title: "银行流水对账", actor: "api", status: "done", durationMs: 38_000 },
      { id: "s3", title: "税务系统校验", actor: "rpa", status: "done", durationMs: 45_000, next: ["s4"] },
      { id: "s4", title: "合并报表生成", actor: "rpa", status: "done", durationMs: 28_000, next: ["s5"] },
      { id: "s5", title: "审计留痕归档", actor: "api", status: "done", durationMs: 8_400 },
    ],
  },
];

// 状态元数据
export const statusMeta: Record<
  Flow["status"],
  { label: string; tone: "ok" | "warn" | "err" | "info" | "default"; dotClass: string; description: string }
> = {
  OK: { label: "正常", tone: "ok", dotClass: "bg-ok", description: "近期执行成功" },
  FAILING: { label: "失败中", tone: "err", dotClass: "bg-err", description: "最近一次执行失败" },
  SILENT: { label: "静默", tone: "warn", dotClass: "bg-warn", description: "应有执行但未执行" },
  NEVER_RAN: { label: "未运行", tone: "default", dotClass: "bg-fg-subtle", description: "从未执行过" },
  IDLE: { label: "空闲", tone: "info", dotClass: "bg-info", description: "未到调度时间" },
};

// 平台元数据（颜色用于点 / 不抢戏）
export const platformMeta: Record<
  Flow["platform"],
  { name: string; color: string; category: string }
> = {
  yingdao: { name: "影刀", color: "#3B82F6", category: "桌面 RPA" },
  shizai: { name: "实在智能", color: "#A855F7", category: "AI 驱动" },
  bazhuayu: { name: "八爪鱼", color: "#F97316", category: "云端采集" },
  apath: { name: "APath", color: "#10B981", category: "企业编排" },
  hongji: { name: "弘玑 Cyclone", color: "#EC4899", category: "超自动化" },
};

// 24h 内最近执行记录（用于执行列表 tab）
export const executions: Execution[] = [
  {
    id: "exec_001",
    flowId: "flow_003",
    startedAt: iso(14),
    durationMs: 9_800,
    status: "failed",
    errorCode: "api_timeout",
    trace: {
      id: "span_root",
      type: "rpa_step",
      name: "合同智能识别入 OA",
      durationMs: 9_800,
      status: "err",
      children: [
        {
          id: "span_1",
          type: "api_call",
          name: "OSS 上传事件监听",
          durationMs: 120,
          status: "ok",
          children: [
            {
              id: "span_2",
              type: "api_call",
              name: "下载 PDF",
              durationMs: 1_800,
              status: "ok",
              children: [
                {
                  id: "span_3",
                  type: "rpa_step",
                  name: "OCR 提取文本",
                  durationMs: 3_200,
                  status: "ok",
                  children: [
                    {
                      id: "span_4",
                      type: "api_call",
                      name: "TARS 大模型字段抽取",
                      durationMs: 9_800,
                      status: "err",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "exec_002",
    flowId: "flow_001",
    startedAt: iso(8),
    durationMs: 12_400,
    status: "success",
    trace: {
      id: "span_root",
      type: "rpa_step",
      name: "淘宝订单同步到 ERP",
      durationMs: 12_400,
      status: "ok",
      children: [
        {
          id: "span_1",
          type: "rpa_step",
          name: "登录淘宝卖家中心",
          durationMs: 2_100,
          status: "ok",
          children: [
            {
              id: "span_2",
              type: "api_call",
              name: "拉取待发货订单",
              durationMs: 800,
              status: "ok",
              children: [
                {
                  id: "span_3",
                  type: "rpa_step",
                  name: "过滤已同步订单",
                  durationMs: 350,
                  status: "ok",
                  children: [
                    {
                      id: "span_4",
                      type: "api_call",
                      name: "ERP 创建销售单",
                      durationMs: 4_200,
                      status: "ok",
                      children: [
                        {
                          id: "span_5",
                          type: "rpa_step",
                          name: "更新同步标记",
                          durationMs: 280,
                          status: "ok",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "exec_003",
    flowId: "flow_006",
    startedAt: iso(3),
    durationMs: 4_300,
    status: "success",
    trace: {
      id: "span_root",
      type: "rpa_step",
      name: "微博热搜监控",
      durationMs: 4_300,
      status: "ok",
    },
  },
  {
    id: "exec_004",
    flowId: "flow_004",
    startedAt: iso(12),
    durationMs: 6_200,
    status: "success",
    trace: { id: "s", type: "rpa_step", name: "增值税发票自动核验", durationMs: 6_200, status: "ok" },
  },
  {
    id: "exec_005",
    flowId: "flow_007",
    startedAt: iso(45),
    durationMs: 32_000,
    status: "success",
    trace: { id: "s", type: "rpa_step", name: "员工入职跨系统开通", durationMs: 32_000, status: "ok" },
  },
  {
    id: "exec_006",
    flowId: "flow_002",
    startedAt: iso(240),
    durationMs: 48_300,
    status: "success",
    trace: { id: "s", type: "rpa_step", name: "京东售后单自动审核", durationMs: 48_300, status: "ok" },
  },
];

export function getFlowById(id: string) {
  return flows.find((f) => f.id === id);
}
