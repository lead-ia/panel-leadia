import { useState, useEffect } from 'react';
import { ChatRepository, Conversation } from '@/lib/repositories/chat-repository';

interface UseChatState {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
}

export function useChat() {
  const [state, setState] = useState<UseChatState>({
    conversations: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const repository = new ChatRepository();
        const data = await repository.getConversations();
        setState({
          conversations: data,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState({
          conversations: [],
          loading: false,
          error: 'Failed to fetch conversations',
        });
      }
    };

    fetchConversations();
  }, []);

  return state;
}
