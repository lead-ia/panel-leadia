import { useState, useEffect } from "react";
import { useUser } from "@/components/auth/user-context";
import { ClinicInfo, Settings } from "@/types/settings";
import { useDebouncedCallback } from "@/hooks/use-debounce";

export function ClinicInfoSection() {
  const { dbUser, updateSettings } = useUser();

  if (!dbUser) {
    return <></>;
  }

  const defaultClinicInfo: ClinicInfo = {
    clinicName: "",
    address: "",
    onlineConsultationLink: "",
    standardDurationInPerson: "60 minutos",
    standardDurationOnline: "45 minutos",
  };

  const data = dbUser?.settings?.clinicInfo || defaultClinicInfo;

  const [localData, setLocalData] = useState<ClinicInfo>(data);

  useEffect(() => {
    if (dbUser?.settings?.clinicInfo) {
      setLocalData(dbUser.settings.clinicInfo);
    }
  }, [dbUser?.settings?.clinicInfo]);

  const debouncedUpdate = useDebouncedCallback((updatedData: ClinicInfo) => {
    updateSettings({
      clinicInfo: updatedData,
    });
  }, 1000);

  if (!localData) return null;

  const handleChange = (field: keyof ClinicInfo, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    debouncedUpdate(newData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Nome da clínica
        </label>
        <input
          type="text"
          value={localData.clinicName}
          onChange={(e) => handleChange("clinicName", e.target.value)}
          placeholder="Ex: Clínica CardioVida"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Endereço do consultório presencial
        </label>
        <input
          type="text"
          value={localData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo - SP"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Link da consulta online
        </label>
        <input
          type="text"
          value={localData.onlineConsultationLink}
          onChange={(e) =>
            handleChange("onlineConsultationLink", e.target.value)
          }
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
            value={localData.standardDurationInPerson}
            onChange={(e) =>
              handleChange("standardDurationInPerson", e.target.value)
            }
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
            value={localData.standardDurationOnline}
            onChange={(e) =>
              handleChange("standardDurationOnline", e.target.value)
            }
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
