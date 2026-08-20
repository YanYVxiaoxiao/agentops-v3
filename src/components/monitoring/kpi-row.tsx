import { Card } from "@/components/ui/card";
import { fmtNumber, fmtDuration, fmtPercent } from "@/lib/format";
import { flows } from "@/lib/mock/flows";
import { ArrowUpRight, ArrowDownRight, Activity, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const kpis = [
  {
    label: "在管流程",
    value: fmtNumber(flows.length),
    delta: "+2 本周",
    deltaTone: "ok" as const,
    desc: "覆盖 5 个 RPA 平台",
    Icon: Activity,
  },
  {
    label: "24h 执行次数",
    value: fmtNumber(flows.reduce((a, f) => a + f.executions24h, 0)),
    delta: "+12.4%",
    deltaTone: "ok" as const,
    desc: "对比上周平均",
    Icon: Clock,
  },
  {
    label: "平均耗时",
    value: fmtDuration(
      flows.filter((f) => f.avgDurationMs > 0).reduce((a, f) => a + f.avgDurationMs, 0) /
        flows.filter((f) => f.avgDurationMs > 0).length
    ),
    delta: "-8.2%",
    deltaTone: "ok" as const,
    desc: "对比上周",
    Icon: Clock,
  },
  {
    label: "成功率",
    value: fmtPercent(
      flows.filter((f) => f.executions24h > 0).reduce((a, f) => a + f.successRate * f.executions24h, 0) /
        flows.filter((f) => f.executions24h > 0).reduce((a, f) => a + f.executions24h, 0)
    ),
    delta: "-3.1%",
    deltaTone: "warn" as const,
    desc: "受 flow_003 拖累",
    Icon: CheckCircle2,
  },
  {
    label: "异常流程",
    value: fmtNumber(flows.filter((f) => f.status === "FAILING" || f.status === "SILENT").length),
    delta: "需处理",
    deltaTone: "err" as const,
    desc: "1 失败 · 1 静默",
    Icon: AlertTriangle,
  },
];

export function KpiRow() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {kpis.map((k) => {
        const Icon = k.Icon;
        const deltaColor =
          k.deltaTone === "ok"
            ? "text-ok"
            : k.deltaTone === "warn"
              ? "text-warn"
              : k.deltaTone === "err"
                ? "text-err"
                : "text-fg-muted";
        const DeltaIcon = k.deltaTone === "ok" ? ArrowUpRight : ArrowDownRight;
        return (
          <Card key={k.label} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-fg-muted">{k.label}</span>
              <Icon className="h-3.5 w-3.5 text-fg-subtle" strokeWidth={1.5} />
            </div>
            <div className="mt-2 text-[24px] font-bold tracking-tight tabular text-fg">
              {k.value}
            </div>
            <div className={cn("mt-1 flex items-center gap-0.5 text-[11px] font-medium", deltaColor)}>
              {k.deltaTone === "ok" && <DeltaIcon className="h-3 w-3" strokeWidth={2} />}
              <span>{k.delta}</span>
              <span className="ml-1 text-fg-subtle">· {k.desc}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
