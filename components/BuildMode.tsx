'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Command, buildableCommands, splitIntoChunks } from '@/data/commands';
import { useLanguage } from '@/lib/i18n';

const FIRST_TRY_POINTS = 100;
const RETRY_POINTS = 50;
const DECOY_COUNT = 3;
const DRAG_THRESHOLD_PX = 8; // distance before a press counts as a drag

type Chunk = { id: string; text: string };
type DragState = { id: string; x: number; y: number };

type Props = {
  questions: Command[];
  onFinish: (score: number, maxScore: number) => void;
  onQuit: () => void;
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Draws "decoy" chunks from words used by other buildable commands, excluding
// the ones actually needed for the correct answer.
function generateDecoys(correctChunks: string[], count: number): string[] {
  const globalPool = Array.from(new Set(buildableCommands().flatMap((c) => splitIntoChunks(c.answer))));
  const candidates = globalPool.filter((word) => !correctChunks.includes(word));
  return shuffle(candidates).slice(0, count);
}

export default function BuildMode({ questions, onFinish, onQuit }: Props) {
  const { language, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [state, setState] = useState<'waiting' | 'correct' | 'incorrect' | 'incomplete'>('waiting');

  // Pointer-based drag (works for mouse AND touch), instead of the native
  // HTML5 drag-and-drop API which isn't reliably supported on touchscreens.
  const [drag, setDrag] = useState<DragState | null>(null);
  // These mirror state the mount-once pointer listener (below) needs to read
  // or write: since that listener isn't re-subscribed on every render (see
  // why below), it must go through refs instead of closing over state/props
  // that change over time, or it would act on stale data past the first
  // question.
  const dragRef = useRef<DragState | null>(null);
  const placedIdsRef = useRef<string[]>([]);
  const pressStart = useRef<{ id: string; x: number; y: number } | null>(null);
  const justFinishedDragging = useRef(false);

  function updateDrag(next: DragState | null) {
    dragRef.current = next;
    setDrag(next);
  }

  const question = questions[index];
  const maxScore = questions.length * FIRST_TRY_POINTS;

  const allChunks = useMemo<Chunk[]>(() => {
    const correct = splitIntoChunks(question.answer);
    const decoys = generateDecoys(correct, DECOY_COUNT);
    return shuffle([...correct, ...decoys]).map((text, i) => ({ id: `${question.id}-${i}-${text}`, text }));
  }, [question]);

  const correctChunksOrdered = useMemo(() => splitIntoChunks(question.answer), [question]);

  useEffect(() => {
    setPlacedIds([]);
    setAttempts(0);
    setState('waiting');
  }, [index]);

  useEffect(() => {
    placedIdsRef.current = placedIds;
  }, [placedIds]);

  function textOf(id: string) {
    return allChunks.find((c) => c.id === id)?.text ?? '';
  }

  function addChunk(id: string) {
    if (state === 'correct') return;
    setState('waiting');
    setPlacedIds((p) => [...p, id]);
  }

  function removeChunk(id: string) {
    if (state === 'correct') return;
    setState('waiting');
    setPlacedIds((p) => p.filter((x) => x !== id));
  }

  // Moves a chunk (from the pool or already placed) to a specific index in
  // the placed zone. Handles both "add" and "reorder" through one path.
  function moveChunk(movedId: string, targetIndex: number) {
    if (state === 'correct') return;
    setState('waiting');
    setPlacedIds((p) => {
      const withoutMoved = p.filter((id) => id !== movedId);
      const clampedIndex = Math.max(0, Math.min(targetIndex, withoutMoved.length));
      return [...withoutMoved.slice(0, clampedIndex), movedId, ...withoutMoved.slice(clampedIndex)];
    });
  }

  function handleClick(action: () => void) {
    // Ignore the click that immediately follows a drag (avoids a double effect).
    if (justFinishedDragging.current) return;
    action();
  }

  function handlePointerDown(e: React.PointerEvent, id: string) {
    if (state === 'correct') return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pressStart.current = { id, x: e.clientX, y: e.clientY };
  }

  // Global pointer listener while a drag might be happening: unifies mouse
  // and touch input via the Pointer Events API. Registered once (mount-only)
  // and reads/writes `dragRef` instead of depending on `drag`, so the
  // listeners aren't torn down and re-added on every pixel of movement.
  useEffect(() => {
    function onMove(e: PointerEvent) {
      const start = pressStart.current;
      if (!start) return;

      if (!dragRef.current) {
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
        updateDrag({ id: start.id, x: e.clientX, y: e.clientY });
      } else {
        updateDrag({ ...dragRef.current, x: e.clientX, y: e.clientY });
      }
    }

    function onUp(e: PointerEvent) {
      const start = pressStart.current;
      pressStart.current = null;
      const current = dragRef.current;
      if (!start || !current) return;

      dropAtPoint(current.id, e.clientX, e.clientY);
      updateDrag(null);
      justFinishedDragging.current = true;
      setTimeout(() => {
        justFinishedDragging.current = false;
      }, 0);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dropAtPoint(id: string, x: number, y: number) {
    const elementBelow = document.elementFromPoint(x, y);
    const targetChunk = elementBelow?.closest<HTMLElement>('[data-chunk-id]');
    const targetZone = elementBelow?.closest<HTMLElement>('[data-dropzone]');
    const currentPlacedIds = placedIdsRef.current;

    if (targetZone?.dataset.dropzone === 'pool') {
      removeChunk(id);
      return;
    }
    if (targetZone?.dataset.dropzone === 'placed') {
      if (targetChunk && targetChunk.dataset.chunkId !== id) {
        const targetIndex = currentPlacedIds.indexOf(targetChunk.dataset.chunkId!);
        moveChunk(id, targetIndex === -1 ? currentPlacedIds.length : targetIndex);
      } else {
        moveChunk(id, currentPlacedIds.length);
      }
    }
  }

  function check() {
    if (placedIds.length < correctChunksOrdered.length) {
      setState('incomplete');
      return;
    }
    const attempt = placedIds.map(textOf).join(' ');
    if (attempt === question.answer) {
      const points = attempts === 0 ? FIRST_TRY_POINTS : RETRY_POINTS;
      setScore((s) => s + points);
      setState('correct');
    } else {
      setAttempts((a) => a + 1);
      setState('incorrect');
    }
  }

  function retry() {
    setPlacedIds([]);
    setState('waiting');
  }

  function next() {
    if (index + 1 >= questions.length) {
      onFinish(score, maxScore);
      return;
    }
    setIndex((i) => i + 1);
  }

  const availableChunks = allChunks.filter((c) => !placedIds.includes(c.id));

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-6">
      {drag && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-1.5 rounded-md bg-accent text-background font-mono text-sm font-bold shadow-lg"
          style={{ left: drag.x, top: drag.y, transform: 'translate(-50%, -50%)' }}
        >
          {textOf(drag.id)}
        </div>
      )}

      <div className="w-full max-w-2xl flex items-center justify-between font-mono text-sm">
        <button onClick={onQuit} className="text-slate-400 hover:text-slate-200">
          {t.build.quit}
        </button>
        <div className="text-accentSecondary">
          {t.quiz.score} {score}
        </div>
      </div>

      <div
        className={`panel w-full max-w-2xl p-6 sm:p-8 ${
          state === 'incorrect' ? 'animate-shake border-danger' : ''
        } ${state === 'correct' ? 'animate-pulseSuccess border-accent' : ''}`}
      >
        <p className="font-mono text-xs text-slate-500 uppercase tracking-wide mb-2">
          {t.quiz.question} {index + 1} / {questions.length}
        </p>
        <p className="text-lg sm:text-xl text-slate-100 mb-2">{question.prompt[language]}</p>
        <p className="text-xs text-slate-500 mb-6">{t.build.instructions}</p>

        <div
          data-dropzone="placed"
          className="min-h-16 flex flex-wrap gap-2 items-center p-3 rounded-lg bg-panelLight border border-dashed border-border mb-4"
        >
          {placedIds.length === 0 && <span className="text-sm text-slate-600 font-mono">…</span>}
          {placedIds.map((id) => (
            <button
              key={id}
              data-chunk-id={id}
              onPointerDown={(e) => handlePointerDown(e, id)}
              onClick={() => handleClick(() => removeChunk(id))}
              disabled={state === 'correct'}
              className={`px-3 py-1.5 rounded-md bg-accent/20 border border-accent text-accent font-mono text-sm select-none touch-none cursor-grab active:cursor-grabbing ${
                drag?.id === id ? 'opacity-30' : ''
              }`}
            >
              {textOf(id)}
            </button>
          ))}
        </div>

        <div data-dropzone="pool" className="flex flex-wrap gap-2 mb-6">
          {availableChunks.map((chunk) => (
            <button
              key={chunk.id}
              data-chunk-id={chunk.id}
              onPointerDown={(e) => handlePointerDown(e, chunk.id)}
              onClick={() => handleClick(() => addChunk(chunk.id))}
              disabled={state === 'correct'}
              className={`px-3 py-1.5 rounded-md bg-panelLight border border-border text-slate-200 font-mono text-sm hover:border-accentSecondary select-none touch-none cursor-grab active:cursor-grabbing ${
                drag?.id === chunk.id ? 'opacity-30' : ''
              }`}
            >
              {chunk.text}
            </button>
          ))}
        </div>

        <div aria-live="polite">
          {state === 'incomplete' && <p className="font-mono text-sm text-warning mb-3">{t.build.incomplete}</p>}
          {state === 'incorrect' && <p className="font-mono text-sm text-danger mb-3">{t.build.incorrect}</p>}
        </div>

        {state !== 'correct' && (
          <div className="flex gap-3">
            <button onClick={check} className="btn-primary">
              {t.build.check}
            </button>
            {state === 'incorrect' && (
              <button onClick={retry} className="btn-secondary">
                {t.build.retry}
              </button>
            )}
          </div>
        )}

        {state === 'correct' && (
          <div className="space-y-3">
            <p className="font-mono text-sm text-accent">
              {t.build.exact} <span className="text-slate-500">({attempts === 0 ? t.build.firstTry : t.build.afterRetry})</span>
            </p>
            <p className="text-sm text-slate-400">{question.explanation[language]}</p>
            <button onClick={next} className="btn-primary">
              {index + 1 >= questions.length ? t.build.seeResult : t.build.continueLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
