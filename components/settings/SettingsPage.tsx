import { useState } from "react";
import {
  User,
  Building2,
  Link2,
  MessageSquare,
  Calendar,
  DollarSign,
  UserPlus,
  Users,
  Bell,
  TestTube2,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { useUser } from "../auth/user-context";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { ClinicInfoSection } from "./sections/ClinicInfoSection";
import { IntegrationsSection } from "./sections/IntegrationsSection";
import { AiPreferencesSection } from "./sections/AiPreferencesSection";
import { AgendaSection } from "./sections/AgendaSection";
import { PaymentMethodsSection } from "./sections/PaymentMethodsSection";
import { LeadFollowUpSection } from "./sections/LeadFollowUpSection";
import { PatientFollowUpSection } from "./sections/PatientFollowUpSection";
import { RemindersSection } from "./sections/RemindersSection";

type Section =
  | "dados-basicos"
  | "dados-consultorio"
  | "canais"
  | "preferencias-ia"
  | "agenda"
  | "formas-pagamento"
  | "followup-lead"
  | "followup-paciente"
  | "lembretes";

export function SettingsPage() {
  const { dbUser, loading, error } = useUser();
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

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        {error || "Configurações não encontradas."}
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
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex-1 min-h-0 flex flex-col">
      <div className="border-b border-gray-200 p-6 bg-white">
        <h1 className="text-[#1e3a5f] text-2xl">Configurações</h1>
        <p className="text-gray-600 mt-1">
          Gerencie as preferências e funcionalidades do sistema
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 min-h-0">
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
                    {section.id === "dados-basicos" && <BasicInfoSection />}
                    {section.id === "dados-consultorio" && (
                      <ClinicInfoSection />
                    )}
                    {section.id === "canais" && <IntegrationsSection />}
                    {section.id === "preferencias-ia" && (
                      <AiPreferencesSection />
                    )}
                    {section.id === "agenda" && <AgendaSection />}
                    {section.id === "formas-pagamento" && (
                      <PaymentMethodsSection />
                    )}
                    {section.id === "followup-lead" && <LeadFollowUpSection />}
                    {section.id === "followup-paciente" && (
                      <PatientFollowUpSection />
                    )}
                    {section.id === "lembretes" && <RemindersSection />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
