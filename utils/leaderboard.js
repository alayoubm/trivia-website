import { LB_KEY } from '@/data/questions';

/** Read the top-5 leaderboard from localStorage. */
export function getLB() {
  try {
    return JSON.parse(localStorage.getItem(LB_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Add a new score, keep top 5, persist to localStorage.
 * Returns { ts, rank } where rank is 0-based position in the saved list
 * (-1 if the score didn't make the top 5).
 */
export function saveScore({ name, score, total, difficulty }) {
  const ts = Date.now();
  let lb = getLB();
  lb.push({ name, score, total, diff: difficulty, ts });
  lb.sort((a, b) => b.score - a.score || b.ts - a.ts);
  const rank = lb.findIndex((e) => e.ts === ts);
  lb = lb.slice(0, 5);
  localStorage.setItem(LB_KEY, JSON.stringify(lb));
  return { ts, rank };
}

/** Wipe the entire leaderboard. */
export function clearLB() {
  localStorage.removeItem(LB_KEY);
}
