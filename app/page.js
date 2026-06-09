'use client';

import { useState, useCallback } from 'react';
import StartScreen      from '@/components/StartScreen';
import GameScreen       from '@/components/GameScreen';
import ResultsScreen    from '@/components/ResultsScreen';
import LeaderboardScreen from '@/components/LeaderboardScreen';
import BgBeans          from '@/components/BgBeans';
import Celebration      from '@/components/Celebration';
import { ALL_QUESTIONS } from '@/data/questions';
import { shuffle }       from '@/utils/helpers';

export default function Home() {
  const [screen, setScreen]         = useState('start');      // 'start' | 'game' | 'results' | 'leaderboard'
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions]   = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [lastTs, setLastTs]         = useState(0);
  const [celebTrigger, setCelebTrigger] = useState(false);

  const startGame = useCallback(() => {
    setQuestions(shuffle([...ALL_QUESTIONS]).slice(0, 5));
    setFinalScore(0);
    setScreen('game');
  }, []);

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
