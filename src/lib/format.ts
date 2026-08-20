import { formatDistanceToNow, format } from "date-fns";
import { zhCN } from "date-fns/locale";

export function fmtDuration(ms: number): string {
  if (ms === 0) return "—";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return `${m}m${s}s`;
}

export function fmtRelative(iso: string | null): string {
  if (!iso) return "从未";
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: zhCN });
}

export function fmtTime(iso: string): string {
  return format(new Date(iso), "HH:mm:ss");
}

export function fmtNumber(n: number): string {
  return n.toLocaleString("zh-CN");
}

export function fmtPercent(n: number, digits = 1): string {
  return `${(n * 100).toFixed(digits)}%`;
}
