import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// We use the powerful Service Role Key here to bypass storage security locks.
// Because this runs securely on the server, the key is never exposed to the browser.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file detected in the upload payload." }, { status: 400 });
    }

    // Convert the browser file into a readable server buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a completely unique filename to prevent overwriting
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // Push the file into your Supabase bucket
    const { data, error } = await supabaseAdmin.storage
      .from("payment-receipts")
      .upload(uniqueFileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      throw new Error("Storage bucket rejected the file. Verify bucket name is exactly 'payment-receipts'.");
    }

    // Retrieve the public URL string so the form can save it to the database
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("payment-receipts")
      .getPublicUrl(uniqueFileName);

    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 200 });

  } catch (error: any) {
    console.error("Backend Upload API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process image upload" }, { status: 500 });
  }
}