'use client';

import { useEffect, useMemo, useState } from 'react';
import { Command } from '@/data/commands';
import { useLanguage } from '@/lib/i18n';

const TIME_PER_QUESTION = 20; // seconds
const STARTING_LIVES = 3;
const BASE_POINTS = 100;
const MAX_BONUS_POINTS = 50;

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

export default function QuizRound({ questions, onFinish, onQuit }: Props) {
  const { language, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [combo, setCombo] = useState(0);
  const [timer, setTimer] = useState(TIME_PER_QUESTION);
  const [answerState, setAnswerState] = useState<'waiting' | 'correct' | 'incorrect'>('waiting');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  // Lets a player stop the countdown entirely (WCAG 2.2.1 Timing Adjustable):
  // a hard per-question timer with no way to pause/extend it would otherwise
  // be a real barrier for anyone who needs more time to read or decide.
  const [isPaused, setIsPaused] = useState(false);

  const question = questions[index];
  const maxScore = questions.length * (BASE_POINTS + MAX_BONUS_POINTS);

  const choices = useMemo(
    () => shuffle([question.answer, ...question.distractors]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question.id],
  );

  // Per-question timer: resets on every new question.
  useEffect(() => {
    setTimer(TIME_PER_QUESTION);
    setAnswerState('waiting');
    setSelectedChoice(null);
    setIsPaused(false);
  }, [index]);

  useEffect(() => {
    if (answerState !== 'waiting' || isPaused) return undefined;
    if (timer <= 0) {
      submit(null);
      return undefined;
    }
    const timeout = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, answerState, isPaused]);

  function submit(choice: string | null) {
    if (answerState !== 'waiting') return;
    setSelectedChoice(choice);
    const isCorrect = choice === question.answer;

    if (isCorrect) {
      const speedBonus = Math.round((timer / TIME_PER_QUESTION) * MAX_BONUS_POINTS);
      setScore((s) => s + BASE_POINTS + speedBonus);
      setCombo((c) => c + 1);
      setAnswerState('correct');
    } else {
      setLives((v) => v - 1);
      setCombo(0);
      setAnswerState('incorrect');
    }
  }

  function next(remainingLives: number) {
    if (remainingLives <= 0 || index + 1 >= questions.length) {
      onFinish(score, maxScore);
      return;
    }
    setIndex((i) => i + 1);
  }

  const missHumor = useMemo(
    () => t.quiz.missHumor[Math.floor(Math.random() * t.quiz.missHumor.length)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, language],
  );

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-6">
      <div className="w-full max-w-2xl flex items-center justify-between font-mono text-sm">
        <button onClick={onQuit} className="text-slate-400 hover:text-slate-200">
          {t.quiz.quit}
        </button>
        <div className="flex items-center gap-1.5 text-lg" aria-label={`${lives} / ${STARTING_LIVES} lives`}>
          {Array.from({ length: STARTING_LIVES }, (_, i) => (
            <span key={i} aria-hidden="true" className={i < lives ? 'text-danger' : 'text-border'}>
              ♥
            </span>
          ))}
        </div>
        <div className="text-accentSecondary">
          {t.quiz.score} {score}
        </div>
      </div>

      <div className="w-full max-w-2xl flex items-center gap-3">
        <div
          className="flex-1 h-1.5 bg-panelLight rounded-full overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={TIME_PER_QUESTION}
          aria-valuenow={timer}
          aria-label="Time remaining"
        >
          <div
            className="h-full bg-accent transition-all duration-1000 ease-linear"
            style={{ width: `${(timer / TIME_PER_QUESTION) * 100}%` }}
          />
        </div>
        {answerState === 'waiting' && (
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="font-mono text-xs text-slate-400 hover:text-slate-200 whitespace-nowrap"
            aria-pressed={isPaused}
          >
            {isPaused ? t.quiz.resume : t.quiz.pause}
          </button>
        )}
      </div>

      {isPaused && answerState === 'waiting' && (
        <p className="font-mono text-xs text-slate-500" role="status">
          {t.quiz.paused}
        </p>
      )}

      {combo >= 3 && answerState === 'waiting' && (
        <p className="font-mono text-warning text-sm animate-pulseSuccess">
          🔥 {t.quiz.combo} x{combo}
        </p>
      )}

      <div
        className={`panel w-full max-w-2xl p-6 sm:p-8 ${
          answerState === 'incorrect' ? 'animate-shake border-danger' : ''
        } ${answerState === 'correct' ? 'animate-pulseSuccess border-accent' : ''}`}
      >
        <p className="font-mono text-xs text-slate-500 uppercase tracking-wide mb-2">
          {t.quiz.question} {index + 1} / {questions.length}
        </p>
        <p className="text-lg sm:text-xl text-slate-100 mb-6">{question.prompt[language]}</p>

        <div className="grid grid-cols-1 gap-3">
          {choices.map((choice) => {
            const isCorrectAnswer = choice === question.answer;
            const isSelected = choice === selectedChoice;
            let style = 'btn-secondary text-left';

            if (answerState !== 'waiting') {
              if (isCorrectAnswer) style = 'text-left px-6 py-3 rounded-lg bg-accent/20 border border-accent text-accent font-mono';
              else if (isSelected) style = 'text-left px-6 py-3 rounded-lg bg-danger/20 border border-danger text-danger font-mono';
              else style = 'text-left px-6 py-3 rounded-lg bg-panelLight border border-border text-slate-500 font-mono';
            }

            return (
              <button key={choice} onClick={() => submit(choice)} disabled={answerState !== 'waiting'} className={style}>
                {choice}
              </button>
            );
          })}
        </div>

        <div aria-live="polite">
          {answerState !== 'waiting' && (
            <div className="mt-6 space-y-3">
              <p className={`font-mono text-sm ${answerState === 'correct' ? 'text-accent' : 'text-danger'}`}>
                {answerState === 'correct' ? t.quiz.correct : `${t.quiz.wrong} ${missHumor}`}
              </p>
              <p className="text-sm text-slate-400">{question.explanation[language]}</p>
              <button onClick={() => next(lives)} className="btn-primary">
                {index + 1 >= questions.length || lives <= 0 ? t.quiz.seeResult : t.quiz.nextQuestion}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
