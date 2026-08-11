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
import { appointments as appointmentSeed, professionals, appointmentTypes, type Appointment, type AppointmentStatus, type AppointmentType, type AppointmentUnit } from "@/data/agendaMock";
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

const statusStyle: Record<AppointmentStatus, { block: string; chip: "blue" | "orange" | "green" | "neutral" | "red"; label: string }> = {
  Confirmada: { block: "border-clinical-blue/25 bg-clinical-blue/[0.10]", chip: "blue", label: "Confirmada" },
  "Aguardando confirmação": { block: "border-clinical-orange/30 bg-clinical-orange/[0.10]", chip: "orange", label: "Aguardando" },
  "Em atendimento": { block: "border-clinical-green/30 bg-clinical-green/[0.12]", chip: "green", label: "Em atendimento" },
  Cancelada: { block: "border-clinical-border/[0.14] bg-clinical-surfaceMuted/60", chip: "neutral", label: "Cancelada" },
  Encaixe: { block: "border-dashed border-clinical-teal/40 bg-clinical-teal/[0.10]", chip: "blue", label: "Encaixe" }
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
    for (const other of items) {
      if (item.id === other.id) continue;
      if (item.professionalId !== other.professionalId) continue;
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
  const [professional, setProfessional] = useState(ALL);
  const [unit, setUnit] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [notice, setNotice] = useState("");

  usePageEnter(pageRef, [
    { selector: "[data-calendar-panel]", from: { opacity: 0, y: 20 } },
    { selector: "[data-next-panel]", from: { opacity: 0, x: 28 }, to: { duration: 0.5, ease: "power3.out" } }
  ], { stagger: 0.08, delay: 0.05 });

  useEffect(() => setRows(readLocalCache(CACHE_KEY, appointmentSeed)), []);

  const today = startOfToday();
  const selected = rows.find((row) => row.id === selectedId) ?? null;
  const units = Array.from(new Set(rows.map((row) => row.unit)));
  const hasFilters = professional !== ALL || unit !== ALL || type !== ALL;

  const filteredForDate = useMemo(() => {
    return rows.filter((row) => {
      const rowDate = toDate(row.dateOffset);
      const matchesDate = dateKey(rowDate) === dateKey(selectedDate);
      const matchesProfessional = professional === ALL || row.professionalId === professional;
      const matchesUnit = unit === ALL || row.unit === unit;
      const matchesType = type === ALL || row.type === type;
      return matchesDate && matchesProfessional && matchesUnit && matchesType;
    });
  }, [rows, selectedDate, professional, unit, type]);

  const upcoming = useMemo(() => {
    return rows
      .filter((row) => row.status !== "Cancelada" && (row.dateOffset > 0 || (row.dateOffset === 0 && timeToMinutes(row.start) >= timeToMinutes("07:00"))))
      .sort((a, b) => a.dateOffset - b.dateOffset || timeToMinutes(a.start) - timeToMinutes(b.start))
      .slice(0, 9);
  }, [rows]);

  function showNotice(message: string) {
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
    if (!selected) return;
    patch(selected.id, { status: "Confirmada" });
    setSelectedId(null);
    showNotice(`Consulta de ${selected.patient} confirmada.`);
  }

  function cancelSelected() {
    if (!selected) return;
    patch(selected.id, { status: "Cancelada" });
    setSelectedId(null);
    showNotice(`Consulta de ${selected.patient} cancelada. Horário liberado.`);
  }

  function reschedule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const dateValue = String(form.get("date"));
    const timeValue = String(form.get("time"));
    if (dateValue && timeValue) {
      const target = new Date(`${dateValue}T00:00:00`);
      const offset = Math.round((target.getTime() - today.getTime()) / 86_400_000);
      const duration = timeToMinutes(selected.end) - timeToMinutes(selected.start);
      const endTime = `${String(Math.floor((timeToMinutes(timeValue) + duration) / 60)).padStart(2, "0")}:${String((timeToMinutes(timeValue) + duration) % 60).padStart(2, "0")}`;
      patch(selected.id, { dateOffset: offset, start: timeValue, end: endTime, status: "Aguardando confirmação" });
    }
    setRescheduleOpen(false);
    setSelectedId(null);
    showNotice(`Consulta de ${selected.patient} reagendada.`);
  }

  function createAppointment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const dateValue = String(form.get("date"));
    const start = String(form.get("start"));
    const duration = Number(form.get("duration") ?? 30);
    const target = new Date(`${dateValue}T00:00:00`);
    const offset = Math.round((target.getTime() - today.getTime()) / 86_400_000);
    const startMin = timeToMinutes(start);
    const endTime = `${String(Math.floor((startMin + duration) / 60)).padStart(2, "0")}:${String((startMin + duration) % 60).padStart(2, "0")}`;
    const next: StoredAppointment = {
      id: `AG-${String(rows.length + 101)}`,
      patient: String(form.get("patient")),
      professionalId: String(form.get("professional")),
      type: String(form.get("type")) as AppointmentType,
      dateOffset: offset,
      start,
      end: endTime,
      status: "Aguardando confirmação",
      unit: String(form.get("unit")) as AppointmentUnit
    };
    persist([...rows, next]);
    setNewOpen(false);
    setSelectedDate(target);
    showNotice(`Consulta de ${next.patient} criada para ${formatFullLabel(target)} às ${start}.`);
  }

  function clearFilters() {
    setProfessional(ALL);
    setUnit(ALL);
    setType(ALL);
  }

  const selectedDateLabel = `${formatFullLabel(selectedDate)} · ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(selectedDate)}`;

  return (
    <div ref={pageRef}>
      <PageHeader
        eyebrow="Operação / Agenda"
        title="Agenda"
        description="Organize consultas, encaixes e disponibilidade da equipe."
        action={<Button onClick={() => setNewOpen(true)}><CalendarPlus className="size-4" />Nova consulta</Button>}
      />

      {notice ? (
        <div role="status" className="mb-4 flex items-center justify-between rounded-2xl border border-clinical-green/20 bg-clinical-green/[0.08] px-4 py-3 text-sm font-bold text-clinical-green">
          <span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button>
        </div>
      ) : null}

      <div data-calendar-panel className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(270px,0.38fr)]">
        <section className="overflow-hidden rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/75">
          <div className="flex flex-col gap-3 border-b border-clinical-border/[0.12] p-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => moveDate(-1)} aria-label="Período anterior" className="flex size-10 items-center justify-center rounded-xl border border-clinical-border/[0.12] text-clinical-muted transition hover:border-clinical-blue/25 hover:text-clinical-blue"><ChevronLeft className="size-4" /></button>
              <button type="button" onClick={() => setSelectedDate(startOfToday())} aria-label="Ir para hoje" className="flex h-10 items-center rounded-xl border border-clinical-border/[0.12] px-3 text-[13px] font-extrabold text-clinical-blueText transition hover:border-clinical-blue/30 hover:bg-clinical-blue/[0.07]">Hoje</button>
              <button type="button" onClick={() => moveDate(1)} aria-label="Próximo período" className="flex size-10 items-center justify-center rounded-xl border border-clinical-border/[0.12] text-clinical-muted transition hover:border-clinical-blue/25 hover:text-clinical-blue"><ChevronRight className="size-4" /></button>
              <p className="ml-2 text-sm font-extrabold text-clinical-dark">{selectedDateLabel}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ViewSwitch views={[{ id: "dia", label: "Dia", icon: Clock3 }, { id: "semana", label: "Semana", icon: CalendarRange }, { id: "mes", label: "Mês", icon: CalendarDays }]} value={view} onChange={(id) => setView(id as ViewMode)} />
              <Dropdown label="Profissional" value={professional} options={[ALL, ...professionals.map((professional) => professional.name)]} onChange={setProfessional} className="min-w-[170px]" />
              <Dropdown label="Unidade" value={unit} options={[ALL, ...units]} onChange={setUnit} className="min-w-[150px]" />
              <Dropdown label="Tipo" value={type} options={[ALL, ...appointmentTypes]} onChange={setType} className="min-w-[140px]" />
            </div>
          </div>

          {hasFilters && filteredForDate.length === 0 ? (
            <div className="p-4">
              <StatePanel icon={SearchX} title="Nenhuma consulta neste período" description="Ajuste os filtros ou navegue para outro dia da agenda." action={<Button size="sm" variant="secondary" onClick={clearFilters}>Limpar filtros</Button>} />
            </div>
          ) : (
            <div className="clinical-scrollbar overflow-x-auto">
              {view === "dia" ? (
                <DayGrid items={filteredForDate} date={selectedDate} onSelect={setSelectedId} />
              ) : view === "semana" ? (
                <WeekGrid items={filteredForDate} week={getWeekDates(selectedDate)} onSelect={setSelectedId} />
              ) : (
                <MonthGrid month={selectedDate} rows={rows} onSelectDay={(date) => { setSelectedDate(date); setView("dia"); }} />
              )}
            </div>
          )}
        </section>

        <section data-next-panel className="flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/75">
          <div className="flex items-center justify-between border-b border-clinical-border/[0.12] px-4 py-3.5">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-clinical-dark"><ListOrdered className="size-4 text-clinical-blue" />Próximos atendimentos</h2>
            <span className="text-xs font-bold text-clinical-muted">{upcoming.length} próximos</span>
          </div>
          <div className="clinical-scrollbar max-h-[620px] min-h-0 flex-1 overflow-y-auto p-2">
            {upcoming.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-bold text-clinical-dark">Nada por aqui</p>
                <p className="mt-1 text-[13px] leading-5 text-clinical-muted">Nenhuma consulta futura na agenda.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {upcoming.map((row) => {
                  const professionalInfo = professionals.find((item) => item.id === row.professionalId);
                  const conflict = row.notes ? true : false;
                  return (
                    <button key={row.id} type="button" onClick={() => setSelectedId(row.id)} className="animate-list-in w-full rounded-2xl border border-transparent p-3 text-left transition hover:border-clinical-blue/20 hover:bg-clinical-blue/[0.05]">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0 text-[13px] font-black tabular-nums text-clinical-dark">{row.start}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-extrabold text-clinical-dark">{row.patient}</p>
                          <p className="mt-0.5 truncate text-[12px] font-semibold text-clinical-muted">
                            {professionalInfo ? professionalInfo.name : row.professionalId} · {row.type}
                          </p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <StatusChip label={statusStyle[row.status].label} tone={statusStyle[row.status].chip} />
                            {conflict ? <span title={row.notes}><AlertTriangle className="size-3.5 text-clinical-orange" /></span> : null}
                          </div>
                        </div>
                        <span className="mt-0.5 shrink-0 text-[11px] font-bold text-clinical-muted">{formatFullLabel(toDate(row.dateOffset))}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      <Drawer open={Boolean(selected)} onClose={() => setSelectedId(null)} title="Detalhes da consulta" description={selected ? `${selected.id} · ${formatFullLabel(toDate(selected.dateOffset))}, ${selected.start} às ${selected.end}` : undefined}>
        {selected ? (() => {
          const professionalInfo = professionals.find((item) => item.id === selected.professionalId);
          return (
            <div>
              <div className="flex items-center gap-3 rounded-2xl bg-clinical-blue/[0.07] p-4">
                <Avatar name={selected.patient} size="lg" />
                <div className="min-w-0">
                  <p className="truncate text-base font-extrabold text-clinical-dark">{selected.patient}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-clinical-muted"><Stethoscope className="size-3.5" />{professionalInfo ? professionalInfo.name : selected.professionalId} · {selected.type}</p>
                </div>
              </div>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                <div><dt className="text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">Status</dt><dd className="mt-1.5"><StatusChip label={statusStyle[selected.status].label} tone={statusStyle[selected.status].chip} /></dd></div>
                <div><dt className="text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">Duração</dt><dd className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-clinical-dark"><Timer className="size-4 text-clinical-blue" />{timeToMinutes(selected.end) - timeToMinutes(selected.start)} minutos</dd></div>
                <div><dt className="text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">Unidade</dt><dd className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-clinical-dark"><MapPin className="size-4 text-clinical-blue" />{selected.unit}</dd></div>
                <div><dt className="text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">Tipo</dt><dd className="mt-1.5 text-sm font-bold text-clinical-dark">{selected.type}</dd></div>
              </dl>
              {selected.notes ? (
                <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-clinical-orange/20 bg-clinical-orange/[0.08] p-3 text-[13px] leading-5 text-clinical-slate">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-clinical-orange" />{selected.notes}
                </div>
              ) : null}
              <div className="mt-7 flex flex-wrap gap-2 border-t border-clinical-border/[0.12] pt-5">
                {selected.status === "Aguardando confirmação" ? <Button onClick={confirmSelected}><Check className="size-4" />Confirmar consulta</Button> : null}
                {selected.status !== "Cancelada" ? <Button variant="secondary" onClick={() => setRescheduleOpen(true)}><CalendarRange className="size-4" />Reagendar</Button> : null}
                {selected.status !== "Cancelada" ? <Button variant="ghost" onClick={cancelSelected} className="text-red-500 hover:bg-red-500/10 hover:text-red-500"><X className="size-4" />Cancelar</Button> : null}
              </div>
            </div>
          );
        })() : null}
      </Drawer>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="Nova consulta" eyebrow="Agenda" description="Agende uma consulta, retorno ou exame na agenda da unidade." icon={CalendarPlus} className="max-w-2xl">
        <form onSubmit={createAppointment} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField name="patient" label="Paciente" icon={CalendarDays} placeholder="Ex.: Camila Rodrigues" required className="sm:col-span-2" />
            <ModalSelect name="professional" label="Profissional" icon={Stethoscope} defaultValue={professionals[0].id}>
              {professionals.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.specialty}</option>)}
            </ModalSelect>
            <ModalSelect name="type" label="Tipo" icon={CalendarRange} defaultValue="Consulta">
              {appointmentTypes.map((item) => <option key={item}>{item}</option>)}
            </ModalSelect>
            <ModalField name="date" label="Data" icon={CalendarDays} type="date" required />
            <ModalField name="start" label="Início" icon={Clock3} type="time" defaultValue="09:00" required />
            <ModalSelect name="duration" label="Duração" icon={Timer} defaultValue="30">
              <option value="20">20 min</option><option value="30">30 min</option><option value="40">40 min</option><option value="50">50 min</option><option value="60">60 min</option>
            </ModalSelect>
            <ModalSelect name="unit" label="Unidade" icon={MapPin} defaultValue="Unidade Centro">
              <option>Unidade Centro</option><option>Unidade Norte</option><option>Unidade Sul</option>
            </ModalSelect>
          </div>
          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.12] pt-4">
            <Button type="button" variant="ghost" onClick={() => setNewOpen(false)}>Cancelar</Button>
            <Button type="submit"><CalendarPlus className="size-4" />Agendar</Button>
          </div>
        </form>
      </Modal>

      <Modal open={rescheduleOpen} onClose={() => setRescheduleOpen(false)} title="Reagendar consulta" eyebrow="Agenda" description={selected ? `${selected.patient} · ${selected.id}` : undefined} icon={CalendarRange} className="max-w-xl">
        <form onSubmit={reschedule} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField name="date" label="Nova data" icon={CalendarDays} type="date" required />
            <ModalField name="time" label="Novo horário" icon={Clock3} type="time" defaultValue={selected?.start ?? "09:00"} required />
          </div>
          <div className="rounded-2xl border border-clinical-blue/15 bg-clinical-blue/[0.06] p-3 text-xs font-semibold leading-5 text-clinical-slate">O paciente será notificado da nova data e o status voltará para aguardando confirmação.</div>
          <div className="flex justify-end gap-2 border-t border-clinical-border/[0.12] pt-4">
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
    blue: "bg-clinical-blue/10 text-clinical-blueText",
    orange: "bg-clinical-orange/12 text-clinical-orange",
    green: "bg-clinical-green/12 text-clinical-green",
    neutral: "bg-clinical-surfaceMuted text-clinical-muted",
    red: "bg-red-500/10 text-red-500"
  }[tone];
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-extrabold", styles)}>{label}</span>;
}

function HourGrid() {
  const hours = Array.from({ length: 13 }, (_, index) => DAY_START + index * 60);
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {hours.map((minute) => (
        <div key={minute} className="absolute left-0 right-0 border-t border-clinical-border/[0.08]" style={{ top: (minute - DAY_START) * PX_PER_MIN }}>
          <span className="absolute -top-2 left-1 text-[10px] font-bold tabular-nums text-clinical-muted">{`${String(Math.floor(minute / 60)).padStart(2, "0")}:00`}</span>
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

function DayGrid({ items, date, onSelect }: { items: Appointment[]; date: Date; onSelect: (id: string) => void }) {
  const conflicts = findConflicts(items);
  const { lanes } = assignLanes(items);
  const height = (DAY_END - DAY_START) * PX_PER_MIN;
  const isToday = dateKey(date) === dateKey(startOfToday());

  return (
    <div className="relative min-w-[640px]" style={{ height }}>
      <HourGrid />
      {isToday ? <NowLine /> : null}
      {lanes.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm font-bold text-clinical-muted">Nenhuma consulta neste horário.</p>
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

function WeekGrid({ items, week, onSelect }: { items: Appointment[]; week: Date[]; onSelect: (id: string) => void }) {
  const height = (DAY_END - DAY_START) * 0.85;
  return (
    <div className="min-w-[900px]">
      <div className="grid grid-cols-7 border-b border-clinical-border/[0.12] bg-clinical-surfaceMuted/40">
        {week.map((day) => (
          <div key={dateKey(day)} className={cn("border-r border-clinical-border/[0.10] px-3 py-2.5 last:border-r-0", dateKey(day) === dateKey(startOfToday()) && "bg-clinical-blue/[0.06]")}>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">{new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(day)}</p>
            <p className={cn("mt-0.5 text-sm font-black text-clinical-dark", dateKey(day) === dateKey(startOfToday()) && "text-clinical-blue")}>{day.getDate()}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {week.map((day) => {
          const dayItems = items.filter((row) => dateKey(toDate(row.dateOffset)) === dateKey(day));
          const conflicts = findConflicts(dayItems);
          const { lanes } = assignLanes(dayItems);
          return (
            <div key={dateKey(day)} className="relative border-r border-clinical-border/[0.10] last:border-r-0" style={{ height }}>
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
        <div key={minute} className="absolute left-0 right-0 border-t border-clinical-border/[0.07]" style={{ top: (minute - DAY_START) * 0.85 }} />
      ))}
    </div>
  );
}

function AppointmentBlock({ row, conflict, onSelect, compact }: { row: Appointment; conflict: boolean; onSelect: () => void; compact?: boolean }) {
  const professionalInfo = professionals.find((item) => item.id === row.professionalId);
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
        conflict && !row.delayed && "border-l-4 border-l-clinical-orange"
      )}
      title={conflict ? "Conflito de horário com outra consulta do mesmo profissional" : row.delayed ? "Consulta com atraso" : undefined}
    >
      <div className="flex items-center justify-between gap-1.5">
        <p className={cn("truncate text-[13px] font-extrabold text-clinical-dark", row.status === "Cancelada" && "line-through")}>
          {row.start} · {row.patient}
        </p>
        {conflict ? <AlertTriangle className="size-3.5 shrink-0 text-clinical-orange" /> : row.delayed ? <AlertTriangle className="size-3.5 shrink-0 text-red-500" /> : null}
      </div>
      {!compact ? (
        <p className="mt-0.5 truncate text-[11px] font-semibold text-clinical-muted">
          {professionalInfo ? professionalInfo.name : row.professionalId} · {row.type}
        </p>
      ) : null}
    </button>
  );
}

function MonthGrid({ month, rows, onSelectDay }: { month: Date; rows: Appointment[]; onSelectDay: (date: Date) => void }) {
  const cells = getMonthCells(month);
  const today = startOfToday();
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
      <div className="grid grid-cols-7 border-b border-clinical-border/[0.12] bg-clinical-surfaceMuted/40">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
          <div key={day} className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-clinical-muted">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day) => {
          const key = dateKey(day);
          const dayRows = byDay.get(key) ?? [];
          const inMonth = day.getMonth() === month.getMonth();
          const isToday = key === dateKey(today);
          const counts = {
            Confirmada: dayRows.filter((row) => row.status === "Confirmada").length,
            Aguardando: dayRows.filter((row) => row.status === "Aguardando confirmação" || row.status === "Encaixe").length,
            Cancelada: dayRows.filter((row) => row.status === "Cancelada").length
          };
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDay(day)}
              className={cn(
                "min-h-[104px] border-b border-r border-clinical-border/[0.08] p-2 text-left transition hover:bg-clinical-blue/[0.05]",
                !inMonth && "bg-clinical-surfaceMuted/30 opacity-45",
                isToday && "bg-clinical-blue/[0.08]"
              )}
            >
              <p className={cn("inline-flex size-7 items-center justify-center rounded-full text-[13px] font-extrabold", isToday ? "bg-clinical-blue text-clinical-charcoal" : "text-clinical-dark")}>
                {day.getDate()}
              </p>
              {dayRows.length > 0 ? (
                <div className="mt-2 space-y-1">
                  {counts.Confirmada > 0 ? <DayDot tone="blue" label={`${counts.Confirmada} confirmada(s)`} /> : null}
                  {counts.Aguardando > 0 ? <DayDot tone="orange" label={`${counts.Aguardando} aguardando`} /> : null}
                  {counts.Cancelada > 0 ? <DayDot tone="neutral" label={`${counts.Cancelada} cancelada(s)`} /> : null}
                </div>
              ) : (
                <p className="mt-2 text-[11px] font-semibold text-clinical-muted/70">—</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DayDot({ tone, label }: { tone: "blue" | "orange" | "neutral"; label: string }) {
  const styles = { blue: "bg-clinical-blue", orange: "bg-clinical-orange", neutral: "bg-clinical-muted/50" }[tone];
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-bold text-clinical-muted">
      <span className={cn("size-2 shrink-0 rounded-full", styles)} />{label}
    </span>
  );
}
