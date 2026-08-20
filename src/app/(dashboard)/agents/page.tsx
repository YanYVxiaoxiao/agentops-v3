import { AgentsList } from "@/components/agents/agents-list";

export default function AgentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-[18px] font-semibold tracking-tight">流程管理</h2>
        <p className="mt-0.5 text-[13px] text-fg-muted">
          M1 跨平台流程接入与版本管理 · Adapter 模式接入影刀 / 实在智能 / 八爪鱼 / APath
        </p>
      </div>
      <AgentsList />
    </div>
  );
}
