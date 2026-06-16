import React from "react";
import { PROPERTY } from "@/lib/config/property";

export function PaymentInstructions() {
  const { gcash, bankTransfer } = PROPERTY.paymentInstructions;

  return (
    <div className="w-full rounded-xl border border-blue-100 bg-blue-50/60 p-5 text-sm text-blue-900 shadow-sm">
      <h3 className="text-base font-bold text-blue-950 mb-3 flex items-center gap-2">
        📥 Payment Instructions
      </h3>
      <p className="mb-4 text-blue-800 leading-relaxed">
        Please settle your <strong>{PROPERTY.reservationFeePercent}% downpayment (Reservation Fee)</strong> to one of our payment accounts below to confirm your staycation hold:
      </p>
      
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-white border border-blue-100 p-3.5 shadow-xs">
          <span className="block text-xs font-bold uppercase tracking-wide text-blue-500 mb-1">GCash Account</span>
          <p className="font-mono text-base font-bold text-gray-900 tracking-wide">{gcash.number}</p>
          <p className="text-xs text-gray-500 mt-0.5">Account Name: {gcash.name}</p>
        </div>

        <div className="rounded-lg bg-white border border-blue-100 p-3.5 shadow-xs">
          <span className="block text-xs font-bold uppercase tracking-wide text-blue-500 mb-1">{bankTransfer.bank} Bank Transfer</span>
          <p className="font-mono text-base font-bold text-gray-900 tracking-wide">{bankTransfer.accountNumber}</p>
          <p className="text-xs text-gray-500 mt-0.5">Account Name: {bankTransfer.accountName}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2 items-start text-xs text-blue-700 leading-tight">
        <span className="text-sm">⚠️</span>
        <p>Please take a clear screenshot or save a photo receipt of your completed transaction. You will need to upload it directly below to route your booking request to our administration desk for prompt validation.</p>
      </div>
    </div>
  );
}