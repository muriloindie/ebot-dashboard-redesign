"use client";

import { useMemo, useRef, useState } from "react";
import {
  Download,
  FileCode2,
  FileText,
  FileType2,
  Folder,
  FolderOpen,
  Grid3x3,
  Image as ImageIcon,
  List,
  Lock,
  MoreHorizontal,
  Pencil,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Star,
  Table2,
  Trash2,
  Undo2,
  Upload,
  Users
} from "lucide-react";
import { deleteFile, listFiles, logFileAccess, newFileId, saveFile } from "@/lib/automation/n8nService";
import type { DriveFile, DriveFileKind } from "@/lib/automation/types";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { PageHeader, SearchField, SegmentedTabs, StatePanel } from "@/components/ui/Week1Primitives";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import { cn } from "@/lib/cn";

const ALL = "Todos";
const kindFilters = [ALL, "pdf", "image", "md", "xlsx", "docx"] as const;

const kindMeta: Record<DriveFileKind, { icon: typeof FileText; label: string; tile: string; dot: string }> = {
  pdf: { icon: FileText, label: "PDF", tile: "from-clinical-red/[0.16] to-clinical-red/[0.04]", dot: "bg-clinical-red" },
  image: { icon: ImageIcon, label: "Imagem", tile: "from-clinical-blue/[0.14] to-clinical-blue/[0.03]", dot: "bg-clinical-blue" },
  md: { icon: FileCode2, label: "Markdown", tile: "from-clinical-slate/[0.14] to-clinical-slate/[0.03]", dot: "bg-clinical-slate" },
  xlsx: { icon: Table2, label: "Planilha", tile: "from-clinical-green/[0.16] to-clinical-green/[0.04]", dot: "bg-clinical-green" },
  docx: { icon: FileType2, label: "Documento", tile: "from-clinical-blue/[0.14] to-clinical-blue/[0.03]", dot: "bg-clinical-blue" }
};

function FileThumb({ file, className }: { file: DriveFile; className?: string }) {
  const meta = kindMeta[file.kind];
  const Icon = meta.icon;
  return (
    <div className={cn("relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-t-[22px] bg-gradient-to-br", meta.tile, className)}>
      <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "radial-gradient(rgba(58,157,202,0.16) 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
      {file.kind === "image" ? (
        <div className="relative z-10 flex size-16 items-center justify-center rounded-2xl bg-clinical-surface/80 shadow-[0_8px_24px_rgba(38,53,50,0.14)]">
          <Icon className="size-7 text-clinical-blue" />
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-clinical-surface/85 shadow-[0_8px_24px_rgba(38,53,50,0.14)]">
            <Icon className="size-6 text-clinical-dark" />
          </span>
          <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white", meta.dot)}>{meta.label}</span>
        </div>
      )}
      {file.sensitivity === "sensivel" ? (
        <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-clinical-dark/70 px-2 py-0.5 text-[9px] font-extrabold text-white backdrop-blur-sm">
          <Lock className="size-2.5" />Sensível
        </span>
      ) : null}
      {file.starred ? (
        <span className="absolute left-2 top-2 z-10 inline-flex size-6 items-center justify-center rounded-full bg-clinical-orange text-white shadow-sm">
          <Star className="size-3 fill-current" />
        </span>
      ) : null}
    </div>
  );
}

function DocumentPreview({ file }: { file: DriveFile }) {
  if (file.kind === "image") {
    return (
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-clinical-border/[0.12] bg-gradient-to-br from-clinical-blue/[0.10] via-clinical-surfaceMuted to-clinical-teal/[0.08]">
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="flex size-20 items-center justify-center rounded-3xl bg-clinical-surface shadow-[0_16px_40px_rgba(38,53,50,0.16)]">
            <ImageIcon className="size-9 text-clinical-blue" />
          </span>
          <p className="max-w-xs text-[13px] font-bold leading-5 text-clinical-slate">Prévia de imagem preparada para o viewer do backend. Nesta etapa exibimos o marcador do arquivo {file.name}.</p>
        </div>
      </div>
    );
  }
  if (file.kind === "xlsx") {
    return (
      <div className="overflow-hidden rounded-3xl border border-clinical-border/[0.12] bg-clinical-surface">
        <div className="flex items-center justify-between border-b border-clinical-border/[0.10] bg-clinical-green/[0.06] px-4 py-2.5">
          <span className="inline-flex items-center gap-2 text-[11px] font-extrabold text-clinical-green"><Table2 className="size-3.5" />Planilha · quebra por aba</span>
          <span className="rounded-full bg-clinical-green/[0.12] px-2 py-0.5 text-[10px] font-extrabold text-clinical-green">{file.size}</span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-px overflow-hidden rounded-xl border border-clinical-border/[0.10] bg-clinical-border/[0.12]">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className={cn("bg-clinical-surface px-3 py-2 text-[11px] font-bold text-clinical-slate", index < 4 && "bg-clinical-surfaceMuted text-[10px] font-extrabold uppercase tracking-wide text-clinical-muted")}>
                {index < 4 ? ["Nome do arquivo", "Paciente", "Pasta", "Tamanho"][index] : <span className="block h-1.5 w-3/4 rounded-full bg-clinical-border/40" />}
              </div>
            ))}
            <div className="bg-clinical-surface px-3 py-2 text-[11px] font-extrabold text-clinical-blueText">{file.name}</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-3xl border border-clinical-border/[0.12] bg-clinical-surface">
      <div className="flex items-center justify-between border-b border-clinical-border/[0.10] bg-clinical-surfaceMuted/50 px-4 py-2.5">
        <span className="inline-flex items-center gap-2 text-[11px] font-extrabold text-clinical-slate">{kindMeta[file.kind].label} · {file.size}</span>
        <span className="text-[10px] font-extrabold text-clinical-muted">Prévia do documento — renderizado pelo viewer do backend</span>
      </div>
      <div className="space-y-2.5 p-6">
        <div className="flex items-center justify-between">
          <span className="block h-3 w-1/2 rounded-full bg-clinical-dark/[0.16]" />
          <span className="block h-2 w-10 rounded-full bg-clinical-border/50" />
        </div>
        <div className="flex gap-2">
          <span className="block h-2 w-24 rounded-full bg-clinical-blue/25" />
          <span className="block h-2 w-16 rounded-full bg-clinical-teal/25" />
          <span className="block h-2 w-20 rounded-full bg-clinical-border/50" />
        </div>
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="flex gap-2">
            <span className={cn("block h-2 rounded-full", index % 3 === 0 ? "w-2/3 bg-clinical-border/45" : index % 3 === 1 ? "w-3/4 bg-clinical-border/35" : "w-1/2 bg-clinical-border/30")} />
            {index % 4 === 2 ? <span className="block h-2 w-1/5 rounded-full bg-clinical-orange/20" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

const emptyUpload = { name: "", kind: "pdf" as DriveFileKind, folder: "Arquivos do paciente", patientName: "", sensitivity: "sensivel" as DriveFile["sensitivity"] };

export function FilesPage() {
  const { toast, profile } = useDemo();
  const [files, setFiles] = useState<DriveFile[]>(() => listFiles());
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<string>(ALL);
  const [folder, setFolder] = useState("Todas");
  const [view, setView] = useState("grid");
  const [preview, setPreview] = useState<DriveFile | null>(null);
  const [deleting, setDeleting] = useState<DriveFile | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [sharing, setSharing] = useState<DriveFile | null>(null);
  const [upload, setUpload] = useState(emptyUpload);
  const [dragging, setDragging] = useState(false);
  const [shareGrant, setShareGrant] = useState({ granteeType: "user" as "user" | "role", grantee: "", level: "view" as "view" | "edit" });
  const inputRef = useRef<HTMLInputElement>(null);

  const folders = useMemo(() => ["Todas", ...Array.from(new Set(files.map((file) => file.folder))).sort()], [files]);

  const filtered = useMemo(() => {
    return files.filter((file) => {
      const matchesFolder = folder === "Todas" || file.folder === folder;
      const matchesKind = kindFilter === ALL || file.kind === kindFilter;
      const matchesQuery = `${file.name} ${file.patientName ?? ""} ${file.folder} ${file.uploadedBy}`.toLowerCase().includes(query.toLowerCase());
      return matchesFolder && matchesKind && matchesQuery;
    });
  }, [files, folder, kindFilter, query]);

  const stats: StatItem[] = useMemo(() => {
    const pendingConsent = files.filter((file) => file.consent && !file.consent.granted).length;
    return [
      { id: "files", label: "Arquivos", value: String(files.length), hint: "no drive da unidade", tone: "blue", icon: FileText },
      { id: "folders", label: "Pastas", value: String(new Set(files.map((file) => file.folder)).size), hint: "organização ativa", tone: "teal", icon: Folder },
      { id: "starred", label: "Favoritos", value: String(files.filter((file) => file.starred).length), hint: "acesso rápido", tone: "orange", icon: Star },
      { id: "pending", label: "Consentimentos", value: String(pendingConsent), hint: pendingConsent ? "aguardando do titular" : "todos concedidos", tone: pendingConsent ? "neutral" : "green", icon: ShieldAlert }
    ];
  }, [files]);

  function withCurrentFile(id: string, updater: (file: DriveFile) => DriveFile) {
    const file = files.find((item) => item.id === id);
    if (!file) return;
    saveFile(updater(file));
    setFiles(listFiles());
    setPreview(listFiles().find((item) => item.id === id) ?? null);
  }

  function toggleStar(file: DriveFile) {
    const dir = !file.starred;
    withCurrentFile(file.id, (current) => ({ ...current, starred: dir }));
    toast(dir ? "Adicionado aos favoritos." : "Removido dos favoritos.");
  }

  function download(file: DriveFile) {
    logFileAccess(file.id, profile.name, "baixou");
    setFiles(listFiles());
    toast(`Download de "${file.name}" registrado na auditoria.`);
  }

  function pickUploadedFile(uploaded: File) {
    const ext = uploaded.name.split(".").pop()?.toLowerCase() ?? "";
    const kind: DriveFileKind = ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp" ? "image" : ext === "md" ? "md" : ext === "xlsx" || ext === "csv" ? "xlsx" : ext === "doc" || ext === "docx" ? "docx" : "pdf";
    setUpload((current) => ({ ...current, name: uploaded.name, kind }));
    toast(`"${uploaded.name}" selecionado. Confirme os metadados e envie.`);
  }

  function confirmUpload() {
    if (!upload.name) {
      toast("Selecione um arquivo antes de enviar.", "warning");
      return;
    }
    const file: DriveFile = {
      id: newFileId(),
      name: upload.name,
      kind: upload.kind,
      size: `${(1 + Math.round(Math.random() * 40) / 10).toFixed(1).replace(".", ",")} MB`,
      scope: "patient",
      patientId: "",
      patientName: upload.patientName || "Sem vínculo de paciente",
      kbId: undefined,
      folder: upload.folder,
      sensitivity: upload.sensitivity,
      consent: upload.sensitivity === "sensivel" ? { granted: false, date: "—", purpose: "Aguardando consentimento do titular" } : null,
      retention: upload.sensitivity === "sensivel" ? "Bloqueado até consentimento" : "Indeterminado (base legal)",
      starred: false,
      uploadedBy: profile.name,
      updatedAt: "agora",
      permissions: [{ id: "perm-" + Math.random().toString(36).slice(2, 7), granteeType: "role", grantee: upload.sensitivity === "sensivel" ? "Profissional" : "Administrador", level: "edit" }],
      audit: [{ id: "aud-" + Math.random().toString(36).slice(2, 7), user: profile.name, action: "enviou", at: "agora" }]
    };
    saveFile(file);
    setFiles(listFiles());
    setUploadOpen(false);
    setUpload(emptyUpload);
    toast(`"${file.name}" enviado para ${file.folder}.`);
  }

  function remove() {
    if (!deleting) return;
    deleteFile(deleting.id);
    setFiles(listFiles());
    setDeleting(null);
    if (preview?.id === deleting.id) setPreview(null);
    toast(`Arquivo "${deleting.name}" excluído de todas as pastas.`);
  }

  function addShare() {
    if (!sharing) return;
    if (!shareGrant.grantee.trim()) {
      toast("Informe quem recebe o acesso.", "warning");
      return;
    }
    withCurrentFile(sharing.id, (current) => ({
      ...current,
      permissions: [...current.permissions, { id: "perm-" + Math.random().toString(36).slice(2, 7), granteeType: shareGrant.granteeType, grantee: shareGrant.grantee, level: shareGrant.level }]
    }));
    toast(`${shareGrant.grantee} agora tem acesso${shareGrant.level === "edit" ? " de edição" : " de leitura"} ao arquivo.`);
    setShareGrant({ granteeType: "user", grantee: "", level: "view" });
  }

  const patients = Array.from(new Set(files.filter((file) => file.patientName).map((file) => file.patientName as string))).sort();

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Pacientes / Documentos"
        title="Arquivos"
        description="Drive de documentos do paciente e da base de conhecimento: upload, pastas, consentimento, permissões e auditoria de acesso — pronto para conectar ao armazenamento do backend."
        action={<Button onClick={() => setUploadOpen(true)}><Upload className="size-4" />Enviar arquivo</Button>}
      />

      <StatStrip items={stats} />

      <div className="flex flex-col gap-4 lg:flex-row">
        <aside className="shrink-0 lg:w-56" aria-label="Pastas de arquivos">
          <div className="flex flex-col gap-1 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 p-3 shadow-[0_8px_24px_rgba(38,53,50,0.04)]">
            {folders.map((item) => {
              const count = item === "Todas" ? files.length : files.filter((file) => file.folder === item).length;
              const active = folder === item;
              return (
                <button key={item} type="button" onClick={() => setFolder(item)} className={cn("flex items-center justify-between gap-2 rounded-2xl px-3 py-2.5 text-left text-[13px] font-extrabold transition", active ? "bg-clinical-blue/[0.10] text-clinical-blueText" : "text-clinical-slate hover:bg-clinical-surfaceMuted/60 hover:text-clinical-dark")}>
                  <span className="flex min-w-0 items-center gap-2 truncate">
                    {active ? <FolderOpen className="size-4 shrink-0" /> : <Folder className="size-4 shrink-0" />}
                    <span className="truncate">{item}</span>
                  </span>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold", active ? "bg-clinical-blue/[0.12] text-clinical-blueText" : "bg-clinical-surfaceMuted text-clinical-muted")}>{count}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <SegmentedTabs tabs={kindFilters.map((item) => ({ id: item, label: item === ALL ? "Todos" : kindMeta[item as DriveFileKind].label }))} value={kindFilter} onChange={setKindFilter} />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-52"><SearchField value={query} onChange={setQuery} placeholder="Buscar arquivo…" /></div>
              <ViewSwitch views={[{ id: "grid", label: "Grade", icon: Grid3x3 }, { id: "list", label: "Lista", icon: List }]} value={view} onChange={setView} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <StatePanel icon={FolderOpen} title={query || folder !== "Todas" || kindFilter !== ALL ? "Nenhum arquivo encontrado" : "Nenhum arquivo ainda"} description={query || folder !== "Todas" || kindFilter !== ALL ? "Ajuste a busca, a pasta ou o tipo de arquivo." : "Envie o primeiro documento para o drive da unidade."} />
          ) : view === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filtered.map((file) => (
                <article key={file.id} className="group flex flex-col overflow-hidden rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 shadow-[0_8px_24px_rgba(38,53,50,0.04)] transition hover:border-clinical-blue/25 hover:shadow-clinical">
                  <button type="button" onClick={() => setPreview(file)} className="w-full text-left" aria-label={`Abrir ${file.name}`}>
                    <FileThumb file={file} />
                  </button>
                  <div className="flex items-start justify-between gap-2 p-4">
                    <div className="min-w-0">
                      <h2 className="truncate text-[13px] font-extrabold tracking-tight text-clinical-dark">{file.name}</h2>
                      <p className="mt-0.5 truncate text-[11px] font-bold text-clinical-muted">{file.patientName ?? "Base de conhecimento"} · {file.folder}</p>
                      <p className="text-[11px] font-bold text-clinical-muted">{file.size} · {file.updatedAt}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button variant="ghost" size="sm" aria-label="Favoritar ou desfavoritar" onClick={() => toggleStar(file)}><Star className={cn("size-4", file.starred && "fill-clinical-orange text-clinical-orange")} /></Button>
                      <MoreHorizontal className="size-4 text-clinical-muted" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 shadow-[0_8px_24px_rgba(38,53,50,0.04)]">
              <ul className="divide-y divide-clinical-border/[0.08]">
                {filtered.map((file) => {
                  const meta = kindMeta[file.kind];
                  const Icon = meta.icon;
                  return (
                    <li key={file.id} className="flex items-center gap-3 px-4 py-3 transition hover:bg-clinical-surfaceMuted/30">
                      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-2xl", file.sensitivity === "sensivel" ? "bg-clinical-red/[0.12] text-clinical-red" : "bg-clinical-blue/[0.08] text-clinical-blueText")}>
                        <Icon className="size-4" />
                      </span>
                      <button type="button" onClick={() => setPreview(file)} className="min-w-0 flex-1 text-left" aria-label={`Abrir ${file.name}`}>
                        <p className="truncate text-[13px] font-extrabold text-clinical-dark">{file.name}</p>
                        <p className="truncate text-[11px] font-bold text-clinical-muted">{file.patientName ?? "Base de conhecimento"} · {file.folder} · {file.size}</p>
                      </button>
                      <span className={cn("hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold sm:inline", file.sensitivity === "sensivel" ? "bg-clinical-orange/[0.12] text-clinical-orange" : "bg-clinical-green/[0.12] text-clinical-green")}>
                        {file.sensitivity === "sensivel" ? "Sensível" : "Geral"}
                      </span>
                      <span className="hidden shrink-0 text-[11px] font-extrabold text-clinical-muted lg:inline">{file.uploadedBy}</span>
                      <button type="button" onClick={() => toggleStar(file)} className="shrink-0" aria-label="Favoritar ou desfavoritar">
                        <Star className={cn("size-4", file.starred ? "fill-clinical-orange text-clinical-orange" : "text-clinical-muted")} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Drawer open={Boolean(preview)} onClose={() => setPreview(null)} title={preview?.name ?? "Arquivo"} description={preview ? `${kindMeta[preview.kind].label} · ${preview.size} · ${preview.folder}` : undefined} width="max-w-4xl">
        {preview ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="min-w-0">
              <DocumentPreview file={preview} />
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => download(preview)}><Download className="size-4" />Baixar</Button>
                <Button variant="secondary" size="sm" onClick={() => setSharing(preview)}><Share2 className="size-4" />Compartilhar</Button>
                <Button variant="secondary" size="sm" onClick={() => toggleStar(preview)}><Star className={cn("size-4", preview.starred && "fill-clinical-orange text-clinical-orange")} />{preview.starred ? "Favorito" : "Favoritar"}</Button>
                <Button variant="ghost" size="sm" className="text-clinical-red hover:bg-clinical-red/[0.08] hover:text-clinical-red" onClick={() => setDeleting(preview)}><Trash2 className="size-4" />Excluir</Button>
              </div>
            </div>
            <aside className="space-y-4">
              <section className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-4">
                <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-clinical-dark"><ShieldCheck className="size-4 text-clinical-teal" />Segurança</h3>
                <dl className="mt-3 space-y-2 text-[13px]">
                  <div><dt className="text-[11px] font-extrabold uppercase tracking-wide text-clinical-muted">Classificação</dt><dd className="font-extrabold text-clinical-dark">{preview.sensitivity === "sensivel" ? "Dado sensível" : "Geral"}</dd></div>
                  <div><dt className="text-[11px] font-extrabold uppercase tracking-wide text-clinical-muted">Retenção</dt><dd className="font-bold text-clinical-slate">{preview.retention}</dd></div>
                  <div><dt className="text-[11px] font-extrabold uppercase tracking-wide text-clinical-muted">Consentimento</dt>
                    <dd className={cn("font-extrabold", preview.consent ? (preview.consent.granted ? "text-clinical-green" : "text-clinical-orange") : "text-clinical-slate")}>
                      {preview.consent ? (preview.consent.granted ? "Concedido" : "Pendente") : "Não se aplica"}
                    </dd>
                    {preview.consent ? <dd className="mt-1 text-[11px] font-bold leading-4 text-clinical-muted">{preview.consent.purpose}{preview.consent.granted ? ` · ${preview.consent.date}` : ""}</dd> : null}
                  </div>
                  <div><dt className="text-[11px] font-extrabold uppercase tracking-wide text-clinical-muted">Vínculo</dt><dd className="font-bold text-clinical-slate">{preview.patientName ?? "Base de conhecimento"}{preview.patientId ? ` (${preview.patientId})` : ""}</dd></div>
                </dl>
              </section>

              <section className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-4">
                <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-clinical-dark"><Users className="size-4 text-clinical-blue" />Permissões</h3>
                <ul className="mt-3 space-y-1.5">
                  {preview.permissions.map((permission) => (
                    <li key={permission.id} className="flex items-center justify-between gap-2 rounded-xl bg-clinical-surface px-3 py-2">
                      <span className="text-[12px] font-extrabold text-clinical-dark">{permission.grantee}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-extrabold", permission.level === "edit" ? "bg-clinical-blue/[0.10] text-clinical-blueText" : "bg-clinical-surfaceMuted text-clinical-muted")}>
                        {permission.level === "edit" ? "Pode editar" : "Somente leitura"}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={() => setSharing(preview)}><Share2 className="size-3.5" />Gerenciar acesso</Button>
              </section>

              <section className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-4">
                <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-clinical-dark"><ShieldAlert className="size-4 text-clinical-orange" />Auditoria</h3>
                <ul className="mt-3 space-y-2">
                  {preview.audit.slice(0, 5).map((entry) => (
                    <li key={entry.id} className="flex items-center justify-between gap-2 text-[12px]">
                      <span className="min-w-0 truncate font-extrabold text-clinical-dark">{entry.user}</span>
                      <span className="shrink-0 font-bold text-clinical-muted">{entry.action} · {entry.at}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        ) : null}
      </Drawer>

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Enviar arquivo" eyebrow="Drive de arquivos" description="O arquivo entra com metadados de consentimento e permissões. O storage real será conectado pelo backend." icon={Upload} className="max-w-xl">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => { event.preventDefault(); setDragging(false); if (event.dataTransfer.files[0]) pickUploadedFile(event.dataTransfer.files[0]); }}
            className={cn("flex w-full flex-col items-center gap-3 rounded-3xl border-2 border-dashed px-6 py-10 text-center transition", dragging ? "border-clinical-blue/60 bg-clinical-blue/[0.06]" : "border-clinical-border/[0.18] bg-clinical-surfaceMuted/30 hover:border-clinical-blue/40 hover:bg-clinical-blue/[0.04]")}
          >
            <span className={cn("flex size-14 items-center justify-center rounded-2xl transition", dragging ? "bg-clinical-blue text-white" : "bg-clinical-blue/[0.10] text-clinical-blue")}>
              {upload.name ? <Undo2 className="size-6" /> : <Upload className="size-6" />}
            </span>
            <div>
              <p className="text-sm font-extrabold text-clinical-dark">{upload.name || "Arraste um arquivo ou clique para selecionar"}</p>
              <p className="mt-1 text-[12px] font-bold text-clinical-muted">PDF, DOCX, XLSX, imagens e Markdown — até 25 MB</p>
            </div>
            <input ref={inputRef} type="file" className="hidden" onChange={(event) => { const picked = event.target.files?.[0]; if (picked) pickUploadedFile(picked); }} />
          </button>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="up-folder" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Pasta de destino</label>
              <select id="up-folder" value={upload.folder} onChange={(event) => setUpload({ ...upload, folder: event.target.value })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
                {folders.filter((item) => item !== "Todas").map((item) => <option key={item}>{item}</option>)}
                <option>Nova pasta</option>
              </select>
            </div>
            <div>
              <label htmlFor="up-patient" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Vincular a paciente (opcional)</label>
              <select id="up-patient" value={upload.patientName} onChange={(event) => setUpload({ ...upload, patientName: event.target.value })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
                <option value="">Sem vínculo</option>
                {patients.map((patient) => <option key={patient}>{patient}</option>)}
              </select>
            </div>
          </div>

          <fieldset>
            <legend className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Classificação do conteúdo</legend>
            <div className="flex gap-2">
              {(["sensivel", "geral"] as const).map((sensitivity) => (
                <button key={sensitivity} type="button" onClick={() => setUpload({ ...upload, sensitivity })} className={cn("flex h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl border text-xs font-extrabold transition", upload.sensitivity === sensitivity ? "border-clinical-blue/40 bg-clinical-blue/[0.10] text-clinical-blueText" : "border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 text-clinical-muted")}>
                  {sensitivity === "sensivel" ? <Lock className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
                  {sensitivity === "sensivel" ? "Dado sensível (LGPD)" : "Informação geral"}
                </button>
              ))}
            </div>
            {upload.sensitivity === "sensivel" ? (
              <p className="mt-2 flex items-start gap-1.5 text-[11px] font-bold leading-4 text-clinical-orange">
                <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
                O arquivo fica bloqueado até o consentimento do titular ser registrado. Consulte a política de retenção da unidade.
              </p>
            ) : null}
          </fieldset>

          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.10] pt-4">
            <Button variant="ghost" onClick={() => { setUploadOpen(false); setUpload(emptyUpload); }}>Cancelar</Button>
            <Button onClick={confirmUpload}><Upload className="size-4" />Enviar arquivo</Button>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(sharing)} onClose={() => setSharing(null)} title="Compartilhar arquivo" eyebrow="Permissões de acesso" description={sharing ? `Controle quem acessa "${sharing.name}" e com qual nível.` : undefined} icon={Share2} className="max-w-lg">
        {sharing ? (
          <div className="space-y-4">
            <ul className="space-y-1.5">
              {sharing.permissions.map((permission) => (
                <li key={permission.id} className="flex items-center justify-between gap-2 rounded-2xl bg-clinical-surfaceMuted/40 px-3 py-2.5">
                  <span className="inline-flex items-center gap-2 text-[13px] font-extrabold text-clinical-dark">
                    {permission.granteeType === "role" ? <Users className="size-4 text-clinical-blue" /> : <Pencil className="size-4 text-clinical-teal" />}
                    {permission.grantee}
                  </span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-extrabold", permission.level === "edit" ? "bg-clinical-blue/[0.10] text-clinical-blueText" : "bg-clinical-surfaceMuted text-clinical-muted")}>
                    {permission.level === "edit" ? "Edição" : "Leitura"}
                  </span>
                </li>
              ))}
            </ul>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="share-type" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Tipo</label>
                <select id="share-type" value={shareGrant.granteeType} onChange={(event) => setShareGrant({ ...shareGrant, granteeType: event.target.value as "user" | "role" })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
                  <option value="user">Pessoa específica</option>
                  <option value="role">Perfil / função</option>
                </select>
              </div>
              <div>
                <label htmlFor="share-grantee" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">{shareGrant.granteeType === "role" ? "Perfil" : "Pessoa"}</label>
                <input id="share-grantee" value={shareGrant.grantee} onChange={(event) => setShareGrant({ ...shareGrant, grantee: event.target.value })} placeholder={shareGrant.granteeType === "role" ? "Ex.: Recepção" : "Ex.: Dra. Camila Duarte"} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
              </div>
            </div>
            <div>
              <label htmlFor="share-level" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Nível de acesso</label>
              <div className="flex gap-2">
                {(["view", "edit"] as const).map((level) => (
                  <button key={level} type="button" onClick={() => setShareGrant({ ...shareGrant, level })} className={cn("h-11 flex-1 rounded-2xl border text-xs font-extrabold transition", shareGrant.level === level ? "border-clinical-blue/40 bg-clinical-blue/[0.10] text-clinical-blueText" : "border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 text-clinical-muted")}>
                    {level === "edit" ? "Pode editar" : "Somente leitura"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-clinical-border/[0.10] pt-4">
              <Button variant="ghost" onClick={() => setSharing(null)}>Concluir</Button>
              <Button onClick={addShare}><Share2 className="size-4" />Conceder acesso</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmationDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Excluir arquivo"
        description={deleting ? `Excluir "${deleting.name}"? O arquivo sai de todas as pastas e o acesso é revogado. Essa ação não pode ser desfeita.` : ""}
        confirmLabel="Excluir arquivo"
      />
    </div>
  );
}