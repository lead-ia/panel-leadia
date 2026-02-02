import { useState, useEffect, useRef } from "react";
import { useUser } from "@/components/auth/user-context";
import { BasicInfo, Settings } from "@/types/settings";
import { useDebouncedCallback } from "@/hooks/use-debounce";

export function BasicInfoSection() {
  const { dbUser, updateSettings, updateUser } = useUser();

  if (!dbUser) {
    return <></>;
  }

  const baseSettings: BasicInfo = {
    fullName: dbUser.name || dbUser.displayName || "",
    displayName: dbUser.displayName || "",
    phoneNumber: dbUser.phoneNumber || "",
    specialty: "",
    subspecialty: "",
    crm: "",
    uf: "",
    bio: "",
  };

  const [localData, setLocalData] = useState<BasicInfo>(
    dbUser?.settings?.basicInfo || baseSettings,
  );

  // Update local state when dbUser changes (initial load or external update)
  useEffect(() => {
    if (dbUser?.settings?.basicInfo) {
      setLocalData(dbUser.settings.basicInfo);
    }
  }, []);

  const debouncedUpdate = useDebouncedCallback((updatedData: BasicInfo) => {
    updateSettings({
      basicInfo: updatedData,
    });
  }, 1000);

  const handleChange = (field: keyof BasicInfo, value: any) => {
    const newData = {
      ...localData,
      [field]: value,
    };
    setLocalData(newData);
    debouncedUpdate(newData);

    // Sync with user document if displayName or phoneNumber changes
    if (field === "displayName" || field === "phoneNumber") {
      updateUser({
        [field]: value,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Nome completo *
          </label>
          <input
            type="text"
            value={localData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Ex: Carolina Santos Silva"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Nome para chamamento *
          </label>
          <input
            type="text"
            value={localData.displayName}
            onChange={(e) => handleChange("displayName", e.target.value)}
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
          <input
            type="text"
            value={localData.specialty}
            onChange={(e) => handleChange("specialty", e.target.value)}
            placeholder="Ex: Cardiologia"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Subespecialidade (opcional)
          </label>
          <input
            type="text"
            value={localData.subspecialty}
            onChange={(e) => handleChange("subspecialty", e.target.value)}
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
            value={localData.crm}
            onChange={(e) => handleChange("crm", e.target.value)}
            placeholder="Ex: 123456"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">UF *</label>
          <select
            value={localData.uf}
            onChange={(e) => handleChange("uf", e.target.value)}
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
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-500">Clique ou arraste uma imagem</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG até 5MB</p>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Mini bio (opcional)
        </label>
        <textarea
          rows={3}
          value={localData.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          placeholder="Ex: Cardiologista com 15 anos de experiência, especializada em arritmias..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
        />
      </div>
    </div>
  );
}
