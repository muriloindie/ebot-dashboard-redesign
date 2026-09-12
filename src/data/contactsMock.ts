export type ContactStage = "Novo contato" | "Em atendimento" | "Qualificado" | "Agendado" | "Convertido" | "Inativo";
export type ContactChannel = "WhatsApp" | "Instagram" | "E-mail" | "Telefone" | "Site";

export type Contact = {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  channel: ContactChannel;
  stage: ContactStage;
  lastSeen: string;
  tags: string[];
  photo?: string;
  origin?: string;
  responsible?: string;
};

export const contactStages: ContactStage[] = ["Novo contato", "Em atendimento", "Qualificado", "Agendado", "Convertido", "Inativo"];
export const contactChannels: ContactChannel[] = ["WhatsApp", "Instagram", "E-mail", "Telefone", "Site"];

export const contacts: Contact[] = [
  { id: "CT-0211", name: "Ana Paula Mendes", whatsapp: "+55 11 98821-0421", email: "ana.mendes@email.com", channel: "WhatsApp", stage: "Agendado", lastSeen: "Hoje, 09:42", tags: ["Cliente", "Retorno"], photo: "https://i.pravatar.cc/160?img=47" },
  { id: "CT-0208", name: "Amanda Souza", whatsapp: "+55 11 99674-2208", email: "amanda.souza@email.com", channel: "WhatsApp", stage: "Agendado", lastSeen: "Hoje, 09:05", tags: ["Lead", "Primeiro contato"], photo: "https://i.pravatar.cc/160?img=5" },
  { id: "CT-0205", name: "Fernanda Lima", whatsapp: "+55 11 99320-7781", email: "fernanda.lima@email.com", channel: "Instagram", stage: "Em atendimento", lastSeen: "Hoje, 09:44", tags: ["Lead", "Parceria"], photo: "https://i.pravatar.cc/160?img=12" },
  { id: "CT-0202", name: "Marcos Silva", whatsapp: "+55 11 99122-7703", email: "marcos.silva@email.com", channel: "WhatsApp", stage: "Qualificado", lastSeen: "Hoje, 09:36", tags: ["Cliente"], photo: "https://i.pravatar.cc/160?img=3" },
  { id: "CT-0199", name: "Patrícia Gomes", whatsapp: "+55 11 98214-3356", email: "patricia.gomes@email.com", channel: "E-mail", stage: "Convertido", lastSeen: "Hoje, 09:31", tags: ["Cliente", "Pedidos"], photo: "https://i.pravatar.cc/160?img=32" },
  { id: "CT-0196", name: "José Ricardo Alves", whatsapp: "+55 11 98577-0934", email: "jose.alves@email.com", channel: "Telefone", stage: "Convertido", lastSeen: "Hoje, 09:22", tags: ["Cliente", "Corporativo"], photo: "https://i.pravatar.cc/160?img=11" },
  { id: "CT-0193", name: "Camila Rodrigues", whatsapp: "+55 11 98703-2254", email: "camila.rodrigues@email.com", channel: "Instagram", stage: "Novo contato", lastSeen: "Hoje, 08:33", tags: ["Lead", "Valores"], photo: "https://i.pravatar.cc/160?img=9" },
  { id: "CT-0190", name: "Rafael Monteiro", whatsapp: "+55 11 99012-8873", email: "rafael.monteiro@email.com", channel: "WhatsApp", stage: "Convertido", lastSeen: "Hoje, 09:12", tags: ["Cliente"] },
  { id: "CT-0187", name: "Lucas Pereira", whatsapp: "+55 11 99183-4477", email: "lucas.pereira@email.com", channel: "WhatsApp", stage: "Convertido", lastSeen: "Hoje, 08:44", tags: ["Cliente", "Pedidos"], photo: "https://i.pravatar.cc/160?img=59" },
  { id: "CT-0184", name: "Henrique Barros", whatsapp: "+55 11 98641-9902", email: "henrique.barros@email.com", channel: "E-mail", stage: "Em atendimento", lastSeen: "Hoje, 08:19", tags: ["Lead", "Parceria"], photo: "https://i.pravatar.cc/160?img=56" },
  { id: "CT-0181", name: "Beatriz Ferreira", whatsapp: "+55 11 98455-6619", email: "beatriz.ferreira@email.com", channel: "WhatsApp", stage: "Convertido", lastSeen: "Hoje, 08:52", tags: ["Cliente", "Varejo"], photo: "https://i.pravatar.cc/160?img=21" },
  { id: "CT-0178", name: "Juliana Martins", whatsapp: "+55 11 98912-8830", email: "juliana.martins@email.com", channel: "WhatsApp", stage: "Qualificado", lastSeen: "Hoje, 08:07", tags: ["Cliente", "Prioridade"], photo: "https://i.pravatar.cc/160?img=25" },
  { id: "CT-0175", name: "Sofia Lima", whatsapp: "+55 11 99581-6642", email: "sofia.lima@email.com", channel: "Site", stage: "Novo contato", lastSeen: "Ontem, 19:40", tags: ["Lead", "Formulário"] },
  { id: "CT-0172", name: "Diego Barbosa", whatsapp: "+55 11 98227-3390", email: "diego.barbosa@email.com", channel: "Site", stage: "Qualificado", lastSeen: "Ontem, 17:55", tags: ["Lead", "Corporativo"], photo: "https://i.pravatar.cc/160?img=68" },
  { id: "CT-0169", name: "Otávio Rangel", whatsapp: "+55 11 99348-1107", email: "otavio.rangel@email.com", channel: "Telefone", stage: "Inativo", lastSeen: "12 jul 2026", tags: ["Não retornou"] },
  { id: "CT-0166", name: "Carolina Nunes", whatsapp: "+55 11 99731-1802", email: "carolina.nunes@email.com", channel: "E-mail", stage: "Convertido", lastSeen: "Hoje, 08:55", tags: ["Cliente", "Pedidos"], photo: "https://i.pravatar.cc/160?img=41" },
  { id: "CT-0163", name: "Beatriz Almeida", whatsapp: "+55 11 98231-1093", email: "beatriz.almeida@email.com", channel: "Instagram", stage: "Inativo", lastSeen: "10 jul 2026", tags: ["Lead", "Parceria"], photo: "https://i.pravatar.cc/160?img=26" }
];
