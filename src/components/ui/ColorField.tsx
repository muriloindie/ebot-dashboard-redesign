"use client";

import { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Pipette } from "lucide-react";
import { cn } from "@/lib/cn";

export const EBOT_PALETTE = ["#A9D16C", "#6B942E", "#5D737E", "#C7CCDB", "#C97F12", "#C13E3E"];

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3 ? normalized.split("").map((c) => c + c).join("") : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16)
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(Number.isFinite(v) ? v : 0)));
  return `#${[clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

export function ColorField({
  label = "Cor",
  value,
  onChange,
  palette = EBOT_PALETTE
}: {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  palette?: string[];
}) {
  const [advanced, setAdvanced] = useState(false);
  const rgb = hexToRgb(value) ?? { r: 58, g: 157, b: 202 };

  function updateChannel(channel: "r" | "g" | "b", raw: string) {
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed)) return;
    const next = { ...rgb, [channel]: Math.max(0, Math.min(255, parsed)) };
    onChange(rgbToHex(next.r, next.g, next.b));
  }

  const inputClass =
    "h-10 w-full rounded-xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-2.5 font-mono text-[13px] font-bold text-ebot-dark outline-none transition focus:border-ebot-primary/45 focus:bg-ebot-surface";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-extrabold text-ebot-dark">{label}</p>
        <button
          type="button"
          onClick={() => setAdvanced((v) => !v)}
          aria-expanded={advanced}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold text-ebot-primaryText transition hover:bg-ebot-primary/10"
        >
          <Pipette className="size-3.5" />
          {advanced ? "Ocultar seletor" : "Seletor avançado"}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {palette.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            aria-pressed={value.toUpperCase() === color.toUpperCase()}
            aria-label={`Cor ${color}`}
            title={color}
            className={cn(
              "size-9 rounded-xl transition",
              value.toUpperCase() === color.toUpperCase()
                ? "ring-2 ring-ebot-primary ring-offset-2 ring-offset-ebot-surface"
                : "hover:scale-105"
            )}
            style={{ backgroundColor: color }}
          />
        ))}
        <label
          className={cn(
            "relative size-9 cursor-pointer overflow-hidden rounded-xl border border-dashed border-ebot-border/[0.25] transition hover:scale-105",
            "flex items-center justify-center text-[10px] font-extrabold text-ebot-muted"
          )}
          title="Cor personalizada"
        >
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#6B942E"}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Cor personalizada"
          />
          +
        </label>
        <span
          className="flex h-9 min-w-9 items-center justify-center rounded-xl border border-ebot-border/[0.14] px-1"
          style={{ backgroundColor: /^#[0-9a-fA-F]{6}$/i.test(value) ? value : "transparent" }}
          aria-hidden="true"
        />
      </div>
      {advanced ? (
        <div className="mt-3 rounded-2xl border border-ebot-border/[0.12] bg-ebot-surfaceMuted/30 p-3">
          <HexColorPicker color={value} onChange={(color) => onChange(color.toUpperCase())} style={{ width: "100%" }} />
          <div className="mt-3 grid grid-cols-[1fr_repeat(3,64px)] items-end gap-2">
            <label className="block">
              <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">HEX</span>
              <HexColorInput
                color={value}
                onChange={(color) => onChange(`#${color}`.toUpperCase())}
                prefixed
                className={inputClass}
                aria-label="Código HEX"
              />
            </label>
            {(["r", "g", "b"] as const).map((channel) => (
              <label key={channel} className="block">
                <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-ebot-muted">
                  {channel.toUpperCase()}
                </span>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[channel]}
                  onChange={(event) => updateChannel(channel, event.target.value)}
                  className={inputClass}
                  aria-label={`Canal ${channel.toUpperCase()}`}
                />
              </label>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
