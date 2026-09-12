"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import iconBlack from "@/assets/icon_black.webp";
import iconWhite from "@/assets/icon_white.webp";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/Button";

export function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const surfaceLogo = theme === "dark" ? iconWhite : iconBlack;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "error" | "loading">("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !password.trim()) { setStatus("error"); return; }
    setStatus("loading");
    window.setTimeout(() => router.replace("/atendimentos"), 650);
  }

  return (
    <main className="ebot-canvas flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-ebot-border/[0.14] bg-ebot-surface/85 shadow-ebot lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden bg-ebot-charcoal p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-white"><Image src={iconWhite} alt="Ê-Bot" className="size-8 object-contain" /></div><div><p className="font-extrabold">Ê-Bot</p><p className="text-xs text-white/55">Central operacional</p></div></div><div className="mt-24 max-w-sm"><p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ebot-primary">Operação no WhatsApp</p><h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.04em]">Clareza para cada conversa que vira receita.</h1><p className="mt-5 text-sm leading-6 text-white/65">Atendimentos, CRM e automações em um só painel, com o time no controle de cada conversa.</p></div></div>
          <div className="flex items-center gap-2 text-xs font-bold text-white/55"><ShieldCheck className="size-4 text-ebot-green" /> Ambiente protegido para sua equipe</div>
        </section>
        <section className="p-6 sm:p-10 lg:p-14">
          <div className="mb-9 lg:hidden"><div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-2xl border border-ebot-border/[0.12] bg-white"><Image src={surfaceLogo} alt="Ê-Bot" className="size-7 object-contain" /></div><div><p className="font-extrabold text-ebot-dark">Ê-Bot</p><p className="text-xs font-semibold text-ebot-muted">Central operacional</p></div></div></div>
          <div className="max-w-md"><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ebot-primaryText">Bem-vindo de volta</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-ebot-dark">Entrar na central</h2><p className="mt-2 text-sm leading-6 text-ebot-muted">Use suas credenciais para continuar a operação.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              <label className="block"><span className="mb-2 block text-sm font-extrabold text-ebot-dark">Usuário</span><span className="flex h-12 items-center gap-3 rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3.5 focus-within:border-ebot-primary/45 focus-within:ring-2 focus-within:ring-ebot-primary/10"><UserRound className="size-4 text-ebot-primary" aria-hidden="true" /><input autoComplete="username" value={username} onChange={(event) => { setUsername(event.target.value); setStatus("idle"); }} className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-ebot-dark outline-none" placeholder="seu.usuario" /></span></label>
              <label className="block"><span className="mb-2 block text-sm font-extrabold text-ebot-dark">Senha</span><span className="flex h-12 items-center gap-3 rounded-2xl border border-ebot-border/[0.14] bg-ebot-surfaceMuted/45 px-3.5 focus-within:border-ebot-primary/45 focus-within:ring-2 focus-within:ring-ebot-primary/10"><LockKeyhole className="size-4 text-ebot-primary" aria-hidden="true" /><input autoComplete="current-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); setStatus("idle"); }} className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-ebot-dark outline-none" placeholder="••••••••" /><button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword((current) => !current)} className="flex size-8 items-center justify-center rounded-xl text-ebot-muted hover:bg-ebot-primary/10 hover:text-ebot-primary focus:outline-none focus:ring-2 focus:ring-ebot-primary/25">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span></label>
              {status === "error" ? <p role="alert" className="rounded-2xl bg-red-500/[0.08] px-3 py-2.5 text-sm font-bold text-red-600">Informe usuário e senha para continuar.</p> : null}
              <Button type="submit" className="h-12 w-full rounded-2xl" disabled={status === "loading"}>{status === "loading" ? "Entrando..." : <>Entrar na central <ArrowRight className="size-4" /></>}</Button>
            </form>
            <p className="mt-7 flex items-center justify-center gap-2 text-xs font-semibold text-ebot-muted"><ShieldCheck className="size-3.5 text-ebot-green" /> Seus dados permanecem protegidos.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
