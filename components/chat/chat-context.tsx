import { createContext } from "react";
import { Conversation, Message } from "@/lib/repositories/chat-repository";

export interface ChatContextType {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  selectedChat: number | string | null;
  messages: Message[];
  messagesLoading: boolean;
  messagesError: string | null;
  handleChatClick: (chat: Conversation) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);
