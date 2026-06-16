import React from "react";
import { PROPERTY } from "@/lib/config/property";

export function CancellationPolicy() {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-500 leading-relaxed">
      <h4 className="font-bold text-gray-700 mb-1.5 uppercase tracking-wider text-[11px]">
        Standard Cancellation & Refund Policy
      </h4>
      <ul className="space-y-1 list-disc list-inside">
        <li>
          Cancel <strong>{PROPERTY.cancellationPolicy.fullRefundDaysBeforeCheckIn} days or more</strong> before check-in date: Eligible for a <span className="text-emerald-600 font-medium">100% full refund</span> of downpayment.
        </li>
        <li>
          Cancel between <strong>{PROPERTY.cancellationPolicy.partialRefundDaysBeforeCheckIn} to {PROPERTY.cancellationPolicy.fullRefundDaysBeforeCheckIn - 1} days</strong> before check-in date: Eligible for a <span className="text-amber-600 font-medium">{PROPERTY.cancellationPolicy.partialRefundPercent}% partial refund</span>.
        </li>
        <li>
          Cancel <strong>less than {PROPERTY.cancellationPolicy.noRefundDaysBeforeCheckIn + 1} days</strong> before check-in or failure to show up: <span className="text-red-600 font-medium">Strictly no refund</span> items apply.
        </li>
      </ul>
      <p className="mt-2 text-[11px] italic text-gray-400">
        *All modification or schedule adjustment requests are subject to room availability and admin review.
      </p>
    </div>
  );
}