"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check, GitBranch, Link2, MessageCircle, Save, SearchX, Tags, UsersRound, X } from "lucide-react";
import { origins } from "@/data/operationsMock";
import { readLocalCache, writeLocalCache } from "@/lib/localCache";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { ModalChoice, ModalSelect } from "@/components/ui/ModalField";
import { PageHeader, SearchField, StatePanel, TableCell, TableHeaderCell, TableHead, TableSurface } from "@/components/ui/Week1Primitives";

const RULES_CACHE_KEY = "ebot-week3-contact-origin-rules";

type OriginRuleId = "campaigns" | "channels" | "referrals";
type OriginRules = {
  campaigns: boolean;
  channels: boolean;
  referrals: boolean;
  priority: string;
};

const defaultRules: OriginRules = {
  campaigns: true,
  channels: false,
  referrals: false,
  priority: "Primeiro ponto de contato"
};

export function ContactOriginsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof origins[number] | null>(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [rules, setRules] = useState<OriginRules>(defaultRules);
  const [draftRules, setDraftRules] = useState<OriginRules>(defaultRules);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const cachedRules = readLocalCache<Partial<OriginRules>>(RULES_CACHE_KEY, {});
    const nextRules = { ...defaultRules, ...cachedRules };
    setRules(nextRules);
    setDraftRules(nextRules);
  }, []);

  const filtered = origins.filter((origin) => `${origin.ticket} ${origin.contact} ${origin.originContact} ${origin.whatsapp}`.toLowerCase().includes(search.toLowerCase()));
  const activeRules = [draftRules.campaigns, draftRules.channels, draftRules.referrals].filter(Boolean).length;

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function openRules() {
    setDraftRules(rules);
    setRulesOpen(true);
  }

  function toggleRule(rule: OriginRuleId) {
    setDraftRules((current) => ({ ...current, [rule]: !current[rule] }));
  }

  function saveRules() {
    setRules(draftRules);
    writeLocalCache(RULES_CACHE_KEY, draftRules);
    setRulesOpen(false);
    showNotice("Regras de origem salvas localmente.");
  }

  return (
    <div>
      <PageHeader
        eyebrow="Pacientes / Relacionamentos"
        title="Origens de contato"
        description="Entenda de onde cada contato chegou e preserve a origem no contexto do atendimento."
        action={<Button variant="secondary" onClick={openRules}><GitBranch className="size-4" />Ver regras de origem</Button>}
      />

      {notice ? (
        <div role="status" className="mb-4 flex items-center justify-between rounded-2xl border border-clinical-green/20 bg-clinical-green/[0.08] px-4 py-3 text-sm font-bold text-clinical-green">
          <span className="flex items-center gap-2"><Check className="size-4" />{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso"><X className="size-4" /></button>
        </div>
      ) : null}

      <div className="mb-4 flex flex-col gap-2 rounded-[24px] border border-clinical-border/[0.14] bg-clinical-surface/70 p-2.5 sm:flex-row sm:items-center">
        <SearchField value={search} onChange={setSearch} placeholder="Buscar ticket, contato ou origem" />
        <span className="flex shrink-0 items-center gap-2 rounded-2xl bg-clinical-blue/[0.07] px-3 py-2 text-xs font-bold text-clinical-blueText"><Link2 className="size-4" />{filtered.length} relações</span>
      </div>

      {filtered.length === 0 ? (
        <StatePanel icon={SearchX} title="Nenhum relacionamento encontrado" description="Não encontramos registros com esse termo." action={<Button size="sm" variant="secondary" onClick={() => setSearch("")}>Limpar busca</Button>} />
      ) : (
        <TableSurface caption="Origens de contato">
          <TableHead>
            <TableHeaderCell>Ticket</TableHeaderCell>
            <TableHeaderCell>Contato</TableHeaderCell>
            <TableHeaderCell>Contato de origem</TableHeaderCell>
            <TableHeaderCell>WhatsApp</TableHeaderCell>
            <TableHeaderCell>Data de criação</TableHeaderCell>
            <TableHeaderCell>Ações</TableHeaderCell>
          </TableHead>
          <tbody className="divide-y divide-clinical-border/[0.10]">
            {filtered.map((origin) => (
              <tr key={origin.id} className="animate-list-in transition hover:bg-clinical-blue/[0.035]">
                <TableCell><span className="font-extrabold text-clinical-blueText">{origin.ticket}</span></TableCell>
                <TableCell><span className="font-extrabold text-clinical-dark">{origin.contact}</span></TableCell>
                <TableCell>{origin.originContact}</TableCell>
                <TableCell>{origin.whatsapp}</TableCell>
                <TableCell>{origin.createdAt}</TableCell>
                <TableCell><button type="button" onClick={() => setSelected(origin)} className="inline-flex items-center gap-1.5 font-extrabold text-clinical-blueText transition hover:text-clinical-blue">Ver relação <ArrowUpRight className="size-4" /></button></TableCell>
              </tr>
            ))}
          </tbody>
        </TableSurface>
      )}

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.ticket ?? "Relação"} description="Origem associada ao contato.">
        {selected ? (
          <div>
            <div className="flex items-center gap-3 rounded-2xl bg-clinical-blue/[0.07] p-4"><span className="flex size-10 items-center justify-center rounded-xl bg-clinical-blue/10 text-clinical-blue"><Link2 className="size-5" /></span><div><p className="text-base font-extrabold text-clinical-dark">Relação de origem</p><p className="mt-0.5 text-xs font-semibold text-clinical-muted">{selected.ticket} · criada em {selected.createdAt}</p></div></div>
            <dl className="mt-6 space-y-5">
              <div><dt className="text-xs font-extrabold uppercase tracking-wider text-clinical-muted">Contato</dt><dd className="mt-1 text-sm font-bold text-clinical-dark">{selected.contact}</dd></div>
              <div><dt className="text-xs font-extrabold uppercase tracking-wider text-clinical-muted">Origem</dt><dd className="mt-1 text-sm font-bold text-clinical-dark">{selected.originContact}</dd></div>
              <div><dt className="text-xs font-extrabold uppercase tracking-wider text-clinical-muted">WhatsApp</dt><dd className="mt-1 text-sm font-bold text-clinical-dark">{selected.whatsapp}</dd></div>
              <div><dt className="text-xs font-extrabold uppercase tracking-wider text-clinical-muted">Criado em</dt><dd className="mt-1 text-sm font-bold text-clinical-dark">{selected.createdAt}</dd></div>
            </dl>
          </div>
        ) : null}
      </Drawer>

      <Modal open={rulesOpen} onClose={() => setRulesOpen(false)} title="Regras de origem" eyebrow="Relacionamentos" description="Escolha quais sinais devem participar da atribuição da origem e salve a preferência nesta estação." icon={GitBranch} className="max-w-xl">
        <div className="space-y-3">
          <ModalChoice label="Campanhas e anúncios" description="Atribui campanhas identificadas no primeiro contato." icon={Tags} active={draftRules.campaigns} onClick={() => toggleRule("campaigns")} />
          <ModalChoice label="Canais de conversa" description="Reconhece WhatsApp, Instagram e outros canais conectados." icon={MessageCircle} active={draftRules.channels} onClick={() => toggleRule("channels")} />
          <ModalChoice label="Indicações" description="Mantém a pessoa ou equipe que originou a relação." icon={UsersRound} active={draftRules.referrals} onClick={() => toggleRule("referrals")} />
          <ModalSelect label="Prioridade de atribuição" icon={Link2} value={draftRules.priority} onChange={(event) => setDraftRules((current) => ({ ...current, priority: event.target.value }))}><option>Primeiro ponto de contato</option><option>Última interação</option><option>Origem manual da equipe</option></ModalSelect>
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-clinical-blue/[0.06] p-3 text-sm font-semibold text-clinical-slate"><span className="flex items-center gap-2"><Check className="size-4 text-clinical-green" />{activeRules} de 3 regras ativas</span><div className="flex gap-2"><Button type="button" size="sm" variant="ghost" onClick={() => setRulesOpen(false)}>Cancelar</Button><Button type="button" size="sm" onClick={saveRules}><Save className="size-3.5" />Salvar regras</Button></div></div>
        </div>
      </Modal>
    </div>
  );
}
