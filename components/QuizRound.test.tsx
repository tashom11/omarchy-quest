import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithLanguage } from '../test-utils';
import { Command } from '@/data/commands';
import QuizRound from './QuizRound';

const question: Command = {
  id: 'test-01',
  world: 'windows',
  prompt: { fr: 'Question test', en: 'Test question' },
  answer: 'Bonne réponse',
  distractors: ['Mauvaise 1', 'Mauvaise 2', 'Mauvaise 3'],
  explanation: { fr: 'Explication', en: 'Explanation' },
  difficulty: 1,
};

describe('QuizRound pause (WCAG 2.2.1 Timing Adjustable)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // jsdom reports navigator.language as 'en-US' by default, which would
    // otherwise trigger the real first-visit browser-language detection and
    // flip the UI to English. Force French explicitly for deterministic text.
    window.localStorage.setItem('omarchy-quest-language', JSON.stringify('fr'));
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
  });

  // Each tick's next setTimeout is only scheduled once React flushes the
  // effect that follows the previous tick's state update, so ticks must be
  // advanced one second (and one `act`) at a time rather than in one big
  // jump — a single advanceTimersByTime(3000) would fire only the timer
  // that already existed when it was called, not the ones it causes to be
  // (re)scheduled along the way.
  function advanceSeconds(seconds: number) {
    for (let i = 0; i < seconds; i += 1) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }
  }

  it('stops the countdown while paused, and resumes it afterwards', () => {
    renderWithLanguage(<QuizRound questions={[question]} onFinish={vi.fn()} onQuit={vi.fn()} />);

    const timerBar = screen.getByRole('progressbar', { name: 'Time remaining' });
    expect(timerBar).toHaveAttribute('aria-valuenow', '20');

    advanceSeconds(3);
    expect(timerBar).toHaveAttribute('aria-valuenow', '17');

    fireEvent.click(screen.getByText('⏸ Pause'));
    advanceSeconds(5);
    // Paused: no further decrease even though 5 more seconds "passed".
    expect(timerBar).toHaveAttribute('aria-valuenow', '17');

    fireEvent.click(screen.getByText('▶ Reprendre'));
    advanceSeconds(1);
    expect(timerBar).toHaveAttribute('aria-valuenow', '16');
  });
});
