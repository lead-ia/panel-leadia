export interface BasicInfo {
  fullName: string;
  displayName: string;
  specialty: string;
  subspecialty?: string;
  crm: string;
  uf: string;
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

export interface Availability {
  services: string[]; // ['Consulta presencial', 'Consulta online']
  online: AvailabilitySlot;
  inPerson: AvailabilitySlot;
  // blocks: Block[]; // Not fully defined in UI yet, skipping for now
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
  periodicMessage: string;
  commemorativeMessages: PatientFollowUpMessage[];
}

export interface ReminderInfo {
  autoReminder24h: {
    enabled: boolean;
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
