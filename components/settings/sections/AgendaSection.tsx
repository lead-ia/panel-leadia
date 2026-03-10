import { useState, useEffect } from "react";
import { useUser } from "@/components/auth/user-context";
import { Availability, Settings, Block } from "@/types/settings";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { Trash2, Plus, AlertCircle, Calendar, Clock } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { getDurationString } from "@/lib/utils/date-utils";

export function AgendaSection() {
  const { dbUser, updateSettings } = useUser();
  if (!dbUser) {
    return <></>;
  }

  const defaultAvailability: Availability = {
    services: ["Consulta presencial", "Consulta online"],
    online: {
      days: ["Seg", "Ter", "Qua", "Qui", "Sex"],
      startTime: "08:00",
      endTime: "18:00",
      interval: "45 minutos",
      duration: "45 minutos",
      futureSchedulingDays: 30,
    },
    inPerson: {
      days: ["Seg", "Ter", "Qua", "Qui", "Sex"],
      startTime: "08:00",
      endTime: "18:00",
      interval: "60 minutos",
      duration: "60 minutos",
      futureSchedulingDays: 30,
    },
    blocks: [],
  };

  const data = dbUser?.settings?.availability || defaultAvailability;

  const [localData, setLocalData] = useState<Availability>(data);
  const [newBlock, setNewBlock] = useState<{
    start: string;
    end: string;
    reason: string;
  }>({
    start: "",
    end: "",
    reason: "",
  });
  const [blockError, setBlockError] = useState<string>("");

  useEffect(() => {
    if (dbUser?.settings?.availability) {
      setLocalData(dbUser.settings.availability);
    }
  }, [dbUser?.settings?.availability]);

  const debouncedUpdate = useDebouncedCallback((updatedData: Availability) => {
    updateSettings({
      availability: updatedData,
    });
  }, 1000);

  if (!localData) return null;

  const handleChange = (field: keyof Availability, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    debouncedUpdate(newData);
  };

  const handleOnlineChange = (
    field: keyof Availability["online"],
    value: any,
  ) => {
    const newData = {
      ...localData,
      online: { ...localData.online, [field]: value },
    };
    setLocalData(newData);
    debouncedUpdate(newData);
  };

  const handleInPersonChange = (
    field: keyof Availability["inPerson"],
    value: any,
  ) => {
    const newData = {
      ...localData,
      inPerson: { ...localData.inPerson, [field]: value },
    };
    setLocalData(newData);
    debouncedUpdate(newData);
  };

  const toggleService = (service: string) => {
    const currentServices = localData.services || [];
    const newServices = currentServices.includes(service)
      ? currentServices.filter((s) => s !== service)
      : [...currentServices, service];
    handleChange("services", newServices);
  };

  const toggleDay = (type: "online" | "inPerson", day: string) => {
    const currentDays = localData[type].days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    if (type === "online") {
      handleOnlineChange("days", newDays);
    } else {
      handleInPersonChange("days", newDays);
    }
  };

  const addBlock = () => {
    if (!newBlock.start || !newBlock.end) {
      setBlockError("As datas de início e fim são obrigatórias.");
      return;
    }

    if (new Date(newBlock.end) <= new Date(newBlock.start)) {
      setBlockError("A data de término deve ser posterior à data de início.");
      return;
    }

    const block: Block = {
      id: uuidv4(),
      start: newBlock.start,
      end: newBlock.end,
      reason: newBlock.reason,
    };

    const updatedBlocks = [...(localData.blocks || []), block];
    handleChange("blocks", updatedBlocks);
    setNewBlock({ start: "", end: "", reason: "" });
    setBlockError("");
  };

  const removeBlock = (id: string) => {
    const updatedBlocks = localData.blocks.filter((b) => b.id !== id);
    handleChange("blocks", updatedBlocks);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-700 mb-3">
          Tipos de serviço oferecidos
        </label>
        <div className="space-y-2">
          {["Consulta presencial", "Consulta online"].map((servico) => (
            <label
              key={servico}
              className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localData.services?.includes(servico)}
                onChange={() => toggleService(servico)}
                className="text-[#6eb5d8]"
              />
              <span className="text-sm">{servico}</span>
            </label>
          ))}
        </div>
      </div>

      {localData.services?.includes("Consulta online") && (
        <div className="border-t border-gray-200 pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="text-gray-800 mb-4">
            Disponibilidade semanal - Consulta Online
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Dias disponíveis
              </label>
              <div className="flex gap-2">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(
                  (dia) => (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => toggleDay("online", dia)}
                      className={`flex-1 p-3 text-center border rounded-lg cursor-pointer transition-all ${
                        localData.online.days.includes(dia)
                          ? "bg-[#6eb5d8] text-white border-[#6eb5d8]"
                          : "border-gray-300 hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      {dia}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Horário de início
                </label>
                <input
                  type="time"
                  value={localData.online.startTime}
                  onChange={(e) =>
                    handleOnlineChange("startTime", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Horário de término
                </label>
                <input
                  type="time"
                  value={localData.online.endTime}
                  onChange={(e) =>
                    handleOnlineChange("endTime", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Tempo padrão da consulta
                </label>
                <select
                  value={localData.online.duration || "45 minutos"}
                  onChange={(e) =>
                    handleOnlineChange("duration", e.target.value)
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
                  Intervalo entre consultas
                </label>
                <select
                  value={localData.online.interval}
                  onChange={(e) =>
                    handleOnlineChange("interval", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
                >
                  <option>0 minutos</option>
                  <option>15 minutos</option>
                  <option>30 minutos</option>
                  <option>45 minutos</option>
                  <option>60 minutos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Virada de agenda (dias à frente)
                </label>
                <input
                  type="number"
                  value={localData.online.futureSchedulingDays}
                  onChange={(e) =>
                    handleOnlineChange(
                      "futureSchedulingDays",
                      parseInt(e.target.value),
                    )
                  }
                  min="1"
                  max="90"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {localData.services?.includes("Consulta presencial") && (
        <div className="border-t border-gray-200 pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="text-gray-800 mb-4">
            Disponibilidade semanal - Consulta Presencial
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Dias disponíveis
              </label>
              <div className="flex gap-2">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(
                  (dia) => (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => toggleDay("inPerson", dia)}
                      className={`flex-1 p-3 text-center border rounded-lg cursor-pointer transition-all ${
                        localData.inPerson.days.includes(dia)
                          ? "bg-[#6eb5d8] text-white border-[#6eb5d8]"
                          : "border-gray-300 hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      {dia}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Horário de início
                </label>
                <input
                  type="time"
                  value={localData.inPerson.startTime}
                  onChange={(e) =>
                    handleInPersonChange("startTime", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Horário de término
                </label>
                <input
                  type="time"
                  value={localData.inPerson.endTime}
                  onChange={(e) =>
                    handleInPersonChange("endTime", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Tempo padrão da consulta
                </label>
                <select
                  value={localData.inPerson.duration || "60 minutos"}
                  onChange={(e) =>
                    handleInPersonChange("duration", e.target.value)
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
                  Intervalo entre consultas
                </label>
                <select
                  value={localData.inPerson.interval}
                  onChange={(e) =>
                    handleInPersonChange("interval", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
                >
                  <option>0 minutos</option>
                  <option>15 minutos</option>
                  <option>30 minutos</option>
                  <option>45 minutos</option>
                  <option>60 minutos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Virada de agenda (dias à frente)
                </label>
                <input
                  type="number"
                  value={localData.inPerson.futureSchedulingDays}
                  onChange={(e) =>
                    handleInPersonChange(
                      "futureSchedulingDays",
                      parseInt(e.target.value),
                    )
                  }
                  min="1"
                  max="90"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-gray-800 mb-4">Bloqueios</h3>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                  Início do bloqueio
                </label>
                <input
                  type="datetime-local"
                  value={newBlock.start}
                  onChange={(e) =>
                    setNewBlock((prev) => ({ ...prev, start: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#6eb5d8]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                  Fim do bloqueio
                </label>
                <input
                  type="datetime-local"
                  value={newBlock.end}
                  min={newBlock.start}
                  onChange={(e) =>
                    setNewBlock((prev) => ({ ...prev, end: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#6eb5d8]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                Motivo (opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Feriado municipal, Viagem, Congresso..."
                value={newBlock.reason}
                onChange={(e) =>
                  setNewBlock((prev) => ({ ...prev, reason: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#6eb5d8]"
              />
            </div>

            {blockError && (
              <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                <AlertCircle className="w-4 h-4" />
                <span>{blockError}</span>
              </div>
            )}

            <button
              onClick={addBlock}
              className="flex items-center justify-center gap-2 w-full py-2 bg-[#6eb5d8] text-white rounded-md text-sm font-medium hover:bg-[#5da7c9] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Adicionar bloqueio
            </button>
          </div>

          <div className="space-y-3">
            {localData.blocks?.map((block) => {
              const duration = getDurationString(block.start, block.end);
              return (
                <div
                  key={block.id}
                  className="group relative bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#6eb5d8]"></div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 group-hover:text-[#1e3a5f] transition-colors">
                          {block.reason || "Bloqueio de agenda"}
                        </h4>
                        {duration && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#6eb5d8] px-2 py-1 rounded-full border border-blue-100">
                            {duration}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" /> Início
                          </span>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">
                              {new Date(block.start).toLocaleDateString(
                                "pt-BR",
                                { day: "2-digit", month: "short" },
                              )}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(block.start).toLocaleTimeString(
                                "pt-BR",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1 border-l border-gray-100 pl-4">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" /> Fim
                          </span>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">
                              {new Date(block.end).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(block.end).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeBlock(block.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all self-center"
                      title="Remover bloqueio"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {(!localData.blocks || localData.blocks.length === 0) && (
              <p className="text-center text-sm text-gray-400 py-4 italic">
                Nenhum bloqueio configurado.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
