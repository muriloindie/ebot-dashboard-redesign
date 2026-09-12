export function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

export type KpiFormat = "number" | "percent" | "seconds" | "duration" | "currency";

export type KpiSegment = {
  type: "digit" | "separator" | "unit";
  value: string;
};

export function getKpiSegments(value: number, format: KpiFormat): KpiSegment[] {
  const rounded = Math.round(value);
  const segments: KpiSegment[] = [];

  if (format === "percent") {
    const str = String(rounded);
    for (const ch of str) {
      segments.push({ type: "digit", value: ch });
    }
    segments.push({ type: "unit", value: "%" });
    return segments;
  }

  if (format === "seconds") {
    const str = String(rounded);
    for (const ch of str) {
      segments.push({ type: "digit", value: ch });
    }
    segments.push({ type: "unit", value: "s" });
    return segments;
  }

  if (format === "duration") {
    const minutes = Math.floor(rounded / 60);
    const seconds = rounded % 60;
    const minStr = String(minutes).padStart(2, "0");
    const secStr = String(seconds).padStart(2, "0");

    for (const ch of minStr) {
      segments.push({ type: "digit", value: ch });
    }
    segments.push({ type: "unit", value: "m" });
    segments.push({ type: "separator", value: " " });
    for (const ch of secStr) {
      segments.push({ type: "digit", value: ch });
    }
    segments.push({ type: "unit", value: "s" });
    return segments;
  }

  if (format === "currency") {
    segments.push({ type: "unit", value: "R$" });
    segments.push({ type: "separator", value: " " });
    const str = formatNumber(rounded);
    for (const ch of str) {
      if (/\d/.test(ch)) {
        segments.push({ type: "digit", value: ch });
      } else {
        segments.push({ type: "separator", value: ch });
      }
    }
    return segments;
  }

  const str = formatNumber(rounded);
  for (const ch of str) {
    if (/\d/.test(ch)) {
      segments.push({ type: "digit", value: ch });
    } else {
      segments.push({ type: "separator", value: ch });
    }
  }
  return segments;
}

export function formatKpiValue(value: number, format: KpiFormat) {
  if (format === "percent") return `${Math.round(value)}%`;
  if (format === "seconds") return `${Math.round(value)}s`;
  if (format === "duration") return formatDuration(Math.round(value));
  if (format === "currency") return `R$ ${formatNumber(Math.round(value))}`;
  return formatNumber(Math.round(value));
}
