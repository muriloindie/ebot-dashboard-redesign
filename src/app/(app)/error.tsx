"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-[28px] border border-clinical-red/20 bg-clinical-surface/85 p-8 text-center shadow-clinical">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-clinical-red/10 text-clinical-red"><AlertTriangle className="size-7" /></span>
        <h1 className="mt-5 text-xl font-extrabold text-clinical-dark">Não foi possível carregar este módulo</h1>
        <p className="mt-2 text-sm leading-6 text-clinical-muted">Tente novamente. Os dados da demonstração continuam preservados nesta sessão.</p>
        <Button className="mt-5" onClick={() => reset()}><RefreshCw className="size-4" />Tentar novamente</Button>
      </section>
    </div>
  );
}
