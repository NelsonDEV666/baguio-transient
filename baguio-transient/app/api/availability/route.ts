import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use the Service Role Key so it can safely read the database in the background
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // 1. Fetch only bookings that are either pending or confirmed
    const { data: bookings, error } = await supabaseAdmin
      .from("bookings")
      .select("check_in, check_out, status")
      .in("status", ["confirmed", "pending"]);

    if (error) throw error;

    const confirmedDates: string[] = [];
    const pendingDates: string[] = [];

    // 2. Helper function to extract every single day between check-in and check-out
    const getDatesInRange = (startDate: string, endDate: string) => {
      const dates = [];
      let currentDate = new Date(startDate);
      const end = new Date(endDate);
      
      while (currentDate <= end) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };

    // 3. Sort the extracted dates into their correct status buckets
    bookings?.forEach((booking) => {
      const range = getDatesInRange(booking.check_in, booking.check_out);
      if (booking.status === "confirmed") {
        confirmedDates.push(...range);
      } else if (booking.status === "pending") {
        pendingDates.push(...range);
      }
    });

    // 4. Remove any duplicate overlaps
    const uniqueConfirmed = Array.from(new Set(confirmedDates));
    const uniquePending = Array.from(new Set(pendingDates));
    
    // Ensure pending dates don't overwrite confirmed dates
    const filteredPending = uniquePending.filter(date => !uniqueConfirmed.includes(date));

    // Send the live matrix back to the frontend calendar
    return NextResponse.json({
      confirmedDates: uniqueConfirmed,
      pendingDates: filteredPending,
      blockedDates: [], 
      unavailableDates: [...uniqueConfirmed, ...filteredPending] // Both are unselectable by new guests
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}