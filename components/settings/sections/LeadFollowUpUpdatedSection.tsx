import { Zap, Plus, Edit2, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/use-settings";
import { LeadFollowUpMessage } from "@/types/settings";

export function LeadFollowUpUpdatedSection() {
  const { settings, loading, error, updateSettings } = useSettings();

  const [messages, setMessages] = useState<LeadFollowUpMessage[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState<LeadFollowUpMessage>({
    title: "",
    hour: 0,
    message: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  // Sync with settings when loaded
  useEffect(() => {
    if (settings?.leadFollowUpInfo?.leadFollowUpMessages) {
      setMessages(settings.leadFollowUpInfo.leadFollowUpMessages);
    }
  }, [settings]);

  const persistSettings = (updatedMessages: LeadFollowUpMessage[]) => {
    if (settings) {
      updateSettings({
        ...settings,
        leadFollowUpInfo: {
          leadFollowUpMessages: updatedMessages,
        },
      });
    }
  };

  const handleAdd = () => {
    if (newMessage.title && newMessage.message) {
      const updatedMessages = [...messages, { ...newMessage, id: Date.now() }];
      setMessages(updatedMessages);
      persistSettings(updatedMessages);
      setNewMessage({ title: "", hour: 0, message: "" });
      setIsAdding(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index: number, updatedMsg: LeadFollowUpMessage) => {
    const updatedMessages = messages.map((m, i) =>
      i === index ? updatedMsg : m,
    );
    setMessages(updatedMessages);
    persistSettings(updatedMessages);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    if (confirm("Tem certeza que deseja excluir esta mensagem de follow-up?")) {
      const updatedMessages = messages.filter((_, i) => i !== index);
      setMessages(updatedMessages);
      persistSettings(updatedMessages);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setIsAdding(false);
    setNewMessage({ title: "", hour: 0, message: "" });
  };

  if (loading)
    return <div className="p-4 text-center">Carregando configurações...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">Erro: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[#1e3a5f] flex items-center gap-2 font-semibold">
              <Zap className="w-5 h-5 text-orange-500" />
              Mensagens de Aquecimento para Leads
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Crie mensagens personalizadas para converter leads em pacientes
            </p>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Adicionar Mensagem
            </button>
          )}
        </div>

        <div className="space-y-3">
          {/* Add Form */}
          {isAdding && (
            <div className="bg-white border-2 border-orange-400 rounded-lg p-4 space-y-3 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título da mensagem
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Primeiro follow-up"
                    value={newMessage.title}
                    onChange={(e) =>
                      setNewMessage({
                        ...newMessage,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enviar após (horas)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 24"
                    min="0"
                    value={newMessage.hour}
                    onChange={(e) =>
                      setNewMessage({
                        ...newMessage,
                        hour: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem personalizada
                </label>
                <textarea
                  rows={3}
                  placeholder="Digite sua mensagem de follow-up aqui..."
                  value={newMessage.message}
                  onChange={(e) =>
                    setNewMessage({
                      ...newMessage,
                      message: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
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
                  disabled={!newMessage.title || !newMessage.message}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium disabled:opacity-50"
                >
                  Salvar
                </button>
              </div>
            </div>
          )}

          {/* Messages List */}
          {messages.length === 0 && !isAdding ? (
            <div className="text-center py-8 text-gray-500 bg-white/50 rounded-lg border border-dashed border-gray-300">
              <p>Nenhuma mensagem cadastrada.</p>
              <p className="text-sm mt-1">
                Clique em "Adicionar Mensagem" para criar a primeira.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className="bg-white border border-orange-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {editingIndex === index ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Título da mensagem
                        </label>
                        <input
                          type="text"
                          defaultValue={msg.title}
                          id={`edit-title-${index}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Enviar após (horas)
                        </label>
                        <input
                          type="number"
                          defaultValue={msg.hour}
                          min="0"
                          id={`edit-hour-${index}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mensagem personalizada
                      </label>
                      <textarea
                        rows={3}
                        defaultValue={msg.message}
                        id={`edit-message-${index}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
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
                          const title = (
                            document.getElementById(
                              `edit-title-${index}`,
                            ) as HTMLInputElement
                          ).value;
                          const hour =
                            parseInt(
                              (
                                document.getElementById(
                                  `edit-hour-${index}`,
                                ) as HTMLInputElement
                              ).value,
                            ) || 0;
                          const messageText = (
                            document.getElementById(
                              `edit-message-${index}`,
                            ) as HTMLTextAreaElement
                          ).value;
                          handleSaveEdit(index, {
                            ...msg,
                            title,
                            hour,
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
                        <Zap className="w-4 h-4 text-orange-500" />
                        <h4 className="text-sm font-bold text-[#1e3a5f]">
                          {msg.title}
                        </h4>
                        <div className="px-3 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 rounded-full text-xs font-bold border border-orange-300">
                          ⏰ {msg.hour}h{" "}
                          {msg.hour === 0 ? "(Imediato)" : "depois"}
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

        <div className="mt-4 p-3 bg-white/80 rounded-lg border border-orange-200">
          <p className="text-xs text-gray-600 italic">
            <strong>💡 Dica:</strong> Crie uma sequência de mensagens para
            aquecer seus leads. Exemplo: 0h (imediata), 24h depois, 48h depois,
            72h depois. Seja empático e focado em ajudar o paciente a dar o
            próximo passo.
          </p>
        </div>
      </div>
    </div>
  );
}
