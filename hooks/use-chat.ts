import { useState, useEffect } from 'react';
import { ChatRepository, Conversation, IChatRepository } from '@/lib/repositories/chat-repository';



export function useChat(options?: { useWebsockets?: boolean; sessionName: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  const [repository, setRepository] = useState<IChatRepository | null>(null);

  useEffect(() => {
    if (!options?.sessionName) {
      return
    }

    let repo: IChatRepository;

      const { WahaWsChatRepository } = require('@/lib/repositories/waha-ws-chat-repository');
      repo = new WahaWsChatRepository(options.sessionName);
    
    setRepository(repo);

    const fetchConversations = async () => {
      try {
        const data = await repo.getConversations();
        setConversations(data);
        setLoading(false);
      } catch (err) {
        setConversations([]);
        setLoading(false);
        setError('Failed to fetch conversations');
      }
    };

    fetchConversations();

    const handleNewMessage = (message: any) => {
      fetchConversations();
    };

    repo.onNewMessage(handleNewMessage);

    return () => {
      repo.removeMessageListener(handleNewMessage);
    };
  }, [options?.useWebsockets, options?.sessionName]);

  useEffect(() => {
    if (!selectedChat || !repository || !options?.sessionName) return;

    const fetchMessages = async () => {
      setMessagesLoading(true);
      setMessagesError(null);
      try {
        const msgs = await repository.getChatMessages(options.sessionName, selectedChat.toString());
        setMessages(msgs);
      } catch (err) {
        setMessagesError('Failed to load messages');
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChat, repository, options?.sessionName]);

  const handleChatClick = (chat: Conversation | null) => {
    if (chat == null) {
      setMessages([]);
    }
    setSelectedChat(chat?.id || null);
  };

  return {
    conversations,
    loading,
    error,
    selectedChat,
    messages,
    messagesLoading,
    messagesError,
    handleChatClick
  };
}
