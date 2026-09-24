import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 1. Prepare File for Telegram Upload
    const tgFormData = new FormData();
    tgFormData.append("chat_id", chatId);
    tgFormData.append("document", file, file.name);

    // 2. Upload to Telegram Private Channel
    const tgRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendDocument`,
      {
        method: "POST",
        body: tgFormData,
      }
    );

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      return NextResponse.json(
        { error: "Telegram storage upload failed", details: tgData },
        { status: 500 }
      );
    }

    // 3. Extract File Metadata
    const telegramFileId = tgData.result.document.file_id;
    const fileName = file.name;
    const fileSize = file.size;
    const shortCode = Math.random().toString(36).substring(2, 8);

    // 4. Save Record to Supabase
    const { data, error } = await supabase.from("files").insert([
      {
        user_id: userId || null,
        file_name: fileName,
        file_size: fileSize,
        telegram_file_id: telegramFileId,
        short_code: shortCode,
        views: 0,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      shortCode: shortCode,
      downloadUrl: `/f/${shortCode}`,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
