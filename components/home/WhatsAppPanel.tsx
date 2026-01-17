import { Search, Clock, Tag } from "lucide-react";
import { ChatList } from "./ChatList";
import { ChatModal } from "./ChatModal";
import { useChat } from "@/hooks/use-chat";
import { ChatContext } from "@/components/chat/chat-context";
import { useState } from "react";

export function WhatsAppPanel() {
  const chatState = useChat({
    useWebsockets: true,
    // TODO: this will come from the settings model probably
    sessionName: "zeca_test",
  });
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ChatContext.Provider value={chatState}>
      <div className="flex flex-col h-full overflow-hidden px-4">
        <div className="flex-shrink-0">
          <h2 className="text-[#1e3a5f] mb-4 font-normal">
            Conversas WhatsApp
          </h2>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar paciente..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eb5d8] focus:border-transparent"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ChatList searchQuery={searchQuery} />
        </div>

        {chatState.selectedChat && (
          <ChatModal
            chat={
              chatState.conversations.find(
                (c) => c.id === chatState.selectedChat,
              )!
            }
            messages={chatState.messages}
            onClose={() => chatState.handleChatClick(null)}
          />
        )}
      </div>
    </ChatContext.Provider>
  );
}
