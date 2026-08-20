"use client";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { navItems } from "@/lib/nav";
import { flows } from "@/lib/mock/flows";
import { aiAnomalies } from "@/lib/mock/agent-detail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function useCurrentNav() {
  const pathname = usePathname();
  const current = navItems.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );
  return current;
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="切换主题"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

type SearchResult = { type: "页面" | "流程"; label: string; sub: string; href: string };

/** 全局搜索：匹配页面导航与流程，回车或点击跳转（支持 ⌘/Ctrl + K 唤起） */
function GlobalSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<SearchResult[]>(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return [];
    const pages: SearchResult[] = navItems
      .filter(
        (n) =>
          n.label.toLowerCase().includes(kw) ||
          (n.description ?? "").toLowerCase().includes(kw)
      )
      .map((n) => ({ type: "页面", label: n.label, sub: n.description ?? "", href: n.href }));
    const flowItems: SearchResult[] = flows
      .filter((f) => `${f.name} ${f.description} ${f.id}`.toLowerCase().includes(kw))
      .slice(0, 6)
      .map((f) => ({ type: "流程", label: f.name, sub: f.description, href: `/agents/${f.id}` }));
    return [...pages, ...flowItems].slice(0, 8);
  }, [q]);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    router.push(href);
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={boxRef} className="relative hidden sm:block">
      <div
        className={cn(
          "flex h-8 w-56 items-center gap-2 rounded-[8px] border border-border bg-transparent px-3 text-[13px] text-fg-subtle",
          "transition-colors focus-within:border-border-strong"
        )}
      >
        <Search className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0]) go(results[0].href);
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="搜索流程、页面…"
          className="min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-fg-subtle"
        />
        <kbd className="rounded-[4px] border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle">
          ⌘K
        </kbd>
      </div>

      {open && q.trim() && (
        <div className="absolute left-0 top-9 z-50 w-80 overflow-hidden rounded-[8px] border border-border bg-surface p-1 shadow-card">
          {results.length === 0 ? (
            <div className="px-2 py-3 text-[12px] text-fg-subtle">
              没有匹配「{q.trim()}」的页面或流程
            </div>
          ) : (
            results.map((r) => (
              <button
                key={r.href}
                onClick={() => go(r.href)}
                className="flex w-full flex-col items-start gap-0.5 rounded-[6px] px-2 py-1.5 text-left transition-colors hover:bg-bg"
              >
                <span className="flex items-center gap-2 text-[13px] text-fg">
                  {r.label}
                  <Badge variant="outline" className="px-1 text-[10px]">
                    {r.type}
                  </Badge>
                </span>
                {r.sub && (
                  <span className="line-clamp-1 text-[11px] text-fg-subtle">{r.sub}</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/** 通知铃铛：列出未处理的 AI 异常告警，点击跳转权限页 */
function NotificationsMenu() {
  const router = useRouter();
  const openAnomalies = aiAnomalies.filter((a) => a.status === "open");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="通知" className="relative">
          <Bell className="h-4 w-4" strokeWidth={1.5} />
          {openAnomalies.length > 0 && (
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-err" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>待处理告警 · {openAnomalies.length} 条</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {openAnomalies.length === 0 ? (
          <div className="px-2 py-3 text-[12px] text-fg-subtle">暂无待处理告警</div>
        ) : (
          openAnomalies.map((a) => (
            <DropdownMenuItem
              key={a.id}
              onSelect={() => router.push("/security")}
              className="flex-col items-start gap-1"
            >
              <span className="flex w-full items-center gap-2">
                <Badge
                  variant={a.severity === "high" ? "err" : a.severity === "medium" ? "warn" : "info"}
                >
                  {a.severity === "high" ? "高危" : a.severity === "medium" ? "中危" : "低危"}
                </Badge>
                <span className="text-[13px] text-fg">{a.type}</span>
              </span>
              <span className="text-[11px] leading-snug text-fg-subtle">{a.description}</span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push("/security")}>
          查看全部审计日志
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const current = useCurrentNav();

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-bg/80 px-6 backdrop-blur-sm">
      <div className="flex flex-col leading-none">
        <span className="text-[18px] font-semibold tracking-tight text-fg">
          {current?.label ?? "总览"}
        </span>
        {current?.description && (
          <span className="mt-0.5 text-[12px] text-fg-muted">{current.description}</span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <GlobalSearch />
        <NotificationsMenu />
        <ThemeToggle />

        <Badge variant="outline" className="ml-1 hidden md:inline-flex">
          ?demo=1
        </Badge>
      </div>
    </header>
  );
}
