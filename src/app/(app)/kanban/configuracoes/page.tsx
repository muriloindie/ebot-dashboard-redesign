import { redirect } from "next/navigation";

export default function KanbanConfigRoute() {
  redirect("/configuracoes?secao=kanban");
}
