import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    // Verify Vercel Cron Secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // 1. Keep DB awake
    const { error: pingError } = await supabase
      .from("seasonal_rates")
      .select("id")
      .limit(1);

    if (pingError) throw pingError;

    // 2. Check for No-Shows (Confirmed bookings that missed check-in yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    await supabase
      .from("bookings")
      .update({ status: "no_show" })
      .eq("status", "confirmed")
      .eq("check_in", yesterdayStr);

    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}