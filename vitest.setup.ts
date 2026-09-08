import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// RTL's automatic cleanup only self-registers when it detects Jest/Vitest
// globals; we import test functions explicitly instead of using
// `test.globals: true`, so without this, DOM from one test would leak into
// the next within the same file (e.g. two renders both matching
// getByRole('list')).
afterEach(() => {
  cleanup();
});
