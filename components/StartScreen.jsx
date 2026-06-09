'use client';

import { DIFF_CONFIG } from '@/data/questions';

export default function StartScreen({ difficulty, setDifficulty, onStart, loading, apiError }) {
  return (
    <div className="screen">
      <div className="card">

        <div className="start-hero">
          <div className="cup-wrap">
            <div className="steam">
              <span /><span /><span />
            </div>
            <span className="cup-emoji">☕</span>
          </div>
          <h1 className="start-title">Coffee Trivia</h1>
          <p className="start-sub">How well do you know your brew?</p>
        </div>

        <p className="section-label">☕ Pick Your Difficulty</p>

        <div className="diff-grid">
          {Object.entries(DIFF_CONFIG).map(([key, val]) => (
            <button
              key={key}
              className={`diff-btn${difficulty === key ? ' selected' : ''}`}
              onClick={() => !loading && setDifficulty(key)}
              disabled={loading}
            >
              <span className="diff-name">{val.label}</span>
              <span className="diff-time">{val.time} sec / question</span>
            </button>
          ))}
        </div>

        {/* API error fallback notice */}
        {apiError && (
          <div className="api-error">{apiError}</div>
        )}

        <button
          className="btn btn-primary"
          onClick={onStart}
          disabled={loading}
        >
          {loading
            ? <span className="loading-text">☕ Brewing questions…</span>
            : 'Brew the Quiz! ☕'}
        </button>

        <p className="api-credit">
          Questions powered by{' '}
          <a href="https://opentdb.com" target="_blank" rel="noopener noreferrer">
            Open Trivia Database
          </a>
        </p>

      </div>
    </div>
  );
}
