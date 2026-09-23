'use client';
import { useState } from 'react';

export default function Home() {
  const [coins, setCoins] = useState(1000);
  const [betAmount, setBetAmount] = useState(100);
  const [placedBets, setPlacedBets] = useState([]);

  // Live Match Mock Data
  const matchData = {
    title: "IPL 2026 - Match 12",
    team1: "Chennai Super Kings",
    team2: "Mumbai Indians",
    score: "CSK 142/3 (14.2 Overs)",
  };

  // 3 Session Betting Options
  const sessions = [
    { id: 1, name: "6 Over Session (Powerplay)", target: "48.5 Runs", type: "OVER/UNDER" },
    { id: 2, name: "10 Over Session", target: "85.5 Runs", type: "OVER/UNDER" },
    { id: 3, name: "15 Over Session", target: "128.5 Runs", type: "OVER/UNDER" },
  ];

  const handlePlaceBet = (optionName, prediction) => {
    if (coins < betAmount) {
      alert("Aapke paas paryapt coins nahi hain!");
      return;
    }

    setCoins(prev => prev - betAmount);
    setPlacedBets(prev => [
      ...prev,
      {
        id: Date.now(),
        option: optionName,
        prediction: prediction,
        amount: betAmount,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      
      {/* Header & Wallet */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
        <h2>🏏 IPL Coin Arena</h2>
        <div style={{ backgroundColor: '#1e293b', padding: '8px 15px', borderRadius: '20px', border: '1px solid #f59e0b', color: '#f59e0b', fontWeight: 'bold' }}>
          🪙 {coins} Coins
        </div>
      </div>

      {/* Live Match Card */}
      <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '10px', marginTop: '20px', borderLeft: '4px solid #3b82f6' }}>
        <span style={{ backgroundColor: '#ef4444', fontSize: '12px', padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold' }}>LIVE</span>
        <h4 style={{ margin: '8px 0 4px 0', color: '#94a3b8' }}>{matchData.title}</h4>
        <h3 style={{ margin: '0 0 8px 0' }}>{matchData.team1} vs {matchData.team2}</h3>
        <p style={{ margin: '0', color: '#38bdf8', fontWeight: 'bold' }}>{matchData.score}</p>
      </div>

      {/* Bet Amount Selector */}
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label>Bet Amount:</label>
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
      {sessions.map(session => (
        <div key={session.id} style={{ backgroundColor: '#1e293b', padding: '12px 15px', borderRadius: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{session.name}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Target: {session.target}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => handlePlaceBet(session.name, 'YES / OVER')}
              style={{ padding: '8px 12px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              YES
            </button>
            <button 
              onClick={() => handlePlaceBet(session.name, 'NO / UNDER')}
              style={{ padding: '8px 12px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              NO
            </button>
          </div>
        </div>
      ))}

      {/* My Active Bets History */}
      <h3 style={{ marginTop: '25px', color: '#f8fafc' }}>📜 Your Active Bets</h3>
      {placedBets.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '14px' }}>Aapne abhi tak koi bet nahi lagayi hai.</p>
      ) : (
        placedBets.map(bet => (
          <div key={bet.id} style={{ backgroundColor: '#0284c7', padding: '10px 12px', borderRadius: '6px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span>{bet.option} (<b>{bet.prediction}</b>)</span>
            <span>🪙 {bet.amount} Coins [{bet.time}]</span>
          </div>
        ))
      )}

    </div>
  );
        }
