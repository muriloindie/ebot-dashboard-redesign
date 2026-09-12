"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CalendarPlus,
  CalendarRange,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ListOrdered,
  MapPin,
  SearchX,
  Stethoscope,
  Timer,
  X
} from "lucide-react";
import { appointments as appointmentSeed, agents, appointmentTypes, type Appointment, type AppointmentStatus, type AppointmentType, type AppointmentUnit } from "@/data/agendaMock";
import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import { usePageEnter } from "@/lib/usePageEnter";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { ModalField, ModalSelect } from "@/components/ui/ModalField";
import { Dropdown } from "@/components/ui/Dropdown";
import { Avatar } from "@/components/ui/Avatar";
import { ViewSwitch } from "@/components/ui/ViewSwitch";
import { PageHeader, StatePanel } from "@/components/ui/Week1Primitives";
import { cn } from "@/lib/cn";

type ViewMode = "dia" | "semana" | "mes";
type StoredAppointment = Appointment;

const CACHE_KEY = "ebot-week2-appointments";
const ALL = "Todos";
const DAY_START = 7 * 60;
const DAY_END = 19 * 60;
const PX_PER_MIN = 1.1;
const appointmentUnits: AppointmentUnit[] = ["Filial Centro", "Filial Norte", "Filial Sul"];

const statusStyle: Record<AppointmentStatus, { block: string; chip: "blue" | "orange" | "green" | "neutral" | "red"; label: string }> = {
  Confirmada: { block: "border-ebot-primary/25 bg-ebot-primary/[0.10]", chip: "blue", label: "Confirmada" },
  "Aguardando confirmação": { block: "border-ebot-orange/30 bg-ebot-orange/[0.10]", chip: "orange", label: "Aguardando" },
  "Em atendimento": { block: "border-ebot-green/30 bg-ebot-green/[0.12]", chip: "green", label: "Em atendimento" },
  Cancelada: { block: "border-ebot-border/[0.14] bg-ebot-surfaceMuted/60", chip: "neutral", label: "Cancelada" },
  Encaixe: { block: "border-dashed border-ebot-teal/40 bg-ebot-teal/[0.10]", chip: "blue", label: "Encaixe" }
};

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(base: Date, days: number) {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date;
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function toDate(offset: number) {
  return addDays(startOfToday(), offset);
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isValidTime(time: string) {
  if (!/^\d{2}:\d{2}$/.test(time)) return false;
  const minutes = timeToMinutes(time);
  return Number.isInteger(minutes) && minutes >= 0 && minutes < 24 * 60;
}

function parseDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) || dateKey(date) !== value ? null : date;
}

function formatTime(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function formatFullLabel(date: Date) {
  const today = startOfToday();
  if (dateKey(date) === dateKey(today)) return "Hoje";
  if (dateKey(date) === dateKey(addDays(today, 1))) return "Amanhã";
  if (dateKey(date) === dateKey(addDays(today, -1))) return "Ontem";
  return new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "numeric", month: "short" }).format(date);
}

function getWeekDates(base: Date) {
  const monday = addDays(base, -(base.getDay() === 0 ? 6 : base.getDay() - 1));
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

function getMonthCells(base: Date) {
  const first = new Date(base.getFullYear(), base.getMonth(), 1);
  const offset = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const start = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

function assignLanes(items: Appointment[]) {
  const sorted = [...items].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
  const lanes: Appointment[][] = [];
  const laneByAppointment = new Map<string, number>();
  for (const item of sorted) {
    let laneIndex = lanes.findIndex((lane) => timeToMinutes(lane[lane.length - 1].end) <= timeToMinutes(item.start));
    if (laneIndex === -1) {
      lanes.push([]);
      laneIndex = lanes.length - 1;
    }
    lanes[laneIndex].push(item);
    laneByAppointment.set(item.id, laneIndex);
  }
  return { lanes, laneByAppointment };
}

function findConflicts(items: Appointment[]) {
  const conflicts = new Set<string>();
  for (const item of items) {
    if (item.status === "Cancelada") continue;
    for (const other of items) {
      if (item.id === other.id) continue;
      if (other.status === "Cancelada") continue;
      if (item.agentId !== other.agentId) continue;
      if (item.dateOffset !== other.dateOffset) continue;
      const aStart = timeToMinutes(item.start);
      const aEnd = timeToMinutes(item.end);
      const bStart = timeToMinutes(other.start);
      const bEnd = timeToMinutes(other.end);
      if (aStart < bEnd && bStart < aEnd) {
        conflicts.add(item.id);
        conflicts.add(other.id);
      }
    }
  }
  return conflicts;
}

export function AgendaPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ViewMode>("dia");
  const [selectedDate, setSelectedDate] = useState(() => startOfToday());
  const [rows, setRows] = useState<StoredAppointment[]>(appointmentSeed);
  const [agentId, setAgentId] = useState(ALL);
  const [unit, setUnit] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeTone, setNoticeTone] = useState<"success" | "error">("success");

  usePageEnter(pageRef, [
    { selector: "[data-calendar-panel]", from: { opacity: 0, y: 20 } },
    { selector: "[data-next-panel]", from: { opacity: 0, x: 28 }, to: { duration: 0.5, ease: "power3.out" } }
  ], { stagger: 0.08, delay: 0.05 });

  useEffect(() => setRows(readLocalCache(CACHE_KEY, appointmentSeed)), []);

  const today = startOfToday();
  const selected = rows.find((row) => row.id === selectedId) ?? null;
  const units = Array.from(new Set([...appointmentUnits, ...rows.map((row) => row.unit)]));
  const agentFilterValue = agentId === ALL ? ALL : agents.find((item) => item.id === agentId)?.name ?? ALL;
  const hasFilters = agentId !== ALL || unit !== ALL || type !== ALL;

  const filteredAppointments = useMemo(() => {
    return rows.filter((row) => {
      const matchesAgent = agentId === ALL || row.agentId === agentId;
      const matchesUnit = unit === ALL || row.unit === unit;
      const matchesType = type === ALL || row.type === type;
      return matchesAgent && matchesUnit && matchesType;
    });
  }, [rows, agentId, unit, type]);

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);
  const monthCells = useMemo(() => getMonthCells(selectedDate), [selectedDate]);
  const visibleAppointments = useMemo(() => {
    const visibleDates = view === "dia" ? [selectedDate] : view === "semana" ? weekDates : monthCells;
    const visibleKeys = new Set(visibleDates.map(dateKey));
    return filteredAppointments.filter((row) => visibleKeys.has(dateKey(toDate(row.dateOffset))));
  }, [filteredAppointments, view, selectedDate, weekDates, monthCells]);

  const conflicts = useMemo(() => findConflicts(rows), [rows]);

  const upcoming = useMemo(() => {
    return filteredAppointments
      .filter((row) => row.status !== "Cancelada" && (row.dateOffset > 0 || (row.dateOffset === 0 && timeToMinutes(row.start) >= timeToMinutes("07:00"))))
      .sort((a, b) => a.dateOffset - b.dateOffset || timeToMinutes(a.start) - timeToMinutes(b.start))
      .slice(0, 9);
  }, [filteredAppointments]);

  function showNotice(message: string, tone: "success" | "error" = "success") {
    setNoticeTone(tone);
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function persist(next: StoredAppointment[]) {
    setRows(next);
    writeLocalCache(CACHE_KEY, next);
  }

  function patch(id: string, changes: Partial<StoredAppointment>) {
    persist(rows.map((row) => (row.id === id ? { ...row, ...changes } : row)));
  }

  function moveDate(direction: number) {
    const step = view === "dia" ? 1 : view === "semana" ? 7 : 0;
    if (view === "mes") {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction, 1));
    } else {
      setSelectedDate(addDays(selectedDate, step * direction));
    }
  }

  function confirmSelected() {
    if (!selected || selected.status !== "Aguardando confirmação") return;
    patch(selected.id, { status: "Confirmada" });
    setSelectedId(null);
    showNotice(`Agendamento de ${selected.client} confirmada.`);
  }

  function cancelSelected() {
    if (!selected || selected.status === "Cancelada") return;
    patch(selected.id, { status: "Cancelada" });
    setSelectedId(null);
    showNotice(`Agendamento de ${selected.client} cancelada. Horário liberado.`);
  }

  function reschedule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const dateValue = String(form.get("date") ?? "");
    const timeValue = String(form.get("time") ?? "");
    const target = parseDateInput(dateValue);
    const duration = timeToMinutes(selected.end) - timeToMinutes(selected.start);
    const startMin = timeToMinutes(timeValue);
    const endMin = startMin + duration;
    if (!target || !isValidTime(timeValue) || !Number.isInteger(duration) || duration <= 0 || startMin < DAY_START || endMin > DAY_END) {
      showNotice("Informe uma data e um horário válidos dentro do funcionamento da filial.", "error");
      return;
    }
    const offset = Math.round((target.getTime() - today.getTime()) / 86_400_000);
    const nextAppointment = { ...selected, dateOffset: offset, start: timeValue, end: formatTime(endMin), status: "Aguardando confirmação" as AppointmentStatus };
    const hasConflict = findConflicts([...rows.filter((row) => row.id !== selected.id), nextAppointment]).has(selected.id);
    patch(selected.id, { dateOffset: offset, start: timeValue, end: formatTime(endMin), status: "Aguardando confirmação" });
    setRescheduleOpen(false);
    setSelectedId(null);
    showNotice(hasConflict ? `Agendamento de ${selected.client} reagendada, mas há conflito de horário com o atendente.` : `Agendamento de ${selected.client} reagendada.`);
  }

  function createAppointment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const client = String(form.get("client") ?? "").trim();
    const agentValue = String(form.get("agent") ?? "");
    const typeValue = String(form.get("type") ?? "");
    const dateValue = String(form.get("date") ?? "");
    const start = String(form.get("start") ?? "");
    const durationValue = String(form.get("duration") ?? "");
    const unitValue = String(form.get("unit") ?? "");
    const duration = Number(durationValue);
    const target = parseDateInput(dateValue);
    if (!client || !agents.some((item) => item.id === agentValue) || !target || !isValidTime(start) || !Number.isInteger(duration) || duration <= 0 || !appointmentTypes.includes(typeValue as AppointmentType) || !appointmentUnits.includes(unitValue as AppointmentUnit)) {
      showNotice("Preencha cliente, atendente, data, horário, duração e filial com valores válidos.", "error");
      return;
    }
    const offset = Math.round((target.getTime() - today.getTime()) / 86_400_000);
    const startMin = timeToMinutes(start);
    const endMin = startMin + duration;
    if (startMin < DAY_START || endMin > DAY_END) {
      showNotice("O horário deve ficar entre 07:00 e 19:00, respeitando a duração informada.", "error");
      return;
    }
    const highestId = rows.reduce((highest, row) => Math.max(highest, Number(row.id.match(/(\d+)$/)?.[1] ?? 0)), 100);
    const next: StoredAppointment = {
      id: `AG-${String(highestId + 1).padStart(3, "0")}`,
      client,
      agentId: agentValue,
      type: typeValue as AppointmentType,
      dateOffset: offset,
      start,
      end: formatTime(endMin),
      status: "Aguardando confirmação",
      unit: unitValue as AppointmentUnit
    };
    persist([...rows, next]);
    setNewOpen(false);
    setSelectedDate(target);
    const hasConflict = findConflicts([...rows, next]).has(next.id);
    showNotice(hasConflict ? `Agendamento de ${next.client} criada, mas há conflito de horário com o atendente.` : `Agendamento de ${next.client} criada para ${formatFullLabel(target)} às ${start}.`);
  }

  function clearFilters() {
    setAgentId(ALL);
    setUnit(ALL);
    setType(ALL);
  }

  const selectedDateLabel = `${formatFullLabel(selectedDate)} · ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(selectedDate)}`;

  return (
    <div ref={pageRef}>
      <PageHeader
        eyebrow="Operação / Agenda"
        title="Agenda"
        description="Organize agendamentos, encaixes e disponibilidade da equipe."
        action={<Button onClick={() => setNewOpen(true)}><CalendarPlus className="size-4" />Nova agendamento</Button>}
      />

      {notice ? (
        <div role="status" className={cn("mb-4 flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-bold", noticeTone === "error" ? "border-red-500/20 bg-red-500/[0.08] text-red-500" : "border-ebot-green/20 bg-ebot-green/[0.08] text-ebot-green")}>
          <span className="flex items-center gap-2">{noticeTone === "error" ? <AlertTriangle className="size-4" /> : <Check className="size-4" />}{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button>
        </div>
      ) : null}

      <div data-calendar-panel className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(270px,0.38fr)]">
        <section className="overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/75">
          <div className="flex flex-col gap-3 border-b border-ebot-border/[0.12] p-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => moveDate(-1)} aria-label="Período anterior" className="flex size-10 items-center justify-center rounded-xl border border-ebot-border/[0.12] text-ebot-muted transition hover:border-ebot-primary/25 hover:text-ebot-primary"><ChevronLeft className="size-4" /></button>
              <button type="button" onClick={() => setSelectedDate(startOfToday())} aria-label="Ir para hoje" className="flex h-10 items-center rounded-xl border border-ebot-border/[0.12] px-3 text-[13px] font-extrabold text-ebot-primaryText transition hover:border-ebot-primary/30 hover:bg-ebot-primary/[0.07]">Hoje</button>
              <button type="button" onClick={() => moveDate(1)} aria-label="Próximo período" className="flex size-10 items-center justify-center rounded-xl border border-ebot-border/[0.12] text-ebot-muted transition hover:border-ebot-primary/25 hover:text-ebot-primary"><ChevronRight className="size-4" /></button>
              <p className="ml-2 text-sm font-extrabold text-ebot-dark">{selectedDateLabel}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ViewSwitch views={[{ id: "dia", label: "Dia", icon: Clock3 }, { id: "semana", label: "Semana", icon: CalendarRange }, { id: "mes", label: "Mês", icon: CalendarDays }]} value={view} onChange={(id) => setView(id as ViewMode)} />
              <Dropdown label="Atendente" value={agentFilterValue} options={[ALL, ...agents.map((item) => item.name)]} onChange={(value) => setAgentId(value === ALL ? ALL : agents.find((item) => item.name === value)?.id ?? ALL)} className="min-w-[170px]" />
              <Dropdown label="Filial" value={unit} options={[ALL, ...units]} onChange={setUnit} className="min-w-[150px]" />
              <Dropdown label="Tipo" value={type} options={[ALL, ...appointmentTypes]} onChange={setType} className="min-w-[140px]" />
            </div>
          </div>

          {visibleAppointments.length === 0 ? (
            <div className="p-4">
              <StatePanel icon={SearchX} title="Nenhum agendamento neste período" description="Ajuste os filtros ou navegue para outro dia da agenda." action={hasFilters ? <Button type="button" size="sm" variant="secondary" onClick={clearFilters}>Limpar filtros</Button> : undefined} />
            </div>
          ) : (
            <div className="ebot-scrollbar overflow-x-auto">
              {view === "dia" ? (
                <DayGrid items={visibleAppointments} allItems={rows} date={selectedDate} onSelect={setSelectedId} />
              ) : view === "semana" ? (
                <WeekGrid items={visibleAppointments} allItems={rows} week={weekDates} onSelect={setSelectedId} />
              ) : (
                <MonthGrid month={selectedDate} rows={visibleAppointments} allRows={rows} onSelectDay={(date) => { setSelectedDate(date); setView("dia"); }} />
              )}
            </div>
          )}
        </section>

        <section data-next-panel className="flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/75">
          <div className="flex items-center justify-between border-b border-ebot-border/[0.12] px-4 py-3.5">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-ebot-dark"><ListOrdered className="size-4 text-ebot-primary" />Próximos atendimentos</h2>
            <span className="text-xs font-bold text-ebot-muted">{upcoming.length} próximos</span>
          </div>
          <div className="ebot-scrollbar max-h-[620px] min-h-0 flex-1 overflow-y-auto p-2">
            {upcoming.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-bold text-ebot-dark">Nada por aqui</p>
                <p className="mt-1 text-[13px] leading-5 text-ebot-muted">Nenhum agendamento futura na agenda.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {upcoming.map((row) => {
                  const agentInfo = agents.find((item) => item.id === row.agentId);
                  const conflict = conflicts.has(row.id);
                  return (
                    <button key={row.id} type="button" onClick={() => setSelectedId(row.id)} className="animate-list-in w-full rounded-2xl border border-transparent p-3 text-left transition hover:border-ebot-primary/20 hover:bg-ebot-primary/[0.05]">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0 text-[13px] font-black tabular-nums text-ebot-dark">{row.start}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-extrabold text-ebot-dark">{row.client}</p>
                          <p className="mt-0.5 truncate text-[12px] font-semibold text-ebot-muted">
                            {agentInfo ? agentInfo.name : row.agentId} · {row.type}
                          </p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <StatusChip label={statusStyle[row.status].label} tone={statusStyle[row.status].chip} />
                            {conflict ? <span title="Conflito de horário com outra agendamento do mesmo atendente"><AlertTriangle className="size-3.5 text-ebot-orange" /></span> : null}
                          </div>
                        </div>
                        <span className="mt-0.5 shrink-0 text-[11px] font-bold text-ebot-muted">{formatFullLabel(toDate(row.dateOffset))}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      <Drawer open={Boolean(selected)} onClose={() => setSelectedId(null)} title="Detalhes do agendamento" description={selected ? `${selected.id} · ${formatFullLabel(toDate(selected.dateOffset))}, ${selected.start} às ${selected.end}` : undefined}>
        {selected ? (() => {
          const agentInfo = agents.find((item) => item.id === selected.agentId);
          return (
            <div>
              <div className="flex items-center gap-3 rounded-2xl bg-ebot-primary/[0.07] p-4">
                <Avatar name={selected.client} size="lg" />
                <div className="min-w-0">
                  <p className="truncate text-base font-extrabold text-ebot-dark">{selected.client}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-ebot-muted"><Stethoscope className="size-3.5" />{agentInfo ? agentInfo.name : selected.agentId} · {selected.type}</p>
                </div>
              </div>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                <div><dt className="text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">Status</dt><dd className="mt-1.5"><StatusChip label={statusStyle[selected.status].label} tone={statusStyle[selected.status].chip} /></dd></div>
                <div><dt className="text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">Duração</dt><dd className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-ebot-dark"><Timer className="size-4 text-ebot-primary" />{timeToMinutes(selected.end) - timeToMinutes(selected.start)} minutos</dd></div>
                <div><dt className="text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">Filial</dt><dd className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-ebot-dark"><MapPin className="size-4 text-ebot-primary" />{selected.unit}</dd></div>
                <div><dt className="text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">Tipo</dt><dd className="mt-1.5 text-sm font-bold text-ebot-dark">{selected.type}</dd></div>
              </dl>
              {selected.notes ? (
                <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-ebot-orange/20 bg-ebot-orange/[0.08] p-3 text-[13px] leading-5 text-ebot-slate">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-ebot-orange" />{selected.notes}
                </div>
              ) : null}
              <div className="mt-7 flex flex-wrap gap-2 border-t border-ebot-border/[0.12] pt-5">
                {selected.status === "Aguardando confirmação" ? <Button type="button" onClick={confirmSelected}><Check className="size-4" />Confirmar agendamento</Button> : null}
                {selected.status !== "Cancelada" ? <Button type="button" variant="secondary" onClick={() => setRescheduleOpen(true)}><CalendarRange className="size-4" />Reagendar</Button> : null}
                {selected.status !== "Cancelada" ? <Button type="button" variant="ghost" onClick={cancelSelected} className="text-red-500 hover:bg-red-500/10 hover:text-red-500"><X className="size-4" />Cancelar</Button> : null}
              </div>
            </div>
          );
        })() : null}
      </Drawer>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="Novo agendamento" eyebrow="Agenda" description="Agende um agendamento, retorno ou pedido na agenda da filial." icon={CalendarPlus} className="max-w-2xl">
        <form onSubmit={createAppointment} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField name="client" label="Cliente" icon={CalendarDays} placeholder="Ex.: Camila Rodrigues" required className="sm:col-span-2" />
            <ModalSelect name="agent" label="Atendente" icon={Stethoscope} defaultValue={agents[0].id}>
              {agents.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.specialty}</option>)}
            </ModalSelect>
            <ModalSelect name="type" label="Tipo" icon={CalendarRange} defaultValue="Agendamento">
              {appointmentTypes.map((item) => <option key={item}>{item}</option>)}
            </ModalSelect>
            <ModalField name="date" label="Data" icon={CalendarDays} type="date" required />
            <ModalField name="start" label="Início" icon={Clock3} type="time" defaultValue="09:00" required />
            <ModalSelect name="duration" label="Duração" icon={Timer} defaultValue="30">
              <option value="20">20 min</option><option value="30">30 min</option><option value="40">40 min</option><option value="50">50 min</option><option value="60">60 min</option>
            </ModalSelect>
            <ModalSelect name="unit" label="Filial" icon={MapPin} defaultValue="Filial Centro">
              <option>Filial Centro</option><option>Filial Norte</option><option>Filial Sul</option>
            </ModalSelect>
          </div>
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setNewOpen(false)}>Cancelar</Button>
            <Button type="submit"><CalendarPlus className="size-4" />Agendar</Button>
          </div>
        </form>
      </Modal>

      <Modal open={rescheduleOpen} onClose={() => setRescheduleOpen(false)} title="Reagendar agendamento" eyebrow="Agenda" description={selected ? `${selected.client} · ${selected.id}` : undefined} icon={CalendarRange} className="max-w-xl">
        <form onSubmit={reschedule} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField name="date" label="Nova data" icon={CalendarDays} type="date" defaultValue={selected ? dateKey(toDate(selected.dateOffset)) : dateKey(today)} required />
            <ModalField name="time" label="Novo horário" icon={Clock3} type="time" defaultValue={selected?.start ?? "09:00"} required />
          </div>
          <div className="rounded-2xl border border-ebot-primary/15 bg-ebot-primary/[0.06] p-3 text-xs font-semibold leading-5 text-ebot-slate">O cliente será notificado da nova data e o status voltará para aguardando confirmação.</div>
          <div className="flex justify-end gap-2 border-t border-ebot-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setRescheduleOpen(false)}>Cancelar</Button>
            <Button type="submit"><Check className="size-4" />Salvar novo horário</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function StatusChip({ label, tone }: { label: string; tone: "blue" | "orange" | "green" | "neutral" | "red" }) {
  const styles = {
    blue: "bg-ebot-primary/10 text-ebot-primaryText",
    orange: "bg-ebot-orange/12 text-ebot-orange",
    green: "bg-ebot-green/12 text-ebot-green",
    neutral: "bg-ebot-surfaceMuted text-ebot-muted",
    red: "bg-red-500/10 text-red-500"
  }[tone];
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-extrabold", styles)}>{label}</span>;
}

function HourGrid() {
  const hours = Array.from({ length: 13 }, (_, index) => DAY_START + index * 60);
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {hours.map((minute) => (
        <div key={minute} className="absolute left-0 right-0 border-t border-ebot-border/[0.08]" style={{ top: (minute - DAY_START) * PX_PER_MIN }}>
          <span className="absolute -top-2 left-1 text-[10px] font-bold tabular-nums text-ebot-muted">{`${String(Math.floor(minute / 60)).padStart(2, "0")}:00`}</span>
        </div>
      ))}
    </div>
  );
}

function NowLine() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes < DAY_START || minutes > DAY_END) return null;
  const top = (minutes - DAY_START) * PX_PER_MIN;
  return (
    <div className="pointer-events-none absolute left-0 right-0 z-10" style={{ top }} aria-hidden="true">
      <div className="relative border-t-2 border-red-500/70">
        <span className="absolute -left-1 -top-[5px] size-2.5 rounded-full bg-red-500" />
      </div>
    </div>
  );
}

function DayGrid({ items, allItems, date, onSelect }: { items: Appointment[]; allItems: Appointment[]; date: Date; onSelect: (id: string) => void }) {
  const conflicts = findConflicts(allItems);
  const { lanes } = assignLanes(items);
  const height = (DAY_END - DAY_START) * PX_PER_MIN;
  const isToday = dateKey(date) === dateKey(startOfToday());

  return (
    <div className="relative min-w-[640px]" style={{ height }}>
      <HourGrid />
      {isToday ? <NowLine /> : null}
      {lanes.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm font-bold text-ebot-muted">Nenhum agendamento neste horário.</p>
        </div>
      ) : null}
      {lanes.map((lane, laneIndex) => (
        <div key={laneIndex} className="absolute bottom-0 top-0" style={{ left: `${(laneIndex / lanes.length) * 88 + 8}%`, width: `${88 / lanes.length}%` }}>
          {lane.map((row) => (
            <AppointmentBlock key={row.id} row={row} conflict={conflicts.has(row.id)} onSelect={() => onSelect(row.id)} />
          ))}
        </div>
      ))}
    </div>
  );
}

function WeekGrid({ items, allItems, week, onSelect }: { items: Appointment[]; allItems: Appointment[]; week: Date[]; onSelect: (id: string) => void }) {
  const height = (DAY_END - DAY_START) * 0.85;
  const conflicts = findConflicts(allItems);
  return (
    <div className="min-w-[900px]">
      <div className="grid grid-cols-7 border-b border-ebot-border/[0.12] bg-ebot-surfaceMuted/40">
        {week.map((day) => (
          <div key={dateKey(day)} className={cn("border-r border-ebot-border/[0.10] px-3 py-2.5 last:border-r-0", dateKey(day) === dateKey(startOfToday()) && "bg-ebot-primary/[0.06]")}>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">{new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(day)}</p>
            <p className={cn("mt-0.5 text-sm font-black text-ebot-dark", dateKey(day) === dateKey(startOfToday()) && "text-ebot-primary")}>{day.getDate()}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {week.map((day) => {
          const dayItems = items.filter((row) => dateKey(toDate(row.dateOffset)) === dateKey(day));
          const { lanes } = assignLanes(dayItems);
          return (
            <div key={dateKey(day)} className="relative border-r border-ebot-border/[0.10] last:border-r-0" style={{ height }}>
              <HourGridMini />
              {lanes.map((lane, laneIndex) => (
                <div key={laneIndex} className="absolute bottom-0 top-0 px-0.5" style={{ left: `${(laneIndex / lanes.length) * 92 + 4}%`, width: `${92 / lanes.length}%` }}>
                  {lane.map((row) => (
                    <AppointmentBlock key={row.id} row={row} conflict={conflicts.has(row.id)} onSelect={() => onSelect(row.id)} compact />
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HourGridMini() {
  const hours = Array.from({ length: 13 }, (_, index) => DAY_START + index * 60);
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {hours.map((minute) => (
        <div key={minute} className="absolute left-0 right-0 border-t border-ebot-border/[0.07]" style={{ top: (minute - DAY_START) * 0.85 }} />
      ))}
    </div>
  );
}

function AppointmentBlock({ row, conflict, onSelect, compact }: { row: Appointment; conflict: boolean; onSelect: () => void; compact?: boolean }) {
  const agentInfo = agents.find((item) => item.id === row.agentId);
  const startMin = timeToMinutes(row.start);
  const endMin = timeToMinutes(row.end);
  const durationMinutes = endMin - startMin;
  const top = (startMin - DAY_START) * PX_PER_MIN;
  const blockHeight = Math.max(34, durationMinutes * PX_PER_MIN);
  const style = statusStyle[row.status];
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{ top: compact ? (startMin - DAY_START) * 0.85 : top, height: compact ? Math.max(30, durationMinutes * 0.85) : blockHeight }}
      className={cn(
        "animate-list-in absolute left-1 right-1 z-[5] overflow-hidden rounded-xl border px-2.5 py-1.5 text-left transition duration-200 hover:shadow-card",
        style.block,
        row.status === "Cancelada" && "opacity-55",
        row.delayed && "border-l-4 border-l-red-500",
        conflict && !row.delayed && "border-l-4 border-l-ebot-orange"
      )}
      title={conflict ? "Conflito de horário com outra agendamento do mesmo atendente" : row.delayed ? "Agendamento com atraso" : undefined}
    >
      <div className="flex items-center justify-between gap-1.5">
        <p className={cn("truncate text-[13px] font-extrabold text-ebot-dark", row.status === "Cancelada" && "line-through")}>
          {row.start} · {row.client}
        </p>
        {conflict ? <AlertTriangle className="size-3.5 shrink-0 text-ebot-orange" /> : row.delayed ? <AlertTriangle className="size-3.5 shrink-0 text-red-500" /> : null}
      </div>
      {!compact ? (
        <p className="mt-0.5 truncate text-[11px] font-semibold text-ebot-muted">
          {agentInfo ? agentInfo.name : row.agentId} · {row.type}
        </p>
      ) : null}
    </button>
  );
}

function MonthGrid({ month, rows, allRows, onSelectDay }: { month: Date; rows: Appointment[]; allRows: Appointment[]; onSelectDay: (date: Date) => void }) {
  const cells = getMonthCells(month);
  const today = startOfToday();
  const conflicts = findConflicts(allRows);
  const byDay = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const row of rows) {
      const key = dateKey(toDate(row.dateOffset));
      const current = map.get(key) ?? [];
      current.push(row);
      map.set(key, current);
    }
    return map;
  }, [rows]);
  return (
    <div className="min-w-[860px]">
      <div className="grid grid-cols-7 border-b border-ebot-border/[0.12] bg-ebot-surfaceMuted/40">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
          <div key={day} className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day) => {
          const key = dateKey(day);
          const dayRows = byDay.get(key) ?? [];
          const inMonth = day.getFullYear() === month.getFullYear() && day.getMonth() === month.getMonth();
          const isToday = key === dateKey(today);
          const counts = {
            Confirmada: dayRows.filter((row) => row.status === "Confirmada").length,
            Aguardando: dayRows.filter((row) => row.status === "Aguardando confirmação" || row.status === "Encaixe").length,
            Cancelada: dayRows.filter((row) => row.status === "Cancelada").length
          };
          const conflictCount = dayRows.filter((row) => conflicts.has(row.id)).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDay(day)}
              className={cn(
                "min-h-[104px] border-b border-r border-ebot-border/[0.08] p-2 text-left transition hover:bg-ebot-primary/[0.05]",
                !inMonth && "bg-ebot-surfaceMuted/30 opacity-45",
                isToday && "bg-ebot-primary/[0.08]"
              )}
            >
              <p className={cn("inline-flex size-7 items-center justify-center rounded-full text-[13px] font-extrabold", isToday ? "bg-ebot-primary text-ebot-charcoal" : "text-ebot-dark")}>
                {day.getDate()}
              </p>
              {dayRows.length > 0 ? (
                <div className="mt-2 space-y-1">
                  {counts.Confirmada > 0 ? <DayDot tone="blue" label={`${counts.Confirmada} confirmada(s)`} /> : null}
                  {counts.Aguardando > 0 ? <DayDot tone="orange" label={`${counts.Aguardando} aguardando`} /> : null}
                  {counts.Cancelada > 0 ? <DayDot tone="neutral" label={`${counts.Cancelada} cancelada(s)`} /> : null}
                  {conflictCount > 0 ? <DayDot tone="orange" label={`${conflictCount} conflito(s)`} /> : null}
                </div>
              ) : (
                <p className="mt-2 text-[11px] font-semibold text-ebot-muted/70">—</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DayDot({ tone, label }: { tone: "blue" | "orange" | "neutral"; label: string }) {
  const styles = { blue: "bg-ebot-primary", orange: "bg-ebot-orange", neutral: "bg-ebot-muted/50" }[tone];
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-bold text-ebot-muted">
      <span className={cn("size-2 shrink-0 rounded-full", styles)} />{label}
    </span>
  );
}
