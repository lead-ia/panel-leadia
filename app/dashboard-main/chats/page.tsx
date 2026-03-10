"use client";

import { Search, Cloud } from "lucide-react";
import { SimpleChatList } from "@/components/home/SimpleChatList";
import { useChat } from "@/hooks/use-chat";
import { ChatContext } from "@/components/chat/chat-context";
import { useState } from "react";
import { useUser } from "@/components/auth/user-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useWhatsappSession } from "@/hooks/use-whatsapp-session";
import { ChatMessage } from "@/components/home/ChatMessage";

export default function ChatsPage() {
  const router = useRouter();
  const { dbUser } = useUser();
  const { sessionStatus } = useWhatsappSession(dbUser?.phoneNumber ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [messagesLimit, setMessagesLimit] = useState(20);

  const chatState = useChat({
    useWebsockets: true,
    sessionName: dbUser?.phoneNumber ?? "",
    messagesLimit,
  });

  if (!dbUser?.phoneNumber) {
    return (
      <div className="flex flex-col h-full items-center pt-[20vh] p-6 gap-y-4">
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

  if (sessionStatus !== "WORKING") {
    return (
      <div className="flex flex-col h-full items-center pt-[20vh] p-6 gap-y-4">
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

  const selectedConversation = chatState.selectedChat
    ? chatState.conversations.find((c) => c.id === chatState.selectedChat)
    : null;

  return (
    <ChatContext.Provider value={chatState}>
      <div className="flex flex-1 h-full min-h-0 bg-transparent p-4 gap-4 max-h-full">
        {/* Left pane: Chat List */}
        <div className="w-[400px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-[#1e3a5f] mb-4 font-normal">Conversas</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar ou começar uma nova conversa"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6eb5d8] focus:border-transparent text-sm"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
            <SimpleChatList searchQuery={searchQuery} />
          </div>
        </div>

        {/* Right pane: Chat View */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          {!selectedConversation ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5]">
              <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <Cloud className="w-32 h-32 text-gray-300 fill-current ml-2" />
              </div>
              <p className="text-gray-500 font-medium text-lg">
                Selecione uma conversa para começar a enviar mensagens
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="bg-[#f0f2f5] px-6 py-4 flex items-center gap-4 border-b border-gray-200 shadow-sm z-10">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-[#1e3a5f] font-medium text-lg overflow-hidden flex-shrink-0">
                  {selectedConversation.avatar ? (
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {selectedConversation.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-[#1e3a5f] font-semibold">
                    {selectedConversation.name}
                  </h3>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#efeae2] flex flex-col-reverse">
                <div className="space-y-4 flex flex-col-reverse">
                  {[...chatState.messages].map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </div>
                {chatState.messages.length > 0 &&
                  chatState.messages.length >= messagesLimit && (
                    <div className="flex justify-center py-4 text-center">
                      <Button
                        variant="outline"
                        onClick={() => setMessagesLimit((prev) => prev + 20)}
                        disabled={chatState.messagesLoading}
                        className="bg-white/80"
                      >
                        {chatState.messagesLoading
                          ? "Carregando..."
                          : "Carregar mensagens anteriores"}
                      </Button>
                    </div>
                  )}
              </div>

              {/* Chat Footer */}
              <div className="bg-[#f0f2f5] p-5 border-t border-gray-200">
                <div className="text-center text-gray-500 text-sm">
                  Modo visualização - Apenas leitura
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ChatContext.Provider>
  );
}
