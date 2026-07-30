export type TicketStatus = "Atendendo" | "Aguardando" | "Resolvidos";

export const tickets = [
  { id: "AT-1048", name: "Ana Paula Mendes", initials: "AM", sector: "Recepção", queue: "Primeiro contato", status: "Atendendo" as TicketStatus, channel: "WhatsApp", preview: "Gostaria de confirmar o preparo para o exame de amanhã.", time: "09:42", unread: 2, phone: "+55 11 98821-0421" },
  { id: "AT-1047", name: "Marcos Silva", initials: "MS", sector: "Cardiologia", queue: "Retorno", status: "Aguardando" as TicketStatus, channel: "WhatsApp", preview: "Posso reagendar meu retorno para a próxima semana?", time: "09:36", unread: 0, phone: "+55 11 99122-7703" },
  { id: "AT-1042", name: "Carolina Nunes", initials: "CN", sector: "Exames", queue: "Resultados", status: "Resolvidos" as TicketStatus, channel: "E-mail", preview: "Resultado disponibilizado no portal do paciente.", time: "08:55", unread: 0, phone: "+55 11 99731-1802" },
  { id: "AT-1039", name: "João Victor Costa", initials: "JC", sector: "Ortopedia", queue: "Primeiro contato", status: "Atendendo" as TicketStatus, channel: "WhatsApp", preview: "Enviei o pedido médico conforme orientado.", time: "08:41", unread: 1, phone: "+55 11 98900-2291" },
  { id: "AT-1034", name: "Beatriz Almeida", initials: "BA", sector: "Recepção", queue: "Convênios", status: "Aguardando" as TicketStatus, channel: "Instagram", preview: "Vocês atendem pelo meu plano?", time: "08:12", unread: 0, phone: "+55 11 98231-1093" }
];

export const contacts = [
  { id: "CT-0182", name: "Ana Paula Mendes", whatsapp: "+55 11 98821-0421", email: "ana.mendes@email.com", lastSeen: "Hoje, 09:42", tags: ["Paciente", "Retorno"] },
  { id: "CT-0179", name: "Marcos Silva", whatsapp: "+55 11 99122-7703", email: "marcos.silva@email.com", lastSeen: "Hoje, 09:36", tags: ["Paciente"] },
  { id: "CT-0174", name: "Carolina Nunes", whatsapp: "+55 11 99731-1802", email: "carolina.nunes@email.com", lastSeen: "Hoje, 08:55", tags: ["Paciente", "Exames"] },
  { id: "CT-0168", name: "João Victor Costa", whatsapp: "+55 11 98900-2291", email: "joao.costa@email.com", lastSeen: "Ontem, 18:21", tags: ["Paciente"] },
  { id: "CT-0163", name: "Beatriz Almeida", whatsapp: "+55 11 98231-1093", email: "beatriz.almeida@email.com", lastSeen: "Ontem, 16:07", tags: ["Lead"] }
];

export const protocols = [
  { id: "PR-2024-0841", client: "Ana Paula Mendes", user: "Dr. Ruan", sector: "Cardiologia", queue: "Retorno", status: "Concluído", date: "14 jul 2024", report: "Disponível" },
  { id: "PR-2024-0838", client: "Marcos Silva", user: "Marina Costa", sector: "Recepção", queue: "Primeiro contato", status: "Em andamento", date: "14 jul 2024", report: "Em aberto" },
  { id: "PR-2024-0829", client: "Carolina Nunes", user: "Dr. Ruan", sector: "Exames", queue: "Resultados", status: "Concluído", date: "13 jul 2024", report: "Disponível" },
  { id: "PR-2024-0817", client: "João Victor Costa", user: "Marina Costa", sector: "Ortopedia", queue: "Primeiro contato", status: "Aguardando", date: "12 jul 2024", report: "Em aberto" }
];

export const origins = [
  { id: "OR-0081", ticket: "AT-1048", contact: "Ana Paula Mendes", originContact: "Campanha retorno", whatsapp: "+55 11 98821-0421", createdAt: "14 jul 2024, 09:42" },
  { id: "OR-0079", ticket: "AT-1047", contact: "Marcos Silva", originContact: "Indicação", whatsapp: "+55 11 99122-7703", createdAt: "14 jul 2024, 09:36" },
  { id: "OR-0074", ticket: "AT-1042", contact: "Carolina Nunes", originContact: "Instagram orgânico", whatsapp: "+55 11 99731-1802", createdAt: "14 jul 2024, 08:55" },
  { id: "OR-0069", ticket: "AT-1039", contact: "João Victor Costa", originContact: "Site institucional", whatsapp: "+55 11 98900-2291", createdAt: "13 jul 2024, 18:21" }
];

export const chatThreads = [
  { id: "CH-01", name: "Marina Costa", initials: "MC", team: "Recepção", status: "online", preview: "Vou verificar o horário para você.", time: "09:45", unread: 3, messages: [{ from: "them", text: "Bom dia! Você consegue me ajudar com um encaixe?", time: "09:43" }, { from: "me", text: "Claro, Marina. Vou verificar o horário para você.", time: "09:45" }] },
  { id: "CH-02", name: "Dr. Ricardo Lima", initials: "RL", team: "Cardiologia", status: "busy", preview: "O protocolo da Ana está pronto.", time: "09:20", unread: 0, messages: [{ from: "them", text: "O protocolo da Ana está pronto.", time: "09:20" }] },
  { id: "CH-03", name: "Equipe Exames", initials: "EX", team: "Canal interno", status: "online", preview: "Resultado liberado para revisão.", time: "08:58", unread: 1, messages: [{ from: "them", text: "Resultado liberado para revisão.", time: "08:58" }] }
];
