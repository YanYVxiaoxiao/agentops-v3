"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check, Bot, Plug, Cloud, Network, Layers } from "lucide-react";
import { platformMeta } from "@/lib/mock/flows";

const platformIcon: Record<string, typeof Bot> = {
  yingdao: Bot,
  shizai: Plug,
  bazhuayu: Cloud,
  apath: Network,
  hongji: Layers,
};

export default function NewFlowPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [platform, setPlatform] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("定时调度");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim() && description.trim() && platform;

  const handleSubmit = () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setTimeout(() => router.push("/agents"), 700);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-[12px] text-fg-subtle">
        <Link href="/agents" prefetch={false} className="hover:text-fg">流程管理</Link>
        <span>/</span>
        <span className="text-fg-muted">接入流程</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold",
            step >= 1 ? "bg-primary text-primary-fg" : "bg-bg text-fg-subtle"
          )}>
            {step > 1 ? <Check className="h-3 w-3" /> : "1"}
          </div>
          <span className={cn("text-[13px]", step >= 1 ? "text-fg font-medium" : "text-fg-subtle")}>
            选择 RPA 平台
          </span>
        </div>
        <div className="h-[0.8px] w-12 bg-border" />
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold",
            step >= 2 ? "bg-primary text-primary-fg" : "bg-bg text-fg-subtle"
          )}>
            2
          </div>
          <span className={cn("text-[13px]", step >= 2 ? "text-fg font-medium" : "text-fg-subtle")}>
            填写流程信息
          </span>
        </div>
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-[18px] font-semibold tracking-tight">选择 RPA 平台</h2>
            <p className="mt-0.5 text-[13px] text-fg-muted">
              AgentOps 通过 Adapter 模式接入 5 个主流 RPA 平台。选择流程所在的平台后，将自动拉取该平台下流程列表。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Object.entries(platformMeta).map(([id, p]) => {
              const Icon = platformIcon[id] ?? Bot;
              return (
                <button
                  key={id}
                  onClick={() => setPlatform(id)}
                  className={cn(
                    "flex items-start gap-3 rounded-[12px] border bg-surface p-4 text-left transition-colors",
                    platform === id ? "border-primary" : "border-border hover:border-border-strong"
                  )}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px]"
                    style={{ backgroundColor: `${p.color}20` }}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} style={{ color: p.color }} />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-fg">{p.name}</span>
                      {platform === id && (
                        <Badge variant="default" className="ml-auto">
                          <Check className="h-3 w-3" /> 已选
                        </Badge>
                      )}
                    </div>
                    <span className="text-[12px] text-fg-muted">{p.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/agents" prefetch={false}>
                <ArrowLeft className="h-3.5 w-3.5" /> 取消
              </Link>
            </Button>
            <Button disabled={!platform} onClick={() => setStep(2)}>
              下一步 <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && platform && (
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-[18px] font-semibold tracking-tight">填写流程信息</h2>
            <p className="mt-0.5 text-[13px] text-fg-muted">
              Description-first 原则：先说清这个流程是干嘛的，再填技术细节。
            </p>
          </div>

          <Card className="p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-fg">
                  这个流程是干嘛的？<span className="text-err"> *</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="例：每 15 分钟拉取淘宝待发货订单，写入用友 ERP，触发仓库拣货"
                  className="w-full resize-none rounded-[8px] border border-border bg-transparent px-3 py-2 text-[13px] placeholder:text-fg-subtle focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-fg-subtle/20"
                />
                <span className="text-[11px] text-fg-subtle">
                  这条描述会显示在列表/详情/告警的所有位置，让运维一眼看懂流程用途
                </span>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-fg">流程名称</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例：淘宝订单同步到 ERP"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-fg">所属 RPA 平台</label>
                  <div className="flex h-8 items-center gap-2 rounded-[8px] border border-border bg-bg/40 px-3 text-[13px] text-fg-muted">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: platformMeta[platform as keyof typeof platformMeta].color }}
                    />
                    {platformMeta[platform as keyof typeof platformMeta].name}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-fg">负责人</label>
                  <Input placeholder="例：电商运维组" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-fg">所属部门</label>
                  <Input placeholder="例：电商事业部" />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-fg">调度方式</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {["定时调度", "事件触发", "手动执行"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSchedule(s)}
                        className={cn(
                          "rounded-[8px] border px-3 py-1.5 text-[12px] transition-colors",
                          schedule === s
                            ? "border-primary bg-primary text-primary-fg"
                            : "border-border text-fg-muted hover:border-border-strong"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-fg-subtle">
                  创建后将生成唯一流程 ID，自动纳入监控大盘与成本统计
                </span>
                <span className="text-[11px] text-fg-subtle">
                  Humans approve dangerous parts — 创建流程需二次确认
                </span>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft className="h-3.5 w-3.5" /> 上一步
            </Button>
            <Button
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
            >
              <Check className="h-3.5 w-3.5" /> {submitting ? "接入中…" : "确认接入"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
