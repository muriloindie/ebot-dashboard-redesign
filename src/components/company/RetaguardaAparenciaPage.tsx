"use client";

import { useRef, useState } from "react";
import { Check, Eye, LayoutPanelLeft, Palette, Save, Sparkles, X } from "lucide-react";
import { useAppearance } from "@/components/theme/AppearanceProvider";
import type { AppearanceSettings } from "@/data/systemMock";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { PageHeader } from "@/components/ui/Week1Primitives";
import { usePageEnter } from "@/lib/usePageEnter";
import { cn } from "@/lib/cn";

const ACCENTS: { id: AppearanceSettings["accent"]; color: string }[] = [
  { id: "Verde Ê-Bot", color: "#A9D16C" },
  { id: "Verde profundo", color: "#5C8529" },
  { id: "Grafite", color: "#5D737E" },
  { id: "Névoa", color: "#C7CCDB" }
];

export function RetaguardaAparenciaPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { appearance: settings, updateAppearance, persistAppearance } = useAppearance();
  const [notice, setNotice] = useState("");

  usePageEnter(pageRef, [
    { selector: "[data-appearance-card]", from: { opacity: 0, y: 18 } }
  ], { stagger: 0.07, delay: 0.05 });

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function update(patch: Partial<AppearanceSettings>) {
    updateAppearance(patch);
  }

  function save() {
    persistAppearance();
    showNotice("Aparência aplicada e salva em todo o painel.");
  }

  return (
    <div ref={pageRef} className="space-y-4">
      <PageHeader
        eyebrow="Retaguarda / Personalização"
        title="Aparência"
        description="Ajuste a identidade visual da plataforma para esta empresa: logo, estilo da barra lateral, cor de destaque e densidade. As mudanças são aplicadas em tempo real."
        action={<Button onClick={save}><Save className="size-4" />Salvar aparência</Button>}
      />

      {notice ? (
        <div role="status" className="flex items-center justify-between rounded-2xl border border-ebot-green/20 bg-ebot-green/[0.08] px-4 py-3 text-sm font-bold text-ebot-green">
          <span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <section data-appearance-card className="rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5 shadow-[0_8px_22px_rgba(4,27,21,0.04)]">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-ebot-dark"><Sparkles className="size-4 text-ebot-primary" />Identidade</h2>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-extrabold text-ebot-dark">Nome exibido no logo</span>
            <input
              value={settings.logoText}
              onChange={(event) => update({ logoText: event.target.value })}
              className="h-11 w-full rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3 text-sm font-semibold text-ebot-dark outline-none focus:border-ebot-primary/45 focus:ring-2 focus:ring-ebot-primary/10"
            />
          </label>
          <p className="mt-4 mb-2 text-sm font-extrabold text-ebot-dark">Cor de destaque</p>
          <div className="flex flex-wrap gap-2">
            {ACCENTS.map((accent) => (
              <button
                key={accent.id}
                type="button"
                onClick={() => update({ accent: accent.id })}
                aria-pressed={settings.accent === accent.id}
                className={cn("flex items-center gap-2 rounded-2xl border px-3 py-2 text-[12px] font-extrabold transition", settings.accent === accent.id ? "border-ebot-primary/40 bg-ebot-primary/[0.06] text-ebot-dark" : "border-ebot-border/[0.14] bg-ebot-surfaceMuted/30 text-ebot-muted hover:border-ebot-primary/25")}
              >
                <span className="size-4 rounded-full" style={{ backgroundColor: accent.color }} />
                {accent.id}
              </button>
            ))}
          </div>
          <div className="mt-5">
            <Toggle checked={settings.showBadges} onChange={(value) => update({ showBadges: value })} label="Exibir badges nos menus" hint="Contadores de itens, como não lidos e filas" icon={Eye} />
          </div>
        </section>

        <section data-appearance-card className="rounded-[24px] border border-ebot-border/[0.14] bg-ebot-surface/80 p-5 shadow-[0_8px_22px_rgba(4,27,21,0.04)]">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-ebot-dark"><LayoutPanelLeft className="size-4 text-ebot-primary" />Layout</h2>
          <p className="mt-4 mb-2 text-sm font-extrabold text-ebot-dark">Estilo da barra lateral</p>
          <div className="grid grid-cols-2 gap-2">
            {(["claro", "escuro"] as const).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => update({ sidebarStyle: style })}
                aria-pressed={settings.sidebarStyle === style}
                className={cn(
                  "flex h-24 flex-col justify-between rounded-2xl border p-3 text-left transition",
                  settings.sidebarStyle === style ? "border-ebot-primary/45 ring-2 ring-ebot-primary/15" : "border-ebot-border/[0.14] hover:border-ebot-primary/25"
                )}
              >
                <span className="flex gap-1.5">
                  <span className={cn("h-14 w-4 rounded-lg", style === "claro" ? "bg-ebot-surfaceMuted" : "bg-ebot-charcoal")} />
                  <span className="flex-1 space-y-1">
                    <span className={cn("block h-2 w-3/4 rounded-full", style === "claro" ? "bg-ebot-surfaceMuted" : "bg-white/25")} />
                    <span className={cn("block h-2 w-1/2 rounded-full", style === "claro" ? "bg-ebot-surfaceMuted" : "bg-white/25")} />
                    <span className={cn("block h-2 w-2/3 rounded-full", style === "claro" ? "bg-ebot-primary/30" : "bg-ebot-primary/60")} />
                  </span>
                </span>
                <span className="text-[12px] font-extrabold capitalize text-ebot-dark">{style}</span>
              </button>
            ))}
          </div>
          <p className="mt-5 mb-2 text-sm font-extrabold text-ebot-dark">Densidade</p>
          <div className="flex gap-2">
            {(["Confortável", "Compacta"] as const).map((density) => (
              <button
                key={density}
                type="button"
                onClick={() => update({ density })}
                aria-pressed={settings.density === density}
                className={cn("rounded-2xl border px-4 py-2 text-[12px] font-extrabold transition", settings.density === density ? "border-ebot-primary/40 bg-ebot-primary/[0.06] text-ebot-dark" : "border-ebot-border/[0.14] bg-ebot-surfaceMuted/30 text-ebot-muted hover:border-ebot-primary/25")}
              >
                {density}
              </button>
            ))}
          </div>
          <div className="mt-5 space-y-2">
            <Toggle checked={settings.roundedCorners} onChange={(value) => update({ roundedCorners: value })} label="Cantos arredondados" hint="Estilo suave nos cartões e janelas" icon={Palette} />
            <Toggle checked={settings.animations} onChange={(value) => update({ animations: value })} label="Animações de entrada" hint="Transições das telas e cartões" icon={Sparkles} />
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <Button onClick={save}><Check className="size-4" />Salvar aparência</Button>
      </div>
    </div>
  );
}
