'use client';

import { useRef, useCallback } from 'react';

/**
 * Thin wrapper around Web Audio API.
 * No external files needed — all sounds are synthesised.
 */
export function useAudio() {
  const ctxRef   = useRef(null);
  const nodesRef = useRef([]);

  const init = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
  }, []);

  const stopSounds = useCallback(() => {
    nodesRef.current.forEach((n) => { try { n.stop(0); } catch { /* already stopped */ } });
    nodesRef.current = [];
  }, []);

  const beep = useCallback((freq, t0, dur, type = 'sine', vol = 0.24) => {
    const ctx  = ctxRef.current;
    if (!ctx) return;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
    nodesRef.current.push(osc);
  }, []);

  /** C5 → E5 → G5 ascending chime */
  const playCorrect = useCallback(() => {
    stopSounds(); init();
    const t = ctxRef.current.currentTime;
    beep(523.25, t,        0.15);
    beep(659.25, t + 0.12, 0.15);
    beep(783.99, t + 0.24, 0.35);
  }, [init, stopSounds, beep]);

  /** Descending sawtooth buzz */
  const playWrong = useCallback(() => {
    stopSounds(); init();
    const t = ctxRef.current.currentTime;
    beep(200, t,        0.12, 'sawtooth', 0.22);
    beep(150, t + 0.12, 0.28, 'sawtooth', 0.16);
  }, [init, stopSounds, beep]);

  /** 6-note triumphant fanfare */
  const playFanfare = useCallback(() => {
    stopSounds(); init();
    const t = ctxRef.current.currentTime;
    [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5].forEach((f, i) =>
      beep(f, t + i * 0.16, 0.28, 'sine', 0.27)
    );
  }, [init, stopSounds, beep]);

  return { playCorrect, playWrong, playFanfare, init };
}
