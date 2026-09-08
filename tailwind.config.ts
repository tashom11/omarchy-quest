import type { Config } from 'tailwindcss';

// Terminal-inspired palette matching the Hyprland/Omarchy aesthetic: a very
// dark background with neon accents.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0d1117',
        panel: '#161b22',
        panelLight: '#21262d',
        border: '#30363d',
        accent: '#7ee787',
        accentSecondary: '#79c0ff',
        danger: '#ff7b72',
        warning: '#f2cc60',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        pulseSuccess: {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(126,231,135,0.6)' },
          '50%': { transform: 'scale(1.03)', boxShadow: '0 0 24px rgba(126,231,135,0.5)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(126,231,135,0)' },
        },
        blinkCursor: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        pulseSuccess: 'pulseSuccess 0.5s ease-in-out',
        cursor: 'blinkCursor 1s step-end infinite',
      },
    },
  },
  plugins: [],
};

export default config;
