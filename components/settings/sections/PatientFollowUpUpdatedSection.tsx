import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/use-settings";
import { PatientFollowUpMessage } from "@/types/settings";
import { Plus, Edit2, Trash2 } from "lucide-react";

export function PatientFollowUpUpdatedSection() {
  const { settings, loading, error, updateSettings } = useSettings();

  const [commemorativeMessages, setCommemorativeMessages] = useState<
    PatientFollowUpMessage[]
  >([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newCommemorativeMessage, setNewCommemorativeMessage] =
    useState<PatientFollowUpMessage>({
      date: "",
      message: "",
    });
  const [isAdding, setIsAdding] = useState(false);
  const [periodicEnabled, setPeriodicEnabled] = useState(false);
  const [periodicMessage, setPeriodicMessage] = useState("");

  // Sync with settings when loaded
  useEffect(() => {
    if (settings?.patientFollowUpInfo) {
      setCommemorativeMessages(
        settings.patientFollowUpInfo.commemorativeMessages || [],
      );
      setPeriodicEnabled(settings.patientFollowUpInfo.enabled || false);
      setPeriodicMessage(settings.patientFollowUpInfo.periodicMessage || "");
    }
  }, [settings]);

  const persistSettings = (overrides: any = {}) => {
    if (settings) {
      updateSettings({
        ...settings,
        patientFollowUpInfo: {
          enabled:
            overrides.enabled !== undefined
              ? overrides.enabled
              : periodicEnabled,
          periodicMessage:
            overrides.periodicMessage !== undefined
              ? overrides.periodicMessage
              : periodicMessage,
          commemorativeMessages:
            overrides.commemorativeMessages !== undefined
              ? overrides.commemorativeMessages
              : commemorativeMessages,
        },
      });
    }
  };

  const handleAdd = () => {
    if (newCommemorativeMessage.date && newCommemorativeMessage.message) {
      const updatedMessages = [
        ...commemorativeMessages,
        { ...newCommemorativeMessage, id: Date.now() },
      ];
      setCommemorativeMessages(updatedMessages);
      persistSettings({ commemorativeMessages: updatedMessages });
      setNewCommemorativeMessage({ date: "", message: "" });
      setIsAdding(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (
    index: number,
    updatedMsg: PatientFollowUpMessage,
  ) => {
    const updatedMessages = commemorativeMessages.map((m, i) =>
      i === index ? updatedMsg : m,
    );
    setCommemorativeMessages(updatedMessages);
    persistSettings({ commemorativeMessages: updatedMessages });
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    if (confirm("Tem certeza que deseja excluir este lembrete?")) {
      const updatedMessages = commemorativeMessages.filter(
        (_, i) => i !== index,
      );
      setCommemorativeMessages(updatedMessages);
      persistSettings({ commemorativeMessages: updatedMessages });
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setIsAdding(false);
    setNewCommemorativeMessage({ date: "", message: "" });
  };

  const handleTogglePeriodic = (enabled: boolean) => {
    setPeriodicEnabled(enabled);
    persistSettings({ enabled });
  };

  const handlePeriodicMessageChange = (msg: string) => {
    setPeriodicMessage(msg);
  };

  const handlePeriodicMessageBlur = () => {
    persistSettings({ periodicMessage });
  };

  if (loading)
    return <div className="p-4 text-center">Carregando configurações...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">Erro: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-5 bg-purple-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[#1e3a5f] font-semibold">
              Relembrar paciente para próxima consulta
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Enviar lembrete automático periodicamente
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={periodicEnabled}
              onChange={(e) => handleTogglePeriodic(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6eb5d8]"></div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensagem personalizada
          </label>
          <textarea
            rows={4}
            value={periodicMessage}
            onChange={(e) => handlePeriodicMessageChange(e.target.value)}
            onBlur={handlePeriodicMessageBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use [NOME] para inserir o nome do paciente
          </p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-5 bg-blue-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[#1e3a5f] font-semibold">
              Lembretes Comemorativos
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Crie mensagens personalizadas para datas especiais
            </p>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-[#6eb5d8] text-white rounded-lg hover:bg-[#1e3a5f] transition-all flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Adicionar Lembrete
            </button>
          )}
        </div>

        <div className="space-y-3">
          {/* Add Form */}
          {isAdding && (
            <div className="bg-white border-2 border-[#6eb5d8] rounded-lg p-4 space-y-3 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data (DD/MM)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 25/12"
                    value={newCommemorativeMessage.date}
                    onChange={(e) =>
                      setNewCommemorativeMessage({
                        ...newCommemorativeMessage,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem personalizada
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Feliz aniversário! Desejamos muita saúde! 🎂"
                    value={newCommemorativeMessage.message}
                    onChange={(e) =>
                      setNewCommemorativeMessage({
                        ...newCommemorativeMessage,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdd}
                  disabled={
                    !newCommemorativeMessage.date ||
                    !newCommemorativeMessage.message
                  }
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm font-medium disabled:opacity-50"
                >
                  Salvar
                </button>
              </div>
            </div>
          )}

          {/* Messages List */}
          {commemorativeMessages.length === 0 && !isAdding ? (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
              <p>Nenhum lembrete cadastrado.</p>
              <p className="text-sm mt-1">
                Clique em "Adicionar Lembrete" para criar o primeiro.
              </p>
            </div>
          ) : (
            commemorativeMessages.map((msg, index) => (
              <div
                key={msg.id || index}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {editingIndex === index ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data (DD/MM)
                        </label>
                        <input
                          type="text"
                          defaultValue={msg.date}
                          id={`edit-date-${index}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mensagem personalizada
                        </label>
                        <input
                          type="text"
                          defaultValue={msg.message}
                          id={`edit-message-${index}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          const date = (
                            document.getElementById(
                              `edit-date-${index}`,
                            ) as HTMLInputElement
                          ).value;
                          const messageText = (
                            document.getElementById(
                              `edit-message-${index}`,
                            ) as HTMLInputElement
                          ).value;
                          handleSaveEdit(index, {
                            ...msg,
                            date,
                            message: messageText,
                          });
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm font-medium"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 bg-[#6eb5d8] text-white rounded-full text-xs font-bold shadow-sm">
                          {msg.date}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{msg.message}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(index)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
