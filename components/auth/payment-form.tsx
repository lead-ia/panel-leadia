"use client";

import type React from "react";

/**
 * Defines the shape of the payment form data.
 */
interface PaymentFormData {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholderName: string;
}

/**
 * Defines the shape of the form errors.
 * Each key corresponds to a field in PaymentFormData.
 */
interface PaymentFormErrors {
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  cardholderName?: string;
}

/**
 * Defines the props for the PaymentForm component.
 */
interface PaymentFormProps {
  formData: PaymentFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formErrors?: PaymentFormErrors;
}

export function PaymentForm({ formData, handleChange, formErrors = {} }: PaymentFormProps) {
  return (
    <div className="pt-4 border-t border-border" >
      <h3 className="text-sm font-semibold text-foreground mb-4">Informações de pagamento</h3>

      {/* Card Number */}
      <div className="mb-4">
        <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground mb-2">Número do cartão</label>
        <div className="relative">
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V5a3 3 0 00-3-3H5a3 3 0 00-3 3v10a3 3 0 003 3z"
            />
          </svg>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            placeholder="0000 0000 0000 0000"
            value={formData.cardNumber}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            maxLength={19}
            required
          />
        </div>
        {formErrors.cardNumber && <p className="text-sm text-destructive mt-1">{formErrors.cardNumber}</p>}
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="expiry" className="block text-sm font-medium text-foreground mb-2">Data de validade</label>
          <div className="relative">
            <svg
              className="absolute left-3 top-3 w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <input
              id="expiry"
              name="expiry"
              type="text"
              placeholder="MM/AA"
              value={formData.expiry}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={5}
              required
            />
          </div>
          {formErrors.expiry && <p className="text-sm text-destructive mt-1">{formErrors.expiry}</p>}
        </div>
        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-foreground mb-2">CVV</label>
          <div className="relative">
            <svg
              className="absolute left-3 top-3 w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <input
              id="cvv"
              name="cvv"
              type="text"
              placeholder="123"
              value={formData.cvv}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={4}
              required
            />
          </div>
          {formErrors.cvv && <p className="text-sm text-destructive mt-1">{formErrors.cvv}</p>}
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label htmlFor="cardholderName" className="block text-sm font-medium text-foreground mb-2">Nome do titular do cartão</label>
        <div className="relative">
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <input
            id="cardholderName"
            name="cardholderName"
            type="text"
            placeholder="Nome completo"
            value={formData.cardholderName}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        {formErrors.cardholderName && <p className="text-sm text-destructive mt-1">{formErrors.cardholderName}</p>}
      </div>
    </div>
  );
}