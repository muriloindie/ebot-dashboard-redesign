"use client";

import { useMemo, useState } from "react";
import { KeyRound, Mail, ShieldCheck, Trash2, UserPlus, UsersRound } from "lucide-react";
import { deleteUser, listPermissionMatrix, listSectors, listUsers, newCompanyId, savePermissionMatrix, saveUser } from "@/lib/company/companyService";
import type { PermissionMatrix, StaffUser } from "@/lib/company/types";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/ui/Modal";
import { SearchField, PageHeader, SegmentedTabs } from "@/components/ui/Week1Primitives";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { cn } from "@/lib/cn";

const ALL = "Todos";
type Scope = typeof ALL | "online" | "ausente" | "offline";

const statusMeta: Record<StaffUser["status"], { label: string; dot: string; chip: string }> = {
  online: { label: "Online", dot: "bg-clinical-green", chip: "bg-clinical-green/[0.12] text-clinical-green" },
  ausente: { label: "Ausente", dot: "bg-clinical-orange", chip: "bg-clinical-orange/[0.12] text-clinical-orange" },
  offline: { label: "Offline", dot: "bg-clinical-slate/40", chip: "bg-clinical-surfaceMuted text-clinical-slate" }
};

const AVATAR_COLORS = ["#3A9DCA", "#E2574C", "#F2A34D", "#4CB782", "#8E6FBD", "#5A7873"];

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function modulesForRole(role: PermissionMatrix | undefined) {
  if (!role) return [];
  return Object.entries(role.modules)
    .filter(([, level]) => level !== "nenhum")
    .map(([module]) => module);
}

export function UsuariosPage() {
  const { toast } = useDemo();
  const [users, setUsers] = useState<StaffUser[]>(() => listUsers());
  const [sectors] = useState(() => listSectors());
  const [roles] = useState(() => listPermissionMatrix());
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<Scope>(ALL);
  const [deleting, setDeleting] = useState<StaffUser | null>(null);
  const [inviting, setInviting] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "", roleId: "", sectorId: "", status: "offline" as StaffUser["status"], avatarColor: AVATAR_COLORS[0] });
  const selectedRole = roles.find((item) => item.roleId === draft.roleId);

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const matchesScope = scope === ALL || user.status === scope;
      const matchesQuery = `${user.name} ${user.email} ${user.role} ${user.sectorName}`.toLowerCase().includes(query.toLowerCase());
      return matchesScope && matchesQuery;
    });
  }, [users, query, scope]);

  const stats: StatItem[] = useMemo(() => [
    { id: "total", label: "Membros", value: String(users.length), hint: `em ${sectors.filter((sector) => sector.active).length} setores`, tone: "blue", icon: UsersRound },
    { id: "online", label: "Online agora", value: String(users.filter((user) => user.status === "online").length), hint: "no plantão", tone: "green", icon: UserPlus },
    { id: "ausente", label: "Ausentes", value: String(users.filter((user) => user.status === "ausente").length), hint: "pausa ou intervalo", tone: "orange", icon: Mail }
  ], [users, sectors]);

  function invite() {
    if (!draft.name.trim() || !draft.email.trim()) {
      toast("Informe nome e e-mail do membro.", "warning");
      return;
    }
    if (!draft.roleId) {
      toast("Escolha um papel para definir as permissões de acesso.", "warning");
      return;
    }
    const sector = sectors.find((item) => item.id === draft.sectorId);
    const role = roles.find((item) => item.roleId === draft.roleId);
    const user: StaffUser = {
      id: newCompanyId("usr"),
      name: draft.name.trim(),
      email: draft.email.trim().toLowerCase(),
      role: role?.roleName ?? "Sem papel",
      sectorId: sector?.id ?? "",
      sectorName: sector?.name ?? "Sem setor",
      queueIds: [],
      status: draft.status,
      lastSeen: draft.status === "online" ? "agora" : "—",
      permissions: modulesForRole(role),
      createdAt: "agora",
      avatarColor: draft.avatarColor
    };
    if (role) {
      savePermissionMatrix({ ...role, usersCount: role.usersCount + 1 });
    }
    saveUser(user);
    setUsers(listUsers());
    setInviting(false);
    setDraft({ name: "", email: "", roleId: "", sectorId: "", status: "offline", avatarColor: AVATAR_COLORS[0] });
    toast(`Convite enviado para ${user.email}. O acesso ativo em breve.`);
  }

  function remove() {
    if (!deleting) return;
    const role = roles.find((item) => item.roleName === deleting.role);
    if (role) {
      savePermissionMatrix({ ...role, usersCount: Math.max(0, role.usersCount - 1) });
    }
    deleteUser(deleting.id);
    setUsers(listUsers());
    toast(`Acesso de "${deleting.name}" revogado.`);
    setDeleting(null);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Clínica / Equipe"
        title="Usuários"
        description="Equipe da unidade: perfil, setor de atuação e permissões definidas por papel em Permissões."
        action={<Button onClick={() => setInviting(true)}><UserPlus className="size-4" />Convidar membro</Button>}
      />

      <StatStrip items={stats} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchField value={query} onChange={setQuery} placeholder="Buscar por nome, e-mail ou papel…" />
        <SegmentedTabs
          tabs={[
            { id: ALL, label: "Todos", count: users.length },
            { id: "online", label: "Online", count: users.filter((user) => user.status === "online").length },
            { id: "ausente", label: "Ausentes", count: users.filter((user) => user.status === "ausente").length },
            { id: "offline", label: "Offline", count: users.filter((user) => user.status === "offline").length }
          ]}
          value={scope}
          onChange={(id) => setScope(id as Scope)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 p-10 text-center text-sm font-bold text-clinical-muted">Nenhum membro encontrado.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((user) => (
            <article key={user.id} className="flex flex-wrap items-center gap-4 rounded-[20px] border border-clinical-border/[0.12] bg-clinical-surface/80 p-4 shadow-[0_8px_24px_rgba(38,53,50,0.03)]">
              <div className="relative shrink-0">
                <span className="flex size-11 items-center justify-center rounded-2xl text-[13px] font-extrabold text-clinical-surface" style={{ backgroundColor: user.avatarColor }}>{initials(user.name)}</span>
                <span className={cn("absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-clinical-surface", statusMeta[user.status].dot)} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[14px] font-extrabold text-clinical-dark">{user.name}</h3>
                  <span className={cn("rounded-lg px-2 py-0.5 text-[10px] font-extrabold", statusMeta[user.status].chip)}>{statusMeta[user.status].label}</span>
                  <span className="rounded-lg bg-clinical-surfaceMuted px-2 py-0.5 text-[10px] font-extrabold text-clinical-slate">{user.role}</span>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] font-bold text-clinical-muted">
                  <span className="flex items-center gap-1"><Mail className="size-3.5" />{user.email}</span>
                  <span>· {user.sectorName}</span>
                  <span>· {user.queueIds.length} fila{user.queueIds.length === 1 ? "" : "s"}</span>
                  <span className={cn(user.status === "offline" && "hidden")}>· visto {user.lastSeen}</span>
                </p>
                {user.permissions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {user.permissions.slice(0, 4).map((permission) => (
                      <span key={permission} className="flex items-center gap-1 rounded-lg bg-clinical-blue/[0.08] px-2 py-0.5 text-[10px] font-extrabold text-clinical-blueText"><KeyRound className="size-3" />{permission}</span>
                    ))}
                    {user.permissions.length > 4 && <span className="rounded-lg bg-clinical-surfaceMuted px-2 py-0.5 text-[10px] font-extrabold text-clinical-slate">+{user.permissions.length - 4}</span>}
                  </div>
                )}
              </div>

              <button onClick={() => setDeleting(user)} className="rounded-xl p-2 text-clinical-muted transition hover:bg-clinical-red/10 hover:text-clinical-red" title="Revogar acesso">
                <Trash2 className="size-4" />
              </button>
            </article>
          ))}
        </div>
      )}

      <Modal open={inviting} onClose={() => setInviting(false)} title="Convidar membro">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="usr-name" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Nome completo</label>
              <input id="usr-name" autoFocus value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ex.: Ana Souza" className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
            </div>
            <div>
              <label htmlFor="usr-email" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">E-mail</label>
              <input id="usr-email" type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} placeholder="nome@ebotclinical.com.br" className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
            </div>
            <div>
              <label htmlFor="usr-role" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Papel (define as permissões)</label>
              <select id="usr-role" value={draft.roleId} onChange={(event) => setDraft({ ...draft, roleId: event.target.value })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
                <option value="">Selecione o papel…</option>
                {roles.map((role) => <option key={role.roleId} value={role.roleId}>{role.roleName} · {role.usersCount} membro{role.usersCount === 1 ? "" : "s"}</option>)}
              </select>
              {selectedRole && (
                <div className="mt-2 rounded-xl bg-clinical-blue/[0.08] px-3 py-2">
                  <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-clinical-blueText"><ShieldCheck className="size-3.5" />Este papel libera {modulesForRole(selectedRole).length} módulo{modulesForRole(selectedRole).length === 1 ? "" : "s"}:</p>
                  <p className="mt-0.5 text-[11px] font-bold leading-4 text-clinical-muted">{modulesForRole(selectedRole).length > 0 ? modulesForRole(selectedRole).join(", ") : "Nenhum módulo liberado — ajuste na matriz de Permissões."}</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="usr-sector" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Setor</label>
              <select id="usr-sector" value={draft.sectorId} onChange={(event) => setDraft({ ...draft, sectorId: event.target.value })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
                <option value="">Selecione…</option>
                {sectors.map((sector) => <option key={sector.id} value={sector.id}>{sector.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="usr-status" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Status inicial</label>
              <select id="usr-status" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as StaffUser["status"] })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="ausente">Ausente</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Cor do avatar</label>
              <div className="flex h-11 items-center gap-2">
                {AVATAR_COLORS.map((color) => (
                  <button key={color} onClick={() => setDraft({ ...draft, avatarColor: color })} className={cn("size-7 rounded-lg transition", draft.avatarColor === color && "ring-2 ring-clinical-blue ring-offset-2 ring-offset-clinical-surface")} style={{ backgroundColor: color }} title={color} />
                ))}
              </div>
            </div>
          </div>
          <p className="flex items-start gap-1.5 text-[11px] font-bold leading-4 text-clinical-muted">
            <KeyRound className="mt-0.5 size-3.5 shrink-0 text-clinical-blue" />
            As permissões de acesso seguem o papel escolhido na matriz de Permissões. Ao alterar um papel, todos os membros vinculados são atualizados. O membro será avisado por e-mail.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setInviting(false)}>Cancelar</Button>
            <Button onClick={invite}><UserPlus className="size-4" />Enviar convite</Button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        open={deleting !== null}
        title={`Revogar acesso de "${deleting?.name ?? ""}"?`}
        description="O usuário perde o acesso imediatamente e as conversas ativas são reatribuídas automaticamente."
        confirmLabel="Revogar acesso"
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}