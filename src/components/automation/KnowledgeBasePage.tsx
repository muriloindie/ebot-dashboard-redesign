"use client";

import { useMemo, useRef, useState } from "react";
import {
  BookOpen,
  BrainCircuit,
  Database,
  FileCode2,
  FileText,
  FileType2,
  FolderOpen,
  Image as ImageIcon,
  Link2,
  Lock,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Table2,
  Trash2,
  Undo2,
  Upload,
  Users
} from "lucide-react";
import { deleteFile, deleteKnowledgeBase, listFiles, listKnowledgeBases, newFileId, newKnowledgeBaseId, saveFile, saveKnowledgeBase } from "@/lib/automation/n8nService";
import type { DriveFileKind, KbCategory, KbFile, KbFileKind, KbGraphNode, KnowledgeBase } from "@/lib/automation/types";
import { automationRoles } from "@/data/automationMock";
import { useDemo } from "@/components/state/DemoProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { PageHeader, SearchField, SegmentedTabs, StatePanel } from "@/components/ui/Week1Primitives";
import { CategoryChip, kbCategoryVisuals, toneChip } from "./shared";
import { cn } from "@/lib/cn";

const ALL = "Todas";

const kbStatusMeta: Record<KnowledgeBase["status"], { label: string; dot: string; chip: string }> = {
  indexed: { label: "Indexada", dot: "bg-clinical-green", chip: "bg-clinical-green/[0.12] text-clinical-green" },
  syncing: { label: "Sincronizando", dot: "bg-clinical-blue", chip: "bg-clinical-blue/[0.10] text-clinical-blueText" },
  error: { label: "Erro de indexação", dot: "bg-clinical-red", chip: "bg-clinical-red/[0.12] text-clinical-red" }
};

const kindVisuals: Record<KbFileKind, { icon: typeof FileText; label: string }> = {
  pdf: { icon: FileText, label: "PDF" },
  docx: { icon: FileType2, label: "DOCX" },
  md: { icon: FileCode2, label: "Markdown" },
  image: { icon: ImageIcon, label: "Imagem" },
  xlsx: { icon: Table2, label: "Planilha" },
  url: { icon: Link2, label: "Link" },
  text: { icon: FileText, label: "Texto" }
};

const graphKindColor: Record<KbGraphNode["kind"], string> = {
  entidade: "#3A9DCA",
  conceito: "#4CB782",
  regra: "#F2A34D"
};

function KBGraph({ base, className }: { base: KnowledgeBase; className?: string }) {
  const { nodes, edges } = base.graph;
  const width = 100;
  const height = 100;
  const radius = 36;
  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    const centerX = width / 2;
    const centerY = height / 2;
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
      map.set(node.id, { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) });
    });
    return map;
  }, [nodes]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("h-full w-full", className)} role="img" aria-label={`Grafo de conhecimento de ${base.name}`}>
      {edges.map((edge) => {
        const source = positions.get(edge.source);
        const target = positions.get(edge.target);
        if (!source || !target) return null;
        return (
          <g key={edge.id}>
            <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="rgba(90,120,115,0.35)" strokeWidth="0.9" />
          </g>
        );
      })}
      {nodes.map((node) => {
        const position = positions.get(node.id);
        if (!position) return null;
        return (
          <g key={node.id}>
            <circle cx={position.x} cy={position.y} r={node.kind === "entidade" ? 5 : 4} fill={graphKindColor[node.kind]} stroke="rgba(255,255,255,0.85)" strokeWidth="1" />
            <text x={position.x} y={position.y + 16} textAnchor="middle" fontSize="5.5" fontWeight="700" fill="rgba(45,60,57,0.9)">
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

type FileRowProps = { file: KbFile; onDelete: (file: KbFile) => void };

function FileRow({ file, onDelete }: FileRowProps) {
  const visual = kindVisuals[file.kind];
  const Icon = visual.icon;
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 px-3 py-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-clinical-blue/[0.08] text-clinical-blueText">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-extrabold text-clinical-dark">{file.name}</p>
        <p className="text-[11px] font-bold text-clinical-muted">
          {visual.label} · {file.size} · {file.chunks} chunks · {file.uploadedBy} · {file.updatedAt}
        </p>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold",
          file.status === "indexed" ? "bg-clinical-green/[0.12] text-clinical-green" : file.status === "processing" ? "bg-clinical-blue/[0.10] text-clinical-blueText" : "bg-clinical-red/[0.12] text-clinical-red"
        )}
      >
        {file.status === "indexed" ? "Indexado" : file.status === "processing" ? "Processando" : "Erro"}
      </span>
      <Button variant="ghost" size="sm" aria-label={`Excluir ${file.name}`} onClick={() => onDelete(file)}><Trash2 className="size-4 text-clinical-red" /></Button>
    </li>
  );
}

const emptyCreate = { name: "", category: "Protocolos" as KbCategory, description: "", strategy: "Por seção do documento", size: 512, overlap: 64, roles: ["Administrador"] as string[], classification: "interna" as "interna" | "sensivel" };

export function KnowledgeBasePage() {
  const { toast, profile } = useDemo();
  const [bases, setBases] = useState<KnowledgeBase[]>(() => listKnowledgeBases());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [selected, setSelected] = useState<KnowledgeBase | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [create, setCreate] = useState(emptyCreate);
  const [uploadBase, setUploadBase] = useState<KnowledgeBase | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [uploadKind, setUploadKind] = useState<KbFileKind>("pdf");
  const [dragging, setDragging] = useState(false);
  const [deletingFile, setDeletingFile] = useState<KbFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => [ALL, ...Array.from(new Set(bases.map((base) => base.category)))], [bases]);

  const filtered = useMemo(() => {
    return bases.filter((base) => {
      const matchesCategory = category === ALL || base.category === category;
      const matchesQuery = `${base.name} ${base.description} ${base.files.map((file) => file.name).join(" ")}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [bases, query, category]);

  const stats: StatItem[] = useMemo(() => {
    const indexedFiles = bases.reduce((total, base) => total + base.files.filter((file) => file.status === "indexed").length, 0);
    const queries = bases.reduce((total, base) => total + base.queries30d, 0);
    return [
      { id: "bases", label: "Bases indexadas", value: String(bases.length), hint: `${bases.filter((base) => base.status === "indexed").length} saudáveis`, tone: "blue", icon: Database },
      { id: "files", label: "Arquivos indexados", value: String(indexedFiles), hint: "prontos para o bot", tone: "green", icon: BookOpen },
      { id: "queries", label: "Consultas (30 dias)", value: queries.toLocaleString("pt-BR"), hint: "feitas pelos agentes", tone: "teal", icon: Sparkles },
      { id: "agents", label: "Agentes vinculados", value: String(new Set(bases.flatMap((base) => base.agents)).size), hint: "usam estas bases", tone: "orange", icon: BrainCircuit }
    ];
  }, [bases]);

  function reload() {
    setBases(listKnowledgeBases());
    if (selected) setSelected(listKnowledgeBases().find((base) => base.id === selected.id) ?? null);
  }

  function syncBase(base: KnowledgeBase) {
    setSyncing(base.id);
    window.setTimeout(() => {
      const next = listKnowledgeBases().map((item) => (item.id === base.id ? { ...item, status: "indexed" as const, updatedAt: "agora" } : item));
      next.forEach((item) => saveKnowledgeBase(item));
      reload();
      setSyncing(null);
      toast(`Base "${base.name}" sincronizada e reindexada com sucesso.`);
    }, 1200);
  }

  function createBase() {
    if (!create.name.trim()) {
      toast("Informe o nome da base.", "warning");
      return;
    }
    const base: KnowledgeBase = {
      id: newKnowledgeBaseId(),
      name: create.name.trim(),
      description: create.description.trim() || "Nova base de conhecimento criada pela equipe.",
      category: create.category,
      status: "syncing",
      files: [],
      queries30d: 0,
      agents: [],
      access: { roles: create.roles, users: [], classification: create.classification },
      graph: { nodes: [], edges: [] },
      chunking: { strategy: create.strategy, size: create.size, overlap: create.overlap },
      updatedAt: "agora"
    };
    saveKnowledgeBase(base);
    window.setTimeout(() => {
      const next = listKnowledgeBases().map((item) => (item.id === base.id ? { ...item, status: "indexed" as const } : item));
      next.forEach((item) => saveKnowledgeBase(item));
      reload();
      toast(`Base "${base.name}" criada e pronta para receber arquivos.`);
    }, 900);
    setCreateOpen(false);
    setCreate(emptyCreate);
  }

  function pickUploaded(uploaded: File) {
    const ext = uploaded.name.split(".").pop()?.toLowerCase() ?? "";
    const kind: KbFileKind = ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp" ? "image" : ext === "md" ? "md" : ext === "xlsx" || ext === "csv" ? "xlsx" : ext === "doc" || ext === "docx" ? "docx" : ext === "url" ? "url" : "pdf";
    setUploadName(uploaded.name);
    setUploadKind(kind);
    toast(`"${uploaded.name}" selecionado para indexação.`);
  }

  function confirmUpload() {
    if (!uploadBase) return;
    if (!uploadName) {
      toast("Selecione um arquivo antes de enviar.", "warning");
      return;
    }
    const driveKind: DriveFileKind = uploadKind === "image" ? "image" : uploadKind === "xlsx" ? "xlsx" : uploadKind === "docx" ? "docx" : uploadKind === "md" ? "md" : "pdf";
    const kbFile: KbFile = {
      id: newFileId(),
      name: uploadName,
      kind: uploadKind,
      size: `${(1 + Math.round(Math.random() * 40) / 10).toFixed(1).replace(".", ",")} MB`,
      chunks: 4 + Math.round(Math.random() * 40),
      status: "processing",
      updatedAt: "agora",
      uploadedBy: profile.name
    };
    const base = listKnowledgeBases().find((item) => item.id === uploadBase.id);
    if (!base) return;
    saveKnowledgeBase({ ...base, files: [...base.files, kbFile], status: "syncing", updatedAt: "agora" });
    saveFile({
      id: newFileId(),
      name: uploadName,
      kind: driveKind,
      size: kbFile.size,
      scope: "kb",
      kbId: base.id,
      folder: "Base de conhecimento",
      sensitivity: "geral",
      consent: null,
      retention: "Até remoção da base",
      starred: false,
      uploadedBy: profile.name,
      updatedAt: "agora",
      permissions: [{ id: "perm-" + Math.random().toString(36).slice(2, 7), granteeType: "role", grantee: "Administrador", level: "edit" }],
      audit: [{ id: "aud-" + Math.random().toString(36).slice(2, 7), user: profile.name, action: "enviou", at: "agora" }]
    });
    window.setTimeout(() => {
      const current = listKnowledgeBases().find((item) => item.id === base.id);
      if (!current) return;
      saveKnowledgeBase({ ...current, status: "indexed", files: current.files.map((file) => (file.id === kbFile.id ? { ...file, status: "indexed" } : file)) });
      reload();
      toast(`"${uploadName}" indexado na base "${base.name}".`);
    }, 1100);
    setUploadBase(null);
    setUploadName("");
  }

  function removeFile() {
    if (!selected || !deletingFile) return;
    const base = listKnowledgeBases().find((item) => item.id === selected.id);
    if (!base) return;
    saveKnowledgeBase({ ...base, files: base.files.filter((file) => file.id !== deletingFile.id), updatedAt: "agora" });
    const driveFile = listFiles().find((file) => file.scope === "kb" && file.kbId === base.id && file.name === deletingFile.name);
    if (driveFile) deleteFile(driveFile.id);
    reload();
    setDeletingFile(null);
    toast(`Arquivo "${deletingFile.name}" removido da base.`);
  }

  function deleteBase(base: KnowledgeBase) {
    setSelected(null);
    listFiles()
      .filter((file) => file.scope === "kb" && file.kbId === base.id)
      .forEach((file) => deleteFile(file.id));
    deleteKnowledgeBase(base.id);
    setBases(listKnowledgeBases());
    toast(`Base "${base.name}" excluída junto com seus arquivos.`);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Automação / Conhecimento"
        title="Base de conhecimento"
        description="Documentos, protocolos e regras que o bot consulta para responder com precisão. Cada base você controla acesso, indexação e os agentes que podem usá-la."
        action={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" />Nova base</Button>}
      />

      <StatStrip items={stats} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedTabs tabs={categories.map((item) => ({ id: item, label: item }))} value={category} onChange={setCategory} />
        <div className="w-full max-w-xs"><SearchField value={query} onChange={setQuery} placeholder="Buscar base, arquivo ou descrição…" /></div>
      </div>

      {filtered.length === 0 ? (
        <StatePanel icon={Database} title={query || category !== ALL ? "Nenhuma base encontrada" : "Nenhuma base ainda"} description={query || category !== ALL ? "Ajuste a busca ou o filtro de categoria." : "Crie a primeira base para o bot consultar protocolos e políticas."} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((base) => {
            const visual = kbCategoryVisuals[base.category];
            const Icon = visual.icon;
            const status = kbStatusMeta[base.status];
            return (
              <article key={base.id} className="flex flex-col rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/80 p-5 shadow-[0_8px_24px_rgba(38,53,50,0.04)] transition hover:border-clinical-blue/25 hover:shadow-clinical">
                <div className="flex items-start justify-between gap-3">
                  <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", toneChip[visual.tone])}>
                    <Icon className="size-5" />
                  </span>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold", status.chip)}>
                    <span className={cn("size-1.5 rounded-full", status.dot, base.status === "syncing" && "animate-pulse")} />
                    {status.label}
                  </span>
                </div>
                <h2 className="mt-3 text-base font-extrabold tracking-tight text-clinical-dark">{base.name}</h2>
                <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-clinical-muted">{base.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <CategoryChip category={base.category} kind="kb" />
                  <span className="inline-flex items-center gap-1 rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate">
                    <BookOpen className="size-3" />
                    {base.files.length} arquivos
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate">
                    <Sparkles className="size-3" />
                    {base.queries30d.toLocaleString("pt-BR")} consultas
                  </span>
                </div>
                <div className="mt-4 h-36 overflow-hidden rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-2">
                  <KBGraph base={base} />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-clinical-border/[0.10] pt-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-clinical-muted">
                    <Users className="size-3.5" />
                    {base.agents.length} agentes
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-clinical-muted">
                    {base.access.classification === "sensivel" ? <Lock className="size-3.5 text-clinical-orange" /> : <ShieldCheck className="size-3.5 text-clinical-green" />}
                    {base.access.classification === "sensivel" ? "Sensível" : "Interna"}
                  </span>
                  <Button variant="secondary" size="sm" onClick={() => setSelected(base)}>Gerenciar</Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? "Base de conhecimento"} description={selected?.description} width="max-w-3xl">
        {selected ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryChip category={selected.category} kind="kb" />
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold", kbStatusMeta[selected.status].chip)}>
                <span className={cn("size-1.5 rounded-full", kbStatusMeta[selected.status].dot, selected.status === "syncing" && "animate-pulse")} />
                {kbStatusMeta[selected.status].label}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate"><Sparkles className="size-3" />{selected.queries30d.toLocaleString("pt-BR")} consultas em 30 dias</span>
            </div>

            <section>
              <h3 className="mb-2 text-sm font-extrabold text-clinical-dark">Grafo de conhecimento</h3>
              <div className="rounded-3xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-4">
                <div className="h-64">
                  <KBGraph base={selected} className="h-full w-full" />
                </div>
                {selected.graph.nodes.length === 0 ? (
                  <p className="mt-2 text-[12px] font-bold text-clinical-muted">O grafo é gerado automaticamente na indexação dos arquivos.</p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-4">
                    {(["entidade", "conceito", "regra"] as const).map((kind) => (
                      <span key={kind} className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-clinical-slate">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: graphKindColor[kind] }} />
                        {kind === "entidade" ? "Entidade" : kind === "conceito" ? "Conceito" : "Regra"}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-clinical-dark">Arquivos indexados ({selected.files.length})</h3>
                <Button size="sm" variant="secondary" onClick={() => setUploadBase(selected)}><Upload className="size-3.5" />Enviar arquivo</Button>
              </div>
              {selected.files.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-clinical-border/[0.18] bg-clinical-surfaceMuted/30 px-6 py-10 text-center">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-clinical-blue/[0.10] text-clinical-blue"><FolderOpen className="size-5" /></span>
                  <p className="max-w-sm text-[13px] font-bold leading-5 text-clinical-muted">Nenhum arquivo ainda. Envie documentos, planilhas ou markdown — o bot passa a consultá-los após a indexação.</p>
                  <Button size="sm" onClick={() => setUploadBase(selected)}><Upload className="size-3.5" />Enviar primeiro arquivo</Button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {selected.files.map((file) => <FileRow key={file.id} file={file} onDelete={setDeletingFile} />)}
                </ul>
              )}
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-4">
                <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-clinical-dark"><Database className="size-4 text-clinical-blue" />Chunking</h3>
                <dl className="mt-3 space-y-1.5 text-[13px]">
                  <div className="flex justify-between"><dt className="font-bold text-clinical-muted">Estratégia</dt><dd className="font-extrabold text-clinical-dark">{selected.chunking.strategy}</dd></div>
                  <div className="flex justify-between"><dt className="font-bold text-clinical-muted">Tamanho</dt><dd className="font-extrabold text-clinical-dark">{selected.chunking.size} tokens</dd></div>
                  <div className="flex justify-between"><dt className="font-bold text-clinical-muted">Sobreposição</dt><dd className="font-extrabold text-clinical-dark">{selected.chunking.overlap} tokens</dd></div>
                </dl>
              </div>
              <div className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-4">
                <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-clinical-dark"><ShieldCheck className="size-4 text-clinical-green" />Acesso e agentes</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selected.access.roles.map((role) => (
                    <span key={role} className="rounded-full bg-clinical-blue/[0.08] px-2.5 py-1 text-[11px] font-extrabold text-clinical-blueText">{role}</span>
                  ))}
                  {selected.access.users.map((user) => (
                    <span key={user} className="rounded-full bg-clinical-surfaceMuted px-2.5 py-1 text-[11px] font-extrabold text-clinical-slate">{user}</span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selected.agents.map((agent) => (
                    <span key={agent} className="inline-flex items-center gap-1 rounded-full bg-clinical-teal/[0.10] px-2.5 py-1 text-[11px] font-extrabold text-clinical-teal"><BrainCircuit className="size-3" />{agent}</span>
                  ))}
                </div>
              </div>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-clinical-border/[0.10] pt-4">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-bold text-clinical-muted">Última atualização: {selected.updatedAt}</p>
                <Button variant="ghost" size="sm" className="text-clinical-red hover:bg-clinical-red/[0.08] hover:text-clinical-red" onClick={() => deleteBase(selected)}>Excluir base</Button>
              </div>
              <Button onClick={() => syncBase(selected)} disabled={syncing === selected.id}>
                <RefreshCcw className={cn("size-4", syncing === selected.id && "animate-spin")} />
                {syncing === selected.id ? "Sincronizando…" : "Sincronizar e reindexar"}
              </Button>
            </div>
          </div>
        ) : null}
      </Drawer>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nova base de conhecimento" eyebrow="Automação / Conhecimento" description="Configure a base antes de enviar os primeiros documentos." icon={Database} className="max-w-xl">
        <div className="space-y-4">
          <div>
            <label htmlFor="kb-name" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Nome</label>
            <input id="kb-name" value={create.name} onChange={(event) => setCreate({ ...create, name: event.target.value })} placeholder="Ex.: Políticas da unidade" className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="kb-category" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Categoria</label>
              <select id="kb-category" value={create.category} onChange={(event) => setCreate({ ...create, category: event.target.value as KbCategory })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
                {["Protocolos", "Convênios", "Exames", "Políticas", "Geral"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="kb-classification" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Classificação</label>
              <div className="flex gap-2">
                {(["interna", "sensivel"] as const).map((classification) => (
                  <button key={classification} type="button" onClick={() => setCreate({ ...create, classification })} className={cn("flex h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl border text-xs font-extrabold transition", create.classification === classification ? "border-clinical-blue/40 bg-clinical-blue/[0.10] text-clinical-blueText" : "border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 text-clinical-muted")}>
                    {classification === "sensivel" ? <Lock className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
                    {classification === "sensivel" ? "Sensível" : "Interna"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="kb-description" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Descrição</label>
            <textarea id="kb-description" value={create.description} onChange={(event) => setCreate({ ...create, description: event.target.value })} rows={3} placeholder="O que o bot deve responder usando esta base?" className="w-full resize-none rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 py-2.5 text-sm font-semibold leading-6 text-clinical-dark outline-none focus:border-clinical-blue/45" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label htmlFor="kb-strategy" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Estratégia de chunking</label>
              <select id="kb-strategy" value={create.strategy} onChange={(event) => setCreate({ ...create, strategy: event.target.value })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45">
                {["Por seção do documento", "Por linha da tabela", "Por parágrafo", "Comprimento fixo"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="kb-size" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Tamanho (tokens)</label>
              <input id="kb-size" type="number" min={128} max={1024} step={64} value={create.size} onChange={(event) => setCreate({ ...create, size: Number(event.target.value) })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
            </div>
            <div>
              <label htmlFor="kb-overlap" className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Sobreposição</label>
              <input id="kb-overlap" type="number" min={0} max={256} step={16} value={create.overlap} onChange={(event) => setCreate({ ...create, overlap: Number(event.target.value) })} className="h-11 w-full rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 px-3 text-sm font-semibold text-clinical-dark outline-none focus:border-clinical-blue/45" />
            </div>
          </div>
          <fieldset>
            <legend className="mb-1.5 block text-xs font-extrabold text-clinical-slate">Perfis com acesso de leitura</legend>
            <div className="flex flex-wrap gap-1.5">
              {automationRoles.map((role) => {
                const active = create.roles.includes(role);
                return (
                  <button key={role} type="button" onClick={() => setCreate({ ...create, roles: active ? create.roles.filter((item) => item !== role) : [...create.roles, role] })} className={cn("rounded-full px-3 py-1.5 text-[11px] font-extrabold transition", active ? "bg-clinical-blue/[0.10] text-clinical-blueText ring-1 ring-clinical-blue/30" : "bg-clinical-surfaceMuted text-clinical-muted hover:text-clinical-dark")}>
                    {role}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.10] pt-4">
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={createBase}><Plus className="size-4" />Criar base</Button>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(uploadBase)} onClose={() => setUploadBase(null)} title={`Enviar arquivo para "${uploadBase?.name}"`} eyebrow="Base de conhecimento" description="O documento será dividido em chunks e indexado para o bot consultar." icon={Upload} className="max-w-xl">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => { event.preventDefault(); setDragging(false); if (event.dataTransfer.files[0]) pickUploaded(event.dataTransfer.files[0]); }}
            className={cn("flex w-full flex-col items-center gap-3 rounded-3xl border-2 border-dashed px-6 py-10 text-center transition", dragging ? "border-clinical-blue/60 bg-clinical-blue/[0.06]" : "border-clinical-border/[0.18] bg-clinical-surfaceMuted/30 hover:border-clinical-blue/40 hover:bg-clinical-blue/[0.04]")}
          >
            <span className={cn("flex size-14 items-center justify-center rounded-2xl transition", dragging || uploadName ? "bg-clinical-blue text-white" : "bg-clinical-blue/[0.10] text-clinical-blue")}>
              {uploadName ? <Undo2 className="size-6" /> : <Upload className="size-6" />}
            </span>
            <div>
              <p className="text-sm font-extrabold text-clinical-dark">{uploadName || "Arraste um arquivo ou clique para selecionar"}</p>
              <p className="mt-1 text-[12px] font-bold text-clinical-muted">PDF, DOCX, XLSX, Markdown, imagens e links — até 25 MB</p>
            </div>
            <input ref={inputRef} type="file" className="hidden" onChange={(event) => { const picked = event.target.files?.[0]; if (picked) pickUploaded(picked); }} />
          </button>
          <p className="flex items-start gap-1.5 text-[11px] font-bold leading-4 text-clinical-muted">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-clinical-blue" />
            O arquivo também entra no drive central correspondente a esta base, com retenção &quot;até remoção da base&quot;.
          </p>
          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.10] pt-4">
            <Button variant="ghost" onClick={() => { setUploadBase(null); setUploadName(""); }}>Cancelar</Button>
            <Button onClick={confirmUpload} disabled={!uploadName}><Upload className="size-4" />Enviar e indexar</Button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        open={Boolean(deletingFile)}
        onClose={() => setDeletingFile(null)}
        onConfirm={removeFile}
        title="Remover arquivo da base"
        description={deletingFile ? `Remover "${deletingFile.name}"? O documento deixa de ser consultado pelo bot e sai do drive da base.` : ""}
        confirmLabel="Remover arquivo"
      />
    </div>
  );
}