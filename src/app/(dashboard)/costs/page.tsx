"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { flows, platformMeta } from "@/lib/mock/flows";
import { flowCostRecords, costSuggestions, type CostSuggestion } from "@/lib/mock/agent-detail";
import { fmtNumber, fmtPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Sparkles, Check } from "lucide-react";

const monthlyTrend = [
  { month: "04月", cost: 1463 },
  { month: "05月", cost: 1389 },
  { month: "06月", cost: 1508 },
  { month: "07月", cost: 1641 },
  { month: "08月", cost: 1480 },
];

const platformBreakdown = [
  { id: "yingdao", name: "影刀", license: 5, used: 3, executions: 2976, minutes: 410, cost: 1640, utilization: 0.6 },
  { id: "shizai", name: "实在智能", license: 3, used: 2, executions: 168, minutes: 348, cost: 1290, utilization: 0.67 },
  { id: "bazhuayu", name: "八爪鱼", license: 4, used: 2, executions: 144, minutes: 124, cost: 720, utilization: 0.5 },
  { id: "apath", name: "APath", license: 2, used: 2, executions: 12, minutes: 32, cost: 540, utilization: 1.0 },
  { id: "hongji", name: "弘玑 Cyclone", license: 2, used: 1, executions: 1, minutes: 286, cost: 980, utilization: 0.5 },
];

const kpis = [
  { label: "本月总成本", value: `¥${fmtNumber(1480)}`, delta: "-9.8% 环比", tone: "ok" as const, desc: "对比 7 月 ¥1,641" },
  { label: "许可利用率", value: fmtPercent(0.65, 0), delta: "8 个 / 14 个", tone: "info" as const, desc: "6 个许可位闲置" },
  { label: "AI 预计可节省", value: `¥${fmtNumber(1700)}`, delta: "4 条建议待处理", tone: "warn" as const, desc: "占月度成本 115%" },
  { label: "执行成本趋势", value: "下降", delta: "连续 2 月", tone: "ok" as const, desc: "采纳 AI 建议后" },
];

export default function CostsPage() {
  const totalCost = monthlyTrend.reduce((a, m) => a + m.cost, 0);
  const maxCost = Math.max(...monthlyTrend.map((m) => m.cost));
  const minCost = Math.min(...monthlyTrend.map((m) => m.cost));

  const [suggestions, setSuggestions] = useState<CostSuggestion[]>(costSuggestions);
  const totalSaving = suggestions.reduce((a, s) => a + s.saving, 0);
  const pendingCount = suggestions.filter((s) => s.status === "pending").length;
  const applySuggestion = (id: string) =>
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "applied" } : s)));

  // 业务线归类：基于流程标签
  const lineOf = (tags: string[]) => {
    if (tags.includes("电商") || tags.includes("订单") || tags.includes("售后")) return "电商交易";
    if (tags.includes("财务") || tags.includes("发票")) return "财务自动化";
    if (tags.includes("法务") || tags.includes("IDP")) return "文档智能";
    if (tags.some((t) => ["采集", "舆情", "竞品", "预警"].includes(t))) return "市场情报";
    if (tags.includes("HR") || tags.includes("跨系统")) return "IT 与人事";
    return "其他";
  };

  const enrich = flows.map((f, i) => ({ f, c: flowCostRecords[i % flowCostRecords.length] }));
  const group = (key: (f: (typeof enrich)[number]["f"]) => string) => {
    const map = new Map<string, { count: number; executions: number; minutes: number; cost: number; rates: number[] }>();
    enrich.forEach(({ f, c }) => {
      const k = key(f);
      const row = map.get(k) ?? { count: 0, executions: 0, minutes: 0, cost: 0, rates: [] };
      row.count += 1;
      row.executions += c.executions;
      row.minutes += c.executionMinutes;
      row.cost += c.total;
      row.rates.push(f.successRate);
      map.set(k, row);
    });
    return [...map.entries()]
      .map(([name, v]) => ({
        name,
        ...v,
        avgRate: v.rates.reduce((a, b) => a + b, 0) / v.rates.length,
      }))
      .sort((a, b) => b.cost - a.cost);
  };
  const deptRows = group((f) => f.department);
  const lineRows = group((f) => lineOf(f.tags));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-[18px] font-semibold tracking-tight">成本控制</h2>
        <p className="mt-0.5 text-[13px] text-fg-muted">
          M5 跨平台成本核算 · 运行时长(分钟) + 执行次数 + 许可费 · 货币单位 ¥ (RMB)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpis.map((k) => {
          const DeltaIcon = k.tone === "ok" ? ArrowDownRight : k.tone === "warn" ? ArrowUpRight : null;
          const deltaColor =
            k.tone === "ok" ? "text-ok" : k.tone === "warn" ? "text-warn" : k.tone === "info" ? "text-info" : "text-fg-muted";
          return (
            <Card key={k.label} className="p-4">
              <span className="text-[12px] font-medium text-fg-muted">{k.label}</span>
              <div className="mt-2 text-[24px] font-bold tracking-tight tabular text-fg">{k.value}</div>
              <div className={cn("mt-1 flex items-center gap-0.5 text-[11px] font-medium", deltaColor)}>
                {DeltaIcon && <DeltaIcon className="h-3 w-3" strokeWidth={2} />}
                <span>{k.delta}</span>
                <span className="ml-1 text-fg-subtle">· {k.desc}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-fg">月度成本趋势</h3>
            <span className="text-[12px] text-fg-muted">近 5 个月总成本（含许可费）</span>
          </div>
          <Badge variant="outline" className="text-mono">
            合计 ¥{fmtNumber(totalCost)}
          </Badge>
        </div>
        <div className="mt-4 flex h-[120px] items-end gap-2">
          {monthlyTrend.map((m) => {
            const heightPct = (m.cost / maxCost) * 100;
            const isCurrent = m.month === "08月";
            return (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-mono text-[10px] tabular text-fg-muted">¥{m.cost}</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={cn(
                      "w-full rounded-t-[4px]",
                      isCurrent ? "bg-primary" : "bg-primary/30"
                    )}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[11px] text-fg-subtle">{m.month}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Tabs defaultValue="platform">
        <TabsList>
          <TabsTrigger value="platform">按平台</TabsTrigger>
          <TabsTrigger value="flow">按流程</TabsTrigger>
          <TabsTrigger value="dept">按部门</TabsTrigger>
          <TabsTrigger value="line">按业务线</TabsTrigger>
        </TabsList>

        <TabsContent value="platform">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RPA 平台</TableHead>
                  <TableHead className="w-[110px] text-right">许可位</TableHead>
                  <TableHead className="w-[120px] text-right">24h 执行</TableHead>
                  <TableHead className="w-[100px] text-right">运行时长</TableHead>
                  <TableHead className="w-[120px] text-right">利用率</TableHead>
                  <TableHead className="w-[110px] text-right">月度成本</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {platformBreakdown.map((p) => {
                  const meta = platformMeta[p.id as keyof typeof platformMeta];
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-[13px] font-medium text-fg">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                          {p.name}
                          <span className="text-[11px] font-normal text-fg-subtle">· {meta.category}</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">
                        {p.used} / {p.license}
                      </TableCell>
                      <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">{fmtNumber(p.executions)}</TableCell>
                      <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">{p.minutes} min</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-bg">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                p.utilization >= 0.8 ? "bg-ok" : p.utilization >= 0.5 ? "bg-warn" : "bg-err"
                              )}
                              style={{ width: `${p.utilization * 100}%` }}
                            />
                          </div>
                          <span className="text-mono tabular text-[11px] text-fg-muted">{fmtPercent(p.utilization, 0)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-mono tabular text-[12px] font-medium text-fg">¥{fmtNumber(p.cost)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="flow">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>流程</TableHead>
                  <TableHead className="w-[120px]">平台</TableHead>
                  <TableHead className="w-[100px] text-right">执行次数</TableHead>
                  <TableHead className="w-[100px] text-right">运行时长</TableHead>
                  <TableHead className="w-[110px] text-right">月度成本</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flows.map((f, i) => {
                  const p = platformMeta[f.platform];
                  const c = flowCostRecords[i % flowCostRecords.length];
                  return (
                    <TableRow key={f.id}>
                      <TableCell>
                        <div className="flex flex-col leading-tight">
                          <span className="text-[13px] font-medium text-fg">{f.name}</span>
                          <span className="line-clamp-1 text-[11px] text-fg-subtle">{f.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-[12px] text-fg-muted">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                          {p.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">{fmtNumber(c.executions)}</TableCell>
                      <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">{c.executionMinutes} min</TableCell>
                      <TableCell className="text-right text-mono tabular text-[12px] font-medium text-fg">¥{fmtNumber(Math.round(c.total))}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="dept">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>部门</TableHead>
                  <TableHead className="w-[90px] text-right">流程数</TableHead>
                  <TableHead className="w-[120px] text-right">执行次数</TableHead>
                  <TableHead className="w-[100px] text-right">运行时长</TableHead>
                  <TableHead className="w-[110px] text-right">平均成功率</TableHead>
                  <TableHead className="w-[110px] text-right">月度成本</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deptRows.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell className="text-[13px] font-medium text-fg">{r.name}</TableCell>
                    <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">{r.count}</TableCell>
                    <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">{fmtNumber(r.executions)}</TableCell>
                    <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">{r.minutes} min</TableCell>
                    <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">{fmtPercent(r.avgRate, 1)}</TableCell>
                    <TableCell className="text-right text-mono tabular text-[12px] font-medium text-fg">¥{fmtNumber(Math.round(r.cost))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="line">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>业务线</TableHead>
                  <TableHead className="w-[90px] text-right">流程数</TableHead>
                  <TableHead className="w-[120px] text-right">执行次数</TableHead>
                  <TableHead className="w-[100px] text-right">运行时长</TableHead>
                  <TableHead className="w-[110px] text-right">平均成功率</TableHead>
                  <TableHead className="w-[110px] text-right">月度成本</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineRows.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell className="text-[13px] font-medium text-fg">{r.name}</TableCell>
                    <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">{r.count}</TableCell>
                    <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">{fmtNumber(r.executions)}</TableCell>
                    <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">{r.minutes} min</TableCell>
                    <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">{fmtPercent(r.avgRate, 1)}</TableCell>
                    <TableCell className="text-right text-mono tabular text-[12px] font-medium text-fg">¥{fmtNumber(Math.round(r.cost))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI 优化建议 — 差异化亮点 */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-fg">AI 成本优化建议</h3>
              <span className="text-[12px] text-fg-muted">
                基于近 30 天执行数据 · 累计可节省 ¥{fmtNumber(totalSaving)}/月
              </span>
            </div>
          </div>
          <Badge variant="warn">{pendingCount} 待处理</Badge>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col gap-2">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className={cn(
                "flex items-start gap-3 rounded-[10px] border p-3",
                s.status === "applied" ? "border-ok/30 bg-ok/5" : "border-border bg-bg/40"
              )}
            >
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-fg">{s.title}</span>
                  {s.status === "applied" && (
                    <Badge variant="ok" className="gap-0.5">
                      <Check className="h-3 w-3" /> 已采纳
                    </Badge>
                  )}
                </div>
                <span className="text-[12px] text-fg-muted">{s.reason}</span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="text-mono text-[16px] font-semibold tabular text-ok">+¥{s.saving}/月</span>
                {s.status === "pending" && (
                  <Button size="sm" variant="outline" onClick={() => applySuggestion(s.id)}>
                    {s.action}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
