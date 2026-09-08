'use client';

import { useCallback, useEffect, useState } from 'react';

// Generic hook to persist a piece of state in the browser's localStorage.
// No server sync: everything stays local to the player's device.
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [ready, setReady] = useState(false);

  // Initial read is client-only (SSR / static export has no window).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      // localStorage unavailable (strict private mode, etc.): keep the default.
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (nextValue: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const result = typeof nextValue === 'function' ? (nextValue as (p: T) => T)(previous) : nextValue;
        try {
          window.localStorage.setItem(key, JSON.stringify(result));
        } catch {
          // Storage full or unavailable: keep the state in memory regardless.
        }
        return result;
      });
    },
    [key],
  );

  return [value, set, ready] as const;
}
