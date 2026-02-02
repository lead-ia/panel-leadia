import { useState, useEffect } from "react";
import { useUser } from "@/components/auth/user-context";
import { PatientFollowUpInfo, Settings } from "@/types/settings";
import { useDebouncedCallback } from "@/hooks/use-debounce";

export function PatientFollowUpSection() {
  const { dbUser, updateSettings } = useUser();
  if (!dbUser) {
    return <></>;
  }

  const defaultPatientFollowUpInfo: PatientFollowUpInfo = {
    enabled: false,
    frequencyDays: 30,
    message:
      "Olá [NOME], faz algum tempo que não nos vemos. Como você está se sentindo? Gostaria de agendar uma consulta de rotina?",
  };

  const data =
    dbUser?.settings?.patientFollowUpInfo || defaultPatientFollowUpInfo;

  const [localData, setLocalData] = useState<PatientFollowUpInfo>(data);

  useEffect(() => {
    if (dbUser?.settings?.patientFollowUpInfo) {
      setLocalData(dbUser.settings.patientFollowUpInfo);
    }
  }, [dbUser?.settings?.patientFollowUpInfo]);

  const debouncedUpdate = useDebouncedCallback(
    (updatedData: PatientFollowUpInfo) => {
      updateSettings({
        patientFollowUpInfo: updatedData,
      });
    },
    1000,
  );

  if (!localData) return null;

  const handleChange = (field: keyof PatientFollowUpInfo, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    debouncedUpdate(newData);
  };

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
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localData.enabled}
              onChange={(e) => handleChange("enabled", e.target.checked)}
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
            <input
              type="number"
              value={localData.frequencyDays}
              onChange={(e) =>
                handleChange("frequencyDays", parseInt(e.target.value))
              }
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
            <textarea
              rows={4}
              value={localData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use [NOME] para inserir o nome do paciente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
