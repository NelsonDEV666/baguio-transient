import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendBookingConfirmedGuest } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ data: null, error: { code: "AUTH_REQUIRED", message: "Unauthorized." } }, { status: 401 });
    }

    const { bookingId } = await request.json();
    if (!bookingId) {
      return NextResponse.json({ data: null, error: { code: "VALIDATION_ERROR", message: "Booking ID required." } }, { status: 400 });
    }

    const { data: booking, error: updateError } = await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", bookingId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Send confirmation email
    try {
      await sendBookingConfirmedGuest(booking);
    } catch (emailErr) {
      console.error("Email dispatch failed on approval:", emailErr);
    }

    return NextResponse.json({ data: booking, error: null });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: { code: "SERVER_ERROR", message: error.message } }, { status: 500 });
  }
}