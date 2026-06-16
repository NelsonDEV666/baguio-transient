import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// We use the Service Role Key again to ensure the database accepts the entry flawlessly
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Calculate backend pricing safety fallback to prevent frontend tampering
    const start = new Date(body.check_in);
    const end = new Date(body.check_out);
    const nightsCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const baseRatePerNight = 3500; 
    const extraPaxRate = 500;
    const basePaxCount = 4;
    
    let nightTotal = nightsCount * baseRatePerNight;
    let extraPaxTotal = body.pax_count > basePaxCount ? (body.pax_count - basePaxCount) * extraPaxRate * nightsCount : 0;
    
    const finalTotalPrice = nightTotal + extraPaxTotal;
    const finalReservationFee = finalTotalPrice * 0.5;

    // 2. Insert the guest directly into your Supabase database
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .insert([
        {
          guest_name: body.guest_name,
          guest_email: body.guest_email,
          guest_phone: body.guest_phone,
          check_in: body.check_in,
          check_out: body.check_out,
          pax_count: body.pax_count,
          total_price: finalTotalPrice,
          reservation_fee: finalReservationFee,
          status: "pending",
          payment_receipt_url: body.payment_receipt_url,
          special_requests: body.special_requests || null,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Database Insert Error:", error);
      throw new Error("Supabase rejected the booking insertion.");
    }

    return NextResponse.json({ success: true, booking: data }, { status: 200 });

  } catch (error: any) {
    console.error("Booking API Terminal Error:", error);
    return NextResponse.json({ error: { message: error.message || "Failed to save booking to the cloud." } }, { status: 500 });
  }
}