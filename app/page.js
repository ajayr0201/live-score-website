'use client';
import React, { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('live');

  // Sample Match Data
  const matches = [
    {
      id: 1,
      status: 'LIVE',
      category: 'T20 International',
      team1: 'India',
      team1Flag: '🇮🇳',
      team1Score: '185/4 (18.2 ov)',
      team2: 'Australia',
      team2Flag: '🇦🇺',
      team2Score: '182/8 (20.0 ov)',
      summary: 'India need 3 runs in 10 balls',
      venue: 'Wankhede Stadium, Mumbai',
    },
    {
      id: 2,
      status: 'UPCOMING',
      category: 'ODI Series',
      team1: 'England',
      team1Flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      team1Score: 'Yet to bat',
      team2: 'Pakistan',
      team2Flag: '🇵🇰',
      team2Score: 'Yet to bat',
      summary: 'Match starts today at 7:00 PM IST',
      venue: 'Lord\'s, London',
    },
    {
      id: 3,
      status: 'FINISHED',
      category: 'Test Match',
      team1: 'South Africa',
      team1Flag: '🇿🇦',
      team1Score: '320 & 210',
      team2: 'New Zealand',
      team2Flag: '🇳🇿',
      team2Score: '280 & 190',
      summary: 'South Africa won by 60 runs',
      venue: 'Newlands, Cape Town',
    },
  ];

  const filteredMatches = matches.filter((m) => {
    if (activeTab === 'live') return m.status === 'LIVE';
    if (activeTab === 'upcoming') return m.status === 'UPCOMING';
    if (activeTab === 'finished') return m.status === 'FINISHED';
    return true;
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>⚡ Live Score Center</h1>
        <p style={styles.subtitle}>Real-time cricket match updates</p>
      </header>

      {/* Filter Tabs */}
      <div style={styles.tabContainer}>
        {['live', 'upcoming', 'finished', 'all'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab ? styles.activeTabButton : {}),
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Matches List */}
      <div style={styles.matchList}>
        {filteredMatches.length === 0 ? (
          <p style={styles.noMatches}>No matches available in this category.</p>
        ) : (
          filteredMatches.map((match) => (
            <div key={match.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.category}>{match.category}</span>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor:
                      match.status === 'LIVE'
                        ? '#e53e3e'
                        : match.status === 'UPCOMING'
                        ? '#3182ce'
                        : '#38a169',
                  }}
                >
                  {match.status === 'LIVE' ? '🔴 LIVE' : match.status}
                </span>
              </div>

              <div style={styles.teamsContainer}>
                {/* Team 1 */}
                <div style={styles.teamRow}>
                  <div style={styles.teamInfo}>
                    <span style={styles.flag}>{match.team1Flag}</span>
                    <span style={styles.teamName}>{match.team1}</span>
                  </div>
                  <span style={styles.score}>{match.team1Score}</span>
                </div>

                {/* Team 2 */}
                <div style={styles.teamRow}>
                  <div style={styles.teamInfo}>
                    <span style={styles.flag}>{match.team2Flag}</span>
                    <span style={styles.teamName}>{match.team2}</span>
                  </div>
                  <span style={styles.score}>{match.team2Score}</span>
                </div>
              </div>

              {/* Match Footer */}
              <div style={styles.cardFooter}>
                <p style={styles.summary}>{match.summary}</p>
                <p style={styles.venue}>📍 {match.venue}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Inline CSS Styles
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#0f172a',
    minHeight: '100vh',
    color: '#f8fafc',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid #1e293b',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#94a3b8',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  tabButton: {
    flex: 1,
    padding: '10px 0',
    backgroundColor: '#1e293b',
    color: '#94a3b8',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '12px',
    cursor: 'pointer',
  },
  activeTabButton: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
  },
  matchList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    border: '1px solid #334155',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  category: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500',
  },
  statusBadge: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#ffffff',
    padding: '4px 8px',
    borderRadius: '12px',
  },
  teamsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    margin: '12px 0',
  },
  teamRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  flag: {
    fontSize: '20px',
  },
  teamName: {
    fontSize: '16px',
    fontWeight: '600',
  },
  score: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  cardFooter: {
    marginTop: '12px',
    paddingTop: '8px',
    borderTop: '1px solid #334155',
  },
  summary: {
    margin: 0,
    fontSize: '13px',
    color: '#38bdf8',
    fontWeight: '500',
  },
  venue: {
    margin: '4px 0 0 0',
    fontSize: '11px',
    color: '#64748b',
  },
  noMatches: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: '20px',
  },
};
