import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("seasonal_rates")
      .select("*")
      .eq("is_active", true)
      .order("start_date", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ rates: data });
  } catch (error) {
    console.error("Rates API Error:", error);
    return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
  }
}