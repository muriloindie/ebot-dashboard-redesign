export type AppointmentStatus = "Confirmada" | "Aguardando confirmação" | "Em atendimento" | "Cancelada" | "Encaixe";
export type AppointmentType = "Consulta" | "Retorno" | "Exame" | "Teleconsulta" | "Check-up" | "Procedimento";
export type AppointmentUnit = "Unidade Centro" | "Unidade Norte" | "Unidade Sul";

export type Professional = {
  id: string;
  name: string;
  specialty: string;
  initials: string;
  color: "blue" | "green" | "teal" | "orange" | "whatsapp";
};

export type Appointment = {
  id: string;
  patient: string;
  professionalId: string;
  type: AppointmentType;
  dateOffset: number;
  start: string;
  end: string;
  status: AppointmentStatus;
  unit: AppointmentUnit;
  delayed?: boolean;
  notes?: string;
};

export const professionals: Professional[] = [
  { id: "doc-ricardo", name: "Dr. Ricardo Lima", specialty: "Cardiologia", initials: "RL", color: "blue" },
  { id: "doc-fernanda", name: "Dra. Fernanda Rocha", specialty: "Clínica Geral", initials: "FR", color: "green" },
  { id: "doc-andre", name: "Dr. André Martins", specialty: "Ortopedia", initials: "AM", color: "teal" },
  { id: "doc-camila", name: "Dra. Camila Duarte", specialty: "Dermatologia", initials: "CD", color: "orange" },
  { id: "doc-paulo", name: "Dr. Paulo Nogueira", specialty: "Pediatria", initials: "PN", color: "whatsapp" }
];

export const appointmentTypes: AppointmentType[] = ["Consulta", "Retorno", "Exame", "Teleconsulta", "Check-up", "Procedimento"];

export const appointments: Appointment[] = [
  { id: "AG-001", patient: "Jorge Tavares", professionalId: "doc-ricardo", type: "Consulta", dateOffset: -1, start: "09:00", end: "09:40", status: "Confirmada", unit: "Unidade Centro" },
  { id: "AG-002", patient: "Renata Costa", professionalId: "doc-andre", type: "Retorno", dateOffset: -1, start: "11:00", end: "11:30", status: "Confirmada", unit: "Unidade Sul" },
  { id: "AG-003", patient: "Miguel Santos", professionalId: "doc-paulo", type: "Consulta", dateOffset: -1, start: "14:00", end: "14:30", status: "Encaixe", unit: "Unidade Norte" },
  { id: "AG-004", patient: "Elisa Marques", professionalId: "doc-fernanda", type: "Check-up", dateOffset: -1, start: "15:30", end: "16:30", status: "Confirmada", unit: "Unidade Centro" },
  { id: "AG-005", patient: "Otávio Rangel", professionalId: "doc-camila", type: "Consulta", dateOffset: -1, start: "16:45", end: "17:25", status: "Cancelada", unit: "Unidade Centro" },

  { id: "AG-010", patient: "Jorge Tavares", professionalId: "doc-ricardo", type: "Consulta", dateOffset: 0, start: "08:00", end: "08:40", status: "Em atendimento", unit: "Unidade Centro", delayed: true },
  { id: "AG-011", patient: "Ana Paula Mendes", professionalId: "doc-ricardo", type: "Retorno", dateOffset: 0, start: "09:00", end: "09:40", status: "Confirmada", unit: "Unidade Centro" },
  { id: "AG-012", patient: "Roberto Freitas", professionalId: "doc-ricardo", type: "Consulta", dateOffset: 0, start: "10:00", end: "10:40", status: "Confirmada", unit: "Unidade Centro" },
  { id: "AG-013", patient: "Marta Rios", professionalId: "doc-ricardo", type: "Teleconsulta", dateOffset: 0, start: "10:20", end: "11:00", status: "Confirmada", unit: "Unidade Centro", notes: "Sobreposição com consulta presencial" },
  { id: "AG-014", patient: "Sofia Lima", professionalId: "doc-ricardo", type: "Consulta", dateOffset: 0, start: "11:15", end: "11:45", status: "Encaixe", unit: "Unidade Centro" },
  { id: "AG-015", patient: "Heloísa Ramos", professionalId: "doc-ricardo", type: "Consulta", dateOffset: 0, start: "14:00", end: "14:40", status: "Aguardando confirmação", unit: "Unidade Centro" },

  { id: "AG-020", patient: "Amanda Souza", professionalId: "doc-fernanda", type: "Consulta", dateOffset: 0, start: "16:00", end: "16:40", status: "Aguardando confirmação", unit: "Unidade Centro" },
  { id: "AG-021", patient: "Gustavo Nunes", professionalId: "doc-fernanda", type: "Consulta", dateOffset: 0, start: "09:30", end: "10:10", status: "Confirmada", unit: "Unidade Centro" },
  { id: "AG-022", patient: "Pedro Henrique", professionalId: "doc-fernanda", type: "Check-up", dateOffset: 0, start: "10:30", end: "11:30", status: "Em atendimento", unit: "Unidade Centro" },
  { id: "AG-023", patient: "Camila Rodrigues", professionalId: "doc-fernanda", type: "Consulta", dateOffset: 0, start: "13:30", end: "14:10", status: "Aguardando confirmação", unit: "Unidade Centro" },

  { id: "AG-030", patient: "João Victor Costa", professionalId: "doc-andre", type: "Retorno", dateOffset: 0, start: "09:00", end: "09:30", status: "Confirmada", unit: "Unidade Sul" },
  { id: "AG-031", patient: "Marcos Silva", professionalId: "doc-andre", type: "Consulta", dateOffset: 0, start: "10:00", end: "10:40", status: "Aguardando confirmação", unit: "Unidade Sul" },
  { id: "AG-032", patient: "Renata Costa", professionalId: "doc-andre", type: "Consulta", dateOffset: 0, start: "11:00", end: "11:40", status: "Cancelada", unit: "Unidade Sul" },
  { id: "AG-033", patient: "Diego Barbosa", professionalId: "doc-andre", type: "Retorno", dateOffset: 0, start: "14:30", end: "15:00", status: "Confirmada", unit: "Unidade Sul" },

  { id: "AG-040", patient: "Carolina Nunes", professionalId: "doc-camila", type: "Retorno", dateOffset: 0, start: "08:15", end: "08:55", status: "Confirmada", unit: "Unidade Centro" },
  { id: "AG-041", patient: "Fernanda Lima", professionalId: "doc-camila", type: "Retorno", dateOffset: 0, start: "15:00", end: "15:40", status: "Aguardando confirmação", unit: "Unidade Norte" },
  { id: "AG-042", patient: "Lucas Pereira", professionalId: "doc-camila", type: "Consulta", dateOffset: 0, start: "13:30", end: "14:10", status: "Em atendimento", unit: "Unidade Centro" },

  { id: "AG-050", patient: "Beatriz Ferreira", professionalId: "doc-paulo", type: "Consulta", dateOffset: 0, start: "08:00", end: "08:40", status: "Em atendimento", unit: "Unidade Norte", delayed: true, notes: "Aguardando encaixe prioritário" },
  { id: "AG-051", patient: "Miguel Santos", professionalId: "doc-paulo", type: "Consulta", dateOffset: 0, start: "09:30", end: "10:10", status: "Confirmada", unit: "Unidade Norte" },
  { id: "AG-052", patient: "Helena Oliveira", professionalId: "doc-paulo", type: "Procedimento", dateOffset: 0, start: "14:00", end: "14:30", status: "Confirmada", unit: "Unidade Norte" },

  { id: "AG-060", patient: "Maria Oliveira", professionalId: "doc-camila", type: "Consulta", dateOffset: 1, start: "14:30", end: "15:10", status: "Confirmada", unit: "Unidade Centro" },
  { id: "AG-061", patient: "Juliana Martins", professionalId: "doc-ricardo", type: "Retorno", dateOffset: 1, start: "10:00", end: "10:40", status: "Aguardando confirmação", unit: "Unidade Centro" },
  { id: "AG-062", patient: "Sofia Lima", professionalId: "doc-paulo", type: "Consulta", dateOffset: 1, start: "09:00", end: "09:30", status: "Confirmada", unit: "Unidade Norte" },
  { id: "AG-063", patient: "Rafael Monteiro", professionalId: "doc-fernanda", type: "Consulta", dateOffset: 1, start: "15:00", end: "15:40", status: "Confirmada", unit: "Unidade Norte" },

  { id: "AG-070", patient: "Beatriz Ferreira", professionalId: "doc-paulo", type: "Retorno", dateOffset: 2, start: "09:00", end: "09:30", status: "Confirmada", unit: "Unidade Norte" },
  { id: "AG-071", patient: "Henrique Barros", professionalId: "doc-andre", type: "Exame", dateOffset: 2, start: "13:00", end: "13:30", status: "Aguardando confirmação", unit: "Unidade Norte" },
  { id: "AG-072", patient: "Gustavo Nunes", professionalId: "doc-fernanda", type: "Retorno", dateOffset: 2, start: "11:00", end: "11:30", status: "Confirmada", unit: "Unidade Centro" },

  { id: "AG-080", patient: "Fernanda Lima", professionalId: "doc-camila", type: "Retorno", dateOffset: 3, start: "15:00", end: "15:40", status: "Confirmada", unit: "Unidade Norte" },
  { id: "AG-081", patient: "Patrícia Gomes", professionalId: "doc-fernanda", type: "Consulta", dateOffset: 3, start: "10:30", end: "11:10", status: "Aguardando confirmação", unit: "Unidade Centro" },
  { id: "AG-082", patient: "Otávio Rangel", professionalId: "doc-ricardo", type: "Teleconsulta", dateOffset: 3, start: "16:00", end: "16:30", status: "Confirmada", unit: "Unidade Sul" },

  { id: "AG-090", patient: "Carlos Eduardo Santos", professionalId: "doc-ricardo", type: "Retorno", dateOffset: 4, start: "09:30", end: "10:10", status: "Confirmada", unit: "Unidade Centro" },
  { id: "AG-091", patient: "Elisa Marques", professionalId: "doc-fernanda", type: "Check-up", dateOffset: 4, start: "14:00", end: "15:00", status: "Aguardando confirmação", unit: "Unidade Centro" },

  { id: "AG-100", patient: "José Ricardo Alves", professionalId: "doc-andre", type: "Consulta", dateOffset: 5, start: "11:00", end: "11:40", status: "Confirmada", unit: "Unidade Sul" },
  { id: "AG-101", patient: "Helena Oliveira", professionalId: "doc-paulo", type: "Consulta", dateOffset: 5, start: "08:30", end: "09:10", status: "Aguardando confirmação", unit: "Unidade Norte" }
];
