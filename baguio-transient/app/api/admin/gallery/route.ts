import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ data: null, error: { code: "AUTH_REQUIRED" } }, { status: 401 });

    const { url, alt_text, sort_order, is_hero } = await request.json();

    // If making this image the hero image, un-hero previous hero items first
    if (is_hero) {
      await supabase.from("gallery_images").update({ is_hero: false }).eq("is_hero", true);
    }

    const { data, error } = await supabase
      .from("gallery_images")
      .insert({ url, alt_text, sort_order: sort_order || 0, is_hero: is_hero || false })
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

    const { id } = await request.json();
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: { code: "SERVER_ERROR", message: error.message } }, { status: 500 });
  }
}