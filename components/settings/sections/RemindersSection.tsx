import { useState, useEffect } from "react";
import { useUser } from "@/components/auth/user-context";
import { ReminderInfo, Settings } from "@/types/settings";
import { useDebouncedCallback } from "@/hooks/use-debounce";

export function RemindersSection() {
  const { dbUser, updateSettings } = useUser();
  if (!dbUser) {
    return <></>;
  }

  const defaultReminderInfo: ReminderInfo = {
    autoReminder24h: {
      enabled: true,
      message:
        "Olá! Lembrete de sua consulta amanhã às [HORA]. Por favor, confirme sua presença.",
    },
    autoConfirmationDay: {
      enabled: true,
    },
  };

  const data = dbUser?.settings?.reminderInfo || defaultReminderInfo;

  const [localData, setLocalData] = useState<ReminderInfo>(data);

  useEffect(() => {
    if (dbUser?.settings?.reminderInfo) {
      setLocalData(dbUser.settings.reminderInfo);
    }
  }, [dbUser?.settings?.reminderInfo]);

  const debouncedUpdate = useDebouncedCallback((updatedData: ReminderInfo) => {
    updateSettings({
      reminderInfo: updatedData,
    });
  }, 1000);

  if (!localData) return null;

  const handleAutoReminderChange = (field: string, value: any) => {
    const newData = {
      ...localData,
      autoReminder24h: { ...localData.autoReminder24h, [field]: value },
    };
    setLocalData(newData);
    debouncedUpdate(newData);
  };

  const handleAutoConfirmationChange = (field: string, value: any) => {
    const newData = {
      ...localData,
      autoConfirmationDay: { ...localData.autoConfirmationDay, [field]: value },
    };
    setLocalData(newData);
    debouncedUpdate(newData);
  };

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-5 bg-blue-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[#1e3a5f]">Lembrete automático (24h antes)</h3>
            <p className="text-xs text-gray-500 mt-1">
              Enviar lembrete aos pacientes
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localData.autoReminder24h.enabled}
              onChange={(e) =>
                handleAutoReminderChange("enabled", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6eb5d8]"></div>
          </label>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Texto customizável
          </label>
          <textarea
            rows={3}
            value={localData.autoReminder24h.message}
            onChange={(e) =>
              handleAutoReminderChange("message", e.target.value)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-5 bg-green-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[#1e3a5f]">Confirmação automática no dia</h3>
            <p className="text-xs text-gray-500 mt-1">
              Pedir confirmação no dia da consulta
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localData.autoConfirmationDay.enabled}
              onChange={(e) =>
                handleAutoConfirmationChange("enabled", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6eb5d8]"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
