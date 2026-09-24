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
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Telegram endpoint selection based on file type
    let tgEndpoint = "sendDocument";
    const tgFormData = new FormData();
    tgFormData.append("chat_id", chatId);

    if (file.type.startsWith("image/")) {
      tgEndpoint = "sendPhoto";
      tgFormData.append("photo", file);
    } else if (file.type.startsWith("video/")) {
      tgEndpoint = "sendVideo";
      tgFormData.append("video", file);
    } else if (file.type.startsWith("audio/")) {
      tgEndpoint = "sendAudio";
      tgFormData.append("audio", file);
    } else {
      tgFormData.append("document", file);
    }

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/${tgEndpoint}`, {
      method: "POST",
      body: tgFormData,
    });

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      return NextResponse.json({ error: tgData.description || "Telegram upload failed" }, { status: 500 });
    }

    // Safely extract file_id across photo, video, audio, or document
    let telegramFileId = "";
    if (tgData.result.photo) {
      telegramFileId = tgData.result.photo[tgData.result.photo.length - 1].file_id;
    } else if (tgData.result.video) {
      telegramFileId = tgData.result.video.file_id;
    } else if (tgData.result.audio) {
      telegramFileId = tgData.result.audio.file_id;
    } else if (tgData.result.document) {
      telegramFileId = tgData.result.document.file_id;
    }

    if (!telegramFileId) {
      return NextResponse.json({ error: "Could not retrieve file_id from Telegram response" }, { status: 500 });
    }

    // Generate Short Code
    const shortCode = Math.random().toString(36).substring(2, 8);

    // Save metadata to Supabase
    const { error: dbError } = await supabase.from("files").insert([
      {
        file_name: file.name,
        file_size: file.size,
        telegram_file_id: telegramFileId,
        short_code: shortCode,
      },
    ]);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      downloadUrl: `/f/${shortCode}`,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
