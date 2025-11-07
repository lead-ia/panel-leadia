"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  connected: boolean
  connectUrl?: string
}

export function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Sincronize seus eventos e agendamentos.",
      icon: "📅",
      connected: false,
    },
    {
      id: "whatsapp",
      name: "Integração WhatsApp",
      description: "Habilite a comunicação direta e notificações.",
      icon: "💬",
      connected: false,
    },
  ])

  const handleConnect = async (integrationId: string) => {
    try {
      // ============================================
      // ENDPOINT TO REPLACE: /api/integrations/connect
      // Expected POST body: { integrationId: string }
      // Expected response: { success: true, url: string }
      // ============================================
      const response = await fetch("/api/integrations/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integrationId }),
      })

      const data = await response.json()

      if (data.success) {
        setIntegrations((prev) => prev.map((int) => (int.id === integrationId ? { ...int, connected: true } : int)))

        if (data.url) {
          window.open(data.url, "_blank")
        }
      }
    } catch (err) {
      console.error("Error connecting integration:", err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Integrações Disponíveis</h2>
        <p className="text-muted-foreground">Conecte suas ferramentas favoritas ao LeadIA</p>
      </div>

      <div className="grid gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="flex items-center justify-between p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="text-3xl">{integration.icon}</div>
              <div>
                <h3 className="font-semibold text-foreground">{integration.name}</h3>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {integration.connected ? (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  <span className="text-sm font-medium">Conectado</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-destructive">
                  <div className="w-2 h-2 rounded-full bg-destructive"></div>
                  <span className="text-sm font-medium">Não conectado</span>
                </div>
              )}

              <Button
                onClick={() => handleConnect(integration.id)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {integration.connected ? "Desconectar" : "Conectar"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
