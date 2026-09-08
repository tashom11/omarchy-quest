'use client';

import { useCallback, useEffect, useState } from 'react';

// Generic hook to persist a piece of state in the browser's localStorage.
// No server sync: everything stays local to the player's device.
//
// `isValid`, if given, is a runtime type guard checked against whatever was
// parsed from storage. A syntactically-valid-but-wrong-shape value (e.g. a
// hand-edited or corrupted entry) is treated the same as a missing one and
// silently falls back to `defaultValue`, instead of being cast blindly and
// potentially crashing the app later when code reads an unexpected field.
export function useLocalStorage<T>(key: string, defaultValue: T, isValid?: (value: unknown) => value is T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [ready, setReady] = useState(false);

  // Initial read is client-only (SSR / static export has no window).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        if (!isValid || isValid(parsed)) {
          setValue(parsed as T);
        }
      }
    } catch {
      // Malformed JSON or localStorage unavailable (strict private mode,
      // etc.): keep the default.
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
