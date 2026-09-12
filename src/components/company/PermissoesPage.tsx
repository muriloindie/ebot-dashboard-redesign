"use client";

import { useState } from "react";
import { Eye, Pencil, PencilLine, Plus, RotateCcw, Shield, ShieldCheck, Square, Trash2, UserRound, UsersRound } from "lucide-react";
import { deletePermissionMatrix, listPermissionMatrix, newCompanyId, savePermissionMatrix } from "@/lib/company/companyService";
import type { PermissionMatrix } from "@/lib/company/types";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const MODULES = ["Dashboard", "Atendimentos", "Agenda", "Clientes", "Arquivos", "Campanhas", "Automação", "Financeiro", "Usuários", "Configurações"] as const;
type Level = "nenhum" | "leitura" | "edicao" | "total";

const LEVELS: Level[] = ["nenhum", "leitura", "edicao", "total"];

const levelMeta: Record<Level, { label: string; icon: typeof Eye; chip: string }> = {
  nenhum: { label: "Sem acesso", icon: Square, chip: "bg-ebot-surfaceMuted text-ebot-muted" },
  leitura: { label: "Leitura", icon: Eye, chip: "bg-ebot-primary/[0.10] text-ebot-primaryText" },
  edicao: { label: "Edição", icon: PencilLine, chip: "bg-ebot-teal/[0.10] text-ebot-teal" },
  total: { label: "Total", icon: ShieldCheck, chip: "bg-ebot-dark text-ebot-surface" }
};

const noAccessModules = (): Record<string, Level> => Object.fromEntries(MODULES.map((module) => [module, "nenhum" as Level]));

type RoleDraft = { roleId: string; roleName: string; description: string };

export function PermissoesPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Empresa / Governança"
        title="Permissões"
        description="Matriz de acesso por papel: toque em um nível para alternar entre sem acesso, leitura, edição e total. Cada mudança vale imediatamente."
      />
      <PermissoesPanel />
    </div>
  );
}

export function PermissoesPanel() {
  const { toast } = useDemo();
  const [matrix, setMatrix] = useState<PermissionMatrix[]>(() => listPermissionMatrix());
  const [draft, setDraft] = useState<RoleDraft | null>(null);
  const [deleting, setDeleting] = useState<PermissionMatrix | null>(null);

  function cycle(role: PermissionMatrix, module: string) {
    const current = role.modules[module] ?? "nenhum";
    const next = LEVELS[(LEVELS.indexOf(current) + 1) % LEVELS.length];
    const updated: PermissionMatrix = { ...role, modules: { ...role.modules, [module]: next } };
    savePermissionMatrix(updated);
    setMatrix(listPermissionMatrix());
    toast(`"${module}" para ${role.roleName} agora é ${levelMeta[next].label.toLowerCase()}.`);
  }

  function resetRole(role: PermissionMatrix) {
    const modules = Object.fromEntries(MODULES.map((module) => [module, "total" as Level]));
    savePermissionMatrix({ ...role, modules });
    setMatrix(listPermissionMatrix());
    toast(`Permissões de "${role.roleName}" zeradas para acesso total.`);
  }

  function resetAll() {
    const updated = matrix.map((role) => ({ ...role, modules: Object.fromEntries(MODULES.map((module) => [module, "total" as Level])) }));
    updated.forEach(savePermissionMatrix);
    setMatrix(listPermissionMatrix());
    toast("Matriz de permissões restaurada para o padrão.");
  }

  function saveRole() {
    if (!draft) return;
    if (!draft.roleName.trim()) {
      toast("Informe o nome do papel.", "warning");
      return;
    }
    const exists = matrix.some((role) => role.roleId === draft.roleId);
    if (exists) {
      const current = matrix.find((role) => role.roleId === draft.roleId);
      if (current) savePermissionMatrix({ ...current, roleName: draft.roleName.trim(), description: draft.description.trim() });
      toast(`Papel "${draft.roleName}" atualizado.`);
    } else {
      savePermissionMatrix({ roleId: newCompanyId("role"), roleName: draft.roleName.trim(), description: draft.description.trim(), modules: noAccessModules(), usersCount: 0 });
      toast(`Papel "${draft.roleName}" criado. Ajuste os módulos e ele já estará disponível ao convidar membros.`);
    }
    setMatrix(listPermissionMatrix());
    setDraft(null);
  }

  function removeRole() {
    if (!deleting) return;
    if (deleting.usersCount > 0) {
      toast("Reatribua os membros deste papel antes de excluir.", "warning");
      setDeleting(null);
      return;
    }
    deletePermissionMatrix(deleting.roleId);
    setMatrix(listPermissionMatrix());
    toast(`Papel "${deleting.roleName}" excluído.`);
    setDeleting(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 rounded-[20px] border border-ebot-border/[0.12] bg-ebot-surface/70 px-4 py-3">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.09em] text-ebot-muted">Legenda</span>
          {LEVELS.map((level) => {
            const Icon = levelMeta[level].icon;
            return (
              <span key={level} className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-extrabold", levelMeta[level].chip)}>
                <Icon className="size-3.5" />{levelMeta[level].label}
              </span>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={resetAll}><RotateCcw className="size-4" />Restaurar padrão</Button>
          <Button onClick={() => setDraft({ roleId: "", roleName: "", description: "" })}><Plus className="size-4" />Novo papel</Button>
        </div>
      </div>

      {matrix.length === 0 ? (
        <div className="rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-10 text-center text-sm font-bold text-ebot-muted">Nenhum papel criado. Use &ldquo;Novo papel&rdquo; para começar.</div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {matrix.map((role) => (
            <section key={role.roleId} className={cn("rounded-[24px] border bg-ebot-surface/80 p-5 shadow-[0_8px_24px_rgba(4,27,21,0.04)]", Object.values(role.modules).every((level) => level === "nenhum") ? "border-ebot-border/[0.10] opacity-80" : "border-ebot-border/[0.14]")}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-extrabold text-ebot-dark">{role.roleName}</h2>
                  <p className="mt-1 max-w-md text-[12px] font-semibold leading-4 text-ebot-muted">{role.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <span className="flex items-center gap-1.5 rounded-xl bg-ebot-surfaceMuted/70 px-2.5 py-1 text-[11px] font-extrabold text-ebot-slate">
                    <UsersRound className="size-3.5" />{role.usersCount} membro{role.usersCount === 1 ? "" : "s"}
                  </span>
                  <button onClick={() => setDraft({ roleId: role.roleId, roleName: role.roleName, description: role.description })} title="Editar papel" className="rounded-xl p-2 text-ebot-muted transition hover:bg-ebot-surfaceMuted hover:text-ebot-dark">
                    <Pencil className="size-4" />
                  </button>
                  <button onClick={() => resetRole(role)} title="Restaurar papel para acesso total" className="rounded-xl p-2 text-ebot-muted transition hover:bg-ebot-surfaceMuted hover:text-ebot-dark">
                    <RotateCcw className="size-4" />
                  </button>
                  <button onClick={() => setDeleting(role)} title="Excluir papel" className="rounded-xl p-2 text-ebot-muted transition hover:bg-ebot-red/10 hover:text-ebot-red">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {MODULES.map((module) => {
                  const level = role.modules[module] ?? "nenhum";
                  const Icon = levelMeta[level].icon;
                  return (
                    <button
                      key={module}
                      onClick={() => cycle(role, module)}
                      className={cn("flex items-center justify-between gap-2 rounded-2xl border border-ebot-border/[0.10] bg-ebot-surfaceMuted/25 px-3.5 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-ebot-border/25", level === "nenhum" && "opacity-60")}
                      title={`${role.roleName} — ${module}: ${levelMeta[level].label}. Clique para alterar.`}
                    >
                      <span className="text-[12px] font-extrabold text-ebot-dark">{module}</span>
                      <span className={cn("flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-extrabold", levelMeta[level].chip)}>
                        <Icon className="size-3" />{levelMeta[level].label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <Modal open={draft !== null} onClose={() => setDraft(null)} title={draft?.roleId ? "Editar papel" : "Novo papel"} eyebrow="Empresa / Governança" description="Papéis organizam permissões em categorias de acesso. Membros convidados herdam os módulos liberados do papel." icon={UserRound}>
        {draft && (
          <div className="space-y-4">
            <div>
              <label htmlFor="role-name" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Nome do papel</label>
              <input id="role-name" autoFocus value={draft.roleName} onChange={(event) => setDraft({ ...draft, roleName: event.target.value })} placeholder="Ex.: Atendimento noturna, Coordenação de enfermagem…" className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
            </div>
            <div>
              <label htmlFor="role-desc" className="mb-1.5 block text-xs font-extrabold text-ebot-slate">Descrição</label>
              <textarea id="role-desc" rows={3} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="O que este papel pode fazer? Ex.: Opera o atendimento fora do horário comercial…" className="w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 py-2.5 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45" />
            </div>
            {!draft.roleId && (
              <p className="flex items-start gap-1.5 text-[11px] font-bold leading-4 text-ebot-muted">
                <Shield className="mt-0.5 size-3.5 shrink-0 text-ebot-primary" />
                O novo papel começa sem nenhum acesso. Toque nos módulos do card para liberar leitura, edição ou acesso total.
              </p>
            )}
            <div className="flex justify-end gap-2 border-t border-ebot-border/[0.10] pt-4">
              <Button variant="ghost" onClick={() => setDraft(null)}>Cancelar</Button>
              <Button onClick={saveRole}>{draft.roleId ? "Salvar alterações" : "Criar papel"}</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmationDialog
        open={deleting !== null}
        title={`Excluir papel "${deleting?.roleName ?? ""}"?`}
        description="Papéis com membros vinculados precisam ser esvaziados antes da exclusão. Membros sem papel perdem o acesso."
        confirmLabel="Excluir papel"
        onConfirm={removeRole}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}