import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        strava: '#fc4c02',
        'tp-blue': '#0066cc',
        'dark-bg': '#0a0a0a',
        'dark-card': '#1a1a1a',
      },
      backgroundColor: {
        dark: '#0a0a0a',
        'dark-secondary': '#1a1a1a',
      },
    },
  },
  plugins: [],
};

export default config;
