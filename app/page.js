"use client";

import { useState } from "react";

export default function Home() {
  const [selected, setSelected] = useState("Live");

  const matches = [
    {
      league: "IPL",
      team1: "CSK",
      team2: "RCB",
      score1: "184/6",
      score2: "176/8",
      status: "CSK won by 8 runs",
    },
    {
      league: "International",
      team1: "IND",
      team2: "AUS",
      score1: "245/4",
      score2: "198/7",
      status: "India won",
    },
    {
      league: "T20",
      team1: "MI",
      team2: "KKR",
      score1: "156/5",
      score2: "92/3",
      status: "Live",
    },
  ];

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logo}>LIVE<span>SCORE</span></div>
        <div style={styles.live}>● LIVE</div>
      </header>

      <section style={styles.hero
