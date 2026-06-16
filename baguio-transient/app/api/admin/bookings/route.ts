import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use the Service Role Key for secure admin-level database access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Fetches all bookings for the dashboard
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false }); // Newest bookings first

    if (error) throw error;
    return NextResponse.json({ bookings: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Updates the status when you click Approve or Reject
export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, booking: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}