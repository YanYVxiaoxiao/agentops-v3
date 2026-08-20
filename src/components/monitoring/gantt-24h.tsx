"use client";
import { flows, statusMeta, platformMeta } from "@/lib/mock/flows";
import type { Flow } from "@/lib/types";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const NOW_HOUR = new Date().getHours();

export function Gantt24h({ onSelect }: { onSelect: (flow: Flow) => void }) {
  const maxRuns = Math.max(...flows.flatMap((f) => f.hourlyRuns));

  return (
    <div className="overflow-x-auto rounded-[12px] border border-border bg-surface">
      <div className="min-w-[720px]">
      {/* 时间轴 header */}
      <div className="flex items-end border-b border-border px-3 py-2">
        <div className="w-[180px] shrink-0 text-[11px] font-medium text-fg-subtle">流程</div>
        <div className="flex min-w-0 flex-1 items-end">
          {HOURS.map((h) => (
            <div
              key={h}
              className={cn(
                "min-w-0 flex-1 whitespace-nowrap text-center text-[10px] tabular text-fg-subtle",
                h === NOW_HOUR && "text-err font-medium"
              )}
            >
              {h % 3 === 0 ? `${String(h).padStart(2, "0")}:00` : ""}
            </div>
          ))}
        </div>
      </div>

      {/* 流程行 */}
      <div className="divide-y divide-border">
        {flows.map((f) => {
          const s = statusMeta[f.status];
          const p = platformMeta[f.platform];
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f)}
              className={cn(
                "flex w-full items-center px-3 py-2 text-left transition-colors hover:bg-bg/40"
              )}
            >
              <div className="flex w-[180px] shrink-0 items-center gap-2 pr-3">
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", s.dotClass)} />
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate text-[12px] font-medium text-fg">{f.name}</span>
                  <span className="flex items-center gap-1 text-[10px] text-fg-subtle">
                    <span
                      className="h-1 w-1 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    {p.name}
                  </span>
                </div>
              </div>
              <div className="relative flex-1">
                {/* 24 小时背景网格 */}
                <div className="flex h-7 items-end gap-px">
                  {f.hourlyRuns.map((runs, h) => {
                    const heightPct = maxRuns === 0 ? 0 : (runs / maxRuns) * 100;
                    const isPast = h < NOW_HOUR;
                    const isNow = h === NOW_HOUR;
                    return (
                      <div
                        key={h}
                        className={cn(
                          "relative flex-1 rounded-[2px]",
                          isNow && "bg-err/8"
                        )}
                        title={`${String(h).padStart(2, "0")}:00 — ${runs} 次`}
                      >
                        {runs > 0 && (
                          <div
                            className={cn(
                              "absolute bottom-0 left-0 right-0 rounded-[2px]",
                              isPast ? "bg-primary/70" : "border border-primary/40 bg-transparent"
                            )}
                            style={{ height: `${Math.max(heightPct, 8)}%` }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-4 border-t border-border px-3 py-2 text-[10px] text-fg-subtle">
        <span className="flex items-center gap-1">
          <span className="h-2 w-3 rounded-[2px] bg-primary/70" />
          已执行
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-3 rounded-[2px] border border-primary/40" />
          计划中
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-3 rounded-[2px] bg-err/8" />
          当前小时
        </span>
        <span className="ml-auto">单位：每小时执行次数</span>
      </div>
      </div>
    </div>
  );
}
