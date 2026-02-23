import { useState, useEffect, useRef } from "react";
import { useUser } from "@/components/auth/user-context";
import { BasicInfo, Settings } from "@/types/settings";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { useStorage } from "@/hooks/use-storage";
import { maskPhone, ufs } from "@/utils";

export function BasicInfoSection() {
  const { dbUser, updateSettings, updateUser } = useUser();
  const { upload, loading, error } = useStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!dbUser) {
    return <></>;
  }

  const baseSettings: BasicInfo = {
    fullName: dbUser.name || dbUser.displayName || "",
    displayName: dbUser.displayName || "",
    personalPhoneNumber: dbUser.personalPhoneNumber || "",
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
    const finalValue =
      field === "personalPhoneNumber" ? maskPhone(value) : value;
    const newData = {
      ...localData,
      [field]: finalValue,
    };
    setLocalData(newData);
    debouncedUpdate(newData);

    // Sync with user document if displayName or personalPhoneNumber changes
    if (field === "displayName" || field === "personalPhoneNumber") {
      updateUser({
        [field]: value,
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const key = await upload(file, "uploads/profile-pictures/");
      // Construct the proxy URL
      const proxyUrl = `/api/storage?key=${key}&redirect=true`;

      handleChange("profilePicture", proxyUrl);

      // Also update the top-level user photoURL for the header
      updateUser({
        photoURL: proxyUrl,
      });
    } catch (err) {
      console.error("Failed to upload profile picture", err);
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
            Telemóvel / WhatsApp *
          </label>
          <input
            type="tel"
            value={localData.personalPhoneNumber}
            onChange={(e) =>
              handleChange("personalPhoneNumber", e.target.value)
            }
            placeholder="Ex: (11) 98765-4321"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <option value="">Selecione</option>
            {ufs.map((uf) => (
              <option key={uf.id_uf} value={uf.sigla}>
                {uf.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Foto profissional
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors relative"
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <span className="text-sm text-gray-500">Enviando...</span>
            </div>
          ) : null}

          {localData.profilePicture ? (
            <div className="flex flex-col items-center">
              <img
                src={localData.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-2 border-2 border-gray-200"
              />
              <p className="text-sm text-blue-600">Alterar foto</p>
            </div>
          ) : (
            <>
              <p className="text-gray-500">Clique para selecionar uma imagem</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG até 5MB</p>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={handleFileChange}
          />
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
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
