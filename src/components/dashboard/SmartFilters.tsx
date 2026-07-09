"use client";

import { useState } from "react";
import { Calendar, Filter, SlidersHorizontal } from "lucide-react";
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

export function SmartFilters() {
  const [filters, setFilters] = useState<Record<string, string>>({
    period: "Hoje",
    channel: "Todos",
    status: "Todos",
    unit: "Clínica Geral"
  });
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6);
  const [startDate, setStartDate] = useState<{ day: number; month: number; year: number } | null>({ day: 14, month: 6, year: 2026 });
  const [endDate, setEndDate] = useState<{ day: number; month: number; year: number } | null>({ day: 14, month: 6, year: 2026 });
  const [selecting, setSelecting] = useState<"start" | "end">("start");

  const days = getDaysInMonth(currentYear, currentMonth);
  const startOffset = getFirstDayOfMonth(currentYear, currentMonth);

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
      <section className="glass-card rounded-[28px] p-4">
        <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
          <div className="flex min-w-[160px] items-center gap-2 px-2 text-[15px] font-extrabold text-clinical-dark">
            <span className="flex size-9 items-center justify-center rounded-xl bg-clinical-blue/10 text-clinical-blue">
              <SlidersHorizontal className="size-4" />
            </span>
            Filtros
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filterGroups.map((group) => (
              <Dropdown
                key={group.key}
                label={group.label}
                value={filters[group.key]}
                options={[...group.options]}
                onChange={(option) => setFilters((current) => ({ ...current, [group.key]: option }))}
              />
            ))}
          </div>

          <button
            onClick={() => setDateModalOpen(true)}
            className="ml-auto flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border border-dashed border-clinical-blue/25 bg-clinical-surface/60 px-4 text-[14px] font-extrabold text-clinical-blueText transition hover:bg-clinical-blue/10 focus:outline-none focus:ring-2 focus:ring-clinical-blue/25"
          >
            <Calendar className="size-4" />
            {startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : "Período"}
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 px-2 text-[13px] font-semibold text-clinical-muted/80">
          <Filter className="size-3.5" /> Estado local do protótipo. Aqui serão conectados query params e chamadas ao backend.
        </div>
      </section>

      <Modal open={dateModalOpen} onClose={() => setDateModalOpen(false)} title="Selecionar período" className="max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear((y) => y - 1);
              } else {
                setCurrentMonth((m) => m - 1);
              }
            }}
            className="flex size-9 items-center justify-center rounded-xl bg-clinical-blue/10 text-clinical-blue transition hover:bg-clinical-blue hover:text-white"
          >
            <span className="text-lg">‹</span>
          </button>
          <p className="text-base font-extrabold text-clinical-dark">
            {MONTHS[currentMonth]} {currentYear}
          </p>
          <button
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear((y) => y + 1);
              } else {
                setCurrentMonth((m) => m + 1);
              }
            }}
            className="flex size-9 items-center justify-center rounded-xl bg-clinical-blue/10 text-clinical-blue transition hover:bg-clinical-blue hover:text-white"
          >
            <span className="text-lg">›</span>
          </button>
        </div>

        <div className="mb-3 grid grid-cols-7 gap-1 text-center text-[13px] font-bold uppercase tracking-[0.08em] text-clinical-muted">
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
                key={day}
                onClick={() => selectDate(day)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-xl text-sm font-bold transition",
                  isStart || isEnd ? "bg-clinical-blue text-white shadow-glow" : inRange ? "bg-clinical-blue/15 text-clinical-blue" : "text-clinical-slate hover:bg-clinical-blue/10"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="mb-5 rounded-2xl border border-clinical-blue/10 bg-clinical-snow p-4">
          <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.10em] text-clinical-muted">Período selecionado</p>
          <div className="flex items-center justify-between text-sm font-bold text-clinical-dark">
            <span>{formatDate(startDate)}</span>
            <span className="text-clinical-muted">até</span>
            <span>{formatDate(endDate)}</span>
          </div>
          <p className="mt-2 text-[13px] font-semibold text-clinical-blueText">
            {selecting === "start" ? "Selecione a data inicial" : "Selecione a data final"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
              setSelecting("start");
            }}
            className="flex-1 rounded-2xl border border-clinical-blue/15 bg-clinical-surface px-4 py-3 text-sm font-bold text-clinical-slate transition hover:bg-clinical-blue/10 focus:outline-none focus:ring-2 focus:ring-clinical-blue/25"
          >
            Limpar
          </button>
          <button
            onClick={applyDates}
            className="flex-1 rounded-2xl bg-clinical-blue px-4 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-clinical-blueHover"
          >
            Aplicar
          </button>
        </div>
      </Modal>
    </>
  );
}
