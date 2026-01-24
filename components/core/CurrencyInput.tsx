import React from "react";
import { CurrencyInput } from "react-currency-mask";

interface CurrencyMaskedInputProps {
  name?: string;
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}

const CurrencyMaskedInput = ({
  name,
  value,
  onChange,
  placeholder = "R$ 0,00",
  className = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8]",
}: CurrencyMaskedInputProps) => {
  return (
    <CurrencyInput
      value={value}
      onChangeValue={(_, originalValue) => {
        // originalValue is the numeric value
        onChange(Number(originalValue));
      }}
      InputElement={
        <input name={name} placeholder={placeholder} className={className} />
      }
    />
  );
};

export default CurrencyMaskedInput;
