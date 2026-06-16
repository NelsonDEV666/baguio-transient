import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BlockDateSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ data: null, error: { code: "AUTH_REQUIRED" } }, { status: 401 });

    const body = await request.json();
    const result = BlockDateSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ data: null, error: { code: "VALIDATION_ERROR" } }, { status: 400 });

    const { data, error } = await supabase
      .from("blocked_dates")
      .insert({ block_date: result.data.block_date, reason: result.data.reason || null, created_by: user.id })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data, error: null });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: { code: "SERVER_ERROR", message: error.message } }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ data: null, error: { code: "AUTH_REQUIRED" } }, { status: 401 });

    const { blockDate } = await request.json();
    const { error } = await supabase.from("blocked_dates").delete().eq("block_date", blockDate);

    if (error) throw error;
    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: { code: "SERVER_ERROR", message: error.message } }, { status: 500 });
  }
}