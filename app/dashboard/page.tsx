"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { ChatInterface } from "@/components/dashboard/chat-interface"
import { IntegrationsTab } from "@/components/dashboard/integrations-tab"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "integrations">("chat")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("chat")}
            className={`pb-4 font-medium transition-colors ${
              activeTab === "chat"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Integrações
          </button>
          <button
            onClick={() => setActiveTab("integrations")}
            className={`pb-4 font-medium transition-colors ${
              activeTab === "integrations"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Chat Bot
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "chat" && <IntegrationsTab />}
        {activeTab === "integrations" && <ChatInterface />}
      </div>
    </div>
  )
}
