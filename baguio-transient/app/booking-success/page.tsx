import React from "react";
import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { PROPERTY } from "@/lib/config/property";

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center space-y-6">
        
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-50" />
            <CheckCircle className="w-20 h-20 text-emerald-500 relative z-10 bg-white rounded-full" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Booking Request Sent!</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Thank you for choosing {PROPERTY.name}. We have received your details and payment receipt. 
            Our administration team is currently verifying the transaction.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-xs text-blue-800 space-y-2 list-disc list-inside">
            <li>We will audit your attached transaction screenshot.</li>
            <li>You will receive a confirmation message once approved.</li>
            <li>Your selected dates will be permanently locked on our calendar.</li>
          </ul>
        </div>

        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mt-4"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
}