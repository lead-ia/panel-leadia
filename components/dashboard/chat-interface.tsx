"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "../auth/auth-context"

interface Message {
  id: string
  sender: "leadIa" | string
  text: string
  timestamp: string
}


export function ChatInterfaceTab() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "x-app-secret": process.env.WEBFLOW_SECRET_KEY || "bd06c285046f40d8bbc59cf21c16cc31",
      }


      const response = await fetch("https://workflow.leadia.com.br/webhook/message", {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: userMessage.text,
          uid: user!.uid,
          sessionId: sessionId,
        }),
      })

      if (!response.ok) throw new Error("HTTP error")

      
      const responsejson = await response.json()

      const replyText = responsejson.reply

      if (!sessionId) {
        setSessionId(responsejson.sessionId)
      }

      const botMessage: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: replyText || "Sem resposta.",
        timestamp: new Date().toLocaleTimeString(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Chat error:", error)

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "bot",
          text: "Erro ao conectar com o servidor.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <h2 className="text-lg font-semibold mb-6">LeadIA Chat Bot </h2>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            {msg.sender === "bot" && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            )}

            <div
              className={`max-w-xs px-4 py-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p
                className={`text-xs mt-2 ${
                  msg.sender === "user"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {msg.timestamp}
              </p>
            </div>

            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-secondary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-muted">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-background border border-input rounded-full focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  )
}
