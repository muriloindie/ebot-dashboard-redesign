"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  CalendarCheck,
  CalendarDays,
  Check,
  Download,
  FileUp,
  Filter,
  Headphones,
  Mail,
  Phone,
  SearchX,
  Stethoscope,
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
  const [importOpen, setImportOpen] = useState(false);
  const [notice, setNotice] = useState("");

  usePageEnter(pageRef, [
    { selector: "[data-stat-card]", from: { opacity: 0, y: 18 } },
    { selector: "[data-search-bar]", from: { opacity: 0, y: 14 }, to: { duration: 0.45, ease: "power3.out" } }
  ], { stagger: 0.06, delay: 0.05 });

  useEffect(() => {
    setRows(readLocalCache(CACHE_KEY, patients));
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) setSearch(query);
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

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? "Paciente"} description={selected ? `${selected.id} · ${selected.status}` : undefined} width="max-w-xl">
        {selected ? <PatientProfile patient={selected} onNewAttendance={() => { setSelected(null); router.push("/atendimentos"); }} /> : null}
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

function PatientProfile({ patient, onNewAttendance }: { patient: Patient; onNewAttendance: () => void }) {
  const historyTones = {
    Consulta: "blue",
    Atendimento: "orange",
    Protocolo: "green",
    "Interação com IA": "neutral"
  } as const;
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
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
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
          <p className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-3 text-[13px] font-semibold text-clinical-muted">Nenhum evento futuro agendado.</p>
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

      <div className="mt-7">
        <h3 className="mb-1 text-sm font-extrabold text-clinical-dark">Histórico</h3>
        <p className="mb-3 text-xs font-semibold text-clinical-muted">Consultas, atendimentos, protocolos e interações com a IA.</p>
        <Timeline
          items={patient.history.slice(0, 7).map((item) => ({
            id: item.id,
            icon: item.type === "Consulta" ? CalendarDays : item.type === "Atendimento" ? Headphones : item.type === "Protocolo" ? UserRoundCheck : Bot,
            title: item.title,
            subtitle: item.detail,
            date: item.date,
            tone: historyTones[item.type]
          }))}
        />
      </div>

      {patient.notes ? (
        <div className="mt-7">
          <h3 className="mb-2 text-sm font-extrabold text-clinical-dark">Observações</h3>
          <p className="rounded-2xl border border-clinical-border/[0.12] bg-clinical-surfaceMuted/35 p-3 text-[13px] leading-5 text-clinical-slate">{patient.notes}</p>
        </div>
      ) : null}

      <div className="mt-7 flex flex-wrap gap-2 border-t border-clinical-border/[0.12] pt-5">
        <Button onClick={onNewAttendance}><Headphones className="size-4" />Novo atendimento</Button>
      </div>
    </div>
  );
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
