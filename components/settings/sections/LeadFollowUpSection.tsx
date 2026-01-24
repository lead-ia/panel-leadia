import { useState, useEffect } from "react";
import { useUser } from "@/components/auth/user-context";
import { LeadFollowUpInfo, Settings } from "@/types/settings";
import { useDebouncedCallback } from "@/hooks/use-debounce";

export function LeadFollowUpSection() {
  const { dbUser, updateSettings } = useUser();
  if (!dbUser) {
    return <></>;
  }

  const defaultLeadFollowUpInfo: LeadFollowUpInfo = {
    basicGuidance: {
      message: "",
    },
    preConsultationGuidance: {
      message: "",
    },
  };

  const data = dbUser?.settings?.leadFollowUpInfo || defaultLeadFollowUpInfo;

  const [localData, setLocalData] = useState<LeadFollowUpInfo>(data);

  useEffect(() => {
    if (dbUser?.settings?.leadFollowUpInfo) {
      setLocalData(dbUser.settings.leadFollowUpInfo);
    }
  }, [dbUser?.settings?.leadFollowUpInfo]);

  const debouncedUpdate = useDebouncedCallback(
    (updatedData: LeadFollowUpInfo) => {
      updateSettings({
        leadFollowUpInfo: updatedData,
      });
    },
    1000,
  );

  if (!localData) return null;

  const handleBasicGuidanceChange = (field: string, value: any) => {
    const newData = {
      ...localData,
      basicGuidance: { ...localData.basicGuidance, [field]: value },
    };
    setLocalData(newData);
    debouncedUpdate(newData);
  };

  const handlePreConsultationGuidanceChange = (field: string, value: any) => {
    const newData = {
      ...localData,
      preConsultationGuidance: {
        ...localData.preConsultationGuidance,
        [field]: value,
      },
    };
    setLocalData(newData);
    debouncedUpdate(newData);
  };

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-5 bg-blue-50">
        <h3 className="text-[#1e3a5f] mb-4">Texto de orientações básicas</h3>
        <p className="text-xs text-gray-500 mb-3">
          Enviar assim que confirmar a consulta
        </p>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Mensagem personalizada
          </label>
          <textarea
            rows={4}
            value={localData.basicGuidance.message}
            onChange={(e) =>
              handleBasicGuidanceChange("message", e.target.value)
            }
            placeholder="Ex: Sua consulta está confirmada! Lembre-se de chegar com 10 minutos de antecedência."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-2">
            Anexar arquivo PDF
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#6eb5d8] transition-colors cursor-pointer">
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

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Mensagem personalizada
          </label>
          <textarea
            rows={4}
            value={localData.preConsultationGuidance.message}
            onChange={(e) =>
              handlePreConsultationGuidanceChange("message", e.target.value)
            }
            placeholder="Ex: Olá! Para a sua consulta de amanhã, por favor traga seus exames anteriores e documentos."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-2">
            Anexar arquivo PDF
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#6eb5d8] transition-colors cursor-pointer">
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
