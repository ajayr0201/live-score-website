'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [coins, setCoins] = useState(1000);
  const [betAmount, setBetAmount] = useState(100);
  const [placedBets, setPlacedBets] = useState([]);
  const [matchData, setMatchData] = useState({
    title: "IPL Live Match",
    team1: "Loading...",
    team2: "Loading...",
    score: "Fetching live score...",
    runs: 0,
    overs: 0,
  });

  // Aapki CricketData.org API Key
  const API_KEY = "22bb244a-784f-4fc1-a9f8-80f4f141fa36";

  // Live Score API Fetching
  const fetchLiveScore = async () => {
    try {
      const res = await fetch(`https://api.cricapi.com/v1/cricScore?apikey=${API_KEY}`);
      const data = await res.json();
      if (data && data.data && data.data.length > 0) {
        // Pehla live/recent match pick karein
        const liveMatch = data.data[0];
        
        // Match score parse logic
        const t1Score = liveMatch.t1s || "0/0";
        const t2Score = liveMatch.t2s || "0/0";
        const currentRuns = parseInt(t1Score.split('/')[0]) || 0;

        setMatchData({
          title: liveMatch.series || "IPL 2026 Live",
          team1: liveMatch.t1 || "Team A",
          team2: liveMatch.t2 || "Team B",
          score: `${liveMatch.t1} (${t1Score}) vs ${liveMatch.t2} (${t2Score})`,
          runs: currentRuns,
        });
      }
    } catch (err) {
      console.log("API Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchLiveScore();
    const interval = setInterval(fetchLiveScore, 20000); // Har 20 second me live update
    return () => clearInterval(interval);
  }, []);

  // Bet Placed Logic
  const handlePlaceBet = (sessionName, targetRuns, prediction) => {
    if (coins < betAmount) {
      alert("Paryapt coins nahi hain!");
      return;
    }

    setCoins(prev => prev - betAmount);
    const newBet = {
      id: Date.now(),
      sessionName,
      targetRuns,
      prediction,
      amount: betAmount,
      status: 'PENDING ⏳',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setPlacedBets(prev => [...prev, newBet]);
  };

  // Automatic Settle Bets (Win/Loss Calculation)
  const checkResults = () => {
    setPlacedBets(prevBets =>
      prevBets.map(bet => {
        if (bet.status !== 'PENDING ⏳') return bet;

        const isWin = bet.prediction === 'YES' ? matchData.runs >= bet.targetRuns : matchData.runs < bet.targetRuns;

        if (isWin) {
          const winAmount = bet.amount * 2;
          setCoins(c => c + winAmount);
          return { ...bet, status: `WON 🎉 (+🪙 ${winAmount})` };
        } else {
          return { ...bet, status: 'LOST ❌' };
        }
      })
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      
      {/* Header & Balance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
        <h2>🏏 IPL Coin Arena</h2>
        <div style={{ backgroundColor: '#1e293b', padding: '8px 15px', borderRadius: '20px', border: '1px solid #f59e0b', color: '#f59e0b', fontWeight: 'bold' }}>
          🪙 {coins} Coins
        </div>
      </div>

      {/* Live Score API Display */}
      <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '10px', marginTop: '20px', borderLeft: '4px solid #3b82f6' }}>
        <span style={{ backgroundColor: '#ef4444', fontSize: '11px', padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold' }}>LIVE API SCORE</span>
        <h4 style={{ margin: '8px 0 4px 0', color: '#94a3b8' }}>{matchData.title}</h4>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{matchData.team1} vs {matchData.team2}</h3>
        <p style={{ margin: '0', color: '#38bdf8', fontWeight: 'bold', fontSize: '15px' }}>{matchData.score}</p>
      </div>

      {/* Bet Amount Options */}
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label style={{ fontSize: '14px' }}>Bet Amount:</label>
        {[50, 100, 500].map(amt => (
          <button 
            key={amt} 
            onClick={() => setBetAmount(amt)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: betAmount === amt ? '2px solid #38bdf8' : '1px solid #475569',
              backgroundColor: betAmount === amt ? '#0284c7' : '#334155',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            🪙 {amt}
          </button>
        ))}
      </div>

      {/* Session Betting Cards */}
      <h3 style={{ marginTop: '25px', color: '#f8fafc' }}>⚡ Session Betting Options</h3>
      {[
        { name: "6 Over Session (Powerplay)", target: 48 },
        { name: "10 Over Session", target: 85 },
        { name: "15 Over Session", target: 128 }
      ].map((session, idx) => (
        <div key={idx} style={{ backgroundColor: '#1e293b', padding: '12px 15px', borderRadius: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{session.name}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Target: {session.target} Runs</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => handlePlaceBet(session.name, session.target, 'YES')} style={{ padding: '8px 12px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>YES</button>
            <button onClick={() => handlePlaceBet(session.name, session.target, 'NO')} style={{ padding: '8px 12px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>NO</button>
          </div>
        </div>
      ))}

      {/* Active Bets & Settlement */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px' }}>
        <h3 style={{ color: '#f8fafc', margin: 0 }}>📜 Your Active Bets</h3>
        {placedBets.some(b => b.status === 'PENDING ⏳') && (
          <button onClick={checkResults} style={{ backgroundColor: '#f59e0b', border: 'none', padding: '6px 12px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', color: '#000' }}>
            🔄 Settle Bets
          </button>
        )}
      </div>

      {placedBets.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '10px' }}>Aapne abhi tak koi bet nahi lagayi hai.</p>
      ) : (
        placedBets.map(bet => (
          <div key={bet.id} style={{ backgroundColor: '#1e293b', padding: '10px 12px', borderRadius: '6px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderLeft: '3px solid #0284c7' }}>
            <span>{bet.sessionName} (<b>{bet.prediction}</b>)</span>
            <span>🪙 {bet.amount} | {bet.status}</span>
          </div>
        ))
      )}

    </div>
  );
}
