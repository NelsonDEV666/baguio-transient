"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookingSchema } from "@/lib/validations";
import { usePricing } from "@/hooks/usePricing";
import { useAvailability } from "@/hooks/useAvailability";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud, CalendarDays } from "lucide-react";
import { PriceSummary } from "./PriceSummary";
import { PaymentInstructions } from "./PaymentInstructions";
import { CancellationPolicy } from "./CancellationPolicy";
import { BookingCalendar } from "./BookingCalendar";
import { z } from "zod";

type BookingFormData = z.infer<typeof BookingSchema>;

export function BookingForm() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      pax_count: 2,
      payment_receipt_url: "",
      check_in: "",
      check_out: "",
    },
  });

  const checkInDate = watch("check_in");
  const checkOutDate = watch("check_out");
  const paxCount = watch("pax_count");
  const receiptUrl = watch("payment_receipt_url");

  const { availability, isLoading: isAvailabilityLoading } = useAvailability();
  const { breakdown, isLoading: isPricing } = usePricing(checkInDate, checkOutDate, paxCount);

  const handleDateSelection = (checkIn: string, checkOut: string) => {
    setValue("check_in", checkIn, { shouldValidate: true });
    setValue("check_out", checkOut, { shouldValidate: true });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setValue("payment_receipt_url", data.url, { shouldValidate: true });
      toast.success("Receipt uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true);
      
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.error?.message || "Failed to submit booking");

      toast.success("Booking submitted successfully!");
      router.push("/booking-success");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = "w-full rounded-lg border border-gray-300 bg-white p-3 text-sm font-medium text-gray-950 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400";

  if (!mounted) {
    return (
      <div className="space-y-6 py-4 animate-pulse">
        <div className="h-12 bg-gray-100 rounded-xl w-full" />
        <div className="h-40 bg-gray-100 rounded-xl w-full" />
        <div className="h-12 bg-gray-100 rounded-xl w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto bg-white">
      
      {/* 1. Guest Information */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Guest Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <input { ...register("guest_name") } type="text" className={inputStyles} placeholder="Juan dela Cruz" />
            {errors.guest_name && <p className="text-red-500 text-xs mt-1">{errors.guest_name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <input { ...register("guest_email") } type="email" className={inputStyles} placeholder="juan@example.com" />
            {errors.guest_email && <p className="text-red-500 text-xs mt-1">{errors.guest_email.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
            <input { ...register("guest_phone") } type="tel" className={inputStyles} placeholder="0917 123 4567" />
            {errors.guest_phone && <p className="text-red-500 text-xs mt-1">{errors.guest_phone.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Number of Guests (Pax)</label>
            <input { ...register("pax_count", { valueAsNumber: true }) } type="number" min="1" max="20" className={inputStyles} />
            {errors.pax_count && <p className="text-red-500 text-xs mt-1">{errors.pax_count.message}</p>}
          </div>
        </div>
      </section>

      {/* 2. Stay Dates (Interactive Calendar Grid) */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Select Stay Dates</h2>
        
        {isAvailabilityLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse py-4 justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" /> Synchronization calendar schedule streams...
          </div>
        ) : (
          <BookingCalendar
            unavailableDates={availability.unavailableDates}
            pendingDates={availability.pendingDates}
            confirmedDates={availability.confirmedDates}
            blockedDates={availability.blockedDates}
            selectedCheckIn={checkInDate}
            selectedCheckOut={checkOutDate}
            onSelectDates={handleDateSelection}
          />
        )}

        {/* Selected Dates Display Metrics */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-gray-50 rounded-xl border p-3">
            <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Check-In Date</span>
            <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mt-1">
              <CalendarDays className="w-4 h-4 text-blue-500" /> {checkInDate || "Click calendar above"}
            </span>
          </div>
          <div className="bg-gray-50 rounded-xl border p-3">
            <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Check-Out Date</span>
            <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mt-1">
              <CalendarDays className="w-4 h-4 text-blue-500" /> {checkOutDate || "Click calendar above"}
            </span>
          </div>
        </div>
        {(errors.check_in || errors.check_out) && (
          <p className="text-red-500 text-xs font-semibold mt-1">Please select both checking targets on the calendar range matrix.</p>
        )}
      </section>

      {/* 3. Dynamic Pricing Summary */}
      {isPricing && (
        <div className="text-sm text-gray-600 flex items-center gap-2 font-medium bg-gray-50 p-3 rounded-lg border">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" /> Computing current seasonal rates...
        </div>
      )}
      
      {breakdown && (
        <div className="space-y-6">
          <PriceSummary breakdown={breakdown} paxCount={paxCount} />
          
          {/* 4. Payment & Upload Section */}
          <section className="space-y-4 border-t pt-6">
            <PaymentInstructions />
            
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-700 mb-2">Upload Payment Receipt</label>
              <div className="flex items-center justify-center w-full">
                <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-100/70 transition-colors ${receiptUrl ? 'border-emerald-400 bg-emerald-50/50' : 'border-gray-300'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    {isUploading ? (
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
                    ) : receiptUrl ? (
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                        <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      </div>
                    ) : (
                      <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                    )}
                    <p className="text-sm text-gray-700">
                      {isUploading ? "Uploading transaction receipt..." : receiptUrl ? <span className="text-emerald-700 font-bold">Receipt Attached Successfully</span> : <><span className="font-bold text-blue-600">Click to upload image</span> or drag and drop</>}
                    </p>
                    {!receiptUrl && <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP (Max 10MB)</p>}
                  </div>
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileUpload} disabled={isUploading} />
                </label>
              </div>
              {errors.payment_receipt_url && <p className="text-red-500 text-xs mt-1 font-medium">Please upload your payment receipt screenshot to complete submission.</p>}
            </div>
          </section>
        </div>
      )}

      {/* 5. Special Requests & Policy */}
      <section className="space-y-4 border-t pt-6">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Special Requests (Optional)</label>
          <textarea { ...register("special_requests") } rows={3} className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm font-medium text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Let us know if you have any special needs..." />
        </div>
        <CancellationPolicy />
      </section>

      {/* Submit Action */}
      <button
        type="submit"
        disabled={isSubmitting || !breakdown}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-base"
      >
        {isSubmitting ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Verifying Transaction & Saving...</>
        ) : (
          "Confirm Booking Request"
        )}
      </button>

    </form>
  );
}