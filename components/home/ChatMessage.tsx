import { Tag } from "lucide-react";
import { Message } from "@/lib/repositories/chat-repository";
import { format } from "date-fns";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  // Hide stickers completely
  if (message.type === "sticker" || message.type === "image") {
    return <></>;
  }

  return (
    <div
      className={`flex mt-4 ${
        message.fromMe ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          message.fromMe
            ? "bg-[#6eb5d8] text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none shadow-md"
        }`}
      >
        {/* {message.type === "image" ? (
          <div className="mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <img
              src={message.mediaUrl}
              alt="Image"
              className="rounded-lg max-w-full h-auto"
              onError={(e) => {
                // Fallback if image fails to load (e.g. auth required)
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div> */}
        {/* ) :  */}
        {message.type === "document" ? (
          <div className="flex items-center gap-2 mb-2 p-2 bg-black/10 rounded-lg">
            <div className="bg-white/20 p-2 rounded">
              <Tag className="w-6 h-6" />
            </div>
            <span className="text-sm underline break-all">
              {message.caption || "Document"}
            </span>
          </div>
        ) : message.type === "audio" ? (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm italic">Audio message</span>
            {/* Could add an audio player here if URL is accessible */}
          </div>
        ) : null}

        {message.body && (
          <p className="text-sm whitespace-pre-wrap">{message.body}</p>
        )}

        <p
          className={`text-xs mt-1 ${
            message.fromMe ? "text-white/70" : "text-gray-500"
          }`}
        >
          {format(new Date(message.timestamp * 1000), "dd/MM/yy: HH:mm")}
        </p>
      </div>
    </div>
  );
}
