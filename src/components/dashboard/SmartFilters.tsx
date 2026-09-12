"use client";

import { useState } from "react";
import { Calendar, SlidersHorizontal } from "lucide-react";
import { filterGroups } from "@/data/dashboardMock";
import { Dropdown } from "@/components/ui/Dropdown";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export type DashboardFilters = {
  period: string;
  channel: string;
  status: string;
  team: string;
};

export function SmartFilters({ filters, onChange }: { filters: DashboardFilters; onChange: (filters: DashboardFilters) => void }) {
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [startDate, setStartDate] = useState<{ day: number; month: number; year: number } | null>({ day: today.getDate(), month: today.getMonth(), year: today.getFullYear() });
  const [endDate, setEndDate] = useState<{ day: number; month: number; year: number } | null>({ day: today.getDate(), month: today.getMonth(), year: today.getFullYear() });
  const [selecting, setSelecting] = useState<"start" | "end">("start");

  const days = getDaysInMonth(currentYear, currentMonth);
  const startOffset = getFirstDayOfMonth(currentYear, currentMonth);
  const filterSummary = `${filters.period} · ${filters.channel} · ${filters.status} · ${filters.team}`;

  function selectDate(day: number) {
    const date = { day, month: currentMonth, year: currentYear };
    if (selecting === "start") {
      setStartDate(date);
      setSelecting("end");
    } else {
      if (
        startDate &&
        (date.year < startDate.year ||
          (date.year === startDate.year && date.month < startDate.month) ||
          (date.year === startDate.year && date.month === startDate.month && date.day < startDate.day))
      ) {
        setStartDate(date);
        setEndDate(null);
        setSelecting("end");
      } else {
        setEndDate(date);
      }
    }
  }

  function formatDate(date: { day: number; month: number; year: number } | null) {
    if (!date) return "Selecionar";
    return `${String(date.day).padStart(2, "0")}/${String(date.month + 1).padStart(2, "0")}/${date.year}`;
  }

  function applyDates() {
    setDateModalOpen(false);
    setSelecting("start");
  }

  function isSelected(day: number) {
    const current = { day, month: currentMonth, year: currentYear };
    const isStart = startDate?.day === current.day && startDate?.month === current.month && startDate?.year === current.year;
    const isEnd = endDate?.day === current.day && endDate?.month === current.month && endDate?.year === current.year;
    return { isStart, isEnd, inRange: isInRange(day) };
  }

  function isInRange(day: number) {
    if (!startDate || !endDate) return false;
    const current = new Date(currentYear, currentMonth, day).getTime();
    const start = new Date(startDate.year, startDate.month, startDate.day).getTime();
    const end = new Date(endDate.year, endDate.month, endDate.day).getTime();
    return current > start && current < end;
  }

  return (
    <>
      <section className="glass-card rounded-[22px] p-3 lg:hidden">
        <button
          type="button"
          onClick={() => setFiltersModalOpen(true)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl px-1 text-left focus:outline-none focus:ring-2 focus:ring-ebot-primary/25"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-ebot-primary/10 text-ebot-primary">
              <SlidersHorizontal className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-extrabold text-ebot-dark">Filtros</span>
              <span className="block truncate text-[13px] font-semibold text-ebot-muted">{filterSummary}</span>
            </span>
          </span>
          <span className="shrink-0 rounded-full border border-ebot-primary/15 bg-ebot-primary/[0.08] px-3 py-1.5 text-[13px] font-extrabold text-ebot-primaryText">
            Editar
          </span>
        </button>
      </section>

      <section className="glass-card hidden rounded-[28px] p-4 lg:block">
        <div className="flex flex-col items-start gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-[160px] items-center gap-2 px-2 text-[15px] font-extrabold text-ebot-dark">
            <span className="flex size-9 items-center justify-center rounded-xl bg-ebot-primary/10 text-ebot-primary">
              <SlidersHorizontal className="size-4" />
            </span>
            Filtros
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
            {filterGroups.map((group) => (
              <Dropdown
                key={group.key}
                label={group.label}
                value={filters[group.key]}
                options={[...group.options]}
                onChange={(option) => onChange({ ...filters, [group.key]: option })}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setDateModalOpen(true)}
            className="flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-2xl border border-dashed border-ebot-primary/25 bg-ebot-surface/60 px-4 text-[14px] font-extrabold text-ebot-primaryText transition hover:bg-ebot-primary/10 focus:outline-none focus:ring-2 focus:ring-ebot-primary/25 sm:w-auto lg:ml-auto"
          >
            <Calendar className="size-4" />
            {startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : "Período"}
          </button>
        </div>
      </section>

      <Modal open={filtersModalOpen} onClose={() => setFiltersModalOpen(false)} title="Filtros do painel" className="max-w-md">
        <div className="space-y-3">
          {filterGroups.map((group) => (
            <Dropdown
              key={group.key}
              className="w-full"
              label={group.label}
              value={filters[group.key]}
              options={[...group.options]}
              onChange={(option) => onChange({ ...filters, [group.key]: option })}
            />
          ))}
          <button
            type="button"
            onClick={() => {
              setFiltersModalOpen(false);
              setDateModalOpen(true);
            }}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-ebot-primary/25 bg-ebot-surface/70 px-4 text-[14px] font-extrabold text-ebot-primaryText transition hover:bg-ebot-primary/10 focus:outline-none focus:ring-2 focus:ring-ebot-primary/25"
          >
            <Calendar className="size-4" />
            {startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : "Período"}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setFiltersModalOpen(false)}
          className="mt-5 flex w-full items-center justify-center rounded-2xl bg-ebot-primary px-4 py-3 text-sm font-extrabold text-ebot-charcoal shadow-[0_10px_24px_rgba(4,27,21,0.10)] transition hover:bg-ebot-primaryHover focus:outline-none focus:ring-2 focus:ring-ebot-primary/25"
        >
          Aplicar filtros
        </button>
      </Modal>

      <Modal open={dateModalOpen} onClose={() => setDateModalOpen(false)} title="Selecionar período" className="max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear((y) => y - 1);
              } else {
                setCurrentMonth((m) => m - 1);
              }
            }}
            className="flex size-9 items-center justify-center rounded-xl bg-ebot-primary/10 text-ebot-primary transition hover:bg-ebot-primary hover:text-ebot-charcoal"
          >
            <span className="text-lg">‹</span>
          </button>
          <p className="text-base font-extrabold text-ebot-dark">
            {MONTHS[currentMonth]} {currentYear}
          </p>
          <button
            type="button"
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear((y) => y + 1);
              } else {
                setCurrentMonth((m) => m + 1);
              }
            }}
            className="flex size-9 items-center justify-center rounded-xl bg-ebot-primary/10 text-ebot-primary transition hover:bg-ebot-primary hover:text-ebot-charcoal"
          >
            <span className="text-lg">›</span>
          </button>
        </div>

        <div className="mb-3 grid grid-cols-7 gap-1 text-center text-[13px] font-bold uppercase tracking-[0.08em] text-ebot-muted">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="mb-5 grid grid-cols-7 gap-1">
          {Array.from({ length: startOffset }).map((_, index) => (
            <span key={`empty-${index}`} />
          ))}
          {Array.from({ length: days }).map((_, index) => {
            const day = index + 1;
            const { isStart, isEnd, inRange } = isSelected(day);
            return (
              <button
                type="button"
                key={day}
                onClick={() => selectDate(day)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-xl text-sm font-bold transition",
                  isStart || isEnd ? "bg-ebot-primary text-ebot-charcoal shadow-glow" : inRange ? "bg-ebot-primary/15 text-ebot-primaryText" : "text-ebot-slate hover:bg-ebot-primary/10"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="mb-5 rounded-2xl border border-ebot-primary/10 bg-ebot-snow p-4">
          <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.10em] text-ebot-muted">Período selecionado</p>
          <div className="flex items-center justify-between text-sm font-bold text-ebot-dark">
            <span>{formatDate(startDate)}</span>
            <span className="text-ebot-muted">até</span>
            <span>{formatDate(endDate)}</span>
          </div>
          <p className="mt-2 text-[13px] font-semibold text-ebot-primaryText">
            {selecting === "start" ? "Selecione a data inicial" : "Selecione a data final"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
              setSelecting("start");
            }}
            className="flex-1 rounded-2xl border border-ebot-primary/15 bg-ebot-surface px-4 py-3 text-sm font-bold text-ebot-slate transition hover:bg-ebot-primary/10 focus:outline-none focus:ring-2 focus:ring-ebot-primary/25"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={applyDates}
            className="flex-1 rounded-2xl bg-ebot-primary px-4 py-3 text-sm font-bold text-ebot-charcoal shadow-glow transition hover:bg-ebot-primaryHover"
          >
            Aplicar
          </button>
        </div>
      </Modal>
    </>
  );
}
