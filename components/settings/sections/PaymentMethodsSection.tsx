import { useState, useEffect } from "react";
import { useUser } from "@/components/auth/user-context";
import { PaymentMethods } from "@/types/settings";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import CurrencyMaskedInput from "@/components/core/CurrencyInput";

export function PaymentMethodsSection() {
  const { dbUser, updateSettings } = useUser();
  if (!dbUser) {
    return <></>;
  }

  const defaultPaymentMethods: PaymentMethods = {
    onlineConsultationPrice: "",
    inPersonConsultationPrice: "",
    firstOnlineConsultationPrice: "",
    firstInPersonConsultationPrice: "",
    requiresDeposit: false,
    acceptedMethods: ["PIX", "Cartão de crédito"],
  };

  const data = dbUser?.settings?.paymentMethods || defaultPaymentMethods;

  const [localData, setLocalData] = useState<PaymentMethods>(data);

  useEffect(() => {
    if (dbUser?.settings?.paymentMethods) {
      setLocalData(dbUser.settings.paymentMethods);
    }
  }, [dbUser?.settings?.paymentMethods]);

  const debouncedUpdate = useDebouncedCallback(
    (updatedData: PaymentMethods) => {
      updateSettings({
        paymentMethods: updatedData,
      });
    },
    1000,
  );

  if (!localData) return null;

  const handleChange = (field: keyof PaymentMethods, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    debouncedUpdate(newData);
  };

  const toggleMethod = (method: string) => {
    const currentMethods = localData.acceptedMethods || [];
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter((m) => m !== method)
      : [...currentMethods, method];
    handleChange("acceptedMethods", newMethods);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Valor da consulta online
          </label>
          <CurrencyMaskedInput
            name="onlineConsultationPrice"
            value={+localData?.onlineConsultationPrice?.toString() || 0}
            onChange={(value) => {
              handleChange("onlineConsultationPrice", value);
            }}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Valor da consulta presencial
          </label>
          <CurrencyMaskedInput
            name="inPersonConsultationPrice"
            value={+localData?.inPersonConsultationPrice?.toString() || 0}
            onChange={(value) => {
              handleChange("inPersonConsultationPrice", value);
            }}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Valor da primeira consulta online
          </label>
          <CurrencyMaskedInput
            name="firstOnlineConsultationPrice"
            value={
              localData?.firstOnlineConsultationPrice
                ? +localData.firstOnlineConsultationPrice
                : 0
            }
            onChange={(value) => {
              handleChange("firstOnlineConsultationPrice", value);
            }}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Valor da primeira consulta presencial
          </label>
          <CurrencyMaskedInput
            name="firstInPersonConsultationPrice"
            value={
              localData?.firstInPersonConsultationPrice
                ? +localData.firstInPersonConsultationPrice
                : 0
            }
            onChange={(value) => {
              handleChange("firstInPersonConsultationPrice", value);
            }}
          />
        </div>
      </div>

      <div className="border border-[#e5ecf3] rounded-lg p-5 bg-[#f4f8fb]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[#1e3a5f] font-medium text-[15px]">
              Pratica valor de entrada (caução)?
            </h3>
            <p className="text-[13px] text-gray-500 mt-1">
              Solicitar pagamento de entrada ao agendar
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localData.requiresDeposit || false}
              onChange={(e) =>
                handleChange("requiresDeposit", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6eb5d8]"></div>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-3">
          Forma de pagamento aceita
        </label>
        <div className="space-y-2">
          {[
            "PIX",
            "Cartão de crédito",
            "Cartão de débito",
            "Link de pagamento externo",
          ].map((forma) => (
            <label
              key={forma}
              className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(localData.acceptedMethods || []).includes(forma)}
                onChange={() => toggleMethod(forma)}
                className="text-[#6eb5d8]"
              />
              <span className="text-sm">{forma}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
