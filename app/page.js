'use client';

import { useState, useCallback } from 'react';
import StartScreen       from '@/components/StartScreen';
import GameScreen        from '@/components/GameScreen';
import ResultsScreen     from '@/components/ResultsScreen';
import LeaderboardScreen from '@/components/LeaderboardScreen';
import BgBeans           from '@/components/BgBeans';
import Celebration       from '@/components/Celebration';
import { fetchQuestions, localQuestions } from '@/utils/fetchQuestions';

export default function Home() {
  const [screen, setScreen]         = useState('start');   // 'start' | 'game' | 'results' | 'leaderboard'
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions]   = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [lastTs, setLastTs]         = useState(0);
  const [celebTrigger, setCelebTrigger] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [apiError, setApiError]     = useState(null);      // shown briefly on start screen

  // ── Fetch questions from OpenTDB, fall back to local pool on error ──
  const startGame = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    setFinalScore(0);

    let qs;
    try {
      qs = await fetchQuestions({ amount: 5, difficulty });
    } catch (err) {
      console.warn('OpenTDB fetch failed — using local questions.', err.message);
      setApiError('Could not reach the trivia API. Playing with local questions instead!');
      qs = localQuestions();
    }

    setQuestions(qs);
    setLoading(false);
    setScreen('game');
  }, [difficulty]);

  const onGameEnd = useCallback((score) => {
    setFinalScore(score);
    setScreen('results');
  }, []);

  const onSave = useCallback((ts) => {
    setLastTs(ts);
    setScreen('leaderboard');
  }, []);

  const goHome = useCallback(() => {
    setLastTs(0);
    setApiError(null);
    setScreen('start');
  }, []);

  const triggerCelebration = useCallback(() => {
    setCelebTrigger(prev => !prev);
  }, []);

  return (
    <>
      <BgBeans />
      <Celebration trigger={celebTrigger} />
      <div className="container">
        {screen === 'start' && (
          <StartScreen
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            onStart={startGame}
            loading={loading}
            apiError={apiError}
          />
        )}
        {screen === 'game' && (
          <GameScreen
            key={questions[0]?.text}
            questions={questions}
            difficulty={difficulty}
            onCelebrate={triggerCelebration}
            onEnd={onGameEnd}
          />
        )}
        {screen === 'results' && (
          <ResultsScreen
            score={finalScore}
            total={questions.length || 5}
            difficulty={difficulty}
            onSave={onSave}
            onGoHome={goHome}
          />
        )}
        {screen === 'leaderboard' && (
          <LeaderboardScreen
            lastTs={lastTs}
            onPlayAgain={goHome}
          />
        )}
      </div>
    </>
  );
}
