import { X, Send, Tag, Check } from "lucide-react";
import { useState } from "react";
import { Conversation, Message } from "@/lib/repositories/chat-repository";
import { ChatMessage } from "./ChatMessage";

interface ChatModalProps {
  chat: Conversation;
  messages: Message[];
  onClose: () => void;
}

const availableTags = [
  { label: "Urgente", color: "bg-red-500" },
  { label: "Agendamento", color: "bg-[#6eb5d8]" },
  { label: "Concluído", color: "bg-green-500" },
  { label: "Exames", color: "bg-yellow-500" },
  { label: "Confirmado", color: "bg-green-500" },
  { label: "Pendente", color: "bg-orange-500" },
  { label: "Cancelado", color: "bg-gray-500" },
];

export function ChatModal({ chat, messages, onClose }: ChatModalProps) {
  console.log("Chat: ", chat);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#6eb5d8] text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <img
                  src={chat.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-semibold">{chat.name}</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col-reverse">
          <div className="space-y-4 flex flex-col-reverse">
            {[...messages].map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
