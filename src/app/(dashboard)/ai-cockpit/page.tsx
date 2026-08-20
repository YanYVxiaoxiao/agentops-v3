import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { fmtNumber, fmtPercent } from "@/lib/format";
import { SuggestionItem } from "@/components/ai-cockpit/suggestion-item";
import { CoverageBoundary } from "@/components/ai-cockpit/coverage-boundary";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sparkles, Workflow, Activity, CircleDollarSign, ShieldCheck, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

const quadrants = [
  {
    href: "/agents",
    Icon: Workflow,
    tone: "info" as const,
    label: "M1 流程接入 · AI 平台建议",
    metric: "92%",
    metricLabel: "平台适配命中率",
    sub: "口径：近 8 次接入中，AI 推荐适配器与人工选择一致 8 次（演示数据）",
    items: [
      { text: "flow_007 推荐复用 APath 跨系统编排 adapter", tone: "ok" as const },
      { text: "flow_008 推荐许可位复用而非新建", tone: "ok" as const },
      { text: "flow_003 标签提取「法务」「IDP」「AI」", tone: "ok" as const },
    ],
  },
  {
    href: "/monitoring",
    Icon: Activity,
    tone: "err" as const,
    label: "M2 根因分析 · AI 命中率",
    metric: "3 / 4",
    metricLabel: "异常根因命中",
    sub: "1 次未命中（TARS 模型 API 偶发 503）",
    footnote: "口径：近 4 次异常中 3 次与人工复盘结论一致；1 次未命中为上游 503（演示数据）",
    items: [
      { text: "flow_003 API 超时 → 推断为「平台层问题」", tone: "ok" as const },
      { text: "flow_005 静默 → 推断为「调度器未触发」", tone: "ok" as const },
      { text: "flow_001 失败 → 推断为「ERP 字段映射错误」（实际：库存不足）", tone: "warn" as const },
    ],
  },
  {
    href: "/costs",
    Icon: CircleDollarSign,
    tone: "ok" as const,
    label: "M5 成本优化 · 采纳率与节省",
    metric: "¥1,920",
    metricLabel: "累计节省 / 月",
    sub: "采纳 1 条 · 待处理 4 条 · 采纳率 25%",
    items: [
      { text: "已采纳：flow_003 失败重试策略（指数退避）", tone: "ok" as const, delta: "节省 ¥180/月" },
      { text: "待处理：下线 flow_008 闲置许可", tone: "warn" as const, delta: "可节省 ¥240/月" },
      { text: "待处理：影刀许可 5→3 回收", tone: "warn" as const, delta: "可节省 ¥800/月" },
    ],
  },
  {
    href: "/security",
    Icon: ShieldCheck,
    tone: "warn" as const,
    label: "M3 异常检测 · 告警统计",
    metric: "3",
    metricLabel: "近 7 天告警",
    sub: "1 已处理 · 2 待处理 · 0 误报",
    footnote: "口径：近 7 天告警 3 条，人工标注误报 0 条（演示数据）",
    items: [
      { text: "高危：key_002 5 分钟内调用 TARS 47 次", tone: "err" as const },
      { text: "中危：王五 非工作时间导出 482 条发票", tone: "warn" as const },
      { text: "已处理：外部 IP 2FA 爆破已自动封禁", tone: "ok" as const },
    ],
  },
];

export default function AiCockpitPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="text-[18px] font-semibold tracking-tight">AI 决策痕迹汇总</h2>
        </div>
        <p className="mt-1 text-[13px] text-fg-muted">
          单页聚合 M1 / M2 / M3 / M5 四个模块的 AI 增强点 · 每条建议可追溯、可量化、可采纳
        </p>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
              AI 价值总览
            </span>
            <span className="text-[20px] font-bold tracking-tight text-fg">
              月度净价值 <span className="text-ok">+¥2,100</span>
            </span>
            <span className="text-[12px] text-fg-muted">
              累计节省 ¥1,920 + 避免故障损失 ¥180（基于 M2 根因分析缩短 MTTR）；ROI =（节省工时 + 避免损失 − 调用成本）/ 调用成本（演示数据）
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="ok" className="gap-0.5">
                <TrendingUp className="h-3 w-3" /> ROI 14x
              </Badge>
              <Badge variant="outline">AI 决策点 · 16 个</Badge>
            </div>
            <span className="text-[12px] text-fg-subtle">本月建议 16 条 · 采纳 11 · 驳回 3 · 待处理 2</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {quadrants.map((q) => {
          const Icon = q.Icon;
          return (
            <Card key={q.href} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-[8px]", `bg-${q.tone}/10`)}>
                    <Icon className={cn("h-4 w-4", `text-${q.tone}`)} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[13px] font-semibold text-fg">{q.label}</span>
                    <span className="text-[11px] text-fg-subtle">{q.metricLabel}</span>
                  </div>
                </div>
                <span className={cn("text-mono text-[28px] font-bold tabular leading-none", `text-${q.tone}`)}>
                  {q.metric}
                </span>
              </div>

              <span className="mt-2 text-[12px] text-fg-muted">{q.sub}</span>
              {"footnote" in q && q.footnote && (
                <span className="mt-1 text-[11px] text-fg-subtle">{q.footnote}</span>
              )}

              <Separator className="my-3" />

              <div className="flex flex-1 flex-col gap-2">
                {q.items.map((item, i) => (
                  <SuggestionItem
                    key={i}
                    text={item.text}
                    tone={item.tone}
                    delta={"delta" in item && item.delta ? item.delta : undefined}
                  />
                ))}
              </div>

              <Button variant="outline" size="sm" asChild className="mt-3 self-start">
                <Link href={q.href} prefetch={false}>
                  查看详情 <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </Card>
          );
        })}
      </div>

      <CoverageBoundary />

      <Card className="p-5">
        <h3 className="text-[14px] font-semibold text-fg">AI 如何嵌入运维决策</h3>
        <p className="mt-1 text-[13px] text-fg-muted">
          AI 不是噱头，而是嵌进每个运维决策点：接入建议（M1）、根因分析（M2）、成本优化（M5）、异常检测（M3）。
          每条 AI 决策都有可追溯的痕迹、可量化的命中/采纳率、可计算的节省金额，人始终保留最终采纳权。
        </p>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-fg-subtle">
          <TrendingDown className="h-3 w-3 text-ok" />
          <span>MTTR 从 18 分钟降至 6 分钟（M2 根因分析）· 口径：近 30 天演示数据</span>
          <span>·</span>
          <TrendingDown className="h-3 w-3 text-ok" />
          <span>月度成本从 ¥1,641 降至 ¥1,480（M5 优化建议）· 口径：近 30 天演示数据</span>
        </div>
      </Card>
    </div>
  );
}
