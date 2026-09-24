import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file selected" }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Direct Telegram API Call
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
      // Return exact error from Telegram
      return NextResponse.json(
        { error: `Telegram API Error: ${tgData.description}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "File uploaded to Telegram successfully!",
      downloadUrl: `/f/test`,
    });
  } catch (err) {
    return NextResponse.json({ error: `Server Error: ${err.message}` }, { status: 500 });
  }
}
