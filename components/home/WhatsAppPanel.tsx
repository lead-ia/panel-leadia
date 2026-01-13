import { Search, Clock, Tag } from "lucide-react";
import { ChatList } from "./ChatList";
import { useState } from "react";
import { ChatModal } from "./ChatModal";

import { Conversation } from "@/lib/repositories/chat-repository";

export function WhatsAppPanel() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const handleChatClick = (chat: Conversation) => {
    setSelectedChat(chat.id);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0">
        <h2 className="text-[#1e3a5f] mb-4 font-normal">Conversas WhatsApp</h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eb5d8] focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 mb-4">
          <button className="px-4 py-2 bg-[#6eb5d8] text-white rounded-lg hover:bg-[#5aa5c8] transition-colors flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Todas
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pendentes
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ChatList
          onChatClick={handleChatClick}
          selectedChat={selectedChat || undefined}
        />
      </div>

      {selectedChat && (
        <ChatModal
          chatId={selectedChat}
          onClose={() => setSelectedChat(null)}
        />
      )}
    </div>
  );
}
