export interface BasicInfo {
  fullName: string;
  displayName: string;
  specialty: string;
  subspecialty?: string;
  crm: string;
  uf: string;
  country: string;
  profilePicture?: string; // URL or base64
  bio?: string;
  personalPhoneNumber?: string;
  phoneNumber?: string;
}

export interface ClinicInfo {
  clinicName: string;
  address: string;
  onlineConsultationLink: string;
  standardDurationInPerson: string; // e.g., "60 minutos"
  standardDurationOnline: string; // e.g., "45 minutos"
  billingAddressSameAsClinic?: boolean;
  billingAddress?: string;
}

export interface AiPreferences {
  initialQuestion: string;
  tone: string; // e.g., 'Acolhedor', 'Formal'
  empathyLevel: string; // e.g., 'Empatia moderada'
  forbiddenTopics: string[];
  clinicalResponse: string;
}

export interface AvailabilitySlot {
  days: string[]; // e.g., ['Seg', 'Ter']
  startTime: string;
  endTime: string;
  interval: string;
  futureSchedulingDays: number;
}

export interface Block {
  id: string;
  start: string; // ISO date string
  end: string; // ISO date string
  reason?: string;
}

export interface Availability {
  services: string[]; // ['Consulta presencial', 'Consulta online']
  online: AvailabilitySlot;
  inPerson: AvailabilitySlot;
  blocks: Block[];
}

export interface PaymentMethods {
  onlineConsultationPrice: string;
  inPersonConsultationPrice: string;
  acceptedMethods: string[];
}

export interface FollowUpMessage {
  message: string;
  attachment?: string; // URL to PDF
}

export interface LeadFollowUpMessage {
  id?: string | number;
  title: string;
  hour: number;
  message: string;
}

export interface LeadFollowUpInfo {
  leadFollowUpMessages: LeadFollowUpMessage[];
}

export interface PatientFollowUpMessage {
  id?: string | number;
  date: string;
  message: string;
}

export interface PatientFollowUpInfo {
  enabled: boolean;
  daysAfter: number;
  periodicMessage: string;
  birthdayEnabled: boolean;
  birthdayMessage: string;
  commemorativeMessages: PatientFollowUpMessage[];
}

export interface ReminderInfo {
  autoReminder24h: {
    enabled: boolean;
    hoursBefore: number;
    message: string;
  };
  autoConfirmationDay: {
    enabled: boolean;
  };
}

export interface Settings {
  basicInfo: BasicInfo;
  clinicInfo: ClinicInfo;
  aiPreferences: AiPreferences;
  availability: Availability;
  paymentMethods: PaymentMethods;
  leadFollowUpInfo: LeadFollowUpInfo;
  patientFollowUpInfo: PatientFollowUpInfo;
  reminderInfo: ReminderInfo;
}

export const FORBIDDEN_TOPICS = [
  "Diagnóstico",
  "Exames",
  "Medicamentos",
  "Ajuste de doses",
  "Classificação de gravidade",
  "Comentários sobre laudos",
  "Questões emocionais sensíveis",
];

export const DEFAULT_AI_PREFERENCES: AiPreferences = {
  initialQuestion: "Olá! Como posso ajudar você hoje?",
  tone: "Acolhedor",
  empathyLevel: "Empatia moderada (recomendado)",
  forbiddenTopics: FORBIDDEN_TOPICS,
  clinicalResponse:
    "Entendo sua dúvida. Como sou uma assistente virtual, não posso realizar diagnósticos ou prescrever tratamentos. Recomendo agendar uma consulta para que possamos avaliar seu caso detalhadamente.",
};
