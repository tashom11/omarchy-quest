import { render } from '@testing-library/react';
import { LanguageProvider } from '@/lib/i18n';

// Every component under test reads from LanguageContext, so tests render
// through this wrapper instead of calling RTL's `render` directly.
export function renderWithLanguage(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}
