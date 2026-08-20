import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Workflow,
  Activity,
  CircleDollarSign,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export const navItems: NavItem[] = [
  {
    label: "总览",
    href: "/",
    icon: LayoutDashboard,
    description: "RPA 流程统一运维大盘",
  },
  {
    label: "流程管理",
    href: "/agents",
    icon: Workflow,
    description: "M1 跨平台流程接入与版本管理",
  },
  {
    label: "监控追踪",
    href: "/monitoring",
    icon: Activity,
    description: "M2 Health grid + 24h Gantt + 调用链",
  },
  {
    label: "成本控制",
    href: "/costs",
    icon: CircleDollarSign,
    description: "M5 跨平台成本核算与优化建议",
  },
  {
    label: "权限隔离",
    href: "/security",
    icon: ShieldCheck,
    description: "M3 API Key + 审计日志 + 异常检测",
  },
  {
    label: "AI 决策痕迹",
    href: "/ai-cockpit",
    icon: Sparkles,
    description: "四模块 AI 增强点单页汇总",
  },
];

export const rpaPlatforms = [
  { id: "yingdao", name: "影刀", color: "#3B82F6", category: "桌面 RPA" },
  { id: "shizai", name: "实在智能", color: "#A855F7", category: "AI 驱动" },
  { id: "bazhuayu", name: "八爪鱼", color: "#F97316", category: "云端采集" },
  { id: "apath", name: "APath", color: "#10B981", category: "企业编排" },
  { id: "hongji", name: "弘玑 Cyclone", color: "#EC4899", category: "超自动化" },
] as const;

export type RpaPlatformId = (typeof rpaPlatforms)[number]["id"];
