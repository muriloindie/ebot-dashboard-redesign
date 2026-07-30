"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Download, FileDown, FileUp, Filter, Mail, MoreHorizontal, Phone, RefreshCw, SearchX, Tags, UploadCloud, UserPlus, UserRound, X } from "lucide-react";
import { contacts } from "@/data/operationsMock";
import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { ModalChoice, ModalField, ModalSelect } from "@/components/ui/ModalField";
import { PageHeader, SearchField, StatePanel, StatusBadge, TableCell, TableHeaderCell, TableHead, TableSurface } from "@/components/ui/Week1Primitives";

const CACHE_KEY = "ebot-week1-contacts";
type Contact = typeof contacts[number];

export function ContactsPage() {
  const [rows, setRows] = useState<Contact[]>(contacts);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);
  const [modal, setModal] = useState<"add" | "import" | "filters" | null>(null);
  const [notice, setNotice] = useState("");
  const [tag, setTag] = useState("Todas");
  const [source, setSource] = useState("Todas");

  useEffect(() => setRows(readLocalCache(CACHE_KEY, contacts)), []);

  const filtered = useMemo(() => rows.filter((contact) => {
    const matchesSearch = `${contact.name} ${contact.email} ${contact.whatsapp}`.toLowerCase().includes(search.toLowerCase());
    const matchesTag = tag === "Todas" || contact.tags.includes(tag);
    const matchesSource = source === "Todas" || (source === "Paciente" && contact.tags.includes("Paciente")) || (source === "Lead" && contact.tags.includes("Lead"));
    return matchesSearch && matchesTag && matchesSource;
  }), [rows, search, source, tag]);

  function showNotice(message: string) { setNotice(message); window.setTimeout(() => setNotice(""), 3600); }

  function addContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: Contact = { id: `CT-${String(rows.length + 183).padStart(4, "0")}`, name: String(form.get("name")), whatsapp: String(form.get("whatsapp")), email: String(form.get("email")), lastSeen: "Agora", tags: [String(form.get("profile"))] };
    const nextRows = [next, ...rows];
    setRows(nextRows); writeLocalCache(CACHE_KEY, nextRows); setModal(null); showNotice("Contato adicionado à base local.");
  }

  return <div>
    <PageHeader eyebrow="Pacientes / Contatos" title="Contatos" description="Encontre pessoas, revise dados e acesse as ações da base de contatos." action={<Button onClick={() => setModal("add")}><UserPlus className="size-4" />Adicionar contato</Button>} />
    <div className="mb-4 flex flex-col gap-2 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/70 p-2.5 sm:flex-row sm:items-center">
      <SearchField value={search} onChange={setSearch} placeholder="Pesquisar por nome, telefone ou e-mail" />
      <div className="flex shrink-0 gap-2"><Button variant="secondary" size="sm" onClick={() => setModal("filters")}><Filter className="size-4" />Filtros{tag !== "Todas" || source !== "Todas" ? <span className="flex size-5 items-center justify-center rounded-full bg-clinical-blue text-[10px] text-clinical-charcoal">!</span> : null}</Button><Button variant="secondary" size="sm" onClick={() => setModal("import")}><FileUp className="size-4" /><span className="hidden sm:inline">Importar / exportar</span></Button></div>
    </div>
    {notice ? <div role="status" className="mb-4 flex items-center justify-between rounded-2xl border border-clinical-green/20 bg-clinical-green/[0.08] px-4 py-3 text-sm font-bold text-clinical-green"><span className="flex items-center gap-2"><Check className="size-4" />{notice}</span><button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button></div> : null}
    {filtered.length === 0 ? <StatePanel icon={SearchX} title="Nenhum contato encontrado" description="Tente outro nome, telefone ou e-mail, ou ajuste os filtros." action={<Button size="sm" variant="secondary" onClick={() => { setSearch(""); setTag("Todas"); setSource("Todas"); }}>Limpar filtros</Button>} /> : <TableSurface caption="Lista de contatos"><TableHead><TableHeaderCell>Nome</TableHeaderCell><TableHeaderCell>WhatsApp</TableHeaderCell><TableHeaderCell>Email</TableHeaderCell><TableHeaderCell>Última atividade</TableHeaderCell><TableHeaderCell>Ações</TableHeaderCell></TableHead><tbody className="divide-y divide-clinical-border/[0.10]">{filtered.map((contact) => <tr key={contact.id} className="animate-list-in transition hover:bg-clinical-blue/[0.035]"><TableCell><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-clinical-charcoal text-[11px] font-extrabold text-white">{contact.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span><span className="block font-extrabold text-clinical-dark">{contact.name}</span><span className="block text-xs font-semibold text-clinical-muted">{contact.id}</span></span></div></TableCell><TableCell>{contact.whatsapp}</TableCell><TableCell>{contact.email}</TableCell><TableCell><span className="font-semibold text-clinical-slate">{contact.lastSeen}</span><div className="mt-1 flex gap-1">{contact.tags.map((item) => <StatusBadge key={item} label={item} tone={item === "Lead" ? "orange" : "blue"} />)}</div></TableCell><TableCell><div className="flex items-center gap-1"><button type="button" onClick={() => setSelected(contact)} aria-label={`Ver ${contact.name}`} className="flex size-9 items-center justify-center rounded-xl text-clinical-blue hover:bg-clinical-blue/10"><UserRound className="size-4" /></button><button type="button" aria-label={`Mais ações para ${contact.name}`} className="flex size-9 items-center justify-center rounded-xl text-clinical-muted hover:bg-clinical-blue/10 hover:text-clinical-blue"><MoreHorizontal className="size-4" /></button></div></TableCell></tr>)}</tbody></TableSurface>}

    <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? "Contato"} description="Detalhes do contato selecionado.">{selected ? <div><div className="flex items-center gap-3 rounded-2xl bg-clinical-blue/[0.07] p-4"><span className="flex size-12 items-center justify-center rounded-2xl bg-clinical-charcoal font-extrabold text-white">{selected.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><p className="font-extrabold text-clinical-dark">{selected.name}</p><p className="text-xs font-semibold text-clinical-muted">{selected.id}</p></div></div><dl className="mt-7 space-y-5"><div><dt className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clinical-muted"><Phone className="size-3.5" />WhatsApp</dt><dd className="mt-1 text-sm font-bold text-clinical-dark">{selected.whatsapp}</dd></div><div><dt className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-clinical-muted"><Mail className="size-3.5" />Email</dt><dd className="mt-1 text-sm font-bold text-clinical-dark">{selected.email}</dd></div></dl></div> : null}</Drawer>

    <Modal open={modal === "add"} onClose={() => setModal(null)} title="Adicionar contato" eyebrow="Base de pacientes" description="Crie um registro completo para a equipe operar com contexto." icon={UserPlus} className="max-w-2xl"><form onSubmit={addContact} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><ModalField name="name" label="Nome completo" icon={UserRound} placeholder="Ex.: Camila Rodrigues" required /><ModalSelect name="profile" label="Perfil do contato" icon={Tags} defaultValue="Paciente"><option>Paciente</option><option>Lead</option><option>Responsável</option><option>Parceiro</option></ModalSelect><ModalField name="whatsapp" label="WhatsApp" icon={Phone} placeholder="+55 11 99999-9999" required /><ModalField name="email" label="E-mail" icon={Mail} type="email" placeholder="contato@email.com" required /></div><div className="rounded-2xl border border-clinical-blue/15 bg-clinical-blue/[0.06] p-3 text-xs font-semibold leading-5 text-clinical-slate">O contato será salvo no cache local desta sessão para demonstrar o fluxo de cadastro.</div><div className="flex justify-end gap-2 border-t border-clinical-border/[0.12] pt-4"><Button type="button" variant="ghost" onClick={() => setModal(null)}>Cancelar</Button><Button type="submit"><UserPlus className="size-4" />Salvar contato</Button></div></form></Modal>

    <Modal open={modal === "import"} onClose={() => setModal(null)} title="Importar ou exportar" eyebrow="Ferramentas da base" description="Escolha o formato e a operação sem sair da tela de contatos." icon={FileUp} className="max-w-xl"><div className="grid gap-3 sm:grid-cols-2"><ModalChoice label="Importar contatos" description="CSV ou planilha para revisar antes de adicionar." icon={UploadCloud} active={false} onClick={() => showNotice("Seletor de arquivo pronto para conectar ao importador.")} /><ModalChoice label="Exportar CSV" description="Baixe os registros filtrados desta visão." icon={Download} active={false} onClick={() => showNotice(`${filtered.length} contatos preparados para exportação.`)} /><ModalChoice label="Modelo de importação" description="Use o modelo com colunas recomendadas." icon={FileDown} active={false} onClick={() => showNotice("Modelo de importação preparado localmente.")} /><ModalChoice label="Verificar duplicados" description="Compare nome, telefone e e-mail antes de importar." icon={RefreshCw} active={false} onClick={() => showNotice("Nenhum duplicado novo encontrado na base local.")} /></div><div className="mt-5 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-4 text-sm leading-6 text-clinical-muted">Os arquivos e regras reais ficam fora do protótipo; aqui cada ação oferece feedback e mantém o fluxo pronto para integração.</div></Modal>

    <Modal open={modal === "filters"} onClose={() => setModal(null)} title="Filtros de contatos" eyebrow="Refine a base" description="Combine critérios para encontrar exatamente o grupo desejado." icon={Filter} className="max-w-xl"><div className="space-y-4"><ModalSelect label="Tipo de contato" icon={Tags} value={tag} onChange={(event) => setTag(event.target.value)}><option>Todas</option><option>Paciente</option><option>Lead</option><option>Retorno</option><option>Exames</option></ModalSelect><ModalSelect label="Origem da relação" icon={RefreshCw} value={source} onChange={(event) => setSource(event.target.value)}><option>Todas</option><option>Paciente</option><option>Lead</option></ModalSelect><div className="flex items-center justify-between rounded-2xl bg-clinical-blue/[0.06] p-3 text-sm font-bold text-clinical-blueText"><span>{filtered.length} resultado(s) na visão</span><button type="button" onClick={() => { setTag("Todas"); setSource("Todas"); }} className="text-xs underline">Limpar critérios</button></div><div className="flex justify-end"><Button onClick={() => setModal(null)}><Check className="size-4" />Aplicar filtros</Button></div></div></Modal>
  </div>;
}
