import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Workflow, CircleDollarSign, ShieldCheck, Sparkles } from "lucide-react";

const modules = [
  { href: "/monitoring", label: "M2 监控追踪", desc: "Health grid · 24h Gantt · 调用链", Icon: Activity, accent: "ok" },
  { href: "/agents", label: "M1 流程管理", desc: "跨平台接入与版本管理", Icon: Workflow, accent: "info" },
  { href: "/costs", label: "M5 成本控制", desc: "运行时长核算 + AI 优化建议", Icon: CircleDollarSign, accent: "warn" },
  { href: "/security", label: "M3 权限隔离", desc: "API Key + 审计日志 + 异常检测", Icon: ShieldCheck, accent: "err" },
  { href: "/ai-cockpit", label: "AI 决策痕迹", desc: "四模块 AI 增强点单页汇总", Icon: Sparkles, accent: "accent" },
];

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[18px] font-semibold tracking-tight">总览</h2>
        <p className="mt-0.5 text-[13px] text-fg-muted">
          一个面板管理影刀、实在智能、八爪鱼、APath、弘玑 五个 RPA 平台下的所有流程，并在每个运维决策点嵌入 AI 建议
        </p>
      </div>

      {/* Hero Card with gradient */}
      <Card className="gradient-hero relative overflow-hidden border-border p-7 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent/8 blur-3xl" />
        <div className="relative flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-accent">
            AgentOps v3
          </span>
          <h1 className="text-[26px] font-bold tracking-tight">RPA 流程统一运维管理平台</h1>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-fg-muted">
            给传统 RPA 加一层 AI 决策——跨影刀、实在智能等五个平台，统一做接入建议、根因分析、成本优化与异常检测。每条建议可追溯、可采纳、可驳回。
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Button asChild size="default" className="bg-accent text-accent-fg hover:bg-accent/90">
              <Link href="/ai-cockpit" prefetch={false}>
                查看 AI 决策痕迹 <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/monitoring" prefetch={false}>进入监控追踪</Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* Module cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => {
          const Icon = m.Icon;
          return (
            <Link key={m.href} href={m.href} prefetch={false}>
              <Card className="group flex h-full flex-col gap-2 p-4 transition-all duration-150 hover:-translate-y-px hover:border-border-strong hover:shadow-hover">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-surface border border-border">
                    <Icon className="h-4 w-4 text-accent transition-transform group-hover:scale-110" strokeWidth={1.5} />
                  </div>
                  <span className="text-[13px] font-semibold text-fg">{m.label}</span>
                  <ArrowRight className="ml-auto h-3.5 w-3.5 text-fg-subtle opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" strokeWidth={1.5} />
                </div>
                <span className="text-[12px] text-fg-muted">{m.desc}</span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
