"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { flows, statusMeta, platformMeta } from "@/lib/mock/flows";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { fmtNumber, fmtDuration, fmtRelative, fmtPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Search, Plus, MoreHorizontal, Circle, Eye, Play, Power, Check, Loader } from "lucide-react";

export function AgentsList() {
  const [q, setQ] = useState("");
  const [platform, setPlatform] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [disabledIds, setDisabledIds] = useState<string[]>([]);
  const [running, setRunning] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // 操作反馈自动消失
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 2600);
    return () => clearTimeout(t);
  }, [notice]);

  const handleRun = (id: string, name: string) => {
    setRunning(id);
    setNotice(`已触发执行：${name}`);
    setTimeout(() => setRunning(null), 1500);
  };

  const handleToggle = (id: string, name: string) => {
    setDisabledIds((prev) => {
      const off = prev.includes(id);
      setNotice(off ? `已启用：${name}` : `已停用：${name}`);
      return off ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  const filtered = useMemo(() => {
    return flows.filter((f) => {
      if (q && !`${f.name} ${f.description} ${f.id}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (platform !== "all" && f.platform !== platform) return false;
      if (status !== "all" && f.status !== status) return false;
      return true;
    });
  }, [q, platform, status]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-subtle" strokeWidth={1.5} />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索流程名、描述、ID…"
            className="pl-8"
          />
        </div>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="平台" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部平台</SelectItem>
            <SelectItem value="yingdao">影刀</SelectItem>
            <SelectItem value="shizai">实在智能</SelectItem>
            <SelectItem value="bazhuayu">八爪鱼</SelectItem>
            <SelectItem value="apath">APath</SelectItem>
            <SelectItem value="hongji">弘玑 Cyclone</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="OK">正常</SelectItem>
            <SelectItem value="FAILING">失败中</SelectItem>
            <SelectItem value="SILENT">静默</SelectItem>
            <SelectItem value="NEVER_RAN">未运行</SelectItem>
            <SelectItem value="IDLE">空闲</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2 text-[12px] text-fg-subtle">
          共 <span className="text-mono tabular text-fg">{filtered.length}</span> / {flows.length} 条
        </div>
        <Button asChild size="default">
          <Link href="/agents/new" prefetch={false}>
            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} /> 接入流程
          </Link>
        </Button>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-[8px] border border-ok/30 bg-ok/8 px-3 py-2 text-[12px] text-ok">
          <Check className="h-3.5 w-3.5" strokeWidth={1.8} />
          {notice}
        </div>
      )}

      <div className="rounded-[12px] border border-border bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>流程</TableHead>
              <TableHead className="w-[120px]">RPA 平台</TableHead>
              <TableHead className="w-[90px]">状态</TableHead>
              <TableHead className="w-[90px] text-right">24h 执行</TableHead>
              <TableHead className="w-[80px] text-right">成功率</TableHead>
              <TableHead className="w-[100px] text-right">平均耗时</TableHead>
              <TableHead className="w-[120px]">最后运行</TableHead>
              <TableHead className="w-[40px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((f) => {
              const s = statusMeta[f.status];
              const p = platformMeta[f.platform];
              return (
                <TableRow key={f.id}>
                  <TableCell>
                    <Link href={`/agents/${f.id}`} prefetch={false} className="flex flex-col leading-tight">
                      <span className="text-[13px] font-medium text-fg hover:underline">{f.name}</span>
                      <span className="line-clamp-1 text-[11px] text-fg-subtle">{f.description}</span>
                      <span className="text-mono text-[10px] text-fg-subtle">{f.id}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-[12px] text-fg-muted">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    {disabledIds.includes(f.id) ? (
                      <span className="flex items-center gap-1.5 text-[12px] text-fg-subtle">
                        <Circle className="h-2 w-2 fill-current" />
                        已停用
                      </span>
                    ) : (
                      <span className={cn("flex items-center gap-1.5 text-[12px]", `text-${s.tone}`)}>
                        <Circle className="h-2 w-2 fill-current" />
                        {s.label}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-mono tabular text-[12px] text-fg">
                    {fmtNumber(f.executions24h)}
                  </TableCell>
                  <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">
                    {f.executions24h > 0 ? fmtPercent(f.successRate, 0) : "—"}
                  </TableCell>
                  <TableCell className="text-right text-mono tabular text-[12px] text-fg-muted">
                    {fmtDuration(f.avgDurationMs)}
                  </TableCell>
                  <TableCell className="text-[12px] text-fg-muted">{fmtRelative(f.lastRunAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          aria-label={`${f.name} 操作`}
                        >
                          {running === f.id ? (
                            <Loader className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <Link href={`/agents/${f.id}`} prefetch={false}>
                            <Eye /> 查看详情
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleRun(f.id, f.name)}>
                          <Play /> {running === f.id ? "执行中…" : "立即执行"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => handleToggle(f.id, f.name)}>
                          <Power />
                          {disabledIds.includes(f.id) ? "启用流程" : "停用流程"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
