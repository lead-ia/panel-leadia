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
                checked={localData.acceptedMethods.includes(forma)}
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
