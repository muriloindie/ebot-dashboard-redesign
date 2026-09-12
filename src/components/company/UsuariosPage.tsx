"use client";

import { useMemo, useState } from "react";
import { KeyRound, Mail, ShieldCheck, ShieldOff, Trash2, UserPlus, UserRound } from "lucide-react";
import { deleteSystemUser, listSystemUsers, saveSystemUser } from "@/lib/system/systemService";
import type { SystemUser } from "@/data/systemMock";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect } from "@/components/ui/ModalField";
import { SearchField, PageHeader, SegmentedTabs, StatusBadge } from "@/components/ui/Week1Primitives";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";

const ALL = "Todos";
type Scope = typeof ALL | "ativo" | "bloqueado" | "convite";

const statusTone: Record<SystemUser["status"], "green" | "red" | "orange"> = {
  ativo: "green",
  bloqueado: "red",
  convite: "orange"
};

const statusLabel: Record<SystemUser["status"], string> = {
  ativo: "Ativo",
  bloqueado: "Bloqueado",
  convite: "Convite pendente"
};

const AVATAR_COLORS = ["#6B942E", "#C13E3E", "#C97F12", "#A9D16C", "#8FA9B4", "#5D737E"];

const emptyDraft = { id: "", name: "", email: "", profile: "Gestor" as SystemUser["profile"], sector: "Atendimento", status: "convite" as SystemUser["status"], twoFactor: false };

export function UsuariosPage() {
  const { toast } = useDemo();
  const [users, setUsers] = useState<SystemUser[]>(() => listSystemUsers());
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<Scope>(ALL);
  const [deleting, setDeleting] = useState<SystemUser | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SystemUser | null>(null);
  const [draft, setDraft] = useState(emptyDraft);

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const matchesScope = scope === ALL || user.status === scope;
      const matchesQuery = `${user.name} ${user.email} ${user.profile} ${user.sector}`.toLowerCase().includes(query.toLowerCase());
      return matchesScope && matchesQuery;
    });
  }, [users, query, scope]);


  function openInvite() {
    setEditing(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(user: SystemUser) {
    setEditing(user);
    setDraft({ id: user.id, name: user.name, email: user.email, profile: user.profile, sector: user.sector, status: user.status, twoFactor: user.twoFactor });
    setFormOpen(true);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.email.trim()) {
      toast("Informe nome e e-mail do usuário.", "warning");
      return;
    }
    const base = editing ?? users.find((user) => user.id === draft.id);
    const next: SystemUser = {
      id: editing?.id ?? `sys-${Date.now().toString(36)}`,
      name: draft.name.trim(),
      email: draft.email.trim(),
      profile: draft.profile,
      sector: draft.sector.trim() || "—",
      status: draft.status,
      lastAccess: base?.lastAccess ?? "—",
      twoFactor: draft.twoFactor,
      createdAt: base?.createdAt ?? "agora",
      avatarColor: base?.avatarColor ?? AVATAR_COLORS[users.length % AVATAR_COLORS.length]
    };
    saveSystemUser(next);
    setUsers(listSystemUsers());
    setFormOpen(false);
    toast(editing ? `Usuário "${next.name}" atualizado.` : `Convite enviado para ${next.email} (demo).`);
  }

  function toggleBlock(user: SystemUser) {
    const next = user.status === "bloqueado" ? "ativo" : "bloqueado";
    saveSystemUser({ ...user, status: next });
    setUsers(listSystemUsers());
    toast(next === "bloqueado" ? `"${user.name}" foi bloqueado.` : `"${user.name}" teve o acesso reativado.`);
  }

  function remove() {
    if (!deleting) return;
    deleteSystemUser(deleting.id);
    setUsers(listSystemUsers());
    toast(`Usuário "${deleting.name}" removido.`);
    setDeleting(null);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Sistema / Acessos"
        title="Usuários"
        description="Contas com acesso à plataforma Ê-Bot: perfis de sistema, bloqueios, 2FA e convites."
        action={<Button onClick={openInvite}><UserPlus className="size-4" />Convidar usuário</Button>}
      />

      <div className="flex flex-col gap-2 rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/70 p-2.5 lg:flex-row lg:items-center lg:justify-between">
        <SearchField value={query} onChange={setQuery} placeholder="Buscar por nome, e-mail, perfil ou setor" />
        <SegmentedTabs
          tabs={[
            { id: ALL, label: "Todos", count: users.length },
            { id: "ativo", label: "Ativos", count: users.filter((user) => user.status === "ativo").length },
            { id: "bloqueado", label: "Bloqueados", count: users.filter((user) => user.status === "bloqueado").length },
            { id: "convite", label: "Convites", count: users.filter((user) => user.status === "convite").length }
          ]}
          value={scope}
          onChange={(id) => setScope(id as Scope)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-10 text-center text-sm font-bold text-ebot-muted">Nenhum usuário encontrado.</div>
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/75 shadow-[0_8px_24px_rgba(4,27,21,0.04)]">
          <div className="ebot-scrollbar overflow-x-auto" tabIndex={0} aria-label="Lista de usuários do sistema">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <caption className="sr-only">Usuários do sistema</caption>
              <thead className="border-b border-ebot-border/[0.12] bg-ebot-surfaceMuted/60 text-[11px] font-extrabold uppercase tracking-[0.09em] text-ebot-muted">
                <tr>
                  <th scope="col" className="px-4 py-3.5">Usuário</th>
                  <th scope="col" className="px-4 py-3.5">Perfil</th>
                  <th scope="col" className="px-4 py-3.5">Setor</th>
                  <th scope="col" className="px-4 py-3.5">Último acesso</th>
                  <th scope="col" className="px-4 py-3.5">2FA</th>
                  <th scope="col" className="px-4 py-3.5">Status</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ebot-border/[0.10]">
                {filtered.map((user) => (
                  <tr key={user.id} className="transition hover:bg-ebot-primary/[0.035]">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" className="shrink-0" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-ebot-dark">{user.name}</p>
                          <p className="flex items-center gap-1 truncate text-[11px] font-bold text-ebot-muted"><Mail className="size-3" />{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold", user.profile === "Administrador" ? "bg-ebot-primary/[0.10] text-ebot-primaryText" : user.profile === "Suporte" ? "bg-ebot-teal/[0.10] text-ebot-teal" : "bg-ebot-surfaceMuted text-ebot-slate")}>
                        <UserRound className="size-3" />{user.profile}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-ebot-slate">{user.sector}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-ebot-slate">{user.lastAccess}</td>
                    <td className="px-4 py-3.5">
                      {user.twoFactor ? <ShieldCheck className="size-4 text-ebot-green" aria-label="2FA ativo" /> : <ShieldOff className="size-4 text-ebot-muted" aria-label="2FA desativado" />}
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge label={statusLabel[user.status]} tone={statusTone[user.status]} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleBlock(user)} title={user.status === "bloqueado" ? "Reativar acesso" : "Bloquear acesso"} className={cn("rounded-xl p-2 transition", user.status === "bloqueado" ? "text-ebot-muted hover:bg-ebot-green/10 hover:text-ebot-green" : "text-ebot-muted hover:bg-ebot-orange/10 hover:text-ebot-orange")}>
                          <ShieldOff className="size-4" />
                        </button>
                        <button onClick={() => openEdit(user)} title="Editar usuário" className="rounded-xl p-2 text-ebot-muted transition hover:bg-ebot-surfaceMuted hover:text-ebot-dark"><UserRound className="size-4" /></button>
                        <button onClick={() => setDeleting(user)} title="Remover usuário" className="rounded-xl p-2 text-ebot-muted transition hover:bg-ebot-red/10 hover:text-ebot-red"><Trash2 className="size-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Editar usuário do sistema" : "Convidar usuário do sistema"}
        eyebrow="Sistema / Acessos"
        description="O perfil define o nível de acesso do usuário dentro da plataforma (demo local)."
        icon={UserPlus}
        className="max-w-xl"
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField label="Nome" icon={UserRound} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ex.: Tiago Barros" required />
            <ModalField label="E-mail" icon={Mail} type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} placeholder="nome@ebot.com.br" required />
            <ModalSelect label="Perfil de sistema" value={draft.profile} onChange={(event) => setDraft({ ...draft, profile: event.target.value as SystemUser["profile"] })}>
              <option>Administrador</option><option>Gestor</option><option>Suporte</option><option>Observador</option>
            </ModalSelect>
            <ModalField label="Setor" value={draft.sector} onChange={(event) => setDraft({ ...draft, sector: event.target.value })} placeholder="Ex.: Pedidos" />
            <ModalSelect label="Status" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as SystemUser["status"] })}>
              <option value="ativo">Ativo</option><option value="convite">Convite pendente</option><option value="bloqueado">Bloqueado</option>
            </ModalSelect>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={draft.twoFactor}
            onClick={() => setDraft({ ...draft, twoFactor: !draft.twoFactor })}
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/30 px-3.5 py-2.5 text-left transition hover:border-ebot-border/20"
          >
            <span className="flex items-center gap-2 text-sm font-extrabold text-ebot-dark">
              <KeyRound className={cn("size-4", draft.twoFactor ? "text-ebot-green" : "text-ebot-muted")} />
              Exigir autenticação em dois fatores
            </span>
            <span className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors", draft.twoFactor ? "bg-ebot-green" : "bg-ebot-surfaceMuted")}>
              <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all", draft.twoFactor ? "left-[18px]" : "left-0.5")} />
            </span>
          </button>
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button type="submit"><UserPlus className="size-4" />{editing ? "Salvar alterações" : "Enviar convite"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title={`Remover usuário "${deleting?.name ?? ""}"?`}
        description="O acesso à plataforma será revogado imediatamente para este usuário (demo local)."
        confirmLabel="Remover usuário"
      />
    </div>
  );
}
