// Central question bank for the game. Each entry describes a concrete
// situation, the correct Omarchy command/shortcut, and 3 plausible
// distractors. To add content, just append a new object to `commands`.
// No game logic here, data only.
//
// Commands/shortcuts themselves (answer, distractors) are not translated:
// they are technical commands, identical in FR and EN. Only the pedagogical
// text (prompt, explanation) is bilingual.

export type World = 'windows' | 'apps' | 'themes' | 'system' | 'network' | 'screenshots';

export type BilingualText = { fr: string; en: string };

export type Command = {
  id: string;
  world: World;
  prompt: BilingualText; // the light-hearted situation prompt
  answer: string; // the correct answer (shortcut or CLI command)
  distractors: [string, string, string]; // 3 wrong-but-plausible answers
  explanation: BilingualText; // short teaching note shown after answering
  difficulty: 1 | 2 | 3;
};

// Display metadata for each world (title, icon, short description).
export const worldInfo: Record<World, { title: BilingualText; icon: string; description: BilingualText }> = {
  windows: {
    title: { fr: 'Fenêtres & Hyprland', en: 'Windows & Hyprland' },
    icon: '🪟',
    description: {
      fr: 'Dompter le compositeur façon ninja du clavier',
      en: 'Tame the compositor like a keyboard ninja',
    },
  },
  apps: {
    title: { fr: 'Applications', en: 'Applications' },
    icon: '🚀',
    description: {
      fr: 'Lancer, ouvrir, jongler entre tes outils',
      en: 'Launch, open, and juggle your tools',
    },
  },
  themes: {
    title: { fr: 'Thèmes', en: 'Themes' },
    icon: '🎨',
    description: {
      fr: 'Relooker le bureau sans toucher la souris',
      en: 'Re-skin the desktop without touching the mouse',
    },
  },
  system: {
    title: { fr: 'Système & CLI', en: 'System & CLI' },
    icon: '🛠️',
    description: {
      fr: 'Les commandes `omarchy` qui sauvent la vie',
      en: 'The `omarchy` commands that save the day',
    },
  },
  network: {
    title: { fr: 'Réseau & Bluetooth', en: 'Network & Bluetooth' },
    icon: '📶',
    description: {
      fr: 'Se connecter sans quitter le clavier',
      en: 'Connect without leaving the keyboard',
    },
  },
  screenshots: {
    title: { fr: 'Capture d’écran', en: 'Screenshots' },
    icon: '📸',
    description: {
      fr: 'Immortaliser ton setup en un clin d’œil',
      en: 'Immortalize your setup in a flash',
    },
  },
};

// World unlock order (the first world is always open).
export const worldOrder: World[] = ['windows', 'apps', 'themes', 'system', 'network', 'screenshots'];

export const commands: Command[] = [
  // ───────────────────────── WINDOWS / HYPRLAND ─────────────────────────
  {
    id: 'win-01',
    world: 'windows',
    prompt: {
      fr: 'Tu veux basculer la disposition entre mosaïque et flottant pour la fenêtre active.',
      en: 'You want to toggle the active window between tiled and floating layout.',
    },
    answer: 'Super + T',
    distractors: ['Super + F', 'Super + Shift + Space', 'Super + V'],
    explanation: {
      fr: 'Super + T bascule la fenêtre active entre mode flottant et mode mosaïque (tiling).',
      en: 'Super + T toggles the active window between floating mode and tiling mode.',
    },
    difficulty: 1,
  },
  {
    id: 'win-02',
    world: 'windows',
    prompt: {
      fr: 'Tu veux déplacer le focus vers la fenêtre à ta gauche sans lâcher le clavier.',
      en: 'You want to move focus to the window on your left without leaving the keyboard.',
    },
    answer: 'Super + Left',
    distractors: ['Alt + Tab', 'Super + Ctrl + Left', 'Super + H then Enter'],
    explanation: {
      fr: 'Les flèches directionnelles combinées à Super déplacent le focus entre les fenêtres voisines.',
      en: 'Arrow keys combined with Super move focus between neighboring windows.',
    },
    difficulty: 1,
  },
  {
    id: 'win-03',
    world: 'windows',
    prompt: {
      fr: 'Une fenêtre te gonfle, tu veux la fermer immédiatement.',
      en: "A window is getting on your nerves and you want to close it right away.",
    },
    answer: 'Super + W',
    distractors: ['Alt + F4', 'Super + Q', 'Super + Backspace'],
    explanation: {
      fr: 'Super + W ferme proprement la fenêtre active (l’app peut encore demander confirmation).',
      en: 'Super + W cleanly closes the active window (the app may still ask for confirmation).',
    },
    difficulty: 1,
  },
  {
    id: 'win-04',
    world: 'windows',
    prompt: {
      fr: 'Tu veux passer une fenêtre en plein écran pour te concentrer.',
      en: 'You want to make a window fullscreen to focus.',
    },
    answer: 'Super + F',
    distractors: ['Super + Shift + F', 'F11', 'Super + Shift + Enter'],
    explanation: {
      fr: 'Super + F bascule le plein écran natif Hyprland pour la fenêtre active.',
      en: "Super + F toggles Hyprland's native fullscreen for the active window.",
    },
    difficulty: 1,
  },
  {
    id: 'win-05',
    world: 'windows',
    prompt: {
      fr: 'Tu veux passer sur le workspace numéro 3.',
      en: 'You want to switch to workspace number 3.',
    },
    answer: 'Super + 3',
    distractors: ['Ctrl + Alt + 3', 'Super + Tab + 3', 'Super + Shift + 3'],
    explanation: {
      fr: 'Super + [chiffre] bascule directement sur le workspace correspondant.',
      en: 'Super + [number] switches directly to the matching workspace.',
    },
    difficulty: 1,
  },
  {
    id: 'win-06',
    world: 'windows',
    prompt: {
      fr: 'Tu veux envoyer la fenêtre active vers le workspace 5 tout en restant sur ton workspace actuel.',
      en: 'You want to send the active window to workspace 5 while staying on your current workspace.',
    },
    answer: 'Super + Shift + 5',
    distractors: ['Super + 5', 'Super + Alt + 5', 'Super + Ctrl + Shift + 5'],
    explanation: {
      fr: 'Ajouter Shift à Super + [chiffre] déplace la fenêtre vers ce workspace sans t’y téléporter.',
      en: 'Adding Shift to Super + [number] moves the window to that workspace without teleporting you there.',
    },
    difficulty: 2,
  },
  {
    id: 'win-07',
    world: 'windows',
    prompt: {
      fr: 'Tu veux passer en plein écran mais en gardant la fenêtre dans la grille (tiled), pas en plein écran classique par-dessus tout.',
      en: 'You want to go fullscreen while keeping the window inside the tiling grid, not a classic fullscreen on top of everything.',
    },
    answer: 'Super + Ctrl + F',
    distractors: ['Super + Alt + F', 'Super + Shift + F', 'Super + Shift + Ctrl + F'],
    explanation: {
      fr: 'Super + Ctrl + F bascule le "tiled fullscreen" : la fenêtre reste dans la disposition en mosaïque.',
      en: 'Super + Ctrl + F toggles "tiled fullscreen": the window stays within the tiling layout.',
    },
    difficulty: 2,
  },
  {
    id: 'win-08',
    world: 'windows',
    prompt: {
      fr: 'Tu veux sortir une fenêtre précise (une popup mal placée par exemple) du tiling, la centrer et l’épingler à taille fixe par-dessus.',
      en: 'You want to pop a specific window (a misplaced popup, for example) out of the tiling layout, center it, and pin it at a fixed size on top.',
    },
    answer: 'Super + O',
    distractors: ['Super + Shift + Space', 'Super + Space', 'Super + P'],
    explanation: {
      fr: 'Super + O ("pop") bascule la fenêtre en flottant, la centre, la redimensionne à une taille fixe et l’épingle par-dessus tout le reste.',
      en: 'Super + O ("pop") toggles the window to floating, centers it, resizes it to a fixed size, and pins it on top of everything else.',
    },
    difficulty: 2,
  },

  // ───────────────────────── APPLICATIONS ─────────────────────────
  {
    id: 'app-01',
    world: 'apps',
    prompt: {
      fr: 'Tu veux ouvrir le lanceur d’applications pour taper le nom d’un logiciel.',
      en: "You want to open the app launcher to type a program's name.",
    },
    answer: 'Super + Alt + Space',
    distractors: ['Super + Space', 'Ctrl + Space', 'Super + R'],
    explanation: {
      fr: 'Super + Alt + Space ouvre directement le menu des applications (Super + Space seul ouvre le menu Omarchy général).',
      en: 'Super + Alt + Space opens the apps menu directly (Super + Space alone opens the general Omarchy menu).',
    },
    difficulty: 1,
  },
  {
    id: 'app-02',
    world: 'apps',
    prompt: {
      fr: 'Tu veux ouvrir un nouveau terminal directement depuis le bureau.',
      en: 'You want to open a new terminal directly from the desktop.',
    },
    answer: 'Super + Enter',
    distractors: ['Super + T', 'Ctrl + Alt + T', 'Super + Shift + Enter'],
    explanation: {
      fr: 'Super + Entrée ouvre le terminal par défaut configuré dans Omarchy (Alacritty/Ghostty selon setup).',
      en: 'Super + Enter opens the default terminal configured in Omarchy (Alacritty/Ghostty depending on setup).',
    },
    difficulty: 1,
  },
  {
    id: 'app-03',
    world: 'apps',
    prompt: {
      fr: 'Tu veux transformer un site web en app dédiée façon "web-app" isolée.',
      en: "You want to turn a website into a dedicated, isolated 'web-app'.",
    },
    answer: 'omarchy-webapp-install',
    distractors: ['omarchy webapp new', 'omarchy install webapp', 'omarchy-pwa-create'],
    explanation: {
      fr: 'Le script omarchy-webapp-install crée un lanceur dédié pour un site, isolé comme une vraie app.',
      en: 'The omarchy-webapp-install script creates a dedicated launcher for a site, isolated like a real app.',
    },
    difficulty: 2,
  },
  {
    id: 'app-04',
    world: 'apps',
    prompt: {
      fr: 'Tu veux basculer rapidement entre les fenêtres ouvertes façon "alt-tab" classique.',
      en: 'You want to quickly switch between open windows, classic alt-tab style.',
    },
    answer: 'Alt + Tab',
    distractors: ['Super + Tab', 'Super + Space', 'Super + Shift + Tab'],
    explanation: {
      fr: 'Alt + Tab fait basculer le focus vers la fenêtre suivante (Super + Tab, lui, change de workspace).',
      en: 'Alt + Tab cycles focus to the next window (Super + Tab instead switches workspace).',
    },
    difficulty: 1,
  },
  {
    id: 'app-05',
    world: 'apps',
    prompt: {
      fr: 'Plusieurs fenêtres sont bloquées, tu veux tout fermer d’un coup pour repartir de zéro.',
      en: 'Several windows are stuck, and you want to close everything at once to start fresh.',
    },
    answer: 'Ctrl + Alt + Delete',
    distractors: ['Super + Ctrl + Q', 'Super + Shift + Q', 'Alt + F4'],
    explanation: {
      fr: 'Ctrl + Alt + Delete ferme toutes les fenêtres ouvertes d’un coup.',
      en: 'Ctrl + Alt + Delete closes every open window at once.',
    },
    difficulty: 2,
  },
  {
    id: 'app-06',
    world: 'apps',
    prompt: {
      fr: 'Tu veux voir la liste de toutes les commandes disponibles côté Omarchy.',
      en: 'You want to see the list of all commands available on the Omarchy side.',
    },
    answer: 'omarchy commands',
    distractors: ['omarchy help', 'omarchy list', 'omarchy --all'],
    explanation: {
      fr: 'omarchy commands liste tous les scripts/commandes `omarchy-*` disponibles sur le système.',
      en: 'omarchy commands lists all the `omarchy-*` scripts/commands available on the system.',
    },
    difficulty: 1,
  },
  {
    id: 'app-07',
    world: 'apps',
    prompt: {
      fr: 'Tu veux ouvrir le gestionnaire de fichiers en un raccourci.',
      en: 'You want to open the file manager with a single shortcut.',
    },
    answer: 'Super + Shift + F',
    distractors: ['Super + F', 'Super + E', 'Super + N'],
    explanation: {
      fr: 'Super + Shift + F ouvre le gestionnaire de fichiers par défaut configuré dans Omarchy.',
      en: 'Super + Shift + F opens the default file manager configured in Omarchy.',
    },
    difficulty: 1,
  },

  // ───────────────────────── THEMES ─────────────────────────
  {
    id: 'theme-01',
    world: 'themes',
    prompt: {
      fr: 'Tu veux voir la liste de tous les thèmes visuels installés.',
      en: 'You want to see the list of all installed visual themes.',
    },
    answer: 'omarchy theme list',
    distractors: ['omarchy themes', 'omarchy list themes', 'omarchy theme --all'],
    explanation: {
      fr: 'omarchy theme list affiche tous les thèmes disponibles dans ~/.config/omarchy/themes.',
      en: 'omarchy theme list shows all themes available in ~/.config/omarchy/themes.',
    },
    difficulty: 1,
  },
  {
    id: 'theme-02',
    world: 'themes',
    prompt: {
      fr: 'Tu veux appliquer le thème "tokyo-night" immédiatement.',
      en: "You want to apply the 'tokyo-night' theme right now.",
    },
    answer: 'omarchy theme set tokyo-night',
    distractors: ['omarchy apply tokyo-night', 'omarchy theme tokyo-night', 'omarchy set-theme tokyo-night'],
    explanation: {
      fr: 'omarchy theme set <nom> applique le thème à tout l’environnement (terminal, bar, apps).',
      en: 'omarchy theme set <name> applies the theme across the whole environment (terminal, bar, apps).',
    },
    difficulty: 1,
  },
  {
    id: 'theme-03',
    world: 'themes',
    prompt: {
      fr: 'Tu veux ouvrir le sélecteur de thème au clavier, sans passer par le terminal.',
      en: 'You want to open the theme picker from the keyboard, without touching the terminal.',
    },
    answer: 'Super + Shift + Ctrl + Space',
    distractors: ['Super + Ctrl + Space', 'Super + T', 'Super + Alt + T'],
    explanation: {
      fr: 'Super + Shift + Ctrl + Espace ouvre le menu de thème (Super + Ctrl + Espace, lui, n’ouvre que le sélecteur de fond d’écran).',
      en: 'Super + Shift + Ctrl + Space opens the theme menu (Super + Ctrl + Space alone only opens the background switcher).',
    },
    difficulty: 2,
  },
  {
    id: 'theme-04',
    world: 'themes',
    prompt: {
      fr: 'Tu veux changer la police système utilisée dans le terminal et les menus.',
      en: 'You want to change the system font used in the terminal and menus.',
    },
    answer: 'omarchy font set <name>',
    distractors: ['omarchy theme font <name>', 'omarchy set font <name>', 'omarchy font apply <name>'],
    explanation: {
      fr: 'omarchy font set <nom> change la police globale de l’environnement.',
      en: "omarchy font set <name> changes the environment's global font.",
    },
    difficulty: 2,
  },
  {
    id: 'theme-05',
    world: 'themes',
    prompt: {
      fr: 'Tu veux réduire la température de couleur de l’écran le soir pour te reposer les yeux.',
      en: 'You want to reduce your screen’s color temperature in the evening to rest your eyes.',
    },
    answer: 'omarchy toggle nightlight',
    distractors: ['omarchy nightlight on', 'omarchy theme nightlight', 'omarchy toggle warm-mode'],
    explanation: {
      fr: 'omarchy toggle nightlight bascule le filtre de température de couleur de l’écran.',
      en: 'omarchy toggle nightlight switches the screen’s color-temperature filter on or off.',
    },
    difficulty: 3,
  },
  {
    id: 'theme-06',
    world: 'themes',
    prompt: {
      fr: 'Tu veux changer le fond d’écran sans changer le reste du thème.',
      en: 'You want to change the wallpaper without changing the rest of the theme.',
    },
    answer: 'omarchy theme bg next',
    distractors: ['omarchy wallpaper set', 'omarchy theme wallpaper', 'omarchy bg random'],
    explanation: {
      fr: 'omarchy theme bg next passe au fond d’écran suivant dans la collection du thème actif.',
      en: "omarchy theme bg next moves to the next wallpaper in the active theme's collection.",
    },
    difficulty: 2,
  },

  // ───────────────────────── SYSTEM / OMARCHY CLI ─────────────────────────
  {
    id: 'sys-01',
    world: 'system',
    prompt: {
      fr: 'Tu veux mettre à jour tout le système Omarchy en une commande.',
      en: 'You want to update the whole Omarchy system with a single command.',
    },
    answer: 'omarchy update',
    distractors: ['omarchy upgrade', 'omarchy sync', 'omarchy refresh'],
    explanation: {
      fr: 'omarchy update met à jour les paquets système et la configuration Omarchy elle-même.',
      en: 'omarchy update updates system packages as well as the Omarchy configuration itself.',
    },
    difficulty: 1,
  },
  {
    id: 'sys-02',
    world: 'system',
    prompt: {
      fr: 'Quelque chose déconne et tu veux lancer le diagnostic officiel.',
      en: "Something's broken and you want to run the official diagnostic.",
    },
    answer: 'omarchy debug',
    distractors: ['omarchy doctor', 'omarchy diagnose', 'omarchy check'],
    explanation: {
      fr: 'omarchy debug collecte les infos système utiles pour comprendre un bug ou demander de l’aide.',
      en: 'omarchy debug collects useful system info to understand a bug or ask for help.',
    },
    difficulty: 1,
  },
  {
    id: 'sys-03',
    world: 'system',
    prompt: {
      fr: 'Tu veux verrouiller ta session immédiatement avant de partir chercher un café.',
      en: 'You want to lock your session right away before grabbing a coffee.',
    },
    answer: 'Super + Ctrl + L',
    distractors: ['Super + L', 'Ctrl + Alt + L', 'Super + Shift + L'],
    explanation: {
      fr: 'Super + Ctrl + L verrouille l’écran instantanément via hyprlock (Super + L, lui, bascule juste la disposition du workspace).',
      en: 'Super + Ctrl + L instantly locks the screen via hyprlock (Super + L alone just toggles the workspace layout).',
    },
    difficulty: 1,
  },
  {
    id: 'sys-04',
    world: 'system',
    prompt: {
      fr: 'Tu veux ouvrir le menu de sortie (déconnexion, extinction, redémarrage).',
      en: 'You want to open the power menu (logout, shutdown, restart).',
    },
    answer: 'Super + Escape',
    distractors: ['Super + Shift + Escape', 'Ctrl + Alt + Delete', 'Super + Power'],
    explanation: {
      fr: 'Super + Échap ouvre le menu système avec les options d’extinction/redémarrage/déconnexion.',
      en: 'Super + Escape opens the system menu with shutdown/restart/logout options.',
    },
    difficulty: 1,
  },
  {
    id: 'sys-05',
    world: 'system',
    prompt: {
      fr: 'Tu veux savoir si une mise à jour Omarchy est disponible, sans encore l’installer.',
      en: 'You want to check whether an Omarchy update is available, without installing it yet.',
    },
    answer: 'omarchy update available',
    distractors: ['omarchy update check', 'omarchy update --dry-run', 'omarchy check update'],
    explanation: {
      fr: 'omarchy update available vérifie s’il existe une mise à jour, sans rien installer.',
      en: 'omarchy update available checks whether an update exists, without installing anything.',
    },
    difficulty: 2,
  },
  {
    id: 'sys-06',
    world: 'system',
    prompt: {
      fr: 'Tu veux réinstaller uniquement la configuration Hyprland sans toucher au reste.',
      en: 'You want to reinstall just the Hyprland config without touching anything else.',
    },
    answer: 'omarchy refresh hyprland',
    distractors: ['omarchy reinstall hyprland', 'omarchy config reset hyprland', 'omarchy hyprland restore'],
    explanation: {
      fr: 'omarchy refresh <composant> restaure la config par défaut d’un composant précis.',
      en: "omarchy refresh <component> restores a specific component's default config.",
    },
    difficulty: 3,
  },
  {
    id: 'sys-07',
    world: 'system',
    prompt: {
      fr: 'Tu veux voir la version actuelle d’Omarchy installée.',
      en: 'You want to see the currently installed Omarchy version.',
    },
    answer: 'omarchy version',
    distractors: ['omarchy --version', 'omarchy info', 'omarchy -v'],
    explanation: {
      fr: 'omarchy version affiche le numéro de version de la distribution installée.',
      en: "omarchy version shows the installed distro's version number.",
    },
    difficulty: 1,
  },

  // ───────────────────────── NETWORK / BLUETOOTH ─────────────────────────
  {
    id: 'net-01',
    world: 'network',
    prompt: {
      fr: 'Un pote chez toi veut le mot de passe du Wi-Fi, tu veux l’afficher direct dans le terminal.',
      en: 'A friend at your place wants the Wi-Fi password, and you want to display it right in the terminal.',
    },
    answer: 'omarchy network password <interface>',
    distractors: ['omarchy wifi password <interface>', 'omarchy network show-password', 'iwctl known-networks show'],
    explanation: {
      fr: 'omarchy network password <interface> affiche le mot de passe du réseau Wi-Fi actif.',
      en: 'omarchy network password <interface> prints the active Wi-Fi network’s password.',
    },
    difficulty: 2,
  },
  {
    id: 'net-02',
    world: 'network',
    prompt: {
      fr: 'Tu veux activer le Bluetooth pour appairer un casque.',
      en: 'You want to turn on Bluetooth to pair a headset.',
    },
    answer: 'omarchy bluetooth power on',
    distractors: ['omarchy bluetooth on', 'omarchy-bt-toggle', 'omarchy enable bluetooth'],
    explanation: {
      fr: 'omarchy bluetooth power on active le Bluetooth, et le réglage est mémorisé au redémarrage.',
      en: 'omarchy bluetooth power on turns Bluetooth on, remembered across reboots.',
    },
    difficulty: 2,
  },
  {
    id: 'net-03',
    world: 'network',
    prompt: {
      fr: 'Tu veux voir l’état de ta connexion réseau depuis le terminal, sans passer par la souris.',
      en: 'You want to check your network status from the terminal, without touching the mouse.',
    },
    answer: 'omarchy network status',
    distractors: ['omarchy network info', 'omarchy status network', 'omarchy-network-check'],
    explanation: {
      fr: 'omarchy network status affiche l’état réseau actif, le même qu’en direct dans la barre système.',
      en: 'omarchy network status prints the active network status, the same one shown live in the system bar.',
    },
    difficulty: 1,
  },
  {
    id: 'net-04',
    world: 'network',
    prompt: {
      fr: 'Tu veux te connecter à un réseau Wi-Fi en ligne de commande, sans interface graphique.',
      en: 'You want to connect to a Wi-Fi network from the command line, no GUI.',
    },
    answer: 'iwctl',
    distractors: ['nmcli connect', 'omarchy wifi connect', 'wpa_cli'],
    explanation: {
      fr: 'Omarchy utilise iwd comme gestionnaire réseau ; iwctl est son client interactif en CLI.',
      en: 'Omarchy uses iwd as its network manager; iwctl is its interactive CLI client.',
    },
    difficulty: 3,
  },
  {
    id: 'net-05',
    world: 'network',
    prompt: {
      fr: 'Tu veux passer ton DNS sur Cloudflare depuis le terminal.',
      en: 'You want to switch your DNS to Cloudflare from the terminal.',
    },
    answer: 'omarchy dns Cloudflare',
    distractors: ['omarchy dns set cloudflare', 'omarchy network dns cloudflare', 'omarchy-menu dns cloudflare'],
    explanation: {
      fr: 'omarchy dns Cloudflare configure le résolveur DNS système sur Cloudflare.',
      en: 'omarchy dns Cloudflare sets the system DNS resolver to Cloudflare.',
    },
    difficulty: 2,
  },
  {
    id: 'net-06',
    world: 'network',
    prompt: {
      fr: 'Un appareil Bluetooth déjà appairé refuse de se reconnecter, tu veux l’oublier et recommencer.',
      en: "An already-paired Bluetooth device refuses to reconnect, and you want to forget it and start over.",
    },
    answer: 'omarchy bluetooth device forget <address>',
    distractors: ['omarchy bluetooth forget <address>', 'bluetoothctl unpair <address>', 'omarchy-bt-reset'],
    explanation: {
      fr: 'omarchy bluetooth device forget <adresse> supprime l’appairage pour repartir de zéro proprement.',
      en: 'omarchy bluetooth device forget <address> removes the pairing so you can start fresh.',
    },
    difficulty: 3,
  },

  // ───────────────────────── SCREENSHOTS ─────────────────────────
  {
    id: 'shot-01',
    world: 'screenshots',
    prompt: {
      fr: 'L’outil de capture est ouvert (après Impr écran) et une fenêtre est en surbrillance : tu veux la capturer directement.',
      en: 'The capture tool is open (after pressing Print Screen) and a window is highlighted: you want to capture it directly.',
    },
    answer: 'Enter',
    distractors: ['Tab', 'Ctrl + Enter', 'Space'],
    explanation: {
      fr: 'Dans l’outil de capture, Entrée capture directement la fenêtre actuellement en surbrillance.',
      en: 'Inside the capture tool, Enter directly captures whichever window is currently highlighted.',
    },
    difficulty: 1,
  },
  {
    id: 'shot-02',
    world: 'screenshots',
    prompt: {
      fr: 'Tu veux lancer l’outil de capture d’écran en une seule touche, sans passer par un menu.',
      en: 'You want to launch the screenshot tool with a single key, without going through a menu.',
    },
    answer: 'Print Screen',
    distractors: ['Super + Print Screen', 'Super + Shift + Print Screen', 'Ctrl + Print Screen'],
    explanation: {
      fr: 'La touche Impr écran ouvre l’outil de capture interactif : zone, fenêtre ou écran entier selon ce que tu choisis ensuite.',
      en: 'The Print Screen key opens the interactive capture tool: area, window, or full screen depending on what you pick next.',
    },
    difficulty: 1,
  },
  {
    id: 'shot-03',
    world: 'screenshots',
    prompt: {
      fr: 'Depuis l’outil de capture, tu veux capturer l’écran entier plutôt qu’une zone ou une fenêtre.',
      en: 'From the capture tool, you want to capture the entire screen instead of an area or a window.',
    },
    answer: 'Ctrl + Enter',
    distractors: ['Enter', 'Tab', 'Ctrl + Tab'],
    explanation: {
      fr: 'Ctrl + Entrée, depuis l’outil de capture, capture l’écran entier.',
      en: 'Ctrl + Enter, from the capture tool, captures the entire screen.',
    },
    difficulty: 2,
  },
  {
    id: 'shot-04',
    world: 'screenshots',
    prompt: {
      fr: 'Tu veux lancer un enregistrement vidéo d’une zone de l’écran.',
      en: 'You want to start a video recording of an area of the screen.',
    },
    answer: 'omarchy capture screenrecording',
    distractors: ['omarchy record', 'omarchy-capture video', 'omarchy screencast'],
    explanation: {
      fr: 'omarchy capture screenrecording démarre (ou arrête) un enregistrement d’écran.',
      en: 'omarchy capture screenrecording starts (or stops) a screen recording.',
    },
    difficulty: 2,
  },
  {
    id: 'shot-05',
    world: 'screenshots',
    prompt: {
      fr: 'Tu viens de faire une capture, tu veux savoir où le fichier a été enregistré.',
      en: 'You just took a screenshot and want to know where the file was saved.',
    },
    answer: '~/Pictures',
    distractors: ['~/Pictures/Screenshots', '~/Downloads', '~/Desktop'],
    explanation: {
      fr: 'Par défaut, Omarchy range les captures dans ~/Pictures (personnalisable via OMARCHY_SCREENSHOT_DIR).',
      en: 'By default, Omarchy stores screenshots in ~/Pictures (customizable via OMARCHY_SCREENSHOT_DIR).',
    },
    difficulty: 2,
  },
  {
    id: 'shot-06',
    world: 'screenshots',
    prompt: {
      fr: 'Tu veux qu’une capture de zone soit copiée directement dans le presse-papier, sans créer de fichier.',
      en: 'You want an area capture copied straight to the clipboard, without creating a file.',
    },
    answer: 'omarchy capture screenshot region copy',
    distractors: ['omarchy capture screenshot region save', 'omarchy screenshot copy', 'omarchy capture clipboard region'],
    explanation: {
      fr: 'Le mode "copy" envoie l’image au presse-papier sans écrire de fichier sur le disque.',
      en: 'The "copy" processing mode sends the image straight to the clipboard without writing a file to disk.',
    },
    difficulty: 3,
  },
];

export function commandsByWorld(world: World): Command[] {
  return commands.filter((c) => c.world === world);
}

// A command is "buildable" if its answer has at least 2 words: it can then
// be split into clickable chunks to reassemble in order.
export function buildableCommands(): Command[] {
  return commands.filter((c) => c.answer.trim().split(/\s+/).length >= 2);
}

export function splitIntoChunks(answer: string): string[] {
  return answer.trim().split(/\s+/);
}
