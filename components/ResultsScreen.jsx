'use client';

import { useState } from 'react';
import { DIFF_CONFIG } from '@/data/questions';
import { saveScore }   from '@/utils/leaderboard';
import { useAudio }    from '@/hooks/useAudio';

export default function ResultsScreen({ score, total, difficulty, onSave, onGoHome }) {
  const [name,  setName]  = useState('');
  const [saved, setSaved] = useState(false);
  const { playFanfare }   = useAudio();

  const pct = score / total;
  let icon, title, note;
  if      (pct === 1  ) { icon = '🏆'; title = 'Perfect Barista!';  note = "You're a true coffee connoisseur!"; }
  else if (pct >= 0.8 ) { icon = '☕'; title = 'Coffee Expert!';    note = 'Almost a perfect brew!'; }
  else if (pct >= 0.6 ) { icon = '🫘'; title = 'Coffee Lover!';     note = 'You really know your beans!'; }
  else if (pct >= 0.4 ) { icon = '🥛'; title = 'Coffee Beginner';   note = 'Keep sipping and learning!'; }
  else                  { icon = '💧'; title = 'Decaf Territory!';   note = 'Time to hit the coffee books!'; }

  const handleSave = () => {
    if (saved) return;
    setSaved(true);
    const playerName = name.trim() || 'Anonymous';
    const { ts, rank } = saveScore({ name: playerName, score, total, difficulty });
    if (rank === 0 && score > 0) playFanfare();
    onSave(ts);
  };

  return (
    <div className="screen">
      <div className="card">

        <div className="results-hero">
          <span className="results-icon">{icon}</span>
          <h2 className="results-title">{title}</h2>
        </div>

        <div className="final-score">{score} / {total}</div>
        <p className="score-note">{note}</p>

        <div className="divider" />

        <label className="name-label">🏅 Enter your name to save your score:</label>
        <div className="name-row">
          <input
            type="text"
            className="name-input"
            placeholder="Your barista name…"
            maxLength={22}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button className="btn btn-accent" onClick={handleSave} disabled={saved}>
            {saved ? 'Saving…' : 'Save & See Leaderboard →'}
          </button>
        </div>

        <div className="divider" />

        <button className="btn btn-home" onClick={onGoHome}>
          ☕ Go to Home Page
        </button>

      </div>
    </div>
  );
}
