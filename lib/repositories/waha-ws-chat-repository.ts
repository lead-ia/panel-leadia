import axios from 'axios';
import { format } from 'date-fns';
import { Conversation, IChatRepository, Message, Contact } from './chat-repository';

export class WahaWsChatRepository implements IChatRepository {
  private sessionName: string;
  private apiUrl: string;
  private wsUrl: string;
  private socket: WebSocket | null = null;
  private messageListeners: ((message: any) => void)[] = [];

  constructor(
    sessionName: string, 
    apiUrl: string = 'https://api.leadia.com.br',
    wsUrl: string = 'wss://api.leadia.com.br/ws'
  ) {
    this.sessionName = sessionName;
    this.apiUrl = apiUrl;
    this.wsUrl = wsUrl;
    this.connect();
  }

  private connect() {
    if (typeof window === 'undefined') return; // Ensure we are in the browser

    const session = this.sessionName; // Using sessionName to match HTTP API usage
    const events = ['message'];
    const apiKey = process.env.NEXT_PUBLIC_WAHA_API_KEY || process.env.WAHA_API_KEY || '';

    const queryParams = new URLSearchParams({
      'x-api-key': apiKey,
      session,
      ...events.reduce((acc, event) => ({ ...acc, events: event }), {})
    });

    const fullWsUrl = `${this.wsUrl}?${queryParams.toString()}`;

    this.socket = new WebSocket(fullWsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established:', fullWsUrl);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notifyListeners(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      // Optional: Implement reconnection logic here
    };
  }

  public onNewMessage(callback: (message: any) => void) {
    this.messageListeners.push(callback);
  }

  public removeMessageListener(callback: (message: any) => void) {
    this.messageListeners = this.messageListeners.filter(listener => listener !== callback);
  }

  private notifyListeners(message: any) {
    this.messageListeners.forEach(listener => listener(message));
  }

  async getConversations(): Promise<Conversation[]> {
    try {
      const [chatsResponse, contacts] = await Promise.all([
        axios.get(
          `${this.apiUrl}/api/${this.sessionName}/chats/overview?limit=50`,
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
        `${this.apiUrl}/api/${sessionName}/chats/${chatId}/messages?limit=20&downloadMedia=true`,
        {
          headers: {
            'X-API-KEY': process.env.WAHA_API_KEY || process.env.NEXT_PUBLIC_WAHA_API_KEY,
          },
        }
      );

      console.log('Waha API Response:', JSON.stringify(response.data, null, 2));

      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }

      return response.data
        .map((msg: any) => this.parseMessage(msg))
        .filter((msg): msg is Message => msg !== null);
    } catch (error) {
      console.error('Error fetching messages from Waha API:', error);
      return [];
    }
  }

  private parseMessage(msg: any): Message | null {
    let type: Message['type'] = 'chat';
    let mediaUrl: string | undefined = undefined;
    let caption: string | undefined = undefined;
    let mimetype: string | undefined = undefined;
    let fileName: string | undefined = undefined;
    let fileLength: number | undefined = undefined;

    const rawData = msg._data || {};
    // Check for message types in the "Message" object as per user request
    const messageContent = rawData.Message || {};

    console.log('Incoming message content: ', messageContent);

    if (messageContent.documentMessage) {
      type = 'document';
      const docMsg = messageContent.documentMessage;
      mediaUrl = docMsg.URL;
      mimetype = docMsg.mimetype;
      fileName = docMsg.fileName;
      fileLength = docMsg.fileLength;
      // Caption might be present but usually document name is more important
      caption = docMsg.caption; 
    } else if (messageContent.imageMessage) {
      type = 'image';
      const imgMsg = messageContent.imageMessage;
      mediaUrl = imgMsg.URL;
      mimetype = imgMsg.mimetype;
      caption = imgMsg.caption;
    } else if (messageContent.stickerMessage) {
      // Ignore stickers as per requirement
      return null;
    } else if (messageContent.audioMessage) {
      // Ignore audio as per requirement
      return null;
    } else if (messageContent.videoMessage) {
       return null
    } else if (messageContent.conversation) {
       type = 'chat';
       // Standard text message
    } else {
       return null
    }

    // Ensure we have a body for text messages
    const body = msg.body || caption || fileName || '';

    return {
      id: msg.id,
      body,
      from: msg.from,
      to: msg.to,
      timestamp: msg.timestamp,
      hasMedia: msg.hasMedia || !!mediaUrl,
      ack: msg.ack,
      fromMe: msg.fromMe,
      type,
      mediaUrl,
      caption,
      mimetype,
      fileName,
      fileLength
    };
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
}
