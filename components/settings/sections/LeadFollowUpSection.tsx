import { useState, useEffect } from "react";
import { useUser } from "@/components/auth/user-context";
import { PreConsultationInfo, Settings } from "@/types/settings";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { useStorage } from "@/hooks/use-storage";
import { Loader2, Trash2, FileText, Upload } from "lucide-react";

export function LeadFollowUpSection() {
  const { dbUser, updateSettings } = useUser();
  const { upload, loading: uploadLoading, error: uploadError } = useStorage();

  if (!dbUser) {
    return <></>;
  }

  const defaultPreConsultationInfo: PreConsultationInfo = {
    basicGuidance: {
      message: "",
    },
    preConsultationGuidance: {
      message: "",
    },
  };

  const data =
    dbUser?.settings?.preConsultationInfo || defaultPreConsultationInfo;

  const [localData, setLocalData] = useState<PreConsultationInfo>(data);

  useEffect(() => {
    if (dbUser?.settings?.preConsultationInfo) {
      setLocalData(dbUser.settings.preConsultationInfo);
    }
  }, [dbUser?.settings?.preConsultationInfo]);

  const debouncedUpdate = useDebouncedCallback(
    (updatedData: PreConsultationInfo) => {
      updateSettings({
        preConsultationInfo: updatedData,
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Por favor, selecione um arquivo PDF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("O arquivo deve ter no máximo 5MB.");
      return;
    }

    try {
      const fileName = `pre-consultation-${Date.now()}.pdf`;
      const url = await upload(file, `instructions/${fileName}`);
      handlePreConsultationGuidanceChange("pdfUrl", url);
      // Automatically open the PDF after successful upload
      window.open(url, "_blank");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Falha ao fazer upload do arquivo.");
    }
  };

  const removePdf = () => {
    handlePreConsultationGuidanceChange("pdfUrl", "");
  };

  return (
    <div>
      <div className="border border-gray-200 rounded-lg p-5 bg-blue-50">
        <h3 className="text-[#1e3a5f] mb-4">Instruções de pré consulta</h3>
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
          {localData.preConsultationGuidance.pdfUrl ? (
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-blue-50 text-blue-600 rounded">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-gray-700 truncate">
                    Documento anexado
                  </span>
                  <a
                    href={localData.preConsultationGuidance.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-500 hover:underline truncate"
                  >
                    Visualizar PDF
                  </a>
                </div>
              </div>
              <button
                onClick={removePdf}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Remover documento"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#6eb5d8] transition-colors cursor-pointer bg-white group">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                disabled={uploadLoading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex flex-col items-center gap-2">
                {uploadLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 text-[#6eb5d8] animate-spin" />
                    <p className="text-sm text-gray-500">Fazendo upload...</p>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Clique para enviar ou arraste um PDF
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Máximo 5MB</p>
                    </div>
                  </>
                )}
              </div>
              {uploadError && (
                <p className="text-xs text-red-500 mt-2">{uploadError}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
