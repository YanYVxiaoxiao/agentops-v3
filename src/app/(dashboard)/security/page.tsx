"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { apiKeys, auditLogs, aiAnomalies, type ApiKey } from "@/lib/mock/agent-detail";
import { platformMeta } from "@/lib/mock/flows";
import { fmtTime, fmtRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Copy, AlertTriangle, ShieldAlert, ShieldCheck, KeyRound, ScrollText, Check, Loader } from "lucide-react";

export default function SecurityPage() {
  const openAnomalies = aiAnomalies.filter((a) => a.status === "open");
  const [keys, setKeys] = useState<ApiKey[]>(apiKeys);
  const [notice, setNotice] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [detailKey, setDetailKey] = useState<ApiKey | null>(null);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 2400);
    return () => clearTimeout(t);
  }, [notice]);

  const handleCreateKey = () => {
    if (creating) return;
    setCreating(true);
    setTimeout(() => {
      const n = keys.filter((k) => k.id.startsWith("key_")).length + 1;
      const newKey: ApiKey = {
        id: `key_${String(n).padStart(3, "0")}_new`,
        name: `新建 Key #${n}`,
        prefix: `ak_new_${Math.random().toString(16).slice(2, 6)}`,
        platform: "yingdao",
        scope: "flows:read",
        lastUsedAt: null,
        createdAt: new Date().toISOString().slice(0, 10),
        status: "active",
        owner: "潘米河",
      };
      setKeys((prev) => [newKey, ...prev]);
      setCreating(false);
      setNotice(`已创建 API Key：${newKey.name}（默认最小权限 flows:read）`);
    }, 600);
  };

  const handleCopy = async (k: ApiKey) => {
    const text = `${k.prefix}••••`;
    try {
      await navigator.clipboard.writeText(text);
      setNotice(`已复制 Key 前缀：${text}`);
    } catch {
      setNotice(`复制失败，请手动复制：${text}`);
    }
  };

  const detailPlatform = detailKey ? platformMeta[detailKey.platform] : null;
  const relatedAnomalies = detailKey
    ? aiAnomalies.filter((a) => a.relatedKey === detailKey.id)
    : [];
  const relatedLogs = detailKey ? auditLogs.filter((l) => l.target === detailKey.id) : [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-[18px] font-semibold tracking-tight">权限隔离</h2>
        <p className="mt-0.5 text-[13px] text-fg-muted">
          M3 API Key 级管控 · 全量审计日志 · AI 异常行为检测
        </p>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-[8px] border border-ok/30 bg-ok/8 px-3 py-2 text-[12px] text-ok">
          <Check className="h-3.5 w-3.5" strokeWidth={1.8} />
          {notice}
        </div>
      )}

      {/* AI 异常检测 banner — 顶部展示未处理异常 */}
      {openAnomalies.length > 0 && (
        <div className="flex flex-col gap-2 rounded-[12px] border border-warn/30 bg-warn/8 p-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-warn" strokeWidth={1.8} />
            <span className="text-[13px] font-semibold text-warn">
              AI 异常检测 · {openAnomalies.length} 条未处理告警
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {openAnomalies.map((a) => (
              <div key={a.id} className="flex items-start gap-3 text-[12px]">
                <Badge
                  variant={a.severity === "high" ? "err" : a.severity === "medium" ? "warn" : "info"}
                  className="shrink-0"
                >
                  {a.severity === "high" ? "高危" : a.severity === "medium" ? "中危" : "低危"}
                </Badge>
                <span className="text-fg">{a.type}</span>
                <span className="text-fg-muted">·</span>
                <span className="flex-1 text-fg-muted">{a.description}</span>
                <span className="text-mono text-[11px] text-fg-subtle">{fmtTime(a.ts)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Key 管理 */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-fg-muted" strokeWidth={1.5} />
            <h3 className="text-[14px] font-semibold text-fg">API Key 管理</h3>
            <span className="text-[12px] text-fg-subtle">· {keys.length} 个</span>
          </div>
          <Button size="sm" onClick={handleCreateKey} disabled={creating}>
            {creating ? (
              <Loader className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <KeyRound className="h-3.5 w-3.5" />
            )}
            {creating ? "创建中…" : "新建 Key"}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead className="w-[140px]">Key 前缀</TableHead>
              <TableHead className="w-[110px]">平台</TableHead>
              <TableHead>权限范围</TableHead>
              <TableHead className="w-[120px]">最后使用</TableHead>
              <TableHead className="w-[80px]">状态</TableHead>
              <TableHead className="w-[40px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((k) => {
              const p = platformMeta[k.platform];
              return (
                <TableRow key={k.id}>
                  <TableCell>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[13px] font-medium text-fg">{k.name}</span>
                      <span className="text-[11px] text-fg-subtle">{k.owner} · 创建于 {k.createdAt}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-mono text-[12px] text-fg-muted">
                      {k.prefix}••••
                      <button
                        onClick={() => handleCopy(k)}
                        aria-label="复制 Key 前缀"
                        title="复制 Key 前缀"
                        className="text-fg-subtle transition-colors hover:text-fg"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-[12px] text-fg-muted">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {k.scope.split(",").map((s) => (
                        <Badge key={s} variant="outline" className="text-mono text-[10px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-[12px] text-fg-muted">
                    {k.lastUsedAt ? fmtRelative(k.lastUsedAt) : "从未"}
                  </TableCell>
                  <TableCell>
                    {k.status === "active" ? (
                      <Badge variant="ok">启用</Badge>
                    ) : (
                      <Badge variant="default">已回收</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setDetailKey(k)}
                      aria-label="查看该 Key 的关联记录"
                      title="查看该 Key 的关联记录"
                    >
                      <ScrollText className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* 审计日志 — 时间线视图 */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border p-4">
          <ScrollText className="h-4 w-4 text-fg-muted" strokeWidth={1.5} />
          <h3 className="text-[14px] font-semibold text-fg">审计日志</h3>
          <span className="text-[12px] text-fg-subtle">· 近 7 天 · {auditLogs.length} 条</span>
        </div>
        <div className="divide-y divide-border">
          {auditLogs.map((log) => {
            const riskColor =
              log.risk === "high" ? "text-err" : log.risk === "medium" ? "text-warn" : "text-fg-subtle";
            const riskBg =
              log.risk === "high" ? "bg-err/10" : log.risk === "medium" ? "bg-warn/10" : "bg-bg";
            return (
              <div key={log.id} className="flex items-start gap-3 px-4 py-3">
                <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]", riskBg)}>
                  {log.risk === "high" ? (
                    <AlertTriangle className={cn("h-3.5 w-3.5", riskColor)} strokeWidth={1.5} />
                  ) : log.risk === "medium" ? (
                    <ShieldAlert className={cn("h-3.5 w-3.5", riskColor)} strokeWidth={1.5} />
                  ) : (
                    <ShieldCheck className={cn("h-3.5 w-3.5", riskColor)} strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-fg">{log.action}</span>
                    <span className="text-[12px] text-fg-muted">· {log.target}</span>
                    <Badge
                      variant={log.risk === "high" ? "err" : log.risk === "medium" ? "warn" : "default"}
                      className="ml-auto"
                    >
                      {log.risk === "high" ? "高危" : log.risk === "medium" ? "中危" : "低危"}
                    </Badge>
                  </div>
                  <span className="text-[12px] text-fg-muted">{log.detail}</span>
                  <div className="flex items-center gap-3 text-[11px] text-fg-subtle">
                    <span>操作人：{log.actor}</span>
                    <span>·</span>
                    <span className="text-mono">IP {log.ip}</span>
                    <span>·</span>
                    <span className="text-mono">{fmtTime(log.ts)}</span>
                    <span>·</span>
                    <span>{fmtRelative(log.ts)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Key 详情 — 关联异常与审计记录 */}
      <Dialog open={!!detailKey} onOpenChange={(o) => !o && setDetailKey(null)}>
        <DialogContent className="max-w-xl">
          {detailKey && detailPlatform && (
            <>
              <DialogHeader>
                <DialogTitle>API Key 关联记录</DialogTitle>
                <DialogDescription>
                  {detailKey.name} · {detailKey.prefix}•••• · {detailPlatform.name}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-fg-subtle">归属</span>
                  <span className="text-fg">{detailKey.owner}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-fg-subtle">状态</span>
                  <span className="text-fg">
                    {detailKey.status === "active" ? "启用中" : "已回收"}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-fg-subtle">权限范围</span>
                  <span className="text-mono text-fg">{detailKey.scope}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-fg-subtle">创建于</span>
                  <span className="text-mono text-fg">{detailKey.createdAt}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-fg-subtle">最后使用</span>
                  <span className="text-fg">
                    {detailKey.lastUsedAt ? fmtRelative(detailKey.lastUsedAt) : "从未使用"}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-fg">
                  关联 AI 异常 · {relatedAnomalies.length} 条
                </span>
                {relatedAnomalies.length === 0 ? (
                  <span className="text-[12px] text-fg-subtle">暂无直接关联记录</span>
                ) : (
                  relatedAnomalies.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-start gap-2 rounded-[8px] border border-border bg-bg/40 p-2.5 text-[12px]"
                    >
                      <Badge
                        variant={
                          a.severity === "high" ? "err" : a.severity === "medium" ? "warn" : "info"
                        }
                        className="shrink-0"
                      >
                        {a.severity === "high" ? "高危" : a.severity === "medium" ? "中危" : "低危"}
                      </Badge>
                      <span className="shrink-0 text-fg">{a.type}</span>
                      <span className="flex-1 text-fg-muted">{a.description}</span>
                      <span className="shrink-0 text-mono text-[11px] text-fg-subtle">
                        {fmtTime(a.ts)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold text-fg">
                  关联审计日志 · {relatedLogs.length} 条
                </span>
                {relatedLogs.length === 0 ? (
                  <span className="text-[12px] text-fg-subtle">暂无直接关联记录</span>
                ) : (
                  relatedLogs.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-start gap-2 rounded-[8px] border border-border bg-bg/40 p-2.5 text-[12px]"
                    >
                      <Badge
                        variant={
                          l.risk === "high" ? "err" : l.risk === "medium" ? "warn" : "default"
                        }
                        className="shrink-0"
                      >
                        {l.risk === "high" ? "高危" : l.risk === "medium" ? "中危" : "低危"}
                      </Badge>
                      <span className="shrink-0 text-fg">{l.action}</span>
                      <span className="flex-1 text-fg-muted">{l.detail}</span>
                      <span className="shrink-0 text-mono text-[11px] text-fg-subtle">
                        {fmtTime(l.ts)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
