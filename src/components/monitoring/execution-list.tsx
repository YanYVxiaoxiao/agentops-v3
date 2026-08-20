"use client";
import { executions } from "@/lib/mock/flows";
import { getFlowById, platformMeta, statusMeta } from "@/lib/mock/flows";
import { fmtTime, fmtDuration, fmtRelative } from "@/lib/format";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ExecutionList() {
  return (
    <div className="rounded-[12px] border border-border bg-surface">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[110px]">执行 ID</TableHead>
            <TableHead>流程</TableHead>
            <TableHead className="w-[100px]">平台</TableHead>
            <TableHead className="w-[80px]">状态</TableHead>
            <TableHead className="w-[120px]">开始时间</TableHead>
            <TableHead className="w-[80px]">耗时</TableHead>
            <TableHead className="w-[100px]">错误类型</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {executions.map((e) => {
            const flow = getFlowById(e.flowId);
            const p = flow ? platformMeta[flow.platform] : null;
            return (
              <TableRow key={e.id}>
                <TableCell className="text-mono text-[12px] text-fg-muted">{e.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[13px] font-medium text-fg">{flow?.name ?? e.flowId}</span>
                    {flow && (
                      <span className="line-clamp-1 text-[11px] text-fg-subtle">{flow.description}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {p && (
                    <span className="flex items-center gap-1.5 text-[12px] text-fg-muted">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      {p.name}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {e.status === "success" && <Badge variant="ok">成功</Badge>}
                  {e.status === "failed" && <Badge variant="err">失败</Badge>}
                  {e.status === "running" && <Badge variant="info">运行中</Badge>}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col leading-tight">
                    <span className="text-mono text-[12px] text-fg">{fmtTime(e.startedAt)}</span>
                    <span className="text-[11px] text-fg-subtle">{fmtRelative(e.startedAt)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-mono tabular text-[12px] text-fg">
                  {fmtDuration(e.durationMs)}
                </TableCell>
                <TableCell>
                  {e.errorCode ? (
                    <Badge variant="err" className="font-normal">
                      {e.errorCode === "platform_disconnect"
                        ? "平台断连"
                        : e.errorCode === "api_timeout"
                          ? "API 超时"
                          : "流程错误"}
                    </Badge>
                  ) : (
                    <span className="text-[12px] text-fg-subtle">—</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
