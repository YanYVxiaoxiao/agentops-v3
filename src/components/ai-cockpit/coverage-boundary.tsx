import { Card } from "@/components/ui/card";

const covered = [
  "平台连接中断与鉴权过期",
  "元素选择器失效（UI 变更）",
  "调度冲突与许可位占满",
  "执行超时（超过 P95 基线）",
  "数据格式/编码异常",
  "依赖流程未就绪（前置失败传导）",
  "资源不足（内存/磁盘/并发）",
  "SILENT 静默异常（该跑没跑）",
];

const notCovered = [
  "上游服务故障（如 TARS 模型 API 偶发 503）——标记为「外部依赖」，转人工",
  "业务逻辑错误（规则本身写错）——需要业务方确认，AI 不替业务下判断",
  "RPA 平台自身 bug——提交厂商工单，不进根因建议",
];

export function CoverageBoundary() {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-[14px] font-semibold text-fg">AI 不覆盖什么</h3>
        <p className="mt-1 text-[13px] text-fg-muted">
          边界声明是信任设计的一部分——宁可漏报，不可错报
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card className="p-5">
          <h4 className="text-[13px] font-semibold text-fg">8 条根因规则覆盖的</h4>
          <ul className="mt-3 flex flex-col gap-2">
            {covered.map((text) => (
              <li key={text} className="flex items-start gap-2 text-[12px] text-fg-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="flex-1">{text}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h4 className="text-[13px] font-semibold text-fg">明确不覆盖的</h4>
          <ul className="mt-3 flex flex-col gap-2">
            {notCovered.map((text) => (
              <li key={text} className="flex items-start gap-2 text-[12px] text-fg-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
                <span className="flex-1">{text}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <p className="text-[12px] text-fg-subtle">
        未命中场景会原样上报原始日志并标注『未命中』，不强行给结论。
      </p>
    </div>
  );
}
