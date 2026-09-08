import { describe, expect, it } from 'vitest';
import {
  calculateStars,
  initialProgress,
  isWorldUnlocked,
  recordBuildResult,
  recordWorldResult,
  updateStreak,
} from './progress';

describe('calculateStars', () => {
  it('returns 0 for a non-positive max score', () => {
    expect(calculateStars(10, 0)).toBe(0);
  });

  it('grades on percentage of max score', () => {
    expect(calculateStars(0, 100)).toBe(0);
    expect(calculateStars(30, 100)).toBe(1);
    expect(calculateStars(60, 100)).toBe(2);
    expect(calculateStars(85, 100)).toBe(3);
    expect(calculateStars(100, 100)).toBe(3);
  });
});

describe('isWorldUnlocked', () => {
  it('always unlocks the first world', () => {
    expect(isWorldUnlocked('windows', initialProgress)).toBe(true);
  });

  it('locks a later world until the previous one is completed', () => {
    expect(isWorldUnlocked('apps', initialProgress)).toBe(false);
  });

  it('unlocks the next world once the previous one is marked complete', () => {
    const progress = recordWorldResult(initialProgress, 'windows', 100, 100);
    expect(isWorldUnlocked('apps', progress)).toBe(true);
  });
});

describe('recordWorldResult', () => {
  it('keeps the best score and best star count across attempts', () => {
    const first = recordWorldResult(initialProgress, 'windows', 50, 100);
    const second = recordWorldResult(first, 'windows', 30, 100);
    expect(second.worlds.windows?.bestScore).toBe(50);
    expect(second.worlds.windows?.stars).toBe(1);
  });

  it('marks the world complete once at least one star is earned', () => {
    const progress = recordWorldResult(initialProgress, 'windows', 40, 100);
    expect(progress.worlds.windows?.complete).toBe(true);
  });

  it('does not mark a world complete on a zero-star attempt', () => {
    const progress = recordWorldResult(initialProgress, 'windows', 0, 100);
    expect(progress.worlds.windows?.complete).toBe(false);
  });
});

describe('recordBuildResult', () => {
  it('tracks a best score independent from world progress', () => {
    const progress = recordBuildResult(initialProgress, 400, 800);
    expect(progress.build?.bestScore).toBe(400);
    expect(progress.worlds).toEqual({});
  });
});

describe('updateStreak', () => {
  // Dates are built with the local-time constructor (year, monthIndex, day)
  // rather than parsed from an ISO string, which Date always interprets as
  // UTC — that would make these tests flaky depending on the machine/CI
  // runner's timezone, exactly the class of bug updateStreak itself fixes.
  it('starts a streak at 1 on the first play', () => {
    const progress = updateStreak(initialProgress, new Date(2026, 0, 1));
    expect(progress.streak).toBe(1);
    expect(progress.lastPlayedDay).toBe('2026-01-01');
  });

  it('does not increment the streak twice on the same day', () => {
    const day1 = updateStreak(initialProgress, new Date(2026, 0, 1, 8, 0));
    const stillDay1 = updateStreak(day1, new Date(2026, 0, 1, 20, 0));
    expect(stillDay1.streak).toBe(1);
  });

  it('increments the streak on the very next day', () => {
    const day1 = updateStreak(initialProgress, new Date(2026, 0, 1));
    const day2 = updateStreak(day1, new Date(2026, 0, 2));
    expect(day2.streak).toBe(2);
  });

  it('resets the streak to 1 after skipping a day', () => {
    const day1 = updateStreak(initialProgress, new Date(2026, 0, 1));
    const day3 = updateStreak(day1, new Date(2026, 0, 3));
    expect(day3.streak).toBe(1);
  });
});
