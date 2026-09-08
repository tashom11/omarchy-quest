'use client';

import { useMemo, useState } from 'react';
import { Command, buildableCommands, commandsByWorld, commands, worldInfo, World } from '@/data/commands';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  calculateStars,
  initialProgress,
  isProgress,
  Progress,
  recordBuildResult,
  recordWorldResult,
  unlockedWorldsForChallenge,
  updateStreak,
} from '@/lib/progress';
import { LanguageProvider, useLanguage } from '@/lib/i18n';
import HomeScreen from '@/components/HomeScreen';
import WorldSelect from '@/components/WorldSelect';
import QuizRound from '@/components/QuizRound';
import BuildMode from '@/components/BuildMode';
import ResultScreen from '@/components/ResultScreen';
import CommandReference from '@/components/CommandReference';
import LanguageSelector from '@/components/LanguageSelector';
import Footer from '@/components/Footer';

type View = 'home' | 'worlds' | 'quiz' | 'build' | 'result' | 'reference';
type RoundType = 'world' | 'challenge' | 'build';

const CHALLENGE_QUESTION_COUNT = 10;
const BUILD_QUESTION_COUNT = 8;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function GamePage() {
  return (
    <LanguageProvider>
      <a href="#main-content" className="sr-only-focusable">
        Skip to main content
      </a>
      <LanguageSelector />
      <main id="main-content">
        <Game />
      </main>
      <Footer />
    </LanguageProvider>
  );
}

function Game() {
  const { language, t } = useLanguage();
  const [progress, setProgress, ready] = useLocalStorage<Progress>(
    'omarchy-quest-progress',
    initialProgress,
    isProgress,
  );
  const [view, setView] = useState<View>('home');
  const [activeWorld, setActiveWorld] = useState<World | null>(null);
  const [roundType, setRoundType] = useState<RoundType>('world');
  const [roundQuestions, setRoundQuestions] = useState<Command[]>([]);
  const [lastResult, setLastResult] = useState({ score: 0, maxScore: 1 });

  function startWorld(world: World) {
    setActiveWorld(world);
    setRoundType('world');
    setRoundQuestions(shuffle(commandsByWorld(world)));
    setView('quiz');
  }

  function startChallenge() {
    const openWorlds = unlockedWorldsForChallenge(progress);
    const pool = commands.filter((c) => openWorlds.includes(c.world));
    setActiveWorld(null);
    setRoundType('challenge');
    setRoundQuestions(shuffle(pool).slice(0, CHALLENGE_QUESTION_COUNT));
    setView('quiz');
  }

  function startBuild() {
    setActiveWorld(null);
    setRoundType('build');
    setRoundQuestions(shuffle(buildableCommands()).slice(0, BUILD_QUESTION_COUNT));
    setView('build');
  }

  function finishRound(score: number, maxScore: number) {
    setLastResult({ score, maxScore });
    setProgress((p) => {
      const withStreak = updateStreak(p);
      if (roundType === 'build') {
        return recordBuildResult(withStreak, score, maxScore);
      }
      if (roundType === 'challenge' || !activeWorld) return withStreak;
      return recordWorldResult(withStreak, activeWorld, score, maxScore);
    });
    setView('result');
  }

  const resultStars = useMemo(() => calculateStars(lastResult.score, lastResult.maxScore), [lastResult]);

  function replay() {
    if (roundType === 'build') startBuild();
    else if (roundType === 'challenge') startChallenge();
    else if (activeWorld) startWorld(activeWorld);
  }

  function returnToMenuAfterRound() {
    setView(roundType === 'world' ? 'worlds' : 'home');
  }

  if (view === 'home') {
    return (
      <HomeScreen
        progress={progress}
        ready={ready}
        onPlay={() => setView('worlds')}
        onChallenge={startChallenge}
        onReference={() => setView('reference')}
        onBuild={startBuild}
        onReset={() => setProgress(initialProgress)}
      />
    );
  }

  if (view === 'reference') {
    return <CommandReference onBack={() => setView('home')} />;
  }

  if (view === 'worlds') {
    return <WorldSelect progress={progress} onSelectWorld={startWorld} onBack={() => setView('home')} />;
  }

  if (view === 'quiz') {
    return (
      <QuizRound
        questions={roundQuestions}
        onFinish={finishRound}
        onQuit={() => setView(roundType === 'challenge' ? 'home' : 'worlds')}
      />
    );
  }

  if (view === 'build') {
    return <BuildMode questions={roundQuestions} onFinish={finishRound} onQuit={() => setView('home')} />;
  }

  const resultTitle =
    roundType === 'build'
      ? t.build.title
      : roundType === 'challenge'
        ? t.result.challengeTitle
        : activeWorld
          ? worldInfo[activeWorld].title[language]
          : '';

  return (
    <ResultScreen
      score={lastResult.score}
      maxScore={lastResult.maxScore}
      stars={resultStars}
      title={resultTitle}
      onReplay={replay}
      onMenu={returnToMenuAfterRound}
    />
  );
}
