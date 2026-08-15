"use client";
import { useParams } from "next/navigation";
import { FlowEditor } from "@/components/automation/FlowEditor";
export default function FlowEditorRoute() {
  const params = useParams<{ id: string }>();
  return <FlowEditor id={params.id} />;
}
