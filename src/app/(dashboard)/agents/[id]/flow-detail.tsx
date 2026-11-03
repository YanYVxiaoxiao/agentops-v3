"use client";
import { useState } from "react";
import { notFound } from "next/navigation";
import { getFlowById, statusMeta, platformMeta } from "@/lib/mock/flows";
import { flowVersions, flowExecutionRecords, flowCostRecords } from "@/lib/mock/agent-detail";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { fmtDuration, fmtRelative, fmtNumber, fmtPercent, fmtTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowLeft, Bot, Plug, Play, GitBranch, Clock, CircleDollarSign, Loader, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function FlowDetailPage({ id }: { id: string }) {
  const flow = getFlowById(id);
  const [tab, setTab] = useState("overview");
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<string | null>(null);
  if (!flow) notFound();

  const handleRun = () => {
    if (running) return;
    setRunning(true);
    setRunResult(null);
    setTimeout(() => {
      setRunning(false);
      setRunResult("执行成功 · 耗时 11.8s · 新增 1 条执行记录");
    }, 1400);
  };

  const s = statusMeta[flow.status];
  const p = platformMeta[flow.platform];
  const versions = flowVersions[flow.id] ?? [];
  const cost = flowCostRecords;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-[12px] text-fg-subtle">
        <Link href="/agents" prefetch={false} className="hover:text-fg">流程管理</Link>
        <span>/</span>
        <span className="text-fg-muted">{flow.id}</span>
      </div>

      {/* Header — Description-first */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-semibold tracking-tight text-fg">{flow.name}</h1>
            <Badge variant={s.tone}>{s.label}</Badge>
          </div>
          <p className="max-w-2xl text-[13px] text-fg-muted">{flow.description}</p>
          <div className="mt-1 flex items-center gap-3 text-[12px] text-fg-subtle">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name} · {p.category}
            </span>
            <span>·</span>
            <span>负责人：{flow.owner}</span>
            <span>·</span>
            <span>部门：{flow.department}</span>
            <span>·</span>
            <span>调度：{flow.schedule}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="default" onClick={() => setTab("versions")}>
            <GitBranch className="h-3.5 w-3.5" /> 版本管理
          </Button>
          <Button size="default" onClick={handleRun} disabled={running}>
            {running ? (
              <Loader className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            {running ? "执行中…" : "立即执行"}
          </Button>
        </div>
      </div>

      {runResult && (
        <div className="flex items-center gap-2 rounded-[8px] border border-ok/30 bg-ok/8 px-3 py-2 text-[12px] text-ok">
          <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.8} />
          {runResult}
          <button
            onClick={() => setTab("executions")}
            className="ml-1 underline underline-offset-2 hover:opacity-80"
          >
            查看执行记录
          </button>
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="versions">版本历史</TabsTrigger>
          <TabsTrigger value="executions">执行记录</TabsTrigger>
          <TabsTrigger value="cost">成本</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <Card className="p-4">
              <div className="flex items-center justify-between text-[12px] text-fg-muted">
                <span>24h 执行次数</span>
                <Clock className="h-3.5 w-3.5 text-fg-subtle" strokeWidth={1.5} />
              </div>
              <div className="mt-2 text-[24px] font-bold tabular text-fg">{fmtNumber(flow.executions24h)}</div>
              <div className="mt-1 text-[11px] text-fg-subtle">成功率 {fmtPercent(flow.successRate)}</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between text-[12px] text-fg-muted">
                <span>平均耗时</span>
                <Clock className="h-3.5 w-3.5 text-fg-subtle" strokeWidth={1.5} />
              </div>
              <div className="mt-2 text-[24px] font-bold tabular text-fg">{fmtDuration(flow.avgDurationMs)}</div>
              <div className="mt-1 text-[11px] text-fg-subtle">最后运行 {fmtRelative(flow.lastRunAt)}</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between text-[12px] text-fg-muted">
                <span>本月成本</span>
                <CircleDollarSign className="h-3.5 w-3.5 text-fg-subtle" strokeWidth={1.5} />
              </div>
              <div className="mt-2 text-[24px] font-bold tabular text-fg">¥{fmtNumber(Math.round(cost[0]?.total ?? 0))}</div>
              <div className="mt-1 text-[11px] text-fg-subtle">{cost[0]?.executionMinutes ?? 0} 分钟 · {cost[0]?.executions ?? 0} 次</div>
            </Card>

            <Card className="p-4 lg:col-span-3">
              <h3 className="text-[14px] font-semibold text-fg">流程步骤（{flow.steps.length} 步）</h3>
              <ol className="mt-3 flex flex-col gap-0">
                {flow.steps.map((step, i) => {
                  const isLast = i === flow.steps.length - 1;
                  const Icon = step.actor === "rpa" ? Bot : step.actor === "api" ? Plug : Bot;
                  return (
                    <li key={step.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-border bg-bg">
                          <Icon className="h-3.5 w-3.5 text-fg-muted" strokeWidth={1.5} />
                        </div>
                        {!isLast && <div className="my-1 w-[0.8px] flex-1 bg-border" />}
                      </div>
                      <div className="flex flex-1 flex-col gap-0.5 pb-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-medium text-fg">{step.title}</span>
                          {step.durationMs != null && (
                            <span className="text-mono text-[11px] tabular text-fg-muted">{fmtDuration(step.durationMs)}</span>
                          )}
                        </div>
                        <span className="text-[11px] text-fg-subtle">
                          {step.actor === "rpa" ? "RPA 步骤" : step.actor === "api" ? "API 调用" : "人工"}
                          {step.next && step.next.length > 1 && ` · 并行触发 ${step.next.length} 个下游`}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="versions">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[110px]">版本</TableHead>
                  <TableHead className="w-[120px]">发布时间</TableHead>
                  <TableHead className="w-[100px]">作者</TableHead>
                  <TableHead>变更内容</TableHead>
                  <TableHead className="w-[80px]">状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((v) => (
                  <TableRow key={v.version}>
                    <TableCell className="text-mono text-[12px] text-fg">{v.version}</TableCell>
                    <TableCell className="text-mono text-[12px] text-fg-muted">{v.releasedAt}</TableCell>
                    <TableCell className="text-[12px] text-fg-muted">{v.author}</TableCell>
                    <TableCell className="text-[13px] text-fg">{v.changes}</TableCell>
                    <TableCell>
                      {v.active ? <Badge variant="ok">当前</Badge> : <Badge variant="outline">历史</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="executions">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[110px]">执行 ID</TableHead>
                  <TableHead className="w-[120px]">开始时间</TableHead>
                  <TableHead className="w-[100px] text-right">耗时</TableHead>
                  <TableHead className="w-[80px]">触发</TableHead>
                  <TableHead className="w-[90px]">状态</TableHead>
                  <TableHead className="w-[120px]">错误</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flowExecutionRecords.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-mono text-[12px] text-fg-muted">{e.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col leading-tight">
                        <span className="text-mono text-[12px] text-fg">{fmtTime(e.startedAt)}</span>
                        <span className="text-[11px] text-fg-subtle">{fmtRelative(e.startedAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-mono tabular text-[12px] text-fg">{fmtDuration(e.durationMs)}</TableCell>
                    <TableCell className="text-[12px] text-fg-muted">
                      {e.trigger === "schedule" ? "定时" : e.trigger === "manual" ? "手动" : "事件"}
                    </TableCell>
                    <TableCell>
                      {e.status === "success" && <Badge variant="ok">成功</Badge>}
                      {e.status === "failed" && <Badge variant="err">失败</Badge>}
                      {e.status === "running" && <Badge variant="info">运行中</Badge>}
                    </TableCell>
                    <TableCell>
                      {e.errorCode ? (
                        <span className="text-[12px] text-err">
                          {e.errorCode === "platform_disconnect" ? "平台断连" : e.errorCode === "api_timeout" ? "API 超时" : "流程错误"}
                        </span>
                      ) : (
                        <span className="text-[12px] text-fg-subtle">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="cost">
          <div className="flex flex-col gap-3">
            <Card className="p-4">
              <h3 className="text-[14px] font-semibold text-fg">本月成本拆解</h3>
              <div className="mt-3 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[11px] text-fg-subtle">运行时长</div>
                  <div className="text-mono text-[18px] font-semibold tabular text-fg">
                    ¥{fmtNumber(Math.round((cost[0]?.executionMinutes ?? 0) * 0.4))}
                  </div>
                  <div className="text-[11px] text-fg-subtle">{cost[0]?.executionMinutes ?? 0} 分钟 × ¥0.4</div>
                </div>
                <div>
                  <div className="text-[11px] text-fg-subtle">执行次数</div>
                  <div className="text-mono text-[18px] font-semibold tabular text-fg">
                    ¥{fmtNumber(Math.round((cost[0]?.executions ?? 0) * 0.02))}
                  </div>
                  <div className="text-[11px] text-fg-subtle">{fmtNumber(cost[0]?.executions ?? 0)} 次 × ¥0.02</div>
                </div>
                <div>
                  <div className="text-[11px] text-fg-subtle">许可位</div>
                  <div className="text-mono text-[18px] font-semibold tabular text-fg">¥{fmtNumber(cost[0]?.licenseFee ?? 0)}</div>
                  <div className="text-[11px] text-fg-subtle">月度固定</div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">月份</TableHead>
                    <TableHead className="w-[120px] text-right">运行时长</TableHead>
                    <TableHead className="w-[120px] text-right">执行次数</TableHead>
                    <TableHead className="w-[100px] text-right">许可费</TableHead>
                    <TableHead className="w-[120px] text-right">总成本</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cost.map((c) => (
                    <TableRow key={c.month}>
                      <TableCell className="text-mono text-[12px] text-fg">{c.month}</TableCell>
                      <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">{c.executionMinutes} min</TableCell>
                      <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">{fmtNumber(c.executions)}</TableCell>
                      <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">¥{c.licenseFee}</TableCell>
                      <TableCell className="text-right text-mono tabular text-[12px] font-medium text-fg">¥{fmtNumber(Math.round(c.total))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
