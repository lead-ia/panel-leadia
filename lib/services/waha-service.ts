import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { format } from 'date-fns';
import { Conversation, Message, Contact } from '@/lib/repositories/chat-repository';
import { WhatsappSession } from '../models/whatsapp-session';

export class WahaService {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string = 'https://api.leadia.com.br') {
    this.apiUrl = apiUrl;
    this.apiKey = process.env.WAHA_API_KEY || process.env.NEXT_PUBLIC_WAHA_API_KEY || '';
  }

  private async request<T>(method: string, url: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios({
        method,
        url: `${this.apiUrl}${url}`,
        headers: {
          'X-API-KEY': this.apiKey,
          ...config.headers,
        },
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error(`Error in WahaService request to ${url}:`, error);
      throw error;
    }
  }

  async createSession(sessionName: string): Promise<void> {
      return this.request('POST', `/api/sessions`, {
        data: {
          name: sessionName,
        },
      });
    
  }

  async getCurrentSession(sessionName: string): Promise<WhatsappSession> {
    return this.request('GET', `/api/sessions/${sessionName}`);
  }

  async getQRCode(sessionName: string): Promise<Blob> {
    return this.request('GET', `/api/${sessionName}/auth/qr?format=image`, {
        headers: {
            accept: 'image/png'
        }
    });
  }

  async getConversations(sessionName: string): Promise<Conversation[]> {
    try {
      const [chats, contacts] = await Promise.all([
        this.request<any[]>('GET', `/api/${sessionName}/chats/overview?limit=50`),
        this.getAllContacts(sessionName)
      ]);

      if (!chats || !Array.isArray(chats)) {
        console.warn('Invalid response format from Waha API, returning empty array.');
        return [];
      }

      const conversations = await Promise.all(chats.map(async (chat: any) => {
        let time = '';
        if (chat.lastMessage && chat.lastMessage.timestamp) {
            try {
                time = format(new Date(chat.lastMessage.timestamp * 1000), 'HH:mm');
            } catch (e) {
                console.error('Error formatting date', e);
                time = '';
            }
        }

        let name = chat.name || chat.id.split('@')[0];
        let phoneNumber = chat.id.split('@')[0];

        if (chat.id.endsWith('@lid')) {
          const pn = await this.getPhoneNumberByLid(sessionName, chat.id);
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
          unread: chat.unreadCount || 0,
          tag: '',
          avatar: chat.picture || '',
        };
      }));

      return conversations;
    } catch (error) {
      console.error('Error fetching chats from Waha API:', error);
      return [];
    }
  }

  async getChatMessages(sessionName: string, chatId: string): Promise<Message[]> {
    try {
      const messages = await this.request<any[]>('GET', `/api/${sessionName}/chats/${chatId}/messages?limit=20&downloadMedia=true`);

      if (!messages || !Array.isArray(messages)) {
        return [];
      }

      return messages
        .map((msg: any) => this.parseMessage(msg))
        .filter((msg): msg is Message => msg !== null);
    } catch (error) {
      console.error('Error fetching messages from Waha API:', error);
      return [];
    }
  }

  async getAllContacts(sessionName: string): Promise<Contact[]> {
    try {
      return await this.request<Contact[]>('GET', `/api/contacts/all?session=${sessionName}`);
    } catch (error) {
      console.error('Error fetching contacts from Waha API:', error);
      return [];
    }
  }

  async getPhoneNumberByLid(sessionName: string, lid: string): Promise<string | null> {
    try {
      const data = await this.request<{ pn: string }>('GET', `/api/${sessionName}/lids/${lid}`);
      return data?.pn || null;
    } catch (error) {
      console.error(`Error fetching phone number for LID ${lid}:`, error);
      return null;
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
    const messageContent = rawData.Message || {};

    if (messageContent.documentMessage) {
      type = 'document';
      const docMsg = messageContent.documentMessage;
      mediaUrl = docMsg.URL;
      mimetype = docMsg.mimetype;
      fileName = docMsg.fileName;
      fileLength = docMsg.fileLength;
      caption = docMsg.caption; 
    } else if (messageContent.imageMessage) {
      type = 'image';
      const imgMsg = messageContent.imageMessage;
      mediaUrl = imgMsg.URL;
      mimetype = imgMsg.mimetype;
      caption = imgMsg.caption;
    } else if (messageContent.stickerMessage) {
      return null;
    } else if (messageContent.audioMessage) {
      return null;
    } else if (messageContent.videoMessage) {
       return null
    } else if (messageContent.conversation) {
       type = 'chat';
    } else {
       // Fallback for simple text messages that might not have the Message structure
       if (!msg.hasMedia && msg.body) {
           type = 'chat';
       } else {
           return null;
       }
    }

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
}
