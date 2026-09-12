export type AppointmentStatus = "Confirmada" | "Aguardando confirmação" | "Em atendimento" | "Cancelada" | "Encaixe";
export type AppointmentType = "Agendamento" | "Retorno" | "Pedido" | "Instalação" | "Check-up" | "Serviço";
export type AppointmentUnit = "Filial Centro" | "Filial Norte" | "Filial Sul";

export type Agent = {
  id: string;
  name: string;
  specialty: string;
  initials: string;
  color: "blue" | "green" | "teal" | "orange" | "whatsapp";
};

export type Appointment = {
  id: string;
  client: string;
  agentId: string;
  type: AppointmentType;
  dateOffset: number;
  start: string;
  end: string;
  status: AppointmentStatus;
  unit: AppointmentUnit;
  delayed?: boolean;
  notes?: string;
};

export const agents: Agent[] = [
  { id: "doc-ricardo", name: "Ricardo Lima", specialty: "Frota", initials: "RL", color: "blue" },
  { id: "doc-fernanda", name: "Fernanda Rocha", specialty: "Varejo", initials: "FR", color: "green" },
  { id: "doc-andre", name: "André Martins", specialty: "Corporativo", initials: "AM", color: "teal" },
  { id: "doc-camila", name: "Camila Duarte", specialty: "Varejo", initials: "CD", color: "orange" },
  { id: "doc-paulo", name: "Paulo Nogueira", specialty: "Suporte", initials: "PN", color: "whatsapp" }
];

export const appointmentTypes: AppointmentType[] = ["Agendamento", "Retorno", "Pedido", "Instalação", "Check-up", "Serviço"];

export const appointments: Appointment[] = [
  { id: "AG-001", client: "Jorge Tavares", agentId: "doc-ricardo", type: "Agendamento", dateOffset: -1, start: "09:00", end: "09:40", status: "Confirmada", unit: "Filial Centro" },
  { id: "AG-002", client: "Renata Costa", agentId: "doc-andre", type: "Retorno", dateOffset: -1, start: "11:00", end: "11:30", status: "Confirmada", unit: "Filial Sul" },
  { id: "AG-003", client: "Miguel Santos", agentId: "doc-paulo", type: "Agendamento", dateOffset: -1, start: "14:00", end: "14:30", status: "Encaixe", unit: "Filial Norte" },
  { id: "AG-004", client: "Elisa Marques", agentId: "doc-fernanda", type: "Check-up", dateOffset: -1, start: "15:30", end: "16:30", status: "Confirmada", unit: "Filial Centro" },
  { id: "AG-005", client: "Otávio Rangel", agentId: "doc-camila", type: "Agendamento", dateOffset: -1, start: "16:45", end: "17:25", status: "Cancelada", unit: "Filial Centro" },

  { id: "AG-010", client: "Jorge Tavares", agentId: "doc-ricardo", type: "Agendamento", dateOffset: 0, start: "08:00", end: "08:40", status: "Em atendimento", unit: "Filial Centro", delayed: true },
  { id: "AG-011", client: "Ana Paula Mendes", agentId: "doc-ricardo", type: "Retorno", dateOffset: 0, start: "09:00", end: "09:40", status: "Confirmada", unit: "Filial Centro" },
  { id: "AG-012", client: "Roberto Freitas", agentId: "doc-ricardo", type: "Agendamento", dateOffset: 0, start: "10:00", end: "10:40", status: "Confirmada", unit: "Filial Centro" },
  { id: "AG-013", client: "Marta Rios", agentId: "doc-ricardo", type: "Instalação", dateOffset: 0, start: "10:20", end: "11:00", status: "Confirmada", unit: "Filial Centro", notes: "Sobreposição com outro atendimento" },
  { id: "AG-014", client: "Sofia Lima", agentId: "doc-ricardo", type: "Agendamento", dateOffset: 0, start: "11:15", end: "11:45", status: "Encaixe", unit: "Filial Centro" },
  { id: "AG-015", client: "Heloísa Ramos", agentId: "doc-ricardo", type: "Agendamento", dateOffset: 0, start: "14:00", end: "14:40", status: "Aguardando confirmação", unit: "Filial Centro" },

  { id: "AG-020", client: "Amanda Souza", agentId: "doc-fernanda", type: "Agendamento", dateOffset: 0, start: "16:00", end: "16:40", status: "Aguardando confirmação", unit: "Filial Centro" },
  { id: "AG-021", client: "Gustavo Nunes", agentId: "doc-fernanda", type: "Agendamento", dateOffset: 0, start: "09:30", end: "10:10", status: "Confirmada", unit: "Filial Centro" },
  { id: "AG-022", client: "Pedro Henrique", agentId: "doc-fernanda", type: "Check-up", dateOffset: 0, start: "10:30", end: "11:30", status: "Em atendimento", unit: "Filial Centro" },
  { id: "AG-023", client: "Camila Rodrigues", agentId: "doc-fernanda", type: "Agendamento", dateOffset: 0, start: "13:30", end: "14:10", status: "Aguardando confirmação", unit: "Filial Centro" },

  { id: "AG-030", client: "João Victor Costa", agentId: "doc-andre", type: "Retorno", dateOffset: 0, start: "09:00", end: "09:30", status: "Confirmada", unit: "Filial Sul" },
  { id: "AG-031", client: "Marcos Silva", agentId: "doc-andre", type: "Agendamento", dateOffset: 0, start: "10:00", end: "10:40", status: "Aguardando confirmação", unit: "Filial Sul" },
  { id: "AG-032", client: "Renata Costa", agentId: "doc-andre", type: "Agendamento", dateOffset: 0, start: "11:00", end: "11:40", status: "Cancelada", unit: "Filial Sul" },
  { id: "AG-033", client: "Diego Barbosa", agentId: "doc-andre", type: "Retorno", dateOffset: 0, start: "14:30", end: "15:00", status: "Confirmada", unit: "Filial Sul" },

  { id: "AG-040", client: "Carolina Nunes", agentId: "doc-camila", type: "Retorno", dateOffset: 0, start: "08:15", end: "08:55", status: "Confirmada", unit: "Filial Centro" },
  { id: "AG-041", client: "Fernanda Lima", agentId: "doc-camila", type: "Retorno", dateOffset: 0, start: "15:00", end: "15:40", status: "Aguardando confirmação", unit: "Filial Norte" },
  { id: "AG-042", client: "Lucas Pereira", agentId: "doc-camila", type: "Agendamento", dateOffset: 0, start: "13:30", end: "14:10", status: "Em atendimento", unit: "Filial Centro" },

  { id: "AG-050", client: "Beatriz Ferreira", agentId: "doc-paulo", type: "Agendamento", dateOffset: 0, start: "08:00", end: "08:40", status: "Em atendimento", unit: "Filial Norte", delayed: true, notes: "Aguardando encaixe prioritário" },
  { id: "AG-051", client: "Miguel Santos", agentId: "doc-paulo", type: "Agendamento", dateOffset: 0, start: "09:30", end: "10:10", status: "Confirmada", unit: "Filial Norte" },
  { id: "AG-052", client: "Helena Oliveira", agentId: "doc-paulo", type: "Serviço", dateOffset: 0, start: "14:00", end: "14:30", status: "Confirmada", unit: "Filial Norte" },

  { id: "AG-060", client: "Maria Oliveira", agentId: "doc-camila", type: "Agendamento", dateOffset: 1, start: "14:30", end: "15:10", status: "Confirmada", unit: "Filial Centro" },
  { id: "AG-061", client: "Juliana Martins", agentId: "doc-ricardo", type: "Retorno", dateOffset: 1, start: "10:00", end: "10:40", status: "Aguardando confirmação", unit: "Filial Centro" },
  { id: "AG-062", client: "Sofia Lima", agentId: "doc-paulo", type: "Agendamento", dateOffset: 1, start: "09:00", end: "09:30", status: "Confirmada", unit: "Filial Norte" },
  { id: "AG-063", client: "Rafael Monteiro", agentId: "doc-fernanda", type: "Agendamento", dateOffset: 1, start: "15:00", end: "15:40", status: "Confirmada", unit: "Filial Norte" },

  { id: "AG-070", client: "Beatriz Ferreira", agentId: "doc-paulo", type: "Retorno", dateOffset: 2, start: "09:00", end: "09:30", status: "Confirmada", unit: "Filial Norte" },
  { id: "AG-071", client: "Henrique Barros", agentId: "doc-andre", type: "Pedido", dateOffset: 2, start: "13:00", end: "13:30", status: "Aguardando confirmação", unit: "Filial Norte" },
  { id: "AG-072", client: "Gustavo Nunes", agentId: "doc-fernanda", type: "Retorno", dateOffset: 2, start: "11:00", end: "11:30", status: "Confirmada", unit: "Filial Centro" },

  { id: "AG-080", client: "Fernanda Lima", agentId: "doc-camila", type: "Retorno", dateOffset: 3, start: "15:00", end: "15:40", status: "Confirmada", unit: "Filial Norte" },
  { id: "AG-081", client: "Patrícia Gomes", agentId: "doc-fernanda", type: "Agendamento", dateOffset: 3, start: "10:30", end: "11:10", status: "Aguardando confirmação", unit: "Filial Centro" },
  { id: "AG-082", client: "Otávio Rangel", agentId: "doc-ricardo", type: "Instalação", dateOffset: 3, start: "16:00", end: "16:30", status: "Confirmada", unit: "Filial Sul" },

  { id: "AG-090", client: "Carlos Eduardo Santos", agentId: "doc-ricardo", type: "Retorno", dateOffset: 4, start: "09:30", end: "10:10", status: "Confirmada", unit: "Filial Centro" },
  { id: "AG-091", client: "Elisa Marques", agentId: "doc-fernanda", type: "Check-up", dateOffset: 4, start: "14:00", end: "15:00", status: "Aguardando confirmação", unit: "Filial Centro" },

  { id: "AG-100", client: "José Ricardo Alves", agentId: "doc-andre", type: "Agendamento", dateOffset: 5, start: "11:00", end: "11:40", status: "Confirmada", unit: "Filial Sul" },
  { id: "AG-101", client: "Helena Oliveira", agentId: "doc-paulo", type: "Agendamento", dateOffset: 5, start: "08:30", end: "09:10", status: "Aguardando confirmação", unit: "Filial Norte" }
];
