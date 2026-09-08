'use client';

// Minimal translation system: a React context exposing the active language,
// a setter (persisted to localStorage), and a dictionary of UI strings.
// Quiz content (data/commands.ts) is translated separately via its own
// { fr, en } fields.

import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export type Language = 'fr' | 'en';

export type Dictionary = {
  home: {
    kicker: string;
    subtitle: string;
    worldsStat: string;
    scoreStat: string;
    streakStat: string;
    playButton: string;
    continueButton: string;
    challengeButton: string;
    referenceButton: string;
    siteButton: string;
    officialSource: string;
    buildButton: string;
  };
  build: {
    title: string;
    subtitle: string;
    quit: string;
    instructions: string;
    check: string;
    retry: string;
    continueLabel: string;
    seeResult: string;
    exact: string;
    incomplete: string;
    incorrect: string;
    firstTry: string;
    afterRetry: string;
  };
  reference: {
    title: string;
    subtitle: string;
    back: string;
  };
  worlds: {
    title: string;
    back: string;
    locked: string;
  };
  quiz: {
    quit: string;
    score: string;
    combo: string;
    question: string;
    correct: string;
    wrong: string;
    seeResult: string;
    nextQuestion: string;
    missHumor: string[];
  };
  result: {
    done: string;
    challengeTitle: string;
    possiblePoints: string;
    messages: Record<0 | 1 | 2 | 3, string>;
    replay: string;
    menu: string;
  };
  footer: {
    text: string;
  };
};

const dictionaries: Record<Language, Dictionary> = {
  fr: {
    home: {
      kicker: '$ ./bienvenue --sur omarchy',
      subtitle:
        "Apprends les raccourcis et commandes d'Omarchy en répondant vite et bien. 100% clavier, 0% souris (enfin presque).",
      worldsStat: 'Mondes complétés',
      scoreStat: 'Meilleur score',
      streakStat: 'Streak (jours)',
      playButton: '▶ Jouer',
      continueButton: '▶ Continuer',
      challengeButton: '🎲 Défi du jour',
      referenceButton: '📖 Commandes officielles',
      siteButton: '🌐 Site officiel Omarchy',
      officialSource: 'omarchy.org',
      buildButton: '🧩 Construis la commande',
    },
    build: {
      title: 'Construis la commande',
      subtitle:
        "Assemble les bons blocs dans l'ordre pour reformer la commande ou le raccourci. Zéro pression : autant d'essais que nécessaire.",
      quit: '✕ quitter',
      instructions: 'Clique ou glisse-dépose les blocs dans le bon ordre pour reconstruire la réponse.',
      check: 'Valider',
      retry: '↺ Réessayer',
      continueLabel: 'Continuer →',
      seeResult: 'Voir le résultat →',
      exact: '✔ Exactement ça !',
      incomplete: 'Assemble tous les blocs avant de valider.',
      incorrect: "✘ Pas tout à fait, l'ordre ou les blocs ne sont pas bons.",
      firstTry: 'du premier coup',
      afterRetry: 'après un ou deux essais',
    },
    reference: {
      title: 'Commandes officielles',
      subtitle: 'Toutes les commandes et raccourcis couverts par le jeu, regroupés par monde.',
      back: '← retour',
    },
    worlds: {
      title: 'Choisis un monde',
      back: '← retour',
      locked: 'Termine le monde précédent pour débloquer',
    },
    quiz: {
      quit: '✕ quitter',
      score: 'score',
      combo: 'combo',
      question: 'Question',
      correct: '✔ Exact !',
      wrong: '✘ Raté.',
      seeResult: 'Voir le résultat →',
      nextQuestion: 'Question suivante →',
      missHumor: [
        "Oups, c'est le genre d'erreur qui te fait relire la doc à 2h du mat.",
        'Presque... façon de parler.',
        "Ton clavier n'a pas apprécié ce choix.",
        'Même un `rm -rf` accidentel fait moins mal.',
      ],
    },
    result: {
      done: 'terminé',
      challengeTitle: 'Défi du jour',
      possiblePoints: 'points possibles',
      messages: {
        0: "Retour au clavier, l'ami. La doc `omarchy` t'attend.",
        1: 'Pas mal, mais tes doigts hésitent encore.',
        2: 'Solide ! Tu commences à penser en raccourcis.',
        3: 'Score parfait. Tu es prêt à jeter ta souris.',
      },
      replay: '↻ Rejouer',
      menu: '🏠 Menu',
    },
    footer: {
      text: "Omarchy Quest est un projet indépendant conçu par un contributeur de la communauté, sans affiliation avec l'équipe officielle d'Omarchy.",
    },
  },
  en: {
    home: {
      kicker: '$ ./welcome --to omarchy',
      subtitle:
        "Learn Omarchy's shortcuts and commands by answering fast and right. 100% keyboard, 0% mouse (almost).",
      worldsStat: 'Worlds completed',
      scoreStat: 'Best score',
      streakStat: 'Streak (days)',
      playButton: '▶ Play',
      continueButton: '▶ Continue',
      challengeButton: '🎲 Daily challenge',
      referenceButton: '📖 Official commands',
      siteButton: '🌐 Omarchy official site',
      officialSource: 'omarchy.org',
      buildButton: '🧩 Build the command',
    },
    build: {
      title: 'Build the command',
      subtitle:
        'Assemble the right blocks in order to rebuild the command or shortcut. No pressure: as many tries as you need.',
      quit: '✕ quit',
      instructions: 'Click or drag the blocks in the right order to rebuild the answer.',
      check: 'Check',
      retry: '↺ Try again',
      continueLabel: 'Continue →',
      seeResult: 'See result →',
      exact: "✔ That's exactly it!",
      incomplete: 'Assemble every block before checking.',
      incorrect: "✘ Not quite, the order or the blocks aren't right.",
      firstTry: 'on the first try',
      afterRetry: 'after a try or two',
    },
    reference: {
      title: 'Official commands',
      subtitle: 'Every command and shortcut covered by the game, grouped by world.',
      back: '← back',
    },
    worlds: {
      title: 'Pick a world',
      back: '← back',
      locked: 'Finish the previous world to unlock',
    },
    quiz: {
      quit: '✕ quit',
      score: 'score',
      combo: 'combo',
      question: 'Question',
      correct: '✔ Correct!',
      wrong: '✘ Wrong.',
      seeResult: 'See result →',
      nextQuestion: 'Next question →',
      missHumor: [
        "Ouch, that's the kind of mistake that sends you back to the docs at 2am.",
        'So close... in a manner of speaking.',
        'Your keyboard did not approve of that choice.',
        'Even an accidental `rm -rf` hurts less.',
      ],
    },
    result: {
      done: 'done',
      challengeTitle: 'Daily challenge',
      possiblePoints: 'points possible',
      messages: {
        0: 'Back to the keyboard, friend. The `omarchy` docs are waiting.',
        1: 'Not bad, but your fingers still hesitate.',
        2: "Solid! You're starting to think in shortcuts.",
        3: 'Perfect score. Time to throw away your mouse.',
      },
      replay: '↻ Replay',
      menu: '🏠 Menu',
    },
    footer: {
      text: 'Omarchy Quest is an independent project built by a community contributor, with no affiliation to the official Omarchy team.',
    },
  },
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (l: Language) => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useLocalStorage<Language>('omarchy-quest-language', 'fr');

  // Keeps the document's lang attribute in sync (WCAG 3.1.1 / RGAA 8.3),
  // since the language is a client-side preference, not a server route.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, t: dictionaries[language] }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside <LanguageProvider>');
  }
  return ctx;
}
