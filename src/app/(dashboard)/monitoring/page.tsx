"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KpiRow } from "@/components/monitoring/kpi-row";
import { WhatsBroken } from "@/components/monitoring/whats-broken";
import { HealthGrid } from "@/components/monitoring/health-grid";
import { Gantt24h } from "@/components/monitoring/gantt-24h";
import { ExecutionList } from "@/components/monitoring/execution-list";
import { FlowDetailDialog } from "@/components/monitoring/flow-detail-dialog";
import type { Flow } from "@/lib/types";

export default function MonitoringPage() {
  const [selected, setSelected] = useState<Flow | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-[18px] font-semibold tracking-tight">监控追踪</h2>
        <p className="mt-0.5 text-[13px] text-fg-muted">
          Health grid · 24h Gantt · 调用链三视图 — 覆盖 5 个 RPA 平台共 9 条流程
        </p>
      </div>

      <KpiRow />
      <WhatsBroken />

      <Tabs defaultValue="grid" className="mt-2">
        <TabsList>
          <TabsTrigger value="grid">Health grid</TabsTrigger>
          <TabsTrigger value="gantt">24h Gantt</TabsTrigger>
          <TabsTrigger value="exec">执行列表</TabsTrigger>
        </TabsList>
        <TabsContent value="grid">
          <HealthGrid onSelect={setSelected} />
        </TabsContent>
        <TabsContent value="gantt">
          <Gantt24h onSelect={setSelected} />
        </TabsContent>
        <TabsContent value="exec">
          <ExecutionList />
        </TabsContent>
      </Tabs>

      <FlowDetailDialog flow={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
