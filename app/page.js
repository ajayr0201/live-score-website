"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [shortLink, setShortLink] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first!");

    setUploading(true);
    setError("");
    setShortLink("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const fullLink = `${window.location.origin}${data.downloadUrl}`;
        setShortLink(fullLink);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError(`Network Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h2>TeraCloud - Free Storage & File Sharing</h2>
      
      <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
          style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
        
        <button 
          type="submit" 
          disabled={uploading}
          style={{ padding: "12px", background: "#0070f3", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          {uploading ? "Uploading to Telegram..." : "Upload File"}
        </button>
      </form>

      {shortLink && (
        <div style={{ marginTop: "20px", padding: "15px", background: "#e6fffa", border: "1px solid #38b2ac", borderRadius: "5px" }}>
          <p><strong>File Uploaded Successfully!</strong></p>
          <p>Monetized Link: <a href={shortLink} target="_blank" rel="noreferrer">{shortLink}</a></p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "20px", padding: "15px", background: "#fff5f5", color: "#e53e3e", borderRadius: "5px", wordBreak: "break-all" }}>
          {error}
        </div>
      )}
    </div>
  );
}
