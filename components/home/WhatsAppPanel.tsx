import { Search } from "lucide-react";
import { ChatList } from "./ChatList";
import { ChatModal } from "./ChatModal";
import { useChat } from "@/hooks/use-chat";
import { ChatContext } from "@/components/chat/chat-context";
import { useState } from "react";
import { useUser } from "../auth/user-context";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useWhatsappSession } from "@/hooks/use-whatsapp-session";

export function WhatsAppPanel() {
  const router = useRouter();
  const { dbUser } = useUser();
  const { sessionStatus } = useWhatsappSession(dbUser?.phoneNumber ?? "");
  const chatState = useChat({
    useWebsockets: true,
    sessionName: dbUser?.phoneNumber ?? "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  if (!dbUser?.phoneNumber) {
    return (
      <div className="flex flex-col h-full justify-center items-center p-6 gap-y-4">
        <h1 className="text-slate-600">
          Whatsapp não está conectado. Faça sua integração em{" "}
        </h1>
        <Button
          onClick={() => {
            router.push("/dashboard-main/settings?section=canais");
          }}
        >
          Configurações
        </Button>
      </div>
    );
  }

  if (sessionStatus != "WORKING") {
    return (
      <div className="flex flex-col h-full justify-center items-center p-6 gap-y-4">
        <h1 className="text-slate-600">
          Sua sessão do whatsapp está parada. Cheque sua conexão do whatsapp
          em{" "}
        </h1>
        <Button
          onClick={() => {
            router.push("/dashboard-main/settings?section=canais");
          }}
        >
          Configurações
        </Button>
      </div>
    );
  }

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
