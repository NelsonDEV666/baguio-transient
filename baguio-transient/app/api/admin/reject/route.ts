import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { RejectBookingSchema } from "@/lib/validations";
import { sendBookingRejectedGuest } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ data: null, error: { code: "AUTH_REQUIRED", message: "Unauthorized." } }, { status: 401 });
    }

    const body = await request.json();
    const result = RejectBookingSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ data: null, error: { code: "VALIDATION_ERROR", message: "Invalid payload input." } }, { status: 400 });
    }

    const { bookingId, reason } = result.data;

    const { data: booking, error: updateError } = await supabase
      .from("bookings")
      .update({ status: "cancelled", rejection_reason: reason })
      .eq("id", bookingId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Send rejection email to guest
    try {
      await sendBookingRejectedGuest(booking);
    } catch (emailErr) {
      console.error("Email dispatch failed on rejection:", emailErr);
    }

    return NextResponse.json({ data: booking, error: null });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: { code: "SERVER_ERROR", message: error.message } }, { status: 500 });
  }
}