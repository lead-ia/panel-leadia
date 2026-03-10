import { MessageCircle, Loader2, AlertCircle } from "lucide-react";
import { useContext } from "react";
import { ChatContext } from "@/components/chat/chat-context";

export function SimpleChatList({ searchQuery }: { searchQuery: string }) {
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
    <div className="flex flex-col">
      {conversationList.map((chat) => (
        <div
          key={chat.id}
          onClick={() => handleChatClick(chat)}
          className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-gray-100 last:border-0 ${
            selectedChat === chat.id
              ? "bg-gray-100"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          {/* Avatar */}
          <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {chat.avatar ? (
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#1e3a5f] font-medium text-lg">
                {chat.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Center info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="text-[16px] font-semibold text-[#1e3a5f] truncate">
              {chat.name}
            </h3>
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {chat.lastMessage || "\u00A0"}
            </p>
          </div>

          {/* Right side: Time & Unread Badge */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
            <span className="text-xs text-[#6eb5d8] font-medium">
              {chat.time}
            </span>
            {chat.unread > 0 ? (
              <div className="bg-[#25D366] text-white text-[11px] font-bold rounded-full w-[22px] h-[22px] flex items-center justify-center mt-0.5">
                {chat.unread}
              </div>
            ) : (
              <div className="w-[22px] h-[22px] mt-0.5"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
