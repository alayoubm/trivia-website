import { shuffle } from './helpers';
import { ALL_QUESTIONS } from '@/data/questions';

/**
 * Decode HTML entities returned by the OpenTDB API
 * (e.g. &quot; → " | &#039; → ' | &amp; → &)
 * Runs client-side only — safe because this is only
 * ever called from a 'use client' component.
 */
function decodeHtml(str) {
  if (typeof document === 'undefined') return str;
  const el = document.createElement('textarea');
  el.innerHTML = str;
  return el.value;
}

/**
 * Turn one raw OpenTDB result into the shape the game expects:
 * { text: string, answers: string[], correct: number }
 */
function transform(raw) {
  const correctDecoded = decodeHtml(raw.correct_answer);
  const allAnswers     = shuffle([
    correctDecoded,
    ...raw.incorrect_answers.map(decodeHtml),
  ]);
  return {
    text:    decodeHtml(raw.question),
    answers: allAnswers,
    correct: allAnswers.indexOf(correctDecoded),
  };
}

/**
 * Fetch 5 multiple-choice questions from OpenTDB.
 *
 * Maps the game difficulty directly to the API difficulty param so
 * Easy/Medium/Hard controls both the timer AND question difficulty.
 *
 * OpenTDB response codes:
 *   0 – success
 *   1 – no results for these params
 *   5 – rate limit (max 1 request / 5 s)
 */
export async function fetchQuestions({ amount = 5, difficulty = 'medium' } = {}) {
  const url = new URL('https://opentdb.com/api.php');
  url.searchParams.set('amount',     String(amount));
  url.searchParams.set('difficulty', difficulty);        // easy | medium | hard
  url.searchParams.set('type',       'multiple');

  const res = await fetch(url.toString(), { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`OpenTDB network error: HTTP ${res.status}`);
  }

  const data = await res.json();

  if (data.response_code !== 0) {
    throw new Error(`OpenTDB returned response_code ${data.response_code}`);
  }

  return data.results.map(transform);
}

/**
 * Fallback: return 5 shuffled questions from the local pool.
 * Used when the API is unreachable or rate-limited.
 */
export function localQuestions() {
  return shuffle([...ALL_QUESTIONS]).slice(0, 5);
}
