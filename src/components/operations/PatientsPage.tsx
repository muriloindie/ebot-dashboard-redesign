"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  CalendarCheck,
  CalendarDays,
  Check,
  ClipboardList,
  Download,
  FileUp,
  Filter,
  Headphones,
  History,
  Mail,
  MessageCircle,
  Phone,
  Pencil,
  Save,
  SearchX,
  Stethoscope,
  StickyNote,
  UserPlus,
  UserRound,
  UserRoundCheck,
  UsersRound,
  X
} from "lucide-react";
import { patients, type Patient, type PatientStatus } from "@/data/patientsMock";
import { appointments } from "@/data/agendaMock";
import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import { usePageEnter } from "@/lib/usePageEnter";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { ModalChoice, ModalField, ModalSelect } from "@/components/ui/ModalField";
import { Dropdown } from "@/components/ui/Dropdown";
import { Avatar } from "@/components/ui/Avatar";
import { StatStrip, type StatItem } from "@/components/ui/StatStrip";
import { Timeline } from "@/components/ui/Timeline";
import { PageHeader, SearchField, StatePanel, StatusBadge, TableCell, TableHeaderCell, TableHead, TableSurface } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

const CACHE_KEY = "ebot-week2-patients";
const ALL = "Todos";

const statusTone: Record<PatientStatus, "green" | "blue" | "neutral"> = {
  Ativo: "green",
  Novo: "blue",
  Inativo: "neutral"
};

const todayAppointments = appointments.filter((row) => row.dateOffset === 0 && row.status !== "Cancelada").length;

const indicators: StatItem[] = [
  { id: "active", label: "Pacientes ativos", value: "2.486", hint: "na base", tone: "blue", icon: UsersRound },
  { id: "new", label: "Novos pacientes", value: "64", hint: "este mês", tone: "green", icon: UserPlus },
  { id: "today", label: "Consultas hoje", value: String(todayAppointments), hint: "na agenda", tone: "teal", icon: CalendarCheck },
  { id: "return", label: "Aguardando retorno", value: "23", hint: "para agendar", tone: "orange", icon: UserRoundCheck }
];

export function PatientsPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Patient[]>(patients);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);
  const [professional, setProfessional] = useState(ALL);
  const [unit, setUnit] = useState(ALL);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [notice, setNotice] = useState("");

  usePageEnter(pageRef, [
    { selector: "[data-stat-card]", from: { opacity: 0, y: 18 } },
    { selector: "[data-search-bar]", from: { opacity: 0, y: 14 }, to: { duration: 0.45, ease: "power3.out" } }
  ], { stagger: 0.06, delay: 0.05 });

  useEffect(() => {
    const cachedRows = readLocalCache(CACHE_KEY, patients);
    setRows(cachedRows);
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q")?.trim() ?? "";
    if (!query) return;

    setSearch(query);
    const normalizedQuery = query.toLowerCase();
    const linkedPatient = cachedRows.find((row) =>
      [row.name, row.id, row.phone, row.email, row.cpf].some((value) => value.toLowerCase() === normalizedQuery)
    );
    if (linkedPatient) setSelected(linkedPatient);
  }, []);

  const professionals = Array.from(new Set(rows.map((row) => row.professional)));
  const units = Array.from(new Set(rows.map((row) => row.unit)));

  const hasFilters = status !== ALL || professional !== ALL || unit !== ALL;

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch = `${row.name} ${row.phone} ${row.email} ${row.cpf} ${row.id}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === ALL || row.status === status;
      const matchesProfessional = professional === ALL || row.professional === professional;
      const matchesUnit = unit === ALL || row.unit === unit;
      return matchesSearch && matchesStatus && matchesProfessional && matchesUnit;
    });
  }, [rows, search, status, professional, unit]);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function persist(next: Patient[]) {
    setRows(next);
    writeLocalCache(CACHE_KEY, next);
  }

  function createPatient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const next: Patient = {
      id: `PAC-${String(rows.length + 185)}`,
      name,
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      cpf: String(form.get("cpf") ?? ""),
      birthDate: String(form.get("birth") ?? ""),
      gender: String(form.get("gender") ?? "Feminino") as Patient["gender"],
      tags: ["Novo paciente"],
      professional: String(form.get("professional") ?? professionals[0]),
      unit: String(form.get("unit") ?? units[0]),
      status: "Novo",
      lastAppointment: "—",
      nextAppointment: "—",
      history: [{ id: `h-${Date.now()}`, type: "Atendimento", title: "Cadastro realizado pela central", date: "Hoje", detail: "Paciente adicionado manualmente pela equipe." }],
      nextEvents: []
    };
    persist([next, ...rows]);
    setNewOpen(false);
    setSelected(next);
    showNotice(`${name} cadastrado(a) como novo paciente.`);
  }

  function updatePatient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    if (!name) {
      showNotice("Informe o nome completo do paciente.");
      return;
    }

    const nextPatient: Patient = {
      ...selected,
      name,
      phone: String(form.get("phone") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      cpf: String(form.get("cpf") ?? "").trim(),
      birthDate: String(form.get("birth") ?? "").trim(),
      gender: String(form.get("gender") ?? selected.gender) as Patient["gender"],
      professional: String(form.get("professional") ?? selected.professional),
      unit: String(form.get("unit") ?? selected.unit),
      status: String(form.get("status") ?? selected.status) as PatientStatus
    };
    const nextRows = rows.map((row) => row.id === selected.id ? nextPatient : row);
    persist(nextRows);
    setSelected(nextPatient);
    setEditOpen(false);
    showNotice("Dados do paciente salvos localmente.");
  }

  function clearFilters() {
    setSearch("");
    setStatus(ALL);
    setProfessional(ALL);
    setUnit(ALL);
  }

  return (
    <div ref={pageRef}>
      <PageHeader
        eyebrow="Pacientes / Central"
        title="Pacientes"
        description="Gerencie pacientes e acompanhe o relacionamento com a clínica."
        aside={<Button variant="secondary" size="sm" onClick={() => setImportOpen(true)}><FileUp className="size-4" /><span className="hidden sm:inline">Importar</span></Button>}
        action={<Button onClick={() => setNewOpen(true)}><UserPlus className="size-4" />Novo paciente</Button>}
      />

      <StatStrip items={indicators} className="mb-4" />

      {notice ? (
        <div role="status" className="mb-4 flex items-center justify-between rounded-2xl border border-clinical-green/20 bg-clinical-green/[0.08] px-4 py-3 text-sm font-bold text-clinical-green">
          <span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button>
        </div>
      ) : null}

      <div data-search-bar className="mb-4 flex flex-col gap-2 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/70 p-2.5 lg:flex-row lg:items-center">
        <SearchField value={search} onChange={setSearch} placeholder="Buscar por nome, telefone, CPF ou e-mail" />
        <div className="grid shrink-0 grid-cols-3 gap-2 xl:flex">
          <Dropdown label="Status" value={status} options={[ALL, "Ativo", "Novo", "Inativo"]} onChange={setStatus} />
          <Dropdown label="Profissional" value={professional} options={[ALL, ...professionals]} onChange={setProfessional} />
          <Dropdown label="Unidade" value={unit} options={[ALL, ...units]} onChange={setUnit} />
        </div>
        {hasFilters ? (
          <Button variant="secondary" size="sm" onClick={clearFilters} className="shrink-0"><Filter className="size-4" />Limpar</Button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <StatePanel
          icon={SearchX}
          title="Não encontramos pacientes"
          description="Tente outro nome, telefone, CPF ou e-mail, ou ajuste os filtros da busca."
          action={<Button size="sm" variant="secondary" onClick={clearFilters}>Limpar filtros</Button>}
        />
      ) : (
        <TableSurface caption="Lista de pacientes">
          <TableHead>
            <TableHeaderCell>Paciente</TableHeaderCell>
            <TableHeaderCell>Telefone</TableHeaderCell>
            <TableHeaderCell>Última consulta</TableHeaderCell>
            <TableHeaderCell>Próxima consulta</TableHeaderCell>
            <TableHeaderCell>Profissional</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Tags</TableHeaderCell>
            <TableHeaderCell>Ações</TableHeaderCell>
          </TableHead>
          <tbody className="divide-y divide-clinical-border/[0.10]">
            {filtered.map((patient) => (
              <tr key={patient.id} className="animate-list-in transition hover:bg-clinical-blue/[0.035]">
                <TableCell>
                  <button type="button" onClick={() => setSelected(patient)} className="flex items-center gap-3 text-left">
                    <Avatar name={patient.name} status={patient.status === "Ativo" ? "online" : patient.status === "Novo" ? "busy" : "offline"} />
                    <span>
                      <span className="block font-extrabold text-clinical-dark hover:text-clinical-blue">{patient.name}</span>
                      <span className="block text-xs font-semibold text-clinical-muted">{patient.id} · {patient.cpf}</span>
                    </span>
                  </button>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2 font-semibold text-clinical-slate"><Phone className="size-3.5 text-clinical-muted" />{patient.phone}</span>
                  <span className="mt-1 flex items-center gap-2 text-xs font-semibold text-clinical-muted"><Mail className="size-3.5" />{patient.email}</span>
                </TableCell>
                <TableCell><span className="font-semibold text-clinical-slate">{patient.lastAppointment}</span></TableCell>
                <TableCell>
                  {patient.nextAppointment === "—" ? <span className="text-clinical-muted">—</span> : <span className="font-bold text-clinical-blueText">{patient.nextAppointment}</span>}
                </TableCell>
                <TableCell><span className="font-semibold text-clinical-slate">{patient.professional}</span></TableCell>
                <TableCell><StatusBadge label={patient.status} tone={statusTone[patient.status]} /></TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">{patient.tags.slice(0, 3).map((tag) => <StatusBadge key={tag} label={tag} tone="neutral" />)}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setSelected(patient)} aria-label={`Ver perfil de ${patient.name}`} className="flex size-9 items-center justify-center rounded-xl text-clinical-blue transition hover:bg-clinical-blue/10"><UserRound className="size-4" /></button>
                    <button type="button" onClick={() => router.push("/atendimentos")} aria-label={`Novo atendimento para ${patient.name}`} className="flex size-9 items-center justify-center rounded-xl text-clinical-muted transition hover:bg-clinical-blue/10 hover:text-clinical-blue"><Headphones className="size-4" /></button>
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </TableSurface>
      )}

      <Drawer open={Boolean(selected)} onClose={() => { setSelected(null); setEditOpen(false); }} title={selected?.name ?? "Paciente"} description={selected ? `${selected.id} · ${selected.status}` : undefined} width="max-w-xl">
        {selected ? <div>
          {notice ? <div role="status" className="mb-4 flex items-center gap-2 rounded-2xl border border-clinical-green/20 bg-clinical-green/[0.08] px-3 py-2.5 text-xs font-bold text-clinical-green"><Check className="size-4" />{notice}</div> : null}
          <PatientProfile patient={selected} onEdit={() => setEditOpen(true)} onSaveNotes={(notes) => {
            const nextRows = rows.map((row) => row.id === selected.id ? { ...row, notes: notes.trim() } : row);
            const nextPatient = nextRows.find((row) => row.id === selected.id) ?? selected;
            persist(nextRows);
            setSelected(nextPatient);
            showNotice(notes.trim() ? "Observação salva localmente." : "Observação removida localmente.");
          }} onNewAttendance={() => { setSelected(null); router.push("/atendimentos"); }} />
        </div> : null}
      </Drawer>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="Novo paciente" eyebrow="Base de pacientes" description="Crie um registro completo para acompanhar o relacionamento com a clínica." icon={UserPlus} className="max-w-2xl">
        <form onSubmit={createPatient} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField name="name" label="Nome completo" icon={UserRound} placeholder="Ex.: Camila Rodrigues" required className="sm:col-span-2" />
            <ModalField name="phone" label="Telefone / WhatsApp" icon={Phone} placeholder="+55 11 99999-9999" required />
            <ModalField name="email" label="E-mail" icon={Mail} type="email" placeholder="contato@email.com" required />
            <ModalField name="cpf" label="CPF" icon={UserRound} placeholder="000.000.000-00" />
            <ModalField name="birth" label="Data de nascimento" icon={CalendarDays} type="date" />
            <ModalSelect name="gender" label="Gênero" icon={UserRound} defaultValue="Feminino"><option>Feminino</option><option>Masculino</option></ModalSelect>
            <ModalSelect name="unit" label="Unidade" icon={Stethoscope} defaultValue={units[0] ?? "Unidade Centro"}>{units.map((item) => <option key={item}>{item}</option>)}</ModalSelect>
            <ModalSelect name="professional" label="Profissional responsável" icon={Stethoscope} defaultValue={professionals[0]}>{professionals.map((item) => <option key={item}>{item}</option>)}</ModalSelect>
          </div>
          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setNewOpen(false)}>Cancelar</Button>
            <Button type="submit"><UserPlus className="size-4" />Salvar paciente</Button>
          </div>
        </form>
      </Modal>

      <Modal open={editOpen && Boolean(selected)} onClose={() => setEditOpen(false)} title="Editar paciente" eyebrow="Base de pacientes" description={selected ? `Atualize os dados de ${selected.name}.` : undefined} icon={Pencil} className="max-w-2xl">
        {selected ? (
          <form key={selected.id} onSubmit={updatePatient} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ModalField name="name" label="Nome completo" icon={UserRound} defaultValue={selected.name} required className="sm:col-span-2" />
              <ModalField name="phone" label="Telefone / WhatsApp" icon={Phone} defaultValue={selected.phone} required />
              <ModalField name="email" label="E-mail" icon={Mail} type="email" defaultValue={selected.email} required />
              <ModalField name="cpf" label="CPF" icon={UserRound} defaultValue={selected.cpf} />
              <ModalField name="birth" label="Data de nascimento" icon={CalendarDays} defaultValue={selected.birthDate} placeholder="DD/MM/AAAA" />
              <ModalSelect name="gender" label="Gênero" icon={UserRound} defaultValue={selected.gender}><option>Feminino</option><option>Masculino</option></ModalSelect>
              <ModalSelect name="status" label="Status" icon={UserRoundCheck} defaultValue={selected.status}><option>Ativo</option><option>Novo</option><option>Inativo</option></ModalSelect>
              <ModalSelect name="unit" label="Unidade" icon={Stethoscope} defaultValue={selected.unit}>{units.map((item) => <option key={item}>{item}</option>)}</ModalSelect>
              <ModalSelect name="professional" label="Profissional responsável" icon={Stethoscope} defaultValue={selected.professional}>{professionals.map((item) => <option key={item}>{item}</option>)}</ModalSelect>
            </div>
            <div className="flex justify-end gap-2 border-t border-clinical-border/[0.12] pt-4">
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>Cancelar</Button>
              <Button type="submit"><Save className="size-4" />Salvar alterações</Button>
            </div>
          </form>
        ) : null}
      </Modal>

      <Modal open={importOpen} onClose={() => setImportOpen(false)} title="Importar pacientes" eyebrow="Base de pacientes" description="Adicione pacientes em lote a partir de uma planilha." icon={FileUp} className="max-w-xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <ModalChoice label="Importar planilha" description="CSV ou Excel para revisar antes de adicionar." icon={FileUp} active={false} onClick={() => { setImportOpen(false); showNotice("Importador pronto: conecte o arquivo CSV para revisar os registros."); }} />
          <ModalChoice label="Exportar CSV" description="Baixe a base filtrada desta visão." icon={Download} active={false} onClick={() => { setImportOpen(false); showNotice(`${filtered.length} pacientes preparados para exportação.`); }} />
          <ModalChoice label="Modelo de importação" description="Use o modelo com colunas recomendadas." icon={FileUp} active={false} onClick={() => { setImportOpen(false); showNotice("Modelo de importação preparado localmente."); }} />
          <ModalChoice label="Verificar duplicados" description="Compare nome, telefone e CPF antes de importar." icon={UserRoundCheck} active={false} onClick={() => { setImportOpen(false); showNotice("Nenhum duplicado novo encontrado na base local."); }} />
        </div>
      </Modal>
    </div>
  );
}

type PatientProfileTab = "Resumo" | "Histórico" | "Comunicação" | "Agenda" | "Observações";

function PatientProfile({ patient, onEdit, onSaveNotes, onNewAttendance }: { patient: Patient; onEdit: () => void; onSaveNotes: (notes: string) => void; onNewAttendance: () => void }) {
  const historyTones = {
    Consulta: "blue",
    Atendimento: "orange",
    Protocolo: "green",
    "Interação com IA": "neutral"
  } as const;
  const [activeTab, setActiveTab] = useState<PatientProfileTab>("Resumo");
  const [notes, setNotes] = useState(patient.notes ?? "");
  const communications = patient.history.filter((item) => item.type === "Atendimento" || item.type === "Interação com IA");

  useEffect(() => {
    setActiveTab("Resumo");
    setNotes(patient.notes ?? "");
  }, [patient.id, patient.notes]);

  const tabs: { id: PatientProfileTab; icon: React.ElementType }[] = [
    { id: "Resumo", icon: ClipboardList },
    { id: "Histórico", icon: History },
    { id: "Comunicação", icon: MessageCircle },
    { id: "Agenda", icon: CalendarDays },
    { id: "Observações", icon: StickyNote }
  ];

  return (
    <div>
      <div className="flex items-center gap-4 rounded-2xl bg-clinical-blue/[0.07] p-4">
        <Avatar name={patient.name} size="xl" status={patient.status === "Ativo" ? "online" : "offline"} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-extrabold text-clinical-dark">{patient.name}</p>
          <p className="mt-0.5 text-xs font-bold text-clinical-muted">{patient.id} · {patient.cpf}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <StatusBadge label={patient.status} tone={statusTone[patient.status]} />
            {patient.tags.map((tag) => <StatusBadge key={tag} label={tag} tone="neutral" />)}
          </div>
        </div>
        <Button type="button" size="sm" variant="secondary" onClick={onEdit} className="shrink-0" aria-label={`Editar dados de ${patient.name}`}><Pencil className="size-3.5" /><span className="hidden sm:inline">Editar</span></Button>
      </div>

      <div role="tablist" aria-label="Seções do perfil" className="mt-5 flex gap-1 overflow-x-auto rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/55 p-1">
        {tabs.map(({ id, icon: Icon }) => (
          <button key={id} type="button" role="tab" aria-selected={activeTab === id} aria-controls={`patient-tab-${id}`} onClick={() => setActiveTab(id)} className={cn("flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-extrabold transition", activeTab === id ? "bg-clinical-surface text-clinical-blue shadow-sm" : "text-clinical-muted hover:text-clinical-dark")}>
            <Icon className="size-3.5" />{id}
          </button>
        ))}
      </div>

      {activeTab === "Resumo" ? (
        <div id="patient-tab-Resumo" role="tabpanel" className="mt-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <ProfileField icon={Phone} label="Telefone" value={patient.phone} />
            <ProfileField icon={Mail} label="E-mail" value={patient.email} />
            <ProfileField icon={CalendarDays} label="Nascimento" value={`${patient.birthDate} · ${patient.gender}`} />
            <ProfileField icon={Stethoscope} label="Profissional" value={patient.professional} />
            <ProfileField icon={Headphones} label="Unidade" value={patient.unit} />
            <ProfileField icon={CalendarCheck} label="Última consulta" value={patient.lastAppointment} />
          </dl>

          <div className="mt-7">
            <h3 className="mb-3 text-sm font-extrabold text-clinical-dark">Próximos eventos</h3>
            {patient.nextEvents.length === 0 ? (
              <ProfileEmpty icon={CalendarDays} title="Agenda livre" description="Não há eventos futuros agendados para este paciente." />
            ) : (
              <div className="space-y-2">
                {patient.nextEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 px-3.5 py-3">
                    <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", event.kind === "consulta" ? "bg-clinical-blue/10 text-clinical-blue" : event.kind === "retorno" ? "bg-clinical-green/10 text-clinical-green" : "bg-clinical-orange/10 text-clinical-orange")}>
                      {event.kind === "consulta" ? <CalendarDays className="size-4" /> : event.kind === "retorno" ? <UserRoundCheck className="size-4" /> : <Headphones className="size-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-extrabold text-clinical-dark">{event.title}</span>
                      <span className="block text-xs font-semibold text-clinical-muted">{event.date}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {activeTab === "Histórico" ? (
        <div id="patient-tab-Histórico" role="tabpanel" className="mt-6">
          <h3 className="mb-1 text-sm font-extrabold text-clinical-dark">Histórico clínico</h3>
          <p className="mb-3 text-xs font-semibold text-clinical-muted">Consultas, atendimentos, protocolos e interações com a IA.</p>
          {patient.history.length === 0 ? <ProfileEmpty icon={History} title="Histórico vazio" description="As próximas interações do paciente aparecerão aqui." /> : <Timeline items={patient.history.slice(0, 7).map((item) => ({
            id: item.id,
            icon: item.type === "Consulta" ? CalendarDays : item.type === "Atendimento" ? Headphones : item.type === "Protocolo" ? UserRoundCheck : Bot,
            title: item.title,
            subtitle: item.detail,
            date: item.date,
            tone: historyTones[item.type]
          }))} />}
        </div>
      ) : null}

      {activeTab === "Comunicação" ? (
        <div id="patient-tab-Comunicação" role="tabpanel" className="mt-6">
          <h3 className="mb-3 text-sm font-extrabold text-clinical-dark">Canais de contato</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <a href={`tel:${patient.phone}`} className="flex items-center gap-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-3 transition hover:border-clinical-blue/25 hover:bg-clinical-blue/[0.05]"><Phone className="size-4 text-clinical-green" /><span className="min-w-0"><span className="block text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">Telefone</span><span className="block truncate text-sm font-bold text-clinical-dark">{patient.phone}</span></span></a>
            <a href={`mailto:${patient.email}`} className="flex items-center gap-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-3 transition hover:border-clinical-blue/25 hover:bg-clinical-blue/[0.05]"><Mail className="size-4 text-clinical-blue" /><span className="min-w-0"><span className="block text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">E-mail</span><span className="block truncate text-sm font-bold text-clinical-dark">{patient.email}</span></span></a>
          </div>
          <h3 className="mb-1 mt-7 text-sm font-extrabold text-clinical-dark">Últimas conversas</h3>
          <p className="mb-3 text-xs font-semibold text-clinical-muted">Atendimentos e interações registradas no relacionamento.</p>
          {communications.length === 0 ? <ProfileEmpty icon={MessageCircle} title="Nenhuma conversa registrada" description="As comunicações da equipe e da IA aparecerão aqui." /> : <Timeline items={communications.map((item) => ({ id: item.id, icon: item.type === "Atendimento" ? Headphones : Bot, title: item.title, subtitle: item.detail, date: item.date, tone: historyTones[item.type] }))} />}
        </div>
      ) : null}

      {activeTab === "Agenda" ? (
        <div id="patient-tab-Agenda" role="tabpanel" className="mt-6">
          <h3 className="mb-1 text-sm font-extrabold text-clinical-dark">Agenda do paciente</h3>
          <p className="mb-3 text-xs font-semibold text-clinical-muted">Consultas, retornos e tarefas que precisam de acompanhamento.</p>
          {patient.nextEvents.length === 0 ? <ProfileEmpty icon={CalendarDays} title="Nenhum compromisso futuro" description="Quando houver uma consulta ou retorno, ele será exibido nesta aba." /> : <div className="space-y-2">{patient.nextEvents.map((event) => <div key={event.id} className="flex items-center gap-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 px-3.5 py-3"><span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", event.kind === "consulta" ? "bg-clinical-blue/10 text-clinical-blue" : event.kind === "retorno" ? "bg-clinical-green/10 text-clinical-green" : "bg-clinical-orange/10 text-clinical-orange")}><CalendarCheck className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-extrabold text-clinical-dark">{event.title}</span><span className="block text-xs font-semibold text-clinical-muted">{event.date}</span></span><StatusBadge label={event.kind === "consulta" ? "Consulta" : event.kind === "retorno" ? "Retorno" : "Tarefa"} tone={event.kind === "retorno" ? "green" : event.kind === "tarefa" ? "orange" : "blue"} /></div>)}</div>}
        </div>
      ) : null}

      {activeTab === "Observações" ? (
        <div id="patient-tab-Observações" role="tabpanel" className="mt-6">
          <h3 className="mb-1 text-sm font-extrabold text-clinical-dark">Observações internas</h3>
          <p className="mb-3 text-xs font-semibold text-clinical-muted">Use este espaço para registrar informações úteis à equipe.</p>
          {!notes.trim() ? <ProfileEmpty icon={StickyNote} title="Nenhuma observação salva" description="Adicione uma nota para orientar os próximos atendimentos." /> : <p className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-3 text-[13px] leading-5 text-clinical-slate">{notes}</p>}
          <form onSubmit={(event) => { event.preventDefault(); onSaveNotes(notes); }} className="mt-3 rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/25 p-3">
            <label className="block"><span className="mb-1.5 flex items-center gap-2 text-sm font-extrabold text-clinical-dark"><StickyNote className="size-4 text-clinical-blue" />Editar observação</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ex.: Prefere contato por WhatsApp no período da manhã." className="min-h-[112px] w-full resize-y rounded-2xl border border-clinical-border/[0.14] bg-clinical-surfaceMuted/45 p-3 text-sm font-semibold text-clinical-dark outline-none transition placeholder:text-clinical-muted/65 focus:border-clinical-blue/45 focus:bg-clinical-surface focus:ring-2 focus:ring-clinical-blue/10" /></label>
            <div className="mt-3 flex items-center justify-between gap-2"><span className="text-[11px] font-semibold text-clinical-muted">Visível apenas para a equipe.</span><Button type="submit" size="sm"><Save className="size-3.5" />Salvar observação</Button></div>
          </form>
        </div>
      ) : null}

      <div className="mt-7 flex flex-wrap gap-2 border-t border-clinical-border/[0.12] pt-5">
        <Button type="button" variant="secondary" onClick={onEdit}><Pencil className="size-4" />Editar dados</Button>
        <Button onClick={onNewAttendance}><Headphones className="size-4" />Novo atendimento</Button>
      </div>
    </div>
  );
}

function ProfileEmpty({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return <div className="flex flex-col items-center rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/30 px-4 py-6 text-center"><Icon className="size-6 text-clinical-blue" /><p className="mt-2 text-sm font-extrabold text-clinical-dark">{title}</p><p className="mt-1 max-w-sm text-xs leading-5 text-clinical-muted">{description}</p></div>;
}

function ProfileField({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-clinical-surfaceMuted text-clinical-blue"><Icon className="size-4" /></span>
      <div className="min-w-0">
        <dt className="text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">{label}</dt>
        <dd className="truncate text-sm font-bold text-clinical-dark">{value}</dd>
      </div>
    </div>
  );
}
