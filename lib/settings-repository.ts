import { Settings } from "@/types/settings";

export interface ISettingsRepository {
  readSettings(): Promise<Settings>;
  upsertSettings(settings: Settings): Promise<void>;
}

const MOCK_SETTINGS: Settings = {
  basicInfo: {
    fullName: "Carolina Santos Silva",
    displayName: "Dra. Carolina",
    specialty: "Cardiologia",
    subspecialty: "Arritmia Cardíaca",
    crm: "123456",
    uf: "SP",
    bio: "Cardiologista com 15 anos de experiência, especializada em arritmias...",
    country: "BR",
  },
  clinicInfo: {
    clinicName: "Clínica CardioVida",
    address: "Rua das Flores, 123 - Centro, São Paulo - SP",
    onlineConsultationLink: "https://meet.google.com/seu-link",
  },
  aiPreferences: {
    initialQuestion: "Poderia me contar o motivo da consulta?",
    tone: "Acolhedor",
    empathyLevel: "Empatia moderada (recomendado)",
    forbiddenTopics: [
      "Diagnóstico",
      "Exames",
      "Medicamentos",
      "Ajuste de doses",
      "Classificação de gravidade",
      "Comentários sobre laudos",
      "Questões emocionais sensíveis",
    ],
    clinicalResponse:
      "Sobre esse tipo de orientação, somente o médico pode te ajudar com segurança. Vamos agendar sua consulta?",
  },
  availability: {
    services: ["Consulta presencial", "Consulta online"],
    online: {
      days: ["Seg", "Ter", "Qua", "Qui", "Sex"],
      startTime: "08:00",
      endTime: "18:00",
      interval: "45 minutos",
      duration: "45 minutos",
      futureSchedulingDays: 30,
    },
    inPerson: {
      days: ["Seg", "Ter", "Qua", "Qui", "Sex"],
      startTime: "08:00",
      endTime: "18:00",
      interval: "60 minutos",
      duration: "60 minutos",
      futureSchedulingDays: 30,
    },
    blocks: [],
  },
  paymentMethods: {
    onlineConsultationPrice: "R$ 300,00",
    inPersonConsultationPrice: "R$ 400,00",
    acceptedMethods: ["PIX", "Cartão de crédito"],
  },
  leadFollowUpInfo: {
    leadFollowUpMessages: [
      {
        title: "Boas-vindas inicial",
        hour: 0,
        message:
          "Olá! Vi que você tem interesse em cuidar da sua saúde. Vamos focar no seu bem-estar e finalizar nosso agendamento? 💙",
      },
      {
        title: "Primeiro follow-up",
        hour: 24,
        message:
          "Oi! Ainda estou aqui para te ajudar a agendar sua consulta. Vamos confirmar um horário que seja bom para você?",
      },
    ],
  },
  patientFollowUpInfo: {
    enabled: false,
    daysAfter: 30,
    periodicMessage:
      "Olá [NOME]! Faz tempo que não nos vemos. Que tal agendar uma consulta de acompanhamento?",
    birthdayEnabled: true,
    birthdayMessage: "Parabéns pelo seu aniversário! 🎉",
    commemorativeMessages: [
      {
        id: 1,
        date: "01/01",
        message:
          "Feliz Ano Novo! Desejamos um ano cheio de saúde e bem-estar! 🎉",
      },
      {
        id: 2,
        date: "25/12",
        message: "Feliz Natal! Que esta data seja repleta de paz e alegria! 🎄",
      },
    ],
  },
  preConsultationInfo: {
    basicGuidance: {
      message:
        "Sua consulta está confirmada! Lembre-se de chegar com 10 minutos de antecedência.",
    },
    preConsultationGuidance: {
      message:
        "Olá! Para a sua consulta de amanhã, por favor traga seus exames anteriores e documentos.",
    },
  },
  reminderInfo: {
    autoReminder24h: {
      enabled: true,
      hoursBefore: 24,
      message:
        "Olá! Esta é uma lembrança da sua consulta marcada para amanhã às [HORÁRIO] com [MÉDICO]. Confirma sua presença?",
    },
    autoConfirmationDay: {
      enabled: true,
    },
  },
};

export class SettingsRepository implements ISettingsRepository {
  async readSettings(): Promise<Settings> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return MOCK_SETTINGS;
  }

  async upsertSettings(settings: Settings): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Upserting settings:", settings);
    return Promise.resolve();
  }
}
