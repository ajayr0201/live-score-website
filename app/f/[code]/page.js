"use client";
import { useState, useEffect } from "react";
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

export default function DownloadPage({ params }) {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("#");
  const [loading, setLoading] = useState(true);

  // App detection logic
  useEffect(() => {
    const userAgent = navigator.userAgent || '';
    
    if (/android/i.test(userAgent)) {
      const currentUrl = window.location.href;
      const appUrl = 'mayajaall://open?url=' + encodeURIComponent(currentUrl);
      
      // 1. App kholne ki koshish karo
      const timer = setTimeout(() => {
        if (!document.hidden) {
          // App nahi khuli, matlab installed nahi hai
          window.location.href = '/download.html';
        }
      }, 2000);
      
      window.location.href = appUrl;
      
      // 2. Agar app khul gayi, toh timer cancel karo
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearTimeout(timer);
      });
    }
  }, []);

  // File data fetch karo
  useEffect(() => {
    async function fetchData() {
      const resolvedParams = await params;
      const code = resolvedParams.code;
      const fileData = await getFileData(code);

      if (fileData) {
        setFile(fileData);

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const tgRes = await fetch(
          `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileData.telegram_file_id}`
        );
        const tgData = await tgRes.json();

        if (tgData.ok) {
          const filePath = tgData.result.file_path;
          setFileUrl(`https://api.telegram.org/file/bot${botToken}/${filePath}`);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!file) {
    return (
      <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h1>404 - File Not Found</h1>
        <p>Yeh file exist nahi karti ya delete ho chuki hai.</p>
      </div>
    );
  }

  const fileSizeMB = (file.file_size / (1024 * 1024)).toFixed(2);
  const fileNameLower = file.file_name.toLowerCase();

  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileNameLower);
  const isVideo = /\.(mp4|webm|mkv|mov)$/i.test(fileNameLower);
  const isAudio = /\.(mp3|wav|ogg)$/i.test(fileNameLower);
  const isPdf = /\.pdf$/i.test(fileNameLower);

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto", padding: "20px", fontFamily: "system-ui, sans-serif", border: "1px solid #e1e8ed", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.06)", background: "#ffffff" }}>
      <h2 style={{ textAlign: "center", color: "#0070f3", marginBottom: "5px" }}>TeraCloud Storage</h2>
      <p style={{ textAlign: "center", color: "#657786", fontSize: "14px", marginTop: "0" }}>Fast & Secure File Streaming</p>
      <hr style={{ border: "0", height: "1px", background: "#e1e8ed", margin: "15px 0" }} />
      
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h3 style={{ margin: "5px 0", color: "#14171a", fontSize: "18px" }}>📄 {file.file_name}</h3>
        <span style={{ display: "inline-block", padding: "4px 12px", background: "#e8f5fd", color: "#0070f3", borderRadius: "15px", fontSize: "13px", fontWeight: "bold" }}>
          Size: {fileSizeMB} MB
        </span>
      </div>

      {fileUrl !== "#" && (
        <div style={{ margin: "20px 0", borderRadius: "10px", overflow: "hidden", background: "#000", border: "1px solid #333" }}>
          {isImage && (
            <img src={fileUrl} alt="Preview" style={{ width: "100%", maxHeight: "500px", objectFit: "contain", display: "block" }} />
          )}

          {isVideo && (
            <div style={{ position: "relative", paddingTop: "56.25%" }}>
              <video 
                controls 
                controlsList="nodownload"
                playsInline
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                  outline: "none"
                }}
              >
                <source src={fileUrl} type="video/mp4" />
                Your browser does not support HTML5 video playback.
              </video>
            </div>
          )}

          {isAudio && (
            <div style={{ padding: "15px", background: "#111" }}>
              <audio controls style={{ width: "100%" }}>
                <source src={fileUrl} />
              </audio>
            </div>
          )}

          {isPdf && (
            <iframe src={fileUrl} style={{ width: "100%", height: "500px", border: "none" }} />
          )}

          {!isImage && !isVideo && !isAudio && !isPdf && (
            <p style={{ color: "#fff", padding: "20px", textAlign: "center", fontSize: "14px", margin: 0 }}>
              ⚠️ Direct preview not available for this file type. Please download below.
            </p>
          )}
        </div>
      )}

      <div style={{ padding: "20px", background: "#f7f9fa", border: "1px dashed #ccd6dd", margin: "25px 0", borderRadius: "8px", textAlign: "center" }}>
        <p style={{ color: "#657786", fontSize: "12px", fontWeight: "bold", margin: 0 }}>[ MONETIZATION AD BANNER ]</p>
      </div>

      <div style={{ textAlign: "center" }}>
        {fileUrl !== "#" ? (
          <a 
            href={fileUrl} 
            download
            style={{
              display: "inline-block",
              padding: "14px 35px",
              background: "#28a745",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "30px",
              fontWeight: "bold",
              fontSize: "16px",
              boxShadow: "0 4px 10px rgba(40,167,69,0.3)",
              transition: "all 0.2s"
            }}
          >
            ⬇️ Direct Download High Speed
          </a>
        ) : (
          <p style={{ color: "#e0245e" }}>File link could not be fetched.</p>
        )}
      </div>
    </div>
  );
                }
