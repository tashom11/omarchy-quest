import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithLanguage } from '../test-utils';
import { initialProgress, recordWorldResult } from '@/lib/progress';
import WorldSelect from './WorldSelect';

// Scoped to the world list itself: PageHeader also renders a "back" button,
// which would otherwise pollute a page-wide getAllByRole('button') query.
function getWorldButtons() {
  return within(screen.getByRole('list')).getAllByRole('button');
}

describe('WorldSelect', () => {
  it('disables and marks locked every world except the first when there is no progress', () => {
    const onSelectWorld = vi.fn();
    renderWithLanguage(
      <WorldSelect progress={initialProgress} onSelectWorld={onSelectWorld} onBack={() => {}} />,
    );

    // "windows" (first world) is unlocked: its button is enabled and clicking it fires.
    const buttons = getWorldButtons();
    const firstWorldButton = buttons[0];
    expect(firstWorldButton).not.toBeDisabled();
    fireEvent.click(firstWorldButton);
    expect(onSelectWorld).toHaveBeenCalledWith('windows');

    // Every other world button is disabled and shows the locked message.
    const lockedButtons = buttons.slice(1);
    expect(lockedButtons.length).toBeGreaterThan(0);
    for (const button of lockedButtons) {
      expect(button).toBeDisabled();
    }
    expect(onSelectWorld).toHaveBeenCalledTimes(1);
  });

  it('unlocks the second world once the first is marked complete', () => {
    const progress = recordWorldResult(initialProgress, 'windows', 100, 100);
    const onSelectWorld = vi.fn();
    renderWithLanguage(<WorldSelect progress={progress} onSelectWorld={onSelectWorld} onBack={() => {}} />);

    const buttons = getWorldButtons();
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).not.toBeDisabled();

    fireEvent.click(buttons[1]);
    expect(onSelectWorld).toHaveBeenCalledWith('apps');
  });
});
