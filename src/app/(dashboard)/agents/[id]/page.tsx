import { flows } from "@/lib/mock/flows";
import FlowDetailPage from "./flow-detail";

export function generateStaticParams() {
  return flows.map((f) => ({ id: f.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FlowDetailPage id={id} />;
}
