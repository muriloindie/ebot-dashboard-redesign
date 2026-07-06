"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText, FileType2, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { metrics } from "@/data/dashboardMock";
import { cn } from "@/lib/cn";

const formats = [
  { id: "pdf", label: "PDF", description: "Relatório visual pronto para impressão", icon: FileType2, extension: "pdf" },
  { id: "md", label: "Markdown", description: "Documento editável com resumo textual", icon: FileText, extension: "md" },
  { id: "csv", label: "CSV", description: "Planilha com dados brutos para análise", icon: FileSpreadsheet, extension: "csv" }
];

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function generatePDFContent() {
  return `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 500 >>
stream
BT /F1 18 Tf 50 720 Td (Relatorio Operacional - Ê-Bot Clinical) Tj
0 -30 Td /F1 12 Tf (Periodo: 14/07/2026 a 14/07/2026) Tj
0 -25 Td (Clinica: Clínica São Lucas) Tj
0 -40 Td /F1 14 Tf (Principais Indicadores:) Tj
0 -25 Td /F1 12 Tf (Atendimentos hoje: 1.284) Tj
0 -20 Td (Resolvidos pela IA: 73%) Tj
0 -20 Td (Consultas confirmadas: 312) Tj
0 -20 Td (Tempo medio de resposta: 18s) Tj
0 -20 Td (Faltas evitadas: 38) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000264 00000 n 
0000000814 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
901
%%EOF`;
}

function generateMDContent() {
  return `# Relatório Operacional - Ê-Bot Clinical

**Clínica:** Clínica São Lucas  
**Período:** 14/07/2026 a 14/07/2026  
**Gerado em:** ${new Date().toLocaleString("pt-BR")}

## Indicadores principais

| Indicador | Valor | Variação |
|---|---|---|
${metrics.map((m) => `| ${m.title} | ${m.value}${m.format === "percent" ? "%" : ""} | ${m.delta || "—"} |`).join("\n")}

## Resumo operacional

- Pico de atendimento entre 18h e 21h.
- A IA resolveu 76% das conversas fora do horário comercial.
- 3 horários foram liberados após cancelamentos.

> Este relatório é fictício e foi gerado para demonstração do dashboard.
`;
}

function generateCSVContent() {
  const header = "Indicador,Valor,Formato,Variação\n";
  const rows = metrics.map((m) => `"${m.title}",${m.value},${m.format},"${m.delta || ""}"`).join("\n");
  return `\ufeff${header}${rows}`;
}

export function ExportReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<string>("pdf");
  const [exporting, setExporting] = useState(false);

  function handleExport() {
    setExporting(true);
    setTimeout(() => {
      const date = new Date().toISOString().split("T")[0];
      if (selected === "pdf") {
        downloadFile(generatePDFContent(), `relatorio-ebot-${date}.pdf`, "application/pdf");
      } else if (selected === "md") {
        downloadFile(generateMDContent(), `relatorio-ebot-${date}.md`, "text/markdown");
      } else {
        downloadFile(generateCSVContent(), `relatorio-ebot-${date}.csv`, "text/csv;charset=utf-8");
      }
      setExporting(false);
      onClose();
    }, 1200);
  }

  return (
    <Modal open={open} onClose={onClose} title="Exportar relatório" className="max-w-md">
      <p className="mb-4 text-sm leading-6 text-clinical-muted">
        Escolha o formato do relatório operacional. O arquivo será gerado com dados fictícios para demonstração.
      </p>

      <div className="mb-6 space-y-2">
        {formats.map((format) => {
          const Icon = format.icon;
          const active = selected === format.id;
          return (
            <button
              key={format.id}
              onClick={() => setSelected(format.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition",
                active ? "border-clinical-blue bg-clinical-blue/8" : "border-clinical-blue/10 bg-white/60 hover:bg-white"
              )}
            >
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-2xl",
                  active ? "bg-clinical-blue text-white" : "bg-clinical-blue/10 text-clinical-blue"
                )}
              >
                <Icon className="size-5" />
              </div>
              <div>
                <p className={cn("text-sm font-extrabold", active ? "text-clinical-blue" : "text-clinical-dark")}>{format.label}</p>
                <p className="text-xs font-medium text-clinical-muted">{format.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onClose}
          disabled={exporting}
          className="flex-1 rounded-2xl border border-clinical-blue/15 bg-white px-4 py-3 text-sm font-bold text-clinical-slate transition hover:bg-clinical-blue/10 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-clinical-blue px-4 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-clinical-blueHover disabled:opacity-80"
        >
          {exporting ? <Loader2 className="size-4 animate-spin" /> : null}
          {exporting ? "Gerando..." : "Exportar"}
        </button>
      </div>
    </Modal>
  );
}
