// Pure progress logic: star calculation, world unlocking, daily streak.
// Kept separate from components so it stays easy to reason about and test.

import { World, worldOrder } from '@/data/commands';

export type WorldResult = {
  bestScore: number;
  stars: 0 | 1 | 2 | 3;
  complete: boolean;
};

export type BuildResult = {
  bestScore: number;
  stars: 0 | 1 | 2 | 3;
};

export type Progress = {
  worlds: Partial<Record<World, WorldResult>>;
  build: BuildResult | null;
  lastPlayedDay: string | null; // ISO format "YYYY-MM-DD"
  streak: number;
};

export const initialProgress: Progress = {
  worlds: {},
  build: null,
  lastPlayedDay: null,
  streak: 0,
};

// Runtime shape check for a value read back from localStorage: a
// syntactically valid but wrong-shaped value (hand-edited, corrupted, or
// from a future/older incompatible version of this app) is treated as
// absent rather than trusted, since nothing else in the app validates it
// before use.
export function isProgress(value: unknown): value is Progress {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.worlds === 'object' &&
    v.worlds !== null &&
    (v.build === null || typeof v.build === 'object') &&
    (v.lastPlayedDay === null || typeof v.lastPlayedDay === 'string') &&
    typeof v.streak === 'number'
  );
}

// Simple scale: a round's theoretical max score depends on its question
// count. Stars are derived from the percentage of that max score reached.
export function calculateStars(score: number, maxScore: number): 0 | 1 | 2 | 3 {
  if (maxScore <= 0) return 0;
  const ratio = score / maxScore;
  if (ratio >= 0.85) return 3;
  if (ratio >= 0.6) return 2;
  if (ratio >= 0.3) return 1;
  return 0;
}

export function isWorldUnlocked(world: World, progress: Progress): boolean {
  const index = worldOrder.indexOf(world);
  if (index <= 0) return true; // the first world is always open
  const previousWorld = worldOrder[index - 1];
  return Boolean(progress.worlds[previousWorld]?.complete);
}

export function recordWorldResult(
  progress: Progress,
  world: World,
  score: number,
  maxScore: number,
): Progress {
  const stars = calculateStars(score, maxScore);
  const previous = progress.worlds[world];
  const bestScore = Math.max(score, previous?.bestScore ?? 0);
  const complete = stars > 0 || Boolean(previous?.complete);

  return {
    ...progress,
    worlds: {
      ...progress.worlds,
      [world]: {
        bestScore,
        stars: (Math.max(stars, previous?.stars ?? 0) as 0 | 1 | 2 | 3),
        complete,
      },
    },
  };
}

export function recordBuildResult(progress: Progress, score: number, maxScore: number): Progress {
  const stars = calculateStars(score, maxScore);
  const previous = progress.build;

  return {
    ...progress,
    build: {
      bestScore: Math.max(score, previous?.bestScore ?? 0),
      stars: (Math.max(stars, previous?.stars ?? 0) as 0 | 1 | 2 | 3),
    },
  };
}

// Formats a date as "YYYY-MM-DD" using the *local* calendar day, not UTC —
// using toISOString() here would shift the day boundary to midnight UTC,
// which can be many hours off from the player's own sense of "today"
// depending on their timezone.
function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Updates the daily streak: +1 if playing the day after the last played day,
// unchanged if already played today, reset to 1 if a day or more was skipped.
export function updateStreak(progress: Progress, today = new Date()): Progress {
  const todayKey = toLocalDateKey(today);
  if (progress.lastPlayedDay === todayKey) {
    return progress;
  }
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toLocalDateKey(yesterday);

  const newStreak = progress.lastPlayedDay === yesterdayKey ? progress.streak + 1 : 1;

  return {
    ...progress,
    lastPlayedDay: todayKey,
    streak: newStreak,
  };
}

export function unlockedWorldsForChallenge(progress: Progress): World[] {
  return worldOrder.filter((w) => isWorldUnlocked(w, progress));
}
