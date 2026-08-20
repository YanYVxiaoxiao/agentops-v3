"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "ok" | "warn" | "err";
type Status = "pending" | "accepted" | "rejected";

interface SuggestionItemProps {
  text: string;
  tone: Tone;
  delta?: string;
}

export function SuggestionItem({ text, tone, delta }: SuggestionItemProps) {
  const [status, setStatus] = useState<Status>("pending");

  return (
    <div
      className={cn(
        "flex items-start gap-2 text-[12px] transition-colors duration-150",
        status === "accepted" && "rounded-[6px] bg-ok/5"
      )}
    >
      {status === "accepted" ? (
        <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-ok/15">
          <Check className="h-2.5 w-2.5 text-ok" strokeWidth={2.5} />
        </span>
      ) : (
        <span
          className={cn(
            "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
            tone === "ok" ? "bg-ok" : tone === "warn" ? "bg-warn" : "bg-err"
          )}
        />
      )}
      <span
        className={cn(
          "flex-1",
          status === "accepted" && "text-ok",
          status === "rejected" ? "text-fg-subtle line-through" : status === "pending" && "text-fg-muted"
        )}
      >
        {text}
      </span>
      {delta && (
        <span
          className={cn(
            "text-mono text-[11px] tabular",
            status === "rejected" ? "text-fg-subtle line-through" : tone === "ok" ? "text-ok" : "text-warn"
          )}
        >
          {delta}
        </span>
      )}
      {status === "pending" ? (
        <span className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setStatus("accepted")}
            className="rounded-[5px] px-1.5 py-0.5 text-[12px] text-fg-muted transition-colors hover:bg-ok/10 hover:text-ok"
          >
            采纳
          </button>
          <button
            type="button"
            onClick={() => setStatus("rejected")}
            className="rounded-[5px] px-1.5 py-0.5 text-[12px] text-fg-muted transition-colors hover:bg-err/10 hover:text-err"
          >
            驳回
          </button>
        </span>
      ) : (
        <span
          className={cn(
            "shrink-0 text-[12px]",
            status === "accepted" ? "text-ok" : "text-fg-subtle"
          )}
        >
          {status === "accepted" ? "已采纳" : "已驳回"}
        </span>
      )}
    </div>
  );
}
