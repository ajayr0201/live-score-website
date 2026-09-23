"use client";

import { useState, useEffect } from "react";

export const dynamic = "force-dynamic";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_CRICKET_API_KEY;
        if (!apiKey) {
          setLoading(false);
          return;
        }
        const res = await fetch(
          `https://cricket.sportmonks.com/api/v2.0/livescores?api_token=${apiKey}`
        );
        const data = await res.json();
        setMatches(data?.data || []);
      } catch (err) {
        console.error("Error fetching live matches:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Live Cricket Scores</h1>
      {loading ? (
        <p>Loading live matches...</p>
      ) : matches.length > 0 ? (
        <div style={{ display: "grid", gap: "10px" }}>
          {matches.map((match) => (
            <div
              key={match.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <h3>{match.title || "Live Match"}</h3>
              <p>Status: {match.status || "In Progress"}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No live matches right now or check your API token setup.</p>
      )}
    </main>
  );
        }
