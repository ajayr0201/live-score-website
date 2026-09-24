import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getFileData(code) {
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("short_code", code)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function DownloadPage({ params }) {
  const { code } = params;
  const file = await getFileData(code);

  if (!file) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h1>404 - File Not Found</h1>
        <p>Yeh file exist nahi karti ya delete ho chuki hai.</p>
      </div>
    );
  }

  // Telegram File Path API Call
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgRes = await fetch(
    `https://api.telegram.org/bot${botToken}/getFile?file_id=${file.telegram_file_id}`
  );
  const tgData = await tgRes.json();

  let fileUrl = "#";
  if (tgData.ok) {
    const filePath = tgData.result.file_path;
    fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
  }

  const fileSizeMB = (file.file_size / (1024 * 1024)).toFixed(2);
  const fileNameLower = file.file_name.toLowerCase();

  // Determine File Type
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileNameLower);
  const isVideo = /\.(mp4|webm|mkv|mov)$/i.test(fileNameLower);
  const isAudio = /\.(mp3|wav|ogg)$/i.test(fileNameLower);
  const isPdf = /\.pdf$/i.test(fileNameLower);

  return (
    <div style={{ maxWidth: "650px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif", textAlign: "center", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
      <h2>TeraCloud Storage</h2>
      <hr style={{ margin: "20px 0", border: "0.5px solid #eee" }} />
      
      <div style={{ marginBottom: "20px" }}>
        <h3>📄 {file.file_name}</h3>
        <p style={{ color: "#666" }}>Size: {fileSizeMB} MB</p>
      </div>

      {/* ONLINE MEDIA PLAYER / VIEWER SECTION */}
      {fileUrl !== "#" && (
        <div style={{ margin: "20px 0", padding: "10px", background: "#f8f9fa", borderRadius: "8px" }}>
          {isImage && (
            <img src={fileUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: "6px" }} />
          )}

          {isVideo && (
            <video controls style={{ width: "100%", maxHeight: "360px", borderRadius: "6px" }}>
              <source src={fileUrl} />
              Your browser does not support video playback.
            </video>
          )}

          {isAudio && (
            <audio controls style={{ width: "100%" }}>
              <source src={fileUrl} />
              Your browser does not support audio playback.
            </audio>
          )}

          {isPdf && (
            <iframe src={fileUrl} style={{ width: "100%", height: "450px", border: "none", borderRadius: "6px" }} />
          )}

          {!isImage && !isVideo && !isAudio && !isPdf && (
            <p style={{ color: "#777", fontSize: "14px" }}>⚠️ Yeh file type online preview supported nahi karta. Niche se direct download karein.</p>
          )}
        </div>
      )}

      {/* ADVERTISEMENT SPACE */}
      <div style={{ padding: "15px", background: "#f1f3f5", border: "1px dashed #adb5bd", margin: "20px 0", borderRadius: "6px" }}>
        <p style={{ color: "#6c757d", fontSize: "13px", margin: 0 }}>[ Advertisement Space ]</p>
      </div>

      {/* DOWNLOAD BUTTON */}
      {fileUrl !== "#" ? (
        <a 
          href={fileUrl} 
          download
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: "#28a745",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "16px",
            marginTop: "10px"
          }}
        >
          ⬇️ Download Original File
        </a>
      ) : (
        <p style={{ color: "red" }}>File link expire ya generate nahi hua.</p>
      )}
    </div>
  );
    }
