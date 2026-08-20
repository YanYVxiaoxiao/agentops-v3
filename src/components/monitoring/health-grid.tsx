"use client";
import { flows, statusMeta, platformMeta } from "@/lib/mock/flows";
import type { Flow } from "@/lib/types";
import { fmtDuration, fmtRelative, fmtNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Clock, ChevronRight } from "lucide-react";

export function HealthGrid({ onSelect }: { onSelect: (flow: Flow) => void }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {flows.map((f) => {
        const s = statusMeta[f.status];
        const p = platformMeta[f.platform];
        return (
          <button
            key={f.id}
            onClick={() => onSelect(f)}
            className={cn(
              "group relative flex flex-col gap-2 rounded-[12px] border border-border bg-surface p-3.5 text-left",
              "transition-colors hover:border-border-strong hover:bg-bg/40"
            )}
          >
            {/* 顶部 4px 状态条 */}
            <span
              className={cn(
                "absolute left-0 right-0 top-0 h-[3px] rounded-t-[12px]",
                s.dotClass
              )}
            />

            <div className="flex items-start justify-between gap-2 pt-1">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-[13px] font-semibold text-fg">{f.name}</span>
                <span className="line-clamp-1 text-[11px] text-fg-subtle">{f.description}</span>
              </div>
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0 text-fg-subtle opacity-0 transition-opacity group-hover:opacity-100"
                strokeWidth={1.5}
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-[11px] text-fg-muted">{p.name}</span>
              <span className="text-fg-subtle">·</span>
              <span className={cn("text-[11px] font-medium", `text-${s.tone}`)}>{s.label}</span>
            </div>

            <div className="mt-1 flex items-center justify-between border-t border-border pt-2 text-[11px] text-fg-muted">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-fg-subtle" strokeWidth={1.5} />
                <span className="tabular text-fg">{fmtNumber(f.executions24h)}</span>
                <span className="text-fg-subtle">/ 24h</span>
              </span>
              <span className="tabular text-fg-muted">{fmtDuration(f.avgDurationMs)}</span>
              <span className="text-fg-subtle">{fmtRelative(f.lastRunAt)}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
