import { useState } from "react";
import {
  User,
  Building2,
  Link2,
  MessageSquare,
  Calendar,
  DollarSign,
  XCircle,
  Bell,
  TestTube2,
  ChevronDown,
  ChevronUp,
  Save,
  UserPlus,
  Users,
  Loader2,
} from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { Settings } from "@/types/settings";

type Section =
  | "dados-basicos"
  | "dados-consultorio"
  | "canais"
  | "preferencias-ia"
  | "agenda"
  | "formas-pagamento"
  | "followup-lead"
  | "followup-paciente"
  | "lembretes"
  | "teste-ia";
type Section =
  | "dados-basicos"
  | "dados-consultorio"
  | "canais"
  | "preferencias-ia"
  | "agenda"
  | "formas-pagamento"
  | "followup-lead"
  | "followup-paciente"
  | "lembretes"
  | "teste-ia";

export function SettingsPage() {
  const { settings, loading, error, updateSettings, upsertStatus } =
    useSettings();
  const [expandedSection, setExpandedSection] = useState<Section | null>(
    "dados-basicos",
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]" />
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        Erro ao carregar configurações. Tente novamente.
      </div>
    );
  }

  const toggleSection = (section: Section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    { id: "dados-basicos", title: "1. Dados básicos do médico", icon: User },
    {
      id: "dados-consultorio",
      title: "2. Dados de consultório",
      icon: Building2,
    },
    { id: "canais", title: "3. Integrações", icon: Link2 },
    {
      id: "preferencias-ia",
      title: "4. Preferências da IA e Comunicação",
      icon: MessageSquare,
    },
    {
      id: "agenda",
      title: "5. Agenda e horários de atendimento",
      icon: Calendar,
    },
    {
      id: "formas-pagamento",
      title: "6. Formas de pagamento",
      icon: DollarSign,
    },
    { id: "followup-lead", title: "7. Follow-up de leads", icon: UserPlus },
    {
      id: "followup-paciente",
      title: "8. Follow-up de pacientes",
      icon: Users,
    },
    { id: "lembretes", title: "9. Lembretes e confirmações", icon: Bell },
    { id: "teste-ia", title: "10. Teste da IA", icon: TestTube2 },
    { id: "dados-basicos", title: "1. Dados básicos do médico", icon: User },
    {
      id: "dados-consultorio",
      title: "2. Dados de consultório",
      icon: Building2,
    },
    { id: "canais", title: "3. Integrações", icon: Link2 },
    {
      id: "preferencias-ia",
      title: "4. Preferências da IA e Comunicação",
      icon: MessageSquare,
    },
    {
      id: "agenda",
      title: "5. Agenda e horários de atendimento",
      icon: Calendar,
    },
    {
      id: "formas-pagamento",
      title: "6. Formas de pagamento",
      icon: DollarSign,
    },
    { id: "followup-lead", title: "7. Follow-up de leads", icon: UserPlus },
    {
      id: "followup-paciente",
      title: "8. Follow-up de pacientes",
      icon: Users,
    },
    { id: "lembretes", title: "9. Lembretes e confirmações", icon: Bell },
    { id: "teste-ia", title: "10. Teste da IA", icon: TestTube2 },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
      <div className="border-b border-gray-200 p-6 bg-white">
        <h1 className="text-[#1e3a5f] text-2xl">Configurações</h1>
        <p className="text-gray-600 mt-1">
          Gerencie as preferências e funcionalidades do sistema
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {sections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <div
                key={section.id}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleSection(section.id as Section)}
                  className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[#1e3a5f]">{section.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#6eb5d8]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-6 border-t border-gray-100">
                    {section.id === "dados-basicos" && (
                      <DadosBasicosSection data={settings.basicInfo} />
                    )}
                    {section.id === "dados-consultorio" && (
                      <DadosConsultorioSection data={settings.clinicInfo} />
                    )}
                    {section.id === "canais" && <CanaisSection />}
                    {section.id === "preferencias-ia" && (
                      <PreferenciasIASection data={settings.aiPreferences} />
                    )}
                    {section.id === "agenda" && (
                      <AgendaSection data={settings.availability} />
                    )}
                    {section.id === "formas-pagamento" && (
                      <FormasPagamentoSection data={settings.paymentMethods} />
                    )}
                    {section.id === "followup-lead" && (
                      <FollowupLeadSection data={settings.leadFollowUpInfo} />
                    )}
                    {section.id === "followup-paciente" && (
                      <FollowupPacienteSection
                        data={settings.patientFollowUpInfo}
                      />
                    )}
                    {section.id === "lembretes" && (
                      <LembretesSection data={settings.reminderInfo} />
                    )}
                    {section.id === "teste-ia" && <TesteIASection />}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex justify-end gap-3 pt-4 pb-8">
            <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
              Cancelar
            </button>
            <button
              onClick={() => updateSettings(settings)}
              disabled={upsertStatus === "loading"}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e3a5f] to-[#6eb5d8] text-white hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {upsertStatus === "loading" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {upsertStatus === "loading"
                ? "Salvando..."
                : "Salvar Configurações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DadosBasicosSection({ data }: { data: Settings["basicInfo"] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Nome completo *
          </label>
          <label className="block text-sm text-gray-700 mb-2">
            Nome completo *
          </label>
          <input
            type="text"
            defaultValue={data.fullName}
            placeholder="Ex: Carolina Santos Silva"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Nome para chamamento *
          </label>
          <label className="block text-sm text-gray-700 mb-2">
            Nome para chamamento *
          </label>
          <input
            type="text"
            defaultValue={data.displayName}
            placeholder="Ex: Dra. Carolina"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Especialidade *
          </label>
          <label className="block text-sm text-gray-700 mb-2">
            Especialidade *
          </label>
          <input
            type="text"
            defaultValue={data.specialty}
            placeholder="Ex: Cardiologia"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Subespecialidade (opcional)
          </label>
          <label className="block text-sm text-gray-700 mb-2">
            Subespecialidade (opcional)
          </label>
          <input
            type="text"
            defaultValue={data.subspecialty}
            placeholder="Ex: Arritmia Cardíaca"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">CRM *</label>
          <input
            type="text"
            defaultValue={data.crm}
            placeholder="Ex: 123456"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">UF *</label>
          <select
            defaultValue={data.uf}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          >
            <option>Selecione</option>
            <option>SP</option>
            <option>RJ</option>
            <option>MG</option>
            <option>RS</option>
            <option>SC</option>
            <option>PR</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Foto profissional
        </label>
        <label className="block text-sm text-gray-700 mb-2">
          Foto profissional
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-500">Clique ou arraste uma imagem</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG até 5MB</p>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Mini bio (opcional)
        </label>
        <label className="block text-sm text-gray-700 mb-2">
          Mini bio (opcional)
        </label>
        <textarea
          rows={3}
          defaultValue={data.bio}
          placeholder="Ex: Cardiologista com 15 anos de experiência, especializada em arritmias..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
        />
      </div>
    </div>
  );
}

function DadosConsultorioSection({ data }: { data: Settings["clinicInfo"] }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Nome da clínica
        </label>
        <label className="block text-sm text-gray-700 mb-2">
          Nome da clínica
        </label>
        <input
          type="text"
          defaultValue={data.clinicName}
          placeholder="Ex: Clínica CardioVida"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Endereço do consultório presencial
        </label>
        <label className="block text-sm text-gray-700 mb-2">
          Endereço do consultório presencial
        </label>
        <input
          type="text"
          defaultValue={data.address}
          placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo - SP"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Link da consulta online
        </label>
        <label className="block text-sm text-gray-700 mb-2">
          Link da consulta online
        </label>
        <input
          type="text"
          defaultValue={data.onlineConsultationLink}
          placeholder="Ex: https://meet.google.com/seu-link"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Tempo padrão - Presencial
          </label>
          <select
            defaultValue={data.standardDurationInPerson}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          >
            <option>15 minutos</option>
            <option>30 minutos</option>
            <option>45 minutos</option>
            <option>60 minutos</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Tempo padrão - Online
          </label>
          <select
            defaultValue={data.standardDurationOnline}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          >
            <option>15 minutos</option>
            <option>30 minutos</option>
            <option>45 minutos</option>
            <option>60 minutos</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function CanaisSection() {
  const { updateUser } = useUser();

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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-gray-800">WhatsApp Oficial</p>
              <p className="text-xs text-gray-500">
                Conecte seu número para atendimento
              </p>
              <p className="text-xs text-gray-500">
                Conecte seu número para atendimento
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
            Conectar
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          E-mail para notificações
        </label>
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
              <p className="text-xs text-gray-500">
                Sincronize sua agenda automaticamente
              </p>
            </div>
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            onClick={handleConnectCalendar}
          >
            Conectar
          </button>
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
              <p className="text-xs text-gray-500">
                Em breve - Integração via API
              </p>
            </div>
          </div>
          <button
            disabled
            className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
          >
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

function PreferenciasIASection({ data }: { data: Settings["aiPreferences"] }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Pergunta inicial personalizada
        </label>
        <label className="block text-sm text-gray-700 mb-2">
          Pergunta inicial personalizada
        </label>
        <input
          type="text"
          defaultValue={data.initialQuestion}
          placeholder="Ex: Poderia me contar o motivo da consulta?"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-3">Tom desejado</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            "Acolhedor",
            "Formal",
            "Minimalista",
            "Técnico e objetivo",
            "Humanizado com empatia",
          ].map((tom) => (
            <label
              key={tom}
              className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                name="tom"
                defaultChecked={data.tone === tom}
                className="text-[#6eb5d8]"
              />
              <span className="text-sm">{tom}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-3">
          Nível de personalização do acolhimento
        </label>
        <label className="block text-sm text-gray-700 mb-3">
          Nível de personalização do acolhimento
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="empatia"
              defaultChecked={
                data.empathyLevel === "Empatia moderada (recomendado)"
              }
              className="text-[#6eb5d8]"
            />
            <span className="text-sm">Empatia moderada (recomendado)</span>
          </label>
          <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="empatia"
              defaultChecked={
                data.empathyLevel ===
                "Alta empatia (Psiquiatria, Ginecologia, etc.)"
              }
              className="text-[#6eb5d8]"
            />
            <span className="text-sm">
              Alta empatia (Psiquiatria, Ginecologia, etc.)
            </span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-3">
          Assuntos proibidos para a IA
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Por segurança, marque os tópicos que a IA NUNCA deve abordar:
        </p>
        <label className="block text-sm text-gray-700 mb-3">
          Assuntos proibidos para a IA
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Por segurança, marque os tópicos que a IA NUNCA deve abordar:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Diagnóstico",
            "Exames",
            "Medicamentos",
            "Ajuste de doses",
            "Classificação de gravidade",
            "Comentários sobre laudos",
            "Questões emocionais sensíveis",
            "Diagnóstico",
            "Exames",
            "Medicamentos",
            "Ajuste de doses",
            "Classificação de gravidade",
            "Comentários sobre laudos",
            "Questões emocionais sensíveis",
          ].map((assunto) => (
            <label
              key={assunto}
              className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                defaultChecked={data.forbiddenTopics.includes(assunto)}
                className="text-[#6eb5d8]"
              />
              <span className="text-sm">{assunto}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Resposta padrão quando paciente faz perguntas clínicas
        </label>
        <label className="block text-sm text-gray-700 mb-2">
          Resposta padrão quando paciente faz perguntas clínicas
        </label>
        <textarea
          rows={3}
          defaultValue={data.clinicalResponse}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
        />
      </div>
    </div>
  );
}

function AgendaSection({ data }: { data: Settings["availability"] }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-700 mb-3">
          Tipos de serviço oferecidos
        </label>
        <label className="block text-sm text-gray-700 mb-3">
          Tipos de serviço oferecidos
        </label>
        <div className="space-y-2">
          {["Consulta presencial", "Consulta online"].map((servico) => (
            <label
              key={servico}
              className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                defaultChecked={data.services.includes(servico)}
                className="text-[#6eb5d8]"
              />
              <span className="text-sm">{servico}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-gray-800 mb-4">
          Disponibilidade semanal - Consulta Online
        </h3>

        <h3 className="text-gray-800 mb-4">
          Disponibilidade semanal - Consulta Online
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Dias disponíveis
            </label>
            <label className="block text-sm text-gray-700 mb-2">
              Dias disponíveis
            </label>
            <div className="flex gap-2">
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia) => (
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia) => (
                <label key={dia} className="flex-1">
                  <input
                    type="checkbox"
                    defaultChecked={data.online.days.includes(dia)}
                    className="peer sr-only"
                  />
                  <div className="p-3 text-center border border-gray-300 rounded-lg cursor-pointer peer-checked:bg-[#6eb5d8] peer-checked:text-white peer-checked:border-[#6eb5d8] hover:bg-gray-50 transition-all">
                    {dia}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Horário de início
              </label>
              <label className="block text-sm text-gray-700 mb-2">
                Horário de início
              </label>
              <input
                type="time"
                defaultValue={data.online.startTime}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Horário de término
              </label>
              <label className="block text-sm text-gray-700 mb-2">
                Horário de término
              </label>
              <input
                type="time"
                defaultValue={data.online.endTime}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Intervalo entre consultas
              </label>
              <select
                defaultValue={data.online.interval}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
              >
                <option>15 minutos</option>
                <option>30 minutos</option>
                <option>45 minutos</option>
                <option>60 minutos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Virada de agenda (dias à frente)
              </label>
              <label className="block text-sm text-gray-700 mb-2">
                Virada de agenda (dias à frente)
              </label>
              <input
                type="number"
                defaultValue={data.online.futureSchedulingDays}
                min="1"
                max="90"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-gray-800 mb-4">
          Disponibilidade semanal - Consulta Presencial
        </h3>

        <h3 className="text-gray-800 mb-4">
          Disponibilidade semanal - Consulta Presencial
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Dias disponíveis
            </label>
            <label className="block text-sm text-gray-700 mb-2">
              Dias disponíveis
            </label>
            <div className="flex gap-2">
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia) => (
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia) => (
                <label key={dia} className="flex-1">
                  <input
                    type="checkbox"
                    defaultChecked={data.inPerson.days.includes(dia)}
                    className="peer sr-only"
                  />
                  <div className="p-3 text-center border border-gray-300 rounded-lg cursor-pointer peer-checked:bg-[#6eb5d8] peer-checked:text-white peer-checked:border-[#6eb5d8] hover:bg-gray-50 transition-all">
                    {dia}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Horário de início
              </label>
              <label className="block text-sm text-gray-700 mb-2">
                Horário de início
              </label>
              <input
                type="time"
                defaultValue={data.inPerson.startTime}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Horário de término
              </label>
              <label className="block text-sm text-gray-700 mb-2">
                Horário de término
              </label>
              <input
                type="time"
                defaultValue={data.inPerson.endTime}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Intervalo entre consultas
              </label>
              <select
                defaultValue={data.inPerson.interval}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
              >
                <option>15 minutos</option>
                <option>30 minutos</option>
                <option>45 minutos</option>
                <option>60 minutos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Virada de agenda (dias à frente)
              </label>
              <label className="block text-sm text-gray-700 mb-2">
                Virada de agenda (dias à frente)
              </label>
              <input
                type="number"
                defaultValue={data.inPerson.futureSchedulingDays}
                min="1"
                max="90"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-gray-800 mb-4">Bloqueios</h3>
        <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#6eb5d8] hover:text-[#6eb5d8] transition-all">
          + Adicionar bloqueio (feriados, viagens, etc.)
        </button>
      </div>
    </div>
  );
}

function FormasPagamentoSection({
  data,
}: {
  data: Settings["paymentMethods"];
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Valor da consulta online
          </label>
          <label className="block text-sm text-gray-700 mb-2">
            Valor da consulta online
          </label>
          <input
            type="text"
            defaultValue={data.onlineConsultationPrice}
            placeholder="R$ 300,00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Valor da consulta presencial
          </label>
          <label className="block text-sm text-gray-700 mb-2">
            Valor da consulta presencial
          </label>
          <input
            type="text"
            defaultValue={data.inPersonConsultationPrice}
            placeholder="R$ 400,00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-3">
          Forma de pagamento aceita
        </label>
        <label className="block text-sm text-gray-700 mb-3">
          Forma de pagamento aceita
        </label>
        <div className="space-y-2">
          {[
            "PIX",
            "Cartão de crédito",
            "Cartão de débito",
            "Link de pagamento externo",
          ].map((forma) => (
            <label
              key={forma}
              className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                defaultChecked={data.acceptedMethods.includes(forma)}
                className="text-[#6eb5d8]"
              />
              <span className="text-sm">{forma}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function FollowupLeadSection({ data }: { data: Settings["leadFollowUpInfo"] }) {
  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-5 bg-blue-50">
        <h3 className="text-[#1e3a5f] mb-4">Texto de orientações básicas</h3>
        <p className="text-xs text-gray-500 mb-3">
          Enviar assim que confirmar a consulta
        </p>

        <p className="text-xs text-gray-500 mb-3">
          Enviar assim que confirmar a consulta
        </p>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Mensagem personalizada
          </label>
          <label className="block text-sm text-gray-700 mb-2">
            Mensagem personalizada
          </label>
          <textarea
            rows={4}
            defaultValue={data.basicGuidance.message}
            placeholder="Ex: Sua consulta está confirmada! Lembre-se de chegar com 10 minutos de antecedência."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-2">
            Anexar arquivo PDF
          </label>
          <label className="block text-sm text-gray-700 mb-2">
            Anexar arquivo PDF
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#6eb5d8] transition-colors cursor-pointer">
            <p className="text-sm text-gray-500">
              Clique ou arraste um arquivo PDF
            </p>
            <p className="text-sm text-gray-500">
              Clique ou arraste um arquivo PDF
            </p>
            <p className="text-xs text-gray-400 mt-1">Máximo 5MB</p>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-5 bg-green-50">
        <h3 className="text-[#1e3a5f] mb-4">Orientações de pré consulta</h3>
        <p className="text-xs text-gray-500 mb-3">
          Enviar assim que confirmar a presença
        </p>

        <p className="text-xs text-gray-500 mb-3">
          Enviar assim que confirmar a presença
        </p>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Mensagem personalizada
          </label>
          <label className="block text-sm text-gray-700 mb-2">
            Mensagem personalizada
          </label>
          <textarea
            rows={4}
            defaultValue={data.preConsultationGuidance.message}
            placeholder="Ex: Olá! Para a sua consulta de amanhã, por favor traga seus exames anteriores e documentos."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-2">
            Anexar arquivo PDF
          </label>
          <label className="block text-sm text-gray-700 mb-2">
            Anexar arquivo PDF
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#6eb5d8] transition-colors cursor-pointer">
            <p className="text-sm text-gray-500">
              Clique ou arraste um arquivo PDF
            </p>
            <p className="text-sm text-gray-500">
              Clique ou arraste um arquivo PDF
            </p>
            <p className="text-xs text-gray-400 mt-1">Máximo 5MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FollowupPacienteSection({
  data,
}: {
  data: Settings["patientFollowUpInfo"];
}) {
  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-5 bg-purple-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[#1e3a5f]">
              Relembrar paciente para próxima consulta
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Enviar lembrete automático periodicamente
            </p>
            <h3 className="text-[#1e3a5f]">
              Relembrar paciente para próxima consulta
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Enviar lembrete automático periodicamente
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={data.enabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6eb5d8]"></div>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Enviar a cada quantos dias
            </label>
            <label className="block text-sm text-gray-700 mb-2">
              Enviar a cada quantos dias
            </label>
            <input
              type="number"
              defaultValue={data.frequencyDays}
              min="1"
              max="365"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
            />
            <p className="text-xs text-gray-500 mt-1">Padrão: 30 dias</p>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Mensagem personalizada
            </label>
            <label className="block text-sm text-gray-700 mb-2">
              Mensagem personalizada
            </label>
            <textarea
              rows={4}
              defaultValue={data.message}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use [NOME] para inserir o nome do paciente
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Use [NOME] para inserir o nome do paciente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LembretesSection({ data }: { data: Settings["reminderInfo"] }) {
  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-5 bg-blue-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[#1e3a5f]">Lembrete automático (24h antes)</h3>
            <p className="text-xs text-gray-500 mt-1">
              Enviar lembrete aos pacientes
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Enviar lembrete aos pacientes
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={data.autoReminder24h.enabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6eb5d8]"></div>
          </label>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Texto customizável
          </label>
          <label className="block text-sm text-gray-700 mb-2">
            Texto customizável
          </label>
          <textarea
            rows={3}
            defaultValue={data.autoReminder24h.message}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-5 bg-green-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[#1e3a5f]">Confirmação automática no dia</h3>
            <p className="text-xs text-gray-500 mt-1">
              Pedir confirmação no dia da consulta
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Pedir confirmação no dia da consulta
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={data.autoConfirmationDay.enabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6eb5d8]"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

function TesteIASection() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Sou a assistente virtual da Dra. Carolina. Como posso te ajudar?",
      sender: "ia",
    },
    {
      id: 1,
      text: "Olá! Sou a assistente virtual da Dra. Carolina. Como posso te ajudar?",
      sender: "ia",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: inputMessage, sender: "user" },
      ]);
      setInputMessage("");

      setMessages([
        ...messages,
        { id: messages.length + 1, text: inputMessage, sender: "user" },
      ]);
      setInputMessage("");

      // Simular resposta da IA
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "Entendi! Vou te ajudar com isso. Você gostaria de agendar uma consulta?",
            sender: "ia",
          },
        ]);
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "Entendi! Vou te ajudar com isso. Você gostaria de agendar uma consulta?",
            sender: "ia",
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>💡 Dica:</strong> Teste diferentes cenários de conversa antes
          de ativar a IA no seu consultório. Simule perguntas clínicas,
          agendamentos e cancelamentos.
          <strong>💡 Dica:</strong> Teste diferentes cenários de conversa antes
          de ativar a IA no seu consultório. Simule perguntas clínicas,
          agendamentos e cancelamentos.
        </p>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#6eb5d8] p-3 text-white">
          <p className="text-sm">Simulador de Conversa - WhatsApp</p>
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-gray-50 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-[#6eb5d8] text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                  msg.sender === "user"
                    ? "bg-[#6eb5d8] text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 p-3 bg-white flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Digite uma mensagem de teste..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-[#6eb5d8] text-white rounded-lg hover:bg-[#1e3a5f] transition-all"
          >
            Enviar
          </button>
        </div>
      </div>

      <button className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Ativar IA no meu consultório
      </button>
    </div>
  );
}

