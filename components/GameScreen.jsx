'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LABELS, DIFF_CONFIG } from '@/data/questions';
import { useAudio } from '@/hooks/useAudio';

export default function GameScreen({ questions, difficulty, onCelebrate, onEnd }) {
  const [idx,        setIdx]        = useState(0);
  const [score,      setScore]      = useState(0);
  const [answered,   setAnswered]   = useState(false);
  const [chosen,     setChosen]     = useState(null);
  const [feedback,   setFeedback]   = useState(null);   // { ok, msg } | null
  const [timeLeft,   setTimeLeft]   = useState(DIFF_CONFIG[difficulty].time);
  const [isShaking,  setIsShaking]  = useState(false);
  const [slideClass, setSlideClass] = useState('');

  // Refs to avoid stale-closure issues inside setInterval / setTimeout callbacks
  const timerId    = useRef(null);
  const scoreRef   = useRef(0);
  const answeredRef = useRef(false);

  const { playCorrect, playWrong } = useAudio();

  const q       = questions[idx];
  const timeMax = DIFF_CONFIG[difficulty].time;

  // ── helpers ──────────────────────────────────────────────
  const doShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  const stopTimer = useCallback(() => {
    clearInterval(timerId.current);
  }, []);

  // ── advance to next question (or end game) ──────────────
  const advance = useCallback((currentScore) => {
    const next = idx + 1;
    if (next >= questions.length) {
      onEnd(currentScore);
      return;
    }
    // Slide out → reset state → slide in
    setSlideClass('card-slide-out');
    setTimeout(() => {
      setIdx(next);
      setAnswered(false);
      answeredRef.current = false;
      setChosen(null);
      setFeedback(null);
      setTimeLeft(timeMax);
      setSlideClass('card-slide-in');
      setTimeout(() => setSlideClass(''), 300);
    }, 240);
  }, [idx, questions.length, onEnd, timeMax]);

  // ── timer expiry handler ─────────────────────────────────
  const handleTimeout = useCallback(() => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    setAnswered(true);
    playWrong();
    doShake();
    setFeedback({
      ok:  false,
      msg: `⏰ Time's up! Answer: ${LABELS[q.correct]} — ${q.answers[q.correct]}`,
    });
    setTimeout(() => advance(scoreRef.current), 2200);
  }, [q, playWrong, advance]);

  // ── start timer whenever question index changes ──────────
  useEffect(() => {
    answeredRef.current = false;
    setAnswered(false);
    setChosen(null);
    setFeedback(null);
    setTimeLeft(timeMax);

    clearInterval(timerId.current);
    timerId.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerId.current); return 0; }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // ── watch for natural timeout ────────────────────────────
  useEffect(() => {
    if (timeLeft === 0 && !answeredRef.current) handleTimeout();
  }, [timeLeft, handleTimeout]);

  // ── player selects an answer ─────────────────────────────
  const onAnswer = useCallback((selectedIdx) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    setAnswered(true);
    stopTimer();
    setChosen(selectedIdx);

    const correct   = selectedIdx === q.correct;
    let   newScore  = scoreRef.current;

    if (correct) {
      newScore++;
      scoreRef.current = newScore;
      setScore(newScore);
      onCelebrate();
      playCorrect();
      setFeedback({ ok: true, msg: '☕ Correct! Well brewed!' });
    } else {
      playWrong();
      doShake();
      setFeedback({
        ok:  false,
        msg: `✗ Not quite! Answer: ${LABELS[q.correct]} — ${q.answers[q.correct]}`,
      });
    }

    setTimeout(() => advance(newScore), 2100);
  }, [q, onCelebrate, playCorrect, playWrong, stopTimer, advance]);

  // ── derive button CSS class ──────────────────────────────
  const btnClass = (i) => {
    if (!answered) return 'ans-btn';
    if (i === q.correct)   return chosen === i ? 'ans-btn correct' : 'ans-btn reveal';
    if (i === chosen)      return 'ans-btn wrong';
    return 'ans-btn faded';
  };

  const pct  = (timeLeft / timeMax) * 100;
  const warn = timeLeft <= 5;

  return (
    <div className="screen">
      <div className={`card${slideClass ? ` ${slideClass}` : ''}`}>

        <div className="game-header">
          <div className="score-pill">Score: {score} / {idx}</div>
          <div className="diff-pill">{DIFF_CONFIG[difficulty].label}</div>
        </div>

        <div className="q-counter">Question {idx + 1} of {questions.length}</div>

        <div className="timer-wrap">
          <div className="timer-track">
            <div className={`timer-bar${warn ? ' warn' : ''}`} style={{ width: `${pct}%` }} />
          </div>
          <div className={`timer-num${warn ? ' warn' : ''}`}>{timeLeft}</div>
        </div>

        <div className="question-text">{q.text}</div>

        <div className={`answers-grid${isShaking ? ' shake' : ''}`}>
          {q.answers.map((ans, i) => (
            <button
              key={i}
              className={btnClass(i)}
              onClick={() => onAnswer(i)}
              disabled={answered}
            >
              <span className="ans-label">{LABELS[i]}</span>
              <span>{ans}</span>
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`feedback ${feedback.ok ? 'ok-fb' : 'err-fb'}`}>
            {feedback.msg}
          </div>
        )}

      </div>
    </div>
  );
}
