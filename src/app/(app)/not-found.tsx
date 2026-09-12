import { ArrowLeft, SearchX } from "lucide-react";
import Link from "next/link";

export default function AppNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-[28px] border border-ebot-border/[0.14] bg-ebot-surface/85 p-8 text-center shadow-ebot">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-ebot-primary/10 text-ebot-primary"><SearchX className="size-7" /></span>
        <h1 className="mt-5 text-xl font-extrabold text-ebot-dark">Módulo não encontrado</h1>
        <p className="mt-2 text-sm leading-6 text-ebot-muted">Essa área não está disponível nesta demonstração.</p>
        <Link href="/" className="mt-5 inline-flex items-center gap-2 rounded-full bg-ebot-primary px-4 py-3 text-sm font-extrabold text-ebot-charcoal"><ArrowLeft className="size-4" />Voltar ao Dashboard</Link>
      </section>
    </div>
  );
}
