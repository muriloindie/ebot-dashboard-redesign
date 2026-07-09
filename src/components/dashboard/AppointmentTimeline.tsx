"use client";

import { useState } from "react";
import { ArrowRight, Bot, CalendarClock, CheckCircle2, Clock3, MessageCircle, UserRound } from "lucide-react";
import { agendaDates, appointments } from "@/data/dashboardMock";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn } from "@/lib/cn";

const appointmentIcons = {
  success: CheckCircle2,
  warning: Clock3,
  info: Bot,
  danger: UserRound,
  neutral: CalendarClock,
  whatsapp: MessageCircle
};

export function AppointmentTimeline() {
  const [activeDate, setActiveDate] = useState(agendaDates[0]);

  return (
    <GlassCard data-right-panel className="h-full p-5 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-clinical-green/10 text-clinical-green">
            <CalendarClock className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[22px] font-extrabold tracking-[-0.03em] text-clinical-dark">Agenda inteligente</h3>
            <p className="mt-1.5 text-[15px] leading-6 text-clinical-muted">Horários críticos, confirmações e encaixes em tempo real.</p>
          </div>
        </div>
      </div>

      <div className="clinical-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        {agendaDates.map((date) => (
          <button
            key={date}
            onClick={() => setActiveDate(date)}
            className={cn(
              "shrink-0 rounded-2xl border px-4 py-2.5 text-[14px] font-extrabold transition focus:outline-none focus:ring-2 focus:ring-clinical-blue/25",
              activeDate === date ? "border-clinical-blue/20 bg-clinical-blue text-white shadow-glow" : "border-clinical-border/[0.10] bg-clinical-surface/[0.65] text-clinical-muted hover:text-clinical-blue"
            )}
          >
            {date}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3.5">
        {appointments.map((appointment) => {
          const Icon = appointmentIcons[appointment.tone];
          return (
          <div key={`${appointment.time}-${appointment.title}`} className="relative grid grid-cols-[58px_1fr] gap-3">
            <div className="pt-4 text-[14px] font-extrabold text-clinical-muted">{appointment.time}</div>
            <div className="relative rounded-[22px] border border-clinical-border/[0.10] bg-clinical-surface/72 p-3.5 transition hover:-translate-y-0.5 hover:border-clinical-blue/25 hover:bg-clinical-surface">
              <span className="absolute -left-[21px] top-6 size-3 rounded-full border-2 border-clinical-surface bg-clinical-blue shadow-glow" />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-clinical-blue/10 text-clinical-blueText">
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <p className="text-[15px] font-extrabold leading-5 text-clinical-dark">{appointment.title}</p>
                    <p className="mt-1 text-[14px] font-semibold leading-5 text-clinical-muted">{appointment.detail}</p>
                  </span>
                </div>
                <StatusPill tone={appointment.tone} className="shrink-0 self-start whitespace-normal text-left sm:whitespace-nowrap">{appointment.status}</StatusPill>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      <Button variant="secondary" className="mt-6 w-full">
        Ver agenda completa <ArrowRight className="size-4" />
      </Button>
    </GlassCard>
  );
}
