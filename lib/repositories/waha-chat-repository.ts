import axios from 'axios';
import { format } from 'date-fns';
import { Conversation, IChatRepository, Message, Contact } from './chat-repository';

export class WahaChatRepository implements IChatRepository {
  private sessionName: string;
  private apiUrl: string;

  constructor(sessionName: string, apiUrl: string = 'https://api.leadia.com.br') {
    this.sessionName = sessionName;
    this.apiUrl = apiUrl;
  }

  async getConversations(): Promise<Conversation[]> {
    try {
      const [chatsResponse, contacts] = await Promise.all([
        axios.get(
          `${this.apiUrl}/api/${this.sessionName}/chats/overview?limit=20&offset=0`,
          {
            headers: {
              'X-API-KEY': process.env.WAHA_API_KEY || process.env.NEXT_PUBLIC_WAHA_API_KEY,
            },
          }
        ),
        this.getAllContacts(this.sessionName)
      ]);

      console.log('Waha API Response:', JSON.stringify(chatsResponse.data, null, 2));

      if (!chatsResponse.data || !Array.isArray(chatsResponse.data)) {
        console.warn('Invalid response format from Waha API, returning mock data.');
        return this.getMockData();
      }

      const conversations = await Promise.all(chatsResponse.data.map(async (chat: any) => {
        let time = '';
        if (chat.lastMessage && chat.lastMessage.timestamp) {
            try {
                // Waha timestamp is usually in seconds, date-fns expects milliseconds
                time = format(new Date(chat.lastMessage.timestamp * 1000), 'HH:mm');
            } catch (e) {
                console.error('Error formatting date', e);
                time = '';
            }
        }

        let name = chat.name || chat.id.split('@')[0];
        let phoneNumber = chat.id.split('@')[0];

        if (chat.id.endsWith('@lid')) {
          const pn = await this.getPhoneNumberByLid(this.sessionName, chat.id);
          if (pn) {
            phoneNumber = pn.split('@')[0];
          }
        }

        const contact = contacts.find(c => c.id.includes(phoneNumber));
        if (contact) {
          name = contact.pushname || contact.name || name;
        }

        return {
          id: chat.id,
          name: name,
          lastMessage: chat.lastMessage ? chat.lastMessage.body : '',
          time: time,
          unread: chat.unreadCount || 0, // Assuming unreadCount might be available, otherwise 0
          tag: '', // Waha doesn't seem to have tags in the overview by default
          avatar: chat.picture || '',
        };
      }));

      return conversations;
    } catch (error) {
      console.error('Error fetching chats from Waha API:', error);
      return this.getMockData();
    }
  }

  async getChatMessages(sessionName: string, chatId: string): Promise<Message[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/${sessionName}/chats/${chatId}/messages?limit=50&downloadMedia=false`,
        {
          headers: {
            'X-API-KEY': process.env.WAHA_API_KEY || process.env.NEXT_PUBLIC_WAHA_API_KEY,
          },
        }
      );

      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }

      return response.data.map((msg: any) => {
        let type: Message['type'] = 'chat';
        let mediaUrl: string | undefined = undefined;
        let caption: string | undefined = undefined;
        let mimetype: string | undefined = undefined;

        const rawData = msg._data || {};
        const mediaType = rawData.MediaType || rawData.Type;

        if (msg.hasMedia || mediaType === 'image' || mediaType === 'video' || mediaType === 'document' || mediaType === 'sticker' || mediaType === 'user_created_sticker' || mediaType === 'ptt' || mediaType === 'audio') {
          if (mediaType === 'image') {
            type = 'image';
            const imageMsg = rawData.Message?.imageMessage;
            if (imageMsg) {
              mediaUrl = imageMsg.URL;
              caption = imageMsg.caption;
              mimetype = imageMsg.mimetype;
            }
          } else if (mediaType === 'sticker' || mediaType === 'user_created_sticker') {
            type = 'sticker';
            const stickerMsg = rawData.Message?.stickerMessage;
            if (stickerMsg) {
              mediaUrl = stickerMsg.URL;
              mimetype = stickerMsg.mimetype;
            }
          } else if (mediaType === 'video') {
            type = 'video';
            const videoMsg = rawData.Message?.videoMessage;
            if (videoMsg) {
              mediaUrl = videoMsg.URL;
              caption = videoMsg.caption;
              mimetype = videoMsg.mimetype;
            }
          } else if (mediaType === 'document') {
            type = 'document';
            const docMsg = rawData.Message?.documentMessage;
            if (docMsg) {
              mediaUrl = docMsg.URL;
              caption = docMsg.caption || docMsg.title || docMsg.fileName;
              mimetype = docMsg.mimetype;
            }
          } else if (mediaType === 'ptt' || mediaType === 'audio') {
            type = 'audio';
            const audioMsg = rawData.Message?.audioMessage;
            if (audioMsg) {
              mediaUrl = audioMsg.URL;
              mimetype = audioMsg.mimetype;
            }
          } else {
            type = 'unknown';
          }
        }

        return {
          id: msg.id,
          body: msg.body || caption || '',
          from: msg.from,
          to: msg.to,
          timestamp: msg.timestamp,
          hasMedia: msg.hasMedia,
          ack: msg.ack,
          fromMe: msg.fromMe,
          type,
          mediaUrl,
          caption,
          mimetype
        };
      });
    } catch (error) {
      console.error('Error fetching messages from Waha API:', error);
      return [];
    }
  }

  async getAllContacts(sessionName: string): Promise<Contact[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/contacts/all?session=${sessionName}`,
        {
          headers: {
            'X-API-KEY': process.env.WAHA_API_KEY || process.env.NEXT_PUBLIC_WAHA_API_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts from Waha API:', error);
      return [];
    }
  }

  async getPhoneNumberByLid(sessionName: string, lid: string): Promise<string | null> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/${sessionName}/lids/${lid}`,
        {
          headers: {
            'X-API-KEY': process.env.WAHA_API_KEY || process.env.NEXT_PUBLIC_WAHA_API_KEY,
          },
        }
      );
      return response.data?.pn || null;
    } catch (error) {
      console.error(`Error fetching phone number for LID ${lid}:`, error);
      return null;
    }
  }

  async getSessionByName(sessionName: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/sessions/${sessionName}`,
        {
          headers: {
            'X-API-KEY': process.env.WAHA_API_KEY || process.env.NEXT_PUBLIC_WAHA_API_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching session ${sessionName}:`, error);
      return null;
    }
  }

async createSession(sessionName: string): Promise<void> {
    try {
      await axios.post(
        `${this.apiUrl}/api/sessions`,
        { name: sessionName, start: true },
        {
          headers: {
            'X-API-KEY': process.env.WAHA_API_KEY || process.env.NEXT_PUBLIC_WAHA_API_KEY,
          },
        }
      );
    } catch (error) {
      console.error(`Error starting session ${sessionName}:`, error);
      throw error;
    }
  }

  async startSession(sessionName: string): Promise<void> {
    try {
      await axios.post(
        `${this.apiUrl}/api/sessions/${sessionName}/start`,
        { name: sessionName },
        {
          headers: {
            'X-API-KEY': process.env.WAHA_API_KEY || process.env.NEXT_PUBLIC_WAHA_API_KEY,
          },
        }
      );
    } catch (error) {
      console.error(`Error starting session ${sessionName}:`, error);
      throw error;
    }
  }

async restartSession(sessionName: string): Promise<void> {
    try {
      await axios.post(
        `${this.apiUrl}/api/sessions/${sessionName}/restart`,
        { name: sessionName },
        {
          headers: {
            'X-API-KEY': process.env.WAHA_API_KEY || process.env.NEXT_PUBLIC_WAHA_API_KEY,
          },
        }
      );
    } catch (error) {
      console.error(`Error starting session ${sessionName}:`, error);
      throw error;
    }
  }

async stopSession(sessionName: string): Promise<void> {
    try {
      await axios.post(
        `${this.apiUrl}/api/sessions/${sessionName}/stop`,
        { name: sessionName },
        {
          headers: {
            'X-API-KEY': process.env.WAHA_API_KEY || process.env.NEXT_PUBLIC_WAHA_API_KEY,
          },
        }
      );
    } catch (error) {
      console.error(`Error starting session ${sessionName}:`, error);
      throw error;
    }
  }

  async getQrCode(sessionName: string): Promise<Blob | null> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/${sessionName}/auth/qr?format=image`,
        {
          responseType: 'blob',
          headers: {
            'X-API-KEY': process.env.WAHA_API_KEY || process.env.NEXT_PUBLIC_WAHA_API_KEY,
            Accept: 'image/png',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching QR code for session ${sessionName}:`, error);
      return null;
    }
  }

  private getMockData(): Conversation[] {
    return [
      {
        id: '1',
        name: 'Maria Silva',
        lastMessage: 'Gostaria de remarcar minha consulta',
        time: '10:30',
        unread: 2,
        tag: 'Urgente',
        avatar: 'MS',
      },
      {
        id: '2',
        name: 'João Santos',
        lastMessage: 'Obrigado pelo atendimento!',
        time: '09:45',
        unread: 0,
        tag: 'Concluído',
        avatar: 'JS',
      },
      {
        id: '3',
        name: 'Ana Oliveira',
        lastMessage: 'Qual o horário disponível?',
        time: '08:20',
        unread: 1,
        tag: 'Agendamento',
        avatar: 'AO',
      },
      {
        id: '4',
        name: 'Carlos Mendes',
        lastMessage: 'Preciso dos resultados do exame',
        time: 'Ontem',
        unread: 3,
        tag: 'Exames',
        avatar: 'CM',
      },
      {
        id: '5',
        name: 'Beatriz Costa',
        lastMessage: 'Confirmado para amanhã',
        time: 'Ontem',
        unread: 0,
        tag: 'Confirmado',
        avatar: 'BC',
      },
    ];
  }
  onNewMessage(callback: (message: any) => void): void {
    // No-op for HTTP-based repository
  }

  removeMessageListener(callback: (message: any) => void): void {
    // No-op for HTTP-based repository
  }
}
