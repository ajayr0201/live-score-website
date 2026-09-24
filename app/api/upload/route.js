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

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Post file to Telegram Channel
    const tgFormData = new FormData();
    tgFormData.append("chat_id", chatId);
    tgFormData.append("document", file, file.name);

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
        { error: `Telegram Error: ${tgData.description}` },
        { status: 500 }
      );
    }

    // Extract file details and insert into Supabase
    const telegramFileId = tgData.result.document.file_id;
    const shortCode = Math.random().toString(36).substring(2, 8);

    const { error } = await supabase.from("files").insert([
      {
        file_name: file.name,
        file_size: file.size,
        telegram_file_id: telegramFileId,
        short_code: shortCode,
        views: 0,
      },
    ]);

    if (error) {
      return NextResponse.json(
        { error: `Supabase Error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      shortCode: shortCode,
      downloadUrl: `/f/${shortCode}`,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
