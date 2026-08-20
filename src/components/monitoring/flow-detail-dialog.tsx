"use client";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  Position,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Flow, FlowStep } from "@/lib/types";
import { platformMeta, statusMeta } from "@/lib/mock/flows";
import { fmtDuration, fmtRelative, fmtNumber, fmtPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Bot,
  Plug,
  User,
  Check,
  Loader,
  Circle,
  AlertCircle,
} from "lucide-react";

const actorMeta = {
  rpa: { label: "RPA", Icon: Bot, color: "text-info" },
  api: { label: "API", Icon: Plug, color: "text-ok" },
  human: { label: "人工", Icon: User, color: "text-warn" },
} as const;

const statusIcon = {
  done: { Icon: Check, color: "text-ok" },
  running: { Icon: Loader, color: "text-info" },
  pending: { Icon: Circle, color: "text-fg-subtle" },
  failed: { Icon: AlertCircle, color: "text-err" },
} as const;

function StepperView({ steps }: { steps: FlowStep[] }) {
  return (
    <ol className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const a = actorMeta[step.actor];
        const s = statusIcon[step.status];
        const ActorIcon = a.Icon;
        const StatusIcon = s.Icon;
        const isLast = i === steps.length - 1;
        return (
          <li key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] border border-border bg-bg",
                  step.status === "failed" && "border-err/40 bg-err/8"
                )}
              >
                <ActorIcon className={cn("h-3.5 w-3.5", a.color)} strokeWidth={1.5} />
              </div>
              {!isLast && <div className="my-1 w-[0.8px] flex-1 bg-border" />}
            </div>
            <div className={cn("flex flex-1 flex-col gap-0.5 pb-4")}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-medium text-fg">{step.title}</span>
                {step.durationMs != null && (
                  <span className="text-mono text-[11px] tabular text-fg-muted">
                    {fmtDuration(step.durationMs)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("flex items-center gap-1 text-[11px]", s.color)}>
                  <StatusIcon className="h-3 w-3" strokeWidth={1.5} />
                  {step.status === "done" && "已完成"}
                  {step.status === "running" && "执行中"}
                  {step.status === "pending" && "待执行"}
                  {step.status === "failed" && "失败"}
                </span>
                <span className="text-[11px] text-fg-subtle">·</span>
                <span className={cn("text-[11px]", a.color)}>{a.label}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function KanbanView({ steps }: { steps: FlowStep[] }) {
  const columns = [
    { id: "pending", label: "待执行", tone: "default" as const },
    { id: "running", label: "执行中", tone: "info" as const },
    { id: "done", label: "已完成", tone: "ok" as const },
    { id: "failed", label: "失败", tone: "err" as const },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {columns.map((col) => {
        const items = steps.filter((s) => s.status === col.id);
        return (
          <div key={col.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between rounded-[8px] bg-bg px-2.5 py-1.5">
              <span className="text-[11px] font-medium text-fg-muted">{col.label}</span>
              <Badge variant={col.tone} className="px-1">
                {items.length}
              </Badge>
            </div>
            <div className="flex flex-col gap-1.5">
              {items.length === 0 ? (
                <div className="rounded-[8px] border border-dashed border-border py-6 text-center text-[11px] text-fg-subtle">
                  空
                </div>
              ) : (
                items.map((s) => {
                  const a = actorMeta[s.actor];
                  const ActorIcon = a.Icon;
                  return (
                    <div
                      key={s.id}
                      className="rounded-[8px] border border-border bg-surface p-2.5"
                    >
                      <div className="flex items-center gap-1.5">
                        <ActorIcon className={cn("h-3 w-3", a.color)} strokeWidth={1.5} />
                        <span className="text-[10px] text-fg-muted">{a.label}</span>
                      </div>
                      <div className="mt-1 text-[12px] font-medium leading-tight text-fg">
                        {s.title}
                      </div>
                      {s.durationMs != null && (
                        <div className="mt-1 text-mono text-[10px] tabular text-fg-subtle">
                          {fmtDuration(s.durationMs)}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StepNode({ data }: { data: { label: string; actor: FlowStep["actor"]; status: FlowStep["status"]; duration?: number } }) {
  const a = actorMeta[data.actor];
  const ActorIcon = a.Icon;
  return (
    <div
      className={cn(
        "flex min-w-[160px] items-center gap-2 rounded-[8px] border bg-surface px-3 py-2",
        data.status === "failed" ? "border-err/60" : "border-border"
      )}
    >
      <Handle type="target" position={Position.Left} className="!h-1.5 !w-1.5 !bg-border" />
      <ActorIcon className={cn("h-3.5 w-3.5", a.color)} strokeWidth={1.5} />
      <div className="flex flex-1 flex-col leading-tight">
        <span className="text-[12px] font-medium text-fg">{data.label}</span>
        {data.duration != null && (
          <span className="text-mono text-[10px] tabular text-fg-subtle">
            {fmtDuration(data.duration)}
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!h-1.5 !w-1.5 !bg-border" />
    </div>
  );
}

function DagView({ steps }: { steps: FlowStep[] }) {
  const nodes: Node[] = useMemo(() => {
    // 简单层级布局：按 steps 顺序横向排列
    return steps.map((s, i) => ({
      id: s.id,
      type: "step",
      position: { x: i * 220, y: 0 },
      data: { label: s.title, actor: s.actor, status: s.status, duration: s.durationMs },
    }));
  }, [steps]);

  const edges: Edge[] = useMemo(() => {
    const out: Edge[] = [];
    steps.forEach((s) => {
      s.next?.forEach((target) => {
        out.push({
          id: `${s.id}-${target}`,
          source: s.id,
          target,
          className: "stroke-border",
          style: { stroke: "var(--color-border)", strokeWidth: 0.8 },
        });
      });
    });
    return out;
  }, [steps]);

  const nodeTypes = useMemo(() => ({ step: StepNode }), []);

  return (
    <div className="h-[320px] w-full rounded-[10px] border border-border bg-bg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnDrag
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--color-border)" gap={16} size={1} />
        <Controls showInteractive={false} className="!border-border !bg-surface" />
      </ReactFlow>
    </div>
  );
}

export function FlowDetailDialog({
  flow,
  onOpenChange,
}: {
  flow: Flow | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [tab, setTab] = useState("stepper");
  const p = flow ? platformMeta[flow.platform] : null;
  const s = flow ? statusMeta[flow.status] : null;

  return (
    <Dialog open={!!flow} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 p-0">
        {flow && p && s && (
          <>
            {/* Header 区 — Description-first 原则 */}
            <DialogHeader className="border-b border-border p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <DialogTitle className="text-[16px]">{flow.name}</DialogTitle>
                  <DialogDescription className="text-[13px] text-fg-muted">
                    {flow.description}
                  </DialogDescription>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <Badge variant={s.tone}>{s.label}</Badge>
                  <span className="flex items-center gap-1 text-[11px] text-fg-muted">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    {p.name}
                  </span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-4 border-t border-border pt-3 text-[12px]">
                <div>
                  <div className="text-fg-subtle">调度</div>
                  <div className="text-mono text-fg">{flow.schedule}</div>
                </div>
                <div>
                  <div className="text-fg-subtle">24h 执行</div>
                  <div className="text-mono tabular text-fg">{fmtNumber(flow.executions24h)}</div>
                </div>
                <div>
                  <div className="text-fg-subtle">平均耗时</div>
                  <div className="text-mono tabular text-fg">{fmtDuration(flow.avgDurationMs)}</div>
                </div>
                <div>
                  <div className="text-fg-subtle">成功率</div>
                  <div className="text-mono tabular text-fg">{fmtPercent(flow.successRate)}</div>
                </div>
              </div>
            </DialogHeader>

            {/* 三视图 tab */}
            <div className="p-5">
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                  <TabsTrigger value="stepper">步骤</TabsTrigger>
                  <TabsTrigger value="kanban">看板</TabsTrigger>
                  <TabsTrigger value="dag">调用图</TabsTrigger>
                </TabsList>
                <TabsContent value="stepper">
                  <div className="px-1 py-2">
                    <StepperView steps={flow.steps} />
                  </div>
                </TabsContent>
                <TabsContent value="kanban">
                  <KanbanView steps={flow.steps} />
                </TabsContent>
                <TabsContent value="dag">
                  <DagView steps={flow.steps} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3 text-[11px] text-fg-subtle">
              <span className="text-mono">{flow.id}</span>
              <span>负责人：{flow.owner} · 部门：{flow.department}</span>
              <span>最后运行：{fmtRelative(flow.lastRunAt)}</span>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
