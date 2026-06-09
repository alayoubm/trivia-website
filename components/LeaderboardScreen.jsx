'use client';

import { useState, useEffect } from 'react';
import { MEDALS }    from '@/data/questions';
import { getLB, clearLB } from '@/utils/leaderboard';

export default function LeaderboardScreen({ lastTs, onPlayAgain }) {
  const [lb, setLb] = useState([]);

  useEffect(() => {
    setLb(getLB());
  }, []);

  const handleClear = () => {
    if (!confirm('Clear all leaderboard scores? This cannot be undone.')) return;
    clearLB();
    setLb([]);
  };

  return (
    <div className="screen">
      <div className="card">

        <div className="lb-hero">
          <span className="lb-icon">🏆</span>
          <h2 className="lb-title">Top Brewers</h2>
        </div>

        <div className="divider" />

        <ul className="lb-list">
          {lb.length === 0 ? (
            <li className="lb-empty">No scores yet — be the first brewer!</li>
          ) : (
            lb.map((entry, i) => (
              <li
                key={entry.ts}
                className={`lb-item${entry.ts === lastTs ? ' highlight' : ''}`}
              >
                <span className="lb-rank">{MEDALS[i] || `${i + 1}.`}</span>
                <span className="lb-name">{entry.name}</span>
                <span className="lb-diff">{entry.diff || 'medium'}</span>
                <span className="lb-score">{entry.score}/{entry.total}</span>
              </li>
            ))
          )}
        </ul>

        <div className="divider" />

        <div className="btn-row">
          <button className="btn btn-primary" onClick={onPlayAgain}>
            Play Again ☕
          </button>
          <button className="btn btn-ghost" onClick={handleClear}>
            Clear Board
          </button>
        </div>

      </div>
    </div>
  );
}
