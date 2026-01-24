import { useState, useEffect } from "react";
import { useUser } from "@/components/auth/user-context";
import { Availability, Settings } from "@/types/settings";
import { useDebouncedCallback } from "@/hooks/use-debounce";

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
      futureSchedulingDays: 30,
    },
    inPerson: {
      days: ["Seg", "Ter", "Qua", "Qui", "Sex"],
      startTime: "08:00",
      endTime: "18:00",
      interval: "60 minutos",
      futureSchedulingDays: 30,
    },
  };

  const data = dbUser?.settings?.availability || defaultAvailability;

  const [localData, setLocalData] = useState<Availability>(data);

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
                checked={localData.services.includes(servico)}
                onChange={() => toggleService(servico)}
                className="text-[#6eb5d8]"
              />
              <span className="text-sm">{servico}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-gray-800 mb-4">
          Disponibilidade semanal - Consulta Online
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Dias disponíveis
            </label>
            <div className="flex gap-2">
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia) => (
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
              ))}
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
                onChange={(e) => handleOnlineChange("endTime", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Intervalo entre consultas
              </label>
              <select
                value={localData.online.interval}
                onChange={(e) => handleOnlineChange("interval", e.target.value)}
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

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-gray-800 mb-4">
          Disponibilidade semanal - Consulta Presencial
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Dias disponíveis
            </label>
            <div className="flex gap-2">
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia) => (
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
              ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-gray-800 mb-4">Bloqueios</h3>
        <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#6eb5d8] hover:text-[#6eb5d8] transition-all">
          + Adicionar bloqueio (feriados, viagens, etc.)
        </button>
      </div>
    </div>
  );
}
