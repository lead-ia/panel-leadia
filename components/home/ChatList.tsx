import { MessageCircle, Loader2, AlertCircle } from "lucide-react";
import { useContext } from "react";
import { ChatContext } from "@/components/chat/chat-context";

export function ChatList({ searchQuery }: { searchQuery: string }) {
  const context = useContext(ChatContext);

  if (!context) {
    return <div>Error: ChatContext not found</div>;
  }

  const { conversations, loading, error, selectedChat, handleChatClick } =
    context;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Carregando conversas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
        <span>Nenhuma conversa encontrada</span>
      </div>
    );
  }

  const conversationList = searchQuery
    ? conversations.filter((chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : conversations;

  return (
    <div className="space-y-2">
      {conversationList.map((chat) => (
        <div
          key={chat.id}
          onClick={() => handleChatClick(chat)}
          className={`p-3 rounded-xl cursor-pointer transition-all border ${
            selectedChat === chat.id
              ? "bg-[#4a90e2] text-white shadow-lg border-[#4a90e2]"
              : "bg-gradient-to-r from-blue-50 to-white hover:shadow-md text-gray-700 border-gray-200"
          }`}
        >
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
                {chat.avatar ? (
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white">{chat.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1">
                <h3
                  className={`text-sm ${
                    selectedChat === chat.id ? "text-white" : "text-[#1e3a5f]"
                  }`}
                >
                  {chat.name}
                </h3>
                <p
                  className={`text-xs line-clamp-2 ${
                    selectedChat === chat.id ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {chat.lastMessage}
                </p>
              </div>
            </div>
            <span
              className={`text-xs ${
                selectedChat === chat.id ? "text-blue-100" : "text-gray-400"
              }`}
            >
              {chat.time}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                chat.tag === "Urgente"
                  ? "bg-red-100 text-red-600"
                  : chat.tag === "Agendamento"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
              }`}
            >
              {chat.tag}
            </span>
            {chat.unread > 0 && (
              <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chat.unread}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
