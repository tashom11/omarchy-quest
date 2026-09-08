import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithLanguage } from '../test-utils';
import { initialProgress, recordWorldResult } from '@/lib/progress';
import HomeScreen from './HomeScreen';

const noop = () => {};

describe('HomeScreen', () => {
  beforeEach(() => {
    // jsdom reports navigator.language as 'en-US' by default, which would
    // otherwise trigger the real first-visit browser-language detection and
    // flip the UI to English. Force French explicitly so these assertions
    // aren't coupled to jsdom's locale default.
    window.localStorage.setItem('omarchy-quest-language', JSON.stringify('fr'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('hides the reset button when there is nothing to reset yet', () => {
    renderWithLanguage(
      <HomeScreen
        progress={initialProgress}
        ready={true}
        onPlay={noop}
        onChallenge={noop}
        onReference={noop}
        onBuild={noop}
        onReset={noop}
      />,
    );

    expect(screen.queryByText(/Réinitialiser ma progression/)).not.toBeInTheDocument();
  });

  it('only calls onReset after the confirm dialog is accepted', () => {
    const progress = recordWorldResult(initialProgress, 'windows', 100, 100);
    const onReset = vi.fn();
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderWithLanguage(
      <HomeScreen
        progress={progress}
        ready={true}
        onPlay={noop}
        onChallenge={noop}
        onReference={noop}
        onBuild={noop}
        onReset={onReset}
      />,
    );

    fireEvent.click(screen.getByText(/Réinitialiser ma progression/));
    expect(onReset).not.toHaveBeenCalled();

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.click(screen.getByText(/Réinitialiser ma progression/));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
