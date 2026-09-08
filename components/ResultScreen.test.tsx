import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithLanguage } from '../test-utils';
import ResultScreen from './ResultScreen';

describe('ResultScreen', () => {
  it('renders the title as a heading, not a plain paragraph', () => {
    renderWithLanguage(
      <ResultScreen
        score={250}
        maxScore={300}
        stars={2}
        title="Windows & Hyprland"
        onReplay={vi.fn()}
        onMenu={vi.fn()}
      />,
    );

    // A heading element matters for screen-reader heading navigation —
    // this screen previously used a <p> for its title with no heading at all.
    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Windows & Hyprland');
  });

  it('exposes the star count via an accessible label', () => {
    renderWithLanguage(
      <ResultScreen score={100} maxScore={100} stars={3} title="Test" onReplay={vi.fn()} onMenu={vi.fn()} />,
    );

    expect(screen.getByLabelText('3 / 3 stars')).toBeInTheDocument();
  });
});
