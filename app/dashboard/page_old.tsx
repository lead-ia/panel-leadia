"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { ChatInterfaceTab } from "@/components/dashboard/chat-interface"
import { IntegrationsTab } from "@/components/dashboard/integrations"
import { SettingsTab } from "@/components/dashboard/settings"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "integrations" | "settings">("integrations")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-border border-b-opacity-20 mb-8 space-x-4" role="tablist" aria-label="Dashboard tabs">
          <button
            role="tab"
            aria-selected={activeTab === "integrations"}
            onClick={() => setActiveTab("integrations")}
            className={`pb-4 font-medium transition-colors ${
              activeTab === "integrations"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Integrações
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "chat"}
            onClick={() => setActiveTab("chat")}
            className={`pb-4 font-medium transition-colors ${
              activeTab === "chat"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Chat Bot
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            className={`pb-4 font-medium transition-colors ${
              activeTab === "settings"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Personalizações
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "chat" && <ChatInterfaceTab />}
        {activeTab === "integrations" && <IntegrationsTab />}
        {activeTab === "settings" &&  <SettingsTab/>}
      </div>
    </div>
  )
}
