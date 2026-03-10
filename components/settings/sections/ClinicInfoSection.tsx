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
    billingAddressSameAsClinic: true,
    billingAddress: "",
  };

  const data = dbUser?.settings?.clinicInfo || defaultClinicInfo;

  const [localData, setLocalData] = useState<ClinicInfo>(data);

  useEffect(() => {
    if (dbUser?.settings?.clinicInfo) {
      setLocalData({
        ...defaultClinicInfo,
        ...dbUser.settings.clinicInfo,
      });
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

      <div className="flex items-center space-x-2 py-2">
        <input
          type="checkbox"
          id="billingAddressSameAsClinic"
          checked={localData.billingAddressSameAsClinic}
          onChange={(e) =>
            handleChange("billingAddressSameAsClinic", e.target.checked)
          }
          className="w-4 h-4 text-[#6eb5d8] border-gray-300 rounded focus:ring-[#6eb5d8]"
        />
        <label
          htmlFor="billingAddressSameAsClinic"
          className="text-sm text-gray-700 cursor-pointer"
        >
          O endereço de faturamento é o mesmo do consultório
        </label>
      </div>

      {!localData.billingAddressSameAsClinic && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-sm text-gray-700 mb-2">
            Endereço de faturamento
          </label>
          <input
            type="text"
            value={localData.billingAddress}
            onChange={(e) => handleChange("billingAddress", e.target.value)}
            placeholder="Ex: Av. Paulista, 1000 - Bela Vista, São Paulo - SP"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>
      )}

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
    </div>
  );
}
