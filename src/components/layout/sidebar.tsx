"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const overviewItems = navItems.filter((i) => i.href === "/");
  const moduleItems = navItems.filter((i) => i.href !== "/" && i.href !== "/ai-cockpit");
  const aiItems = navItems.filter((i) => i.href === "/ai-cockpit");

  const renderNavGroup = (label: string, items: typeof navItems) => (
    <div className="mb-4">
      <div className="mb-1.5 px-2.5 text-[10px] font-medium uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                prefetch={false}
                title={item.description}
                className={cn(
                  "group relative flex items-center gap-2.5 rounded-[8px] px-2.5 py-[7px] text-[13px] transition-all duration-150",
                  active
                    ? "bg-surface text-fg font-medium shadow-card"
                    : "text-fg-muted hover:bg-surface/60 hover:text-fg"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-4 w-[2.5px] -translate-y-1/2 rounded-full bg-accent" />
                )}
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    active ? "text-accent" : "text-fg-subtle group-hover:text-fg-muted"
                  )}
                  strokeWidth={1.5}
                />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <aside className="flex h-full w-[240px] flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-accent text-accent-fg shadow-card glow-accent">
          <span className="text-[13px] font-bold">A</span>
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[14px] font-semibold tracking-tight">AgentOps</span>
          <span className="mt-0.5 text-[10px] text-fg-subtle">RPA 运维平台</span>
        </div>
      </div>

      <div className="border-t border-border" />

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {renderNavGroup("总览", overviewItems)}
        {renderNavGroup("核心模块", moduleItems)}
        {renderNavGroup("AI 增强", aiItems)}
      </nav>

      <div className="border-t border-border" />
      <div className="px-4 pt-2 text-[11px] text-fg-subtle">演示环境 · 数据为示例口径</div>
      <div className="flex items-center gap-2.5 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-surface text-[11px] font-semibold shadow-card">
          PM
        </div>
        <div className="flex flex-1 flex-col leading-tight">
          <span className="text-[12px] font-medium">潘米河</span>
          <span className="text-[10px] text-fg-subtle">产品经理</span>
        </div>
      </div>
    </aside>
  );
}
