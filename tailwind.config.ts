import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#ece4d3',   // warm screentone paper — app chrome background
        panel: '#f7f2e6',   // card/panel surface, slightly lighter than paper
        ink: '#1c1712',     // near-black warm ink — primary text
        line: '#d9cfb4',    // hairline borders
        spine: '#c31f26',   // manga spine red — primary accent
        'spine-dim': '#8f1318',
        gold: '#a9822f',    // secondary accent for ratings/badges
        reader: {
          bg: '#121212',
          panel: '#1c1c1c',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        sm: '3px',
      },
    },
  },
  plugins: [],
};

export default config;
