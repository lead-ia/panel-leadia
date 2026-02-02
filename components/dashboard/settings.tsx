"use client"

import { useState, useEffect, FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAuth } from "../auth/auth-context"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"

interface UserSettings {
  customIaName: string;
  doctorSpeciality: string;
  greeting: string;
  talkStyle: string;
  forbiddenTalks: string;
  appointment: {
    onSitePrice: string;
    onLinePrice: string;
    onSiteAddress: string;
    onLinePlatform: "zoom" | "google meet" | "whatsapp" | "video conference" | "skype" | "";
  };
}

export function SettingsTab() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings>({
    customIaName: "",
    doctorSpeciality: "",
    greeting: "",
    talkStyle: "",
    forbiddenTalks: "",
    appointment: {
      onSitePrice: "",
      onLinePrice: "",
      onSiteAddress: "",
      onLinePlatform: "",
    },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!user?.uid) return

    const fetchSettings = async () => {
      setIsLoading(true)
      try {
        const docRef = doc(db, "settings", user.uid)
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          setSettings(prev => ({ ...prev, ...snap.data() }))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [user?.uid])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (name.startsWith("appointment.")) {
      const key = name.split(".")[1] as keyof UserSettings["appointment"]
      setSettings(prev => ({
        ...prev,
        appointment: { ...prev.appointment, [key]: value },
      }))
    } else {
      setSettings(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user?.uid) return

    setIsSaving(true)
    try {
      const docRef = doc(db, "settings", user.uid)
      await setDoc(docRef, {...settings, "doctorName": user.displayName }, { merge: true })
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div>Carregando...</div>

  return (
    <div className="space-y-8">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Personalizações do LeadIA</h2>
        <p className="text-sm text-muted-foreground">
          Ajuste o comportamento, linguagem e informações gerais da assistente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ===== BASIC INFORMATION ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-2">
              <Label htmlFor="customIaName">Nome da Assistente</Label>
              <Input
                id="customIaName"
                name="customIaName"
                value={settings.customIaName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorSpeciality">Especialidade Médica</Label>
              <Input
                id="doctorSpeciality"
                name="doctorSpeciality"
                value={settings.doctorSpeciality}
                onChange={handleInputChange}
              />
            </div>

          </CardContent>
        </Card>

        {/* ===== APPOINTMENTS ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Consultas</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="appointment.onSitePrice">Preço da Consulta Presencial</Label>
                <Input
                  id="appointment.onSitePrice"
                  name="appointment.onSitePrice"
                  value={settings.appointment.onSitePrice}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointment.onLinePrice">Preço da Consulta Online</Label>
                <Input
                  id="appointment.onLinePrice"
                  name="appointment.onLinePrice"
                  value={settings.appointment.onLinePrice}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment.onSiteAddress">Endereço da Consulta Presencial</Label>
              <Input
                id="appointment.onSiteAddress"
                name="appointment.onSiteAddress"
                value={settings.appointment.onSiteAddress}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Plataforma da Consulta Online</Label>

              <Select
                value={settings.appointment.onLinePlatform}
                onValueChange={(val) =>
                  setSettings(prev => ({
                    ...prev,
                    appointment: { ...prev.appointment, onLinePlatform: val as any },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma plataforma" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="google meet">Google Meet</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="video conference">Videoconferência</SelectItem>
                  <SelectItem value="skype">Skype</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </CardContent>
        </Card>

        {/* ===== BEHAVIOR ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Estilo de Conversa</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            <div className="space-y-2">
              <Label htmlFor="greeting">Saudação</Label>
              <Textarea
                id="greeting"
                name="greeting"
                value={settings.greeting}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="talkStyle">Estilo de Conversa</Label>
              <Textarea
                id="talkStyle"
                name="talkStyle"
                value={settings.talkStyle}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="forbiddenTalks">Assuntos Proibidos</Label>
              <Textarea
                id="forbiddenTalks"
                name="forbiddenTalks"
                value={settings.forbiddenTalks}
                onChange={handleInputChange}
              />
            </div>

          </CardContent>
        </Card>

        {/* ===== SAVE BUTTON ===== */}
        <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>

      </form>
    </div>
  )
}