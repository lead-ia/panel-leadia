export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  tag: string;
  avatar: string;
}

export interface Message {
  id: string;
  body: string;
  from: string;
  to: string;
  timestamp: number;
  hasMedia: boolean;
  ack: number; // 0: pending, 1: sent, 2: delivered, 3: read, 4: played
  fromMe: boolean;
  type:
    | "chat"
    | "image"
    | "sticker"
    | "document"
    | "video"
    | "audio"
    | "unknown";
  mediaUrl?: string;
  caption?: string;
  mimetype?: string;
  fileName?: string;
  fileLength?: number;
}

export interface Contact {
  id: string;
  name: string;
  pushname: string;
}

export interface IChatRepository {
  getConversations(): Promise<Conversation[]>;
  getChatMessages(
    sessionName: string,
    chatId: string,
    limit?: number,
  ): Promise<Message[]>;
  getAllContacts(sessionName: string): Promise<Contact[]>;
  getPhoneNumberByLid(sessionName: string, lid: string): Promise<string | null>;
  onNewMessage(callback: (message: any) => void): void;
  removeMessageListener(callback: (message: any) => void): void;
}

export class ChatRepository implements IChatRepository {
  async getConversations(): Promise<Conversation[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: "1",
        name: "Maria Silva",
        lastMessage: "Gostaria de remarcar minha consulta",
        time: "04/03/26: 10:30",
        unread: 2,
        tag: "Urgente",
        avatar: "MS",
      },
      {
        id: "2",
        name: "João Santos",
        lastMessage: "Obrigado pelo atendimento!",
        time: "04/03/26: 09:45",
        unread: 0,
        tag: "Concluído",
        avatar: "JS",
      },
      {
        id: "3",
        name: "Ana Oliveira",
        lastMessage: "Qual o horário disponível?",
        time: "04/03/26: 08:20",
        unread: 1,
        tag: "Agendamento",
        avatar: "AO",
      },
      {
        id: "4",
        name: "Carlos Mendes",
        lastMessage: "Preciso dos resultados do exame",
        time: "03/03/26: 15:00",
        unread: 3,
        tag: "Exames",
        avatar: "CM",
      },
      {
        id: "5",
        name: "Beatriz Costa",
        lastMessage: "Confirmado para amanhã",
        time: "03/03/26: 14:30",
        unread: 0,
        tag: "Confirmado",
        avatar: "BC",
      },
      {
        id: "6",
        name: "Pedro Alves",
        lastMessage: "Preciso agendar uma consulta",
        time: "03/03/26: 11:20",
        unread: 1,
        tag: "Agendamento",
        avatar: "PA",
      },
      {
        id: "7",
        name: "Lucia Martins",
        lastMessage: "Pode me enviar o comprovante?",
        time: "02/03/26: 16:45",
        unread: 0,
        tag: "Confirmado",
        avatar: "LM",
      },
      {
        id: "8",
        name: "Roberto Silva",
        lastMessage: "Esqueci minha carteira de convênio",
        time: "02/03/26: 10:15",
        unread: 2,
        tag: "Urgente",
        avatar: "RS",
      },
      {
        id: "9",
        name: "Fernanda Costa",
        lastMessage: "Estava sentindo dores ontem",
        time: "02/03/26: 09:30",
        unread: 1,
        tag: "Urgente",
        avatar: "FC",
      },
    ];
  }

  async getChatMessages(
    sessionName: string,
    chatId: string,
    limit?: number,
  ): Promise<Message[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      {
        id: "1",
        body: "Olá, tudo bem?",
        from: "123456789",
        to: "me",
        timestamp: Date.now() / 1000 - 3600,
        hasMedia: false,
        ack: 3,
        fromMe: false,
        type: "chat",
      },
      {
        id: "2",
        body: "Tudo ótimo! E com você?",
        from: "me",
        to: "123456789",
        timestamp: Date.now() / 1000 - 3500,
        hasMedia: false,
        ack: 2,
        fromMe: true,
        type: "chat",
      },
    ];
  }

  async getAllContacts(sessionName: string): Promise<Contact[]> {
    return [];
  }

  async getPhoneNumberByLid(
    sessionName: string,
    lid: string,
  ): Promise<string | null> {
    return null;
  }

  onNewMessage(callback: (message: any) => void): void {
    // No-op for mock repository
  }

  removeMessageListener(callback: (message: any) => void): void {
    // No-op for mock repository
  }
}
