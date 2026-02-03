import { useUser } from "@/components/auth/user-context";
import { MessageSquare, Calendar, Building2 } from "lucide-react";
import { WhatsappConnect } from "../whatsapp-connect";
import { Button } from "@/components/ui/button";

export function IntegrationsSection() {
  const { updateUser, dbUser } = useUser();
  const calendarIntegrated = dbUser?.calendarInfo !== null;

  async function handleConnectCalendar() {
    try {
      const response = await fetch("/api/calendar/oauth/start");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao iniciar conexão");
      }

      if (data.success && data.oauth_data) {
        const { email, ...calendarInfo } = data.oauth_data;
        await updateUser({ calendarInfo });
        alert("Calendário conectado com sucesso!");
      } else if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        throw new Error("URL de autorização não recebida");
      }
    } catch (error) {
      console.error("Erro ao conectar calendário:", error);
      alert("Erro ao conectar calendário. Tente novamente.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <WhatsappConnect />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          E-mail para notificações
        </label>
        <input
          type="email"
          placeholder="contato@clinica.com.br"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
        />
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-gray-800">Google Calendar</p>
              <p className="text-xs text-gray-500">
                Sincronize sua agenda automaticamente
              </p>
            </div>
          </div>
          {calendarIntegrated ? (
            <div className="py-2 px-4 bg-green-500 rounded-lg">
              <p className="text-white text-md">Conectado</p>
            </div>
          ) : (
            <Button onClick={handleConnectCalendar}>Conectar</Button>
          )}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-gray-800">Sistema de prontuário</p>
              <p className="text-xs text-gray-500">
                Em breve - Integração via API
              </p>
            </div>
          </div>
          <button
            disabled
            className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
          >
            Em breve
          </button>
        </div>
      </div>
    </div>
  );
}
