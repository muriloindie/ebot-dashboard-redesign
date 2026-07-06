"use client";

import { useState } from "react";
import { ArrowRight, CalendarClock } from "lucide-react";
import { agendaDates, appointments } from "@/data/dashboardMock";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn } from "@/lib/cn";

export function AppointmentTimeline() {
  const [activeDate, setActiveDate] = useState(agendaDates[0]);

  return (
    <GlassCard data-right-panel className="h-full p-5 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-clinical-green/10 text-clinical-green">
            <CalendarClock className="size-5" />
          </div>
          <h3 className="text-xl font-extrabold tracking-[-0.03em] text-clinical-dark">Agenda inteligente</h3>
          <p className="mt-2 text-sm leading-6 text-clinical-muted">Próximos horários e encaixes liberados.</p>
        </div>
      </div>

      <div className="clinical-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        {agendaDates.map((date) => (
          <button
            key={date}
            onClick={() => setActiveDate(date)}
            className={cn(
              "shrink-0 rounded-2xl border px-3.5 py-2.5 text-xs font-extrabold transition",
              activeDate === date ? "border-clinical-blue/20 bg-clinical-blue text-white shadow-glow" : "border-clinical-blue/10 bg-white/[0.65] text-clinical-muted hover:text-clinical-blue"
            )}
          >
            {date}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {appointments.map((appointment) => (
          <div key={`${appointment.time}-${appointment.title}`} className="relative grid grid-cols-[54px_1fr] gap-3">
            <div className="pt-1 text-xs font-extrabold text-clinical-muted">{appointment.time}</div>
            <div className="relative rounded-[20px] border border-clinical-blue/10 bg-white/[0.68] p-4 transition hover:-translate-y-0.5 hover:border-clinical-blue/25 hover:bg-white">
              <span className="absolute -left-[21px] top-5 size-3 rounded-full border-2 border-white bg-clinical-blue shadow-glow" />
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold text-clinical-dark">{appointment.title}</p>
                  <p className="mt-1 text-xs font-semibold text-clinical-muted">{appointment.detail}</p>
                </div>
                <StatusPill tone={appointment.tone}>{appointment.status}</StatusPill>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" className="mt-6 w-full">
        Ver agenda completa <ArrowRight className="size-4" />
      </Button>
    </GlassCard>
  );
}
