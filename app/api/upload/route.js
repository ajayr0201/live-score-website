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

    if (!botToken || !chatId) {
      return NextResponse.json({ error: "Vercel Env Variables missing! Check BOT_TOKEN or CHAT_ID in Vercel settings." }, { status: 500 });
    }

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
        { error: `Telegram Error: ${tgData.description} (Code: ${tgData.error_code})` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      downloadUrl: `/f/test-code`,
    });
  } catch (err) {
    return NextResponse.json({ error: `Server Error: ${err.message}` }, { status: 500 });
  }
}
