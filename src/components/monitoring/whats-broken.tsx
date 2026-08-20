import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { flows, statusMeta } from "@/lib/mock/flows";

export function WhatsBroken() {
  const broken = flows.filter((f) => f.status === "FAILING" || f.status === "SILENT");
  if (broken.length === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-[12px] border border-err/30 bg-err/8 px-4 py-2.5">
      <AlertTriangle className="h-4 w-4 shrink-0 text-err" strokeWidth={1.8} />
      <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
        <span className="font-medium text-err">{broken.length} 个流程需要处理</span>
        {broken.map((f) => (
          <Link
            key={f.id}
            href={`/agents/${f.id}`}
            prefetch={false}
            className="flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusMeta[f.status].dotClass}`} />
            <span className="text-fg">{f.name}</span>
            <span className="text-fg-subtle">· {statusMeta[f.status].label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
